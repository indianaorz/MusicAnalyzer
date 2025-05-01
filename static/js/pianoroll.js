/**
 * Interactive Piano Roll Renderer V3.1 (Corrected)
 *
 * Features:
 * - Single canvas rendering with track list interaction.
 * - Active track highlighting & Ghost notes.
 * - Zooming (Horizontal/Vertical) via Mouse Wheel (+Ctrl).
 * - Panning via Middle Mouse Button Drag.
 * - Note Selection (Click, Shift+Click, Box Select).
 * - Note Movement (Drag selected notes, updates data).
 * - Synced Piano Keyboard / Drum Name display panel.
 * - Drum track detection affects key display.
 * - Corrected Panning and Note/Key Alignment.
 *
 * Assumes global variables from HTML template:
 * - rawTracksData: Array of track objects, including 'is_drum_track' flag and 'notes' array.
 * - ticksPerBeat: Number.
 */


// ——— Color Conversion Helpers ———

// Parse `#rrggbb` or `#rgb` into {r,g,b}
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const int = parseInt(hex, 16);
    return {
        r: (int >> 16) & 255,
        g: (int >> 8) & 255,
        b: int & 255
    };
}

// Turn r,g,b (0–255) back into `#rrggbb`
function rgbToHex({ r, g, b }) {
    const to2 = v => v.toString(16).padStart(2, '0');
    return `#${to2(r)}${to2(g)}${to2(b)}`;
}

// Convert RGB → HSL, adjust L, back to RGB
function adjustLightness(hex, deltaPercent) {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h /= 6;
    }
    // shift lightness
    l = Math.min(1, Math.max(0, l + deltaPercent / 100));
    // h,s,l → r,g,b
    let r2, g2, b2;
    if (s === 0) r2 = g2 = b2 = l;
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r2 = hue2rgb(p, q, h + 1 / 3);
        g2 = hue2rgb(p, q, h);
        b2 = hue2rgb(p, q, h - 1 / 3);
    }
    return rgbToHex({
        r: Math.round(r2 * 255),
        g: Math.round(g2 * 255),
        b: Math.round(b2 * 255)
    });
}



