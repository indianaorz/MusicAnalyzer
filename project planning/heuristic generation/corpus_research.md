# Heuristic Corpus Research

## Scope

This note summarizes the current heuristic export across all songs that are substantial enough for decomposition analysis.

Operational rule for this pass:

- include songs with more than one labeled pattern
- include songs with at least one relationship or collection candidate
- exclude songs that only contain a root placeholder and no meaningful internal structure

Using that rule, the current analysis set is:

- `10` fully labeled songs
- `833` patterns
- `833` pattern instances
- `1246` relationships
- `177` collection candidates

Excluded from this pass:

- `MMX2_Flame_Stag.mid`
  - only `1` pattern
  - only root-level material
  - no decomposition or relationship signal yet

## Corpus Summary

### Per-song structure counts

| Song | Patterns | Instances | Relationships | Collections |
| --- | ---: | ---: | ---: | ---: |
| MMX Boomer Kuwanger Stage | 199 | 199 | 341 | 43 |
| MMX Armored Armadillo Stage | 148 | 148 | 230 | 28 |
| MMX Storm Eagle | 134 | 134 | 226 | 28 |
| MMX Flame Mammoth Stage | 93 | 93 | 135 | 25 |
| MMX Introduction Stage | 85 | 85 | 123 | 24 |
| MMX Chill Penguin | 51 | 51 | 52 | 7 |
| SNES_MMX_Boss_Chosen_V1.mid | 29 | 29 | 42 | 5 |
| MMX String Chameleon | 29 | 29 | 34 | 5 |
| MMX Spark Mandrill | 34 | 34 | 33 | 6 |
| Launch Octopus | 31 | 31 | 30 | 6 |

### Aggregate material-role counts

These are current `patternInstance.materialRole` counts from the exporter, excluding the root-only Flame Stag file:

| Material Role | Count |
| --- | ---: |
| `new_material` | 301 |
| `repetition` | 233 |
| `variation` | 159 |
| `canonical_reuse` | 93 |
| `rhythmic_variation` | 31 |
| `simplification` | 6 |
| `song_root` | 10 |

### Aggregate relationship-type counts

These are current pattern-level relationship counts:

| Relationship Type | Count |
| --- | ---: |
| `repetition` | 234 |
| `variation` | 189 |
| `rhythmic_variation` | 31 |
| `simplification` | 6 |

## Research Observations

### 1. The corpus supports structure-first generation research

The labeled songs are not just flat motifs. The current fully labeled set already contains:

- song-level containers
- nested child structure
- explicit variation and repetition relationships
- collection-like pattern groups
- enough depth to read a song as a recursive plan

That is enough to justify moving past a pattern browser and into generation-oriented decomposition work.

### 2. The strongest signal is still labeled restatement behavior

The most reliable generation signal still comes from explicit labels:

- `233` repetition instances
- `159` variation instances
- `31` rhythmic variation instances
- `6` simplification instances

This continues to support a generator that prioritizes:

- restatement
- controlled variation
- recursive decomposition
- occasional simplification

### 3. The strongest heuristic anchor songs have not changed

Best current anchor songs:

- `MMX Boomer Kuwanger Stage`
- `MMX Armored Armadillo Stage`
- `MMX Storm Eagle`
- `MMX Flame Mammoth Stage`

These remain the best first review set because they combine:

- deeper structure
- high relationship density
- explicit reuse labels
- more defensible whole-song decomposition signal

### 4. Canonical reuse is now detected, but it is still provisional

Current `canonical_reuse` count is now:

- `93`

That is much healthier than the earlier under-detected state, but it is not yet equivalent to true canonical musical identity.

The current inference pass is surfacing two different things:

- genuine structural reuse candidates
- repeated instrumentation-layer patterns

That means `canonical_reuse` is now useful for research, but it should still be treated as a candidate layer, not final truth.

### 5. Some songs are heavily instrumentation-layer reuse candidates

The largest boosts in inferred `canonical_reuse` appear in songs such as:

- `Launch Octopus`
- `MMX Chill Penguin`
- `MMX String Chameleon`
- `MMX Spark Mandrill`

In those songs, many reuse candidates are labels like:

- `Orchestra Hit`
- `Slap Bass 1`
- `Synth Brass 2`
- `Synth Strings 1`
- `Overdriven Guitar`

Those are valid recurring structures, but they often look more like repeated orchestration layers than motif-level canonical material.

### 6. Simplification still exists, but remains a niche signal

Simplification evidence is still minimal:

- `6` simplification relationships
- concentrated in `MMX Flame Mammoth Stage`

This means simplification should stay in the schema, but it should not drive the first heuristic family.

### 7. Pattern count and instance count are still identical

Current totals:

- `833` patterns
- `833` pattern instances

Interpretation:

- the exporter now distinguishes `pattern` and `patternInstance`
- but canonical consolidation is still provisional
- the current schema is ready for review, not yet final compression

## North Star Implications

The corpus is aligned enough to support decomposition research, but not yet aligned enough for aggressive heuristic mining.

What is now supported:

- recursive decomposition research
- whole-song planning research
- repetition / variation / rhythmic-variation analysis
- collection-aware traversal
- first-pass canonical reuse review

What is not yet strong enough:

- final canonical identity consolidation
- separation of structural reuse from instrumentation-layer reuse
- transform semantics beyond currently labeled flags
- tonal / harmonic heuristic extraction

## First Heuristic Families Supported By Current Labels

Based on the fully labeled corpus, the most defensible early heuristic families are:

- `decompose_container`
  - break a parent node into ordered child instances
- `restate_prior_material`
  - reuse previously introduced material
- `apply_variation`
  - derive a child from prior material
- `apply_rhythmic_variation`
  - preserve broader material identity while changing rhythmic realization
- `apply_simplification`
  - reduce or streamline existing material
- `recurse_song_plan`
  - continue decomposition until leaf material is reached

These are more strongly supported than:

- harmonic substitution heuristics
- key-relative transform heuristics
- cadence heuristics
- energy-curve heuristics

## Recommended Next Step

Use the strongest four songs as a decomposition semantics review set:

- `MMX Boomer Kuwanger Stage`
- `MMX Armored Armadillo Stage`
- `MMX Storm Eagle`
- `MMX Flame Mammoth Stage`

For each song:

1. review the `songPlan` top to bottom
2. confirm whether each child instance role is correct
3. separate true structural reuse from instrumentation-layer reuse candidates
4. refine exporter rules only after that review is explicit

## Immediate Conclusion

Yes, the right research move is to analyze the full fully labeled corpus, not just a single song.

The current corpus continues to show that whole-song generation should primarily be modeled as:

- recursive decomposition
- restatement of prior material
- controlled variation
- occasional simplification

The next technical step is to tighten decomposition semantics, especially around canonical reuse, before trying to mine deeper generation heuristics.
