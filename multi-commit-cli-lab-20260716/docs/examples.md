# CLI Examples

These examples use the bundled sample repository fixture.

## Help

```sh
node src/index.mjs --help
```

Expected output starts with:

```text
Usage: multi-commit-cli-lab --input <file> [--format text|json]
```

## Text Report

```sh
node src/index.mjs --input fixtures/sample-repo.json
```

Expected output starts with:

```text
Repository: sample-repo
Default branch: main
Commits: 4
Date range: 2026-07-10 to 2026-07-13
```

## JSON Report

```sh
node src/index.mjs --input fixtures/sample-repo.json --format json
```

Expected output starts with:

```text
{
  "repository": "sample-repo",
  "defaultBranch": "main",
  "commitCount": 4,
```

## Failure: Missing Input

```sh
node src/index.mjs
```

Expected stderr:

```text
Error: Missing required option: --input
```

## Failure: Unsupported Format

```sh
node src/index.mjs --input fixtures/sample-repo.json --format yaml
```

Expected stderr:

```text
Error: Unsupported report format: yaml
```

## Failure: Invalid JSON

```sh
node src/index.mjs --input broken.json
```

Expected stderr starts with:

```text
Error: Input file is not valid JSON:
```
