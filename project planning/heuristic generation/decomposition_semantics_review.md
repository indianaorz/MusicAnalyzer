# Decomposition Semantics Review

## Purpose

This note captures the current state of the dedicated heuristic export after the first canonical reuse tightening pass.

The goal here is not to declare the semantics finished. The goal is to record what the exporter is doing now, what that reveals across the labeled corpus, and what needs to be refined before we treat these semantics as generator-grade.

## Current Exporter Behavior

The current heuristic exporter emits:

- `songPlan`
- `pattern`
- `patternInstance`
- `collectionCandidate`
- pattern-level `relationship`

For `patternInstance.materialRole`, the current behavior is:

- explicit labels remain authoritative:
  - `song_root`
  - `repetition`
  - `variation`
  - `rhythmic_variation`
  - `simplification`
- otherwise the exporter may infer `canonical_reuse`
- if neither explicit derivation nor inferred reuse applies, the instance is `new_material`

## Current Inferred Reuse Rule

When there is no explicit derivation label, the current exporter can infer `canonical_reuse` from a first-pass signature built from:

- normalized pattern name
- instrument set
- child count
- structural depth
- mode

It also suppresses a small generic-label set such as:

- `drums`
- `fill`
- `intro`
- `outro`
- `hats`
- `kick`
- `snare`
- `cymbal`

This is intentionally conservative, but it still captures both:

- structural reuse candidates
- instrumentation-layer repeats

## Corpus-Level Result

Across the useful labeled corpus:

- `10` songs
- `833` patterns
- `833` pattern instances
- `1246` relationships
- `177` collection candidates

Current material-role counts:

| Material Role | Count |
| --- | ---: |
| `new_material` | 301 |
| `repetition` | 233 |
| `variation` | 159 |
| `canonical_reuse` | 93 |
| `rhythmic_variation` | 31 |
| `simplification` | 6 |
| `song_root` | 10 |

Interpretation:

- explicit labeled reuse is still the most reliable signal
- inferred `canonical_reuse` is now visible enough to study
- canonical consolidation is still provisional because `patternCount == patternInstanceCount`

## Strongest Four Review Set

These remain the best songs for decomposition semantics review:

| Song | New | Canonical Reuse | Repetition | Variation | Rhythmic Var. | Simplification |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| MMX Boomer Kuwanger Stage | 48 | 7 | 84 | 50 | 9 | 0 |
| MMX Armored Armadillo Stage | 58 | 6 | 52 | 25 | 6 | 0 |
| MMX Storm Eagle | 34 | 6 | 59 | 27 | 7 | 0 |
| MMX Flame Mammoth Stage | 43 | 0 | 20 | 21 | 2 | 6 |

Why these four matter:

- they have the richest relationship density
- they have the clearest explicit reuse labels
- they are better whole-song heuristic anchors than the instrumentation-heavy songs
- `MMX Flame Mammoth Stage` is still the only strong simplification case

## Label Density Within The Strongest Four

Repeated normalized labels in the strongest four show where canonical review pressure is highest.

### MMX Boomer Kuwanger Stage

High-repeat labels include:

- `groove` (`42`)
- `atmospheric arps` (`33`)
- `loop` (`9`)
- `lead 2 sawtooth` (`8`)
- `progression` (`6`)
- `synth bass 1` (`5`)

### MMX Armored Armadillo Stage

High-repeat labels include:

- `drum kick` (`28`)
- `hats` (`14`)
- `pattern 1` (`8`)
- `chord progression` (`8`)
- `arpeggio` (`8`)
- `fill` (`7`)

### MMX Storm Eagle

High-repeat labels include:

- `ambience arp` (`28`)
- `riff` (`16`)
- `pattern` (`12`)
- `riff pattern` (`9`)
- `trill hold` (`6`)
- `distortion guitar` (`6`)

### MMX Flame Mammoth Stage

High-repeat labels include:

- `motif 1` (`12`)
- `theme a` (`8`)
- `fill` (`7`)
- `solo` (`6`)
- `main` (`6`)
- `return` (`4`)

These are exactly the places where exporter semantics need human review, because repeated labels do not automatically mean the same canonical material.

## Important Caveat: Instrumentation-Layer Reuse Is Bleeding Into Canonical Reuse

The current inferred reuse pass is strongest in songs like:

- `Launch Octopus`
- `MMX Chill Penguin`
- `MMX String Chameleon`
- `MMX Spark Mandrill`

Representative examples include repeated labels such as:

- `Orchestra Hit`
- `Slap Bass 1`
- `Brass Section`
- `Synth Brass 2`
- `Synth Strings 1`
- `Synth Bass 2`
- `Overdriven Guitar`
- `Distortion Guitar`

That tells us something useful:

- the export is finding recurring layer-level material

But it also exposes the current weakness:

- `canonical_reuse` is mixing motif-level structural identity with orchestration-level recurrence

So the current role is best interpreted as:

- `canonical_reuse_candidate`

even though the field name is still `canonical_reuse` in the export.

## What Is Trustworthy Right Now

High confidence:

- parent/child containment
- ordered decomposition
- explicit repetition
- explicit variation
- explicit rhythmic variation
- explicit simplification

Lower confidence:

- inferred canonical identity when there is no explicit derivation label
- repeated labels that name instruments rather than musical functions
- repeated labels like `pattern`, `loop`, `main`, `theme`, or `motif`

## Immediate Refinement Direction

Before mining generator heuristics any further, the exporter should be refined to separate:

1. structural canonical reuse
2. instrumentation-layer reuse
3. unresolved reuse candidates that need review

The next refinement should likely do some combination of:

- add a distinct review flag for inferred reuse
- distinguish instrument-role recurrence from motif recurrence
- prefer section-local / lineage-local reuse over corpus-wide label coincidence
- keep explicit derivation labels as the highest-authority semantics

## Immediate Conclusion

The exporter is now good enough to support decomposition review across the whole useful corpus.

It is not yet good enough to treat inferred canonical identity as final.

The right next step is not broader heuristic mining. The right next step is to review the strongest four songs in the UI and tighten the semantics so that:

- explicit labeled reuse stays intact
- structural canonical reuse becomes more defensible
- instrumentation-layer recurrence stops masquerading as final canonical identity
