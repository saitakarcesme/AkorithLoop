import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const cliPath = fileURLToPath(new URL('../src/index.mjs', import.meta.url));
const sampleInput = 'fixtures/sample-repo.json';

describe('CLI integration', () => {
  it('prints help without requiring an input file', () => {
    const result = runCli(['--help']);

    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /Usage: multi-commit-cli-lab --input <file>/);
  });

  it('generates the default text report from an input file', () => {
    const result = runCli(['--input', sampleInput]);

    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /^Repository: sample-repo\nDefault branch: main\nCommits: 4/m);
    assert.match(result.stdout, /- 2026-07-13 c0d1e2f Linus Torvalds - Prepare report fixture/);
  });

  it('generates a JSON report from an input file', () => {
    const result = runCli(['--input', sampleInput, '--format', 'json']);

    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.deepEqual(JSON.parse(result.stdout), {
      repository: 'sample-repo',
      defaultBranch: 'main',
      commitCount: 4,
      dateRange: {
        from: '2026-07-10',
        to: '2026-07-13'
      },
      authors: [
        {
          name: 'Ada Lovelace',
          commits: 2
        },
        {
          name: 'Grace Hopper',
          commits: 1
        },
        {
          name: 'Linus Torvalds',
          commits: 1
        }
      ],
      changedFiles: [
        'README.md',
        'fixtures/sample-repo.json',
        'package.json',
        'src/args.mjs',
        'src/index.mjs',
        'src/report.mjs',
        'tests/args.test.mjs',
        'tests/report.test.mjs'
      ],
      commits: [
        {
          hash: 'a1b2c3d',
          author: 'Ada Lovelace',
          date: '2026-07-10',
          subject: 'Bootstrap CLI skeleton',
          files: [
            'README.md',
            'package.json',
            'src/index.mjs'
          ]
        },
        {
          hash: 'd4e5f6a',
          author: 'Grace Hopper',
          date: '2026-07-11',
          subject: 'Add argument parser',
          files: [
            'package.json',
            'src/args.mjs',
            'tests/args.test.mjs'
          ]
        },
        {
          hash: 'f7a8b9c',
          author: 'Ada Lovelace',
          date: '2026-07-12',
          subject: 'Document parser checkpoint',
          files: [
            'README.md'
          ]
        },
        {
          hash: 'c0d1e2f',
          author: 'Linus Torvalds',
          date: '2026-07-13',
          subject: 'Prepare report fixture',
          files: [
            'fixtures/sample-repo.json',
            'src/report.mjs',
            'tests/report.test.mjs'
          ]
        }
      ]
    });
  });

  it('fails when the required input option is missing', () => {
    const result = runCli([]);

    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'Error: Missing required option: --input\n');
  });

  it('fails when the input file is not valid JSON', () => {
    const result = runCli(['--input', 'README.md']);

    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /Error: Input file is not valid JSON:/);
  });

  it('fails when the report format is unsupported', () => {
    const result = runCli(['--input', sampleInput, '--format', 'yaml']);

    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'Error: Unsupported report format: yaml\n');
  });
});

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: projectRoot,
    encoding: 'utf8'
  });
}
