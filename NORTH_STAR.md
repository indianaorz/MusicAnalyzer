# North Star

Build a structure-aware music corpus from the existing manually labeled songs so the system can treat songs as graphs of reusable patterns, sub-patterns, collections, repetitions, and variations.

The corpus must preserve authored structure first, normalize it second, analyze transformations third, and support generation only after the structure and lineage are trustworthy.

## What Success Looks Like

- every labeled song can be represented as a graph of nodes and sub-nodes
- a pattern can exist on its own without requiring an `input` / `output` training pair
- parent patterns can contain child patterns
- canonical patterns, repetitions, and variations are explicitly linked
- collections of related patterns are first-class entities
- normalized representations preserve source provenance and structural meaning
- the UI lets us inspect raw structure, normalized structure, and lineage without ambiguity
- later generation work is derived from this structure instead of replacing it

## Order Of Operations

1. preserve raw authored structure
2. audit and formalize the source contract
3. define normalized structural entities
4. backfill normalized records from existing songs
5. browse and validate canonical patterns, child patterns, collections, and relationships
6. analyze musical transforms between related patterns
7. extract heuristics for generation

## Anti-Drift Rules

- do not collapse the project into only `input` / `output` example exports
- do not treat Epicify-style training pairs as the primary source model
- do not skip hierarchical structure just because flat exports are easier to display
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
