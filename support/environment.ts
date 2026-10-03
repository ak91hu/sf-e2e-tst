import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// The runner does not load .env itself. Existing process variables win in CI.
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) process.loadEnvFile(envPath);

export function readEnvironment(env: NodeJS.ProcessEnv = process.env) {
  const baseUrl = env.SF_BASE_URL ?? 'https://orgfarm-80a620fbaf-dev-ed.develop.my.salesforce.com';
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.develop.my.salesforce.com')) {
    throw new Error('SF_BASE_URL must be an HTTPS Salesforce Developer Edition org (*.develop.my.salesforce.com).');
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/' || parsed.port) {
    throw new Error('SF_BASE_URL must contain only the Salesforce org origin.');
  }
  const provider = env.E2E_MODEL_PROVIDER ?? 'chatgpt';
  if (provider !== 'chatgpt' && provider !== 'gateway') {
    throw new Error('E2E_MODEL_PROVIDER must be chatgpt or gateway.');
  }
  const percentage = (key: string, fallback: number) => {
    const value = env[key] === undefined ? fallback : Number(env[key]);
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`${key} must be between 0 and 100.`);
    return value;
  };
  return {
    baseUrl: parsed.origin,
    username: env.E2E_USER_SALESFORCE_USERNAME ?? env.SF_SALES_USERNAME ?? '',
    salesName: 'E2E Sales Manager',
    serviceUsername: env.SF_SERVICE_USERNAME ?? '',
    provider,
    model: env.E2E_MODEL || (provider === 'chatgpt' ? 'gpt-6-luna' : 'openai/gpt-6-luna-fast'),
    recordType: env.SF_OPPORTUNITY_RECORD_TYPE ?? '',
    stages: {
      initial: env.SF_STAGE_INITIAL ?? 'Prospecting',
      qualified: env.SF_STAGE_QUALIFIED ?? 'Qualification',
      proposal: env.SF_STAGE_PROPOSAL ?? 'Proposal/Price Quote',
      negotiation: env.SF_STAGE_NEGOTIATION ?? 'Negotiation/Review',
      won: env.SF_STAGE_WON ?? 'Closed Won',
      lost: env.SF_STAGE_LOST ?? 'Closed Lost',
    },
    wonProbability: percentage('SF_WON_PROBABILITY', 100),
    lostProbability: percentage('SF_LOST_PROBABILITY', 0),
  };
}

export const environment = readEnvironment();
