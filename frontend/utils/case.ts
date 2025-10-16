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
