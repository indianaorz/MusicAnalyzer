# North Star

Build a structure-aware music corpus from the existing manually labeled songs so the system can treat songs as graphs of reusable patterns, sub-patterns, collections, repetitions, and variations.

The corpus must preserve authored structure first, normalize it second, analyze transformations third, and support generation only after the structure and lineage are trustworthy.

The key generation target is recursive decomposition: at the `whole song` level, the system must be able to break a song node into ordered child structure, determine whether each child is new material, a repetition, a variation, a reused canonical pattern, or a collection/container, and continue decomposing until leaf musical material is reached.

## What Success Looks Like

- every labeled song can be represented as a graph of nodes and sub-nodes
- a pattern can exist on its own without requiring an `input` / `output` training pair
- parent patterns can contain child patterns
- canonical patterns, repetitions, and variations are explicitly linked
- collections of related patterns are first-class entities
- normalized representations preserve source provenance and structural meaning
- the UI lets us inspect raw structure, normalized structure, and lineage without ambiguity
- a whole song can be represented as a recursive structural plan, not just a flat list of labeled patterns
- canonical pattern identity is distinct from in-song pattern occurrence or instance
- relationships on edges are explicit enough to drive later generation decisions
- later generation work is derived from this structure instead of replacing it

## Order Of Operations

1. preserve raw authored structure
2. audit and formalize the source contract
3. define normalized structural entities
4. backfill normalized records from existing songs
5. browse and validate canonical patterns, child patterns, collections, and relationships
6. represent songs as ordered recursive decomposition plans
7. analyze musical transforms between related patterns
8. extract heuristics for generation

## Anti-Drift Rules

- do not collapse the project into only `input` / `output` example exports
- do not treat Epicify-style training pairs as the primary source model
- do not skip hierarchical structure just because flat exports are easier to display
- do not confuse a useful browser with a generation-ready structural contract
- do not infer whole-song generation logic until container decomposition and instance semantics are explicit
- do not infer generation heuristics before canonical structure and lineage are validated
- do not optimize the UI around rendered examples if it hides the underlying pattern graph

## Current Priority

Current priority is to expose and validate the raw structural source:

- songs
- patterns
- child patterns
- collections
- repetitions
- variations
- structural lineage

The immediate goal is not generation. The immediate goal is a correct structural corpus that generation can later depend on.

## Current Checkpoint

The current exporter and browser work is valid prerequisite infrastructure, but it is not the end goal.

What is established:

- raw authored structure can be exported from `user_settings/`
- songs, patterns, collections, and relationships can be inspected in a dedicated heuristic view
- the project is no longer anchored to Epicify-style examples as the primary model

What is still missing before generation alignment is strong:

- a locked normalized schema
- explicit distinction between canonical patterns and pattern instances
- ordered child-instance decomposition for container patterns
- edge semantics that explain whether a child is new, repeated, varied, simplified, or recursively decomposed

## Next Aligned Move

The next aligned step is to formalize recursive whole-song decomposition.

At `whole song` scale, the system needs to answer:

- what are the ordered child nodes of this container
- which children are canonical instantiations versus in-song instances
- which children restate previous material
- which children vary previous material
- which children must be recursively decomposed further

Only after that contract is explicit should the project move into heuristic extraction for full-song generation.

## Heuristic Direction

Once structure and decomposition are trustworthy, likely heuristic families include:

- `decompose_container(pattern)`
- `choose_next_section(previous, context)`
- `instantiate_canonical(pattern_id, local_context)`
- `vary_pattern(pattern_id, variation_type)`
- `recurse_collection(collection_id)`
- `restatement_strategy(section_a, section_b)`
- `phrase_expansion_or_contraction(pattern)`
- `orchestration_shift(pattern, target_role_layout)`

The currently best-supported heuristic families from existing labels are:

- containment and recursive decomposition
- repetition
- variation
- rhythmic variation
- simplification
- instrument membership and structural span

The following are not yet grounded enough and depend on normalization:

- tonal heuristics
- harmonic-function heuristics
- cadence heuristics
- energy-curve heuristics
