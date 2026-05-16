# Complete Generation Pipeline Analysis

## Purpose

This note corrects the main gap in the earlier pilot:

the important unit is not only `section -> leaf`.

The useful labeled corpus shows a stronger and more specific structure:

- `complete song`
- ordered sections
- subsection or layer skeletons inside those sections
- variation and repetition families inside those subsection skeletons
- final leaf realization

So the complete pipeline must explain:

1. how a song divides into sections
2. how sections divide into subsection families
3. how those subsection families repeat, vary, or simplify across sections
4. how leaf material is finally resolved inside those families

## Corpus-Wide Structural Findings

Useful labeled corpus:

- `10` songs
- `44` top-level sections
- `238` depth-2 nodes
- `414` depth-3 nodes
- `121` depth-4 nodes
- `6` depth-5 nodes

This is already enough to describe a complete structural pipeline.

### Key finding 1: section variation is rare

Direct section-level variants are rare:

- `2` section-level variants total

They appear in:

- `MMX String Chameleon`
  - `Part A (Anthem)'` as a variation of `Part A (Anthem)`
- `SNES_MMX_Boss_Chosen_V1.mid`
  - `Intro'` as a variation of `Intro`

### Key finding 2: subsection and deeper variation is the norm

Variant relationships are concentrated below the section level:

- `24` subsection-level variants at depth `2`
- `397` deeper variants below that level

That means the corpus is telling us something important:

- songs usually do not vary by replacing entire sections wholesale
- songs usually vary by keeping the section shell and transforming subsection families inside it

### Key finding 3: top-level sections are usually new structure

At depth `1`:

- `42` nodes are `new_material`
- `2` nodes are `variation`

So the top-level song pipeline is usually:

- create a new ordered section plan

Then variation starts to matter after section decomposition, not before it.

### Key finding 4: deeper levels carry the real transform work

At depth `3`:

- `184` repetition
- `100` variation
- `23` rhythmic variation

At depth `4`:

- `48` repetition
- `32` variation
- `7` rhythmic variation
- `3` simplification

This is the strongest single result in the corpus:

- the real transform engine is happening inside subsection families, not at the section boundary

## Section -> Subsection -> Variation Model

The complete pipeline should therefore be modeled as:

1. generate ordered section plan
2. assign a subsection skeleton to each section
3. decide whether the section:
   - introduces a new subsection skeleton
   - reuses a prior subsection skeleton
   - partially modifies a prior subsection skeleton
   - acts as a direct section-level variation
4. inside each subsection family:
   - introduce seed material
   - repeat prior material
   - vary prior material
   - apply rhythmic variation
   - apply simplification
5. recurse until leaf material is resolved

This is the missing center of the generation pipeline.

## Section Skeleton Reuse Across Songs

Many songs show repeated subsection skeletons across multiple sibling sections.

This is strong evidence that section generation is often:

- not "make a whole new section from scratch"
- but "reuse a subsection layout, then change what happens inside it"

### Examples

#### MMX Storm Eagle

Sections `Part A`, `Part B`, and `Part C` all share a strong subsection skeleton built from:

- `Drums`
- `Distortion Guitar`
- `String Ensemble 1`
- `Electric Guitar (jazz)`
- `Slap Bass 2`

The section is new at the top level, but much of its subsection scaffold is persistent.

#### MMX Boomer Kuwanger Stage

Sections repeatedly reuse large pieces of the same subsection scaffold:

- `Drums`
- `Synth Bass 1`
- `Lead 2 (sawtooth)`
- `Pad 3 (polysynth)`
- `Orchestra Hit`
- `Synth Strings 2`

The song grows by extending and swapping subsection families across sections, not by replacing the whole section grammar.

#### MMX Chill Penguin

Sections `Part A`, `Part B`, `Part C`, and `Part D` strongly preserve the same subsection family set:

- `Drums`
- `Synth Bass 2`
- `Percussive Organ`
- `Synth Brass 2`
- `Synth Strings 1`
- `Melodic Tom`
- `Reverse Cymbal`

Then later sections add or emphasize:

- `Lead 2 (sawtooth)`

This looks like section evolution through persistent subsection skeleton plus targeted additions.

#### SNES_MMX_Boss_Chosen_V1.mid

All four top-level sections share essentially the same subsection skeleton:

- `Drums`
- `Brass Section`
- `Overdriven Guitar`
- `Slap Bass 2`

This is one of the clearest cases where the song-level pipeline appears to be:

- instantiate one section family
- derive successive section realizations from that same subsection scaffold

## Song-Level Pipeline Archetypes

The full useful corpus suggests at least three pipeline archetypes.

### Archetype 1: section skeleton persistence

A song first creates a section family, then reuses its subsection skeleton repeatedly across later sections.

Strong examples:

- `MMX Storm Eagle`
- `MMX Chill Penguin`
- `MMX Spark Mandrill`
- `SNES_MMX_Boss_Chosen_V1.mid`

### Archetype 2: layered section growth

A song keeps a partial subsection scaffold, then adds or swaps layers as sections intensify or expand.

Strong examples:

- `MMX Boomer Kuwanger Stage`
- `Launch Octopus`
- `MMX Armored Armadillo Stage`

### Archetype 3: explicit thematic derivation inside the opening section

A song introduces a theme family, then immediately derives variants before larger section growth proceeds.

Strong example:

- `MMX Flame Mammoth Stage`

Its `DropIn` already contains:

- `Theme A`
- `Theme A'`
- `Theme A''`

So the pipeline here begins with:

- instantiate section
- instantiate theme seed
- derive theme variants

before moving into broader section layering.

## Complete Hypothetical Pipeline

The most complete current pipeline is:

