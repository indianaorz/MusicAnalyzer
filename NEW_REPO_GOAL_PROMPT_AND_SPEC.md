# Clean-Slate Goal Prompt And Product Spec

Date: 2026-05-03

## One-Line Recommendation

Build the new project as a native Windows-first DAW in C++20 using JUCE for app/audio/MIDI/plugin foundations and seriously evaluate Tracktion Engine for sequencer/arrangement behavior. Keep the AI/catalog layer as a separate data/service boundary so Codex can reason over clean project and corpus files without being inside the realtime audio thread.

Reasoning:

- The old repo's durable value is the structure-aware corpus, not the Flask/browser implementation.
- The new app needs realtime MIDI capture, quantized monitoring, loop recording, quantized playback, VST3 hosting, and future audio-device reliability. Those are native-app strengths.
- A browser UI can still be useful later for corpus browsing, but it should not own the clock, MIDI capture, audio callback, VST hosting, or project truth.

## Starter Prompt For Codex Goal Mode

Paste this into a new clean repo:

```text
Goal: Build a clean-slate native Windows-first AI-assisted MIDI composition DAW called MusicGraphDAW.

North Star:
Create a usable DAW for recording MIDI from a physical keyboard, hearing instrument playback delayed/scheduled to the next declared quantize boundary, looping within a declared song section, and organizing all created or imported material as a structure-aware song graph. The app must support both analysis of existing songs and creation of new songs at the same structural level: song -> sections -> subsection/role skeletons -> instruments -> canonical patterns -> repetitions/variations -> notes.

Important source repo:
The prior prototype is at:
C:\Users\leeor\FFCO\MusicAnalyzerDAW

Treat it as read-only research. Do not port the Flask app. Extract lessons from these files first:
- NORTH_STAR.md
- roadmap.json
- project planning/heuristic generation/schema_draft.md
- project planning/heuristic generation/complete_generation_pipeline_analysis.md
- project planning/heuristic generation/decomposition_semantics_review.md
- project planning/heuristic generation/raw_midi_to_labeled_workflow.md
- heuristic_exports/index.json
- user_settings/IntroductionStage.mid.json

Technical direction:
- Prefer a native C++20 app, Windows-first, CMake-based.
- Use JUCE for MIDI/audio/device/plugin/UI foundations unless a better current native stack is discovered.
- Evaluate Tracktion Engine for arrangement, looping, recording, plugin hosting, clips, and quantization, but check license implications before hard dependency.
- Support VST3 instruments as the primary plugin target. SoundFont support can be first delivered through a built-in sampler or an SF2-compatible plugin/instrument path.
- Do not force a browser or Electron app unless the native stack proves unworkable.

Product requirements:
1. A user can create a song, declare sections, choose a current section, set loop bounds, and record MIDI from a keyboard.
2. Incoming MIDI is captured immediately as raw performance events, but audible instrument playback is delayed/scheduled to the next selected grid boundary for section-loop playback.
3. The loop repeats inside the active section while recording and overdubbing.
4. Notes are stored as editable events on instrument-role tracks.
5. The app stores song structure as first-class data: sections, section families, subsection skeletons, instrument-role layers, canonical patterns, pattern instances, repetitions, variations, rhythmic variations, simplifications, and source provenance.
6. The app imports the old corpus/export JSON into a read-only catalog that Codex/AI can query.
7. A user can prompt: "write a bassline for the current section in the style of MMX." The app exports current-section context plus relevant catalog context to the AI/proposal system.
8. AI-generated notes appear in the piano roll as yellow proposals. They are not real notes until accepted.
9. Proposals can be auditioned, edited, accepted, rejected, or partially accepted. Accepted proposal notes become normal DAW notes with provenance linking them back to the proposal and source context.
10. The UI must expose current song structure and the catalog of previous songs/sections/variations clearly enough that future Codex prompts can operate with minimal ambiguity.

First implementation objective:
Create the repo architecture, schemas, and a minimal vertical slice:
- native app opens
- MIDI input device can be selected
- simple built-in instrument or sampler can sound notes
- user can define one section and loop range
- recording captures MIDI notes, quantizes them to a grid, and loops them back
- notes persist to a versioned project file
- a hardcoded proposal JSON can render as yellow notes and be accepted into the track
- a read-only importer can load the old heuristic export index and expose at least song/section/pattern counts

Engineering rules:
- Keep realtime audio/MIDI separate from AI, disk I/O, database writes, and catalog search.
- Use an event log or command model for undo/redo from the beginning.
- Version every persisted schema.
- Keep canonical pattern identity separate from in-song pattern instances.
- Preserve source provenance before normalization.
- Do not let generated material bypass review. Proposal -> accept -> committed note is mandatory.
- Add tests for quantization, loop wrapping, graph relationships, proposal acceptance, and import of old corpus shape.

Deliverables for the first Goal Mode cycle:
1. README.md with product goal, setup, and first vertical slice.
2. AGENTS.md with NIMBLE-style workflow and anti-drift rules.
3. docs/ARCHITECTURE.md.
4. docs/DATA_MODEL.md with JSON examples.
5. docs/MVP_VERTICAL_SLICE.md with acceptance criteria.
6. CMake project scaffold.
7. src/domain with pure domain model and tests.
8. src/app native shell stub.
9. tools/import_old_corpus script or placeholder with contract.
10. tests covering the domain model before complex UI work.

After scaffolding, stop and summarize the architecture, tradeoffs, and next build step before expanding scope.
```

## Product North Star

MusicGraphDAW should be a DAW where composition, labeling, retrieval, and AI proposal all operate on the same project truth.

The app is not just a piano roll with an AI text box. It is a structure-aware music workbench:

- record playable MIDI ideas in time
- declare song sections and loops
- organize material into instrument roles and pattern families
- analyze existing songs at the same level as new songs
- retrieve relevant prior material by style, section function, instrument role, and variation lineage
- let AI propose notes as reviewable, audible, editable musical material

## Transferable Learnings From The Current Repo

### Keep

- Structure-first corpus thinking from `NORTH_STAR.md`.
- Pattern vs pattern-instance separation from `schema_draft.md`.
- Recursive shape: `complete_song -> sections -> subsection skeletons -> variation families -> leaves`.
- Explicit relationships: parent-child, repetition, variation, rhythmic variation, simplification, section family, call-response.
- Source provenance and raw authored structure before normalization.
- Section asset manifests: which instrument-role layers realize a section.
- Strong labeling workflow: section skeleton first, role containers second, canonical source patterns third, lineage fourth.
- Heuristic export summary and corpus browser as a read-only catalog seed.

### Do Not Keep

- Monolithic Flask backend.
- Monolithic JavaScript piano roll.
- Flat-file schema drift without migrations.
- Browser ownership of realtime audio/MIDI timing.
- Synchronous rendering and heavyweight work in interaction paths.
- Training-pair export as the primary source model.
- UI that displays examples while hiding the graph contract.

### Important Corpus Facts To Carry Forward

Current heuristic export snapshot:

- 11 songs
- 834 patterns
- 834 pattern instances
- 1,274 relationships
- 177 collections
- relationship types include parent-child, repetition, variation, rhythmic variation, section family, and call-response

Most important pipeline correction:

- variation usually happens below section level
- sections often preserve or modify subsection/instrument skeletons
- generation should model section skeletons and variation families, not just sections and leaf notes

## Architecture Recommendation

### Primary Stack

- Language: C++20.
- Build: CMake.
- App/audio foundation: JUCE.
- Sequencer/DAW engine candidate: Tracktion Engine.
- Plugin format: VST3 first.
- Persistence: SQLite plus project folder assets, or a single project package containing SQLite and media.
- Offline/catalog tools: Python is acceptable for import, analysis, embedding, and migration tools.
- AI integration: separate process or service boundary. The app writes structured context and receives structured proposals.

### Why Native Windows First

The requirements are fundamentally realtime and host-like:

- low-latency MIDI input
- audio callback scheduling
- quantized monitoring
- loop recording
- plugin scanning/loading
- VST instrument UI hosting
- device/sample-rate/buffer management

