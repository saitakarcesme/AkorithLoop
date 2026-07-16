# CLI Examples

These examples use the bundled sample repository fixture.

## Input Fixture Shape

The CLI expects a JSON object with `name`, `defaultBranch`, and a `commits` array. Each commit needs `hash`, `author`, `date`, `subject`, and `files`.

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
