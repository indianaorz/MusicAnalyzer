# Primitives And Generation Pipeline

## Purpose

This note defines a first-pass research frame for two questions:

1. what primitives the labeled songs appear to be composed from
2. what hypothetical generation pipeline would be required to transform a single `complete song` node into a final song-shaped structure

This is not a claim that the pipeline is already proven. It is a structured experiment we should run against the useful labeled corpus.

## Core Premise

If the long-term goal is complete-song generation from structure, then the corpus must eventually support a path like:

`complete song` -> ordered structural decomposition -> material decisions -> transforms -> resolved leaf material -> assembled song

To get there, we need both:

- a vocabulary of primitives
- a vocabulary of functions that operate on those primitives

## First-Pass Primitive Families

### 1. Structural primitives

These describe what kind of node something is in the song graph.

- `complete_song`
  - the root node for an entire song
- `section_container`
  - a large structural region such as an intro, main section, bridge, or return area
- `phrase_container`
  - a smaller grouped unit that still contains child structure
- `leaf_pattern`
  - a pattern that does not need further decomposition at the current level

### 2. Lineage primitives

These describe how a node relates to prior material.

- `new_material`
- `canonical_reuse`
- `repetition`
- `variation`
- `rhythmic_variation`
- `simplification`

### 3. Grouping primitives

These describe local organization.

- `collection`
- `ordered_sequence`
- `sibling_group`

### 4. Musical-role primitives

These describe what role a node seems to play musically.

- `lead`
- `bass`
- `support`
- `pad`
- `percussion`
- `accent`

### 5. Transformation primitives

These are not nodes. These are operations applied between related nodes.

- `transpose`
- `ornament`
- `densify`
- `simplify`
- `extend`
- `contract`
- `re-orchestrate`
- `register_shift`

## Hypothetical Generation Pipeline

The current best conceptual pipeline from a single `complete song` node is:

1. `instantiate_complete_song`
   - create a root node for the song to be generated
2. `decompose_song_root`
   - break the root into ordered major containers
3. `expand_containers_recursively`
   - keep decomposing containers until the next children are useful generation units
4. `classify_primitives`
   - identify what primitive each node currently represents
5. `assign_material_strategy`
   - decide whether each child is:
     - new material
     - canonical reuse
     - repetition
     - variation
     - rhythmic variation
     - simplification
     - another recursive container
6. `instantiate_or_transform_material`
   - create new canonical material or derive from earlier material
7. `resolve_grouping_and_sequence`
   - preserve collections, sibling relationships, and ordered traversal
8. `resolve_orchestration_roles`
   - assign lead, bass, support, pad, percussion, and accent roles
9. `resolve_leaf_content`
   - fill in the final leaf-level musical content
10. `assemble_final_song`
    - recombine the generated graph into a final song structure

## What The Corpus Experiment Should Ask

For each sufficiently labeled song, start from a hypothetical `complete song` node and ask:

1. what is the first ordered decomposition step
2. what containers appear next
3. which nodes introduce new material
4. which nodes restate earlier material
5. which nodes transform earlier material
6. which nodes are mostly orchestration layers rather than distinct motifs
7. what primitive type best describes each node
8. what ordered function chain would recreate the observed graph

## What Counts As A Useful Result

The experiment is useful even if the pipeline is incomplete.

Useful outputs include:

- a primitive taxonomy that covers most labeled nodes
- a function chain that explains most whole-song decompositions
- a list of universal functions that appear across many songs
- a list of conditional functions that only appear in some songs
- a list of unresolved cases where current semantics are too weak

## Likely Universal Functions

Based on the current corpus, the most likely universal function families are:

- instantiate root
- decompose ordered containers
- recurse into child containers
- introduce new material
- restate prior material
- vary prior material
- preserve ordered structure
- assemble final graph

## Likely Conditional Functions

These appear plausible, but may not be universal:

- simplify prior material
- add rhythmic variation
- split into call and answer
- extend phrase length
- contract phrase length
- re-orchestrate existing material
- shift register for lift or reduction

## Current Risk

The main risk is that we confuse:

- motif-level structural primitives

with:

- instrumentation-layer recurrence

That is why this experiment must stay tied to the stronger review songs first and must explicitly mark unresolved cases instead of forcing them into false canonical identity.

## Recommended Experiment Order

1. run the primitive and pipeline framing against the strongest four songs
2. verify where the pipeline is clean and where it breaks
3. expand the same framing to the rest of the useful labeled corpus
4. record universal vs conditional functions
5. use those results to guide later heuristic extraction

## Immediate Conclusion

Yes, this is an important experiment.

It gives the project a bridge between:

- labeled structure as a static corpus

and:

- labeled structure as an implied generation process

That bridge is necessary if the end goal is to grow complete songs from graph structure rather than merely browse annotated patterns.
