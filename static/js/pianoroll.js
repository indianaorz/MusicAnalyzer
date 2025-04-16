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
    const ACTIVE_NOTE_FILL_COLOR = 'crimson';
    const GHOST_NOTE_FILL_COLOR = '#adb5bd';
    const SELECTED_NOTE_FILL_COLOR = '#FFff00'; // yellow for selected
    const SELECTED_NOTE_STROKE_COLOR = '#0056b3'; // Outline for selected notes
    const GHOST_NOTE_ALPHA = 0.6;
    const ACTIVE_VELOCITY_ALPHA_MIN = 0.3; // Slightly more transparent min
    const ACTIVE_VELOCITY_ALPHA_MAX = 1.0;
    const GRID_LINE_COLOR = '#e9ecef'; // Lighter grid
    const BEAT_LINE_COLOR = '#dee2e6'; // Slightly darker beat
    const MEASURE_LINE_COLOR = '#ced4da'; // Darker measure
    const BACKGROUND_COLOR = '#ffffff';
    const MEASURE_SHADING_COLOR = 'rgba(0, 0, 0, 0.04)'; // Example: Very light black
    const SELECTION_RECT_FILL = 'rgba(0, 123, 255, 0.2)';
    const SELECTION_RECT_STROKE = 'rgba(0, 123, 255, 0.6)';
    const KEY_WHITE_COLOR = '#f8f9fa';
    const KEY_BLACK_COLOR = '#343a40';
    const KEY_SEPARATOR_COLOR = '#dee2e6';
    const KEY_TEXT_COLOR = '#495057';
    const KEY_BLACK_TEXT_COLOR = '#f8f9fa'; // Text on black keys

    const NOTE_IN_SCALE_COLOR = '#3477eb'; // Blueish
    const NOTE_OUT_SCALE_COLOR = '#eb8c34'; // Orangish
    const GRID_ROW_IN_SCALE_COLOR = '#fff'; // Very light blue background
    const GRID_ROW_OUT_SCALE_COLOR = '#fffbf0'; // Very light orange background

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
        trackStates = rawTracksData.map((_, index) => ({ isVisible: true }));

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


        // Inside initialize(), after getting other element references:
        scaleRootSelect = document.getElementById('scale-root-select');
        scaleTypeSelect = document.getElementById('scale-type-select');

        if (!scaleRootSelect || !scaleTypeSelect) {
            console.warn("Scale selection UI elements not found. Scale highlighting disabled.");
            // Optionally disable the feature or provide feedback
        } else {
            // Set initial values from state (could be inferred later)
            scaleRootSelect.value = selectedRootNote;
            scaleTypeSelect.value = selectedScaleType;
        }


        calculateContentDimensions(); // Calculate initial content width/height
        setupEventListeners();
        resizeCanvas(); // Initial resize includes redraw
        // Calculate initial scale notes
        updateCurrentScaleNotes();


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

        // Redraw everything to reflect the change
        redrawPianoRoll();
    }

    function handleTrackListClick(event) {
        const trackItem = event.target.closest('.track-item');
        if (!trackItem || trackItem.classList.contains('disabled')) return; // Ignore disabled items

        const trackIndex = parseInt(trackItem.dataset.trackIndex, 10);
        if (isNaN(trackIndex)) return; // Should not happen with valid data-* attributes

        // Check if the visibility toggle icon or its parent button was clicked
        if (event.target.closest('.visibility-toggle')) {
            toggleTrackVisibility(trackIndex);
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

        canvas.focus(); // Maybe useful for keyboard events later

        const rect = canvas.getBoundingClientRect();
        const startX = event.clientX - rect.left; // Canvas Coordinates
        const startY = event.clientY - rect.top;  // Canvas Coordinates
        const shiftKey = event.shiftKey;

        if (event.button === 1) { // Middle mouse button for panning
            isPanning = true;
            dragStartX = startX;
            dragStartY = startY;
            dragStartOffsetX = offsetX;
            dragStartOffsetY = offsetY;
            canvas.style.cursor = 'grabbing';
        } else if (event.button === 0) { // Left mouse button
            const clickedNoteRef = findNoteAtCanvasCoords(startX, startY);
            const clickedNoteKey = clickedNoteRef ? JSON.stringify(clickedNoteRef) : null;

            if (clickedNoteRef && selectedNotes.has(clickedNoteKey)) {
                // --- Start Moving Selected Notes ---
                isMovingNotes = true;
                // Store start position for delta calculation
                noteMoveData.startCanvasX = startX;
                noteMoveData.startCanvasY = startY;
                noteMoveData.currentCanvasX = startX; // Initialize current position
                noteMoveData.currentCanvasY = startY;
                noteMoveData.deltaTick = 0; // Reset deltas for new move
                noteMoveData.deltaPitch = 0;
                noteMoveData.originalNotes = []; // Store original positions of all selected notes
                selectedNotes.forEach(key => {
                    const ref = JSON.parse(key);
                    const note = rawTracksData[ref.trackIndex]?.notes[ref.noteIndex];
                    if (note) {
                        noteMoveData.originalNotes.push({
                            trackIndex: ref.trackIndex, noteIndex: ref.noteIndex,
                            originalTick: note.start_tick, originalPitch: note.pitch
                        });
                    }
                });
                canvas.style.cursor = 'move';

            } else {
                // --- Start Selection or Select+Move ---
                if (!shiftKey) {
                    selectedNotes.clear(); // Clear selection if Shift is not held
                }

                if (clickedNoteRef) {
                    // Clicked on a note (that wasn't previously selected, or Shift is held)
                    const noteKey = JSON.stringify(clickedNoteRef);
                    if (shiftKey && selectedNotes.has(noteKey)) {
                        selectedNotes.delete(noteKey); // Shift-click existing selection to deselect
                    } else {
                        selectedNotes.add(noteKey); // Select or Shift-add
                    }

                    // Immediately prepare for moving this potentially new selection
                    isMovingNotes = true;
                    noteMoveData.startCanvasX = startX;
                    noteMoveData.startCanvasY = startY;
                    noteMoveData.currentCanvasX = startX;
                    noteMoveData.currentCanvasY = startY;
                    noteMoveData.deltaTick = 0;
                    noteMoveData.deltaPitch = 0;
                    noteMoveData.originalNotes = []; // Recalculate move data for the *current* selection
                    selectedNotes.forEach(key => {
                        const ref = JSON.parse(key);
                        const note = rawTracksData[ref.trackIndex]?.notes[ref.noteIndex];
                        if (note) { noteMoveData.originalNotes.push({ trackIndex: ref.trackIndex, noteIndex: ref.noteIndex, originalTick: note.start_tick, originalPitch: note.pitch }); }
                    });
                    canvas.style.cursor = 'move';

                } else {
                    // Clicked on empty space -> start box selection
                    isSelecting = true;
                    selectionRect = { x1: startX, y1: startY, x2: startX, y2: startY };
                    canvas.style.cursor = 'crosshair';
                    isMovingNotes = false; // Ensure not in move mode
                }
                redrawPianoRoll(); // Update visual selection immediately
            }
        }
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
                        const newTick = Math.max(0, Math.round(orig.originalTick + noteMoveData.deltaTick)); // Simple rounding for now
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
        // Check for Ctrl+C (or Cmd+C on Mac)
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            if (selectedNotes.size > 0) {
                event.preventDefault(); // Prevent default browser copy action
                copySelectionToAbc();
            } else {
                console.log("Ctrl+C pressed, but no notes selected.");
                // Optionally provide feedback that nothing was selected
            }
        }
        // Add other keyboard shortcuts here if needed (e.g., delete, arrow keys)
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

        // Convert selection rect from canvas coords to MIDI coords
        const startTick = canvasXToMidiTick(rect.x1);
        const endTick = canvasXToMidiTick(rect.x2);
        // Remember: Lower Y value corresponds to higher pitch
        const highPitch = canvasYToMidiPitch(rect.y1); // Pitch at the top edge of the rect
        const lowPitch = canvasYToMidiPitch(rect.y2);  // Pitch at the bottom edge of the rect

        // If not holding shift, clear previous selection before selecting new notes
        // (Already handled in mousedown, but double check here if needed)
        // if (!shiftKeyHeld) { selectedNotes.clear(); } // Redundant if mousedown clears

        trackStates.forEach((state, trackIndex) => {
            if (!state.isVisible) return; // Only select notes in visible tracks
            const track = rawTracksData[trackIndex];
            if (!track || !track.notes) return;

            track.notes.forEach((note, noteIndex) => {
                // Check if note intersects the rectangle in MIDI space
                const noteEndTick = note.start_tick + note.duration_ticks;
                // Check horizontal overlap: Note must start before rect ends AND end after rect starts.
                const intersectsHorizontally = note.start_tick < endTick && noteEndTick > startTick;
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
        if (ticks <= 0 || ticksPerUnitNoteLength <= 0) return ""; // Invalid duration or unit

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
                return "/" + String(denominator); // L/2, L/3 etc.
            } else {
                return String(numerator) + "/" + String(denominator); // 3L/2, 5L/4 etc.
            }
        }
    }

    /**
     * Converts MIDI pitch to ABC note notation (pitch, accidental, octave).
     * Assumes K:Cmaj (or Amin) for now - uses sharp for C#, F#, G#, D#, A# and natural for others.
     * TODO: Adapt based on a selected Key Signature if implemented later.
     * @param {number} pitch MIDI pitch (0-127).
     * @returns {string} ABC note string (e.g., "^G,", "C", "_B''").
     */
    function midiPitchToAbcNote(pitch) {
        if (pitch < 0 || pitch > 127) return "z"; // Treat invalid pitch as rest

        const octave = Math.floor(pitch / 12) - 1; // MIDI C-1 (pitch 0) is octave -1
        const noteIndex = pitch % 12;

        // --- Basic Note Name (Assume Sharps for C-based key initially) ---
        // We might need a more robust key signature context later
        let baseNote;
        let accidental = "";
        switch (noteIndex) {
            case 0: baseNote = 'C'; break;
            case 1: baseNote = 'C'; accidental = '^'; break; // C#
            case 2: baseNote = 'D'; break;
            case 3: baseNote = 'D'; accidental = '^'; break; // D#
            case 4: baseNote = 'E'; break;
            case 5: baseNote = 'F'; break;
            case 6: baseNote = 'F'; accidental = '^'; break; // F#
            case 7: baseNote = 'G'; break;
            case 8: baseNote = 'G'; accidental = '^'; break; // G#
            case 9: baseNote = 'A'; break;
            case 10: baseNote = 'A'; accidental = '^'; break; // A#
            case 11: baseNote = 'B'; break;
            default: return "z"; // Should not happen
        }

        // --- Octave Markers ---
        // ABC Octave Reference: Middle C (MIDI 60) starts the octave with no markers.
        // MIDI 60 = C5 (using scientific pitch notation where C4 is middle C)
        // ABC middle C is octave 4 in some contexts, octave 5 in others. Let's assume MIDI 60 = 'C'
        let octaveMarker = "";
        const middleCOctave = 4; // MIDI Octave for 'C' with no markers (MIDI 60-71)
        if (octave < middleCOctave) {
            octaveMarker = ",".repeat(middleCOctave - octave); // Add commas for lower octaves
        } else if (octave > middleCOctave) {
            octaveMarker = "'".repeat(octave - middleCOctave); // Add apostrophes for higher octaves
        }

        return accidental + baseNote + octaveMarker;
    }


    /**
     * Gathers selected notes, sorts them, and generates an ABC string.
     * @returns {string} The generated ABC notation string or an empty string on failure.
     */
    function generateAbcFromSelection() {
        if (selectedNotes.size === 0) return "";

        // 1. Gather and Sort Notes
        let notesToConvert = [];
        selectedNotes.forEach(key => {
            try {
                const ref = JSON.parse(key);
                const track = rawTracksData[ref.trackIndex];
                const note = track?.notes[ref.noteIndex];
                if (note) {
                    // Add relevant info, maybe trackIndex if needed later for voices
                    notesToConvert.push({
                        pitch: note.pitch,
                        startTick: note.start_tick,
                        durationTicks: note.duration_ticks,
                        // velocity: note.velocity // Optional
                    });
                }
            } catch (e) {
                console.error("Error parsing selected note key:", key, e);
            }
        });

        if (notesToConvert.length === 0) return "";

        // Sort primarily by start tick, secondarily by pitch (lowest first for potential chords)
        notesToConvert.sort((a, b) => {
            if (a.startTick !== b.startTick) {
                return a.startTick - b.startTick;
            }
            return a.pitch - b.pitch; // Lower pitch first if simultaneous start
        });

        // 2. Define ABC Parameters
        const unitNoteLengthDenominator = 8; // L:1/8 (Eighth note)
        const ticksPerUnitNoteLength = window.ticksPerBeat / (unitNoteLengthDenominator / 4); // Ticks per 1/8 note
        const currentTicksPerMeasure = window.ticksPerBeat * window.timeSignatureNumerator; // Use global

        // 3. Build ABC Header
        let abcString = "";
        abcString += "X:1\n"; // Reference number
        abcString += "T:Selected Notes Snippet\n"; // Title
        abcString += `M:${window.timeSignatureNumerator}/${window.timeSignatureDenominator}\n`; // Meter
        abcString += `L:1/${unitNoteLengthDenominator}\n`; // Unit note length
        abcString += "K:Cmaj\n"; // Key signature (assuming Cmaj/Amin for now)
        // abcString += "Q:1/4=120\n"; // Optional: Default Tempo


        // 4. Build ABC Body (Notes, Rests, Bars)
        let currentTimeTicks = notesToConvert[0].startTick; // Start time at the first note
        let currentMeasureTicks = 0; // Ticks elapsed in the current measure

        // --- Optional: Handle initial rest if the first note doesn't start at tick 0 ---
        // This is tricky without song context. For a snippet, starting at the first note is often fine.
        // if (currentTimeTicks > 0) {
        //     const restDurationStr = ticksToAbcDuration(currentTimeTicks, ticksPerUnitNoteLength);
        //     abcString += "z" + restDurationStr + " ";
        //     currentMeasureTicks += currentTimeTicks;
        //     // Check for bar line after initial rest
        //     if (currentMeasureTicks >= currentTicksPerMeasure) {
        //        abcString += "|\n"; // New line for clarity after bar
        //        currentMeasureTicks %= currentTicksPerMeasure;
        //     }
        // }
        // --- End Optional Initial Rest ---


        for (let i = 0; i < notesToConvert.length; i++) {
            const note = notesToConvert[i];

            // --- Add Rest if Gap Exists ---
            if (note.startTick > currentTimeTicks) {
                const restTicks = note.startTick - currentTimeTicks;
                const restDurationStr = ticksToAbcDuration(restTicks, ticksPerUnitNoteLength);
                abcString += "z" + restDurationStr + " ";
                currentTimeTicks += restTicks;
                currentMeasureTicks += restTicks;

                // Check for bar line after rest
                while (currentMeasureTicks >= currentTicksPerMeasure) {
                    abcString += "| ";
                    currentMeasureTicks -= currentTicksPerMeasure;
                     // Add newline periodically for readability?
                     // if (abcString.split('\n').slice(-1)[0].length > 60) abcString += "\n";
                }
            }

            // --- Add Note ---
            // Check for Chord (notes starting at the same tick)
            let chordNotes = [note];
            let lookahead = i + 1;
            while (lookahead < notesToConvert.length && notesToConvert[lookahead].startTick === note.startTick) {
                chordNotes.push(notesToConvert[lookahead]);
                lookahead++;
            }

            const noteDurationStr = ticksToAbcDuration(note.durationTicks, ticksPerUnitNoteLength);

            if (chordNotes.length > 1) {
                // Format as a chord
                abcString += "[";
                chordNotes.forEach(chordNote => {
                    abcString += midiPitchToAbcNote(chordNote.pitch);
                });
                abcString += "]" + noteDurationStr + " ";
                i = lookahead - 1; // Skip the notes already added to the chord
            } else {
                // Format as a single note
                abcString += midiPitchToAbcNote(note.pitch) + noteDurationStr + " ";
            }

            currentTimeTicks = note.startTick + note.durationTicks;
            currentMeasureTicks += note.durationTicks; // Add duration of the note/chord

            // Check for bar line(s) after note/chord
             while (currentMeasureTicks >= currentTicksPerMeasure) {
                abcString += "| ";
                currentMeasureTicks -= currentTicksPerMeasure;
                 // Optional newline logic
                 // if (abcString.split('\n').slice(-1)[0].length > 60) abcString += "\n";
            }
        }

        // Add final bar line if needed? Usually |] for end.
        abcString = abcString.trimEnd(); // Remove trailing space
        if (!abcString.endsWith("|")) { // Add simple bar if measure wasn't completed.
           // abcString += " |"; // Or maybe nothing for a snippet
        }
        // abcString += "|]"; // Standard end bar?

        return abcString;
    }

    /**
     * Copies the generated ABC string for selected notes to the clipboard.
     */
    async function copySelectionToAbc() {
        const abcText = generateAbcFromSelection();
        if (abcText) {
            try {
                await navigator.clipboard.writeText(abcText);
                console.log("Selected notes copied to clipboard in ABC format:\n", abcText);
                // Optional: Show a temporary success message to the user
                // flashMessage("Notes copied to clipboard (ABC Format)"); // Need a flash message mechanism
            } catch (err) {
                console.error('Failed to copy notes to clipboard: ', err);
                // Optional: Show an error message
                // flashMessage("Error copying notes to clipboard.", "error");
            }
        } else {
            console.log("Could not generate ABC format (no selection or error).");
            // flashMessage("No notes selected or error generating ABC.", "warning");
        }
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

            // 3. Draw Notes
            drawAllNotes(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);

            // 4. Draw Selection Rectangle (if active)
            if (isSelecting && selectionRect) { drawSelectionRectangle(); }

            // 5. Update Key Display
            drawKeyDisplay(lowPitchVisible, highPitchVisible);

            ctx.restore();
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
    }

    function drawAllNotes(startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible) {
        // Draw Ghosts (Inactive tracks, visible) first
        trackStates.forEach((state, trackIndex) => {
            if (state.isVisible && trackIndex !== activeTrackIndex) {
                drawNotesForTrack(trackIndex, false, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);
            }
        });

        // Draw Active Track Notes last (on top) if visible
        if (activeTrackIndex !== -1 && trackStates[activeTrackIndex]?.isVisible) {
            drawNotesForTrack(activeTrackIndex, true, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible);
        }
    }



    function drawNotesForTrack(trackIndex, isActive, startTickVisible, endTickVisible, lowPitchVisible, highPitchVisible) {
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
            const isSelected = selectedNotes.has(noteKey);
            const isInScale = isNoteInScale(note.pitch); // Check scale membership

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

            // --- Draw outline ONLY for selected notes ---
            if (isSelected) {
                ctx.strokeStyle = SELECTED_NOTE_STROKE_COLOR;
                ctx.lineWidth = 1.0; // Use 1 for sharp outline
                ctx.globalAlpha = 1.0; // Ensure stroke is solid regardless of note alpha
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

        const activeTrack = (activeTrackIndex !== -1) ? rawTracksData[activeTrackIndex] : null;
        const isDrumMode = activeTrack?.is_drum_track ?? false;

        // Clear previous content efficiently
        keyDisplayContentWrapper.innerHTML = ''; // Fast enough for moderate number of keys

        // Determine pitch range to render (slightly wider than visible for buffer during scroll)
        const renderPitchMin = Math.max(PITCH_MIN, Math.floor(lowPitchVisible) - 5);
        const renderPitchMax = Math.min(PITCH_MAX, Math.ceil(highPitchVisible) + 5);

        // Use a DocumentFragment for potentially better performance when adding many elements
        const fragment = document.createDocumentFragment();
        const scaledNoteRowHeight = NOTE_BASE_HEIGHT * scaleY;
        const scaledGap = NOTE_VERTICAL_GAP * scaleY; // Scaled gap

        for (let pitch = renderPitchMin; pitch <= renderPitchMax; pitch++) {
            const keyElement = document.createElement('div');
            const isInScale = isNoteInScale(pitch); // Check scale membership

            // Calculate Y position relative to the *start* of the content wrapper
            const theoreticalTopY = (PITCH_MAX - pitch) * scaledNoteRowHeight;
            // Adjust Y position and height to account for the visual gap between notes
            const visualTopY = theoreticalTopY + (scaledGap / 2);
            const keyHeight = Math.max(1, scaledNoteRowHeight - scaledGap);
            const lineHeight = keyHeight; // Match line height to visible key height

            // Basic element styling
            keyElement.style.position = 'absolute';
            keyElement.style.top = `${visualTopY}px`;
            keyElement.style.left = '0';
            keyElement.style.width = '100%'; // Take full width of the panel
            keyElement.style.height = `${keyHeight}px`;
            keyElement.style.lineHeight = `${lineHeight}px`;
            keyElement.style.overflow = 'hidden';
            keyElement.style.whiteSpace = 'nowrap';
            keyElement.style.boxSizing = 'border-box';
            keyElement.style.fontSize = `${Math.max(6, Math.min(12, keyHeight * 0.7))}px`;
            // Apply border to the bottom (might be overridden by black key style)
            keyElement.style.borderBottom = `1px solid ${KEY_SEPARATOR_COLOR}`;


            if (isDrumMode) {
                keyElement.className = `drum-name ${isInScale ? 'in-scale' : 'out-of-scale'}`; // Add scale class
                // CSS will handle background/color based on .in-scale / .out-of-scale
                keyElement.style.paddingLeft = '5px';
                const drumName = GM_DRUM_MAP[pitch] || `Pitch ${pitch}`;
                keyElement.textContent = drumName;
                keyElement.title = `${pitch}: ${GM_DRUM_MAP[pitch] || 'Unknown'}`;
            } else { // Piano Mode
                const isBlackKey = [1, 3, 6, 8, 10].includes(pitch % 12);
                // Add scale class alongside existing classes
                keyElement.className = `piano-key ${isBlackKey ? 'black' : 'white'} ${isInScale ? 'in-scale' : 'out-of-scale'}`;
                keyElement.title = `Note ${pitch} (${NOTE_NAMES[pitch % 12]}) - ${isInScale ? 'In Scale' : 'Out of Scale'}`;

                // CSS rules handle the background/color based on combined classes (.black.in-scale etc.)
                if (isBlackKey) {
                    keyElement.style.paddingLeft = '15px';
                    keyElement.style.width = '70%';
                    keyElement.style.zIndex = '1';
                    keyElement.style.borderBottom = 'none'; // Black keys usually don't have bottom border
                } else {
                    keyElement.style.paddingLeft = '5px';
                    // Add Octave Label for C notes
                    if (pitch % 12 === 0) {
                        const octaveNumber = Math.floor(pitch / 12) - 1; // C4 is MIDI 60, C-1 is MIDI 0
                        const labelText = `C${octaveNumber}`;
                        const labelSpan = document.createElement('span');
                        labelSpan.className = 'octave-label';
                        labelSpan.textContent = labelText;
                        keyElement.appendChild(labelSpan);
                        keyElement.title = `${labelText} (Note ${pitch}) - ${isInScale ? 'In Scale' : 'Out of Scale'}`;
                    }
                }
            }
            fragment.appendChild(keyElement);
        }
        keyDisplayContentWrapper.appendChild(fragment);
    }

    // --- Start the application ---
    initialize();

}); // End DOMContentLoaded