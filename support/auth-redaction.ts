const credentialKey = /^(?:sid|otp|cshc|access_token|refresh_token|id_token|password|code|state|token|lm)$/i;

// Salesforce may nest contentDoor credentials inside a maintenance retURL.
// Keep business URLs intact, including their record IDs and query parameters.
export function redactAuthUrl(value: string, depth = 0): string | undefined {
  if (depth > 5) return undefined;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return undefined;
    for (const [key, item] of url.searchParams) {
      if (credentialKey.test(key)) url.searchParams.set(key, '[redacted]');
      else if (/^https?:\/\//i.test(item)) {
        const nested = redactAuthUrl(item, depth + 1);
        url.searchParams.set(key, nested ?? '[redacted]');
      }
    }
    if (/access_token|id_token|password|(?:^|[&#])sid=/i.test(url.hash)) url.hash = '#[redacted]';
    return url.href;
  } catch { return undefined; }
}

export function authRedactionValues(value: string, depth = 0): string[] {
  if (depth > 5) return [];
  try {
    const url = new URL(value);
    return [...url.searchParams].flatMap(([key, item]) => credentialKey.test(key)
      ? encodedSecretForms(item)
      : /^https?:\/\//i.test(item) ? authRedactionValues(item, depth + 1) : []);
  } catch { return []; }
}

export function encodedSecretForms(value: string): string[] {
  const values = [value];
  for (let i = 0; i < 4; i++) values.push(encodeURIComponent(values.at(-1)!));
  values.push(new URLSearchParams({ v: value }).toString().slice(2));
  return [...new Set(values)].filter(Boolean);
}
