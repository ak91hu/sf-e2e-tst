# Salesforce UI regression test designs

**41 designs, 321 explicit steps:** 36 standard regression cases, 3 optional AI cases and 2 role-specific session setups. Every case has an **Action / Data / Expected output** table, including preparation and cleanup. All business record creation, assertions and cleanup use Salesforce Lightning UI. Opportunity creation runs as E2E Sales Manager; E2E Service Manager covers permissions, Case operations and the read-only Contract handoff.

[Repository](https://github.com/ak91hu/sf-e2e-tst) · [README](https://github.com/ak91hu/sf-e2e-tst/blob/main/README.md) · [GitHub Actions](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml) · [Live Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

These are test designs, not run results. The normal full run selects 38 results (36 cases + 2 setups); optional AI cases require separate model quota. Dates use UTC for entered relative dates and the configured Salesforce user timezone for automatic Closed Won dates. Secrets are excluded.

| ID | Area | Objective | Role |
| --- | --- | --- | --- |
| [SF-AUTH-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-AUTH-001) | Authentication | Authenticated Opportunity list is accessible | E2E Sales Manager |
| [SF-OPP-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-001) | Opportunity | Complete Opportunity sales lifecycle | E2E Sales Manager |
| [SF-OPP-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-002) | Opportunity | Required field: Opportunity Name | E2E Sales Manager |
| [SF-OPP-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-003) | Opportunity | Required field: Close Date | E2E Sales Manager |
| [SF-OPP-004](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-004) | Opportunity | Required field: Stage | E2E Sales Manager |
| [SF-OPP-005](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-005) | Opportunity | Cancel Opportunity creation | E2E Sales Manager |
| [SF-OPP-006](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-006) | Opportunity | Edit Opportunity name, amount, date and Unicode description | E2E Sales Manager |
| [SF-OPP-007](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-007) | Opportunity | Cancel Opportunity editing | E2E Sales Manager |
| [SF-OPP-008](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-008) | Opportunity | Closed Lost and automatic probability | E2E Sales Manager |
| [SF-OPP-009](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-009) | Opportunity | Reopen Closed Lost | E2E Sales Manager |
| [SF-OPP-010](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-010) | Opportunity | Cancel Opportunity deletion | E2E Sales Manager |
| [SF-OPP-011](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-011) | Opportunity | Confirm Opportunity deletion through UI | E2E Sales Manager |
| [SF-OPP-012](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-012) | Opportunity | Persist Opportunity amount: 0 | E2E Sales Manager |
| [SF-OPP-013](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-013) | Opportunity | Persist Opportunity amount: 0.01 | E2E Sales Manager |
| [SF-CON-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-001) | Contract | Create Draft Contract | E2E Sales Manager |
| [SF-CON-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-002) | Contract | Required Contract field: Account Name | E2E Sales Manager |
| [SF-CON-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-003) | Contract | Required Contract field: Contract Start Date | E2E Sales Manager |
| [SF-CON-004](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-004) | Contract | Required Contract field: Contract Term (months) | E2E Sales Manager |
| [SF-CON-005](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-005) | Contract | Edit Draft Contract Unicode terms | E2E Sales Manager |
| [SF-CON-006](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-006) | Contract | Cancel Contract editing | E2E Sales Manager |
| [SF-CON-007](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-007) | Contract | Delete Draft Contract | E2E Sales Manager |
| [SF-CON-008](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-008) | Contract | Activate Contract | E2E Sales Manager |
| [SF-CON-009](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-009) | Contract | Cancel completed Contract creation | E2E Sales Manager |
| [SF-QUO-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-001) | Quote | Draft Quote relationships and expiry | E2E Sales Manager |
| [SF-QUO-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-002) | Quote | Required Quote Name | E2E Sales Manager |
| [SF-QUO-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-003) | Quote | Cancel Quote creation | E2E Sales Manager |
| [SF-QUO-004](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-004) | Quote | Edit Quote fields and costs | E2E Sales Manager |
| [SF-QUO-005](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-005) | Quote | Cancel Quote editing | E2E Sales Manager |
| [SF-QUO-006](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-006) | Quote | Quote Presented → Accepted | E2E Sales Manager |
| [SF-QUO-007](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-007) | Quote | Cancel Quote deletion | E2E Sales Manager |
| [SF-QUO-008](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-008) | Quote | Confirm Quote deletion through UI | E2E Sales Manager |
| [SF-QUO-009](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-009) | Quote | Product line, totals and synchronization | E2E Sales Manager |
| [SF-ROLE-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-ROLE-001) | Roles and Service | Sales Manager is Opportunity owner and creator | E2E Sales Manager |
| [SF-ROLE-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-ROLE-002) | Roles and Service | Service Manager cannot create Opportunities | E2E Service Manager |
| [SF-ROLE-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-ROLE-003) | Roles and Service | Service Manager creates and edits a Case | E2E Service Manager |
| [SF-E2E-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-E2E-001) | Sales to Service | Complete Sales → Service handoff | E2E Sales Manager → E2E Service Manager → E2E Sales Manager |
| [SF-AI-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-AI-001) | Optional AI | AI Opportunity editing | E2E Sales Manager |
| [SF-AI-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-AI-002) | Optional AI | AI Contract editing and assertion | E2E Sales Manager |
| [SF-AI-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-AI-003) | Optional AI | AI Quote acceptance and extraction | E2E Sales Manager |
| [SF-AUTH](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-AUTH) | Authentication | E2E Sales Manager JWT → Lightning session setup | E2E Sales Manager |
| [SF-AUTH-SERVICE](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-AUTH-SERVICE) | Authentication | E2E Service Manager JWT → Lightning session setup | E2E Service Manager |

Editable source: [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Repository copy: [docs/TEST_DESIGN.md](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/TEST_DESIGN.md). Generated wiki pages: [docs/wiki](https://github.com/ak91hu/sf-e2e-tst/tree/main/docs/wiki).
