import { generateKeyPairSync } from 'node:crypto';
import main from './e2e.config.ts';
import { requestUiBridge } from './support/oauth.ts';
import { environment } from './support/environment.ts';
import { salesforceWeb } from './support/auth-engine.ts';

// Synthetic responses only: this harness never contacts Salesforce or an AI.
const config = {
  baseUrl: environment.baseUrl, username: 'synthetic-test@example.com', clientId: 'synthetic-client',
  audience: 'https://login.salesforce.com',
  privateKey: generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
};
let bridge: ReturnType<typeof requestUiBridge> | undefined;
async function field(name: 'otp' | 'cshc') {
  bridge ??= requestUiBridge(config, async input => String(input).endsWith('/token')
    ? Response.json({ access_token: 'synthetic-access-token', instance_url: config.baseUrl })
    : Response.json({ frontdoor_uri: `${config.baseUrl}/secur/frontdoor.jsp?otp=synthetic-ui-otp-canary&cshc=synthetic-ui-checksum-canary&startURL=lightning%2Fo%2FOpportunity%2Flist` }));
  return (await bridge)[name];
}
export default {
  ...main, projectId: 'ui-bridge-local-validation', tests: ['validation/ui-bridge.e2e.ts', 'validation/shadow-dom.e2e.ts', 'validation/numeric-input.e2e.ts'],
  targets: [{ ...main.targets[0], engine: salesforceWeb({ browser: 'chromium', viewport: { width: 1440, height: 1000 } }, ['sales']) }],
  secrets: { salesforceUiToken: () => field('otp'), salesforceUiChecksum: () => field('cshc') },
};
