# SF-AUTH — E2E Sales Manager JWT → Lightning session setup

[All test designs](https://github.com/ak91hu/sf-e2e-tst/wiki) · [Executable source](https://github.com/ak91hu/sf-e2e-tst/blob/main/tests/auth.setup.e2e.ts) · [Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

**Role:** E2E Sales Manager

**Preconditions:** ECA Web scope, JWT enabled, user preauthorization assigned; no interactive email code required.

**Test data:** Private JWT key, preauthorized client and role user; secrets excluded from design and public report.

The following steps define expected behavior. Execution status is recorded in Allure and [verification evidence](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/VERIFICATION.md); this page does not claim an execution result. Generated dates, names and IDs are substituted at runtime.

| Action | Data | Expected output |
| --- | --- | --- |
| 1. Start role-specific JWT / singleaccess authentication; follow the real Got it UI link if a future maintenance notice appears. | JWT role E2E Sales Manager; configured client and RSA key; OTP/checksum values withheld. | Native Lightning login completes without interactive code; tokens and nested redirect session parameters redacted. |
| 2. Verify Opportunity list and View profile. | Role E2E Sales Manager; /lightning/o/Opportunity/list; View profile. | Search this list visible; New visible; profile name exactly E2E Sales Manager. |
| 3. session.save('salesforce'). | Session name: salesforce; authenticated browser storage. | Authenticated session can be saved; no business data changed. |

Generated from [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Update the source, then run `npm run design:generate` and `npm run wiki:generate`.
