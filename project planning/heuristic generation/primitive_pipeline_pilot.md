# Primitive Pipeline Pilot

## Scope

This is the first primitive-and-pipeline experiment run against the strongest four review songs:

- `MMX Boomer Kuwanger Stage`
- `MMX Armored Armadillo Stage`
- `MMX Storm Eagle`
- `MMX Flame Mammoth Stage`

The goal is to test whether a single `complete song` node can be conceptually transformed into each labeled song shape through an ordered chain of functions.

This is a pilot, not a final theorem. It is meant to show:

- which primitive families already appear stable
- which function stages look universal
- which steps remain ambiguous because current semantics are still weak

## Pilot Result

The current corpus supports a consistent high-level pipeline:

1. instantiate `complete_song`
2. decompose into ordered top-level sections
3. decompose each section into role or layer containers
4. recurse into those containers until leaf patterns are reached
5. classify each leaf or sub-container as:
   - new material
   - repetition
   - variation
   - rhythmic variation
   - simplification
   - provisional canonical reuse
6. assemble the final song graph

That pipeline is already visible across all four pilot songs.

## Primitive Families Confirmed By The Pilot

### Stable structural primitives

- `complete_song`
- `section_container`
- `layer_container`
- `leaf_pattern`

### Stable lineage primitives

- `new_material`
- `repetition`
- `variation`
- `rhythmic_variation`
- `simplification`

### Provisional lineage primitive

- `canonical_reuse`
  - visible in the export
  - not yet trustworthy enough to treat as final canonical identity

### Stable grouping primitive

- `ordered_sequence`

This is important: the strongest pilot result is not just that patterns exist. It is that songs already appear to be generated through ordered recursive containment.

## Shared Pipeline Across The Four Songs

The strongest shared function chain is:

1. `instantiate_complete_song`
2. `decompose_song_root_into_sections`
3. `decompose_section_into_layers`
4. `expand_layers_or_subphrases_recursively`
5. `introduce_new_material`
6. `restate_or_vary_existing_material`
7. `apply_rhythmic_or_simplification_transforms_when_present`
8. `assemble_song_from_ordered_instances`

This is the first function chain that looks robust enough to keep as a North Star experiment.

## Song Findings

### MMX Boomer Kuwanger Stage

Top-level shape:

- `Whole song`
- `Drop In`
- `Part A`
- `Part B`
- `Part C`
- `Part D`

Observed pattern:

- begins with a small intro container
- expands into a sequence of larger sections
- each section decomposes into layer-style containers like:
  - `Drums`
  - `Synth Bass 1`
  - `Lead 2 (sawtooth)`
  - `Pad 3 (polysynth)`
  - `Orchestra Hit`
  - `String Ensemble 1`

Material profile:

- `84` repetition
- `50` variation
- `9` rhythmic variation
- `7` canonical reuse

Interpretation:

- this song strongly supports a pipeline where sections are built by reusing and varying layer-level material inside a stable ordered section sequence
- it is one of the clearest examples of `decompose section -> reuse layers -> vary leaves`

### MMX Armored Armadillo Stage

Top-level shape:

- `Whole song`
- `Part A`
- `Part B`
- `Part C`
- `Part D`

Observed pattern:

- clean four-section top-level decomposition
- each section breaks into role-heavy containers such as:
  - `Percussion`
  - `Synth Brass Rolling Lead`
  - `Synth Brass Support`
  - `Synth Brass Lead`
  - `Pad 3 (polysynth)`
  - `Electric Bass (finger)`

Material profile:

- `52` repetition
- `25` variation
- `6` rhythmic variation
- `6` canonical reuse

Interpretation:

- this song strongly supports `decompose section into orchestrated layers`
- the pipeline here looks more role- and arrangement-oriented than motif-oriented at the intermediate level
- it is a strong candidate for testing the difference between structural reuse and orchestration-layer reuse

### MMX Storm Eagle

Top-level shape:

- `Whole song`
- `Drop In`
- `Part A`
- `Part B`
- `Part C`

