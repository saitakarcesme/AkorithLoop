# AI research monitoring loop

This workspace was created for an Akorith fully autonomous Loop.

## Goal
Track AI coding tool announcements, model updates, agent workflow ideas, and automation trends. Maintain a rolling knowledge base, summarize meaningful changes, and suggest Akorith features inspired by the findings.

## Repository structure
- `FINDINGS.md` — the rolling knowledge base; per-iteration summaries, model/tool/workflow
  notes, Akorith feature suggestions, and a seen-item registry.
- `LOOP_STATE.json` — machine state for the loop: iteration counter, `seen_ids` (slugs
  already captured), and `sources_checked`.
- `LOOP_LOG.md` — operational log; one section per cycle (inspection, changes, validation
  results, backlog, next step).
- `validate.py` — the canonical validation script (`python3 validate.py`); checks
  `LOOP_STATE.json` validity and `seen_ids` ↔ `FINDINGS.md` consistency.
- `.gitignore` — excludes `.env`, secrets, and build artifacts.

## Validation
This is a docs/knowledge-base project with no language stack, so validation is a single
consistency check:

```
python3 validate.py
```

It verifies `LOOP_STATE.json` is valid JSON, `seen_ids` has no duplicates, and `seen_ids`
stays consistent with the slug registries in `FINDINGS.md`. Exit code 0 = pass, 1 = fail.

Flags:
- `--json` — emit results as a single JSON object (`{"ok", "seen_ids", "duplicates", "errors"}`) instead of the human-readable line.
- `--quiet` — suppress all output and report status via the exit code only.

## CI
A GitHub Actions workflow that runs `python3 validate.py` and `python3 test_validate.py` on `ubuntu-latest` is preserved on the local `ci-workflow` branch and as a reference copy in `_ci_pending/ci.yml`. It is **not yet active**: pushing files under `.github/workflows/` requires the GitHub `workflow` OAuth scope, which the automated credential lacks, so the live `.github/` directory is git-ignored on `main` to keep pushes unblocked. To activate CI, a maintainer must run a one-time `gh auth refresh -h github.com -s workflow`, then `git checkout ci-workflow && git push -u origin ci-workflow` (or merge it into `main`).

## Safety
- Do not expose secrets.
- Do not run destructive commands without approval.
- Report validation honestly.
