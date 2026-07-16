#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ArgsError, parseArgs } from './args.mjs';
import { ReportError, generateRepositoryReport } from './report.mjs';

export const USAGE = `Usage: multi-commit-cli-lab --input <file> [--format text|json]

Options:
  --input <file>       Repository JSON file to summarize.
  --format <format>    Output format: text or json. Defaults to text.
  --help               Show this help message.
`;

export async function runCli(argv = process.argv.slice(2), io = process, cwd = process.cwd()) {
  try {
    const options = parseArgs(argv);

    if (options.help) {
      io.stdout.write(USAGE);
      return 0;
    }

    if (options.input === undefined) {
      throw new ArgsError('Missing required option: --input', 'missing-input');
    }

    const inputPath = resolve(cwd, options.input);
    const repository = await readRepositoryFile(inputPath);
    const report = generateRepositoryReport(repository, { format: options.format ?? 'text' });
    io.stdout.write(report);
    return 0;
  } catch (error) {
    io.stderr.write(`${formatCliError(error)}\n`);
    return 1;
  }
}

async function readRepositoryFile(inputPath) {
  let contents;

  try {
    contents = await readFile(inputPath, 'utf8');
  } catch (error) {
    const message = error?.code === 'ENOENT'
      ? `Input file not found: ${inputPath}`
      : `Unable to read input file: ${inputPath}`;
    throw new ArgsError(message, 'input-read-failed');
  }

  try {
    return JSON.parse(contents);
  } catch {
    throw new ArgsError(`Input file is not valid JSON: ${inputPath}`, 'invalid-json');
  }
}

function formatCliError(error) {
  if (error instanceof ArgsError || error instanceof ReportError) {
    return `Error: ${error.message}`;
  }

  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = await runCli();
}
