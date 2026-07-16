export class ArgsError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ArgsError';
    this.code = code;
  }
}

const VALUE_OPTIONS = new Set(['--input', '--format']);

export function parseArgs(argv = []) {
  const options = {
    input: undefined,
    format: undefined,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help') {
      options.help = true;
      continue;
    }

    const equalsIndex = arg.indexOf('=');
    if (equalsIndex !== -1) {
      const name = arg.slice(0, equalsIndex);
      const value = arg.slice(equalsIndex + 1);

      if (!VALUE_OPTIONS.has(name)) {
        throw new ArgsError(`Unknown option: ${name}`, 'unknown-option');
      }

      if (value.length === 0) {
        throw new ArgsError(`Missing value for ${name}`, 'missing-value');
      }

      assignValue(options, name, value);
      continue;
    }

    if (VALUE_OPTIONS.has(arg)) {
      const value = argv[index + 1];

      if (value === undefined || value.startsWith('--')) {
        throw new ArgsError(`Missing value for ${arg}`, 'missing-value');
      }

      assignValue(options, arg, value);
      index += 1;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new ArgsError(`Unknown option: ${arg}`, 'unknown-option');
    }

    throw new ArgsError(`Unexpected argument: ${arg}`, 'unknown-option');
  }

  return options;
}

function assignValue(options, name, value) {
  if (name === '--input') {
    options.input = value;
    return;
  }

  if (name === '--format') {
    options.format = value;
  }
}
