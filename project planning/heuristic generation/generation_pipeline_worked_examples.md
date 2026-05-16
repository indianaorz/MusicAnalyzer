# Generation Pipeline Worked Examples

## Purpose

This document provides a concrete, end-to-end example of how the current heuristic pipeline could be used to recreate several songs from a single `complete_song` node.

It does four things:

1. defines the function pipeline in a concrete way
2. shows sample parameters and outputs for each stage
3. walks several real songs through that pipeline down to their current exported shape
4. calls out holes in the current architecture and proposes new sample functions where the architecture is still missing them

This is a design and research reference. It is not claiming that all of these functions already exist in code.

## Pipeline Summary

The current best pipeline is:

1. `instantiate_complete_song`
2. `choose_section_order_template`
3. `instantiate_section_nodes`
4. `derive_section_family_mode`
5. `build_subsection_skeleton`
6. `propagate_subsection_skeleton`
7. `classify_container_kind`
8. `seed_subsection_material`
9. `derive_variation_family`
10. `resolve_leaf_chain`
11. `assemble_song_graph`

The key correction from earlier work is:

- the pipeline is not just `song -> sections -> leaves`
- it is `song -> sections -> subsection skeletons -> variation families -> leaves`

## Primitive Vocabulary

### Existing or inferable primitives

- `complete_song`
- `section_container`
- `leaf_pattern`
- `new_material`
- `repetition`
- `variation`
- `rhythmic_variation`
- `simplification`
- `canonical_reuse`
- `ordered_sequence`

### Needed new primitives

These are required to express the full pipeline cleanly, but are not explicit enough in the current export:

- `subsection_container`
- `section_family`
- `subsection_skeleton`
- `variation_family`
- `container_kind`
  - `structural`
  - `orchestration_layer`
  - `mixed`

## Function Catalog

### 1. `instantiate_complete_song`

Status:

- conceptual
- effectively represented by current `songPlan.rootInstanceIds`

Signature:

```json
instantiate_complete_song({
  "songId": "mmx_storm_eagle",
  "title": "MMX Storm Eagle"
})
```

Output primitive:

```json
{
  "primitive": "complete_song",
  "nodeId": "instance:root:mmx_storm_eagle",
  "title": "MMX Storm Eagle"
}
```

### 2. `choose_section_order_template`

Status:

- conceptual
- not explicit in current export

Purpose:

- choose the ordered top-level section plan

Signature:

```json
choose_section_order_template({
  "songId": "mmx_storm_eagle",
  "archetypeHint": "intro_plus_abc"
})
```

Output primitive:

```json
{
  "primitive": "ordered_sequence",
  "sectionLabels": ["Drop In", "Part A", "Part B", "Part C"]
}
```

### 3. `instantiate_section_nodes`

Status:

- inferable from current export

Purpose:

- create top-level sections as ordered child instances of `complete_song`

Signature:

```json
instantiate_section_nodes({
  "rootNodeId": "instance:root:mmx_storm_eagle",
  "sectionLabels": ["Drop In", "Part A", "Part B", "Part C"]
})
```

Output primitive:

```json
[
  {"primitive": "section_container", "label": "Drop In", "orderPath": [0, 0]},
  {"primitive": "section_container", "label": "Part A", "orderPath": [0, 1]},
  {"primitive": "section_container", "label": "Part B", "orderPath": [0, 2]},
  {"primitive": "section_container", "label": "Part C", "orderPath": [0, 3]}
]
```

### 4. `derive_section_family_mode`

Status:

- missing from current architecture
- needed

Purpose:

- determine whether a section:
  - introduces a new family
  - reuses a prior family skeleton
  - varies a prior section

Signature:

```json
derive_section_family_mode({
  "sectionLabel": "Part C",
  "priorSections": ["Drop In", "Part A", "Part B"],
  "currentShapeEvidence": {
    "topLevelRole": "new_material",
    "sharedSubsectionNames": [
      "drums",
      "distortion guitar",
      "string ensemble 1",
      "electric guitar jazz",
      "slap bass 2"
    ]
  }
})
```

Output primitive:

```json
{
  "primitive": "section_family",
  "sectionFamilyMode": "reuse_subsection_skeleton_with_internal_transform",
  "sectionFamilyId": "section-family:storm-eagle:a-b-c"
}
```

### 5. `build_subsection_skeleton`

Status:

- partially inferable from current export
- missing as explicit output

Purpose:

- expand a section into ordered subsection containers or leaf slots

Signature:

```json
build_subsection_skeleton({
  "sectionLabel": "Part A",
  "sectionFamilyId": "section-family:storm-eagle:a-b-c"
})
```

Output primitive:

```json
{
  "primitive": "subsection_skeleton",
  "subsectionSkeletonId": "subsection-skeleton:storm-eagle:part-a",
  "children": [
    {"label": "Drums", "primitive": "subsection_container"},
    {"label": "String Ensemble 1", "primitive": "subsection_container"},
    {"label": "Electric Guitar (jazz)", "primitive": "subsection_container"},
    {"label": "Slap Bass 2", "primitive": "subsection_container"},
    {"label": "Distortion Guitar", "primitive": "subsection_container"},
    {"label": "Distortion Guitar", "primitive": "leaf_pattern"}
  ]
}
```

### 6. `propagate_subsection_skeleton`

Status:

- missing from current architecture
- needed

Purpose:

- reuse a subsection skeleton across sibling sections, possibly with additions or omissions

Signature:

```json
propagate_subsection_skeleton({
  "sourceSection": "Part A",
  "targetSection": "Part B",
  "sourceSkeletonId": "subsection-skeleton:storm-eagle:part-a"
})
```

Output primitive:

```json
{
  "primitive": "subsection_skeleton",
  "subsectionSkeletonId": "subsection-skeleton:storm-eagle:part-b",
  "derivedFrom": "subsection-skeleton:storm-eagle:part-a",
  "preservedChildren": [
    "Drums",
    "Distortion Guitar",
    "String Ensemble 1",
    "Electric Guitar (jazz)",
    "Slap Bass 2"
  ],
  "modifiedChildren": [
    "Distortion Guitar"
  ]
}
```

### 7. `classify_container_kind`

Status:

- missing from current architecture
- needed

Purpose:

- distinguish whether a subsection container is:
  - structural
  - orchestration-layer
  - mixed

Signature:

```json
classify_container_kind({
  "containerLabel": "Lead B",
  "childLabels": [
    "Motif 1",
    "Motif 1'",
    "Motif 1''",
    "Motif 2",
    "Motif 2'",
    "Motif 2''"
  ]
})
```

Output primitive:

```json
{
  "primitive": "container_kind",
  "value": "mixed"
}
```

### 8. `seed_subsection_material`

Status:

- inferable from current export

Purpose:

- introduce the first material in a subsection family

Signature:

```json
seed_subsection_material({
  "subsectionLabel": "Lead B",
  "seedPatternNames": ["Motif 1", "Motif 2"]
})
```

Output primitive:

```json
{
  "primitive": "variation_family",
  "seedPatterns": ["Motif 1", "Motif 2"]
}
```

### 9. `derive_variation_family`

Status:

- inferable from current export

Purpose:

- derive repetitions, variations, rhythmic variations, or simplifications from seed material

Signature:

```json
derive_variation_family({
  "familyId": "variation-family:flame-mammoth:lead-b",
  "seedPattern": "Motif 1",
  "operations": [
    {"op": "rhythmic_variation", "target": "Motif 1'"},
    {"op": "variation", "target": "Motif 1''"}
  ]
})
```

Output primitive:

```json
[
  {"primitive": "rhythmic_variation", "label": "Motif 1'"},
  {"primitive": "variation", "label": "Motif 1''"}
]
```

### 10. `resolve_leaf_chain`

Status:

- inferable from current export

Purpose:

- fully materialize the leaf sequence inside a subsection family

Signature:

```json
resolve_leaf_chain({
  "subsectionLabel": "Lead B",
  "orderedLeaves": [
    "Motif 1",
    "Motif 1'",
    "Motif 1'",
    "Motif 1''",
    "Motif 2",
    "Motif 2'",
    "Motif 2''",
    "Motif 2'"
  ]
})
```

Output primitive:

```json
{
  "primitive": "ordered_sequence",
  "leafCount": 8
}
```

### 11. `assemble_song_graph`

Status:

- inferable from current export

Purpose:

- combine root, sections, subsection skeletons, families, and leaves into final graph

Signature:

```json
assemble_song_graph({
  "songId": "mmx_flame_mammoth_stage",
  "sectionIds": [
    "section:dropin",
    "section:part-a",
    "section:part-b",
    "section:part-c"
  ]
})
```

Output primitive:

```json
{
  "primitive": "complete_song",
  "resolvedShape": "current_export_shape"
}
```

## Worked Example 1: MMX Storm Eagle

This is a strong example of subsection skeleton persistence across sections.

### Stage 1. Root

```json
instantiate_complete_song({
  "songId": "mmx_storm_eagle",
  "title": "MMX Storm Eagle"
})
```

Output:

```json
{
  "primitive": "complete_song",
  "children": []
}
```

### Stage 2. Section order

```json
choose_section_order_template({
  "songId": "mmx_storm_eagle",
  "archetypeHint": "intro_plus_abc"
})
```

Output:

```json
["Drop In", "Part A", "Part B", "Part C"]
```

### Stage 3. Top-level sections

```json
instantiate_section_nodes({
  "rootNodeId": "instance:root:mmx_storm_eagle",
  "sectionLabels": ["Drop In", "Part A", "Part B", "Part C"]
})
```

Output:

- `Drop In`
- `Part A`
- `Part B`
- `Part C`

All four top-level sections are currently `new_material`.

### Stage 4. Section family mode

```json
derive_section_family_mode({
  "sections": ["Part A", "Part B", "Part C"],
  "sharedSubsectionNames": [
    "Drums",
    "Distortion Guitar",
    "String Ensemble 1",
    "Electric Guitar (jazz)",
    "Slap Bass 2"
  ]
})
```

Output:

```json
{
  "sectionFamilyId": "section-family:storm-eagle:abc",
  "mode": "reuse_subsection_skeleton_with_internal_transform"
}
```

### Stage 5. Build subsection skeletons

Current section shapes:

- `Drop In`
  - `Drums`
  - `Distortion Guitar`

- `Part A`
  - `Drums`
  - `String Ensemble 1`
  - `Electric Guitar (jazz)`
  - `Slap Bass 2`
  - `Distortion Guitar`
  - `Distortion Guitar`

- `Part B`
  - `Drums`
  - `Distortion Guitar`
  - `String Ensemble 1`
  - `Distortion Guitar`
  - `Electric Guitar (jazz)`
  - `Slap Bass 2`

- `Part C`
  - `Drums`
  - `Distortion Guitar`
  - `String Ensemble 1`
  - `Trill Hold Descent`
  - `Electric Guitar (jazz)`
  - `Slap Bass 2`

### Stage 6. Populate variation families

Representative families:

- `Drums / Part B`
  - `Pattern`
  - `Pattern`
  - `Pattern'`
  - `Pattern'`
  - `Pattern'`
  - `Pattern''`

- `Distortion Guitar / Part B`
  - `Riff Pattern''`
  - `Riff Pattern'''`
  - `Riff Pattern''''`
  - `Riff Pattern'''''`
  - repeats of earlier derived material

- `Trill Hold Descent / Part C`
  - `Trill Hold`
  - `Trill Hold'`
  - `Trill Hold''`
  - `Trill Hold'''`
  - `Trill Hold''''`
  - `Trill Hold'''''`

### Pipeline interpretation

Storm Eagle is created by:

1. creating a four-section plan
2. preserving a shared subsection skeleton across `Part A`, `Part B`, and `Part C`
3. driving most change inside the subsection families
4. resolving leaf-level repetition and variation under those subsection containers

## Worked Example 2: MMX Flame Mammoth Stage

This is the strongest explicit theme-derivation example.

### Stage 1. Root and sections

Top-level sections:

- `DropIn`
- `Part A`
- `Part B`
- `Part C`

### Stage 2. Section-family mode

`DropIn` is special. It is not just an intro shell. It is already a variation family.

```json
derive_section_family_mode({
  "sectionLabel": "DropIn",
  "evidence": {
    "children": ["Theme A", "Theme A'", "Theme A''", "Theme A''"]
  }
})
```

Output:

```json
{
  "sectionFamilyId": "section-family:flame-mammoth:dropin",
  "mode": "explicit_theme_derivation"
}
```

### Stage 3. `DropIn` subsection shape

Current shape:

- `Theme A`
  - `return of Theme A`
- `Theme A'`
- `Theme A''`
  - `Simp. of Theme A''`
- `Theme A''`

This means the pipeline needs:

- one theme seed
- direct variations
- simplification chain support

### Stage 4. Part A subsection skeleton

Current shape:

- `Drum A`
- `Cymbal A`
- `String A`
- `Back Guitar A`
- `Bass A`

Representative leaf chains:

- `Drum A`
  - `Drum 1`
  - `Drum 1`
  - `Drum 1''`
  - `Drum 1'`

- `Back Guitar A`
  - `Theme A''`
  - `Theme A'''`
  - `Theme A''`
  - `Theme A''''`

### Stage 5. Part B subsection skeleton

Current shape:

- `Drums B`
- `Back Guitar B`
- `Lead B`

Representative leaf chain for `Lead B`:

- `Motif 1`
- `Motif 1'`
- `Motif 1'`
- `Motif 1''`
- `Motif 2`
- `Motif 2'`
- `Motif 2''`
- `Motif 2'`

### Stage 6. Part C subsection skeleton

Current shape:

- `Percussion`
- `Lead C`
- `Back Guitar C`
- `Bass`

Representative leaf chain for `Lead C`:

- `Solo`
- `Solo`
- `Solo'`
- `Solo'`
- `Solo''`
- `Fill`
- `Solo'''`
- `Fill'`
- `Return`

### Pipeline interpretation

Flame Mammoth is created by:

1. introducing a theme family immediately
2. deriving variations and simplifications inside the opening section
3. expanding later sections into subsection skeletons
4. resolving motif-level variation families inside those subsection containers

## Worked Example 3: MMX Chill Penguin

This is a strong subsection-skeleton persistence example.

### Stage 1. Root and sections

Top-level sections:

- `Drop In`
- `Part A (Snowflakes Atmosphere)`
- `Part B (Transistion)`
- `Part C (Main)`
- `Part D (Return)`

### Stage 2. Subsection skeleton persistence

Current shared subsection family set across later sections:

- `Drums`
- `Synth Bass 2`
- `Percussive Organ`
- `Synth Brass 2`
- `Synth Strings 1`
- `Melodic Tom`
- `Reverse Cymbal`

Then later sections add:

- `Lead 2 (sawtooth)`

### Stage 3. Exact current section shapes

- `Drop In`
  - `Drums`
  - `Percussive Organ`

- `Part A (Snowflakes Atmosphere)`
  - `Drums`
  - `Synth Bass 2`
  - `Percussive Organ`
  - `Synth Brass 2`
  - `Synth Brass 2`
  - `Synth Brass 2`
  - `Synth Strings 1`
  - `Melodic Tom`
  - `Reverse Cymbal`

- `Part B (Transistion)`
  - same 9-node skeleton, mostly `canonical_reuse`

- `Part C (Main)`
  - same skeleton plus `Lead 2 (sawtooth)`

- `Part D (Return)`
  - same skeleton plus two `Lead 2 (sawtooth)` leaves

### Stage 4. Lead family in `Part C`

`Lead 2 (sawtooth)` resolves to:

- `Motif 1`
- `Motif 1'`
- `Motif 2`
- `Motif 2'`

This means the pipeline has to support:

- persistent subsection skeleton
- delayed insertion of new subsection family
- leaf-level rhythmic and standard variation inside the inserted family

### Pipeline interpretation

Chill Penguin is created by:

1. defining an atmospheric subsection scaffold
2. reusing that scaffold across multiple sections
3. adding lead-focused subsection material later
4. deriving local motifs only inside the added lead family

## Worked Example 4: MMX String Chameleon

This is one of the few direct section-level variation examples.

### Stage 1. Root and sections

Top-level sections:

- `Part A (Anthem)`
- `Part A (Anthem)'`
- `Part D (Descent)`
- `Part B (Build)`

