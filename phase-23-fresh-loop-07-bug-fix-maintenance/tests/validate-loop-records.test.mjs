import assert from "node:assert/strict";

import { validateLoopState } from "../scripts/validate-loop-records.mjs";

assert.throws(
  () => validateLoopState(null),
  /LOOP_STATE\.json must contain a JSON object/,
  "null loop state should fail with a clear validation error"
);

console.log("validate-loop-records edge-case tests passed");
