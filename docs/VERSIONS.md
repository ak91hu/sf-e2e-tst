# Component version audit

Checked **2026-10-03** against npm's latest stable dist-tag, official Node release metadata and GitHub's latest stable Action releases. All direct components below use the latest stable release at the audit date. Versions are pinned and installation is reproducible through package-lock.json.

| Component | Used / latest stable |
| --- | --- |
| tester.army `e2e` | 0.16.0 |
| `@e2e-dev/web` | 0.11.2 |
| Playwright | 1.63.0 |
| TypeScript native compiler | 7.0.2 |
| `@typescript/typescript6` compiler API compatibility | 6.0.2 |
| `@types/node` | 26.6.4 |
| `ai` | 7.0.127 |
| `@ai-sdk/openai` | 4.0.83 |
| Zod | 4.6.5 |
| Allure Report | 3.20.0 |
| `allure-js-commons` | 3.13.0 |
| Netlify CLI | 27.10.2 |
| Salesforce CLI (one-time configuration) | 2.152.14 |
| Node.js | 26.10.0 |
| npm | 12.2.0 |
| `actions/checkout` | v7.0.1 |
| `actions/setup-node` | v7.0.0 |
| `actions/cache` (restore/save) | v6.1.0 |
| `actions/upload-artifact` | v7.0.1 |

The separate local workflow validator actionlint is **v1.7.12**, also its latest stable release at the audit date. Salesforce Lightning is a hosted service, so its org release is controlled by Salesforce rather than npm pins. Chromium is installed by the pinned Playwright release.

## TypeScript 7 and compiler API compatibility

Type checking uses the latest native **TypeScript 7.0.2**. TypeScript 7.0 does not ship the old programmatic compiler API. Netlify's ts-api-utils dependency requires that API; assigning TypeScript 7 to its `typescript` import previously caused a deployment startup failure.

The project follows [Microsoft's official side-by-side recommendation](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/):

```json
{
  "typescript": "npm:@typescript/typescript6@6.0.2",
  "typescript-native": "npm:typescript@7.0.2"
}
```

`npm run typecheck` explicitly invokes the native compiler, while API consumers resolve the latest published compatibility package. This keeps the compiler current and the deployment dependency compatible. Both packages are official Microsoft releases, with exact alias pins in the lockfile.

## Salesforce web-engine compatibility

Web engine **0.11.2** still calls getElementById on a Salesforce synthetic ShadowRoot, which rejects that operation. `scripts/patch-web-engine.mjs` applies the reviewed scoped IDREF lookup fix only when both the package version and exact source match. Document behavior is preserved; DocumentFragment uses a scoped escaped-ID query. Unexpected upstream code fails installation for review. The synthetic ShadowRoot UI case verifies this path.

## Repeat the audit

```powershell
npm run versions:check
```

The read-only audit compares all direct package pins and lockfile versions to primary npm metadata, checks Node/.nvmrc and npm/workflow consistency, and checks the four Action repositories. It exits nonzero when a newer stable release exists. It deliberately does not run inside every regression, so an upstream release does not unexpectedly change or fail business testing.

Transitive packages follow upstream compatibility ranges and the committed lockfile. They are not forcibly replaced with potentially incompatible newest majors. Updating a direct component requires a fresh audit, typecheck, source/POM/design/wiki checks, synthetic auth/failure-evidence checks, and live UI regression before claiming compatibility.

Sources: [npm registry](https://registry.npmjs.org/), [official Node releases](https://nodejs.org/dist/index.json), [e2e releases](https://github.com/tester-army/e2e/releases), [Microsoft TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [Allure Report releases](https://github.com/allure-framework/allure3/releases), [Allure JS releases](https://github.com/allure-framework/allure-js/releases), [Netlify CLI releases](https://github.com/netlify/cli/releases), [Salesforce CLI releases](https://github.com/salesforcecli/cli/releases), [checkout](https://github.com/actions/checkout/releases), [setup-node](https://github.com/actions/setup-node/releases), [cache](https://github.com/actions/cache/releases), [upload-artifact](https://github.com/actions/upload-artifact/releases), [actionlint](https://github.com/rhysd/actionlint/releases).
