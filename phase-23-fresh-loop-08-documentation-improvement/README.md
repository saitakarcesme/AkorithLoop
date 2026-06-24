# Documentation improvement loop

This workspace was created for an Akorith fully autonomous Loop.

## Goal
Improve documentation repeatedly: find stale or confusing docs, tighten onboarding, document Loop safety behavior, update README/AGENTS/codex notes where useful, validate formatting, and commit clear documentation changes locally.

## Safety
- Do not expose secrets.
- Do not run destructive commands without approval.
- Report validation honestly.
- Commit locally only — never push. Stage only intentionally edited files (no `git add -A`).
- Validate before committing: markdownlint, broken relative-link scan, and `git diff --check`.
- Stop when the focused change is committed, no safe improvement remains, or you are blocked.

See [AGENTS.md](AGENTS.md) for the full agent operating guide.
