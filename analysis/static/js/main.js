// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const analysisContainer = document.getElementById('analysis-content');

    const DEFAULT_VOICE_COLORS = ['#6cb2f5','#ffb74d','#8e44ad','#2ecc71','#f1c40f'];


    if (!analysisContainer) {
        console.error("Main.js: Analysis container not found.");
        return;
    }

    // Store synth engines and states for each block
    const blockAudioStates = {}; // { blockId: { synthEngine: ..., isPlaying: false, isPrimed: false, totalMillis: 0 } }

    // --- Define the functions needed for the synth callbacks ---

    // Called by the synth engine during playback via eventCallback
    function handleAudioEventCallback(ev, blockId, canvasWidth) {
        console.log(`[PLAYHEAD DEBUG] Callback Fired! blockId=<span class="math-inline">\{blockId\}, time\=</span>{ev?.milliseconds}, width=${canvasWidth}`); // MODIFIED DEBUG LINE
        console.log(`Audio event for ${blockId}:`, ev); // Log the whole event object
        const state = blockAudioStates[blockId];
        const playhead = document.getElementById(`${blockId}-playhead`);
        console.log(`State: isPlaying=<span class="math-inline">\{state?\.isPlaying\}, totalMillis\=</span>{state?.totalMillis}, canvasWidth=${canvasWidth}`); // Log state

        if (!state || !playhead || !state.isPlaying || state.totalMillis <= 0 || !ev) {
            return;
        }
        if (typeof ev.milliseconds === 'number') {
            const progress = ev.milliseconds / state.totalMillis;
            const playheadX = progress * canvasWidth;
            playhead.style.left = `${Math.min(canvasWidth, Math.max(0, playheadX))}px`;
        }
    }


    // ────────────────────────────────────────────────────────────────
    //  Called automatically by abcjs when the audio engine finishes.
    //  • rewinds the synth to the start
    //  • stops ↔ hides the playhead
    //  • resets the play / pause button
    // ────────────────────────────────────────────────────────────────
    function handleAudioFinishedCallback(blockId) {
        const state = blockAudioStates[blockId];
        const button = analysisContainer.querySelector(
            `.abc-play-button[data-block-id="${blockId}"]`);
        const playhead = document.getElementById(`${blockId}-playhead`);

        console.log(`[main.js] Playback finished for block ${blockId}`);

        // ─── rewind audio engine ────────────────────────────────────
        if (state?.synthEngine) {
            state.synthEngine.pause();
            state.synthEngine.seek(0);              // jump back to start
        }
        if (state) state.isPlaying = false;

        // ─── reset UI button ────────────────────────────────────────
        if (button) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-pause', 'fa-spinner', 'fa-spin');
                icon.classList.add('fa-play');
            }
            button.title = "Play";
            button.disabled = !state?.isPrimed;     // stays disabled only if load failed
        }

        // ─── reset / hide playhead ──────────────────────────────────
        if (playhead) {
            playhead.classList.remove('playhead-animating'); // stop CSS keyframes
            playhead.style.animationDuration = '';
            playhead.style.animationPlayState = '';
            playhead.style.left = '0px';       // hard‑rewind
            playhead.style.display = 'none';      // hide until next play
        }
    }





    // --- Main Processing Function ---
    function processAndRenderAnalysis() {
        console.log("[Main.js] Checking ABCJS availability...");
        if (typeof ABCJS === 'undefined' || !ABCJS.synth || typeof ABCJS.synth.CreateSynth !== 'function') {
            console.error("[Main.js] FATAL: ABCJS or ABCJS.synth.CreateSynth is not available.");
            analysisContainer.innerHTML = `<p style="color: red;">Error: Required ABCJS components not loaded.</p>`;
            return;
        }
        console.log("[Main.js] ABCJS Synth seems available.");


        try {
            const textContent = analysisContent;
            analysisContainer.innerHTML = ''; // Clear processing message
            const parts = textContent.split(/(<abc>[\s\S]*?<\/abc>)/g);
            let abcBlockIndex = 0;

            parts.forEach(part => {
                if (!part.trim()) return;

                const abcMatch = part.match(/<abc>([\s\S]*?)<\/abc>/);

                if (abcMatch) {
                    // --- Process ABC Block ---
                    const abcString = abcMatch[1].trim();
                    abcBlockIndex++;
                    const blockId = `abc-block-${abcBlockIndex}`;

                    // --- Create container elements (Same as before) ---
                    const blockWrapper = document.createElement('div');
                    blockWrapper.className = 'abc-render-block';
                    blockWrapper.id = blockId;

                    const controlsWrapper = document.createElement('div');
                    controlsWrapper.className = 'abc-controls';

                    const titleElement = document.createElement('div');
                    titleElement.className = 'abc-title';
                    const titleMatch = abcString.match(/^[ \t]*T:[ \t]*(.*)/m);
                    titleElement.textContent = titleMatch ? titleMatch[1] : `Music Example ${abcBlockIndex}`;

                    const playButton = document.createElement('button');
                    playButton.className = 'abc-play-button';
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                    playButton.title = "Play";
                    playButton.dataset.blockId = blockId;
                    playButton.disabled = true; // Enable after init

                    controlsWrapper.appendChild(playButton);
                    controlsWrapper.appendChild(titleElement);
                    blockWrapper.appendChild(controlsWrapper);

                    const pianoRollWrapper = document.createElement('div');
                    pianoRollWrapper.className = 'static-piano-roll-wrapper';

                    const keyDisplay = document.createElement('aside');
                    keyDisplay.className = 'static-key-display';
                    keyDisplay.id = `${blockId}-key-display`;

                    const canvasContainer = document.createElement('div');
                    canvasContainer.className = 'static-canvas-container';

                    const canvas = document.createElement('canvas');
                    canvas.className = 'static-piano-roll-canvas';
                    canvas.id = `${blockId}-canvas`;
                    canvas.textContent = 'Your browser does not support the canvas element.';

                    const playhead = document.createElement('div');
                    playhead.className = 'abc-playhead'; // CSS class for styling and animation target
                    playhead.id = `${blockId}-playhead`;

                    canvasContainer.appendChild(canvas);
                    canvasContainer.appendChild(playhead); // Add playhead here
                    pianoRollWrapper.appendChild(keyDisplay);
                    pianoRollWrapper.appendChild(canvasContainer);
                    blockWrapper.appendChild(pianoRollWrapper);
                    analysisContainer.appendChild(blockWrapper);
                    // --- End element creation ---

                    // --- ABCJS Visual Rendering & Audio Setup ---
                    let abcTune = null;
                    let visualObjArr = null;
                    let parseError = null;
                    const dummyDiv = document.createElement("div");
                    dummyDiv.id = `visual-${blockId}`;
                    dummyDiv.style.cssText = 'position:absolute; left:-9999px; top:-9999px; visibility:hidden;';

                    try {
                        document.body.appendChild(dummyDiv);
                        visualObjArr = ABCJS.renderAbc(dummyDiv, abcString, { /* visual options */ });
                        document.body.removeChild(dummyDiv);

                        if (visualObjArr && visualObjArr.length > 0) {
                            abcTune = visualObjArr[0];

                            // --- Initialize Static Renderer (Same as before) ---
                            const renderer = createStaticPianoRollRenderer({
                                canvas: canvas, keyDisplayPanel: keyDisplay, abcTune: abcTune,
                                highlightVoiceIndex: 0,
                                voiceColors: DEFAULT_VOICE_COLORS

                            });
                            if (renderer) {
                                setTimeout(() => renderer.render(), 50);
                            } else {
                                console.error(`[main.js] Failed static renderer init for ${blockId}`);
                            }

                            // --- Initialize ABCJS Synth (but don't prime yet) ---
                            const synthEngine = new ABCJS.synth.CreateSynth();
                            const synthOptions = {
                                visualObj: abcTune,
                                options: {
                                    // eventCallback is still needed by abcjs, but we don't use its timing data for playhead
                                    eventCallback: (ev) => handleAudioEventCallback(ev, blockId),
                                    onEndedCallback: () => handleAudioFinishedCallback(blockId)
                                }
                            };

                            synthEngine.init(synthOptions)
                                .then(() => {
                                    console.log(`[main.js] Synth initialized (but not primed) for block ${blockId}`);
                                    blockAudioStates[blockId] = {
                                        synthEngine: synthEngine,
                                        isPlaying: false,
                                        isPrimed: false,
                                        totalMillis: 0 // Will be set after priming
                                    };
                                    playButton.disabled = false;
                                    playButton.title = "Play (loads audio)";
                                })
                                .catch((error) => {
                                    console.error(`[main.js] Error initializing synth for block ${blockId}:`, error);
                                    parseError = error;
                                    playButton.disabled = true;
                                    playButton.title = "Audio Init Error";
                                    if (blockWrapper && blockWrapper.parentNode) {
                                        blockWrapper.innerHTML += `<p style="color:red; font-size: 0.8em;">Audio Init Error: ${error?.message || error}</p>`;
                                    }
                                    delete blockAudioStates[blockId];
                                });

                        } else {
                            parseError = "renderAbc did not return a visual object array.";
                            console.error(`[main.js] renderAbc failed for block ${abcBlockIndex}:`, visualObjArr);
                        }
                    } catch (error) {
                        parseError = error;
                        console.error(`[main.js] Error during render/initial setup for block ${abcBlockIndex}:`, error);
                        if (dummyDiv.parentNode === document.body) { document.body.removeChild(dummyDiv); }
                        if (blockWrapper) {
                            blockWrapper.innerHTML += `<p style="color:red;">Setup Error: ${error?.message || error}</p>`;
                        }
                    }

                    // Final Error Check and Button Listener (Same as before)
                    if (parseError) {
                        console.error(`[main.js] Failed to fully process block ${abcBlockIndex} due to error:`, parseError);
                        playButton.disabled = true;
                        playButton.title = "Setup Error";
                    }
                    playButton.addEventListener('click', handlePlayButtonClick);

                } else {
                    // --- Found Commentary Text (Same as before) ---
                    const commentaryElement = document.createElement('div');
                    commentaryElement.className = 'commentary';
                    commentaryElement.innerHTML = part.trim().replace(/\n/g, '<br>');
                    analysisContainer.appendChild(commentaryElement);
                }
            }); // end parts.forEach

        } catch (error) {
            console.error('Error processing or rendering analysis content:', error);
            analysisContainer.innerHTML = `<p style="color: red;">Error processing analysis: ${error.message}</p>`;
        }
    } // --- End of processAndRenderAnalysis function ---


    /* ────────────────────────────────────────────────────────────────
       PLAY‑HEAD  ✓ rewind ✓ restart ✓ pause / resume
       Drop this chunk into static/js/main.js – replace the old
       helper + handleAudioFinishedCallback + handlePlayButtonClick.
       ───────────────────────────────────────────────────────────── */

    /** Force‑restart the CSS key‑frame animation of the red play‑head */
    function resetPlayheadAnimation(playheadEl, durationMs) {
        if (!playheadEl || !(durationMs > 0)) return;

        playheadEl.style.display = 'block';      // ensure visible
        playheadEl.style.left = '0px';        // hard‑rewind

        /*  ── “Toggle / reflow / toggle” trick ───────────────────── */
        playheadEl.classList.remove('playhead-animating');
        playheadEl.style.animation = 'none';     // kill previous run
        /* trigger reflow so the browser notices the change */
        void playheadEl.offsetWidth;
        playheadEl.style.animation = '';         // allow animation again

        /* configure & start new run */
        playheadEl.style.animationDuration = `${durationMs / 1000}s`;
        playheadEl.style.animationPlayState = 'running';
        playheadEl.classList.add('playhead-animating');
    }

    /* ────────────────────────────────────────────────────────────────
       1.  Called automatically when the synth reaches the end
       ───────────────────────────────────────────────────────────── */
    function handleAudioFinishedCallback(blockId) {
        const state = blockAudioStates[blockId];
        const button = analysisContainer.querySelector(
            `.abc-play-button[data-block-id="${blockId}"]`);
        const playhead = document.getElementById(`${blockId}-playhead`);

        console.log(`[main.js] Playback finished for block ${blockId}`);

        /* rewind audio engine */
        if (state?.synthEngine) {
            state.synthEngine.pause();
            state.synthEngine.seek(0);
        }
        if (state) state.isPlaying = false;

        /* reset button UI */
        if (button) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-pause', 'fa-spinner', 'fa-spin');
                icon.classList.add('fa-play');
            }
            button.title = 'Play';
            button.disabled = !state?.isPrimed;
        }

        /* hide & reset playhead */
        if (playhead) {
            playhead.classList.remove('playhead-animating');
            playhead.style.animation = 'none';
            playhead.style.left = '0px';
            playhead.style.display = 'none';
        }
    }

    /* ────────────────────────────────────────────────────────────────
       2.  Play / Pause button
       ───────────────────────────────────────────────────────────── */
    function handlePlayButtonClick(event) {
        const button = event.currentTarget;
        const blockId = button.dataset.blockId;
        const state = blockAudioStates[blockId];

        if (!state || !state.synthEngine) {
            console.error(`No synth state for block ${blockId}`);
            button.disabled = true;
            button.title = 'Error';
            return;
        }

        const playhead = document.getElementById(`${blockId}-playhead`);
        const icon = button.querySelector('i');

        /* ── PAUSE ────────────────────────────────────────────────── */
        if (state.isPlaying) {
            state.synthEngine.pause();
            state.isPlaying = false;

            if (playhead) playhead.style.animationPlayState = 'paused';

            if (icon) { icon.classList.remove('fa-pause'); icon.classList.add('fa-play'); }
            button.title = 'Play';
            return;
        }

        /* helper that actually starts audio + animation */
        const startPlayback = () => {
            resetPlayheadAnimation(playhead, state.totalMillis);
            state.synthEngine.seek(0);
            state.synthEngine.resume();
            state.isPlaying = true;

            if (icon) { icon.classList.remove('fa-play', 'fa-spinner', 'fa-spin'); icon.classList.add('fa-pause'); }
            button.title = 'Pause';
        };

        /* ── FIRST TIME: prime the synth ─────────────────────────── */
        if (!state.isPrimed) {
            if (icon) { icon.classList.remove('fa-play'); icon.classList.add('fa-spinner', 'fa-spin'); }
            button.disabled = true;
            button.title = 'Loading…';

            state.synthEngine.prime()
                .then(resp => {
                    state.totalMillis = resp.duration * 1000;
                    state.isPrimed = true;
                    button.disabled = false;
                    startPlayback();
                })
                .catch(err => {
                    console.error(`Prime error for ${blockId}:`, err);
                    if (icon) { icon.classList.remove('fa-spinner', 'fa-spin'); icon.classList.add('fa-play'); }
                    button.disabled = false;
                    button.title = 'Play (Retry)';
                    alert(`Could not load audio.\n${err.message || err}`);
                });
            return;
        }

        /* ── ALREADY PRIMED: simply (re)start ────────────────────── */
        if (!(state.totalMillis > 0)) {
            alert('Cannot play: invalid duration from synth.');
            return;
        }
        startPlayback();
    }


    // --- Stop all audio when page is hidden/closed ---
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            Object.keys(blockAudioStates).forEach(blockId => {
                const state = blockAudioStates[blockId];
                if (state && state.isPlaying && state.synthEngine) {
                    console.log(`Pausing audio for hidden block ${blockId}`);
                    state.synthEngine.pause();
                    state.isPlaying = false;
                    // Update button UI
                    const button = analysisContainer.querySelector(`.abc-play-button[data-block-id="${blockId}"]`);
                    if (button) {
                        const icon = button.querySelector('i');
                        if (icon) {
                            // Remove spinner if it was somehow left during priming
                            icon.classList.remove('fa-spinner', 'fa-spin');
                            icon.classList.remove('fa-pause');
                            icon.classList.add('fa-play');
                        }
                        button.title = "Play";
                        button.disabled = !state.isPrimed; // Re-disable if not primed yet? Or leave enabled? Let's leave enabled.
                    }
                    // Keep playhead visible but stopped
                }
            });
        }
    });
    // Consider 'pagehide' or 'beforeunload' for potentially calling synthEngine.close() if needed


    processAndRenderAnalysis(); // Start the whole process
}); // End DOMContentLoaded