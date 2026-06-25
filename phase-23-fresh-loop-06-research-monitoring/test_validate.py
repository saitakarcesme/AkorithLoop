#!/usr/bin/env python3
"""Self-contained tests for validate.py. Run: python3 test_validate.py

validate.py resolves its data paths relative to its own location, so each case
copies validate.py + the data files into a temp dir and runs it there via
subprocess, asserting on the exit code (0 = pass, 1 = fail).
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def run_in(tmp: Path) -> int:
    return subprocess.run(
        [sys.executable, "validate.py"], cwd=tmp, capture_output=True, text=True
    ).returncode


def make_dir(mutate=None) -> Path:
    tmp = Path(tempfile.mkdtemp())
    for name in ("validate.py", "LOOP_STATE.json", "FINDINGS.md"):
        shutil.copy(ROOT / name, tmp / name)
    if mutate:
        state = json.loads((tmp / "LOOP_STATE.json").read_text())
        mutate(state)
        (tmp / "LOOP_STATE.json").write_text(json.dumps(state))
    return tmp


def test_passes_on_real_data():
    tmp = make_dir()
    assert run_in(tmp) == 0, "validate.py should pass (exit 0) on the real data"
    shutil.rmtree(tmp)


def test_fails_on_duplicate_id():
    tmp = make_dir(mutate=lambda s: s["seen_ids"].append(s["seen_ids"][0]))
    assert run_in(tmp) == 1, "validate.py should fail (exit 1) on a duplicated seen_id"
    shutil.rmtree(tmp)


def test_fails_on_undocumented_id():
    tmp = make_dir(mutate=lambda s: s["seen_ids"].append("bogus-undocumented-slug"))
    assert run_in(tmp) == 1, "validate.py should fail (exit 1) on an undocumented seen_id"
    shutil.rmtree(tmp)


if __name__ == "__main__":
    test_passes_on_real_data()
    test_fails_on_duplicate_id()
    test_fails_on_undocumented_id()
    print("All tests passed: 3/3")