A browser can draw a piano roll, but it is a poor owner for plugin hosting and reliable live MIDI/audio behavior. A native app can still expose JSON context files for Codex and can still use an embedded web view later if a browser UI becomes useful.

### License Checkpoint

Before committing to Tracktion Engine, decide whether this repo is personal/GPL-compatible or may become closed-source/commercial. Tracktion Engine is GPL/commercial, and it also requires the appropriate JUCE license for distribution. VST3 is now MIT as of SDK 3.8, but trademark usage still has rules.

## System Boundaries

### Realtime Engine

Owns:

- audio device callback
- MIDI input timestamping
- quantized MIDI note monitoring
- plugin/instrument rendering
- loop scheduler
- sample clock and transport
- safe event queues

Must not:

- call AI
- block on disk
- block on database
- scan catalog
- allocate unpredictably in the audio callback

### Domain Model

Owns:

- songs
- sections
- loop regions
- tracks and instrument roles
- notes and clips
- canonical patterns
- pattern instances
- relationships
- proposal lifecycle
- undoable commands
- schema versions

This should be testable without launching the GUI or audio device.

### Catalog

Owns:

- imported source songs
- section summaries
- section skeletons
- variation families
- instrument-role manifests
- pattern fingerprints
- text/metadata embeddings
- provenance links

The catalog should be queryable by:

- style tag, e.g. `MMX`
- song family
- section purpose
- instrument role
- subsection skeleton
- loop policy
- relationship type
- rhythmic/melodic fingerprint

### AI Proposal Service

Owns:

- assembling prompt context
- retrieving relevant catalog entries
- asking an LLM or Codex workflow for a proposal
- validating proposal JSON
- returning proposal notes and rationale

The DAW remains the source of truth. The AI never commits directly.

## Core Data Model

### Song Project

```json
{
  "schemaVersion": "musicgraph-project/v1",
  "projectId": "uuid",
  "title": "New Song",
  "tempoMap": [{"beat": 0, "bpm": 150}],
  "timeSignatureMap": [{"beat": 0, "numerator": 4, "denominator": 4}],
  "keyMap": [{"beat": 0, "root": "E", "mode": "minor"}],
  "songStructure": {
    "rootSectionIds": ["section:intro", "section:a", "section:b"]
  }
}
```

### Section

```json
{
  "id": "section:a",
  "name": "Part A",
  "purpose": "main_theme",
  "range": {"startBeat": 8, "endBeat": 24},
  "loopPolicy": "loop",
  "sectionFamilyId": "section-family:a",
  "subsectionSkeletonId": "skeleton:a",
  "instrumentRoleIds": ["role:drums:a", "role:bass:a", "role:lead:a"]
}
```

### Instrument Role Track

```json
{
  "id": "role:bass:a",
  "sectionId": "section:a",
  "role": "bass",
  "trackId": "track:bass",
  "instrumentSlotId": "instrument:vst3:chipsynth",
  "clipIds": ["clip:bass:a:take1"]
}
```

### Note Event

```json
{
  "id": "note:1",
  "pitch": 40,
  "velocity": 92,
  "startBeat": 8.0,
  "durationBeats": 0.25,
  "channel": 1,
  "source": "recorded",
  "rawPerformanceEventIds": ["raw:note-on:1", "raw:note-off:1"]
}
```

### Pattern And Instance

```json
{
  "canonicalPattern": {
    "id": "pattern:bass-motif-a",
    "name": "Bass Motif A",
    "role": "bass",
    "primitiveType": "leaf_pattern"
  },
  "patternInstance": {
    "id": "instance:bass-motif-a:part-a:1",
    "canonicalPatternId": "pattern:bass-motif-a",
    "sectionId": "section:a",
    "clipId": "clip:bass:a:take1",
    "materialRole": "new_material",
    "orderPath": [1, 0, 0]
  }
}
```

### Relationship Edge

