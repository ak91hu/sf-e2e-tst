import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

if (process.env.E2E_MODEL_PROVIDER === 'gateway') {
  if (!process.env.AI_GATEWAY_API_KEY) throw new Error('AI_GATEWAY_API_KEY is required for all three AI UI cases.');
  console.log('AI Gateway credential configured; values withheld.');
} else {
  let state;
  try { state = JSON.parse(process.env.MODEL_AUTH_JSON || ''); }
  catch { throw new Error('Configure the E2E_OAUTH_CREDENTIALS repository secret with the authorized e2e ChatGPT login.'); }
  const credential = state?.openai;
  if (!credential || typeof credential.access !== 'string' || credential.access.length < 8
    || typeof credential.refresh !== 'string' || credential.refresh.length < 8
    || !Number.isFinite(credential.expires)) throw new Error('The ChatGPT credential secret has an invalid structure.');
  // GitHub masks the complete JSON secret; also mask each individual token.
  for (const value of [credential.access, credential.refresh]) {
    const escaped = value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
    if (process.env.GITHUB_ACTIONS === 'true') console.log(`::add-mask::${escaped}`);
  }
  const directory = resolve(process.env.XDG_CONFIG_HOME || resolve(homedir(), '.config'), 'e2e');
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
  // A private file permits SDK token refresh during this run. The CI artifact
  // whitelist never includes OS credentials; nothing is written to the repo.
  writeFileSync(resolve(directory, 'oauth.json'), JSON.stringify({ openai: credential }), { mode: 0o600 });
  chmodSync(resolve(directory, 'oauth.json'), 0o600);
  console.log('Authorized ChatGPT model login configured; values withheld.');
}
