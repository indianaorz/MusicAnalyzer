// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const analysisContainer = document.getElementById('analysis-content');

    if (!analysisContainer) {
        console.error("Main.js: Analysis container not found.");
        return;
    }

    function processAndRenderAnalysis() {
        if (typeof analysisContent === 'undefined') {
             console.error("Main.js: analysisContent constant not found. Is analysis-data.js loaded correctly before main.js?");
             analysisContainer.innerHTML = `<p style="color: red;">Error: Analysis data not found.</p>`;
             return;
        }

        try {
            const textContent = analysisContent;
            analysisContainer.innerHTML = ''; // Clear processing message
            const parts = textContent.split(/(<abc>[\s\S]*?<\/abc>)/g);
            let abcBlockIndex = 0;

            parts.forEach(part => {
                if (!part.trim()) return;

                const abcMatch = part.match(/<abc>([\s\S]*?)<\/abc>/);

                if (abcMatch) {
                    const abcString = abcMatch[1].trim();
                    abcBlockIndex++;
                    const blockId = `abc-block-${abcBlockIndex}`;

                    // --- Create container elements ---
                    // (Same code as before to create blockWrapper, titleElement,
                    // pianoRollWrapper, keyDisplay, canvasContainer, canvas)
                    const blockWrapper = document.createElement('div');
                    blockWrapper.className = 'abc-render-block';
                    blockWrapper.id = blockId;
                    const titleElement = document.createElement('div');
                    titleElement.className = 'abc-title';
                    const titleMatch = abcString.match(/^[ \t]*T:[ \t]*(.*)/m);
                    titleElement.textContent = titleMatch ? titleMatch[1] : `Music Example ${abcBlockIndex}`;
                    blockWrapper.appendChild(titleElement);
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
                    canvasContainer.appendChild(canvas);
                    pianoRollWrapper.appendChild(keyDisplay);
                    pianoRollWrapper.appendChild(canvasContainer);
                    blockWrapper.appendChild(pianoRollWrapper);
                    analysisContainer.appendChild(blockWrapper);
                    // --- End element creation ---


                    let abcTune = null;
                    let parseError = null;
                    const dummyDiv = document.createElement("div");
                    dummyDiv.style.position = 'absolute';
                    dummyDiv.style.left = '-9999px';
                    dummyDiv.style.top = '-9999px';
                    dummyDiv.style.visibility = 'hidden';

                    try {
                        document.body.appendChild(dummyDiv);
                        const visualObjArr = ABCJS.renderAbc(dummyDiv, abcString, {});
                        document.body.removeChild(dummyDiv);

                        // --- Focused Inspection ---
                        console.log(`[main.js] renderAbc returned visualObjArr for block ${abcBlockIndex}:`, visualObjArr);

                        if (visualObjArr && visualObjArr.length > 0) {
                            // Log the actual first object returned
                            const firstVisualObj = visualObjArr[0];
                            console.log(`[main.js] Inspecting visualObjArr[0] for block ${abcBlockIndex}:`, firstVisualObj);

                            // **Hypothesis:** Maybe the tune data is directly on this object?
                            // Or maybe under a different property like .data, .abcTune, etc.?
                            // We still need the object that has the '.lines' array.
                            // For now, let's *assume* the firstVisualObj itself MIGHT be the tune object
                            // based on some abcjs examples, even if it lacks a top-level '.tune' property.
                            // We rely on the renderer's internal check for '.lines'.
                            abcTune = firstVisualObj; // Tentatively assign the whole visual object

                        } else {
                             parseError = "renderAbc did not return a visual object array.";
                             console.error(`[main.js] renderAbc returned empty or invalid array for block ${abcBlockIndex}:`, visualObjArr);
                        }
                        // --- End Focused Inspection ---

                    } catch (error) {
                        parseError = error;
                        console.error(`[main.js] Error during renderAbc for block ${abcBlockIndex}:`, error);
                        if (dummyDiv.parentNode === document.body) {
                            document.body.removeChild(dummyDiv);
                        }
                    }

                    console.log(`[main.js] Passing abcTune object to renderer for block ${abcBlockIndex}:`, abcTune);

                    if (abcTune) {
                        const renderer = createStaticPianoRollRenderer({
                             canvas: canvas,
                             keyDisplayPanel: keyDisplay,
                             abcTune: abcTune, // Pass the first visual object directly
                         });
                         if (renderer) {
                             setTimeout(() => renderer.render(), 50);
                         } else {
                             console.error(`[main.js] Failed to initialize static renderer for block ${abcBlockIndex}`);
                             canvasContainer.innerHTML = '<p style="color:red;">Error initializing piano roll renderer.</p>';
                         }
                    } else {
                         console.error(`[main.js] Failed to get valid abcTune object for block ${abcBlockIndex}:`, parseError || "Unknown issue.", "\nABC String was:\n", abcString);
                         blockWrapper.innerHTML += `<p style="color:red;">Error parsing ABC notation: ${parseError?.message || parseError || 'Invalid format'}</p>`;
                    }

                } else {
                    // --- Found Commentary Text ---
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
    }

    processAndRenderAnalysis();
});