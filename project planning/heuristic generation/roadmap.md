# Heuristic Generation Roadmap

## North Star

This roadmap is governed by [NORTH_STAR.md](c:/Users/leeor/FFCO/MusicAnalyzerDAW/NORTH_STAR.md).

The target is not an Epicify-style example browser. The target is a structure-aware corpus where songs are represented as graphs of patterns, child patterns, collections, repetitions, and variations, and where normalization preserves that authored structure rather than flattening it away.

## NIMBLE Anchor

### North Star

Preserve raw authored structure first, normalize it second, analyze transforms third, and support generation only after structure and lineage are trustworthy.

### Intend

The current cycle is intended to validate the raw structural source model and define the normalized structural contract.

### Model

Current risk:

- existing flat dataset exports are easier to render than raw structure
- this can create drift toward `input` / `output` example viewing
- that is useful as a sidecar, but it is not the primary model we are building

Corrective model:

- treat `user_settings/` pattern graphs as the primary source for structure
- treat `training_data/` exports as secondary evidence and derived artifacts
- build the normalized schema around patterns, child patterns, collections, and lineage
- only use ABC/example viewing as a validation aid, not as the core data model

### Build

Build the raw structure audit and schema definition path first.

### Learn

What we learned from the first audit pass:

- the current source of truth for structure is much closer to `user_settings/` than `training_data/`
- the current audit page drifted toward dataset/example rendering because those files already contain ABC
- the audit correctly captured many relationship fields, but it does not yet expose enough of the structural graph itself

### Excess

Remove or de-prioritize anything in the current cycle that implies:

- Epicify is the normalization target
- every pattern must be an `input` / `output` pair
- flat examples are sufficient to represent parent-child structure

## Purpose

Build a normalization and analysis pipeline that converts the existing manually labeled song structures into a consistent dataset for:

1. browsing every canonical pattern, collection, and variation,
2. analyzing how one pattern changes into another,
3. identifying reusable sub-patterns and transformation heuristics,
4. supporting future generation of complete songs from structure graphs made of nodes, sub-nodes, and variations.

## Current Baseline In Repo

The repo already has useful starting points:

- `app.py`
  - existing dataset export routes such as `/dataset/export_training`
  - dataset index route at `/data/index.json`
  - dataset example route at `/data/example/<path>`
  - dataset browser route at `/browse`
  - current `library()` route still points to the classic upload page
- `templates/data_browser.html`
  - existing dataset browser shell
- `static/js/data_browser.js`
  - existing client-side browser for exported dataset examples
- `training_data/`
  - current flat-file dataset output
- `roadmap.json`
  - already identifies structure graph modeling and relationship metadata as next-stage work

## Problem Statement

The current exports are useful examples, but they are not yet normalized enough for structure-aware analysis or generation. The missing layer is a consistent representation of:

- canonical patterns,
- pattern collections and hierarchy,
- variation lineage,
- repeat lineage,
- transformation metadata,
- per-pattern musical features,
- per-edge "what changed" analysis between source and derived material.

Important clarification:

- a pattern may exist as a standalone canonical unit
- a pattern does not need to be forced into an `input` / `output` pair
- a parent pattern may contain child patterns
- a collection may contain multiple related patterns
- variation analysis is a relationship layered on top of structure, not a replacement for structure

Without that layer, it is hard to answer questions like:

- What is the master pattern for this variation?
- Which patterns are the same idea in different keys or orchestrations?
- Which changes are rhythmic, melodic, harmonic, textural, or structural?
- Which larger patterns can be decomposed into smaller reusable units?
- Which transformations are common enough to become generation heuristics?

## Primary Deliverables

### 1. Normalized Exporter

A batch exporter that scans all existing labeled source material and emits a normalized structural dataset snapshot.

### 2. Normalized Dataset Contract

A versioned schema for songs, collections, patterns, nodes, lineage, and variation relationships.

### 3. Library Page

A browser focused on normalized patterns, child patterns, collections, and lineage, not only raw exported examples.

### 4. Variation Analysis Layer

A feature extraction and comparison layer that explains what is musically performed between a canonical pattern and a variation.

### 5. Heuristic Extraction Layer

A first-pass rule system that identifies common transforms and candidate sub-pattern decompositions for later generation work.

## Proposed Normalized Data Model

This should be treated as the target contract for the feature.

## Normalization Strategy

Normalization should be layered, not single-axis. Key is important, but it should exist at the pattern level and be combined with rhythm, interval, harmonic-function, structure, and orchestration abstractions.

### Guiding rules

- always preserve the absolute source representation
- normalize patterns to their local tonal center, not only the song-wide key
- treat transposition as a relationship transform, not a new canonical identity
- avoid forcing tonal labels onto percussion or non-tonal material
- split multi-center patterns into sub-patterns when modulation is structurally meaningful
- keep enough provenance so every normalized record can be traced back to the exact source material

