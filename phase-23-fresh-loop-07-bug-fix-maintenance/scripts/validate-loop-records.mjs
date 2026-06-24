import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const modulePath = fileURLToPath(import.meta.url);
const defaultRoot = resolve(dirname(modulePath), "..");

function readRequiredFile(root, relativePath) {
  try {
    const value = readFileSync(resolve(root, relativePath), "utf8");
    if (value.trim().length === 0) {
      throw new Error(`${relativePath} is empty`);
    }
    return value;
  } catch (error) {
    throw new Error(`Unable to read ${relativePath}: ${error.message}`);
  }
}

const requiredSeedFields = ["id", "title", "type", "status", "autonomy", "active", "target", "createdAt"];
const requiredIterationFields = [
  "iteration",
  "date",
  "projectRoot",
  "projectType",
  "openIssues",
  "validationStatus",
  "changedFiles",
  "blockers",
  "nextFocus"
];

export function validateLoopState(loopState) {
  if (loopState === null || typeof loopState !== "object" || Array.isArray(loopState)) {
    throw new Error("LOOP_STATE.json must contain a JSON object");
  }

  const hasRequiredSeedFields = requiredSeedFields.every((field) =>
    Object.prototype.hasOwnProperty.call(loopState, field)
  );
  const hasRequiredIterationFields = requiredIterationFields.every((field) =>
    Object.prototype.hasOwnProperty.call(loopState, field)
  );
  const hasCommitReference =
    Object.prototype.hasOwnProperty.call(loopState, "commitHash") ||
    Object.prototype.hasOwnProperty.call(loopState, "fix_commit");

  if (!hasRequiredSeedFields && !(hasRequiredIterationFields && hasCommitReference)) {
    throw new Error("LOOP_STATE.json is missing required seed or iteration fields");
  }
}

export function validateLoopRecords({ root = defaultRoot, log = console.log } = {}) {
  const readme = readRequiredFile(root, "README.md");
  const findings = readRequiredFile(root, "FINDINGS.md");
  const loopStateRaw = readRequiredFile(root, "LOOP_STATE.json");

  let loopState;
  try {
    loopState = JSON.parse(loopStateRaw);
  } catch (error) {
    throw new Error(`LOOP_STATE.json is not valid JSON: ${error.message}`);
  }

  validateLoopState(loopState);

  if (!readme.includes("Daily bug-fix maintenance loop")) {
    throw new Error("README.md does not describe the maintenance loop");
  }

  if (!findings.includes("# Daily bug-fix maintenance loop Findings")) {
    throw new Error("FINDINGS.md is missing the expected heading");
  }

  log("Loop records validation passed");
}

if (process.argv[1] === modulePath) {
  validateLoopRecords();
}
