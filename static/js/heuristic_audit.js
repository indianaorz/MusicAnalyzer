const state = {
    snapshot: null,
    items: [],
    selectedPath: null,
    selectedPatternId: null,
};

const sourceList = document.getElementById('source-list');
const sourceFilter = document.getElementById('source-filter');
const snapshotMeta = document.getElementById('snapshot-meta');
const detailTitle = document.getElementById('detail-title');
const detailTag = document.getElementById('detail-tag');
const detailMeta = document.getElementById('detail-meta');
const structureTag = document.getElementById('structure-tag');
const structureMeta = document.getElementById('structure-meta');
const structureSummary = document.getElementById('structure-summary');
const patternBrowserMeta = document.getElementById('pattern-browser-meta');
const patternList = document.getElementById('pattern-list');
const patternDetail = document.getElementById('pattern-detail');
const collectionBrowserMeta = document.getElementById('collection-browser-meta');
const collectionDetail = document.getElementById('collection-detail');
const detailSummary = document.getElementById('detail-summary');
const detailRaw = document.getElementById('detail-raw');
const refreshButton = document.getElementById('refresh-export');

function formatCount(value) {
    return Number.isFinite(Number(value)) ? Number(value).toLocaleString() : '0';
}

function formatRange(range) {
    if (!range || typeof range !== 'object') {
        return 'no range';
    }

    const parts = [];
    if (range.start !== undefined || range.end !== undefined) {
        parts.push(`ticks ${range.start ?? '?'}..${range.end ?? '?'}`);
    }
    if (range.low !== undefined || range.high !== undefined) {
        parts.push(`pitches ${range.low ?? '?'}..${range.high ?? '?'}`);
    }
    return parts.length ? parts.join(', ') : 'range present';
}

function clearNode(node, fallbackText = '') {
    node.innerHTML = '';
    if (fallbackText) {
        node.textContent = fallbackText;
    }
}

function renderCountList(elementId, counts, fallbackText) {
    const element = document.getElementById(elementId);
    clearNode(element);

    const entries = Object.entries(counts || {});
    if (!entries.length) {
        const empty = document.createElement('li');
        empty.className = 'empty-state';
        empty.textContent = fallbackText;
        element.appendChild(empty);
        return;
    }

    entries.forEach(([label, count]) => {
        const item = document.createElement('li');
        const labelNode = document.createElement('span');
        labelNode.textContent = label;
        const countNode = document.createElement('span');
        countNode.textContent = formatCount(count);
        item.appendChild(labelNode);
        item.appendChild(countNode);
        element.appendChild(item);
    });
}

function renderLabelVariants(groups) {
    const container = document.getElementById('label-variants');
    clearNode(container);

    if (!Array.isArray(groups) || !groups.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = 'No label variants detected in the current export.';
        container.appendChild(empty);
        return;
    }

    groups.forEach(group => {
        const article = document.createElement('article');
        article.className = 'pill';

        const title = document.createElement('strong');
        title.textContent = group.normalized || 'unlabeled';
        article.appendChild(title);

        const variants = document.createElement('span');
        variants.textContent = Array.isArray(group.variants) ? group.variants.join(', ') : '';
        article.appendChild(variants);

        container.appendChild(article);
    });
}

function renderIssues(issues) {
    const issueList = document.getElementById('issue-list');
    clearNode(issueList);

    if (!Array.isArray(issues) || !issues.length) {
        const empty = document.createElement('li');
        empty.className = 'empty-state';
        empty.textContent = 'No export warnings were produced.';
        issueList.appendChild(empty);
        return;
    }

    issues.forEach(issue => {
        const item = document.createElement('li');
        const left = document.createElement('span');
        left.textContent = `${issue.kind || 'issue'}: ${issue.path || 'unknown path'}`;
        const right = document.createElement('span');
        right.textContent = issue.message || '';
        item.appendChild(left);
        item.appendChild(right);
        issueList.appendChild(item);
    });
}

