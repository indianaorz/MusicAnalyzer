/* global ABCJS, processAndRenderAnalysis */   // (main.js attaches these)

const sidebar = document.getElementById('item-list');
const filterBox = document.getElementById('filter');
const viewer = document.getElementById('viewer');

let DATA = [];          // cache of index list

// ------------------------------------------------------------------
//  Fetch index.json once, then build the sidebar list
// ------------------------------------------------------------------
fetch('/data/index.json')
    .then(r => r.json())
    .then(items => {
        DATA = items;
        rebuildList('');
    })
    .catch(err => {
        console.error('Could not load dataset index:', err);
        sidebar.innerHTML = '<li style="color:red">Error loading data</li>';
    });

function rebuildList(query) {
    const q = query.trim().toLowerCase();
    sidebar.innerHTML = '';

    DATA
        .filter(it => !q || it.title.toLowerCase().includes(q))
        .forEach(it => {
            const li = document.createElement('li');
            li.textContent = it.title;
            li.dataset.path = it.path;
            li.addEventListener('click', () => loadExample(it, li));
            sidebar.appendChild(li);
        });
}

filterBox.addEventListener('input', e => rebuildList(e.target.value));


// ------------------------------------------------------------------
//  Load **one** example JSON and call the existing piano-roll stack
// ------------------------------------------------------------------
function loadExample(item, liElement) {
    // highlight selection
    [...sidebar.children].forEach(li => li.classList.remove('active'));
    liElement.classList.add('active');

    // viewer.innerHTML = '<p class="placeholder">Loading…</p>';

    fetch(`/data/example/${item.path}`)
        .then(r => r.json())
        .then(payload => {
            // choose which ABC to show – change if you prefer 'output'
            let abcSource = `Input:\n\n${payload.input} \n\n Output:\n\n${payload.output}\n\n`;
            if (!abcSource) {
                // viewer.innerHTML = '<p class="placeholder" style="color:red">No ABC in JSON.</p>';
                return;
            }

            // -----------------------------------------------------------------
            // Build the same markup `main.js` expects: #analysis-content + global
            // -----------------------------------------------------------------
            window.analysisContent = `${abcSource}`;
            const ac = document.getElementById('analysis-content');
            ac.style.display = 'block';   // it was display:none in the template
            ac.innerHTML = '';            // clear previous run

            // `processAndRenderAnalysis` is defined in main.js inside its
            // DOMContentLoaded handler, but we can call it safely here because
            // main.js has already run by now.
            if (typeof processAndRenderAnalysis === 'function') {
                processAndRenderAnalysis();
            } else {
                // viewer.innerHTML = '<p class="placeholder" style="color:red">main.js not loaded?</p>';
            }
        })
        .catch(err => {
            console.error('Example load failed:', err);
            // viewer.innerHTML = '<p class="placeholder" style="color:red">Failed to load example.</p>';
        });
}
