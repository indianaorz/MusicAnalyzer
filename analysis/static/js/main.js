// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const analysisContainer = document.getElementById('analysis-content');

    const DEFAULT_VOICE_COLORS = ['#6cb2f5', '#ffb74d', '#8e44ad', '#2ecc71', '#f1c40f'];


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

    function addVoiceSelector(blockWrapper, renderer){
        const voices = renderer.getVoices();
        if (voices.length < 2) return;        // nothing to choose
    
        const wrapper = document.createElement('div');
        wrapper.className = 'voice-selector';
    
        const label = document.createElement('label');
        label.textContent = 'Voice:';
        wrapper.appendChild(label);
    
        const select = document.createElement('select');
        voices.forEach(v=>{
            const opt = document.createElement('option');
            opt.value = v.index;
            opt.textContent = v.name;
            select.appendChild(opt);
        });
        select.addEventListener('change', ()=>{
            renderer.setHighlightVoice(parseInt(select.value,10));
        });
        wrapper.appendChild(select);
    
        const pianoWrapper = blockWrapper.querySelector('.static-piano-roll-wrapper');
        blockWrapper.insertBefore(wrapper, pianoWrapper);
    }
    



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
            analysisContainer.innerHTML = ''; // clear "Processing…"
            const parts = textContent.split(/(<abc>[\s\S]*?<\/abc>)/g);
            let abcBlockIndex = 0;

            parts.forEach(part => {
                if (!part.trim()) return;

                const abcMatch = part.match(/<abc>([\s\S]*?)<\/abc>/);

                if (abcMatch) {
                    // ─── ABC Block ───────────────────────────────────────────
                    const abcString = abcMatch[1].trim();
                    abcBlockIndex++;
                    const blockId = `abc-block-${abcBlockIndex}`;

                    // wrapper
                    const blockWrapper = document.createElement('div');
                    blockWrapper.className = 'abc-render-block';
                    blockWrapper.id = blockId;

                    // controls (play/pause + title)
                    const controls = document.createElement('div');
                    controls.className = 'abc-controls';
                    const playBtn = document.createElement('button');
                    playBtn.className = 'abc-play-button';
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playBtn.title = "Play";
                    playBtn.dataset.blockId = blockId;
                    playBtn.disabled = true;
                    const title = document.createElement('div');
                    title.className = 'abc-title';
                    const tm = abcString.match(/^[ \t]*T:[ \t]*(.*)/m);
                    title.textContent = tm ? tm[1] : `Example ${abcBlockIndex}`;
                    controls.appendChild(playBtn);
                    controls.appendChild(title);
                    blockWrapper.appendChild(controls);

                    // piano‑roll skeleton
                    const pianoWrapper = document.createElement('div');
                    pianoWrapper.className = 'static-piano-roll-wrapper';
                    const keyPanel = document.createElement('aside');
                    keyPanel.className = 'static-key-display';
                    keyPanel.id = `${blockId}-key-display`;
                    const canvasContainer = document.createElement('div');
                    canvasContainer.className = 'static-canvas-container';
                    const canvas = document.createElement('canvas');
                    canvas.className = 'static-piano-roll-canvas';
                    canvas.id = `${blockId}-canvas`;
                    const playhead = document.createElement('div');
                    playhead.className = 'abc-playhead';
                    playhead.id = `${blockId}-playhead`;
                    canvasContainer.appendChild(canvas);
                    canvasContainer.appendChild(playhead);
                    pianoWrapper.appendChild(keyPanel);
                    pianoWrapper.appendChild(canvasContainer);
                    blockWrapper.appendChild(pianoWrapper);

                    analysisContainer.appendChild(blockWrapper);

                    // ─── renderAbc off‑screen to get tune object ─────────────
                    let abcTune = null, voArr = null, setupErr = null;
                    const dummy = document.createElement('div');
                    dummy.style.cssText = 'position:absolute; left:-9999px; top:-9999px;';
                    try {
                        document.body.appendChild(dummy);
                        voArr = ABCJS.renderAbc(dummy, abcString, {});
                        document.body.removeChild(dummy);

                        if (voArr && voArr.length) {
                            abcTune = voArr[0];

                            // ─── static piano‑roll renderer ────────────────────
                            const renderer = createStaticPianoRollRenderer({
                                canvas,
                                keyDisplayPanel: keyPanel,
                                rawAbc: abcString,    // ADD THIS
                                abcTune,
                                highlightVoiceIndex: 0,
                                voiceColors: DEFAULT_VOICE_COLORS
                            });
                            if (renderer) {
                                setTimeout(() => {
                                    renderer.render();
                                    // inject the dropdown
                                    addVoiceSelector(blockWrapper, renderer);
                                }, 50);
                            } else {
                                console.error(`Renderer init failed for ${blockId}`);
                            }

                            // ─── ABCJS synth ──────────────────────────────────
                            const engine = new ABCJS.synth.CreateSynth();
                            engine.init({
                                visualObj: abcTune,
                                options: {
                                    eventCallback: ev => handleAudioEventCallback(ev, blockId),
                                    onEndedCallback: () => handleAudioFinishedCallback(blockId)
                                }
                            })
                                .then(() => {
                                    blockAudioStates[blockId] = {
                                        synthEngine: engine,
                                        isPlaying: false,
                                        isPrimed: false,
                                        totalMillis: 0
                                    };
                                    playBtn.disabled = false;
                                    playBtn.title = "Play (load audio)";
                                })
                                .catch(err => {
                                    console.error(`Synth init error ${blockId}:`, err);
                                    playBtn.disabled = true;
                                    playBtn.title = "Audio Error";
                                    blockWrapper.innerHTML += `<p style="color:red; font-size:0.8em;">
                                Audio Error: ${err.message || err}
                            </p>`;
                                });

                        } else {
                            setupErr = "renderAbc returned no visualObj";
                            console.error(`[Main.js] renderAbc empty for block ${abcBlockIndex}`);
                        }
                    } catch (e) {
                        setupErr = e;
                        console.error(`[Main.js] Setup error for block ${abcBlockIndex}:`, e);
                        if (dummy.parentNode) document.body.removeChild(dummy);
                        blockWrapper.innerHTML += `<p style="color:red;">Setup Error: ${e.message}</p>`;
                    }

                    if (setupErr) {
                        playBtn.disabled = true;
                        playBtn.title = "Setup Error";
                    }
                    playBtn.addEventListener('click', handlePlayButtonClick);

                } else {
                    // commentary
                    const comment = document.createElement('div');
                    comment.className = 'commentary';
                    comment.innerHTML = part.trim().replace(/\n/g, '<br>');
                    analysisContainer.appendChild(comment);
                }
            });
        } catch (err) {
            console.error("Processing error:", err);
            analysisContainer.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
        }
    }

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