### Stage 2. Section-level variation

```json
derive_section_family_mode({
  "sectionLabel": "Part A (Anthem)'",
  "baseSectionLabel": "Part A (Anthem)"
})
```

Output:

```json
{
  "sectionFamilyId": "section-family:string-chameleon:anthem",
  "mode": "direct_section_variation"
}
```

### Stage 3. Exact current section shapes

- `Part A (Anthem)`
  - `Drums`
  - `Synth Bass 2`
  - `Synth Brass 1`
  - `Overdriven Guitar`
  - `Distortion Guitar`
  - `Orchestra Hit`

- `Part A (Anthem)'`
  - `Drums`
  - `Synth Bass 2`
  - `Synth Brass 1`
  - `Overdriven Guitar`
  - `Distortion Guitar`

Every child in `Part A (Anthem)'` is currently marked `variation`.

- `Part D (Descent)`
  - `Drums`
  - `Synth Bass 2`
  - `Synth Brass 1`
  - `Overdriven Guitar`
  - `Distortion Guitar`
  - `Synth Drum`
  - `Reverse Cymbal`

- `Part B (Build)`
  - `Drums`
  - `Synth Bass 2`
  - `Synth Brass 1`
  - `Overdriven Guitar`
  - `Distortion Guitar`
  - `Synth Drum`

### Pipeline interpretation

String Chameleon is created by:

1. instantiating an anthem section seed
2. creating a direct section-level variation of that section
3. preserving the same subsection skeleton in later sections with small additions
4. relying less on deep leaf-family derivation than other songs

This is why the pipeline must distinguish:

- section-family variation
- subsection-skeleton persistence

Those are separate phenomena.

## Minimum New Functions Required By The Current Gaps

These functions should be added to the conceptual architecture immediately.

### `derive_section_family_mode`

Reason:

- current export does not explicitly say whether a section is:
  - a new family
  - a direct section variation
  - a return that reuses a subsection skeleton

### `build_subsection_skeleton`

Reason:

- current export exposes children, but not a canonical subsection skeleton identity

### `propagate_subsection_skeleton`

Reason:

- current export does not explicitly model that sibling sections often share the same subsection scaffold

### `classify_container_kind`

Reason:

- current export does not distinguish:
  - structural containers
  - orchestration-layer containers
  - mixed containers

### `derive_variation_family`

Reason:

- current export has relationship tags, but not a first-class variation-family concept

## Holes In The Current Architecture

### 1. No explicit subsection skeleton identifier

Current problem:

- we can observe subsection skeleton reuse
- we cannot name it directly in the export

### 2. No section-family identity

Current problem:

- we can observe when sections look related
- we cannot represent that relationship cleanly

### 3. No container-kind classification

Current problem:

- a container may be structural, orchestration-oriented, or mixed
- the current export does not distinguish them

### 4. `canonical_reuse` is still provisional

Current problem:

- some reuse is structural
- some reuse is instrumentation-layer recurrence

### 5. Variation-family grouping is implicit

Current problem:

- we have edges
- we do not yet have a higher-level family object that groups related seeds and derivatives

### 6. No generation-stage tags

Current problem:

- the export does not say which function stage produced each node

## Suggested Next Build

The next implementation step should be to extend the exporter with these first-pass fields:

```json
{
  "primitiveType": "section_container | subsection_container | leaf_pattern",
  "containerKind": "structural | orchestration_layer | mixed",
  "sectionFamilyId": "string | null",
  "sectionFamilyMode": "new | direct_variation | skeleton_reuse | skeleton_reuse_with_modification",
  "subsectionSkeletonId": "string | null",
  "variationFamilyId": "string | null"
}
```

That is the minimum data needed to make the complete pipeline executable rather than only descriptive.

## Immediate Conclusion

Yes, the pipeline can now be described concretely enough to create multiple songs from a root node.

But the current architecture is still missing the exact fields that would let it do so cleanly.

The most important missing layer is:

- section family identity
- subsection skeleton identity
- variation-family identity

Once those are added, the project can move from:

- structural analysis of labeled songs

to:

- actual generation-oriented graph construction from `complete_song`