Observed pattern:

- intro plus three major sections
- sections decompose into containers such as:
  - `Drums`
  - `String Ensemble 1`
  - `Electric Guitar (jazz)`
  - `Slap Bass 2`
  - `Distortion Guitar`
  - `Trill Hold Descent`

Material profile:

- `59` repetition
- `27` variation
- `7` rhythmic variation
- `6` canonical reuse

Interpretation:

- this song strongly supports a hybrid pipeline:
  - section decomposition
  - layer decomposition
  - motif-level restatement inside those layers
- among the four pilots, this is one of the strongest cases for nested transform behavior below the section level

### MMX Flame Mammoth Stage

Top-level shape:

- `Whole song`
- `DropIn`
- `Part A`
- `Part B`
- `Part C`

Observed pattern:

- intro section immediately foregrounds thematic derivation:
  - `Theme A`
  - `Theme A'`
  - `Theme A''`
- later sections decompose into layer and role containers such as:
  - `Drum A`
  - `Cymbal A`
  - `String A`
  - `Back Guitar A`
  - `Bass A`
  - `Lead B`
  - `Lead C`

Material profile:

- `21` variation
- `20` repetition
- `6` simplification
- `2` rhythmic variation
- `0` canonical reuse

Interpretation:

- this is the strongest pilot for explicit transform-driven generation
- unlike the other songs, it shows a clearer pipeline of:
  - introduce theme
  - derive theme variants
  - simplify selected material later
- it is the best current song for testing transform functions beyond plain repetition

## Cross-Song Primitive Conclusions

Across the four pilots, the most defensible primitive stack is:

1. `complete_song`
2. `section_container`
3. `layer_container`
4. `leaf_pattern`
5. lineage tags on leaves and sub-containers

This is important because it suggests the generation pipeline should not jump directly from song sections to note-level material.

There is an intermediate layer that matters:

- orchestration or role containers
- subphrase containers
- locally transformed leaves

## Cross-Song Function Conclusions

### Likely universal functions

- instantiate root
- decompose root into ordered sections
- decompose section into role or layer containers
- recurse until leaf patterns are reached
- introduce new material
- restate prior material
- apply labeled variation where present
- assemble ordered output

### Likely conditional functions

- apply rhythmic variation
- apply simplification
- promote a layer container into a major structural driver
- infer canonical reuse when not explicitly labeled

## Where The Pilot Still Breaks

### 1. `canonical_reuse` is still provisional

The role appears in the stronger songs, but it is not yet reliable enough to use as a final primitive without review.

### 2. Layer containers are doing double duty

Some containers look like:

- true structural subphrases

Others look like:

- orchestration tracks or texture layers

The generator will eventually need to distinguish those two cases more clearly.

### 3. Primitive tagging is still implicit

The export shows enough structure to infer primitives, but those primitive tags are not yet explicit in the schema.

## Immediate Implication For The Generation Pipeline

The best current hypothetical pipeline is no longer:

- `complete song -> sections -> final song`

It is:

- `complete song -> ordered sections -> layer or subphrase containers -> transformed leaves -> assembled song`

That intermediate container stage is now one of the clearest findings from the pilot.

## Recommended Next Step

Expand this same experiment to the rest of the useful labeled corpus, but keep two review questions explicit:

1. is a given container structurally meaningful or mostly orchestration-layer grouping
2. is a given reuse case true canonical reuse or only repeated instrumentation

If that broader corpus pass preserves the same pipeline shape, then the project can move toward:

- explicit primitive tagging in the export
- explicit generation-stage function tags
- heuristic extraction from repeated function chains

## Immediate Conclusion

The pilot succeeded.

The labeled songs already support a plausible generation pipeline from a single `complete song` node to final song shape.

The strongest currently supported abstraction is:

- recursive ordered decomposition
- through section containers
- through layer or subphrase containers
- into leaves that are new, repeated, varied, rhythmically varied, or simplified

That is a much stronger bridge to future song generation than pattern browsing alone.
