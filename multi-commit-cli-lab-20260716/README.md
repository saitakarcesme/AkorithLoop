# multi-commit-cli-lab-20260716

Checkpoint 4 Node.js CLI lab that parses options, reads repository JSON, and produces deterministic repository summaries.

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

## Usage

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
