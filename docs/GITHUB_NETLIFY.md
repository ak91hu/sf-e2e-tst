# GitHub Actions, Netlify Allure and test design wiki

[Repository](https://github.com/ak91hu/sf-e2e-tst) · [Actions](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml) · [Netlify Allure](https://sf-e2e-tst-allure-ak91hu.netlify.app) · [Wiki](https://github.com/ak91hu/sf-e2e-tst/wiki).

Repository owner and commit author: **ak91hu**. Default branch: `main`. Actions executes UI regression; Netlify serves the generated static report. Seven secrets and thirteen configuration variables are configured. **Run tests** executes all 55 results, including the three AI UI cases, in one report. The completed [run 37107049215](https://github.com/ak91hu/sf-e2e-tst/actions/runs/37107049215) passed 52/52 with English/latest-component results and deployed its matching report; see [verification](VERIFICATION.md) for the final-source run.

## Repository secrets and variables

Configure or rotate values under Settings → Secrets and variables → Actions.

| Secret | Value |
| --- | --- |
| `SF_SALES_USERNAME` | Preauthorized Sales Manager username. |
| `SF_SERVICE_USERNAME` | Preauthorized Service Manager username. |
| `SF_CLIENT_ID` | External Client App Consumer Key. |
| `SF_JWT_PRIVATE_KEY` | Complete RSA private PEM with actual line breaks, not a file path. |
| `E2E_OAUTH_CREDENTIALS` | Authorized e2e ChatGPT login JSON, stored only as a secret. |
| `NETLIFY_AUTH_TOKEN` | Access token belonging to the report site owner. |
| `NETLIFY_SITE_ID` | Target report site ID. |

Variables: `SF_BASE_URL`, `SF_JWT_AUDIENCE`, `SF_TIME_ZONE`, `SF_STAGE_INITIAL`, `SF_STAGE_QUALIFIED`, `SF_STAGE_PROPOSAL`, `SF_STAGE_NEGOTIATION`, `SF_STAGE_WON`, `SF_STAGE_LOST`, `SF_WON_PROBABILITY`, `SF_LOST_PROBABILITY`, `E2E_MODEL_PROVIDER`, `E2E_MODEL`. `SF_OPPORTUNITY_RECORD_TYPE` is optional and currently unset.

Administrator credentials and email codes are not required. ChatGPT model access uses the existing authorized OAuth login. To use AI Gateway instead, set provider/model variables and configure AI_GATEWAY_API_KEY. `.env`, private keys, auth, sessions, journals, local browser downloads and generated report/history directories remain excluded from Git.

## Netlify site

Dedicated site: **sf-e2e-tst-allure-ak91hu**, ID `670d4c13-feb9-4337-8fc9-f628f7c8867e`, owned by the `ak91hu` team. The site is publicly readable; only this site's access setting was changed, preserving the team's default access settings for other sites. GitHub deploys completed HTML; no separate Netlify Git build runs Salesforce tests.

Local authentication: `npm exec -- netlify login`. The CLI stores its OAuth state in the OS configuration, outside the project. Set `NETLIFY_SITE_ID` locally or in CI.

```powershell
npm run test:regression
npm run allure:generate
npm run allure:open
npm run allure:deploy
```

Deployment uses `--prod --no-build`. Current `.e2e/report.json` and HTML run-manifest IDs must match. Only `index.html`, `summary.json`, `test-results.json` and `run-manifest.json` are accepted. The whole workspace, credentials, sessions and recovery journals are never included. `netlify.toml` configures the report publish directory and headers.

## Workflow behavior

| Trigger / step | Behavior |
| --- | --- |
| Pull request | Credential-free TypeScript, unit, POM/design/wiki, synthetic auth and failure-evidence checks. |
| Source push to `main`, manual default-branch dispatch, weekdays 02:00 UTC | **Run tests**: source checks, then all 55 results using `npm run test:all`, one worker and zero retries. Shared concurrency queues runs. |
| Failed business test | Regression and job remain red; the completed current run still gets Allure generation and Netlify publication. |
| Missing/current-run mismatch | Report generation/deployment fails; stale or empty reports are rejected. |
| History | Restore JSONL from Actions cache; save under a unique run key, retaining 20 history entries. |
| Artifact | JSON/JUnit/Markdown, fully redacted evidence, SDK results, HTML and precise recovery journals; 14-day retention. Auth/session files excluded. |
| Successful deploy | Netlify link and run ID appear in the job Step Summary. |

Markdown-only pushes do not launch another live run. Manual dispatch remains available. 02:00 UTC is 03:00 Budapest time in winter and 04:00 in summer. Only default-branch code receives org/deployment secrets.

Node/npm and every GitHub Action are pinned to audited latest stable releases. TypeScript 7 performs type checking; Microsoft's TypeScript 6 compatibility alias supplies the compiler API required by Netlify dependencies. [Version audit](VERSIONS.md) records versions and primary sources.

## Model authentication

The workflow configures the saved ChatGPT login from `E2E_OAUTH_CREDENTIALS` into a private OS credential file on the ephemeral runner. Individual tokens are masked in Actions logs; the file is outside the repository and excluded from caches, artifacts and Netlify. The SDK can refresh credentials during a run. Update this secret after reauthorizing the login if renewal stops working. Missing model access or quota is a failure; the three AI cases are never silently skipped.

`E2E_MODEL_PROVIDER=chatgpt` and `E2E_MODEL=gpt-6-luna` are configured. For Gateway, use `gateway`, a provider-qualified model ID and `AI_GATEWAY_API_KEY`. Pull-request source checks use synthetic pages and do not receive model or Salesforce credentials.

## Failure debugging

Open a failed/broken test in Allure. Executed steps include locator, duration, status and error. Attachments include **Detailed attempt log**, **Failure URL**, **Screenshot at failure** and available **Redacted UI evidence**. **URL at failure** points to the actual pre-cleanup page; cleanup may subsequently delete the record. Its screenshot and semantic log preserve the failure state.

Descriptions include per-step **Action / Data / Expected output**. Browser-startup failures cannot have UI screenshots. Original Secret-fill screenshot suppression remains active during initial password bootstrap; normal native JWT business sessions support automatic screenshots. Trace/video are disabled.

`npm run test:evidence-harness` deliberately fails three isolated synthetic assertions. The wrapper passes only when failed status, detailed logs, exact URLs, automatic valid PNGs and credential redaction are verified. These results are never merged into the normal regression report/history.

## Wiki publication and maintenance

The wiki is a separate Git repository. All **57 generated pages** are maintained under `docs/wiki`: 55 case/setup designs, Home and sidebar. Each case includes preparation and cleanup with exactly **Action**, **Data** and **Expected output** columns.

```powershell
npm run design:generate
npm run wiki:generate
npm run design:check
npm run wiki:check
git clone https://github.com/ak91hu/sf-e2e-tst.wiki.git <local-wiki-directory>
Copy-Item docs/wiki/*.md <local-wiki-directory>
git -C <local-wiki-directory> add .
git -C <local-wiki-directory> commit -m "Update Salesforce UI test designs"
git -C <local-wiki-directory> push
```

The wiki is published: the published remote Markdown pages match the generated sources, and a rendered case page contains the requested three columns. For another uninitialized wiki, first save Home through GitHub's editor before cloning. Avoid editing generated files directly; change `docs/test-design.ts` and regenerate so Allure, consolidated designs and wiki remain consistent. Wiki publication does not trigger the Salesforce regression workflow.

Sources: [GitHub wiki editing](https://docs.github.com/en/communities/documenting-your-project-with-wikis/adding-or-editing-wiki-pages), [e2e framework](https://github.com/tester-army/e2e), [Allure reporter SDK](https://github.com/allure-framework/allure-js/blob/main/packages/allure-js-commons/README.md), [Allure 3 configuration](https://allurereport.org/docs/v3/configure/), [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/).
