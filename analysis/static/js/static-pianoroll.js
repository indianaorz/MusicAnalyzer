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

    // --- Parsing Helpers ---
    // In static-pianoroll.js
    // --- [LOGGING] --- Ensure parseKeySignature is defined here ---
    function parseKeySignature(keyInfo, meta = {}) {
        const titleForLog = meta?.T || 'Unknown Title';
        console.log(`[SPR LOG] parseKeySignature called. keyInfo:`, keyInfo, ` Meta Title: ${titleForLog}`);
        // ... (rest of parseKeySignature implementation from previous steps) ...
        // Ensure it sets selectedRootNote, selectedScaleType, isPercussion correctly
        isPercussion = false; // Reset percussion flag
        if (keyInfo && typeof keyInfo === 'object' && keyInfo.el_type === 'keySignature') {
            console.log('[SPR LOG] Processing keyInfo as keySignature object.');
            const noteName = (keyInfo.root || "").toUpperCase();
            const accidental = keyInfo.acc || "";
            let mode = (keyInfo.mode || "").toLowerCase();
            if (!noteName) { /* ... handle missing root ... */ selectedRootNote = 0; selectedScaleType = 'major'; }
            else { /* ... handle valid root, accidental, mode ... */
                let rootIndex = NOTE_NAMES.indexOf(noteName);
                if (rootIndex === -1) { /* ... default ... */ }
                else {
                    if (accidental === '#') rootIndex = (rootIndex + 1) % 12;
                    else if (accidental === 'b') rootIndex = (rootIndex + 11) % 12;
                    selectedRootNote = rootIndex;
                    if (['m', 'min', 'aeo', 'dor', 'phr'].includes(mode)) selectedScaleType = 'minor';
                    else selectedScaleType = 'major';
                }
            }
        } else if (typeof keyInfo === 'string' && keyInfo.trim().toLowerCase() === 'perc') {
            console.log("[SPR LOG] Detected K:perc."); isPercussion = true; selectedScaleType = 'none'; selectedRootNote = 0;
        } else {
            console.log('[SPR LOG] Defaulting key signature to C Major.');
            selectedRootNote = 0; selectedScaleType = 'major';
        }
        console.log(`[SPR LOG] parseKeySignature finished. root: ${selectedRootNote}, type: ${selectedScaleType}, isPercussion: ${isPercussion}`);
    }

    /**
   * Converts an ABC note name string (like "^G,", "_B'", "C") to a MIDI pitch.
   * Assumes standard octave conventions (Middle C 'C' = MIDI 60).
   * @param {string} abcName The ABC note name string.
   * @returns {number} The calculated MIDI pitch, or a default (e.g., 60) if unparseable.
   */
    function abcNoteToMidiPitch(abcName) {
        if (!abcName || typeof abcName !== 'string') return 60; // Default to Middle C on error

        let pitch = 0;
        let accidentalOffset = 0;
        let octaveShift = 0;
        let baseNote = '';

        let pos = 0;

        // 1. Parse Accidental (optional)
        if (abcName[pos] === '^') {
            accidentalOffset = 1;
            pos++;
        } else if (abcName[pos] === '_') {
            accidentalOffset = -1;
            pos++;
        } else if (abcName[pos] === '=') {
            accidentalOffset = 0; // Explicit natural
            pos++;
        }
        // If no symbol, accidentalOffset remains 0 (natural implied by key or default)

        // 2. Parse Base Note (C, D, E, F, G, A, B)
        if (pos < abcName.length && /[A-Ga-g]/.test(abcName[pos])) {
            baseNote = abcName[pos].toUpperCase();
            pos++;
        } else {
            console.warn(`[abcNoteToMidiPitch] Could not parse base note from: ${abcName}`);
            return 60; // Error case
        }

        // 3. Parse Octave Markers (optional)
        while (pos < abcName.length) {
            if (abcName[pos] === "'") {
                octaveShift++;
                pos++;
            } else if (abcName[pos] === ",") {
                octaveShift--;
                pos++;
            } else {
                // Assume end of relevant part if unexpected char found
                break;
            }
        }

        // 4. Calculate Pitch
        // Base MIDI pitches for middle octave (Octave 4 in MIDI terms, where C4=60)
        const basePitches = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, B: 71 };

        if (!(baseNote in basePitches)) {
            console.warn(`[abcNoteToMidiPitch] Invalid base note parsed: ${baseNote}`);
            return 60; // Error case
        }

        pitch = basePitches[baseNote];
        pitch += accidentalOffset;
        pitch += octaveShift * 12; // Apply octave shifts

        // Clamp to MIDI range 0-127
        pitch = Math.max(0, Math.min(127, pitch));

        // console.log(`[abcNoteToMidiPitch] Parsed ${abcName} -> Pitch: ${pitch}`); // Optional Debug
        return pitch;
    }

    // --- Main Data Processing Function (MODIFIED to use abcNoteToMidiPitch) ---
    function processAbcTune() {
        console.log(`[SPR LOG] --- processAbcTune START ---`);
        console.log(`[SPR LOG] Received abcTune object:`, abcTune);

        const actualTuneData = abcTune.tune || abcTune;
        console.log(`[SPR LOG] Using actualTuneData object for processing:`, actualTuneData);

        if (!actualTuneData || typeof actualTuneData !== 'object' || !Array.isArray(actualTuneData.lines)) {
            console.error("[SPR ERROR] StaticRenderer: Invalid abcTune data object structure (missing .lines?). Cannot process.", actualTuneData);
            notesToRender = []; contentWidthTicks = (ticksPerBeat || 480) * 4; contentMinPitch = 60; contentMaxPitch = 72; isPercussion = false; selectedRootNote = 0; selectedScaleType = 'major'; ticksPerMeasure = (ticksPerBeat || 480) * 4; updateCurrentScaleNotes();
            console.log(`[SPR LOG] --- processAbcTune END (Error) ---`);
            return;
        }

        const currentMeta = actualTuneData.metaText || {};

        // --- Get Key Signature (sets isPercussion, selectedRootNote, selectedScaleType) ---
        let keyInfo = undefined;
        if (typeof actualTuneData.getKeySignature === 'function') {
            try { keyInfo = actualTuneData.getKeySignature(); console.log('[SPR LOG] Called getKeySignature(). Result:', keyInfo); }
            catch (e) { console.error('[SPR ERROR] Error calling getKeySignature():', e); }
        } else { console.warn('[SPR WARN] actualTuneData has no getKeySignature method.'); keyInfo = currentMeta.K; } // Fallback
        parseKeySignature(keyInfo, currentMeta); // Sets isPercussion flag globally

        // --- Get Meter ---
        timeSignatureNumerator = 4; timeSignatureDenominator = 4; // Default
        if (typeof actualTuneData.getMeter === 'function') {
            try {
                const meterInfo = actualTuneData.getMeter();
                // ... (parsing logic for meterInfo - keep as before) ...
                if (meterInfo && typeof meterInfo === 'object') {
                    if (meterInfo.type === 'common_time') { timeSignatureNumerator = 4; timeSignatureDenominator = 4; }
                    else if (meterInfo.type === 'cut_time') { timeSignatureNumerator = 2; timeSignatureDenominator = 2; }
                    else if (meterInfo.type === 'specified' && meterInfo.value && meterInfo.value.length > 0) {
                        const firstMeter = meterInfo.value[0];
                        if (firstMeter && firstMeter.num && firstMeter.den) {
                            timeSignatureNumerator = parseInt(firstMeter.num, 10); timeSignatureDenominator = parseInt(firstMeter.den, 10);
                            if (isNaN(timeSignatureNumerator) || timeSignatureNumerator <= 0) timeSignatureNumerator = 4;
                            if (isNaN(timeSignatureDenominator) || timeSignatureDenominator <= 0) timeSignatureDenominator = 4;
                        } else { console.warn('[SPR WARN] getMeter() specified format unexpected:', meterInfo); }
                    } else if (typeof meterInfo.num === 'number' && typeof meterInfo.den === 'number') {
                        timeSignatureNumerator = meterInfo.num; timeSignatureDenominator = meterInfo.den;
                        if (isNaN(timeSignatureNumerator) || timeSignatureNumerator <= 0) timeSignatureNumerator = 4;
                        if (isNaN(timeSignatureDenominator) || timeSignatureDenominator <= 0) timeSignatureDenominator = 4;
                    } else { console.warn('[SPR WARN] getMeter() returned unknown type/format:', meterInfo); }
                } else { console.warn('[SPR WARN] getMeter() did not return valid object:', meterInfo); }

            } catch (e) { console.error('[SPR ERROR] Error calling/processing getMeter():', e); }
        } else { console.warn('[SPR WARN] actualTuneData has no getMeter method.'); }
        console.log(`[SPR LOG] Determined Time Signature: ${timeSignatureNumerator}/${timeSignatureDenominator}`);

        // --- Get Unit Note Length (L:) ---
        let unitLength = 1 / 8; // Default L:1/8
        // ... (logic for getting unitLength from getUnitLength() or metaText.L - keep as before) ...
        if (typeof actualTuneData.getUnitLength === 'function') {
            try {
                unitLength = actualTuneData.getUnitLength();
                if (typeof unitLength !== 'number' || unitLength <= 0) { unitLength = 1 / 8; }
            } catch (e) { unitLength = 1 / 8; }
        } else {
            const lField = currentMeta.L;
            if (lField) { /* ... parse L: from meta ... */ }
            else { unitLength = 1 / 8; }
        }
        console.log(`[SPR LOG] Determined Unit Length (L:): ${unitLength}`);


        // --- Ticks Per Beat & Unit Length Calculation ---
        console.log(`[SPR LOG] Using ticksPerBeat for calculations: ${ticksPerBeat}`);
        const ticksPerWholeNote = ticksPerBeat * 4;
        const ticksPerUnitLength = ticksPerWholeNote * unitLength;
        console.log(`[SPR LOG] Ticks per Unit Length (L:) calculated: ${ticksPerUnitLength}`);

        // --- Calculate ticksPerMeasure ---
        let calculatedTicksPerMeasure = ticksPerBeat * 4; // Default
        if (timeSignatureNumerator > 0 && timeSignatureDenominator > 0 && ticksPerBeat > 0) {
            calculatedTicksPerMeasure = Math.round(ticksPerBeat * (4 / timeSignatureDenominator) * timeSignatureNumerator);
        }
        if (calculatedTicksPerMeasure <= 0) { calculatedTicksPerMeasure = ticksPerBeat * 4; }
        ticksPerMeasure = calculatedTicksPerMeasure;
        console.log(`[SPR LOG] Final ticksPerMeasure calculated: ${ticksPerMeasure}`);

        // --- Process Notes ---
        notesToRender = [];
        contentWidthTicks = 0;
        contentMinPitch = PITCH_MAX; // Reset min/max calculation
        contentMaxPitch = PITCH_MIN;
        let currentTimeTicks = 0;
        let lastNoteEndTime = 0;
        console.log(`[SPR LOG] Starting note processing loop...`);

        actualTuneData.lines.forEach((line, lineIndex) => {
            if (!line.staff || !Array.isArray(line.staff)) return;
            line.staff.forEach((staff, staffIndex) => {
                if (!staff.voices || !Array.isArray(staff.voices)) return;
                staff.voices.forEach((voice, voiceIndex) => {
                    if (!Array.isArray(voice)) return;
                    voice.forEach(elem => {
                        let durationTicks = 0;
                        let isNoteOrRest = false;

                        if (elem.el_type === 'note' || elem.el_type === 'rest') {
                            isNoteOrRest = true;
                            const elementDurationFactor = elem.duration === undefined ? 1.0 : elem.duration;
                            durationTicks = Math.round(elementDurationFactor * ticksPerUnitLength);
                            if (durationTicks < 0) durationTicks = 0;
                        }

                        if (elem.el_type === 'note') {
                            if (elem.pitches && Array.isArray(elem.pitches)) {
                                elem.pitches.forEach(pitchInfo => {
                                    // *** MODIFICATION START ***
                                    // Instead of trusting pitchInfo.pitch, calculate from pitchInfo.name
                                    let midiPitch;
                                    if (pitchInfo.name) {
                                        midiPitch = abcNoteToMidiPitch(pitchInfo.name);
                                        // Optional: Log comparison if pitchInfo.pitch exists
                                        if (pitchInfo.pitch !== undefined && pitchInfo.pitch !== midiPitch) {
                                            console.warn(`[processAbcTune] Pitch mismatch for ${pitchInfo.name}: abcjs returned ${pitchInfo.pitch}, calculated ${midiPitch}. Using calculated.`);
                                        }
                                    } else if (pitchInfo.pitch !== undefined) {
                                        // Fallback if name is missing for some reason
                                        console.warn(`[processAbcTune] Missing pitch name, falling back to abcjs pitch: ${pitchInfo.pitch}`);
                                        midiPitch = pitchInfo.pitch;
                                    } else {
                                        console.error("[processAbcTune] Note element missing both name and pitch!", elem);
                                        return; // Skip this invalid pitch entry
                                    }
                                    // *** MODIFICATION END ***


                                    if (midiPitch >= PITCH_MIN && midiPitch <= PITCH_MAX) {
                                        notesToRender.push({
                                            pitch: midiPitch, // Use the potentially corrected pitch
                                            start_tick: Math.round(currentTimeTicks),
                                            duration_ticks: durationTicks,
                                            velocity: 100 // Assign default velocity
                                        });
                                        // Update bounds using the potentially corrected pitch
                                        contentMinPitch = Math.min(contentMinPitch, midiPitch);
                                        contentMaxPitch = Math.max(contentMaxPitch, midiPitch);
                                    } else {
                                        console.warn(`[SPR WARN] Note pitch out of range: ${midiPitch}`, elem);
                                    }
                                });
                            } else {
                                console.warn(`[SPR WARN] Note element has no pitches array`, elem);
                            }
                        }

                        if (isNoteOrRest) {
                            currentTimeTicks += durationTicks;
                            lastNoteEndTime = Math.max(lastNoteEndTime, currentTimeTicks);
                        }
                    }); // End element loop
                }); // End voice loop
            }); // End staff loop
        }); // End line loop
        console.log(`[SPR LOG] Finished note processing loop.`);

        contentWidthTicks = Math.round(lastNoteEndTime);

        if (notesToRender.length === 0) {
            console.warn("[SPR WARN] No valid notes found to render after processing ABC.");
            contentWidthTicks = ticksPerMeasure > 0 ? ticksPerMeasure * 2 : ticksPerBeat * 8;
            // Set a more reasonable default pitch range if no notes found
            contentMinPitch = 48; // C3
            contentMaxPitch = 72; // C5
        }
        // Ensure pitch range is valid even if only one note exists
        if (contentMinPitch > contentMaxPitch) {
            contentMaxPitch = contentMinPitch;
        }
        // Add a minimum span if only one pitch was found
        if (contentMinPitch === contentMaxPitch && notesToRender.length > 0) {
            contentMinPitch = Math.max(PITCH_MIN, contentMinPitch - 6);
            contentMaxPitch = Math.min(PITCH_MAX, contentMaxPitch + 6);
        }


        updateCurrentScaleNotes(); // Update scale highlighting data

        console.log(`[SPR LOG] Processed Notes: ${notesToRender.length}, Final contentWidthTicks: ${contentWidthTicks}, Pitch Range: [${contentMinPitch}-${contentMaxPitch}]`);
        if (contentWidthTicks <= 0) {
            console.warn(`[SPR WARN] contentWidthTicks is ${contentWidthTicks}. Defaulting width.`);
            contentWidthTicks = ticksPerMeasure > 0 ? ticksPerMeasure : ticksPerBeat * 4;
        }
        console.log(`[SPR LOG] --- processAbcTune END ---`);
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
        // Use canvas logical dimensions (already scaled for DPR in redraw function)
        const viewWidth = canvas.width / (window.devicePixelRatio || 1);
        const viewHeight = canvas.height / (window.devicePixelRatio || 1);

        // --- Time Signature and Resolution Access ---
        // Access global state variables set during processAbcTune
        // Provide robust defaults in case parsing failed or wasn't complete
        const localTimeSigNum = typeof timeSignatureNumerator !== 'undefined' && timeSignatureNumerator > 0 ? timeSignatureNumerator : 4;
        const localTimeSigDen = typeof timeSignatureDenominator !== 'undefined' && timeSignatureDenominator > 0 ? timeSignatureDenominator : 4;
        let localTicksPerQuarter = typeof ticksPerBeat !== 'undefined' && ticksPerBeat > 0 ? ticksPerBeat : 480; // Ensure Ticks Per *Quarter* Note

        localTicksPerQuarter /= 8;
        // --- Calculate Core Timing Units in Ticks ---

        // Ticks Per Measure (Robust Calculation)
        let localTicksPerMeasure = 0;
        if (localTimeSigDen > 0) {
            // Formula: (Ticks per Quarter) * (Reference Note / Time Sig Denominator) * Time Sig Numerator
            // Example 4/4: ticksPerQuarter * (4 / 4) * 4 = ticksPerQuarter * 4
            // Example 6/8: ticksPerQuarter * (4 / 8) * 6 = ticksPerQuarter * 0.5 * 6 = ticksPerQuarter * 3
            // Example 2/2: ticksPerQuarter * (4 / 2) * 2 = ticksPerQuarter * 2 * 2 = ticksPerQuarter * 4
            localTicksPerMeasure = Math.round(localTicksPerQuarter * (4 / localTimeSigDen) * localTimeSigNum);
        }
        // Fallback if calculation failed
        if (localTicksPerMeasure <= 0) {
            console.warn(`[drawGrid] Invalid calculated ticksPerMeasure (${localTicksPerMeasure}). Defaulting.`);
            localTicksPerMeasure = localTicksPerQuarter * 4;
        }

        // Ticks Per ACTUAL Beat (based on time signature denominator)
        let ticksPerActualBeat = localTicksPerQuarter; // Default: quarter note beat (for /4, /1 time signatures)
        if (localTimeSigDen === 8) { // e.g., 6/8, 9/8, 12/8
            ticksPerActualBeat = localTicksPerQuarter * 1.5; // Dotted quarter note beat
        } else if (localTimeSigDen === 2) { // e.g., 2/2, 3/2
            ticksPerActualBeat = localTicksPerQuarter * 2; // Half note beat
        }
        // Ensure ticksPerActualBeat is valid
        if (ticksPerActualBeat <= 0) {
            console.warn(`[drawGrid] Invalid calculated ticksPerActualBeat (${ticksPerActualBeat}). Defaulting.`);
            ticksPerActualBeat = localTicksPerQuarter;
        }


        // Ticks Per Subdivision (e.g., 16th notes relative to quarter note)
        const ticksPerSixteenth = localTicksPerQuarter / 4;

        // --- Get Scaled Pixel Widths for Visibility Checks ---
        const scaledNoteRowHeight = effectiveNoteHeight; // Use pre-calculated scaled height
        const sixteenthPixelWidth = ticksPerSixteenth > 0 ? (ticksPerSixteenth * PIXELS_PER_TICK_BASE * scaleX) : 0;
        const beatPixelWidth = ticksPerActualBeat > 0 ? (ticksPerActualBeat * PIXELS_PER_TICK_BASE * scaleX) : 0;
        const measurePixelWidth = localTicksPerMeasure > 0 ? (localTicksPerMeasure * PIXELS_PER_TICK_BASE * scaleX) : 0;

        // --- Minimum Pixel Spacing Thresholds to Draw Lines ---
        const minSixteenthSpacing = 2.5; // Min pixels between 16th lines
        const minBeatSpacing = 2.0;      // Min pixels between beat lines
        const minMeasureSpacing = 0.5;   // Min pixels between measure lines (draw almost always)

        // --- Visible Tick Range (adjust slightly for lines at edges) ---
        const startTickDraw = startTick - ticksPerSixteenth; // Start slightly before view
        const endTickDraw = endTick + ticksPerSixteenth;     // End slightly after view

        ctx.save(); // Save context state before drawing grid elements

        // --- 1. Draw Row Backgrounds (Based on Scale) ---
        // This part remains unchanged, using isNoteInScale and GRID_ROW_..._COLOR
        for (let p = Math.floor(lowPitch); p <= Math.ceil(highPitch); p++) {
            if (p < PITCH_MIN || p > PITCH_MAX) continue;
            const rowY = midiPitchToCanvasY(p);
            const rowHeight = scaledNoteRowHeight;
            if (rowY + rowHeight < 0 || rowY > viewHeight) continue; // Vertical cull
            const isInScale = isNoteInScale(p);
            ctx.fillStyle = isInScale ? GRID_ROW_IN_SCALE_COLOR : GRID_ROW_OUT_SCALE_COLOR;
            ctx.fillRect(0, rowY, viewWidth, rowHeight);
        }

        // --- 2. Draw Alternating Measure Shading (On Top of Rows) ---
        // This part remains unchanged, using localTicksPerMeasure and shadeEvenMeasures
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

        // --- 3. Draw Horizontal Pitch Lines (Separators) ---
        // This part remains unchanged
        ctx.strokeStyle = KEY_SEPARATOR_COLOR;
        ctx.lineWidth = 0.5; // Keep thin
        ctx.beginPath();
        // Draw lines at the *bottom* of each pitch row for separation
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

        // Draw 16th note subdivisions (relative to quarter note) if spacing allows
        if (ticksPerSixteenth > 0 && sixteenthPixelWidth >= minSixteenthSpacing) {
            ctx.strokeStyle = GRID_LINE_COLOR; // Lightest grid lines (#404040)
            ctx.lineWidth = 0.25;
            ctx.beginPath();
            const startSixteenth = Math.max(0, Math.floor(startTickDraw / ticksPerSixteenth));
            const endSixteenth = Math.ceil(endTickDraw / ticksPerSixteenth);
            for (let s = startSixteenth; s <= endSixteenth; s++) {
                const tick = s * ticksPerSixteenth;
                // Avoid drawing over thicker beat/measure lines if they will be drawn later
                // Check against ACTUAL beat and measure ticks
                const isActualBeat = (ticksPerActualBeat > 0 && Math.abs(tick % ticksPerActualBeat) < 0.01); // Use tolerance for float math
                const isMeasure = (localTicksPerMeasure > 0 && Math.abs(tick % localTicksPerMeasure) < 0.01);
                if ((isActualBeat && beatPixelWidth >= minBeatSpacing) || (isMeasure && measurePixelWidth >= minMeasureSpacing)) continue;

                const x = midiTickToCanvasX(tick);
                if (x >= -1 && x <= viewWidth + 1) { // Check bounds
                    const xCoord = Math.round(x) + 0.5; // Pixel align
                    ctx.moveTo(xCoord, 0);
                    ctx.lineTo(xCoord, viewHeight);
                }
            }
            ctx.stroke();
        }

        // Draw ACTUAL Beat Lines if spacing allows
        if (ticksPerActualBeat > 0 && beatPixelWidth >= minBeatSpacing) {
            ctx.strokeStyle = BEAT_LINE_COLOR; // Medium grid lines (#555)
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            // Calculate start/end based on the actual beat ticks
            const startActualBeat = Math.max(0, Math.floor(startTickDraw / ticksPerActualBeat));
            const endActualBeat = Math.ceil(endTickDraw / ticksPerActualBeat);
            for (let beat = startActualBeat; beat <= endActualBeat; beat++) {
                const tick = beat * ticksPerActualBeat;
                // Avoid drawing over thicker measure lines if they will be drawn later
                const isMeasure = (localTicksPerMeasure > 0 && Math.abs(tick % localTicksPerMeasure) < 0.01); // Tolerance
                if (isMeasure && measurePixelWidth >= minMeasureSpacing) continue;

                const x = midiTickToCanvasX(tick);
                if (x >= -1 && x <= viewWidth + 1) { // Check bounds
                    const xCoord = Math.round(x) + 0.5; // Pixel align
                    ctx.moveTo(xCoord, 0);
                    ctx.lineTo(xCoord, viewHeight);
                }
            }
            ctx.stroke();
        }

        // Draw Measure Lines if spacing allows
        if (localTicksPerMeasure > 0 && measurePixelWidth >= minMeasureSpacing) {
            ctx.strokeStyle = MEASURE_LINE_COLOR; // Darkest grid lines (#777)
            ctx.lineWidth = 1.0; // Keep measures thickest
            ctx.beginPath();
            const firstMeasure = Math.max(0, Math.floor(startTickDraw / localTicksPerMeasure));
            // Draw line at the END of the last visible measure too
            const lastMeasureLineIndex = Math.ceil(endTickDraw / localTicksPerMeasure);
            for (let measure = firstMeasure; measure <= lastMeasureLineIndex; measure++) {
                const tick = measure * localTicksPerMeasure;
                const x = midiTickToCanvasX(tick);
                if (x >= -1 && x <= viewWidth + 1) { // Check bounds
                    const xCoord = Math.round(x) + 0.5; // Pixel align
                    ctx.moveTo(xCoord, 0);
                    ctx.lineTo(xCoord, viewHeight);
                }
            }
            ctx.stroke();
        }

        ctx.restore(); // Restore context state after drawing grid
    }

    // Make sure the rest of static-pianoroll.js remains the same

    function drawAllNotes(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible) {
        drawNotesForSnippet(notesToRender, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);
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