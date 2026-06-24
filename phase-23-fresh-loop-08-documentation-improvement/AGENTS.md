# AGENTS.md

Operating guide for autonomous agents working in this repository.

## Quick start
1. Work only in this repository's root folder; do not touch files outside it.
2. Read `README.md`, this file, `FINDINGS.md`, and `LOOP_STATE.json` before editing.
3. Make one focused documentation improvement per iteration, then validate and commit.

## Loop safety
- Each iteration must show visible progress before any broad audit — write/refresh
  `FINDINGS.md` and `LOOP_STATE.json` first so a stall is detectable.
- Keep each cycle small and verifiable: audit high-value docs only and make a single
  focused change rather than a sweeping rewrite.
- Record blockers honestly in `FINDINGS.md`; do not mark work done that was skipped.

## Local commits only — never push
- Stage only the files you intentionally edited; never use `git add -A`.
- Make at most one local commit per iteration.
- **Never push.** All work stays local for review.

## No secret exposure
- Never read, print, or commit secrets, tokens, or credentials.
- `.env`, `.env.*`, `secrets.*`, and `private.*` are gitignored — keep them that way.

## Stop conditions
- Stop the iteration when the focused change is committed, or
- when no safe improvement remains, or
- when blocked — record the blocker in `FINDINGS.md` and stop rather than churn.

## Validation
Before committing, run the available lightweight checks:
- `npx markdownlint-cli '**/*.md' --ignore node_modules` (formatting)
- A scan for relative markdown links whose target files do not exist
- `git diff --check` (whitespace/conflict markers)
Report each result honestly in `FINDINGS.md`, including failures.
