const state = {
    snapshot: null,
    items: [],
    selectedPath: null,
    selectedPatternId: null,
    selectedExport: null,
    currentGraph: null,
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
const patternOverview = document.getElementById('pattern-overview');
const patternLineage = document.getElementById('pattern-lineage');
const patternConnections = document.getElementById('pattern-connections');
const patternWarnings = document.getElementById('pattern-warnings');
const structureMapMeta = document.getElementById('structure-map-meta');
const structureMap = document.getElementById('structure-map');
const collectionBrowserMeta = document.getElementById('collection-browser-meta');
const collectionDetail = document.getElementById('collection-detail');
const relationshipBrowserMeta = document.getElementById('relationship-browser-meta');
const relationshipDetail = document.getElementById('relationship-detail');
const detailSummary = document.getElementById('detail-summary');
const detailRaw = document.getElementById('detail-raw');
const refreshButton = document.getElementById('refresh-export');

function formatCount(value) {
    return Number.isFinite(Number(value)) ? Number(value).toLocaleString() : '0';
}

function fallbackSongTitle(exportPayload, item) {
    const rawTitle = exportPayload?.title;
    if (typeof rawTitle === 'string' && rawTitle.trim() && !rawTitle.startsWith('<built-in method title of str object at 0x')) {
        return rawTitle.trim();
    }
    if (typeof item?.label === 'string' && item.label.trim()) {
        return item.label.trim();
    }
    if (typeof exportPayload?.source?.path === 'string' && exportPayload.source.path.trim()) {
        return exportPayload.source.path.replace(/\.json$/i, '');
    }
    return item?.songId || 'Untitled';
}

function formatRange(range) {
    if (!range || typeof range !== 'object') {
        return 'No range';
    }

    const parts = [];
    if (range.start !== undefined || range.end !== undefined) {
        parts.push(`ticks ${range.start ?? '?'}..${range.end ?? '?'}`);
    }
    if (range.low !== undefined || range.high !== undefined) {
        parts.push(`pitches ${range.low ?? '?'}..${range.high ?? '?'}`);
    }
    return parts.length ? parts.join(', ') : 'Range present';
}

function createEmptyState(text, tagName = 'p') {
    const element = document.createElement(tagName);
    element.className = 'empty-state';
    element.textContent = text;
    return element;
}

function clearNode(node) {
    node.innerHTML = '';
}

function scrollSelectedPatternIntoView() {
    const selectedItem = patternList.querySelector('.pattern-item.active');
    if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
    }
}

function selectPattern(patternId, options = {}) {
    if (!state.currentGraph || !state.currentGraph.byId.has(patternId)) {
        return;
    }

    state.selectedPatternId = patternId;
    renderStructureMap(state.currentGraph);
    renderPatternList(state.currentGraph, state.selectedExport || {});
    renderPatternInspector(state.currentGraph);
    renderCollectionDetail(state.selectedExport || {}, state.currentGraph);
    renderRelationshipDetail(state.selectedExport || {}, state.currentGraph);

    if (options.scroll !== false) {
        scrollSelectedPatternIntoView();
    }
}

function createJumpButton(label, patternId, options = {}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `jump-button${options.compact ? ' jump-button-compact' : ''}`;
    button.textContent = label;
    button.disabled = !state.currentGraph || !state.currentGraph.byId.has(patternId);

    if (!button.disabled) {
        button.addEventListener('click', () => {
            selectPattern(patternId);
        });
    }

    return button;
}

function appendBadge(container, text, tone = '') {
    const badge = document.createElement('span');
    badge.className = `badge${tone ? ` ${tone}` : ''}`;
    badge.textContent = text;
    container.appendChild(badge);
}

