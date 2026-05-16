# Mega Man X2 - Magna Centipede Labeling Notes

## Overall Shape

This labeling pass treats the song as four 31-bar cycles plus a short tail:

- `Opening Cycle` = bars 0-30
- `Loop Cycle A` = bars 31-61
- `Loop Cycle B` = bars 62-92
- `Loop Cycle B` repeat = bars 93-123
- `Tail` = final partial ending after bar 124

The important structural discovery was that most tracks repeat the same 31-bar cycle exactly, while the bass and drums only change in the intro portion of some cycles.

## Why `Loop Cycle A` Is Canonical

`Loop Cycle A` was chosen as the canonical cycle because:

- it contains the stable repeating version of the full groove
- the `Opening Cycle` has an intro-specific bass and drum setup
- `Loop Cycle B` differs mainly in its intro treatment, not in the whole cycle identity
- the fourth large cycle is a straight repetition of `Loop Cycle B`

So the lineage is:

- `Opening Cycle` = variation of `Loop Cycle A`
- `Loop Cycle B` = variation of `Loop Cycle A`
- final `Loop Cycle B` = repetition of `Loop Cycle B`

## Role Map

Instrument groups used in the labeled JSON:

- `[0,1]` = bass pulse pair
- `[2,3]` = lower rhythm guitar pair
- `[4,5]` = high hook lead pair
- `[6]` = pad / chord stab layer
- `[7,8]` = higher guitar layer
- `[9,10]` = drums and percussion accents

## Canonical Internal Breakdown

Inside `Loop Cycle A`, the song is treated as five internal functions:

- intro = first 4 bars
- main hook = next 8 bars
- hook variation = next 8 bars
- turnaround = next 7 bars
- reset break = next 4 bars

Those sub-functions are represented mainly inside the role containers rather than as separate timeline containers at the cycle root.

## Pattern Rationale

### Drums A

- `Drum Intro` establishes the cycle entrance
- `Main Groove` is the core loop identity
- `Main Groove'` keeps the family identity but changes the second span enough to count as variation
- `Turnaround Fill` is the densest connective span before the reset
- `Reset Groove` is the sparse bar group that clears space before the next cycle

### Bass Pulse A

- `Bass Intro Pulse` is separated because the cycle entrance behaves differently from the hook body
- `Bass Hook Pulse` is the core ostinato identity
- `Bass Hook Pulse'` is treated as a variation because the rhythmic family stays stable while the pitch path changes
- `Bass Turnaround` is its own unit because it stops behaving like the earlier hook loop
- `Bass Reset` is the held return point before the next cycle

### Low Rhythm Guitar A

- `Riff A` is the main lower-register riff identity
- `Riff A'` is a direct continuation family rather than completely new material
- `Turnaround Stack` is where the layer stops functioning like the earlier riff and becomes connective harmonic material

### High Guitar Layer A

- `High Riff A` is the brighter companion to the lower riff layer
- `High Riff A'` is the altered restatement of that same idea
- `Climb Leadout` is the higher-energy exit from the loop body into the reset

### Hook Lead A

- the hook lead does not enter until the main hook span
- `Hook Lead Phrase A` is the first stable statement
- `Hook Lead Phrase A'` keeps the same family identity but changes contour enough to treat it as variation

### Pad Stabs A

- `Pad Intro Stabs` covers the opening harmonic punctuations
- `Pad Hook Stabs` is the more stable recurring support role
- `Pad Hook Stabs'` is a variation / climb response rather than a separate unrelated pattern
- `Pad Reset Stab` is isolated because it works like a reset marker more than an ongoing loop

## Confidence Notes

High confidence:

- the 31-bar cycle structure
- the four-cycle large form
- the canonical choice of `Loop Cycle A`
- the repeat / variation relationships between the large cycles
- the role grouping by instrument index

Medium confidence:

- the exact internal naming of the riff families
- labeling the second hook spans as variations instead of distinct new themes
- calling the final dense span a `Turnaround`

## Next Good Refinement

If you want to push this further, the best next pass would be:

1. inspect `Loop Cycle A` in the piano roll
2. tighten exact motif boundaries inside the guitar and hook lead layers
3. decide whether some current variation labels should split into new canonical motifs
4. mirror the internal child structure into `Opening Cycle` and `Loop Cycle B` if you want full per-cycle browseability instead of top-level lineage only