function buildPatternGraph(exportPayload) {
    const patterns = Array.isArray(exportPayload?.patterns)
        ? exportPayload.patterns.filter(pattern => pattern && typeof pattern === 'object')
        : [];

    const byId = new Map();
    const childrenById = new Map();

    patterns.forEach(pattern => {
        byId.set(pattern.id, pattern);
        childrenById.set(pattern.id, []);
    });

    patterns.forEach(pattern => {
        const parentId = pattern.parentId;
        if (typeof parentId === 'string' && childrenById.has(parentId)) {
            childrenById.get(parentId).push(pattern.id);
        }
    });

    const roots = patterns
        .filter(pattern => !pattern.parentId || !byId.has(pattern.parentId))
        .sort((left, right) => (left.name || left.id).localeCompare(right.name || right.id));

    const flattened = [];
    const seen = new Set();

    function walk(patternId, depth) {
        if (!byId.has(patternId) || seen.has(patternId)) {
            return;
        }
        seen.add(patternId);
        const pattern = byId.get(patternId);
        flattened.push({ patternId, depth, pattern });

        const children = (childrenById.get(patternId) || []).slice().sort((leftId, rightId) => {
            const leftName = byId.get(leftId)?.name || leftId;
            const rightName = byId.get(rightId)?.name || rightId;
            return leftName.localeCompare(rightName);
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

function buildLineage(pattern, graph) {
    const lineage = [];
    const seen = new Set();
    let current = pattern;

    while (current && !seen.has(current.id)) {
        seen.add(current.id);
        lineage.push({ id: current.id, name: current.name || current.id });
        current = current.parentId ? graph.byId.get(current.parentId) : null;
    }

    return lineage.reverse();
}

function buildStructureStats(exportPayload, graph, summary) {
    const globalContext = exportPayload?.globalContext || {};
    const modeBits = [globalContext.root, globalContext.scale].filter(Boolean).join(' ');

    return [
        { label: 'Song', value: exportPayload?.title || 'Untitled' },
        { label: 'Source', value: exportPayload?.source?.path || 'unknown' },
        { label: 'Patterns', value: formatCount(summary?.patternCount ?? graph.patterns.length) },
        { label: 'Relationships', value: formatCount(summary?.relationshipCount ?? 0) },
        { label: 'Collections', value: formatCount(summary?.collectionCount ?? 0) },
        { label: 'Root Patterns', value: formatCount(summary?.rootPatternCount ?? graph.roots.length) },
        { label: 'Leaf Patterns', value: formatCount(summary?.leafPatternCount ?? 0) },
        { label: 'Global Context', value: modeBits || 'none' },
        { label: 'BPM', value: globalContext.bpm ?? 'unknown' },
        { label: 'Issues', value: formatCount(summary?.issueCount ?? 0) },
    ];
}

function renderStructureSummary(exportPayload, graph, summary) {
    clearNode(structureSummary);

    const stats = buildStructureStats(exportPayload, graph, summary);
    stats.forEach(stat => {
        const card = document.createElement('article');
        card.className = 'mini-stat';

        const label = document.createElement('span');
        label.textContent = stat.label;
        const value = document.createElement('strong');
        value.textContent = String(stat.value);

        card.appendChild(label);
        card.appendChild(value);
        structureSummary.appendChild(card);
    });
}

function renderPatternDetail(graph) {
    if (!graph || !state.selectedPatternId || !graph.byId.has(state.selectedPatternId)) {
        patternDetail.textContent = 'Select a pattern to inspect its exported structure and lineage.';
        return;
    }

    const pattern = graph.byId.get(state.selectedPatternId);
    const parent = pattern.parentId ? graph.byId.get(pattern.parentId) : null;
    const children = (Array.isArray(pattern.children) ? pattern.children : [])
        .map(childId => graph.byId.get(childId))
        .filter(Boolean)
        .map(child => ({ id: child.id, name: child.name || child.id }));
    const siblings = graph.patterns
        .filter(candidate => candidate.parentId === pattern.parentId && candidate.id !== pattern.id)
        .map(candidate => ({ id: candidate.id, name: candidate.name || candidate.id }));

    const variantOf = pattern.variantOf
        ? (graph.byId.get(pattern.variantOf)
            ? {
                id: graph.byId.get(pattern.variantOf).id,
                name: graph.byId.get(pattern.variantOf).name || graph.byId.get(pattern.variantOf).id,
            }
            : {
                id: pattern.variantOf,
                name: pattern.variantOfName || pattern.variantOf,
            })
        : null;

    const detail = {
        id: pattern.id,
        name: pattern.name,
        normalizedName: pattern.normalizedName,
        depth: pattern.depth,
        relationTags: pattern.relationTags || [],
        lineage: buildLineage(pattern, graph),
        parent: parent ? { id: parent.id, name: parent.name || parent.id } : null,
        children,
        siblings,
        variantOf,
        range: pattern.range || null,
        instruments: pattern.instruments || [],
        instrumentCount: pattern.instrumentCount ?? 0,
        mode: pattern.mode || null,
        flags: pattern.flags || {},
        sourceRef: pattern.sourceRef || null,
        raw: pattern.raw || null,
    };

    patternDetail.textContent = JSON.stringify(detail, null, 2);
}

function renderCollectionDetail(exportPayload) {
    const collections = Array.isArray(exportPayload?.collectionCandidates)
        ? exportPayload.collectionCandidates
        : [];

    if (!collections.length) {
        collectionBrowserMeta.textContent = 'No collection candidates were exported for this song.';
        collectionDetail.textContent = 'No collection candidates were exported for this song.';
        return;
    }

    const selectedPatternId = state.selectedPatternId;
    const relatedCollections = selectedPatternId
        ? collections.filter(collection =>
            collection.sourcePatternId === selectedPatternId ||
            collection.parentPatternId === selectedPatternId ||
            (Array.isArray(collection.memberPatternIds) && collection.memberPatternIds.includes(selectedPatternId)))
        : [];

    const visibleCollections = relatedCollections.length ? relatedCollections : collections.slice(0, 12);
    collectionBrowserMeta.textContent = `${collections.length} collection candidates exported. Showing ${visibleCollections.length}${relatedCollections.length ? ' related to the selected pattern' : ''}.`;

    const detail = {
        selectedPatternId: selectedPatternId || null,
        visibleCollections,
    };

    collectionDetail.textContent = JSON.stringify(detail, null, 2);
}

function renderPatternList(graph, exportPayload) {
    clearNode(patternList);

    if (!graph || !graph.patterns.length) {
        patternBrowserMeta.textContent = 'No exported patterns loaded.';
        const empty = document.createElement('li');
        empty.className = 'empty-state';
        empty.textContent = 'This export does not contain any patterns.';
        patternList.appendChild(empty);
        renderCollectionDetail(exportPayload);
        renderPatternDetail(graph);
        return;
    }

    patternBrowserMeta.textContent = `${graph.patterns.length} exported patterns loaded from the dedicated heuristic export.`;

    graph.flattened.forEach(entry => {
        const item = document.createElement('li');
        item.className = 'pattern-item';
        if (entry.patternId === state.selectedPatternId) {
            item.classList.add('active');
        }
        item.style.marginLeft = `${entry.depth * 18}px`;

        const titleRow = document.createElement('div');
        titleRow.className = 'pattern-item-title';
        const dot = document.createElement('span');
        dot.className = 'pattern-depth';
        dot.style.opacity = `${Math.max(0.35, 1 - entry.depth * 0.08)}`;
        const title = document.createElement('span');
        title.textContent = entry.pattern.name || entry.pattern.id;
        titleRow.appendChild(dot);
        titleRow.appendChild(title);

        const metaRow = document.createElement('div');
        metaRow.className = 'pattern-item-meta';
        const range = document.createElement('span');
        range.textContent = formatRange(entry.pattern.range);
        metaRow.appendChild(range);

        (entry.pattern.relationTags || []).forEach(tag => {
            const badge = document.createElement('span');
            badge.textContent = tag;
            metaRow.appendChild(badge);
        });

        item.appendChild(titleRow);
        item.appendChild(metaRow);
        item.addEventListener('click', () => {
            state.selectedPatternId = entry.patternId;
            renderPatternList(graph, exportPayload);
            renderPatternDetail(graph);
            renderCollectionDetail(exportPayload);
        });

        patternList.appendChild(item);
    });
}

function setSummaryCards(snapshot) {
    document.getElementById('song-count').textContent = formatCount(snapshot?.summaryCards?.songCount ?? 0);
    document.getElementById('export-pattern-count').textContent = formatCount(snapshot?.summaryCards?.patternCount ?? 0);
    document.getElementById('relationship-count').textContent = formatCount(snapshot?.summaryCards?.relationshipCount ?? 0);
    document.getElementById('collection-count').textContent = formatCount(snapshot?.summaryCards?.collectionCount ?? 0);
}

function renderSourceList() {
    clearNode(sourceList);

    const query = sourceFilter.value.trim().toLowerCase();
    const items = state.items.filter(item => {
        if (!query) {
            return true;
        }

        const haystack = [
            item.label,
            item.songId,
            item.path,
            item.sourcePath,
        ].join(' ').toLowerCase();

        return haystack.includes(query);
    });

    if (!items.length) {
        const empty = document.createElement('li');
        empty.className = 'empty-state';
        empty.textContent = 'No exported songs match the current filter.';
        sourceList.appendChild(empty);
        return;
    }

    items.forEach(item => {
        const entry = document.createElement('li');
        entry.className = 'source-item';
        if (item.path === state.selectedPath) {
            entry.classList.add('active');
        }

        const title = document.createElement('h3');
        title.textContent = item.label || item.songId || item.path;
        entry.appendChild(title);

        const subtitle = document.createElement('p');
        subtitle.textContent = `${item.path} <- ${item.sourcePath || 'user_settings'}`;
        entry.appendChild(subtitle);

        const meta = document.createElement('div');
        meta.className = 'source-meta';
        [
            `${formatCount(item.patternCount)} patterns`,
            `${formatCount(item.relationshipCount)} relationships`,
            `${formatCount(item.collectionCount)} collections`,
        ].forEach(text => {
            const badge = document.createElement('span');
            badge.textContent = text;
            meta.appendChild(badge);
        });
        entry.appendChild(meta);

        entry.addEventListener('click', () => {
            loadDetail(item);
        });

        sourceList.appendChild(entry);
    });
}

function renderEmptyDetail(message) {
    detailTitle.textContent = 'Select an exported song';
    detailTag.textContent = 'No export selected';
    detailMeta.textContent = message;
    structureTag.textContent = 'No structure selected';
    structureMeta.textContent = 'This panel reflects the dedicated heuristic export once a song is selected.';
    clearNode(structureSummary);
    patternBrowserMeta.textContent = 'No exported pattern graph loaded.';
    clearNode(patternList);
    patternDetail.textContent = 'Select a pattern to inspect its exported structure and lineage.';
    collectionBrowserMeta.textContent = 'No exported collections loaded.';
    collectionDetail.textContent = 'Collection candidates will appear here once an export is selected.';
    detailSummary.textContent = 'Awaiting selection.';
    detailRaw.textContent = 'Awaiting selection.';
}

function renderExportDetail(item, payload) {
    const exportPayload = payload?.rawPayload || {};
    const graph = buildPatternGraph(exportPayload);

    const defaultPatternId = graph.byId.has(state.selectedPatternId)
        ? state.selectedPatternId
        : (graph.byId.has('root') ? 'root' : (graph.flattened[0]?.patternId || null));
    state.selectedPatternId = defaultPatternId;

    detailTitle.textContent = exportPayload.title || item.label || item.songId || 'Untitled';
    detailTag.textContent = 'heuristic export';
    detailMeta.textContent = `${item.path} from ${exportPayload?.source?.path || item.sourcePath || 'user_settings'}`;

    structureTag.textContent = 'dedicated structural export';
    structureMeta.textContent = 'This export is the raw structural corpus for the heuristic North Star. It preserves standalone patterns, parent-child containment, collection candidates, repetitions, variations, and provenance.';

    detailSummary.textContent = JSON.stringify(payload.summary || {}, null, 2);
    detailRaw.textContent = JSON.stringify(exportPayload, null, 2);

    renderStructureSummary(exportPayload, graph, payload.summary || {});
    renderPatternList(graph, exportPayload);
    renderPatternDetail(graph);
    renderCollectionDetail(exportPayload);
}

async function loadDetail(item) {
    state.selectedPath = item.path;
    renderSourceList();

    detailTitle.textContent = item.label || item.songId || item.path;
    detailTag.textContent = 'heuristic export';
    detailMeta.textContent = `Loading ${item.path}...`;
    detailSummary.textContent = 'Loading export summary...';
    detailRaw.textContent = 'Loading export JSON...';

    try {
        const params = new URLSearchParams({ path: item.path });
        const response = await fetch(`/api/heuristic-export/source?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`detail request failed with ${response.status}`);
        }

        const payload = await response.json();
        renderExportDetail(item, payload);
    } catch (error) {
        detailMeta.textContent = `Failed to load ${item.path}.`;
        detailSummary.textContent = String(error);
        detailRaw.textContent = '';
        structureTag.textContent = 'Load failed';
        structureMeta.textContent = 'The dedicated export could not be loaded.';
        clearNode(structureSummary);
        patternBrowserMeta.textContent = 'No exported pattern graph loaded.';
        clearNode(patternList);
        patternDetail.textContent = 'Failed to load pattern detail.';
        collectionBrowserMeta.textContent = 'No exported collections loaded.';
        collectionDetail.textContent = 'Failed to load collection detail.';
    }
}

async function loadSnapshot() {
    snapshotMeta.textContent = 'Rebuilding heuristic export...';
    refreshButton.disabled = true;

    try {
        const response = await fetch('/api/heuristic-export');
        if (!response.ok) {
            throw new Error(`snapshot request failed with ${response.status}`);
        }

        const snapshot = await response.json();
        state.snapshot = snapshot;
        state.items = Array.isArray(snapshot.items) ? snapshot.items : [];

        setSummaryCards(snapshot);
        renderCountList('relationship-types', snapshot.relationshipTypeCounts, 'No relationship types were exported.');
        renderCountList('collection-types', snapshot.collectionTypeCounts, 'No collection types were exported.');
        renderLabelVariants(snapshot.labelVariantGroups);
        renderIssues(snapshot.issues);

        snapshotMeta.textContent = `Export generated ${snapshot.generatedAt} at ${snapshot.exportPath}`;
        renderSourceList();

        if (!state.items.length) {
            renderEmptyDetail('No heuristic exports were generated.');
            return;
        }

        const selectedItem = state.items.find(item => item.path === state.selectedPath) || state.items[0];
        await loadDetail(selectedItem);
    } catch (error) {
        snapshotMeta.textContent = `Failed to rebuild heuristic export. ${String(error)}`;
        sourceList.innerHTML = '<li class="empty-state">Heuristic export data is unavailable.</li>';
        renderEmptyDetail('Heuristic export data is unavailable.');
    } finally {
        refreshButton.disabled = false;
    }
}

sourceFilter.addEventListener('input', renderSourceList);
refreshButton.addEventListener('click', () => {
    loadSnapshot();
});

renderEmptyDetail('Choose an exported song to inspect the dedicated heuristic structure export.');
loadSnapshot();