document.addEventListener('DOMContentLoaded', function () {
    // --- Global Variables & Configuration ---
    const canvas = document.getElementById('main-piano-roll-canvas');
    const trackListElement = document.getElementById('track-list');
    const canvasContainer = document.getElementById('canvas-container'); // Used for sizing reference
    const keyDisplayPanel = document.getElementById('key-display-panel'); // Panel for keys/drums


    // --- Essential Element Checks ---
    if (!canvas || !trackListElement || !canvasContainer || !keyDisplayPanel) {
        console.error("Essential UI elements (canvas, track list, container, key panel) not found.");
        const errorTarget = document.querySelector('.main-content-wrapper') || document.body;
        errorTarget.innerHTML = '<p style="color:red; padding: 20px; font-weight: bold;">Error: Failed to initialize piano roll UI components.</p>';
        return;
    }
    if (typeof rawTracksData === 'undefined' || !Array.isArray(rawTracksData)) {
        console.error("MIDI track data (rawTracksData) not found or is not an array.");
        canvasContainer.innerHTML = "<p style='color:red; padding: 20px;'>Error: Track data missing.</p>";
        // Clear other elements too to prevent partial rendering
        trackListElement.innerHTML = '';
        keyDisplayPanel.innerHTML = '';
        return;
    }
    if (typeof ticksPerBeat === 'undefined' || ticksPerBeat <= 0) {
        console.warn("Ticks per beat (ticksPerBeat) not defined or invalid. Using default 480.");
        window.ticksPerBeat = 480; // Make it globally accessible if needed elsewhere
    } else {
        // Ensure window.ticksPerBeat is set if it came from template correctly
        window.ticksPerBeat = ticksPerBeat;
    }

    // --- NEW: Time Signature Globals (initialized from template) ---
    if (typeof timeSignatureNumerator === 'undefined' || timeSignatureNumerator <= 0) {
        console.warn("Time Signature Numerator not defined or invalid. Using default 4.");
        window.timeSignatureNumerator = 4;
    } else {
        window.timeSignatureNumerator = timeSignatureNumerator;
    }
    if (typeof timeSignatureDenominator === 'undefined' || timeSignatureDenominator <= 0) {
        console.warn("Time Signature Denominator not defined or invalid. Using default 4.");
        window.timeSignatureDenominator = 4; // Denominator not directly used in default tick calc, but good to have
    } else {
        window.timeSignatureDenominator = timeSignatureDenominator;
    }

    //unitNoteLengthDenominator
    if (typeof unitNoteLengthDenominator === 'undefined' || unitNoteLengthDenominator <= 0) {
        console.warn("Unit Note Length Denominator not defined or invalid. Using default 4.");
        window.unitNoteLengthDenominator = 4;
    } else {
        window.unitNoteLengthDenominator = unitNoteLengthDenominator;
    }


    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false can improve performance if no transparency needed for background
    if (!ctx) {
        console.error("Could not get 2D rendering context for canvas.");
        canvasContainer.innerHTML = "<p style='color:red; padding: 20px;'>Error: Canvas context not available.</p>";
        return;
    }

    // --- Constants ---
    const NOTE_BASE_HEIGHT = 12; // Base key/note height at scaleY = 1 (Adjust for better look/feel)
    const PIXELS_PER_TICK_BASE = 0.05; // Base horizontal scale sensitivity
    const PITCH_MIN = 0;
    const PITCH_MAX = 127;
    const PITCH_RANGE = PITCH_MAX - PITCH_MIN + 1;
    const NOTE_VERTICAL_GAP = 1; // Pixels gap between notes vertically

    // Colors & Opacity
    // ——— Your existing colours as lets ———
    let ACTIVE_NOTE_FILL_COLOR = 'crimson';
    let GHOST_NOTE_FILL_COLOR = '#adb5bd';
    let SELECTED_NOTE_FILL_COLOR = '#FFff00';
    let SELECTED_NOTE_STROKE_COLOR = '#0056b3';
    const GHOST_NOTE_ALPHA = 0.6;
    const ACTIVE_VELOCITY_ALPHA_MIN = 0.3;
    const ACTIVE_VELOCITY_ALPHA_MAX = 1.0;
    let GRID_LINE_COLOR = '#e9ecef';
    let BEAT_LINE_COLOR = '#dee2e6';
    let MEASURE_LINE_COLOR = '#ced4da';
    let BACKGROUND_COLOR = '#ffffff';
    let MEASURE_SHADING_COLOR = 'rgba(0,0,0,0.04)';
    let SELECTION_RECT_FILL = 'rgba(0,123,255,0.2)';
    let SELECTION_RECT_STROKE = 'rgba(0,123,255,0.6)';
    let KEY_WHITE_COLOR = '#f8f9fa';
    let KEY_BLACK_COLOR = '#343a40';
    let KEY_SEPARATOR_COLOR = '#dee2e6';
    let KEY_TEXT_COLOR = '#495057';
    let KEY_BLACK_TEXT_COLOR = '#f8f9fa';
    let NOTE_IN_SCALE_COLOR = '#3477eb';
    let NOTE_OUT_SCALE_COLOR = '#eb8c34';
    let GRID_ROW_IN_SCALE_COLOR = '#fff';
    let GRID_ROW_OUT_SCALE_COLOR = '#fffbf0';
    // Off-beat tint (fine to tweak later)
    const OFFBEAT_LIGHTEN = -35;   // percentage → lighter
    const OFFBEAT_DARKEN = 50;   // percentage → darker

    /*──────── Chord-detection globals ────────*/
    const CHORD_NAME = 'name';
    const CHORD_ROMAN = 'roman';
    let chordDisplayMode = CHORD_NAME;      // default
    let chordSegments = [];              // [{start,end,root,quality,name,roman}]

    /*  pitch-class sets for common qualities — root = 0  */
    const CHORD_QUALITY_TABLE = [
        { quality: 'maj', pcs: [0, 4, 7] },
        { quality: 'min', pcs: [0, 3, 7] },
        { quality: 'aug', pcs: [0, 4, 8] },
        { quality: 'dim', pcs: [0, 3, 6] },
        { quality: 'sus4', pcs: [0, 5, 7] },
        { quality: 'sus2', pcs: [0, 2, 7] }
    ];
    /* extensions layered on top of triads */
    const EXTENSIONS = [
        { ext: '6', pcs: [9] },   // add-6
        { ext: '7', pcs: [10] },   // dom 7 / min 7 (detected later)
        { ext: 'maj7', pcs: [11] },
        { ext: '9', pcs: [2] }
    ];

    /* Return “Gb”, “F#” … according to preferFlats */
    function pcToKeyName(pc, preferFlats) {
        const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F',
            'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F',
            'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        return preferFlats ? FLAT[pc] : SHARP[pc];
    }

    function pcToDegreeRoman(pc, keyRootPc, isMinor) {
        return pcToRoman(pc, keyRootPc, isMinor); // returns I, ii, … or “?”
    }



    function pcToRoman(rootPc, keyRootPc, isMinor) {
        const DEGREE = (rootPc - keyRootPc + 12) % 12;
        const MAJOR = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
        const MINOR = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii°'];
        const MAP = isMinor ? MINOR : MAJOR;
        const DIATONIC_PCS = isMinor
            ? [0, 2, 3, 5, 7, 8, 10]   // nat-minor scale
            : [0, 2, 4, 5, 7, 9, 11];  // major scale
        const idx = DIATONIC_PCS.indexOf(DEGREE);
        if (idx === -1) return '?';
        return MAP[idx];
    }
    // Score weights for choosing between multiple triad roots
    const QUALITY_SCORE = {
        maj: 5,
        min: 5,
        dim: 4,
        aug: 4,
        sus4: 3,
        sus2: 2,
        root: 0,
        interval: 0
    };

    /**
     * Smart chord classifier
     * -------------------------------------------------------------
     *  – chooses the *bass* as the root whenever that bass actually
     *    forms a known chord-quality with the other notes  
     *  – otherwise falls back to the best triad it can find
     *  – slash-marks every inversion, including sus chords
     *  – understands 6, 7, maj7 and 9 extensions
     *  – returns an object
     *        { rootPc, quality, ext, name, roman, bassPc }
     *    or null if nothing sensible can be said
     *
     *  pcs            Set<int>    pitch-classes in the chord (0-11)
     *  keyRootPc      int         tonic of the current key (for Roman)
     *  isMinorKey     bool        true ⇢ treat the key as minor
     *  bassPcOverride int|null    supply a bass if you already know it
     */
    function classifyChord(
        pcs,
        keyRootPc = 0,
        isMinorKey = false,
        bassPcOverride = null
    ) {
        /* ---------- helper tables ---------- */
        const TRIADS = [
            { q: 'maj', pcs: [0, 4, 7] },
            { q: 'min', pcs: [0, 3, 7] },
            { q: 'dim', pcs: [0, 3, 6] },
            { q: 'aug', pcs: [0, 4, 8] },
            { q: 'sus4', pcs: [0, 5, 7] },
            { q: 'sus2', pcs: [0, 2, 7] }
        ];
        const EXTS = [
            { e: 'maj7', pcs: [11] },
            { e: '7', pcs: [10] },
            { e: '6', pcs: [9] },
            { e: '9', pcs: [2] }
        ];
        const QUAL_SUFFIX = { maj: '', min: 'm', dim: '°', aug: '+', sus2: 'sus2', sus4: 'sus4' };

        /* ---------- fast exits for 1- & 2-note blobs ---------- */
        if (pcs.size === 1) {
            const pc = [...pcs][0];
            const n = pcToKeyName(pc, getKeyAccidentals(NOTE_NAMES[keyRootPc], isMinorKey).preferFlats);
            return { rootPc: pc, quality: 'root', ext: '', name: n, roman: n, bassPc: pc };
        }

        if (pcs.size === 2) {
            const [rootPc, otherPc] = [...pcs].sort((x, y) => x - y);
            const interval = (otherPc - rootPc + 12) % 12;

            // decide sharps vs flats from the current key
            const { preferFlats } = getKeyAccidentals(
                NOTE_NAMES[keyRootPc],
                isMinorKey
            );
            const rootName = pcToKeyName(rootPc, preferFlats);

            // map semitone → suffix
            const SUFFIX = {
                0: "1",
                1: "m2",
                2: "M2",
                3: "m3",
                4: "M3",
                5: "4",
                6: "#4",  // or "TT"
                7: "5",
                8: "m6",
                9: "M6",
                10: "m7",
                11: "M7"
            };

            const suf = SUFFIX[interval] || String(interval);

            return {
                rootPc,
                quality: 'interval',
                ext: '',
                name: `${rootName}${suf}`,  // e.g. "G1", "Gm2", "GM2", "G5"
                roman: `${rootName}${suf}`,
                bassPc: rootPc
            };
        }



        /* ---------- prep ---------- */
        const pcsArr = [...pcs].sort((a, b) => a - b);
        const bassPc = bassPcOverride ?? pcsArr[0];
        const preferFlats = getKeyAccidentals(NOTE_NAMES[keyRootPc], isMinorKey).preferFlats;
        const candidates = [bassPc, ...pcsArr.filter(pc => pc !== bassPc)];  // search bass first

        let best = null, bestScore = -1;

        for (const root of candidates) {
            const rel = new Set([...pcs].map(p => (p - root + 12) % 12));

            /* ── first: does this root form ANY recognised triad? ───────── */
            for (const tri of TRIADS) {
                if (!tri.pcs.every(p => rel.has(p))) continue;   // not this quality

                /* ── grab first matching extension (if present) ─────────── */
                let ext = '';
                if (!tri.q.startsWith('sus')) {
                    for (const ex of EXTS) { if (ex.pcs.every(p => rel.has(p))) { ext = ex.e; break; } }
                }

                /* ── build labels ───────────────────────────────────────── */
                const rootName = pcToKeyName(root, preferFlats);
                const bassName = pcToKeyName(bassPc, preferFlats);
                const name = rootName + QUAL_SUFFIX[tri.q] + ext + (bassPc !== root ? '/' + bassName : '');

                /* Roman-numeral (very simple) */
                let deg = pcToRoman(root, keyRootPc, isMinorKey);
                if (tri.q === 'maj') deg = deg.toUpperCase();
                if (tri.q === 'min') deg = deg.toLowerCase();
                if (tri.q === 'dim') deg += '°';
                if (tri.q === 'aug') deg += '+';
                const roman = deg + ext + (bassPc !== root ? (bassPc === (root + 4) % 12 ? '⁶' : '⁶₄') : '');

                /* ── scoring ────────────────────────────────────────────── */
                let score = 0;
                if (root === bassPc) score += 8;   // prefer root in bass
                if (tri.q === 'maj' || tri.q === 'min') score += 4;   // diatonic triads nicer
                if (ext) score += 2;   // 7ths & 9ths win over bare
                // prefer chords that lie inside the current key
                const DEG = (root - keyRootPc + 12) % 12;
                const DIAT = isMinorKey ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
                if (DIAT.includes(DEG)) score += 1;

                if (score > bestScore) {
                    bestScore = score;
                    best = { rootPc: root, quality: tri.q, ext, name, roman, bassPc };
                }
            }
            if (best && best.rootPc === bassPc) break;   // good root already in bass – stop early
        }
        return best;   // may be null if nothing matched
    }





    window.addEventListener('popstate', ev => {
        if (ev.state?.patternId) {
            setActivePattern(ev.state.patternId, true);
        }
    });



    /* ─── 1.  History initialisation – call once in initialize() ─── */
    function initPatternHistory() {
        // Make sure the very first entry has a known pattern id
        history.replaceState({ patternId: ROOT_ID }, '', location.href);

        // Whenever the user hits Back / Forward…
        window.addEventListener('popstate', ev => {
            if (ev.state && ev.state.patternId) {
                // avoid creating a *new* history entry while we replay one
                setActivePattern(ev.state.patternId, /*fromPop=*/true);
            }
        });
    }

    /* ─── 2.  Small helper that pushes a new history entry ─── */
    function pushPatternHistory(id) {
        // Optional: keep the URL hash in sync – nice for sharing links / reloads
        history.pushState({ patternId: id }, '', `#pat=${id}`);
    }

    /* ─── 3.  Add a flag to setActivePattern so we know the call origin ─── */
    function setActivePattern(id, fromPop = false) {   // ← new param
        activePatternId = id;
        selectedNotes.clear();

        // ── ensure all parents of the new active pattern are expanded ──
        let p = patterns.get(id);
        while (p) {
            collapsed.delete(p.id);
            p = patterns.get(p.parentId);
        }
        rebuildPatternTree();

        redrawPianoRoll();

        if (id !== ROOT_ID) zoomToRect(patterns.get(id).range);

        if (!fromPop) pushPatternHistory(id);
    }



    let copyMode = 'range';
    document.getElementById('copy-mode-select')
        .addEventListener('change', e => copyMode = e.target.value);


    let snapMode = 'none';
    document.getElementById('snap-mode-select')
        .addEventListener('change', e => snapMode = e.target.value);
    let lastBoxRange = { start: null, end: null };


    function snapTick(tick) {
        if (snapMode === 'bar') return Math.round(tick / ticksPerMeasure) * ticksPerMeasure;
        if (snapMode === 'division') return Math.round(tick / window.ticksPerBeat) * window.ticksPerBeat;
        return tick;                  // none
    }
    /*──────────────── PATTERN ENGINE ────────────────*/
    const ROOT_ID = 'root';              // synthetic “whole song”
    const patterns = new Map();           // id  ➜ Pattern object
    let activePatternId = ROOT_ID;       // which node is showing

    patterns.set(ROOT_ID, {
        id: ROOT_ID,
        name: 'Whole song',
        parentId: null,
        range: { start: 0, end: Infinity },  // we never clip the root
        noteRefs: [],                        // gets filled on first redraw
        children: []
    });

    let SETTINGS_FILE;//currentMidiFilename + '.json';
    let pendingSave;

    /*──────────────────────── selection utils ───────────────────────*/
    function getSelectionRect(sel) {
        // vertical bounds from the *selected* notes:
        let low = PITCH_MAX, high = PITCH_MIN;
        sel.forEach(k => {
            const { trackIndex, noteIndex } = JSON.parse(k);
            const n = rawTracksData[trackIndex]?.notes[noteIndex];
            if (!n) return;
            low = Math.min(low, n.pitch);
            high = Math.max(high, n.pitch);
        });

        // horizontal: if we just box-selected, use that exact tick range
        let start = lastBoxRange.start;
        let end = lastBoxRange.end - 1;

        // otherwise fall back to note-based bounds (min start, max end)
        if (start == null || end == null) {
            start = Infinity; end = 0;
            sel.forEach(k => {
                const { trackIndex, noteIndex } = JSON.parse(k);
                const n = rawTracksData[trackIndex]?.notes[noteIndex];
                if (!n) return;
                start = Math.min(start, n.start_tick);
                end = Math.max(end, n.start_tick + n.duration_ticks);
            });
        }

        return { start, end, low, high };
    }

    function beatPosition(tick) {
        const tpBeat = window.ticksPerBeat;
        const eighth = tpBeat / 2;
        const sixteenth = tpBeat / 4;

        // ① quantize to nearest 16th
        const q = Math.round(tick / sixteenth) * sixteenth;

        // ② now test
        if (q % tpBeat === 0) return 0;  // down-beat (♩)
        if (q % eighth === 0) return 1;  // off-beat 8th (&)
        if (q % sixteenth === 0) return 2;  // 16th off-beat (ah-ee-&-ah)
        return 3;                           // anything else (swing, etc.)
    }



    /**
     * Return every time-shifted **exact** clone of `pat` that lives wholly
     * inside `parentPat` (same pitches, same durations & instruments, only
     * the absolute start time differs).
     *
     * Each hit is
     *   { offset   : number              // ticks from master → clone
     *     range    : {start,end,low,high}
     *     noteKeys : string[]            // JSON keys of matching notes
     *   }
     */
    function findRepeatsOfPattern(pat, parentPat) {

        /* helper – collect all notes that currently belong to pattern P */
        const getNotes = P => {
            const list = [];
            rawTracksData.forEach((trk, ti) => {
                trk.notes.forEach((n, ni) => {
                    if (noteInPattern(n, P, ti))
                        list.push({ trackIndex: ti, noteIndex: ni, n });
                });
            });
            return list;
        };

        /* ─────────────────────────────────────────────────────────── */
        const master = getNotes(pat);
        if (!master.length) return [];

        /* —— ensure the *earliest* master note is anchor zero —— */
        master.sort((a, b) => a.n.start_tick - b.n.start_tick);
        const firstStart = master[0].n.start_tick;

        /* build a fast lookup →  track ↦ [{relStart,dur,pitch}, …]  */
        const fp = new Map();                        // ti → [{d,s,p}]
        master.forEach(o => {
            const rel = o.n.start_tick - firstStart;
            if (!fp.has(o.trackIndex)) fp.set(o.trackIndex, []);
            fp.get(o.trackIndex).push({
                relStart: rel,
                dur: o.n.duration_ticks,
                pitch: o.n.pitch
            });
        });
        fp.forEach(arr => arr.sort((a, b) => a.relStart - b.relStart));

        /* ─────────────────────────────────────────────────────────── */
        const parentNotes = getNotes(parentPat);

        /* anchor-candidates = notes with same pitch+dur as the master anchor */
        const anchorPitch = master[0].n.pitch;
        const anchorDur = master[0].n.duration_ticks;
        const candidates = parentNotes.filter(o =>
            pat.instruments.includes(o.trackIndex) &&
            o.n.pitch === anchorPitch &&
            o.n.duration_ticks === anchorDur);

        const hits = [];

        candidates.forEach(cand => {
            const off = cand.n.start_tick - firstStart;
            if (off === 0) return;                    // that’s the master itself

            /* proposed rectangle for this clone */
            const newRange = {
                start: pat.range.start + off,
                end: pat.range.end + off,
                low: pat.range.low,
                high: pat.range.high
            };

            /* ➊ reject if it touches the master slice */
            if (spansOverlap(newRange.start, newRange.end,
                pat.range.start, pat.range.end)) return;

            /* ➋ reject if it overlaps any already-accepted clone */
            if (hits.some(h => spansOverlap(h.range.start, h.range.end,
                newRange.start, newRange.end))) return;

            /* ➌ verify every master note exists at +off (pitch **and** dur) */
            let ok = true;
            const keys = [];

            fp.forEach((arr, ti) => {
                const trk = rawTracksData[ti];
                arr.forEach(spec => {
                    const tgtStart = firstStart + spec.relStart + off;
                    const idx = trk.notes.findIndex(x =>
                        x.start_tick === tgtStart &&
                        x.duration_ticks === spec.dur &&          // <<< fixed!
                        x.pitch === spec.pitch);
                    if (idx === -1) { ok = false; return; }
                    keys.push(JSON.stringify({ trackIndex: ti, noteIndex: idx }));
                });
            });
            if (!ok) return;

            /* ➍ reject if any *extra* note falls inside the candidate slice */
            const extra = parentNotes.some(o =>
                pat.instruments.includes(o.trackIndex) &&
                o.n.start_tick >= newRange.start &&
                o.n.start_tick < newRange.end &&
                !keys.includes(JSON.stringify({ trackIndex: o.trackIndex, noteIndex: o.noteIndex })));
            if (extra) return;

            /* ➎ good – record this hit */
            hits.push({ offset: off, range: newRange, noteKeys: keys });
        });

        return hits;
    }









    /*───────────────────  E X P O R T  E N G I N E  ───────────────────*/
    function exportPattern(rootId) {
        const barsz = tpMeasure();
        const root = patterns.get(rootId);
        if (!root) { alert('Pattern not found'); return; }

        /* ————————————————— helpers ————————————————— */
        const isDrum = ti => !!rawTracksData[ti]?.is_drum_track;

        // put all drum tracks first, then the melodic ones, then numeric order
        const orderTracks = itr =>
            [...itr].sort((a, b) => (isDrum(a) ? 0 : 1) - (isDrum(b) ? 0 : 1) || a - b);

        // return JSON note-keys whose **start** is inside pat’s rectangle
        const noteKeysIn = pat => {
            const out = [];
            rawTracksData.forEach((trk, ti) =>
                trk.notes.forEach((n, ni) => {
                    if (noteInPattern(n, pat, ti))
                        out.push(JSON.stringify({ trackIndex: ti, noteIndex: ni }));
                }));
            return out;
        };

        // build ABC from an *array of note-keys* – collapsing all drum tracks first
        const abcForKeys = keys => {
            if (!keys.length) return '';
            const byTrack = new Map();
            keys.forEach(k => {
                const { trackIndex, noteIndex } = JSON.parse(k);
                if (!byTrack.has(trackIndex)) byTrack.set(trackIndex, []);
                byTrack.get(trackIndex).push({ trackIndex, noteIndex });
            });

            // ── merge every drum track into the first drum we find ──
            const drums = [...byTrack.keys()].filter(isDrum);
            if (drums.length > 1) {
                const master = drums[0];
                drums.slice(1).forEach(ti => {
                    byTrack.get(master).push(...byTrack.get(ti));
                    byTrack.delete(ti);
                });
            }

            const order = orderTracks(byTrack.keys());

            // cheat: use the trusted selection-based generator
            const remember = new Set(selectedNotes);
            selectedNotes = new Set(keys);
            const abc = generateAbcFromSelectionMultiVoice(order);
            selectedNotes = remember;
            return abc;
        };

        // human-friendly bar range
        const barRange = (s, e) =>
            `bars ${Math.floor(s / barsz) + 1}–${Math.ceil(e / barsz)}`;

        /* ————————————————— recursive printer ————————————————— */
        let txt = '';

        function dump(patId, indent = 0) {
            const pat = patterns.get(patId);
            const pad = '  '.repeat(indent);
            const keys = noteKeysIn(pat);

            if (pat.isRepetition) {
                txt += `${pad}- **${pat.variantOfName}** repeats ${barRange(pat.range.start, pat.range.end)}\n`;
                return;
            }

            // ▸ header line
            txt += `${pad}- **${pat.name}** (${barRange(pat.range.start, pat.range.end)})\n`;

            // ▸ full ABC
            const fullAbc = abcForKeys(keys);
            if (fullAbc) txt += `${pad}<abc>\n${fullAbc}\n</abc>\n`;

            // ▸ per-instrument parts (only if >1 instrument)
            const instList = pat.instruments || [];
            if (instList.length > 1) {
                // collect keys per track, merging drums → “Drums”
                const drums = instList.filter(isDrum);
                const melodic = instList.filter(ti => !isDrum(ti));

                // melodic first
                orderTracks(melodic).forEach(ti => {
                    const k = keys.filter(k => JSON.parse(k).trackIndex === ti);
                    const abc = abcForKeys(k);
                    if (abc) {
                        const nm = getTrackInstrumentName(rawTracksData[ti], ti);
                        txt += `${pad}  • **${nm}**\n${pad}  <abc>\n${abc}\n${pad}  </abc>\n`;
                    }
                });

                // then a single merged drum part
                if (drums.length) {
                    const k = keys.filter(k => drums.includes(JSON.parse(k).trackIndex));
                    const abc = abcForKeys(k);
                    if (abc) {
                        txt += `${pad}  • **Drums**\n${pad}  <abc>\n${abc}\n${pad}  </abc>\n`;
                    }
                }
            }

            // ▸ variations tag
            if (pat.isVariation) {
                txt += `${pad}  _(variation of ${pat.variantOfName})_\n`;
            }

            // recurse children
            pat.children.forEach(cid => dump(cid, indent + 1));
        }

        txt += `Now for the **${root.name}** section:\n\n`;
        dump(rootId);

        /* ————————————————— copy to clipboard ————————————————— */
        navigator.clipboard.writeText(txt)
            .then(() => alert('Export copied to clipboard!'))
            .catch(err => { console.error(err); alert('Copy failed – see console'); });
    }




    /* ticks-per-measure helper */
    const tpMeasure = () => window.ticksPerBeat * window.timeSignatureNumerator;


    /* ────────────────────────────────────────────────────────────────
     *   helper: select every note that belongs to `patterns.get(id)`
     * ────────────────────────────────────────────────────────────────*/
    /* helper: grab every note in the active pattern (or whole song) */
    function selectEntirePattern(id = activePatternId) {
        selectedNotes.clear();
        const pat = patterns.get(id);
        rawTracksData.forEach((trk, ti) => {
            if (!trackStates[ti].isVisible) return;
            trk.notes.forEach((note, ni) => {
                const key = JSON.stringify({ trackIndex: ti, noteIndex: ni });
                if (id === ROOT_ID) {
                    selectedNotes.add(key);
                } else {
                    // same logic your patterns use for inclusion
                    if (noteInPattern(note, pat, ti)) {
                        selectedNotes.add(key);
                    }
                }
            });
        });
        redrawPianoRoll();
        invalidateSynth();
    }

    function noteInPattern(note, pat, trackIndex) {
        const hOK = pat.mode === 'range'
            ? (note.start_tick < pat.range.end &&
                note.start_tick + note.duration_ticks > pat.range.start)
            : (note.start_tick >= pat.range.start &&
                note.start_tick <= pat.range.end);
        const vOK = note.pitch >= pat.range.low && note.pitch <= pat.range.high;
        const inInst = !pat.instruments || pat.instruments.includes(trackIndex);

        return hOK && vOK && inInst;
    }


    function getSelectionBounds(selSet) {
        let min = Infinity, max = 0;
        selSet.forEach(k => {
            const { trackIndex, noteIndex } = JSON.parse(k);
            const n = rawTracksData[trackIndex]?.notes[noteIndex];
            if (!n) return;
            min = Math.min(min, n.start_tick);
            max = Math.max(max, n.start_tick + n.duration_ticks);
        });
        return { start: min, end: max };
    }

    /* return an array of JSON-keys the pattern owns.
       – current behaviour: **only the active pattern’s own notes**,
         not its descendants (easy to change later).                */
    function collectNotesRecursively(id) {
        return patterns.get(id)?.noteRefs ?? [];
    }


    function queueSave() {
        clearTimeout(pendingSave);
        pendingSave = setTimeout(saveSettings, 400);
    }
    function saveSettings() {
        const harmonyFlags = trackStates.map(s => s.isHarmony);
        const body = JSON.stringify({
            root: selectedRootNote,
            scale: selectedScaleType,
            copyMode,
            snapMode,
            harmony: harmonyFlags,        // ← new
            patterns: [...patterns.values()]
        });
        fetch(`/settings/${encodeURIComponent(SETTINGS_FILE)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }).catch(console.error);
    }
    let repeatHighlights = [];
    let variationHighlights = [];


    function addPattern(name) {
        if (!selectedNotes.size) return;
        const rect = getSelectionRect(selectedNotes);

        // collect the unique track‐indices
        const instruments = new Set();
        selectedNotes.forEach(k => {
            const { trackIndex } = JSON.parse(k);
            instruments.add(trackIndex);
        });

        // ➊ create the new “master” pattern
        const id = crypto.randomUUID();
        const pat = {
            id,
            name,
            parentId: activePatternId,
            range: rect,
            mode: copyMode,
            children: [],
            instruments: Array.from(instruments)
        };
        patterns.set(id, pat);
        const parent = patterns.get(pat.parentId || ROOT_ID);
        parent.children.push(id);

        // clear any previous highlights
        repeatHighlights = [];
        variationHighlights = [];

        // ➋ scan for exact repetitions
        const reps = findRepeatsOfPattern(pat, parent);
        repeatHighlights = reps.map(h => h.range);
        if (repeatHighlights.length) {
            redrawPianoRoll(); // show yellow
            setTimeout(() => {
                if (confirm(`Found ${repeatHighlights.length} exact repetition`
                    + `${repeatHighlights.length > 1 ? 's' : ''} of “${name}”.\n`
                    + `Convert highlighted section${repeatHighlights.length > 1 ? 's' : ''} to repetitions?`)) {
                    reps.forEach(h => {
                        const rid = crypto.randomUUID();
                        patterns.set(rid, {
                            id: rid,
                            name: `${name}`,
                            parentId: pat.parentId,
                            range: h.range,
                            mode: pat.mode,
                            instruments: [...pat.instruments],
                            isRepetition: true,
                            variantOf: id,
                            variantOfName: name,
                            children: []
                        });
                        parent.children.push(rid);
                    });
                    repeatHighlights = [];
                    rebuildPatternTree();
                    queueSave();
                    redrawPianoRoll();
                } else {
                    repeatHighlights = [];
                    redrawPianoRoll();
                }

                // ➌ after handling repeats, move on to rhythmic variations
                scanForRhythmicVariations();
            }, 100);
        }
        else {
            // no repeats → go straight to variations
            scanForRhythmicVariations();
        }

        // ➍ helper to detect & prompt for rhythmic variations
        function scanForRhythmicVariations() {
            const vars = findRhythmicVariations(pat, parent);
            variationHighlights = vars.map(h => h.range);
            if (!variationHighlights.length) {
                finalize();
                return;
            }

            redrawPianoRoll(); // show orange
            setTimeout(() => {
                if (confirm(`Found ${variationHighlights.length} rhythmic variation`
                    + `${variationHighlights.length > 1 ? 's' : ''} of “${name}”.\n`
                    + `Convert highlighted section${variationHighlights.length > 1 ? 's' : ''} to variations?`)) {

                    // how many primes already exist under this master?
                    const existing = parent.children
                        .filter(cid => patterns.get(cid).variantOf === id).length;

                    vars.forEach((h, idx) => {
                        const rid = crypto.randomUUID();
                        const prime = "'".repeat(existing + idx + 1);
                        patterns.set(rid, {
                            id,
                            id: rid,
                            name: `${name}${prime}`,
                            parentId: pat.parentId,
                            range: h.range,
                            mode: pat.mode,
                            instruments: [...pat.instruments],
                            isVariation: true,
                            isRhythmicVariation: true,
                            variantOf: id,
                            variantOfName: name,
                            children: []
                        });
                        parent.children.push(rid);
                    });

                    variationHighlights = [];
                    rebuildPatternTree();
                    queueSave();
                    redrawPianoRoll();
                } else {
                    variationHighlights = [];
                    redrawPianoRoll();
                }
                finalize();
            }, 100);
        }

        // ➎ once all detections done: activate, clear selection, redraw, save
        function finalize() {
            activePatternId = id;
            selectedNotes.clear();
            rebuildPatternTree();
            redrawPianoRoll();
            queueSave();
        }
    }


    const primeSuffix = n => "'".repeat(n);

    function editPattern(id) {
        if (id === ROOT_ID) return;
        const pat = patterns.get(id);

        // 1. load its mode & selection
        copyMode = pat.mode;
        document.getElementById('copy-mode-select').value = copyMode;

        // 2. pre-select the notes in that rectangle
        selectedNotes.clear();
        rawTracksData.forEach((trk, ti) =>
            trk.notes.forEach((note, ni) => {
                if (noteInPattern(note, pat, ti)) {
                    selectedNotes.add(JSON.stringify({ trackIndex: ti, noteIndex: ni }));
                }
            })
        );
        invalidateSynth();
        redrawPianoRoll();

        // 3. add a “Save Pattern” button if none exists
        if (!document.getElementById('save-pattern-btn')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'save-pattern-btn';
            saveBtn.textContent = 'Save Pattern';
            saveBtn.style.margin = '10px';
            saveBtn.onclick = () => {
                // grab new rect & mode, overwrite pattern
                pat.range = getSelectionRect(selectedNotes);
                pat.mode = copyMode;
                selectedNotes.clear();
                saveBtn.remove();
                rebuildPatternTree();
                redrawPianoRoll();
                queueSave();
            };
            document.querySelector('.pattern-tree-panel').appendChild(saveBtn);
        }
    }
    function deletePattern(id) {
        if (id === ROOT_ID) return;
        const pat = patterns.get(id);
        if (!pat) return;
        if (!confirm(`Delete pattern “${pat.name}” and ALL its children? This cannot be undone.`))
            return;

        // recursively delete subtree
        function recurseDelete(pid) {
            const node = patterns.get(pid);
            if (!node) return;
            node.children.forEach(childId => recurseDelete(childId));
            patterns.delete(pid);
        }
        recurseDelete(id);

        // remove from parent's children list
        const parent = patterns.get(pat.parentId);
        if (parent) {
            parent.children = parent.children.filter(cid => cid !== id);
        }

        // set active to the parent (or root)
        activePatternId = pat.parentId || ROOT_ID;
        selectedNotes.clear();
        rebuildPatternTree();
        redrawPianoRoll();
        queueSave();
    }

    /**
     * Return a stable string that represents the rhythm of a note-cluster.
     * We ignore pitch, velocity, channel … only care about
     *   – relative start-time (ticks offset from first note)
     *   – relative duration
     *   – which track the note lives on   (so drums vs bass don’t collide)
     */
    function buildRhythmFingerprint(notes, resolution = window.ticksPerBeat / 16) {
        // helper to snap any tick to the nearest gridpoint
        const q = t => Math.round(t / resolution) * resolution;

        // ① find the true first start *after* quantizing
        const firstStart = Math.min(...notes.map(o => q(o.n.start_tick)));

        // ② build a map of [ trackIndex → [ "relStart|relDur", … ] ]
        const map = new Map();
        notes.forEach(o => {
            const qs = q(o.n.start_tick);
            const qd = q(o.n.duration_ticks);
            const relS = qs - firstStart;
            const entry = `${relS}|${qd}`;
            if (!map.has(o.trackIndex)) map.set(o.trackIndex, []);
            map.get(o.trackIndex).push(entry);
        });

        // ③ sort each track’s entries so order is stable…
        map.forEach(list => list.sort());

        // ④ flatten to a single string:  track,entry,entry, track,entry… 
        return [...map.entries()]
            .sort((a, b) => a[0] - b[0])             // ascending track order
            .flatMap(([ti, list]) => [ti, ...list])
            .join(',');
    }

    const spansOverlap = (s1, e1, s2, e2) => !(e1 <= s2 || e2 <= s1);

    /**
     * Return every slice inside `parentPat` that has an identical rhythm
     * to `pat` (same tracks, same relative starts & durations) but with
     * at least one different pitch.  Unlike the old version, it does **not**
     * require the slice to start on a bar-line – it checks every grid-point
     * between parent.start and parent.end – span.
     *
     * @param {Object} pat         – the “master” pattern
     * @param {Object} parentPat   – the pattern whose children we’re scanning
     * @param {number} [grid=ticksPerBeat/16]  – how fine to step (defaults = 16-th)
     * @returns {Array<{range:{start,end,low,high}, noteKeys:string[]}>}
     */
    function findRhythmicVariations(pat, parentPat, grid) {
        const TPB = window.ticksPerBeat || 480;
        const step = grid ?? TPB / 16;                 // default 16-th-note grid
        const span = pat.range.end - pat.range.start;
        const searchStart = parentPat.range.start;
        const searchEnd = parentPat.range.end - span;

        // helper – grab every note that belongs to pattern P *right now*
        const getNotes = P => {
            const list = [];
            rawTracksData.forEach((trk, ti) => {
                trk.notes.forEach((n, ni) => {
                    if (noteInPattern(n, P, ti)) list.push({ trackIndex: ti, noteIndex: ni, n });
                });
            });
            return list;
        };

        const masterNotes = getNotes(pat);
        if (!masterNotes.length) return [];

        const fpRef = buildRhythmFingerprint(masterNotes);

        // don’t create a variation where a child pattern already starts
        const occupiedStarts = new Set(
            parentPat.children
                .map(cid => patterns.get(cid))
                .filter(Boolean)
                .map(p => p.range.start)
        );

        const hits = [];
        for (let winStart = searchStart; winStart <= searchEnd; winStart += step) {

            if (spansOverlap(winStart, winStart + span,
                pat.range.start, pat.range.end)) continue; // skip the master itself
            if (occupiedStarts.has(winStart)) continue; // skip existing child
            if ((winStart - searchStart) % step) continue; // safety (non-integer fp)

            // collect all notes that overlap [winStart, winStart+span)
            const winNotes = [];
            rawTracksData.forEach((trk, ti) => {
                if (!pat.instruments.includes(ti)) return;             // instruments filter
                trk.notes.forEach((n, ni) => {
                    if (n.start_tick < winStart + span &&
                        n.start_tick + n.duration_ticks > winStart) {
                        winNotes.push({ trackIndex: ti, noteIndex: ni, n });
                    }
                });
            });

            if (!winNotes.length) continue;
            if (buildRhythmFingerprint(winNotes) !== fpRef) continue; // rhythm differs


            // *** NEW: require the earliest note to begin at the window start ***
            const earliest = Math.min(...winNotes.map(o => o.n.start_tick));
            if (earliest !== winStart) continue;                       // ← skip shifted copies

            // identical rhythm – is **any** pitch different?
            const rel = t => t - winStart;                             // helper
            const baseRel = t => t - masterNotes[0].n.start_tick;      // helper
            const hasPitchMismatch = winNotes.some(w => {
                const match = masterNotes.find(m =>
                    m.trackIndex === w.trackIndex &&
                    baseRel(m.n.start_tick) === rel(w.n.start_tick)
                );
                return match && match.n.pitch !== w.n.pitch;
            });
            if (!hasPitchMismatch) continue;

            // give the slice its *own* pitch bounds
            const lo = Math.min(...winNotes.map(o => o.n.pitch));
            const hi = Math.max(...winNotes.map(o => o.n.pitch));

            var range = {
                start: winStart,
                end: winStart + span,
                low: lo,
                high: hi
            };
            // good – record this hit
            hits.push({
                range: range,
                noteKeys: winNotes.map(w =>
                    JSON.stringify({ trackIndex: w.trackIndex, noteIndex: w.noteIndex }))
            });
        }

        return hits;
    }


    let selectionVariationHighlights = [];

    /**
 * Build a tiny “pattern” from whatever notes are currently selected,
 * then scan the active pattern for identical rhythms.
 */
    function updateSelectionRhythmicCandidates() {
        // if you have fewer than 2 notes, nothing to match
        if (selectedNotes.size < 2) {
            selectionVariationHighlights = [];
            return;
        }

        // collect JSON keys → pitch / tick info
        const sel = [...selectedNotes].map(k => JSON.parse(k));
        const pitches = sel.map(({ trackIndex, noteIndex }) => rawTracksData[trackIndex].notes[noteIndex].pitch);
        const starts = sel.map(({ trackIndex, noteIndex }) => rawTracksData[trackIndex].notes[noteIndex].start_tick);
        const ends = sel.map(({ trackIndex, noteIndex }) =>
            rawTracksData[trackIndex].notes[noteIndex].start_tick +
            rawTracksData[trackIndex].notes[noteIndex].duration_ticks
        );

        // build the temp pattern
        const tempPat = {
            range: {
                start: Math.min(...starts),
                end: Math.max(...ends),
                low: Math.min(...pitches),
                high: Math.max(...pitches)
            },
            instruments: [...new Set(sel.map(n => n.trackIndex))]
        };

        // scan for rhythmic variations inside the active pattern
        const parentPat = patterns.get(activePatternId);
        const hits = findRhythmicVariations(tempPat, parentPat);
        // store just the ranges for drawing
        selectionVariationHighlights = hits.map(h => h.range);
    }

    /* ────────────────────────────────────────────────────────────────
     *  GLOBAL STATE  (add just after the other globals)
     * ────────────────────────────────────────────────────────────────*/
    let patternActionMode = null;   // null | 'repeat' | 'variation'
    let overlayEl = null;           // the arrow-overlay DOM node

    /* helper – show / hide the full-screen arrow message */
    function showOverlay(msg) {
        if (!overlayEl) {
            overlayEl = document.createElement('div');
            overlayEl.id = 'pattern-click-overlay';
            Object.assign(overlayEl.style, {
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,.45)',
                color: '#fff',
                font: '700 34px/1.2 Inter, sans-serif',
                textAlign: 'center',
                zIndex: 5000,
                pointerEvents: 'none'          // clicks fall through
            });
            canvasContainer.appendChild(overlayEl);
        }
        overlayEl.innerHTML = `⇢  ${msg}<br><small style="font:400 20px Inter">click a pattern in the sidebar</small>`;
        overlayEl.style.opacity = 1;
    }
    function hideOverlay() {
        if (overlayEl) overlayEl.style.opacity = 0;
        patternActionMode = null;
    }

    // 2) The renaming handler that keeps all variantOfName in sync:
    function handlePatternRename(id, newName) {
        const pat = patterns.get(id);
        if (!pat) return;
        if (!newName) newName = '(unnamed)';
        pat.name = newName;

        // Update every child that refers back to this pattern:
        patterns.forEach(p => {
            if (p.variantOf === id) {
                p.variantOfName = newName;
            }
        });

        rebuildPatternTree();
        queueSave();
    }


    /* persistent collapse state (id → bool) */
    let collapsed = new Set();

    function rebuildPatternTree() {
        const ul = document.getElementById('pattern-tree');
        ul.innerHTML = '';

        function makeRow(p, depth, isLast) {
            if (p === undefined) return; // skip if no pattern
            const li = document.createElement('li');
            li.className = 'pattern-node' +
                (p.id === activePatternId ? ' active' : '') +
                (isLast ? ' last-child' : '');
            li.style.setProperty('--depth', depth);

            /* ► / ▾ caret  */
            const caret = document.createElement('span');
            caret.className = 'caret';
            caret.textContent = p.children?.length ? '▾' : '';
            caret.onclick = e => {
                e.stopPropagation();
                if (!p.children?.length) return;
                (collapsed.has(p.id) ? collapsed.delete(p.id)
                    : collapsed.add(p.id));
                rebuildPatternTree();
            };
            li.appendChild(caret);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'node-name';
            nameSpan.textContent = p.name || '(unnamed)';
            li.appendChild(nameSpan);

            // cancel the browser context menu *and* run your rename
            li.addEventListener('contextmenu', e => {
                e.preventDefault();
                e.stopPropagation();
                const newName = prompt("Rename pattern:", p.name);
                if (newName != null) {
                    handlePatternRename(p.id, newName.trim());
                }
            });


            li.onclick = (e) => {
                // ─── remapVariant mode ───
                if (patternActionMode === 'remapVariant' && p.id !== ROOT_ID) {
                    if (remapState.step === 0) {
                        // first click: pick the variant to remap
                        remapState.sourceId = p.id;
                        remapState.step = 1;
                        showOverlay('click source node');
                        return;
                    } else {
                        // second click: pick the new source
                        const srcPat = patterns.get(remapState.sourceId);
                        srcPat.variantOf = p.id;
                        srcPat.variantOfName = p.name;
                        //set to as variant if it wasn't set
                        srcPat.isVariation = true;
                        // cleanup
                        remapState.step = 0;
                        patternActionMode = null;
                        hideOverlay();
                        rebuildPatternTree();
                        queueSave();
                        redrawPianoRoll();
                        return;
                    }
                }

                /* if we’re waiting for a repeat / variation target */
                if (patternActionMode && p.id !== ROOT_ID) {
                    if (patternActionMode === 'repeat') makeRepeatOf(p);
                    else makeVariationOf(p);
                    hideOverlay();
                } else {
                    setActivePattern(p.id);
                }
            };
            /* —— meta tag: “variation / repeat of …” + checkbox ——— */
            if ((p.isVariation || p.isRepetition) && p.variantOfName) {
                const meta = document.createElement('span');
                meta.className = 'node-meta';

                const master = patterns.get(p.variantOf);
                const masterName = master ? master.name : '(unknown)';
                meta.textContent = p.isRepetition
                    ? `repeat of ${masterName}`
                    : `variation of ${masterName}`;

                if (p.isRepetition) { }// meta.textContent = `repeat of ${p.variantOfName}`;
                else {

                    /* rhythmic-variation toggle */
                    const lbl = document.createElement('label');
                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.checked = !!p.isRhythmicVariation;
                    chk.onchange = e => {
                        e.stopPropagation();
                        p.isRhythmicVariation = chk.checked;
                        queueSave();
                    };
                    lbl.appendChild(chk);
                    lbl.append('rhythmic');
                    meta.appendChild(lbl);
                }
                li.appendChild(meta);
            }

            /* —— right-aligned icon buttons ——— */
            const btn = (title, icon, cb, dis = false) => {
                const b = document.createElement('button');
                b.title = title; b.disabled = dis; b.innerHTML = icon;
                b.onclick = e => { e.stopPropagation(); cb(); };
                li.appendChild(b);
            };
            btn('Export', '⤓', () => exportPattern(p.id));
            btn('Edit', '✎', () => editPattern(p.id));
            btn('Delete', '🗑', () => deletePattern(p.id), p.id === ROOT_ID);

            /* append & recurse */
            document.getElementById('pattern-tree').appendChild(li);
            if (!collapsed.has(p.id)) {
                p.children?.forEach((cid, i, arr) =>
                    makeRow(patterns.get(cid), depth + 1, i === arr.length - 1));
            }
        }


        makeRow(patterns.get(ROOT_ID), 0, true);
    }




    /*───────────────────────────────────────────────────────────────
     *  Build a REPEAT pattern – *only* if the selection is exact
     *───────────────────────────────────────────────────────────────*/
    function makeRepeatOf(master) {

        const baseId = variationBaseId || activePatternId;
        if (!selectionIsExactRepeatOf(master)) {
            const ok = confirm(
                `Detected that the selected notes don’t perfectly match “${master.name}”.\n` +
                `Are you sure you want to mark this as a repeat anyway?`
            );
            if (!ok) return;
        }

        /* rectangle & instruments come straight from the selection */
        const rect = getSelectionRect(selectedNotes);
        const instruments = [...new Set(
            [...selectedNotes].map(k => JSON.parse(k).trackIndex)
        )];

        const id = crypto.randomUUID();

        patterns.set(id, {
            id,
            name: master.name,
            parentId: baseId,
            range: rect,
            mode: master.mode,
            instruments,
            isRepetition: true,
            variantOf: master.id,
            variantOfName: master.name,
            children: []
        });
        patterns.get(baseId).children.push(id);

        variationBaseId = null;           // clear
        selectedNotes.clear();
        rebuildPatternTree();
        queueSave();
        redrawPianoRoll();
    }

    let variationBaseId = null;


    /**
     * Build a new variation of `master` as a *child* of `master` itself,
     * and give it the correct number of primes.
     */

    // updated makeVariationOf:
    function makeVariationOf(master) {
        const baseId = variationBaseId || activePatternId;
        const rect = getSelectionRect(selectedNotes);
        const instruments = [...new Set([...selectedNotes].map(k => JSON.parse(k).trackIndex))];

        // count all existing non-rhythmic variations of this master.id
        const existing = Array.from(patterns.values())
            .filter(p =>
                p.isVariation &&
                !p.isRhythmicVariation &&
                p.variantOf === master.id
            ).length;
        const prime = "'".repeat(existing + 1);

        const id = crypto.randomUUID();
        const newPat = {
            id,
            name: master.name + prime,
            parentId: baseId,               // use the selected “folder”
            range: rect,
            mode: master.mode,
            instruments,
            isVariation: true,
            variantOf: master.id,           // this connects it back to master
            variantOfName: master.name,
            children: [],
        };

        // insert under the base node, not under master
        const parent = patterns.get(baseId);
        parent.children.push(id);

        patterns.set(id, newPat);
        rebuildPatternTree();
        queueSave();
        redrawPianoRoll();
        variationBaseId = null;           // clear
    }

    /**
     * Return the number of *non-rhythmic* variations that already
     * exist for `master` (anywhere in the tree whose variantOf === master.id).
     */
    function countExistingVariations(master) {
        let count = 0;
        for (const pat of patterns.values()) {
            if (
                pat.isVariation &&
                !pat.isRhythmicVariation &&
                pat.variantOf === master.id
            ) {
                count++;
            }
        }
        return count;
    }


    /**
 * Find the *top-most* descendant pattern whose rectangle contains
 * the given canvas coordinates. Returns the pattern object or null.
 */
    function patternAtCanvasXY(x, y, parent = patterns.get(activePatternId)) {
        let hit = null;

        parent.children?.forEach(cid => {
            //don't allow selecting a pattern that we already selected in our repeat/variation override mode remapState.sourceId
            if (remapState.step === 1 && remapState.sourceId === cid) return;
            const ch = patterns.get(cid);
            if (!ch) return;

            const x1 = midiTickToCanvasX(ch.range.start);
            const x2 = midiTickToCanvasX(ch.range.end);
            const y1 = midiPitchToCanvasY(ch.range.high);
            const y2 = midiPitchToCanvasY(ch.range.low) +
                NOTE_BASE_HEIGHT * scaleY;            // bottom edge

            if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                // recurse first so the deepest child wins
                hit = patternAtCanvasXY(x, y, ch) || ch;
            }
        });
        return hit;
    }


    /*──────────────── CTRL+SHIFT+R – AUTO-FIND REPETITIONS (v2) ──────────*/
    async function detectInternalRepetitions() {
        const parentPat = patterns.get(activePatternId);
        if (!parentPat || parentPat.id === ROOT_ID) {
            alert('Select a non-root pattern first.'); return;
        }

        // clear any previous previews
        repeatHighlights = variationHighlights = [];
        redrawPianoRoll();

        /* ➊ gather candidates: every NON-repetition pattern ≠ current */
        const candidates = [];
        patterns.forEach(pat => {
            if (pat.id === ROOT_ID || pat.id === parentPat.id) return;
            if (pat.isRepetition) return;                       // skip reps as sources
            findRepeatsOfPattern(pat, parentPat)
                .forEach(hit => candidates.push({ src: pat, hit }));
        });
        if (!candidates.length) {
            alert(`No repetitions of other patterns found inside “${parentPat.name}”.`);
            return;
        }

        /* ➋ walk hits in chronological order, skipping overlaps with
              anything we accept during this pass                             */
        candidates.sort((a, b) => a.hit.range.start - b.hit.range.start);
        const taken = [];          // [{start,end}] of accepted clones

        const overlaps = (a, b) => !(a.end <= b.start || b.end <= a.start);

        for (const { src, hit } of candidates) {
            // already occupied by a previously-accepted clone?
            if (taken.some(r => overlaps(r, hit.range))) continue;

            // preview colours & zoom
            repeatHighlights = [hit.range];   // yellow  = proposed clone
            variationHighlights = [src.range];   // orange  = source pattern
            const union = {
                start: Math.min(src.range.start, hit.range.start),
                end: Math.max(src.range.end, hit.range.end),
                low: Math.min(src.range.low, hit.range.low),
                high: Math.max(src.range.high, hit.range.high)
            };
            redrawPianoRoll();
            zoomToRect(union, 300);

            /* give the browser one frame to paint before confirm() opens */
            await new Promise(r => setTimeout(r, 500));

            const ok = confirm(
                `“${src.name}” appears to repeat inside “${parentPat.name}”.\n` +
                `Convert the highlighted slice to a Repetition?`
            );
            if (!ok) continue;

            // record the new repetition
            const id = crypto.randomUUID();
            patterns.set(id, {
                id,
                name: src.name,
                parentId: parentPat.id,
                range: hit.range,
                mode: src.mode,
                instruments: [...src.instruments],
                isRepetition: true,
                variantOf: src.id,
                variantOfName: src.name,
                children: []
            });
            parentPat.children.push(id);
            taken.push(hit.range);            // mark space as occupied
            queueSave();
        }

        // cleanup UI
        repeatHighlights = variationHighlights = [];
        rebuildPatternTree();
        redrawPianoRoll();
    }





    document.getElementById('add-pattern-btn').addEventListener('click', () => {
        const name = prompt('Name this pattern:');
        if (name) addPattern(name.trim());
    });



    // ——— Dark-Mode Colour Overrides ———
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        ACTIVE_NOTE_FILL_COLOR = '#ff8a65';              // salmon/orange
        GHOST_NOTE_FILL_COLOR = '#616161';              // mid-grey
        SELECTED_NOTE_FILL_COLOR = '#ffeb3b';              // bright yellow
        SELECTED_NOTE_STROKE_COLOR = '#03a9f4';              // cyan-blue outline

        GRID_LINE_COLOR = '#373737';              // dark grid
        BEAT_LINE_COLOR = '#424242';
        MEASURE_LINE_COLOR = '#616161';

        BACKGROUND_COLOR = '#121212';              // almost-black
        MEASURE_SHADING_COLOR = 'rgba(255,255,255,0.02)'; // very subtle highlight

        SELECTION_RECT_FILL = 'rgba(3,169,244,0.3)';   // light-blue semi-opaque
        SELECTION_RECT_STROKE = 'rgba(3,169,244,0.7)';

        KEY_WHITE_COLOR = '#1e1e1e';              // dark “white” key
        KEY_BLACK_COLOR = '#000000';              // black key
        KEY_SEPARATOR_COLOR = '#333333';              // fine lines between keys
        KEY_TEXT_COLOR = '#e0e0e0';              // off-white labels
        KEY_BLACK_TEXT_COLOR = '#aaaaaa';              // grey text on black keys

        NOTE_IN_SCALE_COLOR = '#4fc3f7';              // sky-blue for in-scale notes
        NOTE_OUT_SCALE_COLOR = '#ffb74d';              // amber for out-of-scale notes

        GRID_ROW_IN_SCALE_COLOR = '#263238';              // dark blue background
        GRID_ROW_OUT_SCALE_COLOR = '#1e272c';              // darker slate
    }



    // General MIDI Drum Map (Standard pitches for channel 10)
    const GM_DRUM_MAP = {
        35: 'Aco Bass Drum', 36: 'Bass Drum 1', 37: 'Side Stick', 38: 'Aco Snare',
        39: 'Hand Clap', 40: 'Ele Snare', 41: 'Low Floor Tom', 42: 'Closed HiHat',
        43: 'High Floor Tom', 44: 'Pedal HiHat', 45: 'Low Tom', 46: 'Open HiHat',
        47: 'Low-Mid Tom', 48: 'Hi-Mid Tom', 49: 'Crash Cymbal1', 50: 'High Tom',
        51: 'Ride Cymbal 1', 52: 'Chinese Cymbal', 53: 'Ride Bell', 54: 'Tambourine',
        55: 'Splash Cymbal', 56: 'Cowbell', 57: 'Crash Cymbal2', 58: 'Vibraslap',
        59: 'Ride Cymbal 2', 60: 'Hi Bongo', 61: 'Low Bongo', 62: 'Mute Hi Conga',
        63: 'Open Hi Conga', 64: 'Low Conga', 65: 'High Timbale', 66: 'Low Timbale',
        67: 'High Agogo', 68: 'Low Agogo', 69: 'Cabasa', 70: 'Maracas',
        71: 'Short Whistle', 72: 'Long Whistle', 73: 'Short Guiro', 74: 'Long Guiro',
        75: 'Claves', 76: 'Hi Wood Block', 77: 'Low Wood Block', 78: 'Mute Cuica',
        79: 'Open Cuica', 80: 'Mute Triangle', 81: 'Open Triangle'
        // Add more if needed
    };


    const DRUM_PITCH_TO_ABC = {
        35: 'B,,,', 36: 'C,,', 37: '^C,,', 38: 'D,,', 39: '^D,,', 40: 'E,,',
        41: 'F,,', 42: '^F,,', 43: 'G,,', 44: '^G,,', 45: 'A,,', 46: '^A,,',
        47: 'B,,', 48: 'C,', 49: '^C,', 50: 'D,', 51: '^D,', 52: 'E,',
        53: 'F,', 54: '^F,', 55: 'G,', 56: '^G,', 57: 'A,', 58: '^A,',
        59: 'B,', 60: 'C', 61: '^C', 62: 'D', 63: '^D', 64: 'E',
        65: 'F', 66: '^F', 67: 'G', 68: '^G', 69: 'A', 70: '^A',
        71: 'B', 72: 'c', 73: '^c', 74: 'd', 75: '^d', 76: 'e',
        77: 'f', 78: '^f', 79: 'g', 80: '^g', 81: 'a'
    };



    const GM_MELODY_MAP = {
        0: "Acoustic Grand Piano",
        1: "Bright Acoustic Piano",
        2: "Electric Grand Piano",
        3: "Honky-tonk Piano",
        4: "Electric Piano 1",
        5: "Electric Piano 2",
        6: "Harpsichord",
        7: "Clavinet",

        8: "Celesta",
        9: "Glockenspiel",
        10: "Music Box",
        11: "Vibraphone",
        12: "Marimba",
        13: "Xylophone",
        14: "Tubular Bells",
        15: "Dulcimer",

        16: "Drawbar Organ",
        17: "Percussive Organ",
        18: "Rock Organ",
        19: "Church Organ",
        20: "Reed Organ",
        21: "Accordion",
        22: "Harmonica",
        23: "Tango Accordion",

        24: "Acoustic Guitar (nylon)",
        25: "Acoustic Guitar (steel)",
        26: "Electric Guitar (jazz)",
        27: "Electric Guitar (clean)",
        28: "Electric Guitar (muted)",
        29: "Overdriven Guitar",
        30: "Distortion Guitar",
        31: "Guitar Harmonics",

        32: "Acoustic Bass",
        33: "Electric Bass (finger)",
        34: "Electric Bass (pick)",
        35: "Fretless Bass",
        36: "Slap Bass 1",
        37: "Slap Bass 2",
        38: "Synth Bass 1",
        39: "Synth Bass 2",

        40: "Violin",
        41: "Viola",
        42: "Cello",
        43: "Contrabass",
        44: "Tremolo Strings",
        45: "Pizzicato Strings",
        46: "Orchestral Harp",
        47: "Timpani",

        48: "String Ensemble 1",
        49: "String Ensemble 2",
        50: "SynthStrings 1",
        51: "SynthStrings 2",
        52: "Choir Aahs",
        53: "Voice Oohs",
        54: "Synth Voice",
        55: "Orchestra Hit",

        56: "Trumpet",
        57: "Trombone",
        58: "Tuba",
        59: "Muted Trumpet",
        60: "French Horn",
        61: "Brass Section",
        62: "SynthBrass 1",
        63: "SynthBrass 2",

        64: "Soprano Sax",
        65: "Alto Sax",
        66: "Tenor Sax",
        67: "Baritone Sax",
        68: "Oboe",
        69: "English Horn",
        70: "Bassoon",
        71: "Clarinet",

        72: "Piccolo",
        73: "Flute",
        74: "Recorder",
        75: "Pan Flute",
        76: "Blown Bottle",
        77: "Shakuhachi",
        78: "Whistle",
        79: "Ocarina",

        80: "Lead 1 (square)",
        81: "Lead 2 (sawtooth)",
        82: "Lead 3 (calliope)",
        83: "Lead 4 (chiff)",
        84: "Lead 5 (charang)",
        85: "Lead 6 (voice)",
        86: "Lead 7 (fifths)",
        87: "Lead 8 (bass + lead)",

        88: "Pad 1 (new age)",
        89: "Pad 2 (warm)",
        90: "Pad 3 (polysynth)",
        91: "Pad 4 (choir)",
        92: "Pad 5 (bowed)",
        93: "Pad 6 (metallic)",
        94: "Pad 7 (halo)",
        95: "Pad 8 (sweep)",

        96: "FX 1 (rain)",
        97: "FX 2 (soundtrack)",
        98: "FX 3 (crystal)",
        99: "FX 4 (atmosphere)",
        100: "FX 5 (brightness)",
        101: "FX 6 (goblins)",
        102: "FX 7 (echoes)",
        103: "FX 8 (sci-fi)",

        104: "Sitar",
        105: "Banjo",
        106: "Shamisen",
        107: "Koto",
        108: "Kalimba",
        109: "Bagpipe",
        110: "Fiddle",
        111: "Shanai",

        112: "Tinkle Bell",
        113: "Agogo",
        114: "Steel Drums",
        115: "Woodblock",
        116: "Taiko Drum",
        117: "Melodic Tom",
        118: "Synth Drum",
        119: "Reverse Cymbal",

        120: "Guitar Fret Noise",
        121: "Breath Noise",
        122: "Seashore",
        123: "Bird Tweet",
        124: "Telephone Ring",
        125: "Helicopter",
        126: "Applause",
        127: "Gunshot"
    };

    //invert GM_MELODY_MAP for reverse lookup
    const MELODY_NAME_TO_PROGRAM = Object.fromEntries(Object.entries(GM_MELODY_MAP).map(([k, v]) => [v, parseInt(k)]));



    // Define Scale Intervals (relative to root, 0 = root)
    const SCALE_INTERVALS = {
        'major': [0, 2, 4, 5, 7, 9, 11], // W-W-H-W-W-W-H
        'minor': [0, 2, 3, 5, 7, 8, 10], // W-H-W-W-H-W-W (Natural Minor)
        // 'harmonicMinor': [0, 2, 3, 5, 7, 8, 11], // If needed later
        // 'melodicMinor':  [0, 2, 3, 5, 7, 9, 11], // Ascending, if needed later
        'pentatonicMajor': [0, 2, 4, 7, 9],      // Major scale without 4th and 7th
        'pentatonicMinor': [0, 3, 5, 7, 10],     // Minor scale without 2nd and 6th
        'blues': [0, 3, 5, 6, 7, 10],   // Minor Pentatonic + Flat 5th
        'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // All notes
        'none': [] // No notes highlighted
    };

    const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];



    // Add near other state variables
    let selectedRootNote = 0; // MIDI Pitch Class (0=C, 1=C#, ...)
    let selectedScaleType = 'major'; // e.g., 'major', 'minor', etc.
    let currentScalePitchClasses = new Set(); // Holds pitch classes (0-11) in the current scale
    let currentScaleNotes = new Set(); // Holds *all* MIDI pitches (0-127) in the current scale

    // References to new UI elements (add these after getting canvas etc.)
    let scaleRootSelect = null;
    let scaleTypeSelect = null;

    // --- State Management ---
    let trackStates = []; // Holds visibility state per track { isVisible: boolean }
    // add helper
    function makeDefaultTrackState() {
        return { isVisible: true, isHarmony: false };
    }
    let harmonyChordMap = {};     // tick → Set(pitchClass)

    let activeTrackIndex = -1; // Index in the rawTracksData array, -1 means none active
    let selectedNotes = new Set(); // Stores selected notes as JSON strings: '{"trackIndex": t, "noteIndex": n}'

    // Viewport State
    let scaleX = 1.0; // Horizontal zoom factor
    let scaleY = 1.0; // Vertical zoom factor
    let offsetX = 0; // Horizontal pan offset (MIDI ticks * PIXELS_PER_TICK_BASE * scaleX) - this is canvas pixels offset
    let offsetY = 0; // Vertical pan offset (Pitches * NOTE_BASE_HEIGHT * scaleY) - this is canvas pixels offset
    let contentWidthTicks = 0; // Max tick of any note end
    const contentHeightPitches = PITCH_RANGE; // Constant pitch range

    // Interaction State
    let isPanning = false;
    let isSelecting = false;
    let isMovingNotes = false;
    let dragStartX = 0; // Canvas Coords
    let dragStartY = 0; // Canvas Coords
    let dragStartOffsetX = 0;
    let dragStartOffsetY = 0;
    let selectionRect = null; // { x1, y1, x2, y2 } in canvas coordinates
    let noteMoveData = { // Data needed during note move
        startCanvasX: 0, startCanvasY: 0, // Where the drag started on canvas
        currentCanvasX: 0, currentCanvasY: 0, // Current mouse position during drag
        deltaTick: 0, deltaPitch: 0, // Cumulative delta in MIDI units
        originalNotes: [] // { trackIndex, noteIndex, originalTick, originalPitch }
    };
    let lastMouseMoveTime = 0; // For throttling redraws on move

    // Reference for the content wrapper inside key display
    let keyDisplayContentWrapper = null;

    // --- NEW: Shading Pattern Shift Toggle ---
    // Set to true to shade measures 0, 2, 4...
    // Set to false to shade measures 1, 3, 5... (useful for pickup measures)
    let shadeEvenMeasures = true; // Default: shade the first measure (index 0)
    let ticksPerMeasure = window.ticksPerBeat * window.timeSignatureNumerator;


    /**
     * Does the CURRENT selection form a perfect quantised copy of `master`?
     * ─────────────────────────────────────────────────────────────────────
     * • Ignores velocity / channel.
     * • Quantises starts **and durations** to the 16-note grid (TPB/4 by default).
     * • Compares (track, relStart, dur, pitch).
     *
     * If `debug:true` it logs a minimal diff report so you can see
     *   – missing notes      (in master but not in selection)
     *   – extra   notes      (in selection but not in master)
     *   – pitch / length mismatches at the same slot.
     */
    function selectionIsExactRepeatOf(master, { debug = true } = {}) {
        if (!selectedNotes.size) return false;

        const step = (window.ticksPerBeat || 480) / 4;   // 16th-note grid
        const q = v => Math.round(v / step) * step;

        /* 1 — gather both note-lists (filter by master.instruments first) */
        const masterKeys = notesInsidePattern(master)                // [{ti,ni},…]
            .filter(({ trackIndex }) => !master.instruments ||
                master.instruments.includes(trackIndex));

        if (masterKeys.length === 0) return false;                    // nothing to match

        const selKeys = [...selectedNotes]
            .map(JSON.parse)
            .filter(({ trackIndex }) => !master.instruments ||
                master.instruments.includes(trackIndex));

        /* quick cardinality check – no hope if counts differ */
        if (masterKeys.length !== selKeys.length) {
            if (debug) console.warn(
                `≠ note count  ⟶ master:${masterKeys.length}  selection:${selKeys.length}`);
            return false;
        }

        /* 2 — build canonical descriptor “track:start:dur:pitch” */
        const desc = ({ trackIndex, noteIndex }, zero) => {
            const n = rawTracksData[trackIndex].notes[noteIndex];
            const relStart = q(n.start_tick - zero);
            const dur = q(n.duration_ticks);                // ← use dur, not end!
            return `${trackIndex}:${relStart}:${dur}:${n.pitch}`;
        };

        const masterStart = Math.min(...masterKeys.map(({ trackIndex, noteIndex }) =>
            rawTracksData[trackIndex].notes[noteIndex].start_tick));

        const selStart = Math.min(...selKeys.map(({ trackIndex, noteIndex }) =>
            rawTracksData[trackIndex].notes[noteIndex].start_tick));

        const masterSet = new Set(masterKeys.map(k => desc(k, masterStart)));

        /* 3 — walk the selection, spot the FIRST mismatch (cheapest exit) */
        for (const key of selKeys) {
            const d = desc(key, selStart);
            if (!masterSet.has(d)) {
                if (debug) {
                    console.group('repeat-test diff');
                    console.log('expected these descriptors:', masterSet);
                    console.error('first offending descriptor:', d);
                    console.groupEnd();
                }
                return false;
            }
        }
        return true;   // perfect clone
    }





    function rebuildHarmonyChordMap() {
        // 1) Build a map tick → { pcs: Set<pitchClass>, bassPitch: number, bassPc: number }
        harmonyChordMap = {};
        rawTracksData.forEach((trk, ti) => {
            if (!trackStates[ti].isHarmony) return;
            trk.notes.forEach(n => {
                const pc = n.pitch % 12;
                for (let t = n.start_tick, end = n.start_tick + n.duration_ticks; t < end; ++t) {
                    if (!harmonyChordMap[t]) {
                        harmonyChordMap[t] = { pcs: new Set(), bassPitch: null, bassPc: null };
                    }
                    const entry = harmonyChordMap[t];
                    entry.pcs.add(pc);
                    // Track the absolute lowest pitch for this tick
                    if (entry.bassPitch === null || n.pitch < entry.bassPitch) {
                        entry.bassPitch = n.pitch;
                        entry.bassPc = pc;
                    }
                }
            });
        });

        // 2) Build chordSegments from that map
        chordSegments.length = 0;
        const ticks = Object.keys(harmonyChordMap)
            .map(Number)
            .sort((a, b) => a - b);
        if (ticks.length === 0) return;

        const keyRootPc = selectedRootNote;
        const isMinorKey = selectedScaleType.toLowerCase().includes('min');

        // Initialize the first segment
        let segStart = ticks[0];
        let prevEntry = harmonyChordMap[segStart];
        let prevSet = prevEntry.pcs;

        for (let i = 1; i < ticks.length; i++) {
            const t = ticks[i];
            const entry = harmonyChordMap[t];
            const set = entry.pcs;

            // Detect a change in chord (size or content)
            if (set.size !== prevSet.size || [...set].some(pc => !prevSet.has(pc))) {
                // Close the previous segment
                const chord = classifyChord(prevSet, keyRootPc, isMinorKey, prevEntry.bassPc);
                if (chord) {
                    chordSegments.push({
                        start: segStart,
                        end: t,
                        ...chord
                    });
                }
                // Start a new segment here
                segStart = t;
                prevEntry = entry;
                prevSet = entry.pcs;
            }
        }

        // Final segment
        const finalEntry = harmonyChordMap[segStart];
        const finalChord = classifyChord(finalEntry.pcs, keyRootPc, isMinorKey, finalEntry.bassPc);
        if (finalChord) {
            chordSegments.push({
                start: segStart,
                end: ticks[ticks.length - 1] + 1,
                ...finalChord
            });
        }
    }




    /**
     * Smoothly pan & zoom so the given pattern rectangle fills the view.
     * `rect` is {start,end,low,high} in MIDI units.
     * Animation lasts 350 ms with an ease-out curve.
     */
    function zoomToRect(rect, ms = 350) {
        // ▸ add a little padding in MIDI units:
        const padTicks = window.ticksPerBeat * 2; // 2 beats
        const padPitches = 10;                    // 2 semitone-rows

        // clamp into valid range
        const startTick = Math.max(0, rect.start - padTicks);
        const endTick = rect.end + padTicks;
        const lowPitch = Math.max(PITCH_MIN, rect.low - padPitches);
        const highPitch = Math.min(PITCH_MAX, rect.high + padPitches);

        const viewW = canvasContainer.clientWidth;
        const viewH = canvasContainer.clientHeight;

        // recompute targets using padded values
        const targetScaleX = viewW / ((endTick - startTick) * PIXELS_PER_TICK_BASE);
        const targetScaleY = viewH / ((highPitch - lowPitch + 1) * NOTE_BASE_HEIGHT);

        const nextScaleX = Math.max(0.005, Math.min(100, targetScaleX));
        const nextScaleY = Math.max(0.1, Math.min(20, targetScaleY));

        const targetOffsetX = startTick * PIXELS_PER_TICK_BASE * nextScaleX;
        const targetOffsetY = (PITCH_MAX - highPitch) * NOTE_BASE_HEIGHT * nextScaleY;

        // ─── animate ──────────────────────────────────────────────────────
        const start = performance.now();
        const s0x = scaleX, s0y = scaleY;
        const o0x = offsetX, o0y = offsetY;

        const easeOut = t => 1 - Math.pow(1 - t, 3);   // cubic ease-out

        (function step(tNow) {
            let t = (tNow - start) / ms;
            if (t >= 1) { t = 1; }           // clamp final frame

            const k = easeOut(t);
            scaleX = s0x + (nextScaleX - s0x) * k;
            scaleY = s0y + (nextScaleY - s0y) * k;
            offsetX = o0x + (targetOffsetX - o0x) * k;
            offsetY = o0y + (targetOffsetY - o0y) * k;

            clampOffsets();      // keep everything legal
            redrawPianoRoll();   // show progress

            if (t < 1) requestAnimationFrame(step);
        })(start);
    }



    /* ────────────────────────────────────────────────────────────────
     *           S  E  C  T  I  O  N    P  L  A  Y  B  A  C  K
     *           (only depends on generateAbcFromSelection…)
     * ──────────────────────────────────────────────────────────────── */
    let abcState = { synth: null, visual: null, isPlaying: false, totalMs: 0 };
    const playBtn = document.getElementById('play-selection');
    const loopChk = document.getElementById('loop-selection');
    const canvasBox = document.getElementById('canvas-container');
    /* ───────────────  new globals  ─────────────── */
    let playStartTick = 0;          // first note of current selection
    let playSpanTicks = 0;          // length in ticks of the selection
    let playheadProgress = null;    // null ⇢ not playing, else 0-1


    if (playBtn) playBtn.addEventListener('click', handlePlayClick);

    async function handlePlayClick() {


        if (abcState.isPlaying) {        // —— pause ——
            abcState.synth.pause();
            playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            abcState.isPlaying = false;
            return;
        }
        // —— first time (or after re-selection) build / prime synth ——
        if (!abcState.synth) {
            /* auto-select the active pattern if nothing is selected */
            if (selectedNotes.size === 0) {
                selectEntirePattern();          // ⬅️ new
                invalidateSynth();              // make sure an old synth is discarded
                redrawPianoRoll();              // show the auto-selection
            }
            const abc = generateAbcFromSelectionMultiVoice();
            if (!abc) { alert('Select one or more notes first.'); return; }

            // off-screen render -> visualObj (needed by CreateSynth)
            const tmp = document.createElement('div');
            tmp.style.position = 'absolute'; tmp.style.left = '-9999px';
            document.body.appendChild(tmp);
            const visArr = ABCJS.renderAbc(tmp, abc, {});
            document.body.removeChild(tmp);
            if (!visArr.length) { alert('ABC render failed'); return; }

            abcState.visual = visArr[0];
            abcState.synth = new ABCJS.synth.CreateSynth();
            await abcState.synth.init({
                visualObj: abcState.visual,
                options: {
                    loop: loopChk?.checked,
                    eventCallback: ev => {
                        if (!ev.milliseconds) return;
                        playheadProgress = ev.milliseconds / abcState.totalMs;   // 0-1
                        redrawPianoRoll();
                    },
                    onEndedCallback: () => {
                        // if (loopChk?.checked) return; // synth will restart itself
                        playheadProgress = null;
                        stopPlaybackUI();
                    }
                }
            });
            await abcState.synth.prime().then(r => abcState.totalMs = r.duration * 1000);
        }

        // —— (re)start ——
        abcState.synth.seek(0);
        abcState.synth.resume();
        abcState.isPlaying = true;
        abcState._playStartWallTime = performance.now();

        playBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');

        // kick off CSS key-frame on the red line
        const ticks = [...selectedNotes].map(k => {
            const { trackIndex, noteIndex } = JSON.parse(k);
            const n = rawTracksData[trackIndex].notes[noteIndex];
            return [n.start_tick, n.start_tick + n.duration_ticks];
        });
        // compute the first note tick
        const firstNoteTick = Math.min(...ticks.map(t => t[0]));
        // snap down to start of its measure/bar
        playStartTick = Math.floor(firstNoteTick / ticksPerMeasure) * ticksPerMeasure;
        // span still ends at last note
        // playSpanTicks = Math.max(...ticks.map(t => t[1])) - firstNoteTick;

        const lastNoteEnd = Math.max(...ticks.map(t => t[1]));
        playSpanTicks = lastNoteEnd - playStartTick;

        // **start our RAF loop**
        requestAnimationFrame(updatePlayheadLoop);



    }

    function updatePlayheadLoop() {
        if (!abcState.isPlaying) return;           // stop when paused/ended

        // how many ms since we hit “play”?
        const elapsedMs = performance.now() - abcState._playStartWallTime;
        // convert to a 0–1 fraction
        playheadProgress = Math.min(1, elapsedMs / abcState.totalMs);

        // redraw on every frame
        redrawPianoRoll();

        // queue the next frame
        requestAnimationFrame(updatePlayheadLoop);
    }


    function stopPlaybackUI() {
        abcState.isPlaying = false;
        playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
    }
    /*  🔸  invalidate previous synth when the selection changes  */
    function invalidateSynth() {
        if (abcState.synth) { abcState.synth.pause(); }
        abcState = { synth: null, visual: null, isPlaying: false, totalMs: 0 };
        stopPlaybackUI();
    }




    /**
     * ------------------------------------------------------------------
     * 1.  Which letters does the key-signature raise or lower?
     * ------------------------------------------------------------------
     * returns { sharps:Set<string>, flats:Set<string>, preferFlats:boolean }
     */
    function getKeyAccidentals(rootName, isMinor) {
        // ----- helpers -------------------------------------------------
        const NAME_TO_STEP = { C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, F: 5, 'E#': 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11 };
        const STEP_TO_MAJ = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
        const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
        const KEY_SIG = {                       // +n = n sharps, –n = n flats
            C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, 'C#': 7,
            F: -1, 'Bb': -2, 'Eb': -3, 'Ab': -4, 'Db': -5, 'Gb': -6, 'Cb': -7
        };

        rootName = rootName.trim();
        if (!(rootName in NAME_TO_STEP)) rootName = 'C';

        // relative major for minor keys
        let majStep = NAME_TO_STEP[rootName];
        if (isMinor) majStep = (majStep + 3) % 12;
        const majName = STEP_TO_MAJ[majStep];

        const count = KEY_SIG[majName] ?? 0;
        const sharps = new Set(), flats = new Set();
        if (count > 0) SHARP_ORDER.slice(0, count).forEach(l => sharps.add(l));
        if (count < 0) FLAT_ORDER.slice(0, -count).forEach(l => flats.add(l));

        return { sharps, flats, preferFlats: count < 0 };
    }


    /**
    * Lookup a track’s display name:
    * - If drum track → “Drums”
    * - Else if track.instrumentName set → use that
    * - Else if track.program (0–127) → GM_MELODY_MAP[program]
    * - Else fallback to rawTracksData[trackIndex].name or “TrackN”
    */
    function getTrackInstrumentName(track, index) {
        if (track.is_drum_track) return 'Drums';
        if (track.instrument) return track.instrument;
        if (typeof track.program === 'number' && GM_MELODY_MAP[track.program]) {
            return GM_MELODY_MAP[track.program];
        }
        if (track.name) return track.name;
        return `Track${index + 1}`;
    }

    function isDrumTrack(trackIndex) {
        return !!rawTracksData[trackIndex]?.is_drum_track;   // truthy ⇒ drum track
    }




    // --- Coordinate Transformation ---
    function midiTickToCanvasX(tick) {
        return (tick * PIXELS_PER_TICK_BASE * scaleX) - offsetX;
    }

    function midiPitchToCanvasY(pitch) {
        // Y grows downwards in canvas, pitch grows upwards. Return the TOP Y value for the pitch row.
        const yAtScale1 = (PITCH_MAX - pitch) * NOTE_BASE_HEIGHT;
        return (yAtScale1 * scaleY) - offsetY;
    }

    function canvasXToMidiTick(canvasX) {
        // Ensure scaleX is not zero to avoid division by zero
        const effectiveScaleX = PIXELS_PER_TICK_BASE * scaleX;
        if (effectiveScaleX === 0) return 0;
        return Math.max(0, (canvasX + offsetX) / effectiveScaleX); // Ensure non-negative ticks
    }

    function canvasYToMidiPitch(canvasY) {
        // Ensure scaleY is not zero
        if (scaleY === 0) return PITCH_MAX; // Or some default pitch
        const yAtScale1 = (canvasY + offsetY) / scaleY;
        // Use floor to determine which key row the Y coordinate falls into
        // This calculates the pitch whose *top* edge is at or above yAtScale1
        const pitch = PITCH_MAX - Math.floor(yAtScale1 / NOTE_BASE_HEIGHT);
        return Math.max(PITCH_MIN, Math.min(PITCH_MAX, pitch)); // Clamp to valid range [0, 127]
    }

    // --- Initialization ---
    function initialize() {

        // Inside initialize(), after getting other element references:
        scaleRootSelect = document.getElementById('scale-root-select');
        scaleTypeSelect = document.getElementById('scale-type-select');

        // Object.assign({ root: 0, scale: 'major', copyMode: 'range', snapMode: 'none' }, initial_settings)
        const init = JSON.parse(initial_settings);
        scaleRootSelect.value = selectedRootNote = init.root;
        scaleRootSelect.value = selectedRootNote = init.root;
        scaleTypeSelect.value = selectedScaleType = init.scale;
        document.getElementById('copy-mode-select').value = copyMode = init.copyMode;
        document.getElementById('snap-mode-select').value = snapMode = init.snapMode;
        updateCurrentScaleNotes();


        // hook every UI change
        scaleRootSelect.addEventListener('change', queueSave);
        scaleTypeSelect.addEventListener('change', queueSave);
        document.getElementById('copy-mode-select').addEventListener('change', queueSave);
        document.getElementById('snap-mode-select').addEventListener('change', queueSave);

        // Create the content wrapper for key display panel
        keyDisplayContentWrapper = document.createElement('div');
        keyDisplayContentWrapper.className = 'key-display-content';
        // Make its position relative so children can be absolute within it
        keyDisplayContentWrapper.style.position = 'relative';
        keyDisplayContentWrapper.style.width = '100%';
        keyDisplayContentWrapper.style.height = `${contentHeightPitches * NOTE_BASE_HEIGHT * scaleY}px`; // Initial height (will be updated on zoom)
        keyDisplayPanel.appendChild(keyDisplayContentWrapper);
        keyDisplayPanel.style.overflow = 'hidden'; // Crucial: Clip content moved by transform


        // Initialize track states (all visible by default)
        // trackStates = rawTracksData.map((_, index) => ({ isVisible: true }));
        // Initialize track states (load visibility + harmony)
        trackStates = rawTracksData.map((_, i) => {
            const base = makeDefaultTrackState();
            // if the server sent a harmony array, use it
            if (Array.isArray(init.harmony) && typeof init.harmony[i] === 'boolean') {
                base.isHarmony = init.harmony[i];
            }
            return base;
        });

        // NEW: sync up all of our UI with those loaded flags
        rebuildHarmonyChordMap();
        // update each track-list button class
        trackStates.forEach((_, idx) => updateHarmonyToggleButton(idx));

        // Set first track as active by default if tracks exist
        if (rawTracksData.length > 0) {
            setActiveTrack(0); // Activate the first track initially
        } else {
            updateTrackListHighlighting(); // Ensure no highlighting if no tracks
            trackListElement.innerHTML = '<li class="track-item disabled">No Tracks Loaded</li>'; // Inform user
        }
        // Recalculate ticksPerMeasure based on potentially updated globals
        ticksPerMeasure = window.ticksPerBeat * window.timeSignatureNumerator; // Ensure it's calculated
        console.log(`Initializing with Ticks/Measure: ${ticksPerMeasure}, Shade Even Measures: ${shadeEvenMeasures}`);


        calculateContentDimensions(); // Calculate initial content width/height
        setupEventListeners();
        resizeCanvas(); // Initial resize includes redraw
        // Calculate initial scale notes
        updateCurrentScaleNotes();


        SETTINGS_FILE = currentMidiFilename + '.json';


        /* -------- load any saved pattern definitions -------- */
        if (init.patterns) {
            init.patterns.forEach(p => {
                if (!Array.isArray(p.children)) p.children = [];
                patterns.set(p.id, p);
            });
        }
        // Collapse everything initially

        // collapse every node on startup
        collapsed = new Set(patterns.keys());
        rebuildPatternTree();          // paint the sidebar
        queueSave();                   // make sure root.range gets saved


        document.getElementById('toggle-chord-display')
            .addEventListener('click', () => {
                chordDisplayMode = (chordDisplayMode === CHORD_NAME)
                    ? CHORD_ROMAN : CHORD_NAME;
                redrawPianoRoll();
            });


        console.log("Piano roll initialized.");
    }


    // --- Canvas & Content Size ---
    function calculateContentDimensions() {
        let maxTick = 0;
        rawTracksData.forEach(track => {
            if (track.notes && track.notes.length > 0) {
                track.notes.forEach(note => {
                    maxTick = Math.max(maxTick, note.start_tick + note.duration_ticks);
                });
            }
        });
        contentWidthTicks = maxTick;
        // contentHeightPitches is constant (PITCH_RANGE)

        // Update key display content height based on current scaleY
        if (keyDisplayContentWrapper) {
            const totalPixelHeight = contentHeightPitches * NOTE_BASE_HEIGHT * scaleY;
            keyDisplayContentWrapper.style.height = `${totalPixelHeight}px`;
        }

        console.log(`Content dimensions: Ticks=${contentWidthTicks}, Pitches=${contentHeightPitches}`);
        clampOffsets(); // Recalculate clamping limits after content size changes
    }

    function resizeCanvas() {
        // Adjust canvas drawing buffer size for device pixel ratio and container size
        const dpr = window.devicePixelRatio || 1;
        // Use canvasContainer for size reference, as canvas itself might be styled differently initially
        const rect = canvasContainer.getBoundingClientRect();

        // Set logical canvas size (CSS pixels) to fill container
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // Set drawing buffer size
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        // Scale the context ONCE to logical pixels. All drawing happens in logical pixels.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        console.log(`Canvas resized: Display=${rect.width}x${rect.height}, Buffer=${canvas.width}x${canvas.height}, DPR=${dpr}`);

        // Crucially, update clamping and redraw AFTER resizing
        clampOffsets();
        redrawPianoRoll();
    }

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 150); // Debounce
    });


    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Track List Click Handler
        trackListElement.addEventListener('click', handleTrackListClick);

        // --- Canvas Event Handlers ---
        // Attach listeners DIRECTLY to the canvas element for simplicity
        canvas.addEventListener('wheel', handleWheel, { passive: false }); // passive: false to prevent page scroll
        canvas.addEventListener('mousedown', handleMouseDown);
        // Use WINDOW for mousemove and mouseup to capture drags outside canvas boundaries
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        // Still need mouseleave on canvas to reset cursor/state if mouse leaves *while not dragging*
        canvas.addEventListener('mouseleave', handleMouseLeaveCanvas);
        canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu

        window.addEventListener('keydown', handleKeyDown);

        if (scaleRootSelect && scaleTypeSelect) {
            scaleRootSelect.addEventListener('change', handleScaleChange);
            scaleTypeSelect.addEventListener('change', handleScaleChange);
        } else {
            // Listeners cannot be added if elements weren't found
        }
    }


    // --- Event Handlers ---

    function handleScaleChange(event) {
        console.log("Scale changed! Element:", event.target.id, "New value:", event.target.value); // DEBUG LINE

        // Update state from the UI elements
        selectedRootNote = parseInt(scaleRootSelect.value, 10);
        selectedScaleType = scaleTypeSelect.value;

        // Recalculate the notes in the scale
        updateCurrentScaleNotes();
        console.log("Updated currentScaleNotes:", currentScaleNotes); // DEBUG LINE
        queueSave();     // persist the new preference

        // Redraw everything to reflect the change
        redrawPianoRoll();
    }
    function toggleTrackHarmony(index) {
        if (index < 0 || index >= trackStates.length) return;
        trackStates[index].isHarmony = !trackStates[index].isHarmony;
        updateHarmonyToggleButton(index);
        rebuildHarmonyChordMap();          // ← section 3
        redrawPianoRoll();
        queueSave();
    }
    function updateHarmonyToggleButton(index) {
        const li = trackListElement.querySelector(`.track-item[data-track-index="${index}"]`);
        li.classList.toggle('harmony', trackStates[index].isHarmony);
    }


    function handleTrackListClick(event) {
        const trackItem = event.target.closest('.track-item');
        if (!trackItem || trackItem.classList.contains('disabled')) return; // Ignore disabled items

        const trackIndex = parseInt(trackItem.dataset.trackIndex, 10);
        if (isNaN(trackIndex)) return; // Should not happen with valid data-* attributes

        // Check if the visibility toggle icon or its parent button was clicked
        if (event.target.closest('.visibility-toggle')) {
            toggleTrackVisibility(trackIndex);
        } else if (event.target.closest('.harmony-toggle')) {
            toggleTrackHarmony(trackIndex);
        } else {
            // Otherwise, assume click on the item selects the track
            setActiveTrack(trackIndex);
        }
    }

    function handleWheel(event) {
        event.preventDefault(); // Prevent default page scroll

        const rect = canvas.getBoundingClientRect(); // Use canvas for relative coords
        const mouseX = event.clientX - rect.left; // Mouse X relative to canvas logical pixels
        const mouseY = event.clientY - rect.top;  // Mouse Y relative to canvas logical pixels

        const zoomIntensity = 0.1; // How much each wheel tick zooms
        const delta = -Math.max(-1, Math.min(1, (event.deltaY || -event.detail || event.wheelDelta)));
        const zoomFactor = 1 + delta * zoomIntensity;

        // --- Store old values ---
        const oldScaleX = scaleX;
        const oldScaleY = scaleY;
        const oldOffsetX = offsetX;
        const oldOffsetY = offsetY;

        // --- Calculate pointer position in content space BEFORE zoom ---
        // Horizontal: MIDI Tick under the mouse
        const pointerTickBefore = (mouseX + oldOffsetX) / (PIXELS_PER_TICK_BASE * oldScaleX);
        // Vertical: Y position in the conceptual full-height (scale=1) content, relative to the top (Pitch MAX)
        const pointerYAtScale1 = (mouseY + oldOffsetY) / oldScaleY;

        if (event.ctrlKey || event.metaKey) { // --- Vertical Zoom ---
            scaleY *= zoomFactor;
            scaleY = Math.max(0.1, Math.min(20, scaleY)); // Clamp vertical zoom

            // Adjust offsetY to keep the point under the mouse stationary
            // offsetY_new = pointerYAtScale1 * scaleY_new - mouseY
            offsetY = pointerYAtScale1 * scaleY - mouseY;

            // Update key display wrapper height after vertical zoom
            if (keyDisplayContentWrapper) {
                const totalPixelHeight = contentHeightPitches * NOTE_BASE_HEIGHT * scaleY;
                keyDisplayContentWrapper.style.height = `${totalPixelHeight}px`;
            }

        } else { // --- Horizontal Zoom ---
            scaleX *= zoomFactor;
            scaleX = Math.max(0.005, Math.min(100, scaleX)); // Clamp horizontal zoom

            // Adjust offsetX to keep the MIDI tick under the mouse stationary
            // offsetX_new = pointerTickBefore * new_tick_width - mouseX
            offsetX = pointerTickBefore * PIXELS_PER_TICK_BASE * scaleX - mouseX;
        }

        // --- Clamp offsets and redraw ---
        clampOffsets(); // Ensure offsets stay within bounds (this also syncs key display transform)
        redrawPianoRoll(); // Redraw with new viewport
    }


    function handleMouseDown(event) {
        // Only process left (0) and middle (1) mouse buttons
        if (event.button !== 0 && event.button !== 1) return;

        invalidateSynth();
        canvas.focus();

        const rect = canvas.getBoundingClientRect();
        const startX = event.clientX - rect.left;
        const startY = event.clientY - rect.top;
        const shiftKey = event.shiftKey;

        if (event.button === 1) {
            // Middle-mouse panning
            isPanning = true;
            dragStartX = startX;
            dragStartY = startY;
            dragStartOffsetX = offsetX;
            dragStartOffsetY = offsetY;
            canvas.style.cursor = 'grabbing';
            return;
        }

        // At this point we know it's a left click
        const clickedNoteRef = findNoteAtCanvasCoords(startX, startY);

        // 1) If we're in repeat/variation mode, always consume the click here
        if (patternActionMode) {
            const patHit = patternAtCanvasXY(startX, startY);
            if (patHit && patHit.id !== ROOT_ID) {
                if (patternActionMode === 'repeat') {
                    makeRepeatOf(patHit);
                    hideOverlay();
                }
                else if (patternActionMode === 'variation') {
                    makeVariationOf(patHit);
                    hideOverlay();
                }
                else if (patternActionMode === 'remapVariant') {
                    if (remapState.step === 0) {
                        // first click: pick the variant to remap
                        remapState.sourceId = patHit.id;
                        remapState.step = 1;
                        showOverlay('click source node');
                    } else {
                        // second click: pick the new source
                        const srcPat = patterns.get(remapState.sourceId);
                        srcPat.variantOf = patHit.id;
                        srcPat.variantOfName = patHit.name;
                        srcPat.isVariation = true;
                        // cleanup & redraw/save
                        remapState = { step: 0, sourceId: null };
                        patternActionMode = null;
                        hideOverlay();
                        rebuildPatternTree();
                        queueSave();
                        redrawPianoRoll();
                    }
                } else if (patternActionMode === 'remapRepeat') {
                    if (remapState.step === 0) {
                        remapState.sourceId = patHit.id;
                        remapState.step = 1;
                        showOverlay('click new source pattern');
                    } else {
                        // second click: validate that the chosen patHit is actually the thing this rep repeats
                        const srcId = remapState.sourceId;
                        const src = patterns.get(srcId);
                        const parent = patterns.get(src.parentId);
                        // look for an exact repeat of patHit under its parent
                        const hits = findRepeatsOfPattern(patHit, parent);
                        const match = hits.find(h =>
                            h.range.start === src.range.start &&
                            h.range.end === src.range.end
                        );
                        if (!match) {
                            alert(`“${src.name}” does not exactly repeat “${patHit.name}”.`);
                            return;
                        }
                        // OK—remap it
                        src.variantOf = patHit.id;
                        src.variantOfName = patHit.name;
                        src.isRepetition = true;
                        src.isVariation = false;

                        // cleanup & redraw/save
                        remapState = { step: 0, sourceId: null };
                        patternActionMode = null;
                        hideOverlay();
                        rebuildPatternTree();
                        queueSave();
                        redrawPianoRoll();
                    }
                }

            }
            return;
        }

        // 2) Normal mode: clicking empty canvas on a pattern zooms you there
        if (!clickedNoteRef) {
            const patHit = patternAtCanvasXY(startX, startY);
            if (patHit && patHit.id !== activePatternId) {
                setActivePattern(patHit.id);
                return;
            }
        }

        // 3) Else if you clicked an already-selected note → start moving
        if (clickedNoteRef && selectedNotes.has(JSON.stringify(clickedNoteRef))) {
            isMovingNotes = true;
            noteMoveData.startCanvasX = startX;
            noteMoveData.startCanvasY = startY;
            noteMoveData.currentCanvasX = startX;
            noteMoveData.currentCanvasY = startY;
            noteMoveData.deltaTick = 0;
            noteMoveData.deltaPitch = 0;
            noteMoveData.originalNotes = [];
            selectedNotes.forEach(key => {
                const ref = JSON.parse(key);
                const n = rawTracksData[ref.trackIndex].notes[ref.noteIndex];
                noteMoveData.originalNotes.push({
                    trackIndex: ref.trackIndex,
                    noteIndex: ref.noteIndex,
                    originalTick: n.start_tick,
                    originalPitch: n.pitch
                });
            });
            canvas.style.cursor = 'move';
            return;
        }

        // 4) Otherwise: selection or click-to-select
        if (!shiftKey) selectedNotes.clear();

        if (clickedNoteRef) {
            // click on a new note: toggle or add to selection
            const noteKey = JSON.stringify(clickedNoteRef);
            if (shiftKey && selectedNotes.has(noteKey)) {
                selectedNotes.delete(noteKey);
            } else {
                selectedNotes.add(noteKey);
            }
            // prepare to drag immediately
            isMovingNotes = true;
            noteMoveData.startCanvasX = startX;
            noteMoveData.startCanvasY = startY;
            noteMoveData.currentCanvasX = startX;
            noteMoveData.currentCanvasY = startY;
            noteMoveData.deltaTick = 0;
            noteMoveData.deltaPitch = 0;
            noteMoveData.originalNotes = [];
            selectedNotes.forEach(key => {
                const ref = JSON.parse(key);
                const n = rawTracksData[ref.trackIndex].notes[ref.noteIndex];
                noteMoveData.originalNotes.push({
                    trackIndex: ref.trackIndex,
                    noteIndex: ref.noteIndex,
                    originalTick: n.start_tick,
                    originalPitch: n.pitch
                });
            });
            canvas.style.cursor = 'move';
            redrawPianoRoll();
            return;
        }

        // 5) Click on empty space → start box select
        isSelecting = true;
        selectionRect = { x1: startX, y1: startY, x2: startX, y2: startY };
        isMovingNotes = false;
        canvas.style.cursor = 'crosshair';
        redrawPianoRoll();
    }


    function handleMouseMove(event) {
        // Throttle redraws during mouse move for performance
        const now = performance.now();
        if (now - lastMouseMoveTime < 16) { // Roughly 60fps limit
            //return; // Skip if too soon - This might feel laggy, remove if needed
        }
        lastMouseMoveTime = now;

        // Calculate mouse position relative to canvas, but only if needed
        let mouseX = 0;
        let mouseY = 0;
        let rect = null; // Cache rect

        if (isPanning || isSelecting || isMovingNotes || !document.hidden) { // Only calc if interacting or window visible
            rect = canvas.getBoundingClientRect();
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
        }

        if (isPanning) {
            const dx = mouseX - dragStartX;
            const dy = mouseY - dragStartY;
            offsetX = dragStartOffsetX - dx;
            offsetY = dragStartOffsetY - dy;
            clampOffsets();
            redrawPianoRoll(); // Redraw needed for panning
        } else if (isSelecting) {
            selectionRect.x2 = mouseX;
            selectionRect.y2 = mouseY;
            redrawPianoRoll(); // Redraw to show selection rect extending
        } else if (isMovingNotes && selectedNotes.size > 0) {
            noteMoveData.currentCanvasX = mouseX;
            noteMoveData.currentCanvasY = mouseY;

            const deltaCanvasX = noteMoveData.currentCanvasX - noteMoveData.startCanvasX;
            const deltaCanvasY = noteMoveData.currentCanvasY - noteMoveData.startCanvasY;

            // Convert canvas delta to MIDI delta (using canvas scale)
            const currentDeltaTick = deltaCanvasX / (PIXELS_PER_TICK_BASE * scaleX);
            // Vertical delta needs negation; round to nearest pitch step
            const currentDeltaPitch = -Math.round(deltaCanvasY / (NOTE_BASE_HEIGHT * scaleY));

            // Only update and redraw if the effective MIDI delta has changed
            if (currentDeltaTick !== noteMoveData.deltaTick || currentDeltaPitch !== noteMoveData.deltaPitch) {
                noteMoveData.deltaTick = currentDeltaTick;
                noteMoveData.deltaPitch = currentDeltaPitch;

                // Apply delta to all selected notes in the actual data model
                noteMoveData.originalNotes.forEach(orig => {
                    const note = rawTracksData[orig.trackIndex]?.notes[orig.noteIndex];
                    if (note) {
                        // Calculate new values (add snapping logic here if desired)
                        // Example: Snap horizontal movement to nearest 16th note?
                        // const sixteenthNoteTicks = ticksPerBeat / 4;
                        // const snappedTick = Math.max(0, Math.round((orig.originalTick + noteMoveData.deltaTick) / sixteenthNoteTicks) * sixteenthNoteTicks);
                        // const newTick = Math.max(0, Math.round(orig.originalTick + noteMoveData.deltaTick)); // Simple rounding for now
                        const raw = orig.originalTick + noteMoveData.deltaTick;
                        const newTick = Math.max(0, snapTick(raw));

                        const newPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, orig.originalPitch + noteMoveData.deltaPitch)); // Clamp pitch

                        note.start_tick = newTick;
                        note.pitch = newPitch;
                    }
                });
                redrawPianoRoll(); // Redraw to show notes moving
            }
        } else if (rect) { // Not dragging, update cursor based on hover
            const hoverNoteRef = findNoteAtCanvasCoords(mouseX, mouseY);
            if (hoverNoteRef) {
                const key = JSON.stringify(hoverNoteRef);
                canvas.style.cursor = selectedNotes.has(key) ? 'move' : 'pointer'; // Show move if hovering selected, pointer otherwise
            } else {
                canvas.style.cursor = 'default';
            }
        }
    }

    function handleMouseUp(event) {
        // This listener is on window, check button if needed
        if (event.button === 1 && isPanning) { // Middle mouse button release
            isPanning = false;
            canvas.style.cursor = 'default'; // Reset cursor (check hover state?)
        } else if (event.button === 0) { // Left mouse button release
            if (isSelecting) {
                isSelecting = false;
                // Finalize selection based on rect coordinates (already in canvas space)
                const finalRect = {
                    x1: Math.min(selectionRect.x1, selectionRect.x2),
                    y1: Math.min(selectionRect.y1, selectionRect.y2),
                    x2: Math.max(selectionRect.x1, selectionRect.x2),
                    y2: Math.max(selectionRect.y1, selectionRect.y2)
                };
                selectNotesInRect(finalRect, event.shiftKey); // Pass shiftKey state
                selectionRect = null; // Clear rect
                canvas.style.cursor = 'default'; // Reset cursor (check hover state?)
                redrawPianoRoll(); // Update visuals
            } else if (isMovingNotes) {
                isMovingNotes = false;
                // Data was already modified during move.
                // Optional: Final snap? Recalculate bounds? Trigger save state for undo?
                calculateContentDimensions(); // Recalculate content width in case notes moved far right
                noteMoveData.originalNotes = []; // Clear move data

                // Reset cursor based on current hover state
                const rect = canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                const hoverNoteRef = findNoteAtCanvasCoords(mouseX, mouseY);
                if (hoverNoteRef) {
                    const key = JSON.stringify(hoverNoteRef);
                    canvas.style.cursor = selectedNotes.has(key) ? 'move' : 'pointer';
                } else {
                    canvas.style.cursor = 'default';
                }
                // No final redraw needed here usually as mouseMove handles it, unless snapping logic runs on mouseUp
                // redrawPianoRoll();
            }
        }
    }

    /** Return the parent’s name plus an appropriate number of primes ( ' )   */
    function nextVariationName(parentPat) {
        // count *existing* variations of this master
        const existing = parentPat.children
            .map(id => patterns.get(id))
            .filter(p => p?.isVariation && p.variantOf === parentPat.id).length;

        return parentPat.name + "'".repeat(existing + 1);
    }

    /** Deduplicate true octave-duplicates:
     *  for any group of notes with the same pitch-class,
     *  keep the single “best” one (longest → loudest → lowest). */
    function removeOctaveDoubles(notes) {
        const best = new Map();  // pc → note
        notes.forEach(n => {
            const pc = n.pitch % 12;
            if (!best.has(pc)) {
                best.set(pc, n);
                return;
            }
            const cur = best.get(pc);
            if (n.duration_ticks > cur.duration_ticks) {
                best.set(pc, n);
            } else if (n.duration_ticks === cur.duration_ticks) {
                if (n.velocity > cur.velocity) {
                    best.set(pc, n);
                } else if (n.velocity === cur.velocity && n.pitch < cur.pitch) {
                    best.set(pc, n);
                }
            }
        });
        return Array.from(best.values());
    }


    /** Collapse chords: for each distinct start_tick keep **one** note –
 *  the highest pitch.  */
    function keepHighestPerOnset(notes) {
        const best = new Map();               // start_tick → note
        notes.forEach(n => {
            const key = n.start_tick;         // exact MIDI onset
            if (!best.has(key) || n.pitch > best.get(key).pitch) {
                best.set(key, n);
            }
        });
        return Array.from(best.values());
    }

    async function blandifyToplineSelectionAndCopy() {
        if (selectedNotes.size === 0) return;

        const TPB = window.ticksPerBeat || 480;
        const EIGHTH = TPB / 2;

        // 1. Gather original selection
        const pool = [];
        selectedNotes.forEach(k => {
            const { trackIndex, noteIndex } = JSON.parse(k);
            const n = rawTracksData[trackIndex].notes[noteIndex];
            pool.push({
                trackIndex,
                pitch: n.pitch,
                start_tick: n.start_tick,
                duration_ticks: n.duration_ticks,
                velocity: n.velocity
            });
        });
        if (!pool.length) return;

        // helper: chord-tones at a given tick
        const chordToneSet = tick => {
            const seg = chordSegments.find(s => tick >= s.start && tick < s.end);
            return seg ? new Set(seg.pcs) : currentScalePitchClasses;
        };

        const scaleToneSet = () => currentScalePitchClasses;


        // 2. Keep only the highest note per exact onset
        const topline = keepHighestPerOnset(pool);

        // 3. Bucket by beat → quantise / octave-dedupe / snap
        const bucket = new Map();  // beatIdx → [note…]
        topline.forEach(n => {
            const beat = Math.floor(n.start_tick / TPB);
            if (!bucket.has(beat)) bucket.set(beat, []);
            bucket.get(beat).push(Object.assign({}, n)); // clone
        });

        let blandified = [];
        bucket.forEach((arr0, beatIdx) => {
            const beatStart = beatIdx * TPB;

            // a) quantise to beat / 8th
            let arr = arr0.map(n => {
                n.start_tick = beatStart;
                n.duration_ticks = Math.max(EIGHTH,
                    Math.round(n.duration_ticks / EIGHTH) * EIGHTH);
                return n;
            });

            // b) remove octave-doubles
            arr = removeOctaveDoubles(arr);

            // c) snap non–chord-tones to nearest chord-tone
            const pcs = chordToneSet(beatStart);
            arr.forEach(n => {
                if (!pcs.has(n.pitch % 12)) {
                    const base = Math.round(n.pitch / 12) * 12;
                    const candidates = [...pcs].flatMap(pc => [
                        base + pc,
                        base + pc + 12,
                        base + pc - 12
                    ]);
                    n.pitch = candidates.reduce((best, cand) =>
                        Math.abs(cand - n.pitch) < Math.abs(best - n.pitch)
                            ? cand : best,
                        n.pitch);
                }
                // snap any non-scale tone to nearest scale tone
                if (!scaleToneSet().has(n.pitch % 12)) {
                    const base = Math.round(n.pitch / 12) * 12;
                    const candidates = [...scaleToneSet()].flatMap(pc => [
                        base + pc,
                        base + pc + 12,
                        base + pc - 12
                    ]);
                    n.pitch = candidates.reduce((best, cand) =>
                        Math.abs(cand - n.pitch) < Math.abs(best - n.pitch) ? cand : best,
                        n.pitch
                    );
                }
                blandified.push(n);
            });
        });

        if (!blandified.length) { console.warn('Nothing after blandify'); return; }

        // ── NEW STEP: collapse any simultaneities introduced above
        blandified = keepHighestPerOnset(blandified);

        // 4. Materialize virtual tracks for ABC helper
        const virtualMap = new Map(); // origTrack → virtualIdx
        blandified.forEach(n => {
            if (!virtualMap.has(n.trackIndex)) {
                const base = rawTracksData[n.trackIndex];
                rawTracksData.push({
                    name: base.name || 'Topline',
                    is_drum_track: base.is_drum_track,
                    program: base.program,
                    instrument: base.instrument,
                    clef: base.clef,
                    notes: []
                });
                virtualMap.set(n.trackIndex, rawTracksData.length - 1);
            }
            const vti = virtualMap.get(n.trackIndex);
            rawTracksData[vti].notes.push({
                pitch: n.pitch,
                start_tick: n.start_tick,
                duration_ticks: n.duration_ticks,
                velocity: n.velocity
            });
        });

        // 5. Select those virtual notes & export
        selectedNotes.clear();
        virtualMap.forEach(vti => {
            rawTracksData[vti].notes.forEach((_, ni) => {
                selectedNotes.add(JSON.stringify({ trackIndex: vti, noteIndex: ni }));
            });
        });

        const abcBody = generateAbcFromSelectionMultiVoice('Topline Blandified');
        selectedNotes.clear();

        // 6. Cleanup virtual tracks (descending indices)
        Array.from(virtualMap.values())
            .sort((a, b) => b - a)
            .forEach(idx => rawTracksData.splice(idx, 1));

        if (!abcBody) {
            console.warn('No ABC generated');
            return;
        }
        const wrapped = `<abc>\n${abcBody.trim()}\n</abc>`;
        try {
            await navigator.clipboard.writeText(wrapped);
            console.log('Top-line blandified ABC copied:\n', wrapped);
        } catch (e) {
            console.error('Clipboard write failed', e);
        }
    }





    /** Blandify & copy the current selection without losing intervals:
     *  • quantise starts to beats, durations to 8ths
     *  • remove octave-duplicates only
     *  • snap every note to the nearest chord-tone
     *  • preserve all remaining simultaneities
     *  • copy as <abc>…</abc>
     */
    async function blandifySelectionAndCopy() {
        if (selectedNotes.size === 0) return;

        const TPB = window.ticksPerBeat || 480;
        const EIGHTH = TPB / 2;

        // — collect originals —
        const originals = [];
        selectedNotes.forEach(k => {
            const { trackIndex, noteIndex } = JSON.parse(k);
            const n = rawTracksData[trackIndex].notes[noteIndex];
            originals.push({
                trackIndex,
                pitch: n.pitch,
                start_tick: n.start_tick,
                duration_ticks: n.duration_ticks,
                velocity: n.velocity
            });
        });

        // helper: chord tones at a given tick
        const chordToneSet = tick => {
            const seg = chordSegments.find(s => tick >= s.start && tick < s.end);
            return seg ? new Set(seg.pcs) : currentScalePitchClasses;
        };

        // bucket by beat
        const bucket = new Map();  // beatIdx → [note,…]
        originals.forEach(n => {
            const beat = Math.floor(n.start_tick / TPB);
            if (!bucket.has(beat)) bucket.set(beat, []);
            bucket.get(beat).push(Object.assign({}, n)); // clone
        });

        // process each beat
        const blandified = [];
        bucket.forEach((beatArr, beatIdx) => {
            const beatStart = beatIdx * TPB;
            let arr = beatArr.map(n => {
                // quantise
                n.start_tick = beatStart;
                n.duration_ticks = Math.max(EIGHTH,
                    Math.round(n.duration_ticks / EIGHTH) * EIGHTH);
                return n;
            });

            // strip octave-duplicates only
            arr = removeOctaveDoubles(arr);

            // snap each note to chord-tone if needed
            const pcs = chordToneSet(beatStart);
            arr.forEach(n => {
                if (!pcs.has(n.pitch % 12)) {
                    // find nearest chord-tone
                    const octBase = Math.round(n.pitch / 12) * 12;
                    const candidates = Array.from(pcs).flatMap(pc => [
                        octBase + pc,
                        octBase + pc + 12,
                        octBase + pc - 12
                    ]);
                    // pick closest
                    n.pitch = candidates.reduce((best, cand) =>
                        Math.abs(cand - n.pitch) < Math.abs(best - n.pitch) ? cand : best,
                        n.pitch);
                }
                blandified.push(n);
            });
        });

        if (!blandified.length) {
            console.warn('Nothing left after blandify');
            return;
        }

        // — build temporary tracks for the ABC helper —
        const virtualMap = new Map(); // origTrack → virtualIndex
        blandified.forEach(n => {
            if (!virtualMap.has(n.trackIndex)) {
                const base = rawTracksData[n.trackIndex];
                const vt = {
                    name: base.name || 'Blandified',
                    is_drum_track: base.is_drum_track,
                    program: base.program,
                    instrument: base.instrument,
                    clef: base.clef,
                    notes: []
                };
                rawTracksData.push(vt);
                virtualMap.set(n.trackIndex, rawTracksData.length - 1);
            }
            const vti = virtualMap.get(n.trackIndex);
            rawTracksData[vti].notes.push({
                pitch: n.pitch,
                start_tick: n.start_tick,
                duration_ticks: n.duration_ticks,
                velocity: n.velocity
            });
        });

        // — select the virtual notes —
        selectedNotes.clear();
        virtualMap.forEach((vti, origTi) => {
            rawTracksData[vti].notes.forEach((_, ni) => {
                selectedNotes.add(JSON.stringify({ trackIndex: vti, noteIndex: ni }));
            });
        });

        // — generate & copy ABC —
        const abcBody = generateAbcFromSelectionMultiVoice('Blandified Snippet');
        selectedNotes.clear();

        // — clean up virtual tracks (highest indices first) —
        Array.from(virtualMap.values())
            .sort((a, b) => b - a)
            .forEach(idx => rawTracksData.splice(idx, 1));

        if (!abcBody) {
            console.warn('No ABC generated');
            return;
        }
        const wrapped = `<abc>\n${abcBody.trim()}\n</abc>`;
        try {
            await navigator.clipboard.writeText(wrapped);
            console.log('Blandified ABC copied:\n', wrapped);
        } catch (e) {
            console.error('Clipboard write failed', e);
        }
    }



    function handleMouseLeaveCanvas(event) {
        // If mouse leaves canvas *while not interacting*, reset cursor
        if (!isPanning && !isSelecting && !isMovingNotes) {
            canvas.style.cursor = 'default';
        }
        // If mouse leaves the window during interaction, handleMouseUp on window will catch it.
        // If mouse leaves canvas but stays in window during interaction, mouseMove continues.
    }

    // --- NEW: KeyDown Handler for Copy ---
    function handleKeyDown(event) {
        // —— Space: play/pause ——  
        if (event.code === 'Space') {
            event.preventDefault();
            handlePlayClick();
            return;
        }

        // —— Shift B: keep highest-note + blandify & copy ——
        if ((event.shiftKey) && event.key.toLowerCase() === 'b') {
            if (selectedNotes.size > 0) {
                event.preventDefault();
                blandifyToplineSelectionAndCopy();
            }
            return;
        }


        // —— Ctrl+B (or Cmd+B): blandify-and-copy ——  
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
            if (selectedNotes.size > 0) {
                event.preventDefault();
                blandifySelectionAndCopy();
            } else {
                console.log('Ctrl+B pressed, but no notes selected.');
            }
            return;
        }

        // —— Shift+C: create one instrument-pattern per instrument under each child pattern ——
        if (!event.repeat && event.shiftKey && event.key.toLowerCase() === 'c') {
            event.preventDefault();
            createInstrumentPatternsForChildren();
            return;
        }
        // —— Ctrl + Shift + R  :  auto-detect repetitions inside the active pattern ——
        if ((event.ctrlKey || event.metaKey) && event.shiftKey &&
            event.key.toLowerCase() === 'r') {
            event.preventDefault();
            detectInternalRepetitions();
            return;
        }


        // ── Shift+R: remap an existing repetition’s source ──
        if (!event.repeat && event.shiftKey && event.key.toLowerCase() === 'r') {
            event.preventDefault();
            remapState = { step: 0, sourceId: null };
            patternActionMode = 'remapRepeat';
            showOverlay('choose repetition node to remap source');
            return;
        }
        // ── Shift+V: remap an existing variant’s source ──
        if (!event.repeat && event.shiftKey && event.key.toLowerCase() === 'v') {
            event.preventDefault();
            remapState = { step: 0, sourceId: null };
            patternActionMode = 'remapVariant';
            showOverlay('choose variant node to remap source');
            return;
        }



        // —— 'R': mark selected notes as a repeat; next sidebar-click chooses the master pattern ——  
        if (!event.repeat && event.key.toLowerCase() === 'r') {
            variationBaseId = activePatternId;      // remember what “folder” we’re in
            if (!selectedNotes.size) {
                alert('Select the section you want to mark as a repeat.');
                return;
            }
            patternActionMode = 'repeat';
            showOverlay('choose the master pattern these notes repeat');
            return;
        }

        // —— 'V': mark selected notes as a variation; next sidebar-click chooses the parent pattern ——  
        if (!event.repeat && event.key.toLowerCase() === 'v') {
            variationBaseId = activePatternId;      // remember what “folder” we’re in
            if (!selectedNotes.size) {
                alert('Select the section you want to mark as a variation.');
                return;
            }
            patternActionMode = 'variation';
            showOverlay('choose the pattern these notes vary');
            return;
        }

        // —— 'P': prompt for a new pattern name ——  
        if (!event.repeat && event.key.toLowerCase() === 'p') {
            variationBaseId = activePatternId;      // remember what “folder” we’re in
            if (selectedNotes.size) {
                const nm = prompt('Name this pattern:');
                if (nm) addPattern(nm.trim());
            }
            return;
        }

        // —— Ctrl+C (or Cmd+C): copy multi-voice ABC ——  
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            if (selectedNotes.size > 0) {
                event.preventDefault();
                copySelectionToAbc();
            } else {
                console.log('Ctrl+C pressed, but no notes selected.');
            }
            return;
        }

        // ── Allow Esc to cancel repeat/variation mode ──
        if (event.key === 'Escape') {
            if (patternActionMode) {
                patternActionMode = null;
                hideOverlay();
            }
            variationBaseId = null;
            return;
        }

        // (Other shortcuts can go here…)
    }

    // ─── Remap “variantOf” state ───
    let remapState = { step: 0, sourceId: null };


    function createInstrumentPatternsForChildren() {
        const parentId = activePatternId;
        const parentPat = patterns.get(parentId);
        if (!parentPat) return;

        // Map of “childId|groupKey” → newly created pattern id
        const created = new Map();

        // helper: group a trackIndex into 'DRUMS' or itself
        const groupKey = ti => isDrumTrack(ti) ? 'DRUMS' : String(ti);

        // helper: compute bounding rect of NOTES matching trackIndices within a pattern
        const rangeFor = (pat, trackIndices) => {
            let start = Infinity, end = 0, low = Infinity, high = 0;
            rawTracksData.forEach((trk, ti) => {
                if (!trackIndices.includes(ti)) return;
                trk.notes.forEach(n => {
                    if (noteInPattern(n, pat, ti)) {
                        start = Math.min(start, n.start_tick);
                        end = Math.max(end, n.start_tick + n.duration_ticks) - 1;
                        low = Math.min(low, n.pitch);
                        high = Math.max(high, n.pitch);
                    }
                });
            });
            return { start, end, low, high };
        };

        // --- First pass: create plain instrument patterns under each child ---
        parentPat.children.forEach(childId => {
            const child = patterns.get(childId);
            if (!child) return;

            // group its instruments
            const groups = [...new Set(child.instruments.map(groupKey))];
            groups.forEach(gk => {
                // derive which raw track-indices belong to this group
                const tis = child.instruments.filter(ti => groupKey(ti) === gk);
                const rect = rangeFor(child, tis);
                if (rect.start === Infinity) return;  // no notes for this instrument

                const name = (gk === 'DRUMS')
                    ? 'Drums'
                    : getTrackInstrumentName(rawTracksData[+gk], +gk);

                const id = crypto.randomUUID();
                const pat = {
                    id,
                    name,
                    parentId: childId,
                    range: rect,
                    mode: child.mode,
                    instruments: tis,
                    children: []
                };
                patterns.set(id, pat);
                child.children.push(id);
                created.set(`${childId}|${gk}`, id);
            });
        });

        // --- Second pass: for any variant-children, mark their new sub-patterns as variants of the source ones ---
        parentPat.children.forEach(childId => {
            const child = patterns.get(childId);
            if (!child || !child.variantOf) return;
            const srcId = child.variantOf;
            const groups = [...new Set(child.instruments.map(groupKey))];
            groups.forEach(gk => {
                const thisNewId = created.get(`${childId}|${gk}`);
                const srcNewId = created.get(`${srcId}|${gk}`);
                if (thisNewId && srcNewId) {
                    const np = patterns.get(thisNewId);
                    np.isVariation = true;
                    np.variantOf = srcNewId;
                    np.variantOfName = patterns.get(srcNewId).name;
                }
            });
        });

        rebuildPatternTree();
        queueSave();
        redrawPianoRoll();
    }


    function notesInsidePattern(pat) {
        const arr = [];
        rawTracksData.forEach((trk, ti) => {
            trk.notes.forEach((note, ni) => {
                if (noteInPattern(note, pat, ti)) {
                    arr.push({ trackIndex: ti, noteIndex: ni });
                }
            });
        });
        return arr;
    }

    // --- Selection Logic ---
    function findNoteAtCanvasCoords(canvasX, canvasY) {
        // Determine the pitch corresponding to the Y coordinate
        const targetPitch = canvasYToMidiPitch(canvasY);

        // Iterate through VISIBLE tracks first
        for (let ti = 0; ti < trackStates.length; ti++) {
            if (!trackStates[ti].isVisible) continue;

            const track = rawTracksData[ti];
            if (!track || !track.notes) continue;

            // Iterate backwards through notes in the track for correct Z-order (topmost first)
            for (let ni = track.notes.length - 1; ni >= 0; ni--) {
                const note = track.notes[ni];

                // Quick pitch check first - reduces calculations
                if (note.pitch !== targetPitch) continue;

                // Calculate note bounds in canvas coordinates using current viewport
                const noteX = midiTickToCanvasX(note.start_tick);
                const noteY = midiPitchToCanvasY(note.pitch); // Top Y of the note row
                const noteW = note.duration_ticks * PIXELS_PER_TICK_BASE * scaleX;
                const noteH = NOTE_BASE_HEIGHT * scaleY; // Full height of the row for clicking

                // Check for collision (consider rounding/edge cases)
                // Use Math.max(1, noteW) to ensure very short notes are clickable
                if (canvasX >= noteX && canvasX < noteX + Math.max(1, noteW) &&
                    canvasY >= noteY && canvasY < noteY + noteH) // Check within the full row height
                {
                    // Found a note! Return its reference. Active track notes checked first if z-order matters more.
                    // If priority should be given to active track notes:
                    // Consider two loops: one for active track, one for others.
                    // For now, simple Z-order (last drawn = topmost) is handled by iterating track notes backwards.
                    return { trackIndex: ti, noteIndex: ni };
                }
            }
        }
        return null; // No note found at these coordinates
    }

    function selectNotesInRect(rect, shiftKeyHeld) { // rect is in canvas coordinates
        if (!rect) return;

        const parentPat = patterns.get(activePatternId);

        const rawStart = canvasXToMidiTick(rect.x1);
        const rawEnd = canvasXToMidiTick(rect.x2);
        let startTick = snapTick(Math.min(rawStart, rawEnd));
        let endTick = snapTick(Math.max(rawStart, rawEnd)) - 1;

        lastBoxRange.start = startTick;
        lastBoxRange.end = endTick;


        // // Convert selection rect from canvas coords to MIDI coords
        // const startTick = canvasXToMidiTick(rect.x1);
        // const endTick = canvasXToMidiTick(rect.x2);
        // Remember: Lower Y value corresponds to higher pitch
        const highPitch = canvasYToMidiPitch(rect.y1); // Pitch at the top edge of the rect
        const lowPitch = canvasYToMidiPitch(rect.y2);  // Pitch at the bottom edge of the rect

        // If not holding shift, clear previous selection before selecting new notes
        // (Already handled in mousedown, but double check here if needed)
        // if (!shiftKeyHeld) { selectedNotes.clear(); } // Redundant if mousedown clears

        trackStates.forEach((state, trackIndex) => {
            if (!state.isVisible) return;

            // *** NEW: only pick notes on instruments that belong to the parent pattern ***
            if (activePatternId !== ROOT_ID
                && !parentPat.instruments.includes(trackIndex)) {
                return;
            } const track = rawTracksData[trackIndex];

            if (!track || !track.notes) return;

            track.notes.forEach((note, noteIndex) => {
                // Check if note intersects the rectangle in MIDI space
                const noteEndTick = note.start_tick + note.duration_ticks;
                // Check horizontal overlap: Note must start before rect ends AND end after rect starts.
                // const intersectsHorizontally = note.start_tick < endTick && noteEndTick > startTick;
                let intersectsHorizontally;
                if (copyMode === 'range') {
                    intersectsHorizontally = note.start_tick < endTick && noteEndTick > startTick;
                } else {                           // 'start'
                    intersectsHorizontally = note.start_tick >= startTick && note.start_tick <= endTick;
                }

                // Check vertical overlap: Note pitch must be within the rect's pitch range.
                const intersectsVertically = note.pitch >= lowPitch && note.pitch <= highPitch;

                if (intersectsHorizontally && intersectsVertically) {
                    const noteKey = JSON.stringify({ trackIndex, noteIndex });
                    // Selection logic based on shift key:
                    if (shiftKeyHeld) {
                        // Toggle selection for this note
                        if (selectedNotes.has(noteKey)) {
                            // selectedNotes.delete(noteKey); // Standard shift-add doesn't deselect in box
                        } else {
                            selectedNotes.add(noteKey);
                        }
                    } else {
                        // Regular box select (no shift): always add to selection
                        selectedNotes.add(noteKey);
                    }
                }
            });
        });
        invalidateSynth();
        updateSelectionRhythmicCandidates();

    }


    // --- State Update & UI (Track List) ---
    function setActiveTrack(index) {
        if (index >= 0 && index < rawTracksData.length) {
            if (activeTrackIndex !== index) { // Only update if changed
                activeTrackIndex = index;
                console.log(`Active track set to index: ${index} (${rawTracksData[index].name || 'Unnamed'})`);
                selectedNotes.clear(); // Clear selection when changing active track? (Common DAW behavior)
                updateTrackListHighlighting();
                redrawPianoRoll(); // Redraw needed as active track affects key display and note highlighting
            }
        } else if (activeTrackIndex !== -1) {
            activeTrackIndex = -1; // Deselect if index is invalid
            console.log("Active track deselected.");
            selectedNotes.clear(); // Clear selection when deselecting track
            updateTrackListHighlighting();
            redrawPianoRoll();
        }
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => {
                // re-tint all the lets:
                const dm = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (dm) {
                    // same shading code as above…
                    // you could DRY it into a function applyDarkTint()
                } else {
                    // reset to originals, or simply reload the page:
                    window.location.reload();
                }
            });

    }

    function toggleTrackVisibility(index) {
        if (index >= 0 && index < trackStates.length) {
            const wasVisible = trackStates[index].isVisible;
            trackStates[index].isVisible = !wasVisible;
            console.log(`Track index ${index} visibility toggled to: ${trackStates[index].isVisible}`);

            // If hiding the active track, maybe deselect it? Current: Keep it active but hidden.

            // If hiding a track, deselect any notes within it.
            if (!trackStates[index].isVisible) {
                const keysToRemove = [];
                selectedNotes.forEach(key => {
                    const ref = JSON.parse(key);
                    if (ref.trackIndex === index) {
                        keysToRemove.push(key);
                    }
                });
                keysToRemove.forEach(key => selectedNotes.delete(key));
            }

            updateVisibilityToggleButton(index);
            redrawPianoRoll(); // Redraw needed as visibility changes note rendering
        }
    }

    function updateTrackListHighlighting() {
        const trackItems = trackListElement.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            const itemIndex = parseInt(item.dataset.trackIndex, 10);
            if (itemIndex === activeTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function updateVisibilityToggleButton(index) {
        const trackItem = trackListElement.querySelector(`.track-item[data-track-index="${index}"]`);
        if (trackItem) {
            const button = trackItem.querySelector('.visibility-toggle');
            const buttonIcon = button?.querySelector('i'); // Target the icon
            if (buttonIcon) {
                const isVisible = trackStates[index]?.isVisible ?? true; // Default to visible if state missing
                if (isVisible) {
                    buttonIcon.classList.remove('fa-eye-slash');
                    buttonIcon.classList.add('fa-eye');
                    button.title = "Hide Track";
                    trackItem.classList.remove('track-hidden'); // Visual cue on the item itself
                } else {
                    buttonIcon.classList.remove('fa-eye');
                    buttonIcon.classList.add('fa-eye-slash');
                    button.title = "Show Track";
                    trackItem.classList.add('track-hidden'); // Dim or style the hidden track item
                }
            }
        }
    }


    // --- Offset Clamping ---
    function clampOffsets() {
        const rect = canvas.getBoundingClientRect(); // Use canvas logical dimensions
        const viewWidth = rect.width;
        const viewHeight = rect.height;

        // Calculate the total scaled content dimensions in pixels
        const scaledContentWidth = contentWidthTicks * PIXELS_PER_TICK_BASE * scaleX;
        const scaledContentHeight = contentHeightPitches * NOTE_BASE_HEIGHT * scaleY;

        // Calculate max offsets allowing content edge to meet view edge
        // Ensure max offset is at least 0 (prevents negative max offset if content is smaller than view)
        const maxOffsetX = Math.max(0, scaledContentWidth - viewWidth);
        const maxOffsetY = Math.max(0, scaledContentHeight - viewHeight);

        // Min offset is 0 (top-left corner)
        const minOffsetX = 0;
        const minOffsetY = 0;

        // Clamp current offsets
        offsetX = Math.max(minOffsetX, Math.min(offsetX, maxOffsetX));
        offsetY = Math.max(minOffsetY, Math.min(offsetY, maxOffsetY));

        // --- Sync Key Display Scroll ---
        // The key display wrapper needs its *content* shifted vertically
        // by the negative of the canvas offsetY. Use transform for performance.
        if (keyDisplayContentWrapper) {
            keyDisplayContentWrapper.style.transform = `translateY(${-offsetY}px)`;
        }

    }


    /**
     * Calculates the set of absolute MIDI pitches (0-127) belonging to the
     * currently selected scale (selectedRootNote, selectedScaleType).
     * Updates the global currentScaleNotes Set.
     */
    function updateCurrentScaleNotes() {
        currentScaleNotes.clear();
        currentScalePitchClasses.clear();
        const intervals = SCALE_INTERVALS[selectedScaleType] || [];

        if (intervals.length === 0) {
            console.log("Scale set to 'none' or unknown type. No notes highlighted.");
            return; // Keep sets empty
        }

        // Calculate the pitch classes (0-11) in the scale
        for (const interval of intervals) {
            const pitchClass = (selectedRootNote + interval) % 12;
            currentScalePitchClasses.add(pitchClass);
        }

        // Populate the full set of notes (0-127) belonging to these pitch classes
        for (let pitch = PITCH_MIN; pitch <= PITCH_MAX; pitch++) {
            if (currentScalePitchClasses.has(pitch % 12)) {
                currentScaleNotes.add(pitch);
            }
        }
        // console.log(`Updated scale: Root=${NOTE_NAMES[selectedRootNote]}, Type=${selectedScaleType}, Notes(0-11)=`, currentScalePitchClasses);
    }

    /**
     * Checks if a given MIDI pitch number is in the current scale.
     * @param {number} pitch MIDI pitch number (0-127)
     * @returns {boolean} True if the pitch is in the current scale, false otherwise.
     */
    function isNoteInScale(pitch) {
        // Optimization: Use the pre-calculated set of all notes
        return currentScaleNotes.has(pitch);
        // Fallback / Alternative: Check pitch class
        // if (currentScalePitchClasses.size === 0) return false; // Handle 'none' scale
        // return currentScalePitchClasses.has(pitch % 12);
    }


    /**
     * Greatest Common Divisor function.
     * @param {number} a
     * @param {number} b
     * @returns {number} The GCD of a and b.
     */
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }

    /**
     * Converts MIDI tick duration to ABC notation duration string relative to L:.
     * @param {number} ticks Duration in MIDI ticks.
     * @param {number} ticksPerUnitNoteLength MIDI ticks equivalent to the L: unit (e.g., Ticks for 1/8 note).
     * @returns {string} ABC duration string (e.g., "", "2", "3/2", "/2").
     */
    function ticksToAbcDuration(ticks, ticksPerUnitNoteLength) {
        // Ensure ticks are positive integer values after quantization
        ticks = Math.max(0, Math.round(ticks));
        ticksPerUnitNoteLength = Math.max(1, Math.round(ticksPerUnitNoteLength)); // Avoid division by zero

        if (ticks === 0) return "0"; // Explicitly handle zero duration if needed, though quantization might prevent this. ABC doesn't really have zero duration.
        if (ticksPerUnitNoteLength === 0) return ""; // Cannot determine duration


        // Calculate the ratio
        let numerator = ticks;
        let denominator = ticksPerUnitNoteLength;

        // Simplify the fraction
        const commonDivisor = gcd(numerator, denominator);
        numerator /= commonDivisor;
        denominator /= commonDivisor;

        // Format the string
        if (denominator === 1) {
            return numerator === 1 ? "" : String(numerator); // L, 2L, 3L etc.
        } else {
            if (numerator === 1) {
                return "/" + String(denominator); // L/2, L/3 etc. (ABC standard like /2, /4)
            } else {
                // Handle cases like 3/2 explicitly if numerator > 1
                return String(numerator) + "/" + String(denominator); // 3/2, 5/4 etc.
            }
        }
    }

    /**
     * Convert one MIDI pitch → ABC text.
     * When `isPercussion === true`, we respect ABC percussion rules:
     *   • always use octave 4 (middle register)
     *   • choose the drum letter from DRUM_PITCH_TO_ABC
     *   • never output accidentals – accidentals are illegal in K:perc
     */
    function midiPitchToAbcNote(pitch, keyAcc, measureAcc, isPercussion = false) {
        if (isPercussion) {
            const letter = DRUM_PITCH_TO_ABC[pitch] || 'z';   // default BD
            return letter;           // upper‑case, no accidentals, octave 4
        }

        /* ---------- normal melodic handling (unchanged) ---------- */
        const sharpMap = [
            ['C', 0], ['C', +1], ['D', 0], ['D', +1], ['E', 0], ['F', 0],
            ['F', +1], ['G', 0], ['G', +1], ['A', 0], ['A', +1], ['B', 0]
        ];
        const flatMap = [
            ['C', 0], ['D', -1], ['D', 0], ['E', -1], ['E', 0], ['F', 0],
            ['G', -1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0]
        ];
        const pc = pitch % 12;
        const oct = Math.floor(pitch / 12) - 1;
        const [letter, desiredAcc] = (keyAcc.preferFlats ? flatMap : sharpMap)[pc];
        const keyAccVal = keyAcc.sharps.has(letter) ? 1 :
            keyAcc.flats.has(letter) ? -1 : 0;
        const currentVal = (letter in measureAcc) ? measureAcc[letter] : keyAccVal;
        let accSym = '';
        if (desiredAcc !== currentVal) {
            accSym = desiredAcc === 0 ? '=' : desiredAcc > 0 ? '^' : '_';
        }
        measureAcc[letter] = desiredAcc;

        let abcLetter;
        if (oct >= 5) abcLetter = letter.toLowerCase() + "'".repeat(oct - 5);
        else abcLetter = letter.toUpperCase() + ",".repeat(4 - oct);

        return accSym + abcLetter;
    }




    /**
     * ------------------------------------------------------------------
     * 3.  Build the ABC snippet from the current selection
     *     – now with rock-solid accidentals for ANY key.
     * ------------------------------------------------------------------
     */
    function generateAbcFromSelection() {
        if (selectedNotes.size === 0) return "";

        /* ---------- gather & quantise notes (UNCHANGED) --------------- */
        const collected = [];
        selectedNotes.forEach(k => {
            const { trackIndex, noteIndex } = JSON.parse(k);
            const n = rawTracksData[trackIndex]?.notes[noteIndex];
            if (n) collected.push({ ...n });
        });
        if (!collected.length) return "";

        const TPB = window.ticksPerBeat || 480;
        const sixteenth = TPB / 4;
        const q = n => Math.max(0, Math.round(n / sixteenth) * sixteenth);
        const notes = collected.map(n => {
            // quantize then clamp to 0
            const rawStart = q(n.start_tick);
            return {
                pitch: n.pitch,
                start: Math.max(0, rawStart),
                dur: n.duration_ticks > 0
                    ? Math.max(sixteenth, Math.round(n.duration_ticks / sixteenth) * sixteenth)
                    : 0
            };
        }).filter(n => n.dur > 0);


        if (!notes.length) return "";

        notes.sort((a, b) => a.start !== b.start ? a.start - b.start : a.pitch - b.pitch);

        /* ---------- header ------------------------------------------- */
        const L = document.getElementById("abcUnitNoteLength").value || 8;
        const num = window.timeSignatureNumerator || 4;
        const den = window.timeSignatureDenominator || 4;
        const ticksPerMeasure = TPB * (4 / den) * num;
        const keyRoot = NOTE_NAMES[selectedRootNote];
        const isMinor = selectedScaleType.toLowerCase().includes('min');
        const keyName = keyRoot + (isMinor ? 'min' : 'maj');
        let abc = `X:1\nT:Selected Notes Snippet\nM:${num}/${den}\nL:1/${L}\nK:${keyName}\n`;

        /* ---------- body --------------------------------------------- */
        const keyAcc = getKeyAccidentals(keyRoot, isMinor);
        let measureAcc = {};                          // reset each bar
        const durStr = t => ticksToAbcDuration(t, TPB * (4 / L));

        let now = Math.floor(notes[0].start / ticksPerMeasure) * ticksPerMeasure;
        let inBar = 0, lineLen = 0;

        for (let i = 0; i < notes.length; i++) {
            const n = notes[i];

            /* ----- rests if there’s a gap ----------------------------- */
            if (n.start > now) {
                const restDur = n.start - now;
                const rest = 'z' + durStr(restDur) + ' ';
                abc += rest; lineLen += rest.length;
                now += restDur; inBar += restDur;
            }

            /* ----- collect any simultaneous notes (chord) ------------- */
            const chord = [n];
            while (i + 1 < notes.length && notes[i + 1].start === n.start) chord.push(notes[++i]);

            /* ----- render the note/chord ------------------------------ */
            let elem = '';
            if (chord.length > 1) {           // chord
                elem += '[';
                chord.forEach(c => {
                    elem += midiPitchToAbcNote(c.pitch, keyAcc, measureAcc);
                });
                elem += ']' + durStr(n.dur) + ' ';
            } else {                        // single note
                elem += midiPitchToAbcNote(n.pitch, keyAcc, measureAcc) + durStr(n.dur) + ' ';
            }
            abc += elem; lineLen += elem.length;
            now += n.dur; inBar += n.dur;

            /* ----- bar-lines & resetting accidental map --------------- */
            while (inBar >= ticksPerMeasure) {
                abc += '| ';
                measureAcc = {};            // clear for new bar
                inBar -= ticksPerMeasure;
                lineLen += 2;
                if (lineLen > 60) { abc += '\n'; lineLen = 0; }
            }
        }

        abc = abc.trimEnd() + ' |]';
        return abc;
    }


    function generateAbcFromSelectionMultiVoice(trackName = "Multi-Track Snippet") {
        if (selectedNotes.size === 0) return "";

        const TPB = window.ticksPerBeat || 480;
        const sixteenth = TPB / 4;
        const q = v => Math.round(v / sixteenth) * sixteenth;

        // Group and quantize notes by track
        const byTrack = new Map();
        selectedNotes.forEach(k => {
            const { trackIndex, noteIndex } = JSON.parse(k);
            const raw = rawTracksData[trackIndex]?.notes[noteIndex];
            if (!raw || raw.duration_ticks <= 0) return;

            // quantize and clamp negative starts
            const rawStart = q(raw.start_tick);
            const start = Math.max(0, rawStart);
            const dur = Math.max(sixteenth, q(raw.duration_ticks));

            if (!byTrack.has(trackIndex)) byTrack.set(trackIndex, []);
            byTrack.get(trackIndex).push({ ...raw, start, dur });
        });
        if (!byTrack.size) return "";

        // Get sorted unique track indices
        const selectedTrackIndices = [...new Set(Array.from(selectedNotes).map(k => JSON.parse(k).trackIndex))].sort((a, b) => a - b);

        // Header setup
        const num = window.timeSignatureNumerator || 4;
        const den = window.timeSignatureDenominator || 4;
        const L = document.getElementById("abcUnitNoteLength").value || 16;
        const root = NOTE_NAMES[selectedRootNote] || 'C';
        const isMin = selectedScaleType.toLowerCase().includes('min');
        const keyName = root + (isMin ? 'min' : 'maj');
        const ticksPerBar = TPB * (4 / den) * num;

        let abc = `X:1\nT:${trackName}\nM:${num}/${den}\nL:1/${L}\nK:${keyName}\n`;

        // Add %%score directive
        const voiceLabels = selectedTrackIndices.map((_, index) => `V${index + 1}`);
        abc += `%%score (${voiceLabels.join(' ')})\n`;

        // Generate ABC for each voice
        selectedTrackIndices.forEach((trackIdx, index) => {
            const vno = index + 1;
            const notes = byTrack.get(trackIdx);
            if (!notes || notes.length === 0) return;
            notes.sort((a, b) => a.start !== b.start ? a.start - b.start : a.pitch - b.pitch);

            const tr = rawTracksData[trackIdx];
            let nm = getTrackInstrumentName(tr, trackIdx);
            const snm = tr.short_name || nm;
            const clef = tr.clef || 'treble';
            const isDrum = isDrumTrack(trackIdx);
            const perc = isDrum ? ' perc=yes' : '';

            // Adjust instrument name if needed
            nm = nm.replace("Synth ", 'Synth');
            //replace SynthBass with Synth Bass
            nm = nm.replace("SynthBass", 'Synth Bass');
            const program = isDrum ? null : (MELODY_NAME_TO_PROGRAM[nm] || 0);

            // Voice definition
            abc += `V:${vno} name="${nm}" snm="${snm}" clef=${clef}${perc}\n`;

            // Add %%MIDI program for non-drum tracks
            if (!isDrum) {
                abc += `%%MIDI program ${program}\n`;
                abc += `%%MIDI channel ${0}\n`;
            }
            else {
                abc += `%%MIDI channel ${10}\n`; // Use track index for drums
            }

            // Inline voice identifier
            abc += `[V:${vno}] `;

            // Notation generation
            let now = 0;
            let inBar = 0;
            let measureAcc = {};
            const keyAcc = getKeyAccidentals(root, isMin);
            const durStr = t => ticksToAbcDuration(t, TPB * (4 / L));
            const isPercussion = isDrum;

            let i = 0;
            while (i < notes.length) {
                const n = notes[i];
                if (n.start > now) {
                    const rest = n.start - now;
                    abc += `z${durStr(rest)} `;
                    now += rest;
                    inBar += rest;
                }
                const chord = [n];
                i++;
                while (i < notes.length && notes[i].start === n.start) {
                    chord.push(notes[i]);
                    i++;
                }
                if (chord.length > 1) {
                    abc += '[';
                    chord.forEach(c => {
                        abc += midiPitchToAbcNote(c.pitch, keyAcc, measureAcc, isPercussion);
                    });
                    abc += `]${durStr(n.dur)} `;
                } else {
                    abc += midiPitchToAbcNote(n.pitch, keyAcc, measureAcc, isPercussion) + durStr(n.dur) + ' ';
                }
                now += n.dur;
                inBar += n.dur;
                while (inBar >= ticksPerBar) {
                    abc += '| ';
                    measureAcc = {};
                    inBar -= ticksPerBar;
                }
            }
            abc = abc.trimEnd() + ' |]\n';
        });

        // after you finish building `abc` and before you return it:
        const unitsPerBar = /* same as you used when building */ (num * L) / den;
        abc = trimCommonBarRests(abc, unitsPerBar);
        return abc.trim();

        return abc.trim();
    }


    /**
     * Trim the same number of full-bar rests from the start of every voice,
     * equal to the minimum across all voices.
     *
     * @param {string} abcText     – the raw multi-voice ABC
     * @param {number} unitsPerBar – how many “z-units” make up one bar
     * @returns {string}           – the adjusted ABC
     */
    function trimCommonBarRests(abcText, unitsPerBar) {
        const lines = abcText.split('\n');
        // 1) Compute how many whole-bar rests each line has
        const barCounts = lines.map(line => {
            const m = line.match(/^(\[V:\d+\]\s*)(?:z(\d+)\s*)?(.*)$/);
            if (!m) return Infinity;
            const zCount = parseInt(m[2] || '0', 10);
            return Math.floor(zCount / unitsPerBar);
        });

        // 2) Find the minimum number of bars to strip
        const minBars = Math.min(...barCounts.filter(c => isFinite(c)));
        if (minBars <= 0) return abcText;

        // 3) Remove that many bars from every voice
        return lines.map(line => {
            const m = line.match(/^(\[V:\d+\]\s*)(?:z(\d+)\s*)?(.*)$/);
            if (!m) return line;
            const header = m[1];
            const origZ = parseInt(m[2] || '0', 10);
            let rest = m[3];

            // subtract the stripped bars
            const newZ = origZ - minBars * unitsPerBar;
            const zPart = newZ > 0 ? `z${newZ} ` : '';

            // remove exactly minBars instances of the bar-marker "| "
            for (let i = 0; i < minBars; i++) {
                rest = rest.replace('| ', '');
            }

            return header + zPart + rest;
        }).join('\n');
    }






    /**
     * Copy multi-voice ABC to the clipboard.
     */
    async function copySelectionToAbc() {
        let abcText = generateAbcFromSelectionMultiVoice();
        //wrap with <abc></abc>
        abcText = `<abc>\n${abcText}\n</abc>`; // Wrap in <abc> tags for multi-voice
        if (!abcText) {
            console.warn("Nothing selected or no valid selection for multi-voice ABC.");
            return;
        }
        try {
            await navigator.clipboard.writeText(abcText);
            console.log("Copied multi-voice ABC:\n", abcText);
        } catch (err) {
            console.error("Failed to copy multi-voice ABC:", err);
        }
    }

    // ────────────────────────────────────────────────────────────────
    //   T E X T   L A Y E R   – font & info helpers
    // ────────────────────────────────────────────────────────────────
    const INFO_FONT = '12px Inter, sans-serif';
    const BREADCRUMB_FONT = '14px Inter, sans-serif';
    const LABEL_FILL = '#f8f9fa';
    const LABEL_STROKE = '#000000aa';

    /** Build “root / Part A / Lead A” breadcrumb path for a given pattern id */
    function breadcrumbFor(id) {
        const parts = [];
        let p = patterns.get(id);
        while (p) {
            parts.push(p.name || '(unnamed)');
            p = patterns.get(p.parentId);
        }
        // Use the song name instead of "Whole Song"
        if (parts[parts.length - 1] === 'Whole song') {
            parts[parts.length - 1] = currentMidiFilename.replace(/\.[^.]+$/, ''); // Strips the file extension
        }
        return parts.reverse().join(' / ');
    }

    /** Human-readable relation to its master pattern */
    function relationText(pat) {
        if (pat.isRepetition) {
            return `repeat of ${pat.variantOfName}`;
        }
        if (pat.isVariation) {
            return pat.isRhythmicVariation
                ? `rhythmic variation of ${pat.variantOfName}`
                : `variation of ${pat.variantOfName}`;
        }
        return '';
    }

    function drawChordRibbon(startTick, endTick) {
        if (!chordSegments.length) return;

        /* ➊— pick a font size that is 3× our old 13 px, but never wider
           than the current chord cell. We try 39 px, then binary-shrink. */
        const BASE_PX = 39;                 // 13 × 3
        const ribbonH = BASE_PX + 4;       // small margin top+bottom

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 2;

        chordSegments.forEach(seg => {
            const x1 = midiTickToCanvasX(seg.start);
            const x2 = midiTickToCanvasX(seg.end);
            const w = x2 - x1;

            // pick style by seg.quality
            let fill, stroke;
            if (seg.quality === 'root') {
                fill = 'rgba(0,128,0,0.15)';   // green tint
                stroke = 'rgba(0,128,0,0.4)';
            } else if (seg.quality === 'interval') {
                fill = 'rgba(128,0,0,0.15)';   // red tint
                stroke = 'rgba(128,0,0,0.4)';
            } else {
                fill = 'rgba(0,0,0,0.15)';     // default for triads
                stroke = 'rgba(0,0,0,0.25)';
            }

            ctx.save();
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            ctx.fillRect(x1, 0, w, ribbonH);
            ctx.strokeRect(x1, 0, w, ribbonH);

            // draw the label
            const label = (chordDisplayMode === CHORD_NAME) ? seg.name : seg.roman;
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.globalAlpha = 1;
            ctx.fillText(label, x1 + w / 2, ribbonH / 2);
            ctx.restore();
        });

        ctx.restore();
    }



    // --- Drawing ---
    function redrawPianoRoll() {
        requestAnimationFrame(() => {
            const rect = canvas.getBoundingClientRect();
            const viewWidth = rect.width;
            const viewHeight = rect.height;

            ctx.save();
            ctx.clearRect(0, 0, viewWidth, viewHeight);

            // NO LONGER DRAW MAIN BACKGROUND HERE - Measures will cover it

            const startTickVisible = canvasXToMidiTick(0);
            const endTickVisible = canvasXToMidiTick(viewWidth);
            const highPitchVisible = canvasYToMidiPitch(0);
            const lowPitchVisible = canvasYToMidiPitch(viewHeight);

            // Draw Grid (including NEW measure backgrounds), Notes, Selection Rect
            ctx.save();
            // 1. Clear Canvas (or draw base white background)
            ctx.fillStyle = BACKGROUND_COLOR;
            ctx.fillRect(0, 0, viewWidth, viewHeight);

            // 2. Draw Grid (Handles Row Backgrounds, Measure Shading, and Lines)
            drawGrid(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible, viewWidth, viewHeight);


            drawChordRibbon(startTickVisible, endTickVisible);



            // if (activePatternId !== ROOT_ID) {
            drawDescendantBounds(patterns.get(activePatternId));
            // }

            // 3. Draw Notes
            drawAllNotes(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);

            // 4. Draw Selection Rectangle (if active)
            if (isSelecting && selectionRect) { drawSelectionRectangle(); }

            // 5. Update Key Display
            drawKeyDisplay(lowPitchVisible, highPitchVisible);


            ctx.save();
            ctx.font = BREADCRUMB_FONT;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.lineWidth = 2;
            ctx.strokeStyle = LABEL_STROKE;
            ctx.fillStyle = LABEL_FILL;

            const crumb = breadcrumbFor(activePatternId);
            ctx.strokeText(crumb, 8, 6);
            ctx.fillText(crumb, 8, 6);
            ctx.restore();

            if (playheadProgress != null) {
                const x = midiTickToCanvasX(playStartTick + playSpanTicks * playheadProgress);
                ctx.save();
                ctx.strokeStyle = '#ff0033';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, viewHeight);
                ctx.stroke();
                ctx.restore();
            }

        });
    }


    /*─────────────────────────────────────────────────────────────────────────────
    C H I L D - P A T T E R N   O V E R L A Y   C O L O U R   E N G I N E
    ─────────────────────────────────────────────────────────────────────────────*/
    const _GOLDEN_RATIO = 0.61803398875;               // nice hue spread
    const _familyHueCache = new Map();                 // familyId → hue 0-360

    /*─────────────────────────────────────────────────────────────────────
      C O L O U R   P I C K E R   v2
    ─────────────────────────────────────────────────────────────────────*/

    /*─── Colour engine: repetitions inherit *exactly* their source’s colour ───*/

    // Cache for hue per family-root
    const _hueCache = new Map();

    /** 0–1 hash from string */
    function _hash01(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h * 31 + str.charCodeAt(i)) >>> 0;
        }
        return (h * 0.61803398875) % 1;
    }

    /** Find the ultimate ancestor that isn’t itself a variation/repeat */
    function _familyRootId(pat) {
        let cur = pat;
        let breaks = 5;
        while (cur.variantOf && breaks-- > 0) {
            cur = patterns.get(cur.variantOf);
        }
        return cur.id;
    }

    /** Recursively compute lightness:
     *  – if it’s a repetition → delegate to its source
     *  – else start at 45%, +15% per variation-ancestor
     */
    function _computeLightness(pat) {
        const BASE_L = 45;
        // 1) repetitions: exact same as their master
        if (pat.isRepetition) {
            return _computeLightness(patterns.get(pat.variantOf));
        }
        // 2) variations & masters: accumulate +15% per variation in the chain
        let light = BASE_L;
        let cur = pat;
        let max = 5;
        while (cur.variantOf && max-- > 0) {
            if (cur.isVariation) light += 15;
            cur = patterns.get(cur.variantOf);
        }
        return light;
    }

    /**
     * HSLA fill/stroke for any pattern:
     *  • hue = family-root hash
     *  • sat = 68%
     *  • light = _computeLightness (so repeats match their master exactly,
     *    variations get +15%, nested variations stack)
     */
    function colourForPattern(pat, alpha = 0.22) {
        // 1) Hue
        const rootId = _familyRootId(pat);
        if (!_hueCache.has(rootId)) {
            _hueCache.set(rootId, Math.round(_hash01(rootId) * 360));
        }
        const hue = _hueCache.get(rootId);
        const sat = 68;

        // 2) Lightness
        const light = _computeLightness(pat);

        return `hsla(${hue},${sat}%,${light}%,${alpha})`;
    }


    /**
     * Build “Epicify” training pairs
     *   • output  = original multi-voice slice
     *   • input   = blandified top-line, snapped to SCALE tones,
     *               keeping correct instrument metadata
     */
    function collectEpicifyExamples(augmentTranspose = true) {
        const examples = [];
    
        patterns.forEach(pat => {
            if (pat.id === ROOT_ID) return;
            const insts   = pat.instruments ?? [];
            const allDrum = insts.every(ti => rawTracksData[ti]?.is_drum_track);
            if (!(insts.length === 1 || allDrum)) return;
            if (pat.isRepetition)            return;
    
            const safeName = pat.name.replace(/[^\w\-]/g, '_');
    
            const selectPat = () => {
                selectedNotes.clear();
                notesInsidePattern(pat).forEach(ref =>
                    selectedNotes.add(JSON.stringify(ref))
                );
            };
    
            // Build the blandified topline (uses whatever currentRoot+scale are)
            const buildInputSnippet = () => {
                const pool = [];
                notesInsidePattern(pat).forEach(r => {
                    const n = rawTracksData[r.trackIndex]?.notes[r.noteIndex];
                    if (n) pool.push({ ...n });
                });
                if (!pool.length) return '';
    
                const TPB   = window.ticksPerBeat || 480;
                const EIGHT = TPB;
                const first = Math.min(...pool.map(n => n.start_tick));
                const q     = t => Math.round((t - first) / EIGHT) * EIGHT;
    
                const pcs  = currentScalePitchClasses; // matches current key
                const snap = p => {
                    if (pcs.has(p % 12)) return p;
                    for (let d = 1; d < 12; d++) {
                        const down = p - d, up = p + d;
                        if (down >= 0  && pcs.has(down % 12)) return down;
                        if (up   <=127 && pcs.has(up   % 12)) return up;
                    }
                    return p;
                };
    
                const byPos = new Map();
                pool.forEach(n => {
                    const rel = q(n.start_tick);
                    if (!byPos.has(rel) || n.pitch > byPos.get(rel).pitch) {
                        byPos.set(rel, {
                            pitch          : snap(n.pitch),
                            start_tick     : first + rel,
                            duration_ticks : EIGHT,
                            velocity       : n.velocity
                        });
                    }
                });
    
                const meta = allDrum
                    ? { name:"Drums", is_drum_track:true, instrument:"Drums", clef:"percussion" }
                    : rawTracksData[insts[0]];
    
                const vIdx = rawTracksData.length;
                rawTracksData.push({
                    name:          meta.name    || "Topline",
                    is_drum_track: !!meta.is_drum_track,
                    program:       meta.program,
                    instrument:    meta.instrument,
                    clef:          meta.clef,
                    notes:         Array.from(byPos.values())
                });
    
                selectedNotes.clear();
                rawTracksData[vIdx].notes.forEach((_, ni) =>
                    selectedNotes.add(JSON.stringify({ trackIndex: vIdx, noteIndex: ni }))
                );
                const body = generateAbcFromSelectionMultiVoice().trim();
    
                rawTracksData.pop();
                selectedNotes.clear();
    
                return body ? `<abc>\n${body}\n</abc>` : '';
            };
    
            // Push one example for whatever the current key + notes are
            const pushExample = (tSemis) => {
                selectPat();
                const out = generateAbcFromSelectionMultiVoice().trim();
                selectedNotes.clear();
                if (!out) return;
    
                const inp = buildInputSnippet();
                if (!inp) return;
    
                examples.push({
                    id:        `${safeName}_t${tSemis}_k${selectedRootNote}_${selectedScaleType}`,
                    function:  "Epicify",
                    transpose: tSemis,
                    input:     inp,
                    output:    `<abc>\n${out}\n</abc>`
                });
            };
    
            // — original (no transpose) —
            updateCurrentScaleNotes();
            pushExample(0);
    
            // — augmented transpositions (skip drums) —
            if (augmentTranspose && !allDrum) {
                const origRoot = selectedRootNote;
                // capture refs + their original pitches
                const refs  = notesInsidePattern(pat).map(r => JSON.parse(JSON.stringify(r)));
                const saved = refs.map(r => rawTracksData[r.trackIndex].notes[r.noteIndex].pitch);
    
                try {
                    for (let t = 1; t < 12; t++) {
                        // 1) transpose the actual notes
                        refs.forEach((r,i) => {
                            rawTracksData[r.trackIndex].notes[r.noteIndex].pitch = saved[i] + t;
                        });
    
                        // 2) shift the key & refresh scale
                        selectedRootNote = (origRoot + t) % 12;
                        updateCurrentScaleNotes();
    
                        // 3) emit example
                        pushExample(t);
                    }
                } finally {
                    // ALWAYS restore
                    refs.forEach((r,i) => {
                        rawTracksData[r.trackIndex].notes[r.noteIndex].pitch = saved[i];
                    });
                    selectedRootNote = origRoot;
                    updateCurrentScaleNotes();
                }
            }
        });
    
        return examples;
    }
    
    
    
    
    





    /**
   * Walks the variantOf‐graph and returns:
   *   [{
   *        id,                   // uuid
   *        function: 'MotifVariation',
   *        input,                // <abc>…</abc>  (motif + context)
   *        output                // <abc>…</abc>  (motif + context)
   *    }, …]
   */
    function collectMotifVariationExamples() {
        // helper: wrap a pattern's full selection in <abc>…</abc>
        const abcForPattern = pat => {
            const remember = new Set(selectedNotes);
            selectedNotes = new Set(
                notesInsidePattern(pat).map(o => JSON.stringify(o))
            );
            const abcBody = generateAbcFromSelectionMultiVoice().trim();
            selectedNotes = remember;
            return `<abc>\n${abcBody}\n</abc>`;
        };

        // 1) Group by root motif (walking variantOf, with cycle‐protection)
        const familyMap = new Map();
        patterns.forEach(pat => {
            if (pat.isRepetition) return;

            // walk up to find the root (guard against loops)
            let root = pat;
            const seen = new Set([root.id]);
            while (root.variantOf) {
                const parent = patterns.get(root.variantOf);
                if (!parent || seen.has(parent.id)) {
                    // no further parent or detected a cycle → stop here
                    break;
                }
                seen.add(parent.id);
                root = parent;
            }

            const rootId = root.id;
            if (!familyMap.has(rootId)) familyMap.set(rootId, []);
            familyMap.get(rootId).push(pat);
        });

        // 2) For each family with ≥2 members, emit every ordered pair
        const examples = [];
        familyMap.forEach(family => {
            if (family.length < 2) return;
            family.forEach(src => {
                family.forEach(tgt => {
                    if (src.id === tgt.id) return;
                    examples.push({
                        id: crypto.randomUUID(),
                        function: 'MotifVariation',
                        input: abcForPattern(src),
                        output: abcForPattern(tgt)
                    });
                });
            });
        });

        return examples;
    }

    function collectGenerationExamples() {
        const examples = [];
        for (const pat of patterns.values()) {
            // Skip if not a qualifying pattern
            if (!isQualifyingPattern(pat)) continue;

            // Get the descriptive title from the breadcrumb
            const trackName = breadcrumbFor(pat.id);
            let abc;

            if (pat.instruments.length === 1 && !isDrumTrack(pat.instruments[0])) {
                // Single non-drum track
                selectedNotes.clear();
                notesInsidePattern(pat).forEach(ref => selectedNotes.add(JSON.stringify(ref)));
                abc = generateAbcFromSelectionMultiVoice(trackName);
            } else if (pat.instruments.every(ti => isDrumTrack(ti))) {
                // Drum pattern: merge all drum tracks into a virtual track
                const drumNotes = [];
                pat.instruments.forEach(ti => {
                    const trackNotes = notesInsidePattern(pat).filter(ref => ref.trackIndex === ti);
                    trackNotes.forEach(ref => {
                        const note = rawTracksData[ti].notes[ref.noteIndex];
                        drumNotes.push({ ...note });
                    });
                });
                // Sort notes by start time for correct sequencing
                drumNotes.sort((a, b) => a.start_tick - b.start_tick);

                // Create a virtual track at a new index
                const virtualTrackIndex = rawTracksData.length;
                const virtualTrack = {
                    notes: drumNotes,
                    is_drum_track: true,
                    name: 'Drums',
                    instrument: 'Drums',
                    program: null // No program number for drums
                };
                rawTracksData[virtualTrackIndex] = virtualTrack;

                // Populate selectedNotes with the virtual track's notes
                selectedNotes.clear();
                drumNotes.forEach((note, idx) => {
                    selectedNotes.add(JSON.stringify({ trackIndex: virtualTrackIndex, noteIndex: idx }));
                });

                // Generate ABC with the virtual track
                abc = generateAbcFromSelectionMultiVoice(trackName);

                // Clean up the virtual track
                delete rawTracksData[virtualTrackIndex];
            } else {
                continue; // Shouldn’t happen with isQualifyingPattern
            }

            // Add to examples if ABC was generated
            if (abc) {
                examples.push({
                    id: pat.id,
                    function: 'Generation',
                    output: `${abc}`
                });
            }
        }
        return examples;
    }

    // Helper function to identify qualifying patterns
    function isQualifyingPattern(pat) {
        if (pat.id === ROOT_ID || pat.children.length > 0) return false;
        const isAllDrums = pat.instruments.length > 0 && pat.instruments.every(ti => isDrumTrack(ti));
        const isSingleNonDrum = pat.instruments.length === 1 && !isDrumTrack(pat.instruments[0]);
        return isAllDrums || isSingleNonDrum;
    }


    // ——— src/frontend/pianoroll.js
    // helper – returns a **group id**
    function instGroup(ti) {
        return isDrumTrack(ti) ? 'DRUMS' : ti;   // drums collapse to one
    }
    document.getElementById("save-epicify").addEventListener("click", async () => {
        const examples = collectEpicifyExamples();
        if (!examples.length) {
            alert("No eligible patterns found for Epicify export.");
            return;
        }

        try {
            const res = await fetch("/dataset/epicify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    song_name: currentMidiFilename.replace(/\.[^.]+$/, ""),
                    examples
                })
            });
            if (!res.ok) throw new Error(await res.text());
            alert(`Exported ${examples.length} Epicify examples ✅`);
        } catch (err) {
            console.error(err);
            alert("Export failed – see console");
        }
    });
    document.getElementById('save-generation').addEventListener('click', async () => {
        const examples = collectGenerationExamples();
        if (!examples.length) {
            alert('No generation examples found.');
            return;
        }
        try {
            const response = await fetch('/dataset/generation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    song_name: currentMidiFilename.replace(/\.[^.]+$/, ''),
                    examples
                })
            });
            if (!response.ok) throw new Error(await response.text());
            alert(`Exported ${examples.length} generation examples.`);
        } catch (error) {
            console.error(error);
            alert('Export failed – see console');
        }
    });

    document.getElementById('save-motif-variation').onclick = async () => {
        const examples = collectMotifVariationExamples();
        if (!examples.length) { alert('No variations found 🤔'); return; }

        try {
            const r = await fetch('/dataset/motif_variation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    song_name: currentMidiFilename.replace(/\.[^.]+$/, ''),
                    examples
                })
            });
            if (!r.ok) throw new Error(await r.text());
            alert(`Exported ${examples.length} examples ✅`);
        } catch (e) {
            console.error(e); alert('Export failed – see console');
        }
    };
    const uuid = () => {
        if (crypto && crypto.randomUUID) return crypto.randomUUID();
        // fallback:
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    // Helper: generate all non-empty subsets of an array
    function allNonEmptySubsets(array) {
        const subsets = [];
        const n = array.length;
        for (let mask = 1; mask < (1 << n); mask++) {
            const subset = [];
            for (let i = 0; i < n; i++) {
                if (mask & (1 << i)) subset.push(array[i]);
            }
            subsets.push(subset);
        }
        return subsets;
    }

    // Helper: build context ABC from a time range and a set of track indices
    function buildContextAbc(range, trackIndices) {
        // trackIndices contains *original* indices, we may have duplicates of DRUMS
        const groups = [...new Set(trackIndices.map(instGroup))];

        selectedNotes.clear();
        rawTracksData.forEach((trk, ti) => {
            if (!groups.includes(instGroup(ti))) return;
            trk.notes.forEach((n, ni) => {
                if (n.start_tick < range.end && n.start_tick + n.duration_ticks > range.start) {
                    selectedNotes.add(JSON.stringify({ trackIndex: ti, noteIndex: ni }));
                }
            });
        });

        const abc = generateAbcFromSelectionMultiVoice().trim();
        selectedNotes.clear();
        return abc;
    }

    // Export-to-training button handler
    document.getElementById('export-to-training').onclick = async () => {
        const examples = [];
        const songName = currentMidiFilename.replace(/\.[^.]+$/, '');

        for (const pat of patterns.values()) {
            if (pat.id === ROOT_ID) continue;

            // ✂️ NEW: skip any pattern that has children
            if (Array.isArray(pat.children) && pat.children.length > 0) continue;

            // only patterns with exactly one instrument
            const instGroups = [...new Set(pat.instruments.map(instGroup))];
            if (instGroups.length !== 1) continue;           // needs exactly one group

            // 1) Build OUTPUT snippet for this single-instrument pattern
            selectedNotes.clear();
            for (const ref of notesInsidePattern(pat)) {
                selectedNotes.add(JSON.stringify(ref));
            }
            const outputAbc = generateAbcFromSelectionMultiVoice().trim();
            selectedNotes.clear();

            // 2) Find all other tracks active in the same time window
            const contextTracks = new Set();
            rawTracksData.forEach((trk, ti) => {
                if (pat.instruments.includes(ti)) return;
                if (trk.notes.some(n =>
                    n.start_tick < pat.range.end && n.start_tick + n.duration_ticks > pat.range.start
                )) {
                    contextTracks.add(ti);
                }
            });
            const others = Array.from(contextTracks);

            // 3) For every non-empty subset of context tracks
            for (const subset of allNonEmptySubsets(others)) {
                const inputAbc = buildContextAbc(pat.range, subset);
                if (!inputAbc) continue;

                // get the target instrument name from the pattern's instrument index
                const ti = pat.instruments[0];
                const targetInstrument = getTrackInstrumentName(rawTracksData[ti], ti);

                examples.push({
                    id: crypto.randomUUID(),
                    function: 'InstrumentAddition',
                    input: `<abc>\n${inputAbc}\n</abc>`,
                    targetInstrument,
                    output: `<abc>\n${outputAbc}\n</abc>`
                });
            }
        }

        // 4) POST the dataset to Flask
        try {
            const res = await fetch('/dataset/export_training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ song_name: songName, examples })
            });
            if (!res.ok) throw new Error(await res.text());
            alert(`Exported ${examples.length} examples!`);
        } catch (err) {
            console.error(err);
            alert('Export failed – see console');
        }
    };







    /*─────────────────────────────────────────────────────────────────────────────
    D R A W   B O U N D S   O F   C H I L D   P A T T E R N S
    ─────────────────────────────────────────────────────────────────────────────*/
    function drawChildBounds(parentPat) {
        if (!parentPat?.children?.length) return;

        parentPat.children.forEach(cid => {
            const ch = patterns.get(cid);
            if (!ch) return;

            // convert MIDI-space rectangle → canvas
            const x1 = midiTickToCanvasX(ch.range.start);
            const x2 = midiTickToCanvasX(ch.range.end);
            const y1 = midiPitchToCanvasY(ch.range.high);
            const y2 = midiPitchToCanvasY(ch.range.low);
            const h = (y2 - y1) + NOTE_BASE_HEIGHT * scaleY;

            ctx.save();
            ctx.fillStyle = colourForPattern(ch);          // translucent fill
            ctx.strokeStyle = colourForPattern(ch, 0.8);     // darker outline
            ctx.lineWidth = 1.2;
            ctx.fillRect(x1, y1, x2 - x1, h);
            ctx.strokeRect(x1, y1, x2 - x1, h);
            ctx.restore();
        });
    }

    function drawDescendantBounds(pat, depth = 0) {
        if (!pat?.children?.length) return;

        pat.children.forEach(cid => {
            const ch = patterns.get(cid);
            if (!ch) return;

            /* rectangle in canvas coords */
            const x1 = midiTickToCanvasX(ch.range.start);
            const x2 = midiTickToCanvasX(ch.range.end);
            const y1 = midiPitchToCanvasY(ch.range.high);
            const y2 = midiPitchToCanvasY(ch.range.low);
            const h = (y2 - y1) + NOTE_BASE_HEIGHT * scaleY;
            const midX = (x1 + x2) / 2;
            const midY = y1 + h / 2;

            /* draw box */
            ctx.save();
            ctx.fillStyle = colourForPattern(ch, 0.22, depth);
            ctx.strokeStyle = colourForPattern(ch, 0.85, depth);
            ctx.lineWidth = 1.2;
            ctx.fillRect(x1, y1, x2 - x1, h);
            ctx.strokeRect(x1, y1, x2 - x1, h);
            ctx.restore();

            /* draw centred label */
            ctx.save();
            ctx.font = INFO_FONT;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineWidth = 2;
            ctx.strokeStyle = LABEL_STROKE;
            ctx.fillStyle = LABEL_FILL;

            ctx.strokeText(ch.name, midX, y1 + h + 8);
            ctx.fillText(ch.name, midX, y1 + h + 8);

            const rel = relationText(ch);
            if (rel) {
                ctx.strokeText(rel, midX, y1 + h + 24);
                ctx.fillText(rel, midX, y1 + h + 24);
            }
            ctx.restore();

            /* recurse further down the tree */
            drawDescendantBounds(ch, depth + 1);
        });
    }





    function drawGrid(startTick, endTick, lowPitch, highPitch, viewWidth, viewHeight) {
        // Ensure ticksPerMeasure is valid
        if (!ticksPerMeasure || ticksPerMeasure <= 0) {
            console.error("Invalid ticksPerMeasure:", ticksPerMeasure);
            // Draw basic background as fallback
            ctx.fillStyle = BACKGROUND_COLOR;
            ctx.fillRect(0, 0, viewWidth, viewHeight);
            // Optionally draw fallback grid lines here
            return;
        }

        // --- 1. Draw Row Backgrounds based on Scale ---
        ctx.save();
        const scaledNoteRowHeight = NOTE_BASE_HEIGHT * scaleY;
        for (let p = Math.floor(lowPitch); p <= Math.ceil(highPitch); p++) {
            if (p < PITCH_MIN || p > PITCH_MAX) continue;
            const rowY = midiPitchToCanvasY(p);
            const rowHeight = scaledNoteRowHeight;
            if (rowY + rowHeight < 0 || rowY > viewHeight) continue; // Vertical cull

            const isInScale = isNoteInScale(p);
            // Use the defined solid colors for rows
            ctx.fillStyle = isInScale ? GRID_ROW_IN_SCALE_COLOR : GRID_ROW_OUT_SCALE_COLOR;
            ctx.fillRect(0, rowY, viewWidth, rowHeight);
        }
        ctx.restore();

        // --- 2. Draw Alternating Measure Shading (On Top of Rows) ---
        const firstMeasureIndex = Math.max(0, Math.floor(startTick / ticksPerMeasure));
        const lastMeasureIndex = Math.ceil(endTick / ticksPerMeasure);

        ctx.save();
        ctx.fillStyle = MEASURE_SHADING_COLOR; // Use the semi-transparent color

        for (let m = firstMeasureIndex; m < lastMeasureIndex; m++) {
            // Determine if this measure index should be shaded based on the toggle
            const shouldShade = (m % 2 === (shadeEvenMeasures ? 0 : 1));

            if (shouldShade) {
                const measureStartTick = m * ticksPerMeasure;
                const measureEndTick = (m + 1) * ticksPerMeasure;
                const measureStartX = midiTickToCanvasX(measureStartTick);
                const measureEndX = midiTickToCanvasX(measureEndTick);

                if (measureEndX < 0 || measureStartX > viewWidth) continue; // Horizontal cull

                const drawX = Math.max(0, measureStartX);
                const drawWidth = Math.min(viewWidth, measureEndX) - drawX;

                // Fill the rectangle for the measure shading overlay
                ctx.fillRect(drawX, 0, drawWidth, viewHeight);
            }
        }
        ctx.restore(); // Restore context before drawing lines

        // --- 3. Draw Horizontal Pitch Lines (Separators) ---
        ctx.strokeStyle = KEY_SEPARATOR_COLOR;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let p = Math.floor(lowPitch); p <= Math.ceil(highPitch) + 1; p++) {
            if (p < PITCH_MIN || p > PITCH_MAX + 1) continue;
            const lineY = midiPitchToCanvasY(p);
            if (lineY >= -1 && lineY <= viewHeight + 1) {
                ctx.moveTo(0, lineY);
                ctx.lineTo(viewWidth, lineY);
            }
        }
        ctx.stroke();

        // --- 4. Draw Vertical Time Lines ---
        if (window.ticksPerBeat > 0) {
            const minPixelSpacing = 4; // Adjusted slightly
            const beatPixelWidth = window.ticksPerBeat * PIXELS_PER_TICK_BASE * scaleX;
            const measurePixelWidth = ticksPerMeasure * PIXELS_PER_TICK_BASE * scaleX;

            const startBeat = Math.max(0, Math.floor(startTick / window.ticksPerBeat));
            const endBeat = Math.ceil(endTick / window.ticksPerBeat);

            // Beat Lines
            if (beatPixelWidth >= minPixelSpacing) {
                ctx.strokeStyle = BEAT_LINE_COLOR;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                for (let beat = startBeat; beat <= endBeat; beat++) {
                    const tick = beat * window.ticksPerBeat;
                    const isOnMeasure = (tick % ticksPerMeasure === 0);
                    if (!isOnMeasure || measurePixelWidth < minPixelSpacing) {
                        const x = midiTickToCanvasX(tick);
                        if (x >= -1 && x <= viewWidth + 1) {
                            ctx.moveTo(x, 0);
                            ctx.lineTo(x, viewHeight);
                        }
                    }
                }
                ctx.stroke();
            }

            // Measure Lines (Thicker)
            if (measurePixelWidth >= minPixelSpacing) {
                ctx.strokeStyle = MEASURE_LINE_COLOR;
                ctx.lineWidth = 1.0; // Keep measures slightly thicker
                ctx.beginPath();
                for (let measure = firstMeasureIndex; measure <= lastMeasureIndex; measure++) {
                    const tick = measure * ticksPerMeasure;
                    const x = midiTickToCanvasX(tick);
                    if (x >= -1 && x <= viewWidth + 1) {
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, viewHeight);
                    }
                }
                ctx.stroke();
            }
        }

        // ——— repeat previews ———
        ctx.save();
        ctx.fillStyle = 'rgba(255,215,0,0.12)';   // soft gold overlay
        repeatHighlights.forEach(r => {
            const x1 = midiTickToCanvasX(r.start);
            const x2 = midiTickToCanvasX(r.end);
            const y1 = midiPitchToCanvasY(r.high);
            const y2 = midiPitchToCanvasY(r.low);
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1 + NOTE_BASE_HEIGHT * scaleY);
        });
        ctx.restore();

        // ——— variation previews ———
        ctx.fillStyle = 'rgba(255,140,0,0.1)';
        variationHighlights.forEach(r => {
            const x1 = midiTickToCanvasX(r.start);
            const x2 = midiTickToCanvasX(r.end);
            const y1 = midiPitchToCanvasY(r.high);
            const y2 = midiPitchToCanvasY(r.low);
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1 + NOTE_BASE_HEIGHT * scaleY);
        });

        // ─── draw “live” selection-based candidates ───
        ctx.save();
        ctx.fillStyle = 'rgba(255,165,0,0.2)';  // a clear orange
        selectionVariationHighlights.forEach(r => {
            const x1 = midiTickToCanvasX(r.start);
            const x2 = midiTickToCanvasX(r.end);
            const y1 = midiPitchToCanvasY(r.high);
            const y2 = midiPitchToCanvasY(r.low);
            ctx.fillRect(
                x1,
                y1,
                x2 - x1,
                (y2 - y1) + NOTE_BASE_HEIGHT * scaleY
            );
        });
        ctx.restore();


    }

    function drawAllNotes(startTickVisible, endTickVisible,
        lowPitchVisible, highPitchVisible) {
        const pat = patterns.get(activePatternId);

        const drawTrack = (ti, isAct) => {
            if (!trackStates[ti].isVisible) return;
            drawNotesForTrack(ti, isAct, startTickVisible, endTickVisible,
                lowPitchVisible, highPitchVisible, pat);
        };

        trackStates.forEach((_, ti) => { if (ti !== activeTrackIndex) drawTrack(ti, false); });
        if (activeTrackIndex !== -1) drawTrack(activeTrackIndex, true);
    }





    function drawNotesForTrack(trackIndex, isActive, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible, pattern) {
        const track = rawTracksData[trackIndex];
        if (!track || !track.notes) return;


        track.notes.forEach((note, noteIndex) => {
            // --- Culling ---
            const noteEndTick = note.start_tick + note.duration_ticks;
            if (noteEndTick < startTickVisible || note.start_tick > endTickVisible ||
                note.pitch < lowPitchVisible || note.pitch > highPitchVisible) {
                return; // Skip drawing notes completely outside the viewport MIDI range
            }

            const noteKey = JSON.stringify({ trackIndex, noteIndex });
            const isSelected = selectedNotes.has(noteKey) && !abcState.isPlaying;
            const isInScale = isNoteInScale(note.pitch); // Check scale membership

            if (pattern.id !== ROOT_ID && !noteInPattern(note, pattern, trackIndex)) return;

            // Calculate canvas coordinates and dimensions
            const x = midiTickToCanvasX(note.start_tick);
            const y = midiPitchToCanvasY(note.pitch); // Top edge of the note's row
            const w = Math.max(1, note.duration_ticks * PIXELS_PER_TICK_BASE * scaleX); // Min width 1px

            // --- Determine fill style based on Scale, Selection, and Active State ---
            let fillStyle;
            if (isSelected) {
                // Selected notes always use the selection color
                fillStyle = SELECTED_NOTE_FILL_COLOR;
            } else if (isActive) {
                // Active track notes: Use scale colors
                fillStyle = isInScale ? NOTE_IN_SCALE_COLOR : NOTE_OUT_SCALE_COLOR;
            } else {
                // Ghost notes (inactive track): ALWAYS use the ghost color
                fillStyle = GHOST_NOTE_FILL_COLOR; // <<< FIXED: Use dedicated ghost color
            }
            // ---------------------------------------------------------
            //  Off-beat tinting  (ONLY for the active track)
            // ---------------------------------------------------------
            if (isActive && !isSelected) {                 // don’t override selections
                switch (beatPosition(note.start_tick)) {
                    case 0:  // 8th-note off-beat
                        fillStyle = adjustLightness(fillStyle, OFFBEAT_LIGHTEN);
                        break;
                }
            }

            ctx.fillStyle = fillStyle;

            // --- Determine alpha ---
            let alpha = 1.0;
            if (!isSelected) { // Non-selected notes
                if (isActive) { // Active track - use velocity
                    alpha = ACTIVE_VELOCITY_ALPHA_MIN +
                        (note.velocity / 127) * (ACTIVE_VELOCITY_ALPHA_MAX - ACTIVE_VELOCITY_ALPHA_MIN);
                    alpha = Math.max(0.1, Math.min(1.0, alpha)); // Clamp alpha
                } else { // Ghost note
                    alpha = GHOST_NOTE_ALPHA; // Alpha is correctly set for ghosts
                }
            }
            // Selected notes currently drawn solid (alpha = 1.0)

            ctx.globalAlpha = alpha;

            // Draw the note rectangle (apply vertical gap by adjusting Y and height)
            // Calculate draw height considering scaled gap
            const scaledGap = NOTE_VERTICAL_GAP * scaleY;
            const drawY = y + (scaledGap / 2);
            const drawHeight = Math.max(1, NOTE_BASE_HEIGHT * scaleY - scaledGap);




            ctx.fillRect(x, drawY, w, drawHeight);

            const isHarmonyTrack = trackStates[trackIndex].isHarmony;
            let outlineColor = SELECTED_NOTE_STROKE_COLOR;   // default (blue)

            if (!isHarmonyTrack && !isDrumTrack(trackIndex)) {
                const chordSet = harmonyChordMap[note.start_tick];
                if (chordSet && chordSet.size && !chordSet.has(note.pitch % 12)) {
                    outlineColor = '#ffd200';                // yellow for non-chord-tone
                } else {
                    outlineColor = '#ffffff';                // white chord-tone / no chord
                }
            } else {
                outlineColor = '#ffffff';                    // harmony notes always white
            }
            ctx.strokeStyle = outlineColor;
            ctx.lineWidth = 1.0; // Use 1 for sharp outline
            ctx.globalAlpha = 1.0; // Ensure stroke is solid regardless of note alpha
            ctx.strokeRect(x, drawY, w, drawHeight); // Draw stroke on the same rect

            // --- Draw outline ONLY for selected notes ---
            if (isSelected) {
                ctx.strokeStyle = SELECTED_NOTE_STROKE_COLOR;
                ctx.strokeRect(x, drawY, w, drawHeight); // Draw stroke on the same rect
            }

            ctx.globalAlpha = 1.0; // Reset global alpha after drawing note
        });
    }
    function drawSelectionRectangle() {
        if (!selectionRect) return;
        // Coords are already relative to canvas logical pixels
        const x = Math.min(selectionRect.x1, selectionRect.x2);
        const y = Math.min(selectionRect.y1, selectionRect.y2);
        const width = Math.abs(selectionRect.x1 - selectionRect.x2);
        const height = Math.abs(selectionRect.y1 - selectionRect.y2);

        ctx.fillStyle = SELECTION_RECT_FILL;
        ctx.strokeStyle = SELECTION_RECT_STROKE;
        ctx.lineWidth = 1; // Use 1 for sharp rect
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }


    // --- Key/Drum Display Drawing ---
    function drawKeyDisplay(lowPitchVisible, highPitchVisible) {
        if (!keyDisplayContentWrapper || !keyDisplayPanel) return;

        // Determine if we're in drum-mode or piano-mode
        const activeTrack = (activeTrackIndex !== -1)
            ? rawTracksData[activeTrackIndex] : null;
        const isDrumMode = !!activeTrack?.is_drum_track;

        // Clear out old rows
        keyDisplayContentWrapper.innerHTML = '';

        // Figure out which pitches we need to render (a little buffer above/below)
        const scaledRowH = NOTE_BASE_HEIGHT * scaleY;
        const scaledGap = NOTE_VERTICAL_GAP * scaleY;
        const firstPitch = Math.max(PITCH_MIN, Math.floor(lowPitchVisible) - 5);
        const lastPitch = Math.min(PITCH_MAX, Math.ceil(highPitchVisible) + 5);

        // Precompute key-context for Roman vs Name
        const isMinor = selectedScaleType.toLowerCase().includes('min');
        const keyRootPc = selectedRootNote;
        const useRoman = (chordDisplayMode === CHORD_ROMAN);

        // Helper: get the letter-name for this PC in the current key
        function pcName(pc) {
            const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
            const { preferFlats } = getKeyAccidentals(NOTE_NAMES[keyRootPc], isMinor);
            return (preferFlats ? FLAT : SHARP)[pc];
        }

        // Loop through each pitch row
        for (let pitch = firstPitch; pitch <= lastPitch; pitch++) {
            const pc = pitch % 12;
            const inScale = isNoteInScale(pitch);
            const isBlack = [1, 3, 6, 8, 10].includes(pc);

            // Compute vertical placement
            const topY = (PITCH_MAX - pitch) * scaledRowH + (scaledGap / 2);
            const rowH = Math.max(1, scaledRowH - scaledGap);

            // Build the DIV
            const row = document.createElement('div');
            row.style.cssText = `
            position: absolute;
            left: 0;
            top: ${topY}px;
            height: ${rowH}px;
            width: 100%;
            line-height: ${rowH}px;
            overflow: hidden;
            white-space: nowrap;
            box-sizing: border-box;
            font-size: ${Math.max(6, Math.min(12, rowH * 0.7))}px;
            border-bottom: 1px solid ${KEY_SEPARATOR_COLOR};
            padding-left: ${isBlack ? 15 : 5}px;
        `;

            // Assign the same classes you used before
            if (isDrumMode) {
                row.className = `drum-name ${inScale ? 'in-scale' : 'out-of-scale'}`;
            } else {
                row.className = `piano-key ${isBlack ? 'black' : 'white'} `
                    + `${inScale ? 'in-scale' : 'out-of-scale'}`;
                if (isBlack) {
                    row.style.width = '70%';
                    row.style.zIndex = '1';
                    row.style.borderBottom = 'none';
                }
            }

            // Decide the text label
            let label, title;
            if (isDrumMode) {
                label = GM_DRUM_MAP[pitch] || `Pitch ${pitch}`;
                title = `${pitch}: ${label}`;
            } else {
                const name = pcName(pc);                        // e.g. "Eb"
                const roman = pcToRoman(pc, keyRootPc, isMinor); // re-use your pcToRoman

                if (useRoman) {
                    label = roman;
                    title = `Degree ${roman}`;
                } else {
                    label = name;
                    title = `${name} (${pitch})`;

                    // If it's a C in name-mode, tack on octave
                    if (pc === 0) {
                        label += (Math.floor(pitch / 12) - 1);
                    }
                }
            }

            row.textContent = label;
            row.title = title;

            keyDisplayContentWrapper.appendChild(row);
        }
    }


    // --- Start the application ---
    initialize();
    initPatternHistory();


}); // End DOMContentLoaded