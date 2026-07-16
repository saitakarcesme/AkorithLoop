# multi-commit-cli-lab-20260716

Dependency-free Node.js CLI that reads repository JSON and produces deterministic repository insight reports. It summarizes commit count, date range, author activity, changed files, and ordered commit history from a local fixture or any file that matches the documented input shape.

## Current Scope

- npm package metadata in `package.json`
- integrated CLI entry point in `src/index.mjs`
- parser implementation in `src/args.mjs`
- report implementation in `src/report.mjs`
- sample repository fixture in `fixtures/sample-repo.json`
- parser tests for `--input`, `--format`, `--help`, unknown options, and missing values
- report tests for deterministic text and JSON summaries
- end-to-end CLI tests for help, text output, JSON output, and failure modes
- parser, report, and CLI validation through `npm test`

## Installation-Free Usage

No runtime package installation is required. Use Node.js 18 or newer from this folder.

Show CLI help:

```sh
node src/index.mjs --help
```

Generate a text report:

```sh
node src/index.mjs --input fixtures/sample-repo.json
```

Generate a JSON report:

```sh
node src/index.mjs --input fixtures/sample-repo.json --format json
```

Run the checkpoint validation:

```sh
npm test
```

## Options

| Option | Required | Description |
|--------|----------|-------------|
| `--input <file>` | Yes | Path to a repository JSON file. Relative paths resolve from the current working directory. |
| `--format <format>` | No | Output format. Supported values are `text` and `json`; defaults to `text`. |
| `--help` | No | Print usage information and exit successfully without requiring `--input`. |

Options can use either separated values, such as `--input fixtures/sample-repo.json`, or equals-style values, such as `--input=fixtures/sample-repo.json`.

## Input Format

Input must be a JSON object with a repository name, default branch, and commit list:

```json
{
  "name": "sample-repo",
  "defaultBranch": "main",
  "commits": [
    {
      "hash": "a1b2c3d",
      "author": "Ada Lovelace",
      "date": "2026-07-10",
      "subject": "Bootstrap CLI skeleton",
      "files": [
        "README.md",
        "package.json",
        "src/index.mjs"
      ]
    }
  ]
}
```

Required string fields are `name`, `defaultBranch`, and each commit's `hash`, `author`, `date`, and `subject`. Each commit must also include `files`, an array of non-empty file path strings.

## Failure Examples

Missing required input exits with status 1 and writes to stderr:

```sh
node src/index.mjs
# Error: Missing required option: --input
```

Unsupported formats are rejected by the report layer:

```sh
node src/index.mjs --input fixtures/sample-repo.json --format yaml
# Error: Unsupported report format: yaml
```

Malformed JSON input is rejected before report generation:

```sh
node src/index.mjs --input broken.json
# Error: Input file is not valid JSON: /absolute/path/to/broken.json
```

## Checkpoint Status

- Checkpoint 1: complete — project skeleton and placeholder CLI.
- Checkpoint 2: complete — argument parser and parser-only tests.
- Checkpoint 3: complete — deterministic report generation and report tests.
- Checkpoint 4: complete — CLI integration, end-to-end tests, and `docs/examples.md`.

## Documentation

- See `docs/examples.md` for expanded command examples and expected output excerpts.
