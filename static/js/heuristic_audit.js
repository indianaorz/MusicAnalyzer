const state = {
    snapshot: null,
    items: [],
    selectedKey: null,
    selectedPatternId: null,
};

const sourceList = document.getElementById('source-list');
const sourceFilter = document.getElementById('source-filter');
const kindFilter = document.getElementById('kind-filter');
const snapshotMeta = document.getElementById('snapshot-meta');
const detailTitle = document.getElementById('detail-title');
const detailTag = document.getElementById('detail-tag');
const detailMeta = document.getElementById('detail-meta');
const detailSummary = document.getElementById('detail-summary');
const detailRaw = document.getElementById('detail-raw');
const viewerMeta = document.getElementById('viewer-meta');
const viewerTag = document.getElementById('viewer-tag');
const viewerPlaceholder = document.getElementById('viewer-placeholder');
const loadingIndicator = document.getElementById('loading-indicator');
const analysisContentNode = document.getElementById('analysis-content');
const structureTag = document.getElementById('structure-tag');
const structureMeta = document.getElementById('structure-meta');
const structureSummary = document.getElementById('structure-summary');
const patternDetail = document.getElementById('pattern-detail');
const patternList = document.getElementById('pattern-list');
const patternBrowserMeta = document.getElementById('pattern-browser-meta');

function formatRange(range) {
    if (!range || typeof range !== 'object') {
        return 'No range';
    }
    const start = range.start ?? '?';
    const end = range.end ?? '?';
    const low = range.low ?? '?';
    const high = range.high ?? '?';
    return `ticks ${start}..${end}, pitches ${low}..${high}`;
}

function buildPatternGraph(rawPayload) {
    const patterns = Array.isArray(rawPayload?.patterns) ? rawPayload.patterns.filter(pattern => pattern && typeof pattern === 'object') : [];
    const byId = new Map(patterns.map(pattern => [pattern.id, pattern]));
    const childrenById = new Map();

    patterns.forEach(pattern => {
        childrenById.set(pattern.id, []);
    });

    patterns.forEach(pattern => {
        if (pattern.parentId && childrenById.has(pattern.parentId)) {
            childrenById.get(pattern.parentId).push(pattern.id);
        }
    });

    const roots = patterns.filter(pattern => !pattern.parentId || !byId.has(pattern.parentId));
    const flattened = [];
    const seen = new Set();

    function walk(patternId, depth) {
        if (seen.has(patternId) || !byId.has(patternId)) {
            return;
        }
        seen.add(patternId);
        const pattern = byId.get(patternId);
        flattened.push({ patternId, depth, pattern });
        const children = (childrenById.get(patternId) || []).slice().sort((a, b) => {
            const pa = byId.get(a)?.name || '';
            const pb = byId.get(b)?.name || '';
            return pa.localeCompare(pb);
        });
        children.forEach(childId => walk(childId, depth + 1));
    }

    roots.forEach(root => walk(root.id, 0));
    patterns.forEach(pattern => {
        if (!seen.has(pattern.id)) {
            walk(pattern.id, 0);
        }
    });

    return { patterns, byId, childrenById, roots, flattened };
}

function relationTagsForPattern(pattern) {
    const tags = [];
    if (pattern.isVariation) tags.push('variation');
    if (pattern.isRhythmicVariation) tags.push('rhythmic variation');
    if (pattern.isRepetition) tags.push('repetition');
    if (Array.isArray(pattern.children) && pattern.children.length) tags.push('has children');
    if (!tags.length) tags.push('canonical / untyped');
    return tags;
}

function renderStructureSummary(rawPayload, summary, graph) {
    structureSummary.innerHTML = '';

    if (!graph) {
        structureSummary.innerHTML = '<p class="empty-state">This source is a derived dataset export. Structural graph inspection is primarily for raw `user_settings` pattern graphs.</p>';
        return;
    }

    const leafCount = graph.patterns.filter(pattern => !Array.isArray(pattern.children) || pattern.children.length === 0).length;
    const stats = [
        { label: 'Song', value: rawPayload.title || 'Untitled' },
        { label: 'Patterns', value: graph.patterns.length },
        { label: 'Roots', value: graph.roots.length },
        { label: 'Leaves', value: leafCount },
        { label: 'Variations', value: summary.relationshipTypeCounts?.variation || 0 },
        { label: 'Repetitions', value: summary.relationshipTypeCounts?.repetition || 0 },
    ];

    stats.forEach(stat => {
        const card = document.createElement('article');
        card.className = 'mini-stat';
        card.innerHTML = `<span>${stat.label}</span><strong>${stat.value}</strong>`;
        structureSummary.appendChild(card);
    });
}