### Recommended normalization layers

#### 1. Absolute source layer

Store the unmodified musical source:

- original MIDI pitches
- absolute timing or ticks
- original instrumentation
- source song, file, bar range, and pattern reference

#### 2. Local tonal layer

Store pattern-level tonal context:

- `local_key`
- `mode`
- `confidence`
- `song_key`
- `transposition_from_song_root`
- `transposition_from_canonical`

This is the layer that makes "the same pattern in different keys" analyzable without losing musical context.

#### 3. Interval and contour layer

Store transposition-invariant melodic identity:

- interval sequence
- contour signature
- anchor-relative pitch representation
- pitch-class profile where useful

#### 4. Rhythm layer

Store beat-relative timing identity:

- onset grid positions
- normalized durations
- syncopation markers
- phrase-length and bar-length alignment

#### 5. Harmonic-function layer

For harmonic material, store function relative to the local tonic:

- scale-degree encoding
- Roman-numeral or function representation
- chord-root motion
- cadence markers

#### 6. Structural-role layer

Store where the pattern lives in the graph and in the phrase:

- collection
- parent pattern
- child nodes
- phrase role
- intro/theme/fill/bass/answer/transition role tags

#### 7. Orchestration-role layer

Abstract instruments into reusable roles:

- lead
- bass
- chord support
- pad
- percussion
- counterline
- accent or hit layer

### Canonical identity recommendation

Canonical identity should not be based on raw key alone. It should primarily be based on:

- rhythm shape
- interval contour
- harmonic-function profile
- structural role

Key should be stored as contextual metadata and as an edge transform where a pattern instance differs from its canonical form.

### Modulation handling

When a song changes key:

- keep song-level key changes in metadata
- normalize each pattern to its own local center
- if a pattern itself spans multiple tonal centers, either:
  - split it into smaller sub-patterns, or
  - store a key-path across the pattern if it must remain whole

### Non-tonal pattern handling

For percussion-heavy or tonally ambiguous patterns:

- do not force a tonic if confidence is low
- rely more heavily on rhythm, density, orchestration role, and structural context

### Core entities

- `song`
  - song-level metadata and source references
- `collection`
  - a labeled group of related patterns, sections, or node families
- `pattern`
  - canonical musical unit with stable identity
- `sub_pattern`
  - a child musical unit nested inside a larger pattern
- `pattern_variant`
  - derived version of a canonical pattern
- `pattern_instance`
  - occurrence of a pattern inside a song graph
- `relationship`
  - repeat, variation, simplification, embellishment, split_from, merged_from, generated_from
- `source_ref`
  - pointer back to original file, song, export category, pattern id, and notes region

### Recommended normalized fields

- stable id
- schema version
- song id
- collection id
- label and normalized label
- parent id
- canonical id
- relationship type
- transform tags
- local key
- mode
- tonal confidence
- transposition interval
- instrument set
- instrument roles
- key or pitch-center metadata
- meter and phrase length
- note events or compact symbolic representation
- interval sequence
- contour signature
- rhythm signature
- harmonic function sequence
- structural children
- source file references
- quality flags
- provenance timestamps

### Recommended analysis fields

- pitch contour signature
- rhythm signature
- interval histogram
- duration histogram
- register range
- density metrics
- onset syncopation metrics
- instrument-role summary
- harmonic anchor summary
- phrase boundary markers
- self-similarity and repetition markers

## Roadmap

## Phase 1: Audit Existing Labels And Exports

### Goal

Understand exactly what already exists in the labeled song files, exports, and pattern graph state so normalization does not destroy information.

Primary emphasis for this phase:

- inspect raw structure first
- inspect flat exports second
- confirm what is present in parent-child pattern graphs
- confirm which fields are required to preserve collections and nested patterns

### Tasks

- inventory all current export categories under `training_data/`
- inspect song state sources under `user_settings/`
- document current pattern relationship fields used by the editor
- identify duplicate naming patterns and schema drift
- define which source is authoritative when conflicts exist

### Outputs

- source inventory
- field map
- normalization gap list
- known data quality issues list

### Exit criteria

- every current export type is mapped to a normalization path
- every relationship type in the editor is accounted for

### Checkpoint

- produce a short audit artifact that lists every source file shape discovered
- list every pattern relationship field currently present
- list every missing field needed for normalization

### UI validation

- add a temporary audit view or JSON preview page that shows:
  - selected source file
  - raw pattern metadata discovered
  - detected relationship fields
  - child pattern links
  - parent pattern links
  - collection-like groupings where visible in source
  - which source is primary versus derived

This lets us verify from the UI that the parser is reading the current data correctly before we normalize anything.

### Phase 1 correction

The current heuristic audit page is only partially aligned:

