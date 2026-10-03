import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';
import { createAssertion, readJwtConfig, requestUiBridge } from '../support/oauth.ts';
import type { JwtConfig } from '../support/oauth.ts';

const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
const config: JwtConfig = {
  baseUrl: 'https://example.develop.my.salesforce.com', username: 'regression@example.com',
  clientId: 'test-client', audience: 'https://login.salesforce.com',
  privateKey: keys.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
};
const frontdoor = `${config.baseUrl}/secur/frontdoor.jsp?otp=private-ui-token&cshc=private-checksum&startURL=lightning%2Fo%2FOpportunity%2Flist`;
const reply = (body: unknown, status = 200) => Response.json(body, { status });

test('RS256 signature, subject/audience/expiry and unique replay identifier', () => {
  const now = 1_800_000_000_000;
  const jwt = createAssertion(config, now);
  const parts = jwt.split('.');
  const header = JSON.parse(Buffer.from(parts[0]!, 'base64url').toString());
  const claims = JSON.parse(Buffer.from(parts[1]!, 'base64url').toString());
  assert.equal(header.alg, 'RS256');
  assert.equal(claims.iss, config.clientId);
  assert.equal(claims.sub, config.username);
  assert.equal(claims.aud, config.audience);
  assert.equal(claims.exp, now / 1000 + 120);
  assert.ok(verify('RSA-SHA256', Buffer.from(`${parts[0]}.${parts[1]}`), keys.publicKey, Buffer.from(parts[2]!, 'base64url')));
  assert.notEqual(claims.jti, JSON.parse(Buffer.from(createAssertion(config, now).split('.')[1]!, 'base64url').toString()).jti);
});

test('configuration rejects missing app, unsafe audience and invalid key', () => {
  assert.throws(() => readJwtConfig({}), /SF_CLIENT_ID/);
  const env = { SF_SALES_USERNAME: config.username, SF_CLIENT_ID: config.clientId, SF_JWT_PRIVATE_KEY: config.privateKey };
  assert.equal(readJwtConfig(env).audience, config.audience);
  assert.throws(() => readJwtConfig({ SF_USERNAME: 'configuration-admin@example.com', SF_CLIENT_ID: config.clientId, SF_JWT_PRIVATE_KEY: config.privateKey }), /SF_SALES_USERNAME/);
  assert.throws(() => readJwtConfig({ ...env, SF_JWT_AUDIENCE: 'https://attacker.example' }), /SF_JWT_AUDIENCE/);
  assert.throws(() => readJwtConfig({ ...env, SF_JWT_PRIVATE_KEY: 'secret-broken-pem' }), /RSA private key/);
  const ec = generateKeyPairSync('ec', { namedCurve: 'prime256v1' }).privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  assert.throws(() => createAssertion({ ...config, privateKey: ec }), /RSA private key/);
});

test('JWT grant and UI Bridge requests use the exact org and return separate secrets', async () => {
  const requests: Array<{ url: string; init: RequestInit }> = [];
  const fetcher: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), init: init! });
    return requests.length === 1 ? reply({ access_token: 'private-access-token', instance_url: config.baseUrl }) : reply({ frontdoor_uri: frontdoor });
  };
  assert.deepEqual(await requestUiBridge(config, fetcher), { otp: 'private-ui-token', cshc: 'private-checksum' });
  assert.equal(requests.length, 2);
  assert.equal(requests[0]!.url, `${config.baseUrl}/services/oauth2/token`);
  assert.equal(requests[1]!.url, `${config.baseUrl}/services/oauth2/singleaccess`);
  for (const request of requests) {
    assert.equal(request.init.method, 'POST');
    assert.equal(request.init.redirect, 'error');
    assert.ok(request.init.signal);
  }
  const body = requests[0]!.init.body as URLSearchParams;
  assert.equal(body.get('grant_type'), 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  assert.ok(body.get('assertion')?.split('.').length === 3);
  assert.equal(new Headers(requests[1]!.init.headers).get('authorization'), 'Bearer private-access-token');
  assert.equal((requests[1]!.init.body as URLSearchParams).get('redirect_uri'), 'lightning/o/Opportunity/list');
  assert.equal(body.has('password'), false);
});

test('different instance origin is rejected before access token can leave the org', async () => {
  let count = 0;
  await assert.rejects(requestUiBridge(config, async () => {
    count++;
    return reply({ access_token: 'private-access-token', instance_url: 'https://attacker.example' });
  }), /different org/);
  assert.equal(count, 1);
});

test('foreign, injected, duplicated and incomplete UI Bridge destinations are rejected', async () => {
  const invalid = [
    frontdoor.replace(config.baseUrl, 'https://attacker.example'),
    frontdoor.replace('/secur/frontdoor.jsp', '/other'),
    `${frontdoor}&unexpected=private-value`, `${frontdoor}&otp=another-token`,
    frontdoor.replace('lightning%2Fo%2FOpportunity%2Flist', 'https%3A%2F%2Fattacker.example'),
    frontdoor.replace('private-ui-token', ''), `${frontdoor}#secret-fragment`,
    frontdoor.replace('https://', 'https://user:password@'),
  ];
  for (const destination of invalid) {
    let calls = 0;
    await assert.rejects(requestUiBridge(config, async () => ++calls === 1
      ? reply({ access_token: 'private-access-token', instance_url: config.baseUrl })
      : reply({ frontdoor_uri: destination })), /unexpected destination|incomplete session/);
  }
});

test('OAuth errors disclose only allowlisted codes; no response, token or native cause', async () => {
  for (const response of [
    reply({ error: 'invalid_grant', error_description: 'private-response-secret' }, 400),
    reply({ error: 'private-response-secret' }, 400),
    new Response('private-html-secret', { status: 500 }),
  ]) {
    await assert.rejects(requestUiBridge(config, async () => response), (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.doesNotMatch(error.message, /private-/);
      assert.equal(error.cause, undefined);
      return true;
    });
  }
  await assert.rejects(requestUiBridge(config, async () => { throw new Error('private-native-secret'); }), /network request failed/);
});

test('UI Bridge plaintext scope failure remains actionable without a password fallback', async () => {
  let calls = 0;
  await assert.rejects(requestUiBridge(config, async () => ++calls === 1
    ? reply({ access_token: 'private-access-token', instance_url: config.baseUrl })
    : new Response('Invalid_Scope', { status: 400 })), /Invalid_Scope/);
  assert.equal(calls, 2);
});