function renderPatternDetail(graph) {
    if (!graph || !state.selectedPatternId || !graph.byId.has(state.selectedPatternId)) {
        patternDetail.textContent = 'Select a pattern to inspect its containment path, lineage, and raw fields.';
        return;
    }

    const pattern = graph.byId.get(state.selectedPatternId);
    const parent = pattern.parentId ? graph.byId.get(pattern.parentId) : null;
    const childIds = Array.isArray(pattern.children) ? pattern.children : [];
    const children = childIds.map(id => graph.byId.get(id)).filter(Boolean);
    const siblings = graph.patterns.filter(candidate => candidate.parentId === pattern.parentId && candidate.id !== pattern.id);
    const variantParent = pattern.variantOf ? graph.byId.get(pattern.variantOf) : null;

    const payload = {
        id: pattern.id,
        name: pattern.name,
        relationTags: relationTagsForPattern(pattern),
        parent: parent ? { id: parent.id, name: parent.name } : null,
        variantOf: variantParent ? { id: variantParent.id, name: variantParent.name } : (pattern.variantOf ? { id: pattern.variantOf, name: pattern.variantOfName } : null),
        children: children.map(child => ({ id: child.id, name: child.name })),
        siblings: siblings.map(sibling => ({ id: sibling.id, name: sibling.name })),
        instruments: pattern.instruments || [],
        range: pattern.range || null,
        mode: pattern.mode || null,
        rawFlags: {
            isVariation: Boolean(pattern.isVariation),
            isRhythmicVariation: Boolean(pattern.isRhythmicVariation),
            isRepetition: Boolean(pattern.isRepetition),
            isSimplification: Boolean(pattern.isSimplification),
        },
        raw: pattern,
    };

    patternDetail.textContent = JSON.stringify(payload, null, 2);
}

function renderPatternList(graph) {
    patternList.innerHTML = '';

    if (!graph) {
        patternBrowserMeta.textContent = 'No raw pattern graph is available for this source.';
        patternList.innerHTML = '<li class="empty-state">Dataset exports are derived artifacts. Select a raw settings source to inspect containment and lineage.</li>';
        return;
    }

    patternBrowserMeta.textContent = `${graph.patterns.length} patterns loaded from the raw authored graph.`;

    graph.flattened.forEach(entry => {
        const { pattern, depth, patternId } = entry;
        const li = document.createElement('li');
        li.className = 'pattern-item';
        if (state.selectedPatternId === patternId) {
            li.classList.add('active');
        }

        const relationBits = relationTagsForPattern(pattern).map(tag => `<span>${tag}</span>`).join('');
        li.style.marginLeft = `${depth * 18}px`;
        li.innerHTML = `
            <div class="pattern-item-title">
                <span class="pattern-depth" style="opacity:${Math.max(0.35, 1 - depth * 0.08)}"></span>
                <span>${pattern.name || pattern.id}</span>
            </div>
            <div class="pattern-item-meta">
                <span>${formatRange(pattern.range)}</span>
                ${relationBits}
            </div>
        `;
        li.addEventListener('click', () => {
            state.selectedPatternId = patternId;
            renderPatternList(graph);
            renderPatternDetail(graph);
        });
        patternList.appendChild(li);
    });
}

function renderStructureForPayload(item, payload) {
    const summary = payload.summary || {};
    const rawPayload = payload.rawPayload || {};

    if (item.kind !== 'settings') {
        structureTag.textContent = 'Derived export';
        structureMeta.textContent = 'This source is a derived dataset export. It can help validate artifacts, but it is not the primary structure model for this phase.';
        state.selectedPatternId = null;
        renderStructureSummary(rawPayload, summary, null);
        renderPatternList(null);
        renderPatternDetail(null);
        return;
    }

    const graph = buildPatternGraph(rawPayload);
    const defaultPattern = graph.byId.has('root') ? 'root' : graph.flattened[0]?.patternId || null;
    state.selectedPatternId = graph.byId.has(state.selectedPatternId) ? state.selectedPatternId : defaultPattern;

    structureTag.textContent = 'Raw source graph';
    structureMeta.textContent = `${item.path} is being treated as the primary structural source. Parent-child containment and variation/repetition lineage shown here should drive normalization design.`;
    renderStructureSummary(rawPayload, summary, graph);
    renderPatternList(graph);
    renderPatternDetail(graph);
}

