import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ArgsError, parseArgs } from '../src/args.mjs';

describe('parseArgs', () => {
  it('parses --input and --format values', () => {
    assert.deepEqual(parseArgs(['--input', 'commits.json', '--format', 'markdown']), {
      input: 'commits.json',
      format: 'markdown',
      help: false
    });
  });

  it('parses equals-style values for --input and --format', () => {
    assert.deepEqual(parseArgs(['--input=commits.json', '--format=json']), {
      input: 'commits.json',
      format: 'json',
      help: false
    });
  });

  it('sets help when --help is present', () => {
    assert.deepEqual(parseArgs(['--help']), {
      input: undefined,
      format: undefined,
      help: true
    });
  });

  it('throws an unknown-option error for unrecognized options', () => {
    assert.throws(
      () => parseArgs(['--verbose']),
      (error) =>
        error instanceof ArgsError &&
        error.code === 'unknown-option' &&
        error.message === 'Unknown option: --verbose'
    );
  });

  it('throws an unknown-option error for positional arguments', () => {
    assert.throws(
      () => parseArgs(['commits.json']),
      (error) =>
        error instanceof ArgsError &&
        error.code === 'unknown-option' &&
        error.message === 'Unexpected argument: commits.json'
    );
  });

  it('throws a missing-value error when --input has no value', () => {
    assert.throws(
      () => parseArgs(['--input']),
      (error) =>
        error instanceof ArgsError &&
        error.code === 'missing-value' &&
        error.message === 'Missing value for --input'
    );
  });

  it('throws a missing-value error when --format has another option instead of a value', () => {
    assert.throws(
      () => parseArgs(['--format', '--help']),
      (error) =>
        error instanceof ArgsError &&
        error.code === 'missing-value' &&
        error.message === 'Missing value for --format'
    );
  });

  it('throws a missing-value error for empty equals-style values', () => {
    assert.throws(
      () => parseArgs(['--input=']),
      (error) =>
        error instanceof ArgsError &&
        error.code === 'missing-value' &&
        error.message === 'Missing value for --input'
    );
  });
});
