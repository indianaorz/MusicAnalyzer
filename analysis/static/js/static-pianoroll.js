/**
 * Static Piano Roll Renderer V1.5 (Dark Theme Color Refinements)
 *
 * Renders a non-interactive piano roll from parsed ABC data (from abcjs).
 * Features:
 * - Static rendering onto a canvas.
 * - Refined dark theme colors for keys and rows.
 * - Key/Scale highlighting based on ABC 'K:' field.
 * - Displays full note name + octave on each key.
 * - Colors keys based on scale membership (dark blue/dark orange).
 * - 16th note grid lines (when zoomed sufficiently).
 *
 * Relies on abcjs for parsing ABC notation.
 */

// Wrap in a function to avoid polluting global scope
function createStaticPianoRollRenderer(renderOptions) {
    // Log received options directly (NO JSON.stringify)
    console.log(`[static-pianoroll.js V1.5] Received renderOptions:`, renderOptions);

    const {
        canvas,
        keyDisplayPanel,
        abcTune, // Parsed tune object from abcjs
        ticksPerBeat: initialTicksPerBeat = 480 // Use provided or default
    } = renderOptions;

    // --- Essential Element Checks ---
    if (!canvas || !keyDisplayPanel) {
        console.error("StaticRenderer: Missing required options (canvas, keyDisplayPanel).");
        return null; // Indicate failure
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
        console.error("StaticRenderer: Could not get 2D context.");
        return null;
    }

    // Use the initial ticksPerBeat passed in or defaulted
    let ticksPerBeat = initialTicksPerBeat;

    // --- Constants ---
    const NOTE_BASE_HEIGHT = 12;
    const PIXELS_PER_TICK_BASE = 0.05;
    const PITCH_MIN = 0;
    const PITCH_MAX = 127;
    const PITCH_RANGE = PITCH_MAX - PITCH_MIN + 1;
    const NOTE_VERTICAL_GAP = 1;
    const PADDING_PITCHES = 2;
    const GRID_SUBDIVISION_MIN_PIXELS = 3; // Lowered threshold slightly

    // --- Refined Dark Theme Colors ---
    const NOTE_IN_SCALE_COLOR = '#6cb2f5'; // Brighter Blue for notes
    const NOTE_OUT_SCALE_COLOR = '#ffb74d'; // Brighter Orange for notes

    // Subtle Row Backgrounds for Dark Theme
    const GRID_ROW_IN_SCALE_COLOR = 'rgba(63, 107, 173, 0.1)'; // Very subtle blue overlay
    const GRID_ROW_OUT_SCALE_COLOR = 'rgba(139, 74, 26, 0.1)'; // Very subtle orange overlay

    const GRID_LINE_COLOR = '#404040';        // Lightest grid lines (16ths) - Slightly darker
    const BEAT_LINE_COLOR = '#555';        // Medium grid lines (beats)
    const MEASURE_LINE_COLOR = '#777';       // Darkest grid lines (measures)
    const BACKGROUND_COLOR = '#1e1e1e';     // Dark background
    const MEASURE_SHADING_COLOR = 'rgba(255, 255, 255, 0.04)'; // Light overlay
    const DARK_MEASURE_SHADING_COLOR = 'rgba(0, 0, 0, 0.04)'; // Dark overlay for even measures

    // Key Colors (Mainly CSS, but references useful)
    const KEY_WHITE_COLOR_JS = '#3a3a3a'; // Reference for JS logic if needed
    const KEY_BLACK_COLOR_JS = '#1a1a1a'; // Reference for JS logic if needed
    const KEY_SEPARATOR_COLOR = '#444';     // Separator lines between keys
    const KEY_TEXT_COLOR_JS = '#e0e0e0';      // Light text for keys
    const KEY_BLACK_TEXT_COLOR_JS = '#cccccc'; // Slightly dimmer light text for black keys

    // --- Maps & Definitions ---
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
    };
    const SCALE_INTERVALS = {
        'major': [0, 2, 4, 5, 7, 9, 11], 'minor': [0, 2, 3, 5, 7, 8, 10],
        'pentatonicMajor': [0, 2, 4, 7, 9], 'pentatonicMinor': [0, 3, 5, 7, 10],
        'blues': [0, 3, 5, 6, 7, 10], 'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        'none': []
    };
    const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // --- State Variables ---
    let scaleX = 1.0;
    let contentWidthTicks = 0;
    let contentMinPitch = PITCH_MAX;
    let contentMaxPitch = PITCH_MIN;
    let keyDisplayContentWrapper = null;
    let selectedRootNote = 0;
    let selectedScaleType = 'major';
    let currentScalePitchClasses = new Set();
    let currentScaleNotes = new Set();
    let isPercussion = false;
    let timeSignatureNumerator = 4;
    let timeSignatureDenominator = 4;
    let ticksPerMeasure = ticksPerBeat * 4;
    let shadeEvenMeasures = true;
    let notesToRender = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let effectiveNoteHeight = NOTE_BASE_HEIGHT;
    let totalRenderedPitchRange = PITCH_RANGE;


    /**
 * How does the key‑signature modify each letter?
 * returns { sharps:Set<string>, flats:Set<string>, preferFlats:boolean }
 */
    function getKeyAccidentals(rootName, isMinor) {
        const NAME2STEP = {
            C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, F: 5, 'E#': 5,
            'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11
        };
        const STEP2MAJ = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        const SHARPS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
        const FLATS = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
        const SIG = {
            C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, 'C#': 7,
            F: -1, 'Bb': -2, 'Eb': -3, 'Ab': -4, 'Db': -5, 'Gb': -6, 'Cb': -7
        };

        rootName = (rootName || '').trim();               // safety
        if (!(rootName in NAME2STEP)) rootName = 'C';

        let majStep = NAME2STEP[rootName];
        if (isMinor) majStep = (majStep + 3) % 12;      // relative major
        const majName = STEP2MAJ[majStep];
        const count = SIG[majName] ?? 0;

        const sharps = new Set(), flats = new Set();
        if (count > 0) SHARPS.slice(0, count).forEach(l => sharps.add(l));
        if (count < 0) FLATS.slice(0, -count).forEach(l => flats.add(l));

        return { sharps, flats, preferFlats: count < 0 };
    }

    /**
     * Convert one ABC note text (e.g. "^G,", "_B'", "=c") to a MIDI pitch,
     * fully respecting the key‑signature **and** any accidentals earlier
     * in the same bar.
     *
     * @param {string}  abcName    raw pitch text from abcjs (p.name)
     * @param {Object}  keyAcc     {sharps, flats, preferFlats} from getKeyAccidentals
     * @param {Object}  measureAcc mutable object holding bar‑local accidentals
     * @returns {number} MIDI pitch 0‑127
     */
    function abcNameToMidiPitch(abcName, keyAcc, measureAcc) {
        // ----- 1. read accidentals (^ ^^ _ __ =) ----------------------
        let pos = 0, explicit = 0;
        while (abcName[pos] === '^' || abcName[pos] === '_') {
            explicit += (abcName[pos] === '^' ? +1 : -1);
            pos++;
        }
        if (abcName[pos] === '=') { explicit = 0; pos++; }   // natural

        // ----- 2. read the letter -------------------------------------
        const letterMatch = abcName.slice(pos).match(/[A-Ga-g]/);
        if (!letterMatch) return 60;                       // safety
        const letter = letterMatch[0].toUpperCase();
        const isLower = /[a-g]/.test(letterMatch[0]);
        pos += 1;

        // ----- 3. octave marks ( ' or , ) ------------------------------
        let octShift = 0;
        while (pos < abcName.length) {
            if (abcName[pos] === "'") { octShift++; pos++; }
            else if (abcName[pos] === ',') { octShift--; pos++; }
            else break;
        }

        // ----- 4. decide the final accidental value for this letter ----
        let accVal;
        if (explicit !== 0 || abcName.includes('=')) {       // we saw ^,_,=…
            accVal = explicit;
            measureAcc[letter] = accVal;                   // remember for bar
        } else if (letter in measureAcc) {                 // bar‑memory
            accVal = measureAcc[letter];
        } else {                                           // key‑signature
            accVal = keyAcc.sharps.has(letter) ? +1 :
                keyAcc.flats.has(letter) ? -1 : 0;
        }

        // ----- 5. base semitone of natural letter ---------------------
        const naturals = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        let pc = naturals[letter] + accVal;                // 0‑11
        pc = (pc + 12) % 12;

        // ----- 6. octave number ---------------------------------------
        const baseMidi = isLower ? 72 : 60;                // C5 or C4
        let midi = baseMidi + (naturals[letter] - naturals['C']) + accVal;
        midi += octShift * 12;
        return Math.max(0, Math.min(127, midi));
    }



    // --- Parsing Helpers ---
    // In static-pianoroll.js
    // --- [LOGGING] --- Ensure parseKeySignature is defined here ---
    // Ensure parseKeySignature is fully defined (copied if necessary from previous context)
    function parseKeySignature(keyInfo, meta = {}) {
        const titleForLog = meta?.T || 'Unknown Title';
        console.log(`[SPR LOG] parseKeySignature called. keyInfo:`, keyInfo, ` Meta Title: ${titleForLog}`);
        isPercussion = false; // Reset percussion flag

        if (keyInfo && typeof keyInfo === 'object' && keyInfo.el_type === 'keySignature') {
            console.log('[SPR LOG] Processing keyInfo as keySignature object.');
            const noteName = (keyInfo.root || "").toUpperCase();
            const accidental = keyInfo.acc || "";
            let mode = (keyInfo.mode || "").toLowerCase().replace(/ /g, ''); // Normalize mode string

            if (!noteName) {
                console.log('[SPR LOG] Key root missing, defaulting to C Major.');
                selectedRootNote = 0;
                selectedScaleType = 'major';
            } else {
                let rootIndex = NOTE_NAMES.indexOf(noteName);
                if (rootIndex === -1) {
                    console.warn(`[SPR WARN] Unrecognized key root: ${noteName}. Defaulting to C Major.`);
                    selectedRootNote = 0;
                    selectedScaleType = 'major';
                } else {
                    // Adjust root index based on accidental
                    if (accidental === '#') rootIndex = (rootIndex + 1) % 12;
                    else if (accidental === 'b') rootIndex = (rootIndex + 11) % 12;
                    // Handle explicit natural ('')
                    selectedRootNote = rootIndex;

                    // Determine scale type based on mode
                    if (['m', 'min', 'minor', 'aeo', 'aeolian'].includes(mode)) selectedScaleType = 'minor';
                    else if (['penta', 'pentatonicmajor', 'pentatonic'].includes(mode)) selectedScaleType = 'pentatonicMajor';
                    else if (['pentatonicminor'].includes(mode)) selectedScaleType = 'pentatonicMinor';
                    else if (['blues'].includes(mode)) selectedScaleType = 'blues';
                    else if (['chrom', 'chromatic'].includes(mode)) selectedScaleType = 'chromatic';
                    else if (['maj', 'major', 'ion', 'ionian', ''].includes(mode)) selectedScaleType = 'major'; // Default to major if mode empty or common major modes
                    else {
                        console.warn(`[SPR WARN] Unrecognized mode: "${mode}". Defaulting to major scale type.`);
                        selectedScaleType = 'major';
                    }
                    // Additional modes (mix, dor, phr, lyd) could be added here if needed
                }
            }
        } else if (typeof keyInfo === 'string' && keyInfo.trim().toLowerCase() === 'perc') {
            console.log("[SPR LOG] Detected K:perc.");
            isPercussion = true;
            selectedScaleType = 'none'; // Use 'none' for scale highlighting logic
            selectedRootNote = 0; // Default root doesn't matter much for percussion
        } else {
            console.log('[SPR LOG] No valid key info or K:perc found. Defaulting key signature to C Major.');
            selectedRootNote = 0;
            selectedScaleType = 'major';
        }
        console.log(`[SPR LOG] parseKeySignature finished. root: <span class="math-inline">\{selectedRootNote\} \(</span>{NOTE_NAMES[selectedRootNote]}), type: ${selectedScaleType}, isPercussion: ${isPercussion}`);
    }

    /**
       * Converts an ABC note name string (like "^G,", "_B'", "C") to a MIDI pitch. V1.7 DEBUG
       * Assumes standard octave conventions (Middle C 'C' = MIDI 60, 'c' = MIDI 72).
       * @param {string} abcName The ABC note name string.
       * @returns {number} The calculated MIDI pitch, or a default (e.g., 60) if unparseable.
       */
    function abcNoteToMidiPitch(abcName) {
        // --- V1.7 Add Internal Debug Logging ---
        const FN_NAME = "[abcNoteToMidiPitch V1.7 DEBUG]";
        // console.log(`${FN_NAME} Input: "${abcName}"`); // Log every input if needed

        if (!abcName || typeof abcName !== 'string') {
            console.warn(`${FN_NAME} Invalid input: ${abcName}. Returning default 60.`);
            return 60;
        }

        let pitch = 0;
        let accidentalOffset = 0;
        let octaveShift = 0;
        let baseNote = '';
        let baseNoteCase = 'upper'; // 'upper' for CDEFGAB, 'lower' for cdefgab
        let pos = 0;

        // 1. Parse Accidental (optional: ^, _, =)
        if (abcName[pos] === '^') { accidentalOffset = 1; pos++; }
        else if (abcName[pos] === '_') { accidentalOffset = -1; pos++; }
        else if (abcName[pos] === '=') { accidentalOffset = 0; pos++; }

        // 2. Parse Base Note (C-G or c-g)
        if (pos < abcName.length) {
            const char = abcName[pos];
            if (/[A-G]/.test(char)) { baseNote = char; baseNoteCase = 'upper'; pos++; }
            else if (/[a-g]/.test(char)) { baseNote = char.toUpperCase(); baseNoteCase = 'lower'; pos++; }
            else { console.warn(`${FN_NAME} Could not parse base note from: ${abcName}`); return 60; }
        } else { console.warn(`${FN_NAME} String too short after accidental: ${abcName}`); return 60; }

        // 3. Parse Octave Markers (optional: ' ,)
        while (pos < abcName.length) {
            if (abcName[pos] === "'") { octaveShift++; pos++; }
            else if (abcName[pos] === ",") { octaveShift--; pos++; }
            else { break; }
        }

        // 4. Calculate Pitch
        const baseMidiOctave4 = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, B: 71 }; // ABC 'C' octave
        const baseMidiOctave5 = { C: 72, D: 74, E: 76, F: 77, G: 79, A: 81, B: 83 }; // ABC 'c' octave

        if (!(baseNote in baseMidiOctave4)) { console.warn(`${FN_NAME} Invalid base note parsed: ${baseNote}`); return 60; }

        // Start with the correct base octave based on the parsed letter case
        let initialPitch = (baseNoteCase === 'upper') ? baseMidiOctave4[baseNote] : baseMidiOctave5[baseNote];
        pitch = initialPitch;

        // Apply octave shifts relative to the base octave determined by case
        pitch += octaveShift * 12;

        // Apply accidental offset
        pitch += accidentalOffset;

        // Clamp to MIDI range 0-127
        pitch = Math.max(0, Math.min(127, pitch));

        // --- Log internal steps specifically for lowercase notes that were problematic ---
        if (baseNoteCase === 'lower' && ['C', 'G', 'F', 'D'].includes(baseNote)) {
            console.log(`${FN_NAME} Details for "${abcName}": Base='${baseNote}', Case='${baseNoteCase}', InitialPitch=${initialPitch}, OctShift=${octaveShift}, AccOffset=${accidentalOffset} => Final Pitch: ${pitch}`);
        }

        return pitch;
    }



    /**
     * Parse abcjs visualObj → notesToRender[]
     * • keeps an independent clock for every *voice id*
     * • voice order may change between systems – we ignore the array index
     * • assigns a stable renderIndex per voice so colours don’t shuffle
     */
    function processAbcTune() {
        console.log('[SPR] --- processAbcTune START ---');

        /* ─── 0. sanity ────────────────────────────────────────────────── */
        const tune = abcTune.tune || abcTune;
        if (!tune?.lines?.length) {
            console.error('[SPR] Invalid tune object – no .lines[]'); return;
        }

        /* ─── 1. header info (key, meter, unit length) ─────────────────── */
        const meta = tune.metaText || {};
        const keyInfo = (typeof tune.getKeySignature === 'function')
            ? tune.getKeySignature() : meta.K;
        parseKeySignature(keyInfo, meta);

        const meter = (typeof tune.getMeter === 'function')
            ? tune.getMeter() : { beats: 4, value: 4 };
        timeSignatureNumerator = meter.beats || 4;
        timeSignatureDenominator = meter.value || 4;

        let unitLen = 1 / 8;
        if (typeof tune.getUnitLength === 'function') {
            try { unitLen = tune.getUnitLength() || unitLen; } catch { }
        } else if (meta.L) {
            const p = meta.L.split('/'); if (p.length === 2) unitLen = 1 / +p[1];
        }

        const ticksPerWhole = ticksPerBeat * 4;
        const ticksPerUnit = ticksPerWhole * unitLen;
        ticksPerMeasure = ticksPerBeat * (4 / timeSignatureDenominator) *
            timeSignatureNumerator;

        /* ─── 2. state  ────────────────────────────────────────────────── */
        notesToRender.length = 0;
        contentMinPitch = PITCH_MAX; contentMaxPitch = PITCH_MIN;
        let lastEndTick = 0;

        const clock = new Map();   // voiceId → currentTick
        const id2index = new Map();   // voiceId → 0..N  (stable render index)
        const keyAcc = getKeyAccidentals(
            NOTE_NAMES[selectedRootNote],
            selectedScaleType.includes('min'));

        /* ─── 3. walk every system / staff / voice ─────────────────────── */
        tune.lines.forEach(line => {
            if (!line.staff) return;
            line.staff.forEach((staff, staffIdx) => {
                if (!staff.voices) return;

                staff.voices.forEach((voiceElems, voiceIdx) => {
                    if (!Array.isArray(voiceElems) || !voiceElems.length) return;

                    /* ▶ identify this voice */
                    const voiceId = (voiceElems[0].voice !== undefined)
                        ? String(voiceElems[0].voice)
                        : `s${staffIdx}v${voiceIdx}`;
                    if (!id2index.has(voiceId))
                        id2index.set(voiceId, id2index.size);   // assign new colour

                    let t = clock.get(voiceId) || 0;
                    let measureAcc = {};

                    voiceElems.forEach(el => {
                        const durTicks = Math.round(el.duration * ticksPerWhole);   // ✔ absolute
                        const isRest = (el.el_type === 'rest') ||
                            (el.el_type === 'note' && (!el.pitches?.length));
                        const isNote = (el.el_type === 'note' && !isRest);

                        if (el.el_type === 'bar') measureAcc = {}; // clear ♯/♭ cache

                        if (isNote) {
                            el.pitches.forEach(p => {
                                const midi = p.name
                                    ? abcNameToMidiPitch(p.name, keyAcc, measureAcc)
                                    : p.pitch;
                                if (midi >= PITCH_MIN && midi <= PITCH_MAX) {
                                    notesToRender.push({
                                        pitch: midi,
                                        start_tick: t,
                                        duration_ticks: durTicks,
                                        velocity: el.velocity || 100,
                                        voice: id2index.get(voiceId)
                                    });
                                    contentMinPitch = Math.min(contentMinPitch, midi);
                                    contentMaxPitch = Math.max(contentMaxPitch, midi);
                                }
                            });
                        }

                        if (isRest || isNote) {
                            t += durTicks;
                            lastEndTick = Math.max(lastEndTick, t);
                        }
                    });

                    clock.set(voiceId, t);
                });
            });
        });

        /* ─── 4. wrap‑up ───────────────────────────────────────────────── */
        contentWidthTicks = lastEndTick || ticksPerBeat * 4;
        updateCurrentScaleNotes();

        console.log(`[SPR] Parsed ${notesToRender.length} notes, `
            + `voices: ${id2index.size}, widthTicks: ${contentWidthTicks}`);
        console.log('[SPR] --- processAbcTune END ---');
    }




    // --- Coordinate Transformation ---
    function midiTickToCanvasX(tick) {
        const safeScaleX = (scaleX && isFinite(scaleX)) ? scaleX : 1.0;
        return (tick * PIXELS_PER_TICK_BASE * safeScaleX);
    }

    function midiPitchToCanvasY(pitch) {
        const pitchRelativeToBottom = pitch - (contentMinPitch - PADDING_PITCHES);
        const yPosition = canvasHeight - ((pitchRelativeToBottom + 1) * effectiveNoteHeight);
        return yPosition;
    }

    // --- Initialization and Sizing ---
    function setupStaticView() {
        processAbcTune();

        const parentContainer = canvas.parentElement;
        if (!parentContainer) {
            console.error("StaticRenderer: Canvas must have a parent container for sizing.");
            canvasWidth = 300; canvasHeight = 150;
        } else {
            canvasWidth = parentContainer.clientWidth;
            canvasHeight = parentContainer.clientHeight;
        }
        if (canvasWidth <= 0 || canvasHeight <= 0) {
            console.warn("StaticRenderer: Canvas container has zero dimensions. Using fallback.");
            canvasWidth = Math.max(canvasWidth, 300); canvasHeight = Math.max(canvasHeight, 150);
        }

        const safeContentWidthTicks = Math.max(1, contentWidthTicks);
        const requiredPixelWidth = safeContentWidthTicks * PIXELS_PER_TICK_BASE;
        scaleX = canvasWidth / requiredPixelWidth;
        scaleX = Math.max(0.01, scaleX);

        totalRenderedPitchRange = (contentMaxPitch - contentMinPitch + 1) + (2 * PADDING_PITCHES);
        totalRenderedPitchRange = Math.max(1, totalRenderedPitchRange);
        effectiveNoteHeight = canvasHeight / totalRenderedPitchRange;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(canvasWidth * dpr);
        canvas.height = Math.round(canvasHeight * dpr);
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        setupKeyDisplay();

        console.log(`StaticRenderer: Setup complete. Canvas=${canvasWidth}x${canvasHeight}, Ticks=${contentWidthTicks}, PitchRange=[${contentMinPitch}-${contentMaxPitch}], ScaleX=${scaleX.toFixed(3)}, PixelsPerPitch=${effectiveNoteHeight.toFixed(2)}`);
        redrawStaticPianoRoll();
    }

    function setupKeyDisplay() {
        if (!keyDisplayPanel) return;
        keyDisplayContentWrapper = document.createElement('div');
        keyDisplayContentWrapper.className = 'key-display-content';
        keyDisplayContentWrapper.style.position = 'absolute';
        keyDisplayContentWrapper.style.left = '0';
        keyDisplayContentWrapper.style.top = '0';
        keyDisplayContentWrapper.style.width = '100%';
        const totalContentPixelHeight = totalRenderedPitchRange * effectiveNoteHeight;
        keyDisplayContentWrapper.style.height = `${totalContentPixelHeight}px`;

        keyDisplayPanel.innerHTML = '';
        keyDisplayPanel.appendChild(keyDisplayContentWrapper);
        keyDisplayPanel.style.overflow = 'hidden';

        drawKeyDisplay(contentMinPitch - PADDING_PITCHES, contentMaxPitch + PADDING_PITCHES);
    }

    // --- Scale Highlighting Logic ---
    // In static-pianoroll.js
    function updateCurrentScaleNotes() {
        // Clear previous scale data
        currentScaleNotes.clear();
        currentScalePitchClasses.clear();

        // Determine the scale type to use (handle percussion)
        const scaleType = isPercussion ? 'none' : selectedScaleType;
        // Get the intervals for the scale type from our definition
        const intervals = SCALE_INTERVALS[scaleType] || [];

        // --- DEBUG LOGGING ---
        console.log(`[updateCurrentScaleNotes] Calculating scale for root: ${selectedRootNote} (${NOTE_NAMES[selectedRootNote]}), type: ${scaleType}`);
        if (intervals.length > 0) {
            console.log(`[updateCurrentScaleNotes] Using intervals: [${intervals.join(', ')}]`);
        } else if (!isPercussion) {
            console.warn(`[updateCurrentScaleNotes] No intervals found for scale type "${scaleType}". No scale highlighting will be applied.`);
        } else {
            console.log(`[updateCurrentScaleNotes] Percussion track - all notes considered 'in scale' visually.`);
        }
        // --- END DEBUG LOGGING ---


        // If no intervals (e.g., 'none' scale or unknown type), exit early
        // For percussion, we also don't need pitch classes, but isNoteInScale handles it.
        if (intervals.length === 0 && !isPercussion) {
            return;
        }

        // Calculate the pitch classes (0-11) belonging to the scale
        for (const interval of intervals) {
            // Ensure interval is a number; skip if not
            if (typeof interval === 'number' && isFinite(interval)) {
                const pitchClass = (selectedRootNote + interval) % 12;
                currentScalePitchClasses.add(pitchClass);
            } else {
                console.warn(`[updateCurrentScaleNotes] Invalid interval found: ${interval}`);
            }
        }

        // --- DEBUG LOGGING ---
        // Sort the pitch classes for clearer logging
        const sortedPitchClasses = Array.from(currentScalePitchClasses).sort((a, b) => a - b);
        console.log(`[updateCurrentScaleNotes] Calculated scale pitch classes: {${sortedPitchClasses.join(', ')}} (Indices: ${sortedPitchClasses.map(pc => NOTE_NAMES[pc]).join(', ')})`);
        // --- END DEBUG LOGGING ---

        // Populate the set of all MIDI notes belonging to these pitch classes
        for (let pitch = PITCH_MIN; pitch <= PITCH_MAX; pitch++) {
            // Check if the current pitch's class (pitch % 12) is in our calculated set
            if (currentScalePitchClasses.has(pitch % 12)) {
                currentScaleNotes.add(pitch);
            }
        }

        // --- DEBUG LOGGING ---
        // Optional: Log how many notes were added if useful
        // console.log(`[updateCurrentScaleNotes] Populated ${currentScaleNotes.size} MIDI notes into currentScaleNotes set.`);
        // --- END DEBUG LOGGING ---
    }
    function isNoteInScale(pitch) {
        if (isPercussion) { return true; } return currentScaleNotes.has(pitch);
    }

    // --- Drawing Functions ---
    function redrawStaticPianoRoll() {
        requestAnimationFrame(() => {
            ctx.save();
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            // No separate background fill needed if rows cover everything

            const startTickVisible = 0;
            const endTickVisible = contentWidthTicks;
            const lowPitchVisible = contentMinPitch - PADDING_PITCHES;
            const highPitchVisible = contentMaxPitch + PADDING_PITCHES;

            drawGrid(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);
            drawAllNotes(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);
            drawKeyDisplay(lowPitchVisible, highPitchVisible);

            ctx.restore();
        });
    }

    function drawGrid(startTick, endTick, lowPitch, highPitch) {
        // --- Canvas Dimensions ---
        const viewWidth = canvas.width / (window.devicePixelRatio || 1);
        const viewHeight = canvas.height / (window.devicePixelRatio || 1);

        // --- Use calculated state variables (time sig, ticks) ---
        const localTimeSigNum = timeSignatureNumerator;
        const localTimeSigDen = timeSignatureDenominator;
        const localTicksPerQuarter = ticksPerBeat; // Already set, assumed to be Quarter Note ticks
        const localTicksPerMeasure = ticksPerMeasure; // Already calculated

        // --- Calculate ACTUAL Beat Ticks based on Time Sig Denominator ---
        let ticksPerActualBeat = localTicksPerQuarter; // Default for /4, /2, /1 denominators
        if (localTimeSigDen === 8) {
            // For /8 time signatures (e.g., 6/8), the "beat" is often felt as a dotted quarter
            ticksPerActualBeat = localTicksPerQuarter * 1.5; // 1.5 quarter notes = dotted quarter
        } else if (localTimeSigDen === 2) {
            // For /2 time signatures (e.g., 2/2), the beat is a half note
            ticksPerActualBeat = localTicksPerQuarter * 2;
        } // Add other denominators like /16 if needed
        // Ensure valid value
        if (ticksPerActualBeat <= 0) ticksPerActualBeat = localTicksPerQuarter;

        // Ticks Per Subdivision (16th notes relative to a quarter note)
        const ticksPerSixteenth = localTicksPerQuarter > 0 ? localTicksPerQuarter / 4 : 0;

        // --- Get Scaled Pixel Widths ---
        const scaledNoteRowHeight = effectiveNoteHeight;
        const sixteenthPixelWidth = ticksPerSixteenth > 0 ? (ticksPerSixteenth * PIXELS_PER_TICK_BASE * scaleX) : 0;
        const beatPixelWidth = ticksPerActualBeat > 0 ? (ticksPerActualBeat * PIXELS_PER_TICK_BASE * scaleX) : 0;
        const measurePixelWidth = localTicksPerMeasure > 0 ? (localTicksPerMeasure * PIXELS_PER_TICK_BASE * scaleX) : 0;

        // --- Minimum Pixel Spacing Thresholds ---
        const minSixteenthSpacing = 2.5;
        const minBeatSpacing = 2.0;
        const minMeasureSpacing = 0.5;

        // --- Visible Tick Range ---
        const startTickDraw = startTick - (ticksPerSixteenth > 0 ? ticksPerSixteenth : 1); // Adjusted for safety
        const endTickDraw = endTick + (ticksPerSixteenth > 0 ? ticksPerSixteenth : 1);

        ctx.save(); // Save context state

        // --- 1. Draw Row Backgrounds (Based on Scale) ---
        // Uses GRID_ROW_IN_SCALE_COLOR / GRID_ROW_OUT_SCALE_COLOR
        for (let p = Math.floor(lowPitch); p <= Math.ceil(highPitch); p++) {
            if (p < PITCH_MIN || p > PITCH_MAX) continue;
            const rowY = midiPitchToCanvasY(p);
            const rowHeight = scaledNoteRowHeight;
            if (rowY + rowHeight < 0 || rowY > viewHeight) continue; // Vertical cull
            const isInScale = isNoteInScale(p);
            ctx.fillStyle = isInScale ? GRID_ROW_IN_SCALE_COLOR : GRID_ROW_OUT_SCALE_COLOR;
            ctx.fillRect(0, rowY, viewWidth, rowHeight);
        }

        // --- 2. Draw Alternating Measure Shading ---
        // Uses DARK_MEASURE_SHADING_COLOR
        if (localTicksPerMeasure > 0) {
            const firstMeasureIndex = Math.max(0, Math.floor(startTickDraw / localTicksPerMeasure));
            const lastMeasureIndex = Math.ceil(endTickDraw / localTicksPerMeasure);
            // Use the correct dark theme shading color reference
            ctx.fillStyle = DARK_MEASURE_SHADING_COLOR; // Defined elsewhere in the constants
            for (let m = firstMeasureIndex; m < lastMeasureIndex; m++) {
                const shouldShade = (m % 2 === (shadeEvenMeasures ? 0 : 1));
                if (shouldShade) {
                    const measureStartTick = m * localTicksPerMeasure;
                    const measureEndTick = (m + 1) * localTicksPerMeasure;
                    const measureStartX = midiTickToCanvasX(measureStartTick);
                    const measureEndX = midiTickToCanvasX(measureEndTick);
                    if (measureEndX < 0 || measureStartX > viewWidth) continue; // Horizontal cull
                    const drawX = Math.max(0, measureStartX);
                    const drawWidth = Math.min(viewWidth, measureEndX) - drawX;
                    if (drawWidth > 0) {
                        ctx.fillRect(drawX, 0, drawWidth, viewHeight);
                    }
                }
            }
        }

        // --- 3. Draw Horizontal Pitch Lines ---
        // Uses KEY_SEPARATOR_COLOR
        ctx.strokeStyle = KEY_SEPARATOR_COLOR;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let p = Math.floor(lowPitch); p <= Math.ceil(highPitch) + 1; p++) {
            if (p < PITCH_MIN || p > PITCH_MAX + 1) continue;
            // Calculate Y position for the bottom edge of pitch p (top edge of p-1)
            const lineY = midiPitchToCanvasY(p - 1) + scaledNoteRowHeight;
            if (lineY >= -1 && lineY <= viewHeight + 1) { // Check bounds
                const yCoord = Math.round(lineY) + 0.5; // Pixel align
                ctx.moveTo(0, yCoord);
                ctx.lineTo(viewWidth, yCoord);
            }
        }
        ctx.stroke();


        // --- 4. Draw Vertical Time Lines ---

        // Draw 16th note subdivisions (relative to quarter note)
        if (ticksPerSixteenth > 0 && sixteenthPixelWidth >= minSixteenthSpacing) {
            ctx.strokeStyle = GRID_LINE_COLOR; // Lightest grid lines (#404040)
            ctx.lineWidth = 0.25;
            ctx.beginPath();
            const startSixteenth = Math.max(0, Math.floor(startTickDraw / ticksPerSixteenth));
            const endSixteenth = Math.ceil(endTickDraw / ticksPerSixteenth);
            for (let s = startSixteenth; s <= endSixteenth; s++) {
                const tick = s * ticksPerSixteenth;
                // Avoid drawing over thicker lines if they will be drawn
                const isActualBeat = (ticksPerActualBeat > 0 && Math.abs(tick % ticksPerActualBeat) < 0.01);
                const isMeasure = (localTicksPerMeasure > 0 && Math.abs(tick % localTicksPerMeasure) < 0.01);
                if ((isActualBeat && beatPixelWidth >= minBeatSpacing) || (isMeasure && measurePixelWidth >= minMeasureSpacing)) continue;

                const x = midiTickToCanvasX(tick);
                if (x >= -1 && x <= viewWidth + 1) {
                    const xCoord = Math.round(x) + 0.5;
                    ctx.moveTo(xCoord, 0); ctx.lineTo(xCoord, viewHeight);
                }
            }
            ctx.stroke();
        }

        // Draw ACTUAL Beat Lines
        if (ticksPerActualBeat > 0 && beatPixelWidth >= minBeatSpacing) {
            ctx.strokeStyle = BEAT_LINE_COLOR; // Medium grid lines (#555)
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            const startActualBeat = Math.max(0, Math.floor(startTickDraw / ticksPerActualBeat));
            const endActualBeat = Math.ceil(endTickDraw / ticksPerActualBeat);
            for (let beat = startActualBeat; beat <= endActualBeat; beat++) {
                const tick = beat * ticksPerActualBeat;
                // Avoid drawing over measure lines
                const isMeasure = (localTicksPerMeasure > 0 && Math.abs(tick % localTicksPerMeasure) < 0.01);
                if (isMeasure && measurePixelWidth >= minMeasureSpacing) continue;

                const x = midiTickToCanvasX(tick);
                if (x >= -1 && x <= viewWidth + 1) {
                    const xCoord = Math.round(x) + 0.5;
                    ctx.moveTo(xCoord, 0); ctx.lineTo(xCoord, viewHeight);
                }
            }
            ctx.stroke();
        }

        // Draw Measure Lines
        if (localTicksPerMeasure > 0 && measurePixelWidth >= minMeasureSpacing) {
            ctx.strokeStyle = MEASURE_LINE_COLOR; // Darkest grid lines (#777)
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            const firstMeasure = Math.max(0, Math.floor(startTickDraw / localTicksPerMeasure));
            const lastMeasureLineIndex = Math.ceil(endTickDraw / localTicksPerMeasure);
            for (let measure = firstMeasure; measure <= lastMeasureLineIndex; measure++) {
                const tick = measure * localTicksPerMeasure;
                const x = midiTickToCanvasX(tick);
                if (x >= -1 && x <= viewWidth + 1) {
                    const xCoord = Math.round(x) + 0.5;
                    ctx.moveTo(xCoord, 0); ctx.lineTo(xCoord, viewHeight);
                }
            }
            ctx.stroke();
        }

        ctx.restore(); // Restore context state
    }

    // Make sure the rest of static-pianoroll.js remains the same

    // Replace drawAllNotes with this drop‑in:
    function drawAllNotes(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible) {
        // Draw every voice’s notes:
        notesToRender.forEach(note => {
            const { pitch, start_tick, duration_ticks, voice } = note;
            const noteEndTick = start_tick + duration_ticks;
            if (noteEndTick < startTickVisible || start_tick > endTickVisible ||
                pitch < lowPitchVisible || pitch > highPitchVisible) {
                return;
            }
            drawNoteWithHighlight(note, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);
        });
    }

    // Replace drawNotesForSnippet (or implement drawNoteWithHighlight) with this:
    function drawNoteWithHighlight(note, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible) {
        const { pitch, start_tick, duration_ticks, velocity, voice } = note;
        const isInScale = isNoteInScale(pitch);
        const x = midiTickToCanvasX(start_tick);
        const y = midiPitchToCanvasY(pitch);
        const w = Math.max(1, duration_ticks * PIXELS_PER_TICK_BASE * scaleX);

        // Determine color: highlight only the chosen voice, grey out others
        const highlightVoice = renderOptions.highlightVoiceIndex; // pass this into your renderer
        let fillColor;
        if (highlightVoice == null || voice === highlightVoice) {
            fillColor = isInScale ? NOTE_IN_SCALE_COLOR : NOTE_OUT_SCALE_COLOR;
        } else {
            fillColor = '#888888'; // grey for non‑highlighted tracks
        }

        // Alpha by velocity if highlighted, otherwise fixed
        const alpha = (highlightVoice == null || voice === highlightVoice)
            ? Math.max(0.3, Math.min(1, (velocity / 127)))
            : 0.6;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = fillColor;
        const drawY = y + NOTE_VERTICAL_GAP / 2;
        const drawH = Math.max(1, (NOTE_BASE_HEIGHT - NOTE_VERTICAL_GAP));
        ctx.fillRect(x, drawY, w, drawH);

        ctx.globalAlpha = 1;
    }



    function drawNotesForSnippet(notes, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible) {
        const noteDrawHeight = Math.max(1, effectiveNoteHeight - NOTE_VERTICAL_GAP);
        const verticalCenterOffset = (effectiveNoteHeight - noteDrawHeight) / 2;

        notes.forEach(note => {
            const noteEndTick = note.start_tick + note.duration_ticks;
            if (noteEndTick < startTickVisible || note.start_tick > endTickVisible ||
                note.pitch < lowPitchVisible || note.pitch > highPitchVisible) {
                return;
            }
            const isInScale = isNoteInScale(note.pitch);
            const x = midiTickToCanvasX(note.start_tick);
            const noteTopY = midiPitchToCanvasY(note.pitch);
            const w = Math.max(1, note.duration_ticks * PIXELS_PER_TICK_BASE * scaleX);

            ctx.fillStyle = isInScale ? NOTE_IN_SCALE_COLOR : NOTE_OUT_SCALE_COLOR;
            ctx.globalAlpha = 0.9;

            const drawY = noteTopY + verticalCenterOffset;
            const drawX = Math.max(0, x);
            const clippedDrawY = Math.max(0, drawY);
            const drawW = Math.min(canvasWidth - drawX, w - (drawX - x));
            const clippedDrawH = Math.min(canvasHeight - clippedDrawY, noteDrawHeight - (clippedDrawY - drawY));

            if (drawW > 0 && clippedDrawH > 0) {
                ctx.fillRect(drawX, clippedDrawY, drawW, clippedDrawH);
            }
            ctx.globalAlpha = 1.0;
        });
    }

    function drawKeyDisplay(lowPitchVisible, highPitchVisible) {
        if (!keyDisplayContentWrapper || !keyDisplayPanel) return;
        keyDisplayContentWrapper.innerHTML = '';
        const fragment = document.createDocumentFragment();

        const renderPitchMin = Math.floor(lowPitchVisible);
        const renderPitchMax = Math.ceil(highPitchVisible);

        for (let pitch = renderPitchMin; pitch <= renderPitchMax; pitch++) {
            if (pitch < PITCH_MIN || pitch > PITCH_MAX) continue;

            const keyElement = document.createElement('div');
            const isInScale = isNoteInScale(pitch);

            const pitchRelativeToRenderBottom = pitch - (contentMinPitch - PADDING_PITCHES);
            const totalPitchesToRenderHeight = totalRenderedPitchRange * effectiveNoteHeight;
            const theoreticalTopY = totalPitchesToRenderHeight - ((pitchRelativeToRenderBottom + 1) * effectiveNoteHeight);

            const keyHeight = Math.max(1, effectiveNoteHeight - NOTE_VERTICAL_GAP);
            const verticalCenterOffset = (effectiveNoteHeight - keyHeight) / 2;
            const keyVisualTopY = theoreticalTopY + verticalCenterOffset;

            keyElement.style.position = 'absolute';
            keyElement.style.top = `${keyVisualTopY}px`;
            keyElement.style.left = '0';
            keyElement.style.width = '100%';
            keyElement.style.height = `${keyHeight}px`;
            keyElement.style.lineHeight = `${keyHeight}px`;
            keyElement.style.fontSize = `${Math.max(6, Math.min(10, keyHeight * 0.6))}px`;
            keyElement.style.overflow = 'hidden';
            keyElement.style.whiteSpace = 'nowrap';
            keyElement.style.boxSizing = 'border-box';
            keyElement.style.borderBottom = `1px solid ${KEY_SEPARATOR_COLOR}`;
            keyElement.style.display = 'flex';
            keyElement.style.alignItems = 'center';

            if (isPercussion) {
                keyElement.className = `drum-name ${isInScale ? 'in-scale' : 'out-of-scale'}`;
                keyElement.style.paddingLeft = '6px';
                const drumName = GM_DRUM_MAP[pitch] || `P ${pitch}`;
                keyElement.textContent = drumName;
                keyElement.title = `${pitch}: ${GM_DRUM_MAP[pitch] || 'Unknown Drum'}`;
            } else {
                const isBlackKey = [1, 3, 6, 8, 10].includes(pitch % 12);
                keyElement.className = `piano-key ${isBlackKey ? 'black' : 'white'} ${isInScale ? 'in-scale' : 'out-of-scale'}`;

                // Display Full Note Name + Octave
                const noteName = NOTE_NAMES[pitch % 12];
                const octaveNumber = Math.floor(pitch / 12) - 1; // Adjust octave for MIDI standard
                keyElement.textContent = `${noteName}${octaveNumber}`;
                keyElement.title = `Note ${pitch} (${noteName}${octaveNumber}) - ${isInScale ? 'In Scale' : 'Out of Scale'}`;

                // Adjust padding based on key type (still useful for text alignment)
                if (isBlackKey) {
                    keyElement.style.paddingLeft = '15px';
                    keyElement.style.borderBottom = 'none'; // Override base border
                } else {
                    keyElement.style.paddingLeft = '5px';
                }
                // CSS handles background/color/width/z-index based on classes
            }
            fragment.appendChild(keyElement);
        }
        keyDisplayContentWrapper.appendChild(fragment);
    }


    // --- Public Method ---
    function render() {
        setupStaticView();
    }

    // Return the render function
    return {
        render: render
    };
}