function ensureAbcBlock(text) {
    if (typeof text !== 'string' || !text.trim()) {
        return '';
    }
    const trimmed = text.trim();
    if (trimmed.includes('<abc>')) {
        return trimmed;
    }
    return `<abc>\n${trimmed}\n</abc>`;
}

function clearViewer(message, tag = 'No render source') {
    viewerTag.textContent = tag;
    viewerMeta.textContent = message;
    loadingIndicator.style.display = 'block';
    loadingIndicator.textContent = 'Viewer ready.';
    viewerPlaceholder.style.display = 'block';
    viewerPlaceholder.textContent = message;
    analysisContentNode.style.display = 'none';
    analysisContentNode.innerHTML = '';
    window.analysisContent = '';
}

function buildAnalysisContent(rawPayload) {
    if (!rawPayload || typeof rawPayload !== 'object') {
        return '';
    }

    const blocks = [];
    const inputBlock = ensureAbcBlock(rawPayload.input);
    const outputBlock = ensureAbcBlock(rawPayload.output);

    if (inputBlock) {
        blocks.push(`Input:\n\n${inputBlock}\n`);
    }
    if (outputBlock) {
        blocks.push(`Output:\n\n${outputBlock}\n`);
    }

    return blocks.join('\n');
}

function renderViewerForPayload(item, payload) {
    if (item.kind !== 'dataset') {
        clearViewer('This source is a saved pattern graph. Playback is secondary here and is intentionally demoted until we add direct pattern-to-ABC extraction from raw structure.', 'Settings graph');
        return;
    }

    const abcSource = buildAnalysisContent(payload.rawPayload);
    if (!abcSource) {
        clearViewer('This dataset item does not include ABC input/output blocks, so there is nothing to render yet.', 'Dataset without ABC');
        return;
    }

    viewerTag.textContent = 'Dataset ABC ready';
    viewerMeta.textContent = `${item.path} rendered from stored ABC blocks. Use the per-block play buttons to hear the pattern material.`;
    loadingIndicator.style.display = 'none';
    viewerPlaceholder.style.display = 'none';
    analysisContentNode.style.display = 'block';
    analysisContentNode.innerHTML = '';
    window.analysisContent = abcSource;

    if (typeof processAndRenderAnalysis === 'function') {
        processAndRenderAnalysis();
    } else {
        clearViewer('Viewer scripts are not available. The ABC playback stack did not initialize correctly on this page.', 'Viewer unavailable');
    }
}

function renderCountList(elementId, data, fallbackText) {
    const element = document.getElementById(elementId);
    const entries = Object.entries(data || {});
    element.innerHTML = '';

    if (!entries.length) {
        element.innerHTML = `<li class="empty-state">${fallbackText}</li>`;
        return;
    }

    entries.slice(0, 12).forEach(([label, count]) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${label}</span><span>${count}</span>`;
        element.appendChild(li);
    });
}

function renderLabelVariants(groups) {
    const container = document.getElementById('label-variants');
    container.innerHTML = '';

    if (!groups || !groups.length) {
        container.innerHTML = '<p class="empty-state">No label variants detected in the current sample.</p>';
        return;
    }

    groups.slice(0, 12).forEach(group => {
        const pill = document.createElement('article');
        pill.className = 'pill';
        pill.innerHTML = `
            <strong>${group.normalized}</strong>
            <span>${group.variants.join(', ')}</span>
        `;
        container.appendChild(pill);
    });
}

function renderIssues(issues) {
    const issueList = document.getElementById('issue-list');
    issueList.innerHTML = '';

    if (!issues || !issues.length) {
        issueList.innerHTML = '<li class="empty-state">No malformed files were found in the scanned audit snapshot.</li>';
        return;
    }

    issues.slice(0, 20).forEach(issue => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${issue.kind}: ${issue.path}</span>
            <span>${issue.message}</span>
        `;
        issueList.appendChild(li);
    });
}

