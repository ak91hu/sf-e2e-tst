# Verification evidence

Date: **2026-10-03**. Target: `orgfarm-80a620fbaf-dev-ed`. Business fixture creation, workflow actions, assertions and cleanup operate exclusively through Salesforce Lightning UI. JWT/singleaccess calls are authentication infrastructure; administrator SDK calls are one-time configuration.

## Completed green expanded GitHub run

[Actions run 37107049215](https://github.com/ak91hu/sf-e2e-tst/actions/runs/37107049215): **52 passed, 0 failed, exit 0**, one worker, **zero retries**. Commit `c5e0553a8ae81aaaa8e2cbf3b15ede0c927f4177`; e2e run `01a100bc-486c-7a90-85b2-a1b9464cdd6e`; started `2026-10-03T07:48:22.272Z`; report duration **41m14s**. This run uses English tests and all current stable direct components.

| Area | Passed results |
| --- | ---: |
| Sales + Service session setup | 2 |
| Authenticated Opportunity list | 1 |
| Opportunity | 17 |
| Contract | 13 |
| Quote | 13 |
| Role permissions and Service Case | 3 |
| Sales → Service integration | 3 |
| **Total** | **52** |

Allure contains the same 52 selected results, source exit 0, matched designs and complete attempt cleanup. All **48 owned-record journals** show every record deleted: **zero remaining records**. The public Netlify run manifest matches this execution. Downloaded proof: `.validation/github-actions-37107049215/salesforce-regression-37107049215-1`; automated verification: `.validation/verified-github-run.json`.

The subsequent [run 37109907094](https://github.com/ak91hu/sf-e2e-tst/actions/runs/37109907094) completed **51 passed, 1 failed**, with all cleanup complete. SF-OPP-007 failed during unnecessary keyboard clearing of a text field. The failure URL, detailed log and PNG were verified. The reviewed direct-fill correction passed a targeted live **5/5** check: SF-OPP-007/012/013, SF-QUO-005 and Sales setup, `.validation/review-input-focus/report.json`, 3m42s. All three integrations passed in the failed full run, including the revised persona teardown.

The **Run tests** workflow now selects all **55 results**, including the three AI UI cases. The authorized ChatGPT login works again and is configured in a repository secret. A targeted live AI/rename check and the final all-55 CI run validate the reviewed source separately. Results from distinct runs are not added together to claim a full pass.

## English/latest-component update checks

The version audit on 2026-10-03 reports **19/19 current stable direct components**. TypeScript native compiler 7.0.2 and Microsoft's latest compatibility package 6.0.2 run side by side; Netlify CLI 27.10.2 loads successfully. [VERSIONS.md](VERSIONS.md) records exact pins and primary sources.

| Check | Completed evidence |
| --- | --- |
| TypeScript 7 | `npm run typecheck`: exit 0, including business, POM, auth, AI, maintenance, reporter and validation sources. |
| Authentication/security unit tests | **12 passed**, covering JWT/origin/redaction, readable step labels and exact owned-name reconciliation. |
| Latest e2e/web compatibility | Auth/maintenance/ShadowRoot/numeric synthetic UI harness **5 passed**, `.validation/auth-harness/1791018626628/report.json`. |
| Failure evidence with latest components | Three intentional failed assertions, wrapper exit 0; detailed logs, exact URLs, automatic PNGs and credential redaction verified. The Service failure retains its Contract page before deferred Sales cleanup restoration. `.validation/allure-failure-harness/1791018948113/report.json`. |
| Latest failure HTML UI | Chromium verified visible Detailed attempt log, Failure URL and Screenshot at failure for the Service-side failure; 1 passed, `.validation/report-ui/1791019283971/report.json`. |
| Clean installation | npm 12.2.0 `npm ci` succeeded from the lockfile; the scoped web-engine patch was reapplied and all local checks passed. Local browser assets are on a dedicated D-drive directory linked from ignored `.browsers` to avoid C-drive space pressure. |
| POM boundary | Seven business source files contain no direct locators, DOM evaluation, business fetch or fixed sleep. |
| Designs | **55 designs, 475 steps**, matching executable normal/AI cases and setup IDs. Per-step Action / Data / Expected output. |
| Wiki | **57 pages** published and verified against their sources; 55 designs plus Home/sidebar. Rendered Action / Data / Expected output headers are verified. [Live wiki](https://github.com/ak91hu/sf-e2e-tst/wiki). |

The three AI cases are included in Run tests/all-55 and remain separately selectable locally. Earlier model quota was exhausted; access is now working again. Their live execution is recorded below and never inferred from typechecking.

## Final review and live AI checks

[CODE_REVIEW.md](CODE_REVIEW.md) records reviewed boundaries and resolved findings. Ordinary text uses direct fill; numeric fields explicitly receive focus; rename cleanup retains exact original/proposed names on the same owned ID. Allure uses plain English action names and preserves original technical parameters and failure logs. TypeScript rejects unused imports/parameters.

The targeted AI/rename run passed **6/6**, `.validation/review-ai-and-renames/report.json`, e2e `01a1010f-ccfa-7573-827b-b68430e5b0ec`, **5m39s**: Sales setup, **SF-AI-001/002/003**, **SF-OPP-006** and **SF-QUO-004**. All cleanup completed. Agent act/assert/extract executed **16 real model calls**. This validates the formerly unverified AI cases with current model access.

All-55 collection is exact, POM/design/wiki checks pass, **12 unit checks** pass and actionlint accepts the **Run tests** workflow. The final CI run executes all 55 without filters and publishes its own completed report; its result is not inferred from these targeted runs.

## Expanded UI coverage

Fourteen additional UI cases are implemented: SF-OPP-014–017, SF-CON-010–013, SF-QUO-010–013 and two large whole-process workflows SF-E2E-002/003. The full selection is now **50 business cases + 2 setups = 52 results**. All 55 normal/optional/setup designs and 475 steps match executable collection. New monolithic workflows cover product pricing/sync/Won/24-month Activated Contract/Service handoff and lost-deal recovery/replacement Quote/revised charges/terms/activation/handoff. All fourteen passed in the expanded 52-result CI run. SF-E2E-002 completed in 228.2 seconds and SF-E2E-003 in 197.1 seconds; each includes its owned UI cleanup.

## Confirmed real failure reporting

[Actions run 37101520154](https://github.com/ak91hu/sf-e2e-tst/actions/runs/37101520154): **37 passed, 1 failed**, 38 selected, zero retries; Sales/Service login successful. SF-OPP-007 failed because Salesforce immediately formatted input 1 as $1.00 while the POM expected a raw string. All cleanup completed. Allure generation, Netlify publication and artifact upload succeeded while the job remained red.

The real failed test's **Detailed attempt log**, **Failure URL** and automatic **PNG screenshot** were verified in SDK results and in the rendered HTML through Chromium. Report UI proof: `.validation/report-ui/1791009340391/report.json`, 1 passed. This proves the actual CI failure path, not only a synthetic example.

Numeric POM input now compares strictly parsed visible numbers, accepting USD formatting/grouping; invalid/empty text is rejected, and string inputs retain exact equality. The targeted live correction passed **5/5**, 3m34s: SF-OPP-007/012/013, **SF-QUO-005 cancel editing**, and Sales setup. Proof: `.validation/ui-currency-format/report.json`, run `01a10075-e4f6-7163-a8b9-da54dc29955e`. Tax/shipping coverage is **SF-QUO-004**, which passed in the completed full runs.

## Earlier investigations and fixes

The first GitHub runner encountered a Salesforce future-maintenance notice: 2 auth failures and 36 dependent skips. The real Got it UI action was added. Nested SID/contentDoor values and session cookies are registered with native Secret redaction before observations. Affected public logs, artifact, history cache and old Netlify deployment were removed, and affected UI sessions were logged out. Current synthetic checks exercise nested encoded URL redaction and screenshot protection.

Initial local POM runs exposed transient picklist active-option changes and the difference between UTC and the Salesforce user's date on Closed Won. The final picker observes actual UI state and targets native ArrowDown/Enter at the exact combobox; Enter requires the target option ID. Dialog disappearance is awaited before cleanup. No fixed sleep, forced click or case retry was introduced.

The initial full local green run was **38/38**, `01a0ff02-1689-7d5e-baf6-e44950eca03c`, 28m47s, zero retries. Earlier partial/failed runs were kept distinct and are not aggregated into a success claim. Exact owned journals drove targeted UI recovery; no prefix-wide deletion or hard purge occurred.

Allure text attachments use Buffers because the SDK interprets strings as file paths. Authentication runs inside the engine rather than recording credential-bearing browser.goto labels. The initial TypeScript 7 compiler-API incompatibility with Netlify is addressed by the official side-by-side aliases, retaining the latest native compiler.

## Reproduce

```powershell
npm run doctor
npm run versions:check
npm run typecheck
npm run test:unit
npm run pom:check
npm run design:check
npm run wiki:check
npm run test:auth-harness
npm run test:evidence-harness
npm run test:all
npm run report
npm run allure:generate
```

Configuration: [AUTH_SETUP.md](AUTH_SETUP.md). Designs: [TEST_DESIGN.md](TEST_DESIGN.md). CI/publication: [GITHUB_NETLIFY.md](GITHUB_NETLIFY.md). A published report must match the actual current run ID and selected-result count.
