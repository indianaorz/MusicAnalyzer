# Heuristic Export Schema Draft

## Purpose

This draft defines the first generation-oriented normalized contract for the heuristic export.

The key shift is:

- `pattern` is treated as canonical or canonical-candidate musical identity
- `pattern_instance` is treated as an in-song occurrence with ordered position and local context
- `songPlan` is treated as the recursive decomposition surface for whole-song generation

This is the first schema step intended to bridge labeled song structure toward full-song heuristic generation.

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

## Generation-Relevant Semantics

This draft is intended to support these questions:

1. What are the ordered children of the whole-song container?
2. Which child introduces new material?
3. Which child reuses an earlier canonical pattern?
4. Which child is a variation or simplification of earlier material?
5. Which child is another container that requires recursive decomposition?

## Current Heuristic Families Supported By This Draft

- `decompose_container(pattern_or_instance)`
- `instantiate_canonical(pattern_id, local_context)`
- `restate_canonical(pattern_id)`
- `vary_pattern(pattern_id, variation_type)`
- `recurse_song_plan(instance_id)`

## Worked Example

Representative validation file:

- `heuristic_exports/examples/representative_song.json`

This file is written during export generation and is intended to provide a single-song-first validation target for checking:

- pattern vs pattern-instance separation
- ordered child decomposition
- recursive structure readability
- whether the whole song can be interpreted as a generation-ready plan
