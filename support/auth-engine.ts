import { secrets, test as untypedTest, type TestAPI, type TestFixtures } from 'e2e';
import { defineEngine, type EngineAttemptContext, type EngineFixtureContext } from 'e2e/engine';
import { web, type Browser, type WebOptions } from '@e2e-dev/web';
import { environment } from './environment.ts';

export type Persona = 'sales' | 'service';
export interface SalesforceAuth { open(persona: Persona): Promise<void> }
export const test = untypedTest as unknown as TestAPI<TestFixtures & { browser: Browser; salesforceAuth: SalesforceAuth }>;

// Extend the documented engine contract. Authentication values are held by
// the engine and registered for redaction before navigation; no credential is
// entered into the application's UI. The framework's Secret-fill screenshot
// prohibition remains intact for password/bootstrap tests.
export function salesforceWeb(options: WebOptions = {}, personas: readonly Persona[] = ['sales', 'service']) {
  const base = web(options);
  const handles = {
    sales: [secrets.get('salesforceUiToken'), secrets.get('salesforceUiChecksum')],
    service: [secrets.get('serviceUiToken'), secrets.get('serviceUiChecksum')],
  } as const;
  let attempt: EngineAttemptContext | undefined;
  const browsers = new WeakMap<EngineFixtureContext, Browser>();
  const browserFixture = (context: EngineFixtureContext) => {
    let browser = browsers.get(context);
    if (!browser) { browser = base.fixtures!.browser(context) as Browser; browsers.set(context, browser); }
    return browser;
  };
  // capabilities and the brand are computed by defineEngine, not body fields.
  const { capabilities: _capabilities, ...body } = base;
  return defineEngine({
    ...body, name: 'salesforce-web', version: `${base.version}-auth.1`,
    secrets: personas.flatMap(persona => [...handles[persona]]),
    async startAttempt(context) { attempt = context; await base.startAttempt?.(context); },
    async endAttempt(context) { try { await base.endAttempt?.(context); } finally { attempt = undefined; } },
    fixtures: {
      ...base.fixtures,
      browser: browserFixture,
      salesforceAuth(context) {
        const browser = browserFixture(context);
        return context.fixture<SalesforceAuth>('salesforceAuth', {
          async open(persona) {
            if (!personas.includes(persona) || !attempt) throw new Error('Authentication persona is unavailable in this engine attempt.');
            attempt.signal.throwIfAborted();
            const url = new URL(context.app.resolveUrl('/secur/frontdoor.jsp'));
            if (url.origin !== environment.baseUrl) throw new Error('Authentication target differs from the configured Salesforce org.');
            const derived = (value: string) => [encodeURIComponent(value), new URLSearchParams({ v: value }).toString().slice(2)];
            const otp = await attempt.resolveSecret(handles[persona][0], { derived });
            const checksum = await attempt.resolveSecret(handles[persona][1], { derived });
            url.search = new URLSearchParams({ otp, cshc: checksum, startURL: 'lightning/o/Opportunity/list' }).toString();
            // Keep the credential-bearing URL inside the engine operation.
            // Public browser.goto records its label before executing; late
            // secret registration in e2e 0.15.1 does not rewrite that label.
            // The outer operation records only the persona and its outcome.
            try { await base.session!.open!(url.href, context.operation(45_000)); }
            catch {
              // A browser error page can render the navigation URL. Replace
              // it with a token-free page before failure pixels are captured.
              await browser.route('**/__e2e__/auth-failed', route => route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: '<title>Authentication failed</title><p>Salesforce authentication did not complete.</p>' }));
              await browser.goto('/__e2e__/auth-failed', { timeout: 5000 }).catch(() => undefined);
              throw new Error('Native Salesforce authentication failed. Check OAuth authorization and session policies.');
            }
          },
        }, { open: { kind: 'resource', label: persona => `Native Salesforce authentication (${persona})`, timeout: 45_000 } });
      },
    },
  });
}
