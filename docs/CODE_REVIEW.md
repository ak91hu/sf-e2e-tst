# Final framework code review

Reviewed on **2026-10-03**: test collection, page objects, shared UI actions, persona fixtures, JWT/secret handling, owned-data cleanup, Allure export, GitHub Actions and Netlify deployment. Business operations and checks remain UI-only.

| Finding | Impact | Resolution |
| --- | --- | --- |
| Service login was restored inside the test body's finally block. | A Service failure could be captured on the subsequent Sales page. | Deferred persona fixture teardown restores Sales after evidence capture and before owned-record cleanup. A failing UI probe verifies the Contract URL/PNG and later Sales navigation. |
| Text fields used select-all/delete before fill. | The live cancellation case failed when the name did not clear. | Text uses direct native fill with an exact readback. Smart numeric fields retain focused keyboard clearing and numeric readback. A synthetic host that intercepts select-all and a five-result live check pass. |
| Rename journals only retained the proposed new name. | An AI failure before Save could prevent deletion of the original owned record. | Journals retain exact previous names. Cleanup opens the same owned ID and accepts only an exact journaled E2E name; unrelated names and foreign record objects are rejected. |
| Allure step names exposed API and selector syntax. | Report steps were difficult to scan. | Plain English names describe the action and target; technical API/locator remain step parameters and failure logs. Status, timing, order and step count are preserved. |
| AI judged a Contract Save while controls were still disabled. | The first all-55 run failed one AI case despite a pending Save operation. | AI fills/selects fields; the page object performs Save and waits for dialog closure before fresh persisted assertions and agent verification. |
| Default CI omitted three AI cases. | The requested complete selection was not executed. | The **Run tests** workflow uses `e2e.all.config.ts` with no filters: 53 business UI cases plus two setups, 55 results. Authorized model credentials are held in a repository secret and an ephemeral private OS file. |
| Several page objects retained unused imports. | Unnecessary coupling and maintenance noise. | Imports removed; TypeScript now enforces noUnusedLocals and noUnusedParameters. |

No unresolved high-severity finding remains in these reviewed paths. Execution results are recorded separately in [VERIFICATION.md](VERIFICATION.md); review completion does not imply an unexecuted case passed.

## Step names

| Previous technical label | Report step |
| --- | --- |
| locator.fill with Opportunity Name selector | Enter Opportunity Name |
| locator.tap with Save button selector | Click Save |
| browser.goto with Opportunity edit URL | Open Opportunity edit form |
| expect.toHaveValue with Amount selector | Check Amount value |
| salesforceAuth.open for service | Sign in as Service Manager |

These are executed steps, not fabricated design results. Expected business behavior stays in each case's Action / Data / Expected output design. The original redacted technical labels remain available for debugging.

## Verified boundaries

- Seven business test files use page objects; selectors and visible-DOM reads remain in the UI layer.
- Session setup checks the active persona. Opportunities require Sales ownership/creator checks; business tests do not use the configuration administrator.
- Cleanup uses UI, exact owned IDs and names, dependency order and persisted journals. Failed cleanup is reported and can be recovered from exact journal paths.
- Allure exports only selected results and current-run artifacts. Failure attachments retain logs, URL and PNG; secrets, sessions and model credential files are excluded.
- CI serializes org runs, uses zero retries, keeps failed jobs red and publishes their completed reports to the dedicated Netlify site.
- Direct components and GitHub Actions remain pinned to audited current stable releases.

Validation: TypeScript, **12 unit checks**, five synthetic authentication/input checks, three intentional failure probes with a successful wrapper, generated Allure UI, design/wiki collection consistency and targeted live Salesforce checks. The full all-55 execution is recorded in the verification document when completed.