1. `instantiate_complete_song`
   - create the root node

2. `choose_section_order_template`
   - decide ordered high-level sections such as:
     - drop in
     - part a
     - part b
     - transition
     - climax
     - return

3. `instantiate_section_nodes`
   - create top-level sections
   - in the current corpus, these are usually `new_material`

4. `assign_section_family_mode`
   - for each section, decide whether it is:
     - a new section family
     - a direct section variation
     - a return or derived form of a prior section family

5. `decompose_section_into_subsection_skeleton`
   - expand the section into role or layer containers
   - this is the most important missing step from the earlier pilot

6. `choose_subsection_strategy`
   - for each subsection in that skeleton, decide whether it is:
     - new material
     - canonical reuse candidate
     - repetition
     - variation
     - rhythmic variation
     - simplification
     - another recursive container

7. `propagate_or_modify_subsection_families_across_sections`
   - preserve stable subsection skeletons where the song does so
   - add, remove, or swap subsection families where the song changes intensity or function

8. `recurse_into_subsection_family`
   - once inside a subsection family, create seed material and its derived leaves

9. `resolve_leaf_transform_chain`
   - apply:
     - repetition
     - variation
     - rhythmic variation
     - simplification

10. `resolve_orchestration_and_layer_roles`
    - determine whether a container is:
      - true structural subphrase
      - orchestration layer
      - both

11. `assemble_final_song_graph`
    - recombine all sections, subsection families, and leaves into final ordered form

## What The Pipeline Must Explicitly Represent

For this pipeline to become operational, the export and schema need to represent:

- top-level section ordering
- section family identity
- subsection skeleton identity
- whether a section reuses a prior subsection skeleton
- whether a subsection is a seed or derivative
- whether variation occurs:
  - at section level
  - at subsection level
  - at leaf level
- whether a container is structural, orchestration-oriented, or mixed

Without that, the generator will miss the real organizing principle in the corpus.

## Per-Song Interpretation

### Launch Octopus

Pipeline interpretation:

- create section plan
- reuse a persistent subsection scaffold
- add or remove a few subsection families per section
- preserve strong recurrence of:
  - `Drums`
  - `Orchestra Hit`
  - `Slap Bass 1`
  - `Brass Section`
  - `Vibraphone`

### MMX Armored Armadillo Stage

Pipeline interpretation:

- create section plan
- generate orchestrated subsection skeletons
- preserve stable support layers across sections
- swap lead-oriented subsection families between sections

### MMX Boomer Kuwanger Stage

Pipeline interpretation:

- create intro plus multi-part form
- preserve recurring subsection families across sections
- deepen variation and repetition mostly below the subsection level

### MMX Chill Penguin

Pipeline interpretation:

- create atmospheric section skeleton
- preserve it almost intact across later sections
- introduce lead material later without replacing the full subsection scaffold

### MMX Flame Mammoth Stage

Pipeline interpretation:

- start with explicit theme family derivation inside the opening section
- then branch into section-specific subsection skeletons
- use later simplification as a genuine transform stage

### MMX Introduction Stage

Pipeline interpretation:

- create a straightforward multi-section form
- each section has a strongly role-based subsection skeleton
- deeper repetition and variation happen inside those families

### MMX Spark Mandrill

Pipeline interpretation:

- create a stable subsection scaffold
- reuse it aggressively across build, anthem, climax, and descent sections

### MMX Storm Eagle

Pipeline interpretation:

- create intro plus multi-part form
- keep a stable subsection skeleton across A/B/C
- drive change mainly through internal leaf-level repetition and variation

### MMX String Chameleon

Pipeline interpretation:

- one of the few songs with true section-level variation
- section variation still preserves a nearly identical subsection skeleton underneath
- this is a direct argument for modeling section-family and subsection-skeleton separately

### SNES_MMX_Boss_Chosen_V1.mid

Pipeline interpretation:

- direct section-level variation exists
- but all top-level sections still share the same subsection skeleton
- this is the strongest evidence that section variation and subsection persistence are separate concerns

## Universal Vs Conditional Functions

### Likely universal

- instantiate root
- choose ordered section plan
- instantiate sections
- decompose sections into subsection skeletons
- recurse into subsection families
- realize leaf transforms
- assemble final graph

### Likely conditional

- direct section-level variation
- simplification
- rhythmic variation
- explicit canonical reuse beyond labeled derivation
- thematic derivation inside the opening section
- subsection family insertion or removal for climactic growth

## The Main Correction To The Earlier Pilot

The earlier pilot was directionally correct, but incomplete.

The missing core point was:

- the generation pipeline must model how subsections divide sections and how variation families live inside those subsection divisions

The corpus does not primarily behave like:

- `song -> sections -> leaves`

It behaves much more like:

- `song -> sections -> subsection skeletons -> variation families -> leaves`

That is the correct complete pipeline direction from the current labels.

## Recommended Next Step

The next build step should not just be "more analysis."

It should be to make this pipeline explicit in the export:

- add first-pass tags for:
  - `section_container`
  - `subsection_container`
  - `leaf_pattern`
- add section family identifiers
- add subsection skeleton identifiers
- add a field that says whether a section:
  - introduces a new subsection skeleton
  - reuses one
  - varies one
- add a field that says whether a container is:
  - structural
  - orchestration-layer
  - mixed

## Immediate Conclusion

Yes, the missing most important thing was the section-to-subsection split and the way variation lives inside it.

The full useful corpus now supports a stronger complete generation pipeline:

- `complete song`
- ordered sections
- reusable subsection skeletons
- nested variation families
- resolved leaves
- final assembled song

That is the right pipeline to use as the bridge from labeled songs to future song generation.
