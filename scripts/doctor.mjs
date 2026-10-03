import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { readEnvironment } from '../support/environment.ts';
import { readJwtConfig } from '../support/oauth.ts';

const require = createRequire(import.meta.url);
let failed = false;
function check(label, ok, hint = '') {
  console.log(`${ok ? 'OK' : 'HIÁNYZIK'} | ${label}${hint ? ` | ${hint}` : ''}`);
  failed ||= !ok;
}

const major = Number(process.versions.node.split('.')[0]);
check('Node.js >= 24', major >= 24);
let environment;
try {
  environment = readEnvironment();
  check('Salesforce Developer Edition URL és konfiguráció', true);
} catch (error) {
  check('Salesforce konfiguráció', false, error.message);
}
check('Sales Manager tesztfelhasználó', Boolean(process.env.SF_SALES_USERNAME));
check('Service Manager tesztfelhasználó', Boolean(process.env.SF_SERVICE_USERNAME));
try {
  readJwtConfig();
  check('Salesforce JWT alkalmazás és RSA kulcs (értékek nélkül)', true);
} catch (error) {
  check('Salesforce JWT előfeltételek', false, error.message);
}
for (const name of ['e2e', '@e2e-dev/web', 'playwright', 'ai', '@ai-sdk/openai', 'zod', 'typescript', 'allure', 'allure-js-commons', 'netlify-cli']) {
  let installed = false;
  try { installed = name === 'netlify-cli' ? existsSync(resolve('node_modules/netlify-cli/bin/run.js')) : Boolean(require.resolve(name)); } catch {}
  check(`Csomag: ${name}`, installed, installed ? '' : 'npm install');
}
try {
  process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve('.browsers');
  const { chromium } = await import('playwright');
  check('Playwright Chromium telepítve', existsSync(chromium.executablePath()), 'npm run install:browsers');
} catch {
  check('Playwright Chromium telepítve', false, 'npm install; npm run install:browsers');
}
if (process.env.E2E_ENABLE_AI === '1' && environment?.provider === 'gateway') {
  check('AI_GATEWAY_API_KEY', Boolean(process.env.AI_GATEWAY_API_KEY), 'CI-hez API-kulcs szükséges.');
} else if (process.env.E2E_ENABLE_AI === '1' && environment) {
  const oauthPath = resolve(process.env.XDG_CONFIG_HOME || resolve(homedir(), '.config'), 'e2e', 'oauth.json');
  let savedLogin = false;
  try {
    const state = JSON.parse(process.env.E2E_OAUTH_CREDENTIALS || readFileSync(oauthPath, 'utf8'));
    savedLogin = Boolean(state.openai);
  } catch {}
  check('Mentett e2e ChatGPT modellhitelesítés (token nincs kiírva)', savedLogin,
    savedLogin ? 'A távoli érvényességét csak a modellhívás igazolja.' : 'npx e2e login openai');
}
if (process.env.E2E_ENABLE_AI !== '1') console.log('OK | A normál UI-regresszió nem igényel AI-modellt vagy modellkulcsot.');
check('Bejelentkezési teszt', existsSync(resolve('tests/auth.setup.e2e.ts')));
check('Opportunity tesztkészlet', existsSync(resolve('tests/opportunity.e2e.ts')));
console.log('A böngésző telepítéséhez: npm run install:browsers');
console.log('Ez az ellenőrzés nem lép be a Salesforce-ba, és nem futtat üzleti teszteket.');
process.exitCode = failed ? 2 : 0;
