export class ReportError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ReportError';
    this.code = code;
  }
}

const FORMATS = new Set(['text', 'json']);

export function createRepositorySummary(repository) {
  validateRepository(repository);

  const commits = repository.commits
    .map((commit) => ({
      hash: commit.hash,
      author: commit.author,
      date: commit.date,
      subject: commit.subject,
      files: [...commit.files].sort(compareStrings)
    }))
    .sort(compareCommits);

  const authorsByName = new Map();
  const files = new Set();

  for (const commit of commits) {
    authorsByName.set(commit.author, (authorsByName.get(commit.author) ?? 0) + 1);

    for (const file of commit.files) {
      files.add(file);
    }
  }

  const authors = [...authorsByName.entries()]
    .map(([name, commits]) => ({ name, commits }))
    .sort((left, right) => right.commits - left.commits || compareStrings(left.name, right.name));

  const dates = commits.map((commit) => commit.date).sort(compareStrings);

  return {
    repository: repository.name,
    defaultBranch: repository.defaultBranch,
    commitCount: commits.length,
    dateRange: {
      from: dates[0] ?? null,
      to: dates.at(-1) ?? null
    },
    authors,
    changedFiles: [...files].sort(compareStrings),
    commits
  };
}

export function formatRepositorySummary(summary, format = 'text') {
  if (!FORMATS.has(format)) {
    throw new ReportError(`Unsupported report format: ${format}`, 'unsupported-format');
  }

  if (format === 'json') {
    return `${JSON.stringify(summary, null, 2)}\n`;
  }

  return [
    `Repository: ${summary.repository}`,
    `Default branch: ${summary.defaultBranch}`,
    `Commits: ${summary.commitCount}`,
    `Date range: ${summary.dateRange.from ?? 'none'} to ${summary.dateRange.to ?? 'none'}`,
    '',
    'Authors:',
    ...summary.authors.map((author) => `- ${author.name}: ${author.commits} ${pluralize('commit', author.commits)}`),
    '',
    'Changed files:',
    ...summary.changedFiles.map((file) => `- ${file}`),
    '',
    'Commits:',
    ...summary.commits.map((commit) => `- ${commit.date} ${commit.hash} ${commit.author} - ${commit.subject}`)
  ].join('\n') + '\n';
}

export function generateRepositoryReport(repository, { format = 'text' } = {}) {
  return formatRepositorySummary(createRepositorySummary(repository), format);
}

function validateRepository(repository) {
  if (repository === null || typeof repository !== 'object') {
    throw new ReportError('Repository data must be an object.', 'invalid-repository');
  }

  for (const field of ['name', 'defaultBranch']) {
    if (typeof repository[field] !== 'string' || repository[field].length === 0) {
      throw new ReportError(`Repository field "${field}" must be a non-empty string.`, 'invalid-repository');
    }
  }

  if (!Array.isArray(repository.commits)) {
    throw new ReportError('Repository field "commits" must be an array.', 'invalid-repository');
  }

  for (const [index, commit] of repository.commits.entries()) {
    validateCommit(commit, index);
  }
}

function validateCommit(commit, index) {
  if (commit === null || typeof commit !== 'object') {
    throw new ReportError(`Commit at index ${index} must be an object.`, 'invalid-commit');
  }

  for (const field of ['hash', 'author', 'date', 'subject']) {
    if (typeof commit[field] !== 'string' || commit[field].length === 0) {
      throw new ReportError(`Commit at index ${index} field "${field}" must be a non-empty string.`, 'invalid-commit');
    }
  }

  if (!Array.isArray(commit.files) || !commit.files.every((file) => typeof file === 'string' && file.length > 0)) {
    throw new ReportError(`Commit at index ${index} field "files" must be an array of non-empty strings.`, 'invalid-commit');
  }
}

function compareCommits(left, right) {
  return (
    compareStrings(left.date, right.date) ||
    compareStrings(left.hash, right.hash) ||
    compareStrings(left.author, right.author) ||
    compareStrings(left.subject, right.subject)
  );
}

function compareStrings(left, right) {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}
