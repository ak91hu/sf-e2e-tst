# Salesforce Opportunity, Contract and Quote UI regression

[![TesterArmy e2e](https://img.shields.io/badge/TesterArmy_e2e-0.16.0-6547c2)](https://tester.army/e2e)
[![Web engine](https://img.shields.io/badge/e2e_Web_engine-0.11.2-6547c2)](https://github.com/tester-army/e2e)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Compiler API compatibility](https://img.shields.io/badge/TypeScript_API_compatibility-6.0.2-3178c6)](docs/VERSIONS.md)
[![Node types](https://img.shields.io/badge/Node_types-26.6.4-339933)](https://www.npmjs.com/package/@types/node)
[![Node.js](https://img.shields.io/badge/Node.js-26.10.0-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-12.2.0-cb3837?logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.63.0-2ead33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Allure](https://img.shields.io/badge/Allure_Report-3.20.0-e84659)](https://allurereport.org/)
[![Allure SDK](https://img.shields.io/badge/Allure_JS_SDK-3.13.0-e84659)](https://github.com/allure-framework/allure-js)
[![Zod](https://img.shields.io/badge/Zod-4.6.5-3e67b1?logo=zod&logoColor=white)](https://zod.dev/)
[![AI SDK](https://img.shields.io/badge/AI_SDK-7.0.127-111111)](https://ai-sdk.dev/)
[![OpenAI provider](https://img.shields.io/badge/AI_SDK_OpenAI-4.0.83-111111)](https://ai-sdk.dev/providers/ai-sdk-providers/openai)
[![Netlify](https://img.shields.io/badge/Netlify_CLI-27.10.2-00c7b7?logo=netlify&logoColor=white)](docs/GITHUB_NETLIFY.md)
[![GitHub Actions](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml/badge.svg)](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml)
[![Salesforce](https://img.shields.io/badge/Salesforce-Lightning-00a1e0?logo=salesforce&logoColor=white)](https://developer.salesforce.com/)
[![Salesforce CLI](https://img.shields.io/badge/Salesforce_CLI-2.152.14-00a1e0?logo=salesforce&logoColor=white)](docs/AUTH_SETUP.md)
[![UI tests](https://img.shields.io/badge/Business_tests-100%25_UI-success)](docs/TEST_DESIGN.md)

Automated Salesforce Lightning regression with TesterArmy e2e, TypeScript and Chromium. **The complete suite contains exactly 100 UI results: 98 cases and two UI-verified session setups.** Business fixtures, actions and persisted-data assertions all use the UI. JWT authentication and one-time administrative provisioning remain infrastructure.

**Every created sandbox test record remains permanently.** Opportunity and Quote deletion is forbidden, and supporting Accounts, Contracts, Cases, Products and Price Books also remain. Deletion dialogs are inspected only when cancelled. Automatic teardown performs no deletion; both the legacy recovery command and direct record deletion are blocked.

**Successful Allure results include a redacted PNG screenshot and direct Salesforce links to every saved record created by the case.** The retained-records JSON attachment and permanent `.e2e-data` journal preserve exact names, IDs and URLs. Failed results retain their detailed logs, original failure URL and automatic failure screenshot.

Previous executions are historical evidence for earlier suite versions; they do not prove a complete 100-result run. Current checks and completed live execution evidence belong in [VERIFICATION.md](docs/VERIFICATION.md). [Repository](https://github.com/ak91hu/sf-e2e-tst) · [Actions](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml) · [Published Allure](https://sf-e2e-tst-allure-ak91hu.netlify.app) · [Test design wiki](https://github.com/ak91hu/sf-e2e-tst/wiki).

## Documentation

| Document | Contents |
| --- | --- |
| [Test designs](docs/TEST_DESIGN.md) | 100 designs and 883 explicit Action / Data / Expected output steps. |
| [Wiki sources](docs/wiki/Home.md) | Generated case pages and index. |
| [Authentication setup](docs/AUTH_SETUP.md) | Role-specific JWT authentication and provisioning. |
| [GitHub and Netlify](docs/GITHUB_NETLIFY.md) | CI configuration and report publication. |
| [Verification](docs/VERIFICATION.md) | Actual completed-run evidence and limitations. |
| [POM review](docs/POM_REVIEW.md) | Page Object Model design and historical review. |
| [Version audit](docs/VERSIONS.md) | Exact component pins and primary sources. |

Older review and execution documents describe historical cleanup behavior. The current permanent-retention requirements in [AGENTS.md](AGENTS.md) govern all future work.

## Coverage

| IDs | Count | Behavior |
| --- | ---: | --- |
| SF-AUTH, SF-AUTH-SERVICE | 2 | Sales and Service JWT sessions, visible persona verification and PNG evidence. |
| SF-AUTH-001 | 1 | Opportunity list and New action. |
| SF-OPP-001–034 | 34 | Sales lifecycle, required fields, cancellation, amounts and dates, descriptions, probability boundaries, Next Step clearing, order/competitor/tracking fields and isolation under a shared Account. |
| SF-CON-001–023 | 23 | Draft, required fields, term boundaries, date and terms editing/cancellation, multiline/empty terms, activation, shared-Account isolation and ownership marker revision. |
| SF-QUO-001–031 | 31 | Draft, required name, cancellation, lifecycle, products/synchronization, charge boundaries and independent recalculation, expiry, descriptions, repeated rename and isolation across parents. |
| SF-ROLE-001–003 | 3 | Sales ownership, Service create restrictions and Service Case creation/editing. |
| SF-E2E-001–003 | 3 | Sales-to-Service handoff, complete product sale and lost-sale recovery. |
| SF-AI-001–003 | 3 | Natural-language Opportunity, Contract and Quote UI actions with deterministic persisted UI assertions. |
| **Total** | **100** | **98 UI cases + 2 session setups.** |

`npm run test:all` and CI select all 100 results, including the three AI UI cases. `npm run test:regression` selects 95 standard cases plus two setups, 97 results, without model access. Filtered reports contain only selected cases and their dependencies. `design:check` verifies the exact full-suite count.

## Quick start

Use Node.js 26.10.0 and npm 12.2.0; the supported runtime minimum is Node 24. Copy `.env.example` to `.env` and configure the preauthorized personas, Consumer Key and RSA private key using [AUTH_SETUP.md](docs/AUTH_SETUP.md).

```powershell
npm ci --no-audit --no-fund
npm run install:browsers
npm run doctor
npm run typecheck
npm run test:unit
npm run pom:check
npm run design:check
npm run wiki:check
npm run test:evidence-harness
npm run test:all
npm run allure:generate
npm run allure:open
```

Linux/CI browser dependencies: `npm run install:browsers -- --with-deps`. Browsers live in `.browsers`. AI cases use the configured ChatGPT login or Gateway credentials; see [authentication setup](docs/AUTH_SETUP.md). `test:regression` needs no AI model.

## Roles and configuration

Target: `https://orgfarm-80a620fbaf-dev-ed.develop.my.salesforce.com`. E2E Sales Manager owns Opportunities; UI assertions verify Owner and Created By. E2E Service Manager uses a separate session for permission checks, Case operations and the read-only Contract handoff. Administrators cannot create business Opportunities.

Configure `SF_BASE_URL`, `SF_SALES_USERNAME`, `SF_SERVICE_USERNAME`, `SF_CLIENT_ID`, `SF_JWT_PRIVATE_KEY_FILE` or `SF_JWT_PRIVATE_KEY`, `SF_JWT_AUDIENCE`, and optionally `SF_TIME_ZONE`, `SF_OPPORTUNITY_RECORD_TYPE`, `SF_STAGE_*` and configured Won/Lost probabilities. Local `.env` values never overwrite existing process/CI variables. Secrets, sessions and private keys are excluded from Git and reports.

Dates entered relative to today use UTC; Salesforce's automatic Closed Won date follows `SF_TIME_ZONE`. Contract relates to these workflows through the Account; standard Quote relates directly to Opportunity.

## Commands and structure

| Command | Purpose |
| --- | --- |
| `npm run test:all` | All 100 UI results in one report, including AI. |
| `npm run test:regression` | 97 standard UI results without a model. |
| `npm run test:list` | Collect standard cases and dependencies. |
| `npm run test:e2e -- --grep SF-OPP-018` | Run one selected case and its setup. |
| `npm run test:opportunity` / `test:quote` / `test:contract` | Object-specific regression. |
| `npm run test:roles` / `test:integration` / `test:monolithic` | Permissions or cross-object workflows. |
| `npm run report` | Current execution summary and original exit code. |
| `npm run report:verify-retention -- <output-directory>` | Verify all 100 passed results, successful PNGs and every retained record link. |
| `npm run allure:generate` / `allure:open` | Build the completed current report / open locally. |
| `npm run allure:deploy` | Publish the generated report to Netlify. |
| `npm run design:generate` / `wiki:generate` | Regenerate shared test designs and wiki sources. |

One worker, zero retries, 10-minute case timeout and 45-second action timeout. Run only one live suite against the org at a time. Each case has isolated browser state and unique owned data. CI queues live runs.

Tests call page objects in `pages/`; shared UI operations live in `support/sales-ui.ts`. `support/core-fixtures.ts` captures completion evidence and publishes permanent record links. `reporting/allure.ts` exports only the completed run's selected results and redacted evidence. Semantic UI locators and visible DOM fields provide persisted-data checks. Business API calls, raw selectors and sleeps in test bodies are rejected by `pom:check`.

## Reports and retained data

Default results: `.e2e/report.json`, `junit.xml`, `summary.md`; redacted evidence: `.e2e/artifacts`; SDK results: `.e2e/allure-results/<run-id>`; generated HTML: `allure-report/index.html`. The current manifest verifies run identity and counts. A custom `--output` directory keeps validation evidence separate from previous runs.

Open a successful result for **Screenshot of successful UI run**, **Permanently retained sandbox records**, and direct Account/Opportunity/Quote/other record links. Cases that create no records have a completion PNG and an empty retained-record manifest. Authentication setups have persona-verification PNGs. Failed results preserve **Detailed attempt log**, **Failure URL** and **Screenshot at failure**.

`report:verify-retention` requires 100 passed results by default. Use `--evidence-only` with a full-run output directory to verify successful evidence in a failed run while preserving its original failed statuses and exit code.

The evidence harness uses intercepted browser pages and no Salesforce data. Three intentional failure probes validate existing diagnostics; one successful probe validates PNGs and exact retained Opportunity/Quote links. Its wrapper passes only when all evidence checks succeed.

Before Save, every fixture receives a unique `E2E-TA-` name and permanent journal entry. Teardown never deletes saved records, even after a failure. Unsaved cancelled or rejected forms can be marked absent only after UI proof. `npm run data:recover` is disabled and fails explicitly; never run external cleanup or delete supporting parents, which could cascade to retained records.

CI runs the full suite and generates its current report even after test failures. Source and reporting checks remain credential-free. Publication follows the repository workflow; local changes do not automatically update the public report or remote wiki. Trace/video stay disabled; only redacted evidence is attached.
