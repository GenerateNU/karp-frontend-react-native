type JsonLike = Record<string, unknown> | unknown[] | null;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && v.constructor === Object;

const toCamel = (key: string, preserveLeadingUnderscore = true) => {
  const lead = preserveLeadingUnderscore && key.startsWith('_') ? '_' : '';
  const core = preserveLeadingUnderscore ? key.replace(/^_+/, '') : key;
  return (
    lead +
    core.replace(/[-_]+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase())
  );
};

export function camelizeKeys<T extends JsonLike>(
  input: T,
  options: { preserveLeadingUnderscore?: boolean } = {}
): T {
  const preserve = options.preserveLeadingUnderscore ?? true;

  if (Array.isArray(input)) {
    return input.map(v => camelizeKeys(v as JsonLike, options)) as T;
  }

  if (isPlainObject(input)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      const newKey = typeof k === 'string' ? toCamel(k, preserve) : k;
      if (Array.isArray(v) || isPlainObject(v)) {
        out[newKey] = camelizeKeys(v as JsonLike, options);
      } else {
        out[newKey] = v;
      }
    }
    return out as T;
  }

  return input;
}

const toSnake = (key: string) =>
  key
    // handle camelCase boundaries
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    // normalize dashes/spaces to underscores
    .replace(/[-\s]+/g, '_')
    // collapse multiple underscores
    .replace(/_{2,}/g, '_')
    .toLowerCase();

export function decamelizeKeys<T extends JsonLike>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(v => decamelizeKeys(v as JsonLike)) as T;
  }

  if (isPlainObject(input)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      const newKey = typeof k === 'string' ? toSnake(k) : k;
      if (Array.isArray(v) || isPlainObject(v)) {
        out[newKey] = decamelizeKeys(v as JsonLike);
      } else {
        out[newKey] = v;
      }
    }
    return out as T;
  }

  return input;
}
