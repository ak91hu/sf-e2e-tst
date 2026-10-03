import { createPrivateKey, randomUUID, sign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { readEnvironment } from './environment.ts';

export interface JwtConfig {
  baseUrl: string; username: string; clientId: string; privateKey: string; audience: string;
}

export function readJwtConfig(env: NodeJS.ProcessEnv = process.env): JwtConfig {
  const environment = readEnvironment(env);
  const clientId = env.SF_CLIENT_ID?.trim();
  if (!clientId) throw new Error('SF_CLIENT_ID is missing. Complete the one-time External Client App setup in AUTH_SETUP.md.');
  let privateKey = env.SF_JWT_PRIVATE_KEY;
  if (!privateKey && env.SF_JWT_PRIVATE_KEY_FILE) {
    try { privateKey = readFileSync(env.SF_JWT_PRIVATE_KEY_FILE, 'utf8'); }
    catch { throw new Error('Cannot read SF_JWT_PRIVATE_KEY_FILE. See AUTH_SETUP.md.'); }
  }
  if (!privateKey) throw new Error('Set SF_JWT_PRIVATE_KEY_FILE locally or SF_JWT_PRIVATE_KEY in CI.');
  if (!environment.username) throw new Error('SF_SALES_USERNAME is missing. Business regression never falls back to the configuration administrator.');
  const audience = env.SF_JWT_AUDIENCE || 'https://login.salesforce.com';
  if (!['https://login.salesforce.com', 'https://test.salesforce.com'].includes(audience)) {
    throw new Error('SF_JWT_AUDIENCE must be https://login.salesforce.com (Developer Edition) or https://test.salesforce.com (sandbox).');
  }
  validateKey(privateKey);
  return { baseUrl: environment.baseUrl, username: environment.username, clientId, privateKey, audience };
}

function validateKey(pem: string) {
  try {
    const key = createPrivateKey(pem);
    if (key.asymmetricKeyType !== 'rsa' || (key.asymmetricKeyDetails?.modulusLength ?? 0) < 2048) throw new Error();
    return key;
  } catch { throw new Error('Salesforce JWT requires an unencrypted RSA private key of at least 2048 bits.'); }
}

export function createAssertion(config: JwtConfig, now = Date.now()): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const data = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: config.clientId, sub: config.username, aud: config.audience,
    exp: Math.floor(now / 1000) + 120, jti: randomUUID(),
  })}`;
  return `${data}.${sign('RSA-SHA256', Buffer.from(data), validateKey(config.privateKey)).toString('base64url')}`;
}

const safeErrors = new Set([
  'invalid_grant', 'invalid_client', 'invalid_client_id', 'invalid_request', 'unsupported_grant_type',
  'Bad_OAuth_Token', 'Missing_OAuth_Token', 'Invalid_Param', 'Invalid_Scope', 'No_Access', 'Wrong_Org',
]);

async function post(url: string, body: URLSearchParams, headers: Record<string, string>, fetcher: typeof fetch) {
  let response: Response;
  try {
    response = await fetcher(url, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30_000),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', ...headers }, body,
    });
  } catch { throw new Error('Salesforce OAuth network request failed or timed out. No password fallback is attempted.'); }
  let raw: string;
  try { raw = await response.text(); }
  catch { throw new Error('Salesforce OAuth response could not be read.'); }
  let result: unknown;
  try { result = JSON.parse(raw); }
  catch {
    if (!response.ok && safeErrors.has(raw.trim())) result = raw.trim();
    else throw new Error(`Salesforce OAuth returned a non-JSON response (HTTP ${response.status}). Check the app scope and org policy.`);
  }
  if (!response.ok) {
    const code = typeof result === 'object' && result !== null && 'error' in result ? result.error : result;
    throw new Error(`Salesforce OAuth failed (HTTP ${response.status}, ${typeof code === 'string' && safeErrors.has(code) ? code : 'unrecognized error'}). Check certificate, Consumer Key, pre-authorization, web scope and user access in AUTH_SETUP.md.`);
  }
  if (typeof result !== 'object' || result === null) throw new Error('Salesforce OAuth returned an invalid response.');
  return result as Record<string, unknown>;
}

export interface UiBridge { otp: string; cshc: string }

export async function requestAccessToken(config: JwtConfig, fetcher: typeof fetch = fetch): Promise<string> {
  const token = await post(`${config.baseUrl}/services/oauth2/token`, new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: createAssertion(config),
  }), {}, fetcher);
  if (typeof token.access_token !== 'string' || !token.access_token || token.instance_url !== config.baseUrl) {
    throw new Error('Salesforce returned no access token or a different org origin. UI login refused.');
  }
  return token.access_token;
}

export async function requestUiBridge(config: JwtConfig, fetcher: typeof fetch = fetch): Promise<UiBridge> {
  const accessToken = await requestAccessToken(config, fetcher);
  const bridge = await post(`${config.baseUrl}/services/oauth2/singleaccess`, new URLSearchParams({
    redirect_uri: 'lightning/o/Opportunity/list',
  }), { Authorization: `Bearer ${accessToken}` }, fetcher);
  let frontdoor: URL;
  try { frontdoor = new URL(String(bridge.frontdoor_uri)); }
  catch { throw new Error('Salesforce UI Bridge returned no valid frontdoor URL.'); }
  if (frontdoor.origin !== config.baseUrl || frontdoor.pathname !== '/secur/frontdoor.jsp'
      || frontdoor.username || frontdoor.password || frontdoor.hash
      || [...frontdoor.searchParams.keys()].some(key => !['otp', 'cshc', 'startURL'].includes(key))
      || frontdoor.searchParams.get('startURL') !== 'lightning/o/Opportunity/list'
      || frontdoor.searchParams.getAll('otp').length !== 1 || frontdoor.searchParams.getAll('cshc').length !== 1
      || frontdoor.searchParams.getAll('startURL').length !== 1) {
    throw new Error('Salesforce UI Bridge returned an unexpected destination. UI login refused.');
  }
  const otp = frontdoor.searchParams.get('otp') ?? '';
  const cshc = frontdoor.searchParams.get('cshc') ?? '';
  if (otp.length < 6 || cshc.length < 6) throw new Error('Salesforce UI Bridge returned incomplete session credentials.');
  return { otp, cshc };
}

// Resolve only once the browser form is ready: frontdoor expires in one minute.
let current: Promise<UiBridge> | undefined;
let service: Promise<UiBridge> | undefined;
export function resetUiBridge() { current = undefined; service = undefined; }
export async function uiBridgeField(field: keyof UiBridge) {
  current ??= requestUiBridge(readJwtConfig());
  return (await current)[field];
}
export async function serviceUiBridgeField(field: keyof UiBridge) {
  if (!process.env.SF_SERVICE_USERNAME) throw new Error('SF_SERVICE_USERNAME is missing. Run users:provision.');
  service ??= requestUiBridge(readJwtConfig({ ...process.env, E2E_USER_SALESFORCE_USERNAME: process.env.SF_SERVICE_USERNAME }));
  return (await service)[field];
}
