import assert from "node:assert/strict";

import { validateLoopState } from "../scripts/validate-loop-records.mjs";

assert.throws(
  () => validateLoopState(null),
  /LOOP_STATE\.json must contain a JSON object/,
  "null loop state should fail with a clear validation error"
);

assert.throws(
  () =>
    validateLoopState({
      iteration: 13,
      date: "2026-06-24",
      projectRoot: "/tmp/project",
      projectType: "test",
      openIssues: null,
      validationStatus: {},
      changedFiles: [],
      blockers: [],
      nextFocus: "next",
      fix_commit: "pending"
    }),
  /openIssues must be an array/,
  "iteration openIssues should fail when it is null"
);

assert.throws(
  () =>
    validateLoopState({
      iteration: 14,
      date: "2026-06-24",
      projectRoot: " ",
      projectType: "test",
      openIssues: [],
      validationStatus: {},
      changedFiles: [],
      blockers: [],
      nextFocus: "next",
      fix_commit: "pending"
    }),
  /projectRoot must be a non-empty string/,
  "iteration projectRoot should fail when it is blank"
);

assert.throws(
  () =>
    validateLoopState({
      iteration: 0,
      date: "2026-06-24",
      projectRoot: "/tmp/project",
      projectType: "test",
      openIssues: [],
      validationStatus: {},
      changedFiles: [],
      blockers: [],
      nextFocus: "next",
      fix_commit: "pending"
    }),
  /iteration must be a positive integer/,
  "iteration number should fail when it is zero"
);

console.log("validate-loop-records edge-case tests passed");