```json
{
  "id": "edge:variation:1",
  "type": "variation",
  "sourceId": "pattern:bass-motif-a",
  "targetId": "pattern:bass-motif-a-prime",
  "scope": "pattern",
  "evidence": "accepted_user_label",
  "transformTags": ["rhythmic_variation", "register_shift"]
}
```

### Proposal

```json
{
  "schemaVersion": "musicgraph-proposal/v1",
  "proposalId": "proposal:2026-05-03T12-00-00Z",
  "status": "pending",
  "target": {
    "sectionId": "section:a",
    "instrumentRole": "bass",
    "trackId": "track:bass"
  },
  "prompt": "Write a bassline for the current section in the style of MMX.",
  "notes": [
    {
      "pitch": 40,
      "velocity": 86,
      "startBeat": 8.0,
      "durationBeats": 0.25
    }
  ],
  "catalogEvidence": [
    {
      "songId": "mmx_boomer_kuwanger_stage",
      "sectionPurpose": "main_theme",
      "role": "synth bass",
      "reason": "similar loop policy and persistent subsection skeleton"
    }
  ],
  "rationale": "Uses short repeated bass cells and small rhythmic turns without copying a source pattern."
}
```

## Realtime Recording Behavior

### Active Section Loop

The transport has:

- active section id
- loop start beat
- loop end beat
- current playhead beat
- grid size, e.g. 1/16
- overdub enabled/disabled

When recording:

1. MIDI note-on is timestamped against the transport.
2. The raw input event is never used for direct-through sound.
3. The engine computes the next quantized trigger beat and schedules audible playback through the selected instrument at that grid position.
4. Raw note-on/note-off events are recorded unchanged for provenance and future re-quantization.
5. On note completion, the note start and end are quantized to the nearest grid step.
6. If the note crosses loop end, it is either split or wrapped according to a documented policy.
7. The quantized note is added to the active clip.
8. The loop scheduler plays committed notes on the next pass.

Default loop-crossing policy:

- split at loop end if a held note crosses the boundary
- create a wrapped continuation at loop start only if sustain is still active
- preserve raw event provenance so the policy can be changed later

## Proposal Lifecycle

AI notes must move through this state machine:

```text
draft request -> pending proposal -> auditioned -> accepted/rejected/partially accepted -> committed notes
```

Rules:

- Pending proposal notes render yellow.
- Pending notes can be moved/resized before acceptance.
- Pending notes can be muted or soloed for audition.
- Accepted notes adopt normal track color.
- Accepted notes retain proposal provenance.
- Rejected proposals remain in history but do not render by default.
- The AI cannot overwrite committed user notes unless the user explicitly selects a replace operation.

## UI Specification

First screen should be the actual DAW, not a landing page.

Required regions:

- Transport bar: play, stop, record, metronome, tempo, grid, quantize, active loop.
- Section lane: high-level song structure with named sections and loop bounds.
- Track list: instrument role, plugin/instrument slot, mute, solo, record arm.
- Piano roll: notes, grid, loop boundary, playhead, selected track.
- Pattern graph/sidebar: current section tree, canonical patterns, instances, variations.
- Catalog/AI panel: current context, retrieval results, proposal request, pending proposals.

Proposal visuals:

- yellow note fill
- dashed outline or proposal badge
- accept/reject controls near proposal group
- evidence/rationale visible in the side panel, not over the piano roll

## Existing Song Labeling Workflow

The new app must support imported songs and created songs with the same structure model.

For existing MIDI:

1. Import MIDI into raw tracks and notes.
2. Preserve raw notes and source file provenance.
3. Declare top-level sections.
4. Add instrument-role containers inside sections.
5. Identify canonical motifs/loops.
6. Mark repetitions and variations.
7. Add optional rationale notes.
8. Export to catalog.

For new songs:

1. Create song structure.
2. Declare sections and loop regions.
3. Record or draw notes into role tracks.
4. Promote useful clips to canonical patterns.
5. Create repetitions/variations intentionally.
6. Ask AI for proposals against current structure.
7. Accept proposals into the same graph model.

## Import From Old Repo

Initial importer should read:

- `heuristic_exports/index.json`
- `heuristic_exports/songs/*.json`
- `user_settings/*.json`

