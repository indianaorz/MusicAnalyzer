# Heuristic Export Schema Draft

## Purpose

This draft defines the first generation-oriented normalized contract for the heuristic export.

The key shift is:

- `pattern` is treated as canonical or canonical-candidate musical identity
- `pattern_instance` is treated as an in-song occurrence with ordered position and local context
- `songPlan` is treated as the recursive decomposition surface for whole-song generation

This is the first schema step intended to bridge labeled song structure toward full-song heuristic generation.

Current schema version:

- `heuristic-song-export/v3`

## Core Objects

### `song`

Top-level export object for one labeled song.

Required fields:

- `exportVersion`
- `schemaVersion`
- `songId`
- `title`
- `source`
- `globalContext`
- `songPlan`
- `patterns`
- `patternInstances`
- `relationships`
- `collectionCandidates`
- `summary`
- `issues`

### `pattern`

Represents canonical identity or canonical-candidate identity.

Important fields:

- `id`
- `name`
- `normalizedName`
- `canonicalId`
- `primitiveType`
- `parentId`
- `children`
- `orderedChildPatternIds`
- `depth`
- `range`
- `instruments`
- `instrumentCount`
- `mode`
- `variantOf`
- `variantOfName`
- `flags`
- `relationTags`
- `sectionId`
- `sectionFamilyId`
- `sectionFamilyMode`
- `sectionPurpose`
- `sectionSkeletonId`
- `subsectionRootId`
- `subsectionSkeletonId`
- `subsectionFunction`
- `loopPolicy`
- `containerKind`
- `variationFamilyId`
- `callResponseGroupId`
- `reductionLineage`
- `patternRole`
- `instanceIds`
- `sourceOrder`
- `sourceRef`

Interpretation:

- if `canonicalId == id`, the pattern is currently acting as its own canonical seed
- if `canonicalId != id`, the pattern is structurally linked to another canonical seed

### `pattern_instance`

Represents an in-song occurrence of material. This is the main bridge between structure labels and generation.

Important fields:

- `id`
- `songId`
- `sourcePatternId`
- `canonicalPatternId`
- `parentInstanceId`
- `childInstanceIds`
- `orderIndex`
- `orderPath`
- `depth`
- `instanceType`
- `materialRole`
- `primitiveType`
- `sectionId`
- `sectionFamilyId`
- `sectionFamilyMode`
- `sectionPurpose`
- `sectionSkeletonId`
- `subsectionRootId`
- `subsectionSkeletonId`
- `subsectionFunction`
- `loopPolicy`
- `containerKind`
- `variationFamilyId`
- `callResponseGroupId`
- `reductionLineage`
- `range`
- `mode`
- `instrumentCount`
- `instruments`
- `sourceRef`

`materialRole` is currently one of:

- `song_root`
- `new_material`
- `canonical_reuse`
- `variation`
- `rhythmic_variation`
- `repetition`
- `simplification`
- `linked_derivation`

`instanceType` is currently one of:

- `song_root`
- `container`
- `leaf`

### `songPlan`

Represents recursive whole-song decomposition.

Important fields:

- `rootInstanceIds`
- `traversalOrderInstanceIds`
- `decompositionStrategy`

Current strategy:

- `ordered_child_instances`

Meaning:

- the song is traversed through ordered child-instance structure
- child order is preserved from authored `children` arrays when present
- inferred parent-child links fill gaps only when necessary

Additional `songPlan` fields now included:

- `rootPatternId`
- `sectionPatternIds`

These fields expose the current first-pass whole-song decomposition into section-level containers.

## Generation-Pipeline Overlay

The exporter now emits first-pass planning fields intended to bridge the hand-authored analysis model into executable heuristics.

### `primitiveType`

Current values:

- `complete_song`
- `section_container`
- `subsection_container`
- `leaf_pattern`

### `sectionPurpose`

Current first-pass values:

- `intro`
- `main_theme`
- `build_up`
- `break_down`
- `climax`
- `return`

These are name-derived heuristics and should be treated as advisory, not authoritative.

### `subsectionFunction`

Current first-pass values:

- `loop`
- `fill`
- `call`
- `response`
- `motif_seed`
- `motif_variation`

### `loopPolicy`

Current values:

- `play_once`
- `loop`
- `loop_with_fill`

### `containerKind`

Current values:

- `structural`
- `mixed`
- `orchestration_layer`

### Families and Grouping

The exporter now emits these top-level family/group records:

- `sectionFamilies`
- `variationFamilies`
- `callResponseGroups`
- `sectionAssetManifests`

These are the first-pass bridge from labeled graph structure into a generation pipeline like:

`complete_song -> ordered sections -> subsection skeletons -> variation families -> leaves`

## Generation-Relevant Semantics

This draft is intended to support these questions:

1. What are the ordered children of the whole-song container?
2. Which child introduces new material?
3. Which child reuses an earlier canonical pattern?
4. Which child is a variation or simplification of earlier material?
5. Which child is another container that requires recursive decomposition?
6. Which section belongs to a reusable section family?
7. Which subsection acts like a loop, fill, call, response, or motif seed?
8. What asset inventory is implied by a section container?

## Current Heuristic Families Supported By This Draft

- `decompose_container(pattern_or_instance)`
- `instantiate_canonical(pattern_id, local_context)`
- `restate_canonical(pattern_id)`
- `vary_pattern(pattern_id, variation_type)`
- `recurse_song_plan(instance_id)`
- `choose_section_family(previous_sections, local_context)`
- `instantiate_subsection_skeleton(section_id, skeleton_id)`
- `resolve_loop_policy(pattern_or_instance)`
- `build_section_asset_manifest(section_id)`
- `bind_call_response_group(group_id)`

## Worked Example

Representative validation file:

- `heuristic_exports/examples/representative_song.json`

This file is written during export generation and is intended to provide a single-song-first validation target for checking:

- pattern vs pattern-instance separation
- ordered child decomposition
- recursive structure readability
- whether the whole song can be interpreted as a generation-ready plan
