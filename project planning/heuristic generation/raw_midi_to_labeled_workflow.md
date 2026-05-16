# Raw MIDI To Labeled Workflow

## North Star

Turn a raw imported MIDI state into a structure-aware song graph that preserves authored composition thinking:

- whole song
- ordered sections
- section purpose
- instrument-role layers inside sections
- motif-level decomposition
- explicit repetition and variation lineage

The target is not just "tag some clips." The target is a labeled graph that can answer how the song is built.

## Intend

This guide describes how to go from a raw file like `user_settings/MegaManX2_MagnaCentipede.mid.json` to a fully labeled file shaped like `user_settings/IntroductionStage.mid.json`.

Right now `MegaManX2_MagnaCentipede.mid.json` is effectively a raw import stub:

- it has a `root` pattern
- it has no section children
- it has no instrument-layer decomposition
- it has no repeat or variation lineage

That makes it a good example of the exact "before" state this workflow is meant to fix.

## What "Done" Looks Like

A fully labeled output should look like `IntroductionStage.mid.json` in spirit:

- `root` contains ordered top-level song sections
- each section contains instrument-role containers such as drums, bass, lead, brass, strings, ambience
- each layer is further broken into motifs, loops, fills, phrase units, or sectional sub-parts
- repeated material is marked with `isRepetition`
- changed restatements are marked with `isVariation`
- rhythm-specific restatements can also use `isRhythmicVariation`
- `variantOf` and `variantOfName` point back to the canonical source
- names explain function, not just location

## The Contract We Are Targeting

The current labeled JSON contract is pattern-centered. Each node typically has:

- `id`
- `name`
- `parentId`
- `range`
- `children`
- `instruments`
- optional `isRepetition`
- optional `isVariation`
- optional `isRhythmicVariation`
- optional `variantOf`
- optional `variantOfName`

The important thing is that the tree captures both containment and lineage.

## Core Principle

Label from large to small:

1. whole-song timeline
2. section containers
3. instrument-role layers inside sections
4. phrase or motif units inside each layer
5. lineage links between repeated or varied material

Do not start by naming tiny fragments everywhere. First stabilize the big shape.

## Recommended Agentic Process

### Step 1: Normalize The Raw Import

Input example: `MegaManX2_MagnaCentipede.mid.json`

Expected starting condition:

- only `root` exists
- `root.children` is empty
- title or metadata may be wrong or placeholder

Actions:

1. Fix top-level metadata first.
2. Confirm the title is the actual song title.
3. Confirm the detected scale and harmony flags are reasonable enough to work with.
4. Treat the imported file as source material, not as already meaningful structure.

Minimum output after this step:

- valid song title
- valid `root`
- confidence that tick ranges and instrument indexes are usable

### Step 2: Find Top-Level Sections

The first serious decomposition should usually be section-level.

Best cues for finding sections:

- drum groove changes
- harmonic loop changes
- density changes
- lead entrance or disappearance
- obvious build, drop, bridge, turnaround, fill, intro, outro boundaries

For Mega Man / SNES style material, drums are often the best first anchor because they reveal loop size and momentum shifts very clearly.

Create top-level children under `root` such as:

- `Intro`
- `Part A`
- `Part B`
- `Breakdown`
- `Build`
- `Climax`
- `Loop Return`

Use names that describe musical function first. `Part A` / `Part B` is acceptable when function is still uncertain, but `DropIn`, `Build`, `BreakDown`, `Main Theme`, and `Return` are better once confidence is high.

Rule:

- if a region is clearly one section with several instruments behaving together, make one parent section container before making individual instrument patterns inside it

### Step 3: Add Instrument-Role Containers Inside Each Section

Once sections are marked, split each section by musical role.

Typical role containers:

- `Drums A`
- `Bass A`
- `Lead A`
- `Strings A`
- `Brass A`
- `Pad A`
- `Ambience A`
- `Arp A`

The exact role names matter less than consistency. Prefer naming by function, not MIDI program name.

Good:

- `Lead A`
- `Bass Motif 1`
- `Drum Loop C`
- `Brass Fill`

Less good:

- `Track 4 clip`
- `Pattern 7`
- `Instrument 3`

### Step 4: Find The Canonical Unit For Each Layer

Inside each instrument-role container, ask:

- what is the smallest musically meaningful thing that repeats?
- is the layer built from bars, half-bars, two-bar loops, or phrase-length spans?
- where does the "basic version" appear first?

That first stable version should usually become the canonical source node.

Examples from `IntroductionStage.mid.json`:

- a first drum loop becomes the source, later copies become repetitions
- a first lead phrase becomes the source, later altered phrases become variations
- a brass riff can be one canonical motif even if it appears in several transformed forms

This is the most important judgment call in the whole workflow. Do not mark repetition or variation until a canonical source exists.

