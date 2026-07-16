import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

import {
  ReportError,
  createRepositorySummary,
  formatRepositorySummary,
  generateRepositoryReport
} from '../src/report.mjs';

const fixtureUrl = new URL('../fixtures/sample-repo.json', import.meta.url);
const repository = JSON.parse(await readFile(fixtureUrl, 'utf8'));

describe('createRepositorySummary', () => {
  it('creates a deterministic repository summary', () => {
    assert.deepEqual(createRepositorySummary(repository), {
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

  it('rejects invalid repository data', () => {
    assert.throws(
      () => createRepositorySummary({ name: 'broken', defaultBranch: 'main', commits: {} }),
      (error) =>
        error instanceof ReportError &&
        error.code === 'invalid-repository' &&
        error.message === 'Repository field "commits" must be an array.'
    );
  });
});

describe('formatRepositorySummary', () => {
  it('formats a text repository report', () => {
    assert.equal(
      generateRepositoryReport(repository),
      `Repository: sample-repo
Default branch: main
Commits: 4
Date range: 2026-07-10 to 2026-07-13

Authors:
- Ada Lovelace: 2 commits
- Grace Hopper: 1 commit
- Linus Torvalds: 1 commit

Changed files:
- README.md
- fixtures/sample-repo.json
- package.json
- src/args.mjs
- src/index.mjs
- src/report.mjs
- tests/args.test.mjs
- tests/report.test.mjs

Commits:
- 2026-07-10 a1b2c3d Ada Lovelace - Bootstrap CLI skeleton
- 2026-07-11 d4e5f6a Grace Hopper - Add argument parser
- 2026-07-12 f7a8b9c Ada Lovelace - Document parser checkpoint
- 2026-07-13 c0d1e2f Linus Torvalds - Prepare report fixture
`
    );
  });

  it('formats a stable JSON repository report', () => {
    const summary = createRepositorySummary(repository);

    assert.equal(generateRepositoryReport(repository, { format: 'json' }), `${JSON.stringify(summary, null, 2)}\n`);
  });

  it('rejects unsupported report formats', () => {
    assert.throws(
      () => formatRepositorySummary(createRepositorySummary(repository), 'yaml'),
      (error) =>
        error instanceof ReportError &&
        error.code === 'unsupported-format' &&
        error.message === 'Unsupported report format: yaml'
    );
  });
});
