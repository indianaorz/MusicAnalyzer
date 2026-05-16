# North Star

Build a structure-aware music corpus from the existing manually labeled songs so the system can treat songs as graphs of reusable patterns, sub-patterns, collections, repetitions, and variations.

The corpus must preserve authored structure first, normalize it second, analyze transformations third, and support generation only after the structure and lineage are trustworthy.

The key generation target is recursive decomposition: at the `whole song` level, the system must be able to break a song node into ordered child structure, determine whether each child is new material, a repetition, a variation, a reused canonical pattern, or a collection/container, and continue decomposing until leaf musical material is reached.

The current corpus suggests that this decomposition is not usually just `song -> sections -> leaves`.

The stronger target is:

- `complete song`
- ordered sections
- section purpose
- subsection or layer skeletons inside sections
- reduction lineage from section to instrument slice to motif slice
- variation and repetition families inside those subsection skeletons
- final leaf realization

Generation alignment also requires two additional pieces:

- a clear inventory of the musical and structural `primitives` songs are built from
- a hypothetical generation pipeline that can start from a single `complete song` node and describe the functions needed to arrive at final material

## What Success Looks Like

- every labeled song can be represented as a graph of nodes and sub-nodes
- a pattern can exist on its own without requiring an `input` / `output` training pair
- parent patterns can contain child patterns
- canonical patterns, repetitions, and variations are explicitly linked
- collections of related patterns are first-class entities
- normalized representations preserve source provenance and structural meaning
- the UI lets us inspect raw structure, normalized structure, and lineage without ambiguity
- a whole song can be represented as a recursive structural plan, not just a flat list of labeled patterns
- the recursive plan distinguishes sections from subsection skeletons
- the recursive plan can distinguish section purpose such as intro, main theme, build, break down, climax, and return
- canonical pattern identity is distinct from in-song pattern occurrence or instance
- relationships on edges are explicit enough to drive later generation decisions
- the corpus can describe the primitive building blocks that songs are actually composed from
- the project can express a plausible function pipeline from `complete song` to final resolved structure
- the project can express raw section assets and reduction lineage, not just final graph shape
- later generation work is derived from this structure instead of replacing it

## Order Of Operations

1. preserve raw authored structure
2. audit and formalize the source contract
3. define normalized structural entities
4. backfill normalized records from existing songs
5. browse and validate canonical patterns, child patterns, collections, and relationships
6. represent songs as ordered recursive decomposition plans
7. identify the primitives those plans are built from
8. analyze musical transforms between related patterns
9. define and test the hypothetical generation pipeline
10. extract heuristics for generation

## Anti-Drift Rules

- do not collapse the project into only `input` / `output` example exports
- do not treat Epicify-style training pairs as the primary source model
- do not skip hierarchical structure just because flat exports are easier to display
- do not confuse a useful browser with a generation-ready structural contract
- do not infer whole-song generation logic until container decomposition and instance semantics are explicit
- do not infer generation heuristics before canonical structure and lineage are validated
- do not talk about generation pipelines without identifying the primitive building blocks they operate on
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

In parallel with that work, the project needs to answer two North Star questions:

- what are the smallest useful primitives that recur across labeled songs
- what ordered function pipeline would transform a single `complete song` node into a final song-shaped graph

The latest corpus analysis suggests a third concrete requirement:

- how sections divide into reusable subsection skeletons, and how variation families live inside those skeletons

The song-specific analysis notes suggest a fourth requirement:

- how authored composition thinking maps onto the pipeline through concepts like `Song > Ideas > Patterns`, loop vs fill, call vs response, motif seed vs variation, and section asset manifests

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

Likely primitive families the corpus should eventually distinguish include:

- structural primitives
  - song root
  - section container
  - section purpose
  - phrase container
  - leaf pattern
- lineage primitives
  - new material
  - canonical reuse
  - repetition
  - variation
  - rhythmic variation
  - simplification
- grouping primitives
  - collection
  - sibling set
  - ordered sequence
  - call response group
- musical-role primitives
  - lead
  - bass
  - support or chord layer
  - pad
  - percussion
  - accent or hit layer
- transformation primitives
  - transpose
  - ornament
  - densify
  - simplify
  - extend
  - contract
  - orchestrate
  - register shift

Likely pipeline metadata the corpus should eventually distinguish include:

- `sectionPurpose`
  - intro
  - main_theme
  - build_up
  - break_down
  - climax
  - return
- `subsectionFunction`
  - loop
  - fill
  - call
  - response
  - motif_seed
  - motif_variation
- `loopPolicy`
  - play_once
  - loop
  - loop_with_fill
- `assetManifest`
  - which instrument roles and pattern assets are required to realize a section
- `reductionLineage`
  - section
  - instrument slice
  - motif slice

The eventual generation pipeline should be expressible as a function chain such as:

1. `instantiate_complete_song`
2. `decompose_song_root`
3. `expand_containers_recursively`
4. `assign_material_roles`
5. `choose_new_vs_reuse_vs_variation`
6. `instantiate_or_transform_canonical_material`
7. `resolve_orchestration_roles`
8. `resolve_leaf musical content`
9. `assemble_final_song`

The project should test that hypothetical pipeline against all sufficiently labeled songs by asking:

- if we start from one `complete song` node, what functions would have to fire, in what order, to recreate the labeled song shape
- which functions are universal across songs
- which functions are conditional on song type or local context

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
