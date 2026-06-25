#!/usr/bin/env python3
"""Validation for the AI research monitoring loop.

Checks that are cheap, deterministic, and meaningful for this docs/knowledge-base
project (which has no code stack to test):

1. LOOP_STATE.json is valid JSON and has the expected shape.
2. seen_ids contains no duplicates.
3. Every seen_id is documented in FINDINGS.md (registry table or inline `slug:`),
   and every slug documented in FINDINGS.md is present in seen_ids.

Exit code 0 = all checks pass, 1 = at least one failure. Run with: python3 validate.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STATE = ROOT / "LOOP_STATE.json"
FINDINGS = ROOT / "FINDINGS.md"


def main() -> int:
    errors = []

    # 1. Valid JSON + expected shape.
    try:
        state = json.loads(STATE.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        print(f"FAIL: could not load {STATE.name}: {exc}")
        return 1

    seen = state.get("seen_ids")
    if not isinstance(seen, list):
        errors.append("LOOP_STATE.json: 'seen_ids' missing or not a list")
        seen = []

    # 2. No duplicate seen_ids.
    dups = sorted({s for s in seen if seen.count(s) > 1})
    if dups:
        errors.append(f"duplicate seen_ids: {dups}")

    # 3. seen_ids <-> FINDINGS.md slug consistency.
    text = FINDINGS.read_text() if FINDINGS.exists() else ""
    documented = set(re.findall(r"\|\s*([a-z0-9][a-z0-9-]+)\s*\|", text))
    documented |= set(re.findall(r"slug:\s*([a-z0-9-]+)", text))

    missing_doc = sorted(set(seen) - documented)
    if missing_doc:
        errors.append(f"in seen_ids but not documented in FINDINGS.md: {missing_doc}")
    missing_state = sorted(documented - set(seen))
    if missing_state:
        errors.append(f"documented in FINDINGS.md but not in seen_ids: {missing_state}")

    if errors:
        print("VALIDATION FAILED:")
        for e in errors:
            print(f"  - {e}")
        return 1

    print(
        f"OK: LOOP_STATE.json valid; {len(set(seen))} unique seen_ids; "
        "0 duplicates; seen_ids and FINDINGS.md registries consistent."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
