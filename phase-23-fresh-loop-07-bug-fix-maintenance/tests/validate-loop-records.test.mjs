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

console.log("validate-loop-records edge-case tests passed");
