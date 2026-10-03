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

Automated regression with [TesterArmy e2e](https://tester.army/e2e), TypeScript and Chromium. **All 53 business cases are UI tests**, including the three AI cases: fixtures, business actions, persisted-data assertions and cleanup operate through Salesforce Lightning. Authentication and one-time administrative provisioning are separate infrastructure tasks.

**E2E Sales Manager** creates and owns Opportunities. Every Opportunity fixture verifies Owner and Created By through UI. **E2E Service Manager** has a separate session for permission checks, Case creation/editing and the read-only Contract handoff. Administrators are excluded from business Opportunity creation.

Allure uses plain English executed steps such as **Enter Opportunity Name**, **Click Save** and **Sign in as Service Manager**, expected test designs and **detailed failure logs, automatic PNG screenshots and the exact failure URL**. GitHub Actions **Run tests** runs all **55 results**, including the three AI UI cases, and publishes the completed report to **[Netlify](https://sf-e2e-tst-allure-ak91hu.netlify.app)**. [Repository](https://github.com/ak91hu/sf-e2e-tst) · [Actions](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml) · [Test design wiki](https://github.com/ak91hu/sf-e2e-tst/wiki).

**Latest completed Run tests: 55/55 passed**, [run 37115961793](https://github.com/ak91hu/sf-e2e-tst/actions/runs/37115961793), 2026-10-03, in **41m53s**, with all three AI cases, current stable components, English results, one worker and zero retries. All **51 fixture journals** show complete UI cleanup and no remaining owned records. The public Netlify report matches this execution. [Verification evidence](docs/VERIFICATION.md) records the source commit, run identity, report checks and earlier failures corrected during review.

## Documentation

All supporting Markdown documents are organized under `docs/`; this root README is the GitHub entry point.

| Document | Contents |
| --- | --- |
| [Test designs](docs/TEST_DESIGN.md) | **55 designs, 475 explicit steps**, with Action / Data / Expected output, role, preconditions, fixture preparation and cleanup. |
| [Wiki page sources](docs/wiki/Home.md) | One generated page per case, plus the wiki index and sidebar. |
| [Final code review](docs/CODE_REVIEW.md) | Findings, fixes, plain English steps and validation. |
| [POM review](docs/POM_REVIEW.md) | Page Object Model structure, review findings and fixes. |
| [Authentication setup](docs/AUTH_SETUP.md) | JWT, personas, permissions and email-code-free runs. |
| [GitHub and Netlify](docs/GITHUB_NETLIFY.md) | Secrets, Actions, history, report publication and wiki maintenance. |
| [Version audit](docs/VERSIONS.md) | Latest stable versions, primary sources and TypeScript compatibility. |
| [Verification](docs/VERIFICATION.md) | Actual execution evidence and limitations. |

Package badges show exact pins. The Actions badge reflects the latest remote workflow. The three AI UI cases are optional for local model-free runs and included in **Run tests**. CI uses the authorized ChatGPT login stored as a repository secret. `test:regression` requires no AI model; `test:all` runs all 55 results with model access. Execution evidence states whether the AI cases passed.

## Quick start

Use **Node.js 26.10.0 and npm 12.2.0**, as pinned in CI and `.nvmrc`. The supported runtime minimum is Node 24. Allure 3 runs on Node without Java. This org is already configured; another machine needs the preauthorized role usernames, Consumer Key and private RSA key.

```powershell
git clone https://github.com/ak91hu/sf-e2e-tst.git
Set-Location sf-e2e-tst
Copy-Item .env.example .env
# Configure JWT authentication using docs/AUTH_SETUP.md.
npm install --global npm@12.2.0 --no-audit --no-fund
npm ci --no-audit --no-fund
npm run install:browsers
npm run doctor
npm run typecheck
npm run pom:check
npm run design:check
npm run wiki:check
npm run test:regression
npm run report
npm run allure:generate
npm run allure:open
```

On Linux/CI, install Chromium system dependencies with `npm run install:browsers -- --with-deps`. Browsers are stored in `.browsers`. `doctor` checks configuration and installed tools without running business tests or printing secrets.

JWT → Single Access → native frontdoor opens a fresh Lightning session without passwords or repeated email codes. Missing preauthorization or an unexpected interactive authentication policy causes a clear failure. A future maintenance notice is acknowledged using the real **Got it** UI link.

## Users and permissions

Target: `https://orgfarm-80a620fbaf-dev-ed.develop.my.salesforce.com`.

| Persona | Username | Permissions |
| --- | --- | --- |
| E2E Sales Manager | `e2e.sales.manager.00dgk00000blbthuac@example.invalid` | Account, Contact, Opportunity, Contract, Quote, Product and Price Book CRUD; Contract activation and deletion of owned activated test Contracts. |
| E2E Service Manager | `e2e.service.manager.00dgk00000blbthuac@example.invalid` | Account, Contact and Case CRUD; Opportunity and Contract read access; Opportunity creation denied. |

Both personas have dedicated minimal profiles, roles and permission sets. Neither has View All Data, Modify All Data, Manage Users, Customize Application or object-level View All/Modify All. Salesforce Contract activation requires Sales Manager Order read/edit access; Order create/delete remains absent. All four org licenses are occupied; existing users were not deactivated.

`SF_USERNAME` is the one-time configuration administrator. `SF_SALES_USERNAME` is the business user. Authentication rejects an administrator identity for business setup, and Opportunity New has a separate administrator guard. The integration verifies each active persona through the visible profile menu.

## Configuration

| Variable | Purpose |
| --- | --- |
| `SF_BASE_URL` | HTTPS Developer Edition My Domain origin without path/query; validation currently restricts `*.develop.my.salesforce.com`. |
| `SF_SALES_USERNAME`, `SF_SERVICE_USERNAME` | Preauthorized business personas. |
| `SF_CLIENT_ID` | JWT-capable External Client App Consumer Key; no Consumer Secret required. |
| `SF_JWT_PRIVATE_KEY_FILE` | Local RSA PEM key, normally `.e2e-auth/jwt.key`. |
| `SF_JWT_PRIVATE_KEY` | Full multiline PEM in CI, used instead of a key file. |
| `SF_JWT_AUDIENCE` | `https://login.salesforce.com` for this Developer Edition. |
| `SF_TIME_ZONE` | Persona Salesforce timezone; default `Europe/Budapest`. |
| `SF_OPPORTUNITY_RECORD_TYPE` | Optional Opportunity record type ID. |
| `SF_STAGE_*`, `SF_WON_PROBABILITY`, `SF_LOST_PROBABILITY` | Org-specific sales process and probability values; examples in `.env.example`. |
| `NETLIFY_SITE_ID`, `NETLIFY_AUTH_TOKEN` | Dedicated report site and CI deployment credentials; local CLI login is supported. |

Local `.env` values never overwrite existing process/CI variables. The current certificate expires **2027-10-02**. New orgs need one-time app, QuoteSettings, layout, profile, permission-set, role and user provisioning; see [authentication setup](docs/AUTH_SETUP.md).

## Coverage

| IDs | Count | Behavior |
| --- | ---: | --- |
| SF-AUTH-001 | 1 | Authenticated Opportunity list and New button. |
| SF-OPP-001–017 | 17 | Full sales lifecycle; required name/date/Stage; Unicode editing; cancel create/edit/delete; Closed Lost and reopening; deletion; 0 and 0.01 USD; past dates; reverse stage changes; grouped million-dollar amounts and edit-to-zero. |
| SF-CON-001–013 | 13 | Draft, Account/start date/term; required fields; Unicode terms and 24 months; cancel; deletion; activation, activating user and date; edited Start Date; one-month term; cancel activation/deletion. |
| SF-QUO-001–013 | 13 | Draft, relationships and expiry; required name; cancel; Unicode/tax/shipping/Grand Total; Presented → Accepted; deletion; owned catalogue with 2 × 125.50 = 251.00 USD; Start/Stop Sync and Opportunity Amount; Denied; past expiry; reset charges to zero; two isolated Quotes. |
| SF-ROLE-001–003 | 3 | Sales ownership/creator; Service creation denied in list and direct New UI; Service Case New → Working. |
| SF-E2E-001–003 | 3 | Standard handoff plus two large workflows: complete product sale with pricing/sync/24-month Contract, and lost-deal recovery with replacement Quote, revised charges/terms and Service handoff. |
| SF-AUTH, SF-AUTH-SERVICE | +2 setups | Role-specific JWT login, visible profile verification and saved browser session. |
| SF-AI-001–003 | +3 optional | Natural-language Opportunity/Contract/Quote UI edits, agent assertion and structured extraction with deterministic UI assertions. |

`test:regression` selects **50 cases + 2 setups = 52 results**. **Run tests** and `test:all` select **53 cases + 2 setups = 55 results**, including all AI cases. The 55 designs also cover optional AI cases. Filtered runs export only selected cases and dependencies to Allure.

### Large end-to-end workflows

Each workflow is one uninterrupted UI test with its own records, fresh persisted readbacks and UI cleanup. The role changes are part of the same test.

| Case | Whole process | Design steps |
| --- | --- | ---: |
| [SF-E2E-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-E2E-002) | Product and Price Book → Account → Opportunity qualification/proposal → Quote with two product units → Presented/Accepted → Start/Stop Sync → Negotiation/Closed Won → 24-month Contract with agreed terms → Activate → Service read-only handoff → Sales final checks and cleanup. | 24 |
| [SF-E2E-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-E2E-003) | Account/Opportunity → Closed Lost → reopen and progress → Denied Quote → replacement Quote with revised charges → Presented/Accepted → verify original Quote isolation → Closed Won → revise Contract term/terms → Activate → Service handoff → Sales final checks and cleanup. | 28 |

Run both with `npm run test:monolithic`, or one with `npm run test:e2e -- --grep SF-E2E-002`. Preparation, business actions, cross-role checks and cleanup all use the UI. The larger workflows complement the focused cases, which pinpoint individual validation, cancellation, boundary and relationship regressions.

**Data model:** standard Salesforce Quote. Contract relates to the workflow through the **Account** in this org; Opportunity.ContractId is absent. The integration verifies the same Account and exact Opportunity link.

**Dates:** relative input dates use UTC. On Closed Won, Salesforce changes future Close Date to the user's current date. Assertions calculate the dates immediately before/after Save in `SF_TIME_ZONE`, including midnight boundaries.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run test:list` | Collect cases and setup dependencies without opening a browser. |
| `npm run test:all` | All 55 results in one run/report, including AI cases; used by Run tests. |
| `npm run test:regression` | All 52 standard results without model access. |
| `npm run test:opportunity` / `test:contract` / `test:quote` | Object-specific regression. |
| `npm run test:roles` / `test:integration` | Role permissions / all three complete workflows. |
| `npm run test:monolithic` | The two large product-sale and lost-sale-recovery workflows. |
| `npm run test:auth` / `test:smoke` | Authentication / smoke selection. |
| `npm run test:e2e -- --grep SF-OPP-006` | Select by case ID or regex. |
| `npm run test:headed` | Visible test browser. |
| `npm run test:last-failed` | Rerun failures from the previous report explicitly. |
| `npm run report` | Current summary; returns the original regression exit code. |
| `npm run allure:generate` / `allure:open` | Generate current completed report / open locally. |
| `npm run allure:deploy` | Publish current static HTML to Netlify production. |
| `npm run versions:check` | Read-only latest stable component audit against primary registries. |
| `npm run design:generate` / `design:check` | Generate / verify consolidated step designs. |
| `npm run wiki:generate` / `wiki:check` | Generate / verify 57 wiki pages. |

One worker, **zero retries**, 10-minute case timeout, 45-second action timeout, 30-second assertions and 5-minute cleanup timeout. Run only one live suite against the org at a time; GitHub concurrency queues CI runs. Each test has isolated browser state and owned data.

## Page Object Model and framework capabilities

```text
tests/                 Business workflows and expected results
pages/                 Account, Opportunity, Contract, Quote, Service, Catalog
pages/components/      Picklist and Quote Line Items wizard
support/sales-ui.ts    Shared navigation, forms, Details, reads and UI deletion
support/core-fixtures  Per-case POM and owned-record cleanup
support/workflow-fixtures  Deferred persona restoration after failure capture
support/auth-engine    JWT/frontdoor authentication inside the engine
reporting/allure.ts    Official Allure reporter SDK adapter
docs/                  Documentation, editable designs and generated wiki pages
scripts/               Execution, reporting, provisioning and recovery
maintenance/           Initial user UI setup and exact owned-record recovery
validation/            Isolated browser infrastructure/report checks
unit/                  Cryptography and authentication infrastructure checks
```

Business tests call page objects rather than raw selectors, DOM evaluation or fetch. Fresh record navigation and visible Details provide persisted-data assertions. Exact relationship links and list searches verify identity and deletion. Picklists use scoped native ArrowDown/Enter actions and the actual active option ID; there are no fixed sleeps or forced clicks. Formatted numeric inputs are compared strictly as numbers; text inputs retain exact string comparisons. [POM review](docs/POM_REVIEW.md) documents these decisions; `npm run pom:check` enforces the layer boundary.

The suite uses e2e session dependencies, custom fixtures, semantic locators, automatic waiting, `expect.poll`, tags, filtered execution, the model-free web engine and a custom reporter. A source/version-guarded postinstall patch fixes Salesforce synthetic ShadowRoot IDREF lookup in web engine **0.11.2**; a dedicated synthetic UI case verifies it. Compiler checks use **TypeScript 7.0.2**; API-based Netlify dependencies use Microsoft's latest TypeScript 6 compatibility package. See [version audit](docs/VERSIONS.md).

## Allure reports and debugging

| Output | Contents |
| --- | --- |
| `.e2e/report.json`, `junit.xml`, `summary.md` | Original execution results, steps and summary. |
| `.e2e/allure-results/<run-id>` | Official SDK results for one actual run. |
| `.e2e/allure-results/current.json` | Current run ID, selection count and exported result count. |
| `allure-report/index.html` | Standalone Allure 3 HTML with embedded data and attachments. |
| `allure-report/run-manifest.json` | Published run identity and original exit code. |
| `test-history/history.jsonl` | Allure history, retained by CI cache. |

Open a failed/broken test to inspect:

- **Test body:** operation, locator, timing, status, error code and expected/observed values.
- **Detailed attempt log:** every recorded step/event, primary and secondary errors, timing and cleanup.
- **Failure URL / URL at failure:** the actual page before cleanup, with authentication parameters redacted.
- **Screenshot at failure:** automatic PNG captured by the framework.
- **Redacted UI evidence:** semantic surface logs when available.
- **Description:** role, preconditions and per-step Action, Data and Expected output.

Business login keeps credential URLs inside the engine and registers dynamic session secrets before UI observation. The original framework Secret-fill image protection remains enabled; one-time password bootstrap suppresses screenshots. Failures before browser startup have no UI to capture. Trace/video are disabled; the adapter attaches only fully redacted evidence within the current run's artifact directory.

Report generation verifies current run ID and counts; it never merges previous or unrelated selected results. Infrastructure harnesses use separate output/history directories. **`npm run test:evidence-harness` deliberately fails three synthetic assertions**; its wrapper succeeds only after validating failed status, detailed logs, exact URLs, valid automatic PNGs and credential redaction. The third probe verifies that a Service-side failure retains its Contract URL and screenshot before deferred teardown restores Sales for cleanup. These checks use intercepted UI pages and do not change Salesforce data.

## GitHub Actions, Netlify and wiki

The [workflow](.github/workflows/salesforce-regression.yml) runs credential-free source/POM/design/wiki/auth/evidence checks on PRs. Default-branch source pushes, manual dispatch and weekdays at **02:00 UTC** also run live Salesforce regression. Markdown-only pushes skip the live run.

A failed regression remains a **red job**, while its completed current report is still generated and deployed. The Step Summary links to Netlify. Artifacts retain original results, redacted evidence, SDK results, HTML and precise recovery journals for 14 days; auth/session/private-key files are excluded.

All seven required secrets and thirteen configuration variables are already set. Secrets: `SF_SALES_USERNAME`, `SF_SERVICE_USERNAME`, `SF_CLIENT_ID`, `SF_JWT_PRIVATE_KEY`, `E2E_OAUTH_CREDENTIALS`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`. Model provider and model are repository variables. The dedicated site belongs to the `ak91hu` Netlify team. Publication accepts only the four generated static files and uses `--prod --no-build`.

Wiki pages are generated from the same typed design source as Allure and the consolidated document. Each case has its own page and **Action / Data / Expected output** table. [Publication and maintenance instructions](docs/GITHUB_NETLIFY.md) cover the separate wiki Git repository.

## Test data and recovery

Before Save, every fixture receives a unique `E2E-TA-` name and `.e2e-data` journal entry. Cleanup runs in `finally`, deleting owned Quote, Contract, Opportunity, Case, Price Book, Product and Account records through UI in dependency order. IDs, exact names and Description markers protect unrelated data; deleted is set only after visible proof. There is no prefix-wide deletion or hard purge.

If cleanup fails, keep the precise journal and run targeted recovery:

```powershell
npm run data:recover -- .e2e-data/<exact-attempt-journal>.json
```

The command accepts exact workspace attempt journal paths. Never run recovery concurrently with regression. Case journals use Service; standard business records use Sales. `.env`, private keys, auth, sessions, browser downloads, generated reports, journals and local Netlify state are ignored by Git.

## AI UI cases

Set `E2E_ENABLE_AI=1` for AI preflight checks. `npm run test:all` includes all AI cases; `npm run test:ai` selects them alone. For ChatGPT access, use `npx e2e login openai`; the Gateway provider needs `AI_GATEWAY_API_KEY`. Run `npm run test:ai`. The agent uses `act`, `assert` and Zod-backed `extract`; the same POM provides fixture preparation, page-object Save completion, deterministic persisted UI assertions and cleanup. Model access and quota are separate requirements.

## Local checks

```powershell
npm run typecheck
npm run test:unit
npm run pom:check
npm run design:check
npm run wiki:check
npm run test:auth-harness
npm run test:evidence-harness
npm run versions:check
```

The unit and synthetic infrastructure checks are separate from the Salesforce business regression. Actual completed-run evidence is maintained in [docs/VERIFICATION.md](docs/VERIFICATION.md).
