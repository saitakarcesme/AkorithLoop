import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readRequiredFile(relativePath) {
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

const readme = readRequiredFile("README.md");
const findings = readRequiredFile("FINDINGS.md");
const loopStateRaw = readRequiredFile("LOOP_STATE.json");

let loopState;
try {
  loopState = JSON.parse(loopStateRaw);
} catch (error) {
  throw new Error(`LOOP_STATE.json is not valid JSON: ${error.message}`);
}

const requiredSeedFields = ["id", "title", "type", "status", "autonomy", "active", "target", "createdAt"];
const requiredIterationFields = [
  "iteration",
  "date",
  "projectRoot",
  "projectType",
  "openIssues",
  "fixesApplied",
  "validationStatus",
  "changedFiles",
  "commitHash",
  "blockers",
  "nextFocus"
];

const hasRequiredSeedFields = requiredSeedFields.every((field) =>
  Object.prototype.hasOwnProperty.call(loopState, field)
);
const hasRequiredIterationFields = requiredIterationFields.every((field) =>
  Object.prototype.hasOwnProperty.call(loopState, field)
);

if (!hasRequiredSeedFields && !hasRequiredIterationFields) {
  throw new Error("LOOP_STATE.json is missing required seed or iteration fields");
}

if (!readme.includes("Daily bug-fix maintenance loop")) {
  throw new Error("README.md does not describe the maintenance loop");
}

if (!findings.includes("# Daily bug-fix maintenance loop Findings")) {
  throw new Error("FINDINGS.md is missing the expected heading");
}

console.log("Loop records validation passed");