- correct:
  - it inventories source files
  - it inventories relationship fields
  - it exposes raw payloads
- not yet correct enough:
  - it leans too heavily on dataset example rendering
  - it does not yet center the raw structural graph
  - it does not yet clearly expose parent-child pattern containment as the main object under review

So Phase 1 should be considered in progress, not complete, until the audit UI is centered on raw authored structure.

## Phase 2: Define The Normalized Schema

### Goal

Create a versioned contract that supports browsing, analysis, and future generation.

### Tasks

- define JSON schema for normalized entities
- define stable ID strategy for songs, collections, patterns, and relationships
- define lineage rules for repeat vs variation vs simplification
- define canonical naming and label normalization rules
- define how graph nodes and sub-nodes are represented
- define how collections differ from individual patterns

### Outputs

- schema document
- example normalized records
- normalization rules document

### Exit criteria

- same source material always normalizes to the same IDs
- schema can represent parent-child pattern graphs and variation chains

### Checkpoint

- approve one worked example by hand:
  - one canonical pattern
  - one variation
  - one collection
  - one relationship edge

### UI validation

- add a schema preview panel in the browser that shows:
  - raw source on one side
  - normalized JSON on the other side

This gives a direct visual check that the normalized structure matches musical intent.

## Phase 3: Build The Backfill Exporter

### Goal

Run through all already-labeled files and generate normalized outputs in one repeatable pass.

### Tasks

- add a batch exporter service
- scan current labeled files and training examples
- normalize names, lineage, and source references
- emit normalized records to a dedicated output tree
- generate index files for fast browsing
- log skipped, broken, or ambiguous records

### Recommended output layout

- `training_data/_normalized/songs/...`
- `training_data/_normalized/patterns/...`
- `training_data/_normalized/collections/...`
- `training_data/_normalized/relationships/...`
- `training_data/_normalized/index.json`

### Outputs

- repeatable exporter command
- normalized dataset snapshot
- exporter report with error counts and warnings

### Exit criteria

- exporter can run across the full existing corpus without manual intervention
- normalized output is deterministic for unchanged source data

### Checkpoint

- run the exporter on a very small sample corpus first:
  - 1 song
  - then 3 songs
  - then full corpus

- compare counts at each stage:
  - source patterns found
  - normalized patterns created
  - relationships created
  - warnings and skipped records

### UI validation

- add a temporary exporter-status page or dashboard card that shows:
  - last export time
  - records generated
  - warnings
  - clickable links into normalized outputs

This provides immediate confirmation that the exporter is producing what we expect.

## Phase 4: Build The Normalized Library Page

### Goal

Provide a dedicated browser for normalized patterns, collections, and variation lineage.

### Tasks

- extend the current browser or add a parallel normalized browser page
- add filters for song, collection, canonical pattern, relationship type, instrument, key, and tags
- add a detail pane for source pattern, normalized pattern, and linked variants
- show lineage graph or breadcrumb chain
- support side-by-side comparison of canonical vs variation
- support jumping from collection to member patterns and back

### Key UX views

- all canonical patterns
- all collections
- all variants of selected canonical pattern
- all relationships for selected node
- source-to-normalized provenance view

### Outputs

- normalized library route
- normalized index API
- pattern detail API
- comparison API

### Exit criteria

- every normalized record is browsable from the UI
- a user can move from canonical pattern to every known variation in one flow

### Checkpoint

- validate a fixed review set in the UI:
  - open one canonical pattern
  - inspect all linked variants
  - inspect one collection
  - trace one item back to source

### UI validation

- the page must make these visible at a glance:
  - canonical pattern identity
  - local key and transposition
  - relationship type
  - collection membership
  - source provenance

If any of those are hard to verify visually, the page is not ready.

## Phase 5: Add Musical Difference Analysis

### Goal

Quantify what is musically performed between pattern A and variation B.

### Tasks

- define feature extraction per pattern
- define pairwise diff rules for canonical to variant
- classify changes by type
- store derived analysis on relationship edges
- expose comparison results in the library UI

### Target change categories

- transposition
- rhythmic variation
- ornamentation
- density increase or reduction
- register shift
- harmonic alteration
- instrumentation change
- phrase extension or contraction
- subdivision change
- call-response or echo behavior

### Outputs

- feature extractor
- diff engine
- edge-level analysis records

### Exit criteria

- each canonical-to-variation edge has a readable transform summary
- analysis can separate structural changes from surface decoration

### Checkpoint

- validate analysis on a hand-picked pattern set where the expected answer is obvious:
  - simple transposition
  - rhythmic variation
  - instrumentation-only variation
  - ornamented ending

### UI validation

- side-by-side comparison view must show:
  - source pattern
  - variation pattern
  - computed transform summary
  - raw feature deltas

This gives us a direct sanity check against what we hear and see in the notation.

## Phase 6: Heuristic Mining For Generation