function renderSourceList() {
    const query = sourceFilter.value.trim().toLowerCase();
    const selectedKind = kindFilter.value;

    const filtered = state.items.filter(item => {
        if (selectedKind !== 'all' && item.kind !== selectedKind) {
            return false;
        }
        if (!query) {
            return true;
        }
        const haystack = [
            item.label,
            item.path,
            item.song,
            item.category,
            item.function,
        ].join(' ').toLowerCase();
        return haystack.includes(query);
    });

    sourceList.innerHTML = '';

    if (!filtered.length) {
        sourceList.innerHTML = '<li class="empty-state">No sources match the current filter.</li>';
        return;
    }

    filtered.forEach(item => {
        const key = `${item.kind}:${item.path}`;
        const li = document.createElement('li');
        li.className = 'source-item';
        if (state.selectedKey === key) {
            li.classList.add('active');
        }

        const meta = [];
        meta.push(item.kind);
        if (item.category) {
            meta.push(item.category);
        }
        if (item.patternCount) {
            meta.push(`${item.patternCount} patterns`);
        }
        if (item.function) {
            meta.push(item.function);
        }

        li.innerHTML = `
            <h3>${item.label}</h3>
            <p>${item.path}</p>
            <div class="source-meta">${meta.map(value => `<span>${value}</span>`).join('')}</div>
        `;
        li.addEventListener('click', () => loadDetail(item));
        sourceList.appendChild(li);
    });
}

async function loadDetail(item) {
    state.selectedKey = `${item.kind}:${item.path}`;
    renderSourceList();

    detailTitle.textContent = item.label;
    detailTag.textContent = item.kind === 'settings' ? 'raw source' : 'derived export';
    detailMeta.textContent = item.path;
    detailSummary.textContent = 'Loading parsed summary...';
    detailRaw.textContent = 'Loading raw JSON...';

    const params = new URLSearchParams({ kind: item.kind, path: item.path });
    const response = await fetch(`/api/heuristic-audit/source?${params.toString()}`);
    if (!response.ok) {
        detailSummary.textContent = `Failed to load source detail (${response.status}).`;
        detailRaw.textContent = '';
        return;
    }

    const payload = await response.json();
    detailSummary.textContent = JSON.stringify(payload.summary, null, 2);
    detailRaw.textContent = JSON.stringify(payload.rawPayload, null, 2);
    renderStructureForPayload(item, payload);
    renderViewerForPayload(item, payload);
}

async function loadSnapshot() {
    snapshotMeta.textContent = 'Loading audit snapshot...';
    const response = await fetch('/api/heuristic-audit');
    if (!response.ok) {
        snapshotMeta.textContent = `Failed to load audit snapshot (${response.status}).`;
        sourceList.innerHTML = '<li class="empty-state">Audit data is unavailable.</li>';
        return;
    }

    state.snapshot = await response.json();
    state.items = state.snapshot.items || [];

    document.getElementById('settings-count').textContent = state.snapshot.summaryCards.settingsFileCount ?? 0;
    document.getElementById('dataset-count').textContent = state.snapshot.summaryCards.datasetFileCount ?? 0;
    document.getElementById('pattern-count').textContent = state.snapshot.summaryCards.patternCount ?? 0;
    document.getElementById('issue-count').textContent = state.snapshot.summaryCards.issueCount ?? 0;

    renderCountList('relationship-fields', state.snapshot.settings.relationshipFieldCounts, 'No relationship fields detected.');
    renderCountList('relationship-types', state.snapshot.settings.relationshipTypeCounts, 'No relationship tags detected.');
    renderCountList('dataset-categories', state.snapshot.dataset.categoryCounts, 'No dataset categories detected.');
    renderLabelVariants(state.snapshot.settings.labelVariantGroups);
    renderIssues(state.snapshot.issues);

    snapshotMeta.textContent = `Snapshot generated ${state.snapshot.generatedAt} and written to ${state.snapshot.snapshotPath}`;
    renderSourceList();
    clearViewer('Select a dataset export to render its pattern notation and playback controls.');

    const firstPreferred = state.items.find(item => item.kind === 'settings') || state.items.find(item => item.kind === 'dataset');
    if (firstPreferred) {
        loadDetail(firstPreferred);
    }
}

sourceFilter.addEventListener('input', renderSourceList);
kindFilter.addEventListener('change', renderSourceList);

loadSnapshot();
