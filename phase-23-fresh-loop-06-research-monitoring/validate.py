#!/usr/bin/env python3
"""Validation for the AI research monitoring loop.

Checks that are cheap, deterministic, and meaningful for this docs/knowledge-base
project (which has no code stack to test):

1. LOOP_STATE.json is valid JSON and has the expected shape.
2. seen_ids contains no duplicates.
3. Every seen_id is documented in FINDINGS.md (registry table or inline `slug:`),
   and every slug documented in FINDINGS.md is present in seen_ids.

Exit code 0 = all checks pass, 1 = at least one failure.

Usage:
  python3 validate.py            human-readable output (default)
  python3 validate.py --json     emit a single JSON object with the results
  python3 validate.py --quiet    suppress output; exit code only
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STATE = ROOT / "LOOP_STATE.json"
FINDINGS = ROOT / "FINDINGS.md"


def run_checks() -> dict:
    """Run the integrity checks and return a structured result.

    Keys: ok (bool), seen_ids (int unique count),
    duplicates (int count of distinct duplicated ids), errors (list of str).
    """
    errors = []

    # 1. Valid JSON + expected shape.
    try:
        state = json.loads(STATE.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        return {
            "ok": False,
            "seen_ids": 0,
            "duplicates": 0,
            "errors": [f"could not load {STATE.name}: {exc}"],
        }

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

    return {
        "ok": not errors,
        "seen_ids": len(set(seen)),
        "duplicates": len(dups),
        "errors": errors,
    }


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        description="Validate LOOP_STATE.json and FINDINGS.md consistency."
    )
    parser.add_argument(
        "--json", action="store_true", help="emit results as a single JSON object"
    )
    parser.add_argument(
        "--quiet", action="store_true", help="suppress output; exit code only"
    )
    args = parser.parse_args(argv)

    result = run_checks()

    if args.json:
        print(json.dumps(result))
    elif not args.quiet:
        if result["ok"]:
            print(
                f"OK: LOOP_STATE.json valid; {result['seen_ids']} unique seen_ids; "
                f"{result['duplicates']} duplicates; "
                "seen_ids and FINDINGS.md registries consistent."
            )
        else:
            print("VALIDATION FAILED:")
            for e in result["errors"]:
                print(f"  - {e}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
