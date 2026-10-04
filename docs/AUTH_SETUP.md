# Authentication and one-time Salesforce configuration

This org already has the External Client App, certificate and both business personas configured. Regression opens fresh Lightning sessions using **JWT + Single Access UI Bridge**, without passwords or recurring email codes. Unexpected interactive authentication fails clearly. Future maintenance notices are acknowledged through the real **Got it** UI link.

## Current configuration

- External Client App: `Opportunity_E2E_Regression`, local distribution.
- RSA-2048 certificate: `.e2e-auth/jwt.crt`, expiry **2027-10-02**; private key `.e2e-auth/jwt.key`.
- Scopes: **Web and RefreshToken**; API scope removed. Refresh tokens are not stored.
- Policy: **Admin approved users are pre-authorized**; permission set `Opportunity_E2E_JWT`.
- Authorized identities: configuration administrator, E2E Sales Manager and E2E Service Manager. Business regression uses the latter two.
- IP enforcement and a 120-minute session policy remain enabled; global MFA/IP protections were not weakened.
- Consumer Key is configured locally/through CI secrets; no Consumer Secret is required.

The engine registers dynamic SID/contentDoor redirect parameters and session cookies with the official Secret redaction mechanism before UI observation. The saved session retains this protection.

## Configure another org

One-time administrative configuration uses Salesforce CLI **2.152.14** and administrator OAuth. Neither administrator credentials nor the CLI are needed during normal regression.

```powershell
npm run auth:keys
npm exec --yes --package=@salesforce/cli@2.152.14 -- sf org login web --instance-url <org-URL>
npm run auth:provision
npm run features:provision
npm run users:provision
npm run users:setup
npm run doctor
npm run test:auth
npm run test:roles
```

`SF_USERNAME` identifies the configuration administrator. Provisioning uses the official Salesforce SDK to configure the owned application, QuoteSettings, minimal profiles/layout, permission sets, roles and users. These calls configure the test environment; they do not seed business test records.

`auth:provision` uses an ownership journal for the application. `features:provision` preserves the original QuoteSettings backup. `users:provision` needs two free Salesforce licenses and does not deactivate existing users. Quotes appears on a dedicated Opportunity layout; the standard layout is preserved. Local provisioning journals and ZIPs are excluded from Git under `.e2e-auth/provisioning`.

`users:setup` completes initial password and security-question setup through UI using Secret fields. Bootstrap data stays in `.e2e-auth/persona-setup.json`. Provisioning does not reset an existing persona's password; repeated UI setup verifies Lightning access for an active user.

## Runtime configuration

```dotenv
SF_BASE_URL=https://<org>.develop.my.salesforce.com
SF_SALES_USERNAME=<Sales Manager username>
SF_SERVICE_USERNAME=<Service Manager username>
SF_CLIENT_ID=<Consumer Key>
SF_JWT_PRIVATE_KEY_FILE=.e2e-auth/jwt.key
SF_JWT_AUDIENCE=https://login.salesforce.com
```

Developer Edition uses `login.salesforce.com`; a Salesforce sandbox uses `test.salesforce.com`. Current URL validation restricts Developer Edition My Domains; supporting another org type requires an intentional validation update. Authentication requests are restricted to the configured My Domain origin.

`support/auth-engine.ts` uses public `defineEngine` and `EngineAttemptContext.resolveSecret` contracts. OTP/checksum values remain inside the engine; its own `session.open` performs navigation. The outer recorded step names only the persona, so credential URLs do not enter public `browser.goto` labels. Secret registration and screenshot protection remain native framework behavior.

Business Lightning login never fills a password/token into the visible UI, allowing automatic failure screenshots. Initial password/security-question bootstrap and the conservative fallback form still use Secret fields; the framework suppresses subsequent images. Trace and video are disabled.

Sales and Service have separate setup sessions. Switching roles clears browser state, opens a fresh JWT session and verifies the visible profile name. Business setup rejects administrator identities; Opportunity New has a separate administrator guard.

## CI and maintenance

Required authentication secrets: `SF_SALES_USERNAME`, `SF_SERVICE_USERNAME`, `SF_CLIENT_ID`, `SF_JWT_PRIVATE_KEY` containing complete PEM with actual line breaks. Administrator credentials, passwords, email codes and model keys are unnecessary. Renew the certificate, application certificate and CI key before expiry. `auth:keys` does not overwrite an existing private key.

All created sandbox test records remain permanently, including Opportunity, Quote and their supporting records. Automatic cleanup, direct deletion and targeted destructive recovery are disabled. Use exact `.e2e-data` journals and Allure record links for inspection. Never delete supporting parents, which can cascade to retained records. Opportunity creation still rejects administrators.

Verification commands: `npm run test:unit`, `npm run test:auth-harness`, `npm run test:evidence-harness`, `npm run test:auth`. Synthetic harnesses intercept all requests and verify Secret fallback, native login, maintenance redirects, redacted text and automatic screenshot availability. The live authentication test proves actual Salesforce access.

Sources: [Salesforce JWT bearer flow](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_jwt_flow_ca.htm&language=en_US&type=5), [preauthorization](https://developer.salesforce.com/docs/analytics/sdk/guide/sdk-setup-auth-extended.html), [Single Access UI Bridge](https://help.salesforce.com/s/articleView?id=sf.frontdoor_singleaccess.htm&language=en_US&type=5).
