# AGENTS.md

## NIMBLE Methodology

NIMBLE is a lightweight planning and execution loop for fast progress with minimal ceremony.

**NIMBLE = North Star, Intend, Model, Build, Learn, Excess**

### 1. North Star
Restate the overarching goal from `NORTH_STAR.md` to prevent drift.

### 2. Intend
Define the concrete outcome for the current cycle.

### 3. Model
Choose the best next move. Note assumptions, dependencies, risks, and candidate actions. If no decomposition is needed, say so and proceed.

### 4. Build
Execute the highest-leverage move.

### 5. Learn
Compare expected and actual results. Capture what changed.

### 6. Excess
Identify excess and compress it. Remove stale tasks, dead branches, duplicates, and excess detail.

## Learn Step Clarification

The `Learn` step is a reflection step after execution. It is not a pre-emptive planning label and it should not be filled in ahead of time as "what I expect to learn."

`Learn` only becomes valid once a build step has been executed and there is an actual result to evaluate.

### Task Giver vs Task Executor

NIMBLE often operates across a delegation boundary:

- the task giver defines the objective and evaluates the result
- the task executor performs the build work

Examples:

- when the user assigns work to the main agent, the user is the task giver and the main agent is the task executor
- when the main agent delegates work to a sub-agent, the main agent becomes the task giver and the sub-agent becomes the task executor
- when a sub-agent delegates again, that same relationship repeats recursively

### What the Learn step is for

The `Learn` step is where the task giver reflects on:

- how well the executor performed the task
- whether the output matched the intended objective
- where drift, ambiguity, or misunderstanding occurred
- whether the process, prompt phrasing, or methodology guidance should be adjusted
- what changed in the task giver's understanding after seeing the real result

This is the point where methodology updates belong if execution exposed a gap.

### What the Learn step is not

The `Learn` step is not:

- a prediction
- a placeholder
- a restatement of intent
- a pre-written guess about future insights
- something to complete before build work exists

Phrases like "what I plan to learn" are not valid uses of `Learn`.

### Correct sequence

The correct sequence is:

1. task giver sets direction
2. executor builds
3. task giver reviews the real output
4. task giver records `Learn`
5. task giver removes excess or sharpens the next move

If there is no built result yet, stay in `North Star`, `Intend`, `Model`, or `Build`. Do not jump ahead to `Learn`.

## Core Principles

- Optimize for **positional gain**, not activity.
- Prefer actions that **reduce future work**.
- Keep plans **light** and matched to current certainty.
- Use subagents for **bounded parallel work**, not uncontrolled branch explosion.
- Reflect through execution, not ceremony.
- As clarity increases, the roadmap should get **smaller and sharper**.

## Agent Behavior

When operating under NIMBLE, agents should:

1. Re-anchor themselves to the project north star.
2. Propose a clear objective for the current cycle.
3. Recommend the most leverage-bearing next move, including when no further breakdown is necessary.
4. Execute directly or delegate tightly scoped subagent tasks.
5. If work was delegated, review the executor's actual result before recording `Learn`.
6. Record `Learn` only after execution has produced something real to evaluate.
7. Remove excess before continuing.

## Delegation Rule

Whenever one agent delegates to another:

- the delegating agent is responsible for the `Learn` step for that delegated task
- the delegated agent is responsible for executing the scoped build work
- the delegating agent should not write `Learn` in advance
- the delegating agent should use `Learn` to refine future delegation quality, process wording, and scope boundaries

This keeps `Learn` tied to reflection on real execution instead of turning it into ceremony or prediction.

## Success Condition

A good NIMBLE cycle ends with at least one of the following:

- less uncertainty
- fewer unnecessary tasks
- a clearer critical path
- a validated assumption
- a finished high-leverage deliverable
- a simpler and stronger project state


**Important note. NIMBLE does not mean that North Star documents should be written to the algorithm. North Star documents only cover the N in NIMBLE. So don't drift**

## Skills

### Full NIMBLE Skill

Use `/full_nimble scale=<task|part|epic|project> scope=<name>` to run a complete NIMBLE cycle for a scoped unit of work.

Rules:
- Re-anchor to the relevant North Star first.
- Document each NIMBLE step in order inside the scope folder.
- Update the step doc first, then perform the step.
- Complete the scoped objective without drifting into unrelated future scope.
- If the scope decomposes, delegate sub-scopes to subagents.
- Subagents must run NIMBLE at their own scale for their own scope.
- Record `Learn` only after the scoped build work has actually been executed and reviewed.
- End by recording Learn and compressing Excess.
