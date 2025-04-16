/**
 * Interactive Piano Roll Renderer using HTML Canvas
 *
 * Features:
 * - Single canvas for all tracks.
 * - Track list panel for selection and visibility control.
 * - Active track highlighting.
 * - Ghost notes for inactive tracks.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- Global Variables & Configuration ---
    const canvas = document.getElementById('main-piano-roll-canvas');
    const trackListElement = document.getElementById('track-list');
    const canvasContainer = document.getElementById('canvas-container');

    // Check for essential elements
    if (!canvas || !trackListElement || !canvasContainer) {
        console.error("Essential elements (canvas, track list, container) not found.");
        if (canvasContainer) canvasContainer.innerHTML = "<p style='color:red; padding: 20px;'>Error: UI elements missing. Cannot render piano roll.</p>";
        return;
    }
    if (typeof rawTracksData === 'undefined' || !Array.isArray(rawTracksData)) {
        console.error("MIDI track data (rawTracksData) not found or is not an array.");
         canvasContainer.innerHTML = "<p style='color:red; padding: 20px;'>Error: Track data missing.</p>";
        return;
    }
     if (typeof ticksPerBeat === 'undefined') {
        console.warn("Ticks per beat (ticksPerBeat) not defined. Using default 480.");
        window.ticksPerBeat = 480; 
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Could not get 2D rendering context for canvas.");
        canvasContainer.innerHTML = "<p style='color:red; padding: 20px;'>Error: Canvas context not available.</p>";
        return;
    }

    // --- State Management ---
    let trackStates = []; // Holds visibility and other state per track
    let activeTrackIndex = -1; // Index in the rawTracksData array, -1 means none active

    // --- Drawing Configuration ---
    const NOTE_HEIGHT = 7;
    const PIXELS_PER_TICK = 0.08;
    const PITCH_MIN = 0;
    const PITCH_MAX = 127;
    const ROLL_HEIGHT = (PITCH_MAX - PITCH_MIN + 1) * NOTE_HEIGHT;
    
    // Colors & Opacity
    const ACTIVE_NOTE_FILL_COLOR = 'crimson'; //'#dc3545'; // Red for active notes
    const ACTIVE_NOTE_STROKE_COLOR = '#8b0000'; // Darker red outline
    const GHOST_NOTE_FILL_COLOR = '#adb5bd'; // Gray for ghost notes
    const GHOST_NOTE_STROKE_COLOR = '#6c757d';
    const GHOST_NOTE_ALPHA = 0.6; // Fixed low alpha for ghost notes
    const ACTIVE_VELOCITY_ALPHA_MIN = 0.4; // Active notes still vary slightly with velocity
    const ACTIVE_VELOCITY_ALPHA_MAX = 1.0;

    const GRID_LINE_COLOR = '#f0f0f0'; 
    const BEAT_LINE_COLOR = '#e0e0e0'; 
    const MEASURE_LINE_COLOR = '#c0c0c0'; 
    const BACKGROUND_COLOR = '#ffffff'; 

    let rollWidth = 300; // Initial/minimum width


    // --- Initialization ---
    function initialize() {
        // Populate trackStates based on rawTracksData
        trackStates = rawTracksData.map((track, index) => ({
            originalIndex: index, // Store index in original data array
            isVisible: true,     // All tracks visible by default
            // Add other state properties if needed later
        }));

        // Set first track as active by default if tracks exist
        if (rawTracksData.length > 0) {
            setActiveTrack(0); // Activate the first track initially
        } else {
             updateTrackListHighlighting(); // Ensure no highlighting if no tracks
        }

        setupEventListeners();
        calculateDimensionsAndRedraw(); // Initial draw
        console.log("Piano roll initialized.");
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        trackListElement.addEventListener('click', (event) => {
            const trackItem = event.target.closest('.track-item');
            if (!trackItem) return; // Click wasn't on a track item

            const trackIndex = parseInt(trackItem.dataset.trackIndex, 10);

            // Check if the visibility toggle was clicked
            if (event.target.closest('.visibility-toggle')) {
                toggleTrackVisibility(trackIndex);
            } else {
                // Otherwise, it's a click to activate the track
                setActiveTrack(trackIndex);
            }
        });
    }

    // --- State Update Functions ---
    function setActiveTrack(index) {
        if (index >= 0 && index < rawTracksData.length) {
            activeTrackIndex = index;
            updateTrackListHighlighting();
            redrawPianoRoll(); // Redraw needed as highlighting changes
            console.log(`Active track set to index: ${index}`);
        } else {
             console.warn(`Attempted to set invalid active track index: ${index}`);
        }
    }

    function toggleTrackVisibility(index) {
        if (index >= 0 && index < trackStates.length) {
            trackStates[index].isVisible = !trackStates[index].isVisible;
            updateVisibilityToggleButton(index);
            redrawPianoRoll(); // Redraw needed as visibility changes
             console.log(`Track index ${index} visibility toggled to: ${trackStates[index].isVisible}`);
        } else {
             console.warn(`Attempted to toggle visibility for invalid track index: ${index}`);
        }
    }

    // --- UI Update Functions ---
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
            const button = trackItem.querySelector('.visibility-toggle i'); // Target the icon
             if (button) {
                 if (trackStates[index].isVisible) {
                     button.classList.remove('fa-eye-slash');
                     button.classList.add('fa-eye');
                     button.parentElement.title = "Hide Track"; // Update tooltip
                 } else {
                     button.classList.remove('fa-eye');
                     button.classList.add('fa-eye-slash');
                     button.parentElement.title = "Show Track"; // Update tooltip
                 }
             }
         }
    }


    // --- Calculation & Drawing ---
    function calculateDimensionsAndRedraw() {
         // Find the maximum tick across ALL tracks to determine width
        let maxTick = 0;
        rawTracksData.forEach(track => {
            if (track.notes && track.notes.length > 0) {
                track.notes.forEach(note => {
                    const endTick = note.start_tick + note.duration_ticks;
                    if (endTick > maxTick) {
                        maxTick = endTick;
                    }
                });
            }
        });

        rollWidth = Math.max(maxTick * PIXELS_PER_TICK, canvasContainer.clientWidth || 600); // Use container width as min if available
        
        // Set canvas intrinsic size
        canvas.width = rollWidth;
        canvas.height = ROLL_HEIGHT;

        console.log(`Calculated canvas dimensions: ${canvas.width} x ${canvas.height}`);
        redrawPianoRoll();
    }

    function redrawPianoRoll() {
        console.time("redrawPianoRoll"); // Start timing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Background & Grid
        drawGrid();

        // 2. Draw Notes (Layered: Ghosts first, then Active)
        
        // Draw Ghost Notes (Inactive but Visible)
        trackStates.forEach((state, stateIndex) => {
            if (state.isVisible && stateIndex !== activeTrackIndex) {
                const track = rawTracksData[stateIndex];
                if(track.notes) {
                    drawNotesForTrack(track, false); // false indicates inactive/ghost
                }
            }
        });

        // Draw Active Track Notes (On Top)
        if (activeTrackIndex !== -1 && trackStates[activeTrackIndex].isVisible) {
             const activeTrack = rawTracksData[activeTrackIndex];
             if(activeTrack.notes){
                drawNotesForTrack(activeTrack, true); // true indicates active
             }
        }
        
        console.timeEnd("redrawPianoRoll"); // End timing
    }

    function drawGrid() {
        ctx.fillStyle = BACKGROUND_COLOR; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Horizontal pitch lines (very faint)
        ctx.strokeStyle = GRID_LINE_COLOR;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); 
        for (let p = PITCH_MIN; p <= PITCH_MAX; p++) {
            const y = (PITCH_MAX - p) * NOTE_HEIGHT + (NOTE_HEIGHT / 2); 
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke(); 

        // Vertical time lines (beats and measures)
        if (ticksPerBeat > 0) {
            // Beat lines
            ctx.strokeStyle = BEAT_LINE_COLOR;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let t = 0; t <= canvas.width / PIXELS_PER_TICK; t += ticksPerBeat) {
                if ((t / ticksPerBeat) % 4 !== 0) { 
                    const x = t * PIXELS_PER_TICK;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                }
            }
            ctx.stroke();

            // Measure lines (thicker)
            ctx.strokeStyle = MEASURE_LINE_COLOR;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            for (let t = 0; t <= canvas.width / PIXELS_PER_TICK; t += (ticksPerBeat * 4)) { 
                const x = t * PIXELS_PER_TICK;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
            ctx.stroke();
        }
    }

    function drawNotesForTrack(track, isActive) {
        const notes = track.notes;
        if (!notes) return;

        // Set drawing style based on active state
        ctx.fillStyle = isActive ? ACTIVE_NOTE_FILL_COLOR : GHOST_NOTE_FILL_COLOR;
        // Outlines add visual clutter quickly, consider removing or making very subtle
        // ctx.strokeStyle = isActive ? ACTIVE_NOTE_STROKE_COLOR : GHOST_NOTE_STROKE_COLOR;
        // ctx.lineWidth = 0.5;

        notes.forEach(note => {
            const x = note.start_tick * PIXELS_PER_TICK;
            const y = (PITCH_MAX - note.pitch) * NOTE_HEIGHT; 
            const width = note.duration_ticks * PIXELS_PER_TICK;
            const height = NOTE_HEIGHT - 1; // Small gap

            // Set alpha based on active state and velocity
            if (isActive) {
                const activeAlpha = ACTIVE_VELOCITY_ALPHA_MIN + 
                                    (note.velocity / 127) * (ACTIVE_VELOCITY_ALPHA_MAX - ACTIVE_VELOCITY_ALPHA_MIN);
                ctx.globalAlpha = activeAlpha;
            } else {
                ctx.globalAlpha = GHOST_NOTE_ALPHA; // Fixed alpha for ghost notes
            }

            // Fill the note rectangle
            ctx.fillRect(x, y, Math.max(width, 1), height); 

            // Optional: Draw stroke (consider performance and visual clutter)
            // ctx.strokeRect(x, y, Math.max(width, 1), height); 
        });
         // Reset alpha after drawing track
         ctx.globalAlpha = 1.0; 
    }


    // --- Start the application ---
    initialize();

}); // End DOMContentLoaded