### Step 5: Mark Repetition vs Variation Carefully

Use this decision rule:

- `isRepetition`: same musical identity, functionally the same phrase, only restated
- `isVariation`: recognizably derived from the source but melodically, harmonically, registrally, or structurally changed
- `isRhythmicVariation`: use in addition to `isVariation` when the rhythm itself is a main part of the change

Practical test:

- If you would say "that is the same thing again," use repetition.
- If you would say "that is the same idea, but changed," use variation.
- If you would teach it as "motif 1, motif 1, motif 1', motif 1''", you are in variation territory.

Do not over-label trivial differences as variation if they are just performance noise or note-boundary mess from import.

### Step 6: Name From Function, Then Family

Use names that tell both role and lineage.

Recommended naming order:

1. section role or instrument role
2. musical function
3. family suffix if needed

Examples:

- `Lead Theme A`
- `Lead Theme A'`
- `Motif 1`
- `Motif 1'`
- `Motif Climax`
- `KickSnare Fill`
- `Brass Fill`
- `Resolution`

Use apostrophes for close family variants when the relationship is obvious and local.

Good pattern families:

- `Motif 1`
- `Motif 1'`
- `Motif 1''`

Good role families:

- `Lead A`
- `Lead B`
- `Lead C`

Use explicit names like `Fill`, `Pickup`, `Resolution`, `Climax`, `Turnaround`, `DropIn` when they communicate purpose better than numbering.

### Step 7: Build Hierarchy, Not Just Labels

A good labeled song usually needs more than one level:

- `Whole song`
- `Part A`
- `Lead A`
- `Lead Theme A`
- `Motif 1`

That is better than placing every motif directly under the root or directly under the section.

Use child patterns when the parent is genuinely a container for smaller meaningful units.

Good reasons to create a parent node:

- it spans several child phrases
- it acts like a layer within a section
- it contains a complete theme that can itself be decomposed
- it lets variations point to the right scale of source

### Step 8: Preserve Ordered Children

Child order matters.

When labeling:

- keep section children in timeline order
- keep motif children in occurrence order
- make sure parent ranges actually cover their descendants

This matters later for decomposition, browsing, and generation logic.

### Step 9: Add Analysis Comments In A Stable Way

The current JSON contract does not appear to have a dedicated `comment` field per pattern.

Because of that, the safest immediate approach is a companion Markdown file keyed by pattern ID or stable pattern name.

Recommended sidecar file shape:

`user_settings/MegaManX2_MagnaCentipede.labeling-notes.md`

Recommended entry format:

```md
## Lead Theme A

- Pattern id: `abc123`
- Range: `768-6912`
- Parent: `Lead A`
- Function: establishes the core melodic identity of section A
- Why this is canonical: first full statement of the phrase
- Evidence: later phrase repeats contour and cadence but changes register in bars 3-4
- Lineage notes: `Lead Theme A'` should point back here as a variation
```

If you do want comments inside JSON later, a future-safe field would be something like:

- `analysisComment`
- `functionComment`
- `labelRationale`

But I would not change the schema until the structural contract is more settled.

## Recommended Passes For A Raw Song

This work goes faster and cleaner if it is done in passes instead of trying to label everything at once.

### Pass 1: Skeleton Pass

Goal:

- only label `root` children
- identify major sections
- assign rough purpose

Deliverable:

- a section-only song outline

### Pass 2: Layer Pass

Goal:

- add role containers inside each section
- avoid motif micro-splitting for now

Deliverable:

- section containers with per-role layer children

### Pass 3: Canonical Pattern Pass

Goal:

- find the first stable motif or phrase in each layer
- create source patterns for those

Deliverable:

- each important layer has at least one canonical source node

### Pass 4: Lineage Pass

Goal:

- mark repetitions
- mark variations
- connect `variantOf`

Deliverable:

- explicit family relationships instead of duplicated unnamed clips

### Pass 5: Comment Pass

Goal:

- explain why a label exists
- explain why something is canonical, repeated, or varied
- note musical function in human language

Deliverable:

- sidecar notes or future comment fields for important patterns

## Specific Guidance For `MegaManX2_MagnaCentipede.mid.json`

Current state:

- the file is a raw import stub
- only `root` exists
- no authored structure has been captured yet

So the first agentic move should not be motif labeling. It should be section discovery.

Recommended sequence:

1. listen and identify the loop start and loop end
2. mark major sections under `root`
3. split each section into role containers
4. identify the primary hook layer first
5. find the smallest repeating drum or bass unit that stabilizes section identity
6. build outward from canonical units to repetitions and variations
7. add commentary notes for every canonical unit and every non-obvious variation

For a song like Magna Centipede, I would expect the first strong families to come from:

- drums
- bass ostinato or pulse layer
- main lead hook
- secondary texture or arpeggio layer
- transition or fill figures

## Worked Shape Example From `IntroductionStage.mid.json`

This is the kind of decomposition shape the agent should be trying to produce.

Top level:

- `Whole song`
- `DropIn`
- `Part A`
- `Part B`
- `Part C`

Inside `Part A`:

- `Drum A`
- `Lead A`
- `Strings A`
- `Bass A`
- `Brass A`

Inside `Lead A`:

- `Lead Theme A`
- `Lead Theme A'`
- `Motif 1`
- `Motif 1` as repetition
- `Motif 2`
- `Motif 2'` as rhythmic variation
- `Motif 3`
- `Motif 3'` as rhythmic variation

