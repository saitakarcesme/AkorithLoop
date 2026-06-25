# Changelog

One line per loop iteration, newest first.
Format: `- Cycle N (YYYY-MM-DD): <headline change> [<short commit hash>]`.
Source of truth for detail is the matching section in `LOOP_LOG.md`.

## Validation
Every cycle is gated by `python3 validate.py` (exit 0 = pass), which checks that
`LOOP_STATE.json` is valid JSON and that `seen_ids` stays consistent with the slug
registries in `FINDINGS.md`. A row's `[hash]` is the cycle's committed short hash;
`pending` marks the current cycle's own commit, which cannot embed its own hash.

## Cycles
- Cycle 7 (2026-06-26): Added this Validation note and corrected the Cycle 6 commit hash [pending]
- Cycle 6 (2026-06-26): Reordered CHANGELOG newest-first and added the Cycle 6 index entry [c9ec046]
- Cycle 5 (2026-06-26): Added the CHANGELOG iteration index [89db92f]
- Cycle 4 (2026-06-26): Refined the validate.py README entry into a self-contained one-liner [1ea1d09]
- Cycle 3 (2026-06-25): Documented repository structure and validation command in README [9010124]
- Cycle 2 (2026-06-25): Added validate.py integrity check (LOOP_STATE.json + seen_ids/FINDINGS.md consistency) [1136f0f]
- Cycle 1 (2026-06-25): Inspection & setup; created LOOP_LOG.md with overview, stack, and backlog [1136f0f]