It should map:

- old `song` to `CatalogSong`
- old `pattern` to `CatalogPattern`
- old `patternInstance` to `CatalogPatternInstance`
- old `relationships` to catalog edges
- old `sectionAssetManifests` to `SectionAssetManifest`
- old `variationFamilies`, `sectionFamilies`, `callResponseGroups` to first-class catalog groups

Do not require old data to be perfect. Preserve import warnings and unresolved semantics.

## MVP

### Must Have

- Builds on Windows.
- Native app opens.
- Audio/MIDI device selection works.
- MIDI keyboard quantized monitoring works through one simple built-in instrument.
- User can create one section and set loop bounds.
- User can record while looping.
- Notes quantize to nearest grid step.
- Recorded notes play back on subsequent loops.
- Project saves and reloads.
- Pending proposal JSON renders as yellow notes.
- Accept proposal commits notes into the track.
- Import old catalog index and display counts.
- VST3 instrument scan and load.
- SF2 or sample-based instrument path.
- Undo/redo for note edits and proposal acceptance.
- Section/track/pattern graph browser.
- MIDI export.
- Old corpus song detail browser.
- Advanced harmonic analysis.
- Multi-take lanes.

## Test Plan

Pure domain tests:

- quantize to nearest grid
- loop wrap and split
- section range validation
- proposal accept/reject/partial accept
- pattern vs instance identity
- variation edge creation
- imported old export summary counts
- schema migration round trip

Realtime/manual smoke:

- MIDI input latency feels playable
- loop does not drift over several minutes
- overdub does not duplicate note-off events
- plugin load failure does not crash app
- audio thread keeps running when catalog search or AI request is active

## Anti-Drift Rules

- Do not build a generic DAW first and hope structure comes later.
- Do not build an AI chat app with a piano roll attached.
- Do not treat accepted and proposed notes as the same state.
- Do not collapse canonical pattern identity into note clips.
- Do not infer style solely from song name. Use section skeletons, instrument roles, and variation families.
- Do not put AI, disk I/O, plugin scanning, or catalog search on the audio thread.
- Do not overbuild VST support before the simple MIDI loop recording vertical slice works.

## Suggested Repo Layout

```text
MusicGraphDAW/
  AGENTS.md
  README.md
  CMakeLists.txt
  docs/
    ARCHITECTURE.md
    DATA_MODEL.md
    MVP_VERTICAL_SLICE.md
    OLD_REPO_LEARNINGS.md
  src/
    app/
    engine/
    domain/
    catalog/
    proposal/
  tools/
    import_old_corpus/
    proposal_validator/
  tests/
    domain/
    catalog/
  schemas/
    musicgraph-project-v1.schema.json
    musicgraph-proposal-v1.schema.json
    musicgraph-catalog-v1.schema.json
  examples/
    proposal-bassline.pending.json
```

## Sources Used

Local repo:

- `NORTH_STAR.md`
- `roadmap.json`
- `project planning/heuristic generation/schema_draft.md`
- `project planning/heuristic generation/complete_generation_pipeline_analysis.md`
- `project planning/heuristic generation/decomposition_semantics_review.md`
- `project planning/heuristic generation/raw_midi_to_labeled_workflow.md`
- `heuristic_exports/index.json`
- `user_settings/IntroductionStage.mid.json`

External current references:

- Tracktion Engine overview: https://www.tracktion.com/develop/tracktion-engine
- Tracktion Engine GitHub README/license notes: https://github.com/Tracktion/tracktion_engine
- JUCE AudioDeviceManager docs: https://docs.juce.com/master/classjuce_1_1AudioDeviceManager.html
- JUCE AudioPluginFormatManager docs: https://docs.juce.com/master/classjuce_1_1AudioPluginFormatManager.html
- JUCE module overview: https://docs.juce.com/master/index.html
- Steinberg VST3 licensing: https://steinbergmedia.github.io/vst3_dev_portal/pages/VST%2B3%2BLicensing/VST3%2BLicense.html
- Steinberg VST3 SDK README: https://github.com/steinbergmedia/vst3sdk