Inside `Drum A`:

- first `Drum 1` as canonical
- second `Drum 1` as repetition
- third `Drum 1` as repetition
- `Drum 1'` as variation fill ending

Inside `Bass A`:

- `Bass Motif 1`
- repeated `Bass Motif 1`
- inside the first one:
- `Pattern 1`
- repeated `Pattern 1`
- `Pattern 2`
- `Ending Pattern`

That is the important pattern:

- section container first
- role containers second
- phrase families third
- repetitions and variations attached to the first clear source

If the Magna Centipede file eventually reaches a similar shape, it is on the right track even if the exact labels differ.

## A Good Mental Model

Think in this order:

- "what sections exist?"
- "what roles make each section feel like itself?"
- "what is the first clear version of each idea?"
- "where does that idea return unchanged?"
- "where does it come back transformed?"

This tends to produce much cleaner labels than thinking:

- "what tiny clips can I cut out?"

## How To Decide Pattern Boundaries

A boundary is probably correct when most of these are true:

- it starts on a clear rhythmic grid point
- it feels complete when looped by itself
- later material obviously reuses it
- the notes inside it share one musical job
- its parent container still makes sense as a larger unit

A boundary is probably too small when:

- it cuts a phrase in half without a musical reason
- it only exists because one note differs
- it destroys obvious repeat structure

A boundary is probably too large when:

- it hides a loop-plus-fill relationship
- it merges two different jobs into one block
- later variations only apply to part of it

## Pattern Comment Checklist

For each important canonical pattern, write short notes covering:

- what role it serves
- why its boundaries are chosen here
- why this version is the source
- what later nodes repeat it
- what later nodes vary it
- whether the change is rhythmic, melodic, harmonic, registral, or orchestration-based

For each variation, write:

- what stayed the same
- what changed
- why it is still one family instead of a new pattern

## Comment Style Example

If you want comments to feel closer to the long-form analysis document, keep them short and pattern-specific.

Example:

```md
## Drum 1'

- Pattern id: `9dfd6de3-95cb-4ca4-9a30-26ee9dbcd478`
- Parent: `Drum A`
- Family: variation of `Drum 1`
- Function: closes the loop with a fill instead of another straight repetition
- Why it is a variation: the groove identity stays the same, but the ending rhythm is altered to push into the next phrase
```

Example:

```md
## Lead Theme A

- Pattern id: `fb4d36a4-cdc7-4e22-a1eb-cb136d989672`
- Parent: `Lead A`
- Function: first complete statement of the main melodic idea in section A
- Why this is canonical: later phrases clearly derive from this contour and cadence
- Follow-ups: `Lead Theme A'`, `Motif 1` family, `Motif 2` family, `Motif 3` family
```

## Suggested Template For The Agent

Use this exact framing when labeling a raw song:

```text
Input:
- raw MIDI-derived JSON with only root or minimal structure

Task:
- discover section containers
- create role containers inside each section
- identify canonical motifs and phrases
- label repetitions and variations
- add human-readable rationale notes

Output:
- fully labeled JSON in the style of IntroductionStage.mid.json
- companion Markdown notes keyed to canonical patterns and important variations
```

## Suggested Acceptance Criteria

The labeling pass is good enough when:

- every major time span belongs to a named section
- every section has its key role layers represented
- important hooks, loops, fills, and cadential figures are isolated
- repeats are not duplicated as unrelated new patterns
- variations are linked back to sources
- names make sense to a human without opening the piano roll
- another agent could continue the work without re-deciding basic structure

## Learn

The jump from `MegaManX2_MagnaCentipede.mid.json` to `IntroductionStage.mid.json` is not mainly a note-detection problem. It is a decomposition problem.

The highest-leverage workflow is:

- discover section skeleton first
- identify role containers second
- establish canonical sources third
- add repetition and variation lineage fourth
- record human rationale last

That order reduces drift and makes later automation much more realistic.

## Excess

Things to avoid during labeling:

- do not create dozens of micro-patterns before sections exist
- do not mark every small difference as a new family
- do not use generic names when function is knowable
- do not bury important lineage inside flat sibling lists
- do not mix commentary into the structure unless the schema is ready for it

Keep the graph as small and sharp as the music allows.