### Goal

Turn repeated analysis patterns into reusable generation heuristics.

### Tasks

- cluster similar transformations across songs
- identify common decomposition boundaries inside larger patterns
- identify frequent parent-to-child structural templates
- derive reusable transform recipes
- score heuristics by frequency, consistency, and musical coherence

### Example heuristic families

- transpose pattern up or down while preserving rhythm
- preserve contour while swapping interval content
- intensify by increasing density near phrase ending
- create fill variation in final bar only
- move supporting material up an octave for lift
- thin texture before restatement
- split pattern into call and answer sub-patterns

### Outputs

- heuristic catalog
- confidence score per heuristic
- traceability from heuristic back to source examples

### Exit criteria

- at least a first usable catalog of transform heuristics exists
- heuristics can be attached to candidate generation workflows

### Checkpoint

- review the first heuristic catalog manually and reject weak heuristics
- confirm each accepted heuristic has enough examples
- confirm each accepted heuristic has understandable wording
- confirm each accepted heuristic has traceability back to source patterns

### UI validation

- add a heuristic review view that shows:
  - heuristic name
  - supporting examples
  - confidence
  - source-to-variation evidence

This keeps the generation layer grounded in inspectable musical evidence.

## Recommended Implementation Order

1. audit the existing exported and saved data shapes
2. lock the normalized schema before building UI around it
3. build the backfill exporter and generate a first corpus snapshot
4. expose normalized index and detail APIs
5. build the normalized library page
6. add comparison and transform analysis
7. mine heuristics only after the lineage and diff data is trustworthy

## Suggested MVP Scope

The first shippable version of this feature should do only the following:

- batch-export all current labeled data into a normalized structure
- show canonical patterns, child patterns, variants, and collections in a browser
- show provenance from normalized item back to source file
- show a basic transform summary for canonical-to-variation edges

Anything beyond that should be treated as phase-two work:

- automatic decomposition suggestions
- heuristic scoring
- generation integration
- model-assisted pattern synthesis

## Technical Risks

- current labels may be inconsistent enough to require manual cleanup rules
- pattern identity may not be stable across songs or exports
- variation relationships may be implicit rather than explicit in some files
- existing browser APIs are flat and may need graph-aware replacements
- analysis may overfit to notation details instead of musical function

## Open Decisions

- what should be the authoritative source of truth: `user_settings`, exported dataset files, or both?
- should normalized records live under `training_data/_normalized/` or a separate root?
- should collections be explicit authored entities or inferred from lineage?
- should canonical IDs be hash-based, label-based, or assigned during export?
- how much derived analysis should be stored versus computed on demand?

## Acceptance Criteria For The Full Feature

- all existing labeled material can be exported into a normalized graph-friendly dataset
- every pattern can be traced to its song, collection, and source references
- every variation can be traced to a canonical parent
- the library page can browse canonical patterns, collections, and relationships
- the system can describe the musical differences between canonical and derived patterns
- the resulting dataset is structured enough to support future complete-song generation work

## Validation Workflow

Every phase should end with both a data checkpoint and a UI checkpoint.

### Data checkpoint

- counts match expectations
- example records are inspectable
- warnings are visible
- outputs are deterministic on re-run

### UI checkpoint

- the newest layer is visible without digging through raw files
- there is at least one known-good review example
- you can verify correctness by looking at source, normalized form, and relationship output side by side

### Review rhythm

- checkpoint after audit
- checkpoint after schema approval
- checkpoint after small-sample export
- checkpoint after full export
- checkpoint after first normalized browser view
- checkpoint after first musical diff view
- checkpoint after first heuristic catalog

## First Step To Start

The first implementation step should be:

### Step 1. Build a source-audit pass with a minimal inspection UI

This is the safest place to begin because it gives us a verified understanding of what the current files actually contain before we commit to normalization rules.

### Step 1 deliverables

- a script or backend service that scans:
  - `user_settings/`
  - `training_data/`
- an audit output file summarizing:
  - songs found
  - patterns found
  - relationship fields found
  - label variants and duplicates
  - missing or malformed fields
- a simple UI surface to inspect one source item at a time

### Step 1 must explicitly show

- parent pattern
- child patterns
- repetition links
- variation links
- collection candidates or grouping context
- whether the current item is raw source or derived export

### Step 1 checkpoint

- pick 3 representative songs
- verify the audit output against the current editor UI
- confirm we can see the same pattern names, relationships, and source ranges in both places

### Step 1 success criteria

- no normalization yet
- only discovery, mapping, and verification
- raw structure is visible without depending on Epicify-style example rendering
- once this is approved, we can define the schema with much less risk

## Immediate Next Step

Start with a schema-and-audit pass, not UI work. The exporter and browser will stay unstable until the normalized contract for pattern identity, lineage, and source provenance is locked first.