function renderCountList(elementId, counts, fallbackText) {
    const element = document.getElementById(elementId);
    clearNode(element);

    const entries = Object.entries(counts || {});
    if (!entries.length) {
        element.appendChild(createEmptyState(fallbackText, 'li'));
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
        container.appendChild(createEmptyState('No label variants detected in the current export.'));
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
        issueList.appendChild(createEmptyState('No export warnings were produced.', 'li'));
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
    const normalizedCounts = new Map();

    patterns.forEach(pattern => {
        byId.set(pattern.id, pattern);
        childrenById.set(pattern.id, []);
        if (pattern.normalizedName) {
            normalizedCounts.set(pattern.normalizedName, (normalizedCounts.get(pattern.normalizedName) || 0) + 1);
        }
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

    return { patterns, byId, childrenById, roots, flattened, normalizedCounts };
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

function getPatternWarnings(pattern, graph) {
    const warnings = [];

    if (pattern.parentId && !graph.byId.has(pattern.parentId)) {
        warnings.push('Missing parent reference');
    }
    if (pattern.variantOf && !graph.byId.has(pattern.variantOf)) {
        warnings.push('Dangling variant reference');
    }
    if (!pattern.range || typeof pattern.range !== 'object') {
        warnings.push('Missing range');
    }
    if (!Array.isArray(pattern.instruments) || !pattern.instruments.length) {
        warnings.push('No instruments attached');
    }
    if (pattern.normalizedName && (graph.normalizedCounts.get(pattern.normalizedName) || 0) > 1) {
        warnings.push(`Duplicate normalized label: ${pattern.normalizedName}`);
    }

    return warnings;
}

function buildStructureStats(exportPayload, graph, summary, item) {
    const globalContext = exportPayload?.globalContext || {};
    const modeBits = [globalContext.root, globalContext.scale].filter(value => value !== null && value !== undefined && value !== '').join(' ');

    return [
        { label: 'Song', value: fallbackSongTitle(exportPayload, item) },
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

function renderStructureSummary(exportPayload, graph, summary, item) {
    clearNode(structureSummary);

    buildStructureStats(exportPayload, graph, summary, item).forEach(stat => {
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

function renderPropertyGrid(properties) {
    clearNode(patternOverview);

    properties.forEach(property => {
        const card = document.createElement('article');
        card.className = 'property-card';

        const label = document.createElement('span');
        label.className = 'property-label';
        label.textContent = property.label;
        const value = document.createElement('strong');
        value.className = 'property-value';
        value.textContent = property.value;

        card.appendChild(label);
        card.appendChild(value);
        patternOverview.appendChild(card);
    });
}

function renderLineage(pattern, graph) {
    clearNode(patternLineage);

    const lineage = buildLineage(pattern, graph);
    if (!lineage.length) {
        patternLineage.appendChild(createEmptyState('No containment path found.', 'li'));
        return;
    }

    lineage.forEach((entry, index) => {
        const item = document.createElement('li');
        item.className = 'detail-list-item';
        const prefix = document.createElement('strong');
        prefix.textContent = `${index + 1}.`;
        const button = createJumpButton(`${entry.name} (${entry.id})`, entry.id);

        item.appendChild(prefix);
        item.appendChild(button);
        patternLineage.appendChild(item);
    });
}

function renderConnections(pattern, graph) {
    clearNode(patternConnections);

    const parent = pattern.parentId ? graph.byId.get(pattern.parentId) : null;
    const children = (Array.isArray(pattern.children) ? pattern.children : [])
        .map(childId => graph.byId.get(childId))
        .filter(Boolean);
    const siblings = graph.patterns.filter(candidate => candidate.parentId === pattern.parentId && candidate.id !== pattern.id);
    const variantParent = pattern.variantOf ? graph.byId.get(pattern.variantOf) : null;

    const rows = [
        {
            label: 'Parent',
            items: parent ? [{ id: parent.id, label: `${parent.name || parent.id} (${parent.id})` }] : [],
            fallback: 'none',
        },
        {
            label: 'Children',
            items: children.map(child => ({ id: child.id, label: `${child.name || child.id} (${child.id})` })),
            fallback: 'none',
        },
        {
            label: 'Siblings',
            items: siblings.map(sibling => ({ id: sibling.id, label: `${sibling.name || sibling.id} (${sibling.id})` })),
            fallback: 'none',
        },
        {
            label: 'Variant Of',
            items: variantParent ? [{ id: variantParent.id, label: `${variantParent.name || variantParent.id} (${variantParent.id})` }] : [],
            fallback: pattern.variantOf ? `${pattern.variantOfName || pattern.variantOf} (${pattern.variantOf})` : 'none',
        },
    ];

    rows.forEach(row => {
        const item = document.createElement('li');
        item.className = 'detail-list-item';
        const label = document.createElement('strong');
        label.textContent = `${row.label}:`;
        item.appendChild(label);

        if (row.items.length) {
            const chipRow = document.createElement('div');
            chipRow.className = 'jump-row';
            row.items.forEach(entry => {
                chipRow.appendChild(createJumpButton(entry.label, entry.id, { compact: true }));
            });
            item.appendChild(chipRow);
        } else {
            const fallback = document.createElement('span');
            fallback.className = 'connection-fallback';
            fallback.textContent = row.fallback;
            item.appendChild(fallback);
        }

        patternConnections.appendChild(item);
    });

    const tagsItem = document.createElement('li');
    tagsItem.className = 'detail-list-item';
    const tagsLabel = document.createElement('strong');
    tagsLabel.textContent = 'Relation Tags:';
    const tagsValue = document.createElement('span');
    tagsValue.className = 'connection-fallback';
    tagsValue.textContent = (pattern.relationTags || []).length ? pattern.relationTags.join(', ') : 'none';
    tagsItem.appendChild(tagsLabel);
    tagsItem.appendChild(tagsValue);
    patternConnections.appendChild(tagsItem);
}

function renderPatternWarnings(pattern, graph) {
    clearNode(patternWarnings);

    const warnings = getPatternWarnings(pattern, graph);
    if (!warnings.length) {
        appendBadge(patternWarnings, 'No structural warnings', 'badge-good');
        return;
    }

    warnings.forEach(warning => appendBadge(patternWarnings, warning, 'badge-warn'));
}

function countSubtreePatterns(patternId, graph) {
    if (!graph.byId.has(patternId)) {
        return 0;
    }

    let count = 1;
    const children = graph.childrenById.get(patternId) || [];
    children.forEach(childId => {
        count += countSubtreePatterns(childId, graph);
    });
    return count;
}

function buildMapNode(patternId, graph, depth = 0) {
    const pattern = graph.byId.get(patternId);
    const wrapper = document.createElement('article');
    wrapper.className = 'map-node';
    wrapper.style.setProperty('--map-depth', String(depth));

    const row = document.createElement('div');
    row.className = 'map-node-row';
    if (patternId === state.selectedPatternId) {
        row.classList.add('active');
    }

    const main = document.createElement('div');
    main.className = 'map-node-main';
    main.appendChild(createJumpButton(`${pattern.name || pattern.id} (${pattern.id})`, pattern.id, { compact: true }));

    const meta = document.createElement('div');
    meta.className = 'map-node-meta';
    appendBadge(meta, formatRange(pattern.range));
    (pattern.relationTags || []).forEach(tag => appendBadge(meta, tag));

    row.appendChild(main);
    row.appendChild(meta);
    wrapper.appendChild(row);

    const children = graph.childrenById.get(patternId) || [];
    if (children.length) {
        const childList = document.createElement('div');
        childList.className = 'map-children';
        children.forEach(childId => {
            childList.appendChild(buildMapNode(childId, graph, depth + 1));
        });
        wrapper.appendChild(childList);
    }

    return wrapper;
}

function renderStructureMap(graph) {
    clearNode(structureMap);

    if (!graph || !graph.patterns.length) {
        structureMapMeta.textContent = 'No whole-song structure map loaded.';
        structureMap.appendChild(createEmptyState('Select an exported song to view its grouped structure.'));
        return;
    }

    structureMapMeta.textContent = `${graph.roots.length} root groups and ${graph.patterns.length} total exported patterns.`;

    graph.roots.forEach(root => {
        const section = document.createElement('section');
        section.className = 'map-group';

        const header = document.createElement('div');
        header.className = 'map-group-head';

        const titleWrap = document.createElement('div');
        const title = document.createElement('h4');
        title.textContent = root.name || root.id;
        const subtitle = document.createElement('p');
        subtitle.className = 'collection-meta';
        subtitle.textContent = `${countSubtreePatterns(root.id, graph)} patterns in this group`;
        titleWrap.appendChild(title);
        titleWrap.appendChild(subtitle);

        const actions = document.createElement('div');
        actions.className = 'jump-row';
        actions.appendChild(createJumpButton(`Jump to ${root.id}`, root.id, { compact: true }));

        header.appendChild(titleWrap);
        header.appendChild(actions);
        section.appendChild(header);
        section.appendChild(buildMapNode(root.id, graph, 0));
        structureMap.appendChild(section);
    });
}

function renderPatternInspector(graph) {
    if (!graph || !state.selectedPatternId || !graph.byId.has(state.selectedPatternId)) {
        renderPropertyGrid([
            { label: 'Pattern', value: 'Select a pattern' },
            { label: 'Status', value: 'No pattern selected' },
        ]);
        clearNode(patternLineage);
        patternLineage.appendChild(createEmptyState('Select a pattern to inspect its containment path.', 'li'));
        clearNode(patternConnections);
        patternConnections.appendChild(createEmptyState('Select a pattern to inspect its structural links.', 'li'));
        clearNode(patternWarnings);
        appendBadge(patternWarnings, 'No pattern selected');
        return;
    }

    const pattern = graph.byId.get(state.selectedPatternId);
    const warnings = getPatternWarnings(pattern, graph);

    renderPropertyGrid([
        { label: 'Name', value: pattern.name || pattern.id },
        { label: 'Pattern ID', value: pattern.id },
        { label: 'Normalized Name', value: pattern.normalizedName || 'none' },
        { label: 'Depth', value: String(pattern.depth ?? 0) },
        { label: 'Range', value: formatRange(pattern.range) },
        { label: 'Instruments', value: `${formatCount(pattern.instrumentCount ?? (pattern.instruments || []).length)} assigned` },
        { label: 'Mode', value: pattern.mode || 'none' },
        { label: 'Warnings', value: warnings.length ? String(warnings.length) : 'none' },
    ]);

    renderLineage(pattern, graph);
    renderConnections(pattern, graph);
    renderPatternWarnings(pattern, graph);
}

function renderCollectionDetail(exportPayload, graph) {
    const collections = Array.isArray(exportPayload?.collectionCandidates) ? exportPayload.collectionCandidates : [];
    clearNode(collectionDetail);

    if (!collections.length) {
        collectionBrowserMeta.textContent = 'No collection candidates were exported for this song.';
        collectionDetail.appendChild(createEmptyState('No collection candidates were exported for this song.'));
        return;
    }

    const selectedPatternId = state.selectedPatternId;
    const visibleCollections = selectedPatternId
        ? collections.filter(collection =>
            collection.sourcePatternId === selectedPatternId ||
            collection.parentPatternId === selectedPatternId ||
            (Array.isArray(collection.memberPatternIds) && collection.memberPatternIds.includes(selectedPatternId)))
        : collections;

    const displayCollections = visibleCollections.length ? visibleCollections : collections.slice(0, 10);
    collectionBrowserMeta.textContent = `${collections.length} collection candidates exported. Showing ${displayCollections.length}${visibleCollections.length ? ' related to the selected pattern' : ''}.`;

    displayCollections.forEach(collection => {
        const card = document.createElement('article');
        card.className = 'collection-card';

        const heading = document.createElement('div');
        heading.className = 'collection-card-head';
        const title = document.createElement('strong');
        title.textContent = collection.name || collection.id;
        const type = document.createElement('span');
        type.className = 'badge';
        type.textContent = collection.collectionType || 'collection';
        heading.appendChild(title);
        heading.appendChild(type);

        const meta = document.createElement('p');
        meta.className = 'collection-meta';
        const sourcePattern = graph.byId.get(collection.sourcePatternId);
        const parentPattern = collection.parentPatternId ? graph.byId.get(collection.parentPatternId) : null;
        meta.textContent = `Source and parent links are navigable below.`;

        const anchors = document.createElement('div');
        anchors.className = 'jump-row';
        if (sourcePattern) {
            anchors.appendChild(createJumpButton(`Source: ${sourcePattern.name || sourcePattern.id} (${sourcePattern.id})`, sourcePattern.id, { compact: true }));
        }
        if (parentPattern) {
            anchors.appendChild(createJumpButton(`Parent: ${parentPattern.name || parentPattern.id} (${parentPattern.id})`, parentPattern.id, { compact: true }));
        } else if (collection.parentPatternId) {
            appendBadge(anchors, `Parent: ${collection.parentPatternId}`);
        }

        const members = document.createElement('div');
        members.className = 'jump-row';
        const memberIds = Array.isArray(collection.memberPatternIds) ? collection.memberPatternIds : [];
        if (!memberIds.length) {
            appendBadge(members, 'No members');
        } else {
            memberIds.forEach(memberId => {
                const member = graph.byId.get(memberId);
                if (member) {
                    members.appendChild(createJumpButton(`${member.name || member.id} (${member.id})`, member.id, { compact: true }));
                } else {
                    appendBadge(members, memberId);
                }
            });
        }

        card.appendChild(heading);
        card.appendChild(meta);
        if (anchors.childNodes.length) {
            card.appendChild(anchors);
        }
        card.appendChild(members);
        collectionDetail.appendChild(card);
    });
}

function renderRelationshipDetail(exportPayload, graph) {
    clearNode(relationshipDetail);

    const relationships = Array.isArray(exportPayload?.relationships) ? exportPayload.relationships : [];
    if (!relationships.length) {
        relationshipBrowserMeta.textContent = 'No relationships were exported for this song.';
        relationshipDetail.appendChild(createEmptyState('No relationships were exported for this song.', 'li'));
        return;
    }

    const selectedPatternId = state.selectedPatternId;
    const related = selectedPatternId
        ? relationships.filter(relationship => relationship.from === selectedPatternId || relationship.to === selectedPatternId)
        : relationships.slice(0, 12);

    if (!related.length) {
        relationshipBrowserMeta.textContent = 'No relationships touch the selected pattern.';
        relationshipDetail.appendChild(createEmptyState('The selected pattern has no explicit exported relationships.', 'li'));
        return;
    }

    relationshipBrowserMeta.textContent = `${relationships.length} relationships exported. Showing ${related.length}${selectedPatternId ? ' linked to the selected pattern' : ''}.`;

    related.forEach(relationship => {
        const fromPattern = graph.byId.get(relationship.from);
        const toPattern = graph.byId.get(relationship.to);
        const item = document.createElement('li');
        item.className = 'detail-list-item';

        const summary = document.createElement('div');
        summary.className = 'relationship-row';
        const left = document.createElement('strong');
        left.textContent = relationship.type || 'relationship';
        const nav = document.createElement('div');
        nav.className = 'relationship-nav';

        if (fromPattern) {
            nav.appendChild(createJumpButton(`${fromPattern.name || fromPattern.id} (${fromPattern.id})`, fromPattern.id, { compact: true }));
        } else {
            appendBadge(nav, relationship.from || 'unknown');
        }

        const arrow = document.createElement('span');
        arrow.className = 'relationship-arrow';
        arrow.textContent = '->';
        nav.appendChild(arrow);

        if (toPattern) {
            nav.appendChild(createJumpButton(`${toPattern.name || toPattern.id} (${toPattern.id})`, toPattern.id, { compact: true }));
        } else {
            appendBadge(nav, relationship.to || 'unknown');
        }

        summary.appendChild(left);
        summary.appendChild(nav);

        item.appendChild(summary);
        if (relationship.label) {
            const label = document.createElement('div');
            label.className = 'relationship-subrow';
            label.textContent = `Label: ${relationship.label}`;
            item.appendChild(label);
        }
        relationshipDetail.appendChild(item);
    });
}

function renderPatternList(graph, exportPayload) {
    clearNode(patternList);

    if (!graph || !graph.patterns.length) {
        patternBrowserMeta.textContent = 'No exported patterns loaded.';
        patternList.appendChild(createEmptyState('This export does not contain any patterns.', 'li'));
        renderCollectionDetail(exportPayload, graph);
        renderRelationshipDetail(exportPayload, graph);
        renderPatternInspector(graph);
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
            selectPattern(entry.patternId, { scroll: false });
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

        const haystack = [item.label, item.songId, item.path, item.sourcePath].join(' ').toLowerCase();
        return haystack.includes(query);
    });

    if (!items.length) {
        sourceList.appendChild(createEmptyState('No exported songs match the current filter.', 'li'));
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

        entry.addEventListener('click', () => loadDetail(item));
        sourceList.appendChild(entry);
    });
}

function renderEmptyDetail(message) {
    state.currentGraph = null;
    state.selectedExport = null;
    detailTitle.textContent = 'Select an exported song';
    detailTag.textContent = 'No export selected';
    detailMeta.textContent = message;
    structureTag.textContent = 'No structure selected';
    structureMeta.textContent = 'This panel reflects the dedicated heuristic export once a song is selected.';
    clearNode(structureSummary);
    clearNode(structureMap);
    structureMap.appendChild(createEmptyState('Select an exported song to view its grouped structure.'));
    structureMapMeta.textContent = 'No whole-song structure map loaded.';
    clearNode(patternList);
    patternBrowserMeta.textContent = 'No exported pattern graph loaded.';
    renderPatternInspector(null);
    clearNode(collectionDetail);
    collectionDetail.appendChild(createEmptyState('Collection candidates will appear here once an export is selected.'));
    collectionBrowserMeta.textContent = 'No exported collections loaded.';
    clearNode(relationshipDetail);
    relationshipDetail.appendChild(createEmptyState('Select a pattern to inspect incoming and outgoing structural links.', 'li'));
    relationshipBrowserMeta.textContent = 'Select a pattern to inspect incoming and outgoing structural links.';
    detailSummary.textContent = 'Awaiting selection.';
    detailRaw.textContent = 'Awaiting selection.';
}

function renderExportDetail(item, payload) {
    const exportPayload = payload?.rawPayload || {};
    const graph = buildPatternGraph(exportPayload);
    state.selectedExport = exportPayload;
    state.currentGraph = graph;

    const defaultPatternId = graph.byId.has(state.selectedPatternId)
        ? state.selectedPatternId
        : (graph.byId.has('root') ? 'root' : (graph.flattened[0]?.patternId || null));
    state.selectedPatternId = defaultPatternId;

    const songTitle = fallbackSongTitle(exportPayload, item);
    detailTitle.textContent = songTitle;
    detailTag.textContent = 'heuristic export';
    detailMeta.textContent = `${item.path} from ${exportPayload?.source?.path || item.sourcePath || 'user_settings'}`;

    structureTag.textContent = 'dedicated structural export';
    structureMeta.textContent = 'This export is the raw structural corpus for the heuristic North Star. It preserves standalone patterns, parent-child containment, collection candidates, repetitions, variations, and provenance.';

    detailSummary.textContent = JSON.stringify(payload.summary || {}, null, 2);
    detailRaw.textContent = JSON.stringify(exportPayload, null, 2);

    renderStructureSummary(exportPayload, graph, payload.summary || {}, item);
    selectPattern(state.selectedPatternId, { scroll: false });
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
        state.currentGraph = null;
        clearNode(structureSummary);
        clearNode(structureMap);
        structureMap.appendChild(createEmptyState('Failed to load whole-song structure.'));
        structureMapMeta.textContent = 'No whole-song structure map loaded.';
        clearNode(patternList);
        patternBrowserMeta.textContent = 'No exported pattern graph loaded.';
        renderPatternInspector(null);
        clearNode(collectionDetail);
        collectionDetail.appendChild(createEmptyState('Failed to load collection detail.'));
        collectionBrowserMeta.textContent = 'No exported collections loaded.';
        clearNode(relationshipDetail);
        relationshipDetail.appendChild(createEmptyState('Failed to load relationship detail.', 'li'));
        relationshipBrowserMeta.textContent = 'The selected export could not be loaded.';
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
        clearNode(sourceList);
        sourceList.appendChild(createEmptyState('Heuristic export data is unavailable.', 'li'));
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
