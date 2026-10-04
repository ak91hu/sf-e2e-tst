# Salesforce UI regression test designs

**100 designs, 883 explicit steps:** 95 standard regression cases, 3 optional AI cases and 2 role-specific session setups. Every case has an **Action / Data / Expected output** table, including preparation and permanent retention. All business record creation and assertions use Salesforce Lightning UI. Every created record remains permanently; successful results include PNGs and exact record links. Opportunity creation runs as E2E Sales Manager; E2E Service Manager covers permissions, Case operations and the read-only Contract handoff.

[Repository](https://github.com/ak91hu/sf-e2e-tst) · [README](https://github.com/ak91hu/sf-e2e-tst/blob/main/README.md) · [GitHub Actions](https://github.com/ak91hu/sf-e2e-tst/actions/workflows/salesforce-regression.yml) · [Live Allure report](https://sf-e2e-tst-allure-ak91hu.netlify.app)

These are test designs, not run results. The model-free regression selects 97 results (95 cases + 2 setups); test:all selects all 100 results including the three AI UI cases, which require model access and quota. Dates use UTC for entered relative dates and the configured Salesforce user timezone for automatic Closed Won dates. Secrets are excluded.

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
| [SF-OPP-011](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-011) | Opportunity | Preserve Opportunity and its Quote after cancelled deletion | E2E Sales Manager |
| [SF-OPP-012](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-012) | Opportunity | Persist Opportunity amount: 0 | E2E Sales Manager |
| [SF-OPP-013](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-013) | Opportunity | Persist Opportunity amount: 0.01 | E2E Sales Manager |
| [SF-CON-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-001) | Contract | Create Draft Contract | E2E Sales Manager |
| [SF-CON-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-002) | Contract | Required Contract field: Account Name | E2E Sales Manager |
| [SF-CON-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-003) | Contract | Required Contract field: Contract Start Date | E2E Sales Manager |
| [SF-CON-004](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-004) | Contract | Required Contract field: Contract Term (months) | E2E Sales Manager |
| [SF-CON-005](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-005) | Contract | Edit Draft Contract Unicode terms | E2E Sales Manager |
| [SF-CON-006](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-006) | Contract | Cancel Contract editing | E2E Sales Manager |
| [SF-CON-007](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-007) | Contract | Preserve Draft Contract across repeated navigation | E2E Sales Manager |
| [SF-CON-008](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-008) | Contract | Activate Contract | E2E Sales Manager |
| [SF-CON-009](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-009) | Contract | Cancel completed Contract creation | E2E Sales Manager |
| [SF-QUO-001](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-001) | Quote | Draft Quote relationships and expiry | E2E Sales Manager |
| [SF-QUO-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-002) | Quote | Required Quote Name | E2E Sales Manager |
| [SF-QUO-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-003) | Quote | Cancel Quote creation | E2E Sales Manager |
| [SF-QUO-004](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-004) | Quote | Edit Quote fields and costs | E2E Sales Manager |
| [SF-QUO-005](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-005) | Quote | Cancel Quote editing | E2E Sales Manager |
| [SF-QUO-006](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-006) | Quote | Quote Presented → Accepted | E2E Sales Manager |
| [SF-QUO-007](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-007) | Quote | Cancel Quote deletion | E2E Sales Manager |
| [SF-QUO-008](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-008) | Quote | Preserve Quote and Opportunity across repeated navigation | E2E Sales Manager |
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
| [SF-OPP-014](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-014) | Opportunity | Persist a past Close Date on an open Opportunity | E2E Sales Manager |
| [SF-OPP-015](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-015) | Opportunity | Move an open Opportunity backwards through stages | E2E Sales Manager |
| [SF-OPP-016](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-016) | Opportunity | Persist a seven-digit amount with cents | E2E Sales Manager |
| [SF-OPP-017](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-017) | Opportunity | Edit a grouped decimal amount back to zero | E2E Sales Manager |
| [SF-CON-010](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-010) | Contract | Edit Contract Start Date | E2E Sales Manager |
| [SF-CON-011](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-011) | Contract | Persist a one-month Draft Contract | E2E Sales Manager |
| [SF-CON-012](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-012) | Contract | Cancel Contract activation | E2E Sales Manager |
| [SF-CON-013](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-013) | Contract | Cancel Draft Contract deletion | E2E Sales Manager |
| [SF-QUO-010](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-010) | Quote | Deny a Quote without changing its Opportunity | E2E Sales Manager |
| [SF-QUO-011](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-011) | Quote | Persist a past Quote expiration date | E2E Sales Manager |
| [SF-QUO-012](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-012) | Quote | Reset Quote tax and shipping to zero | E2E Sales Manager |
| [SF-QUO-013](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-013) | Quote | Isolate two Quotes under one Opportunity | E2E Sales Manager |
| [SF-E2E-002](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-E2E-002) | Sales to Service | Complete product sale through Contract and Service handoff | E2E Sales Manager → E2E Service Manager → E2E Sales Manager |
| [SF-E2E-003](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-E2E-003) | Sales to Service | Recover a lost sale and replace a denied Quote | E2E Sales Manager → E2E Service Manager → E2E Sales Manager |
| [SF-OPP-018](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-018) | Opportunity | Persist empty Opportunity description | E2E Sales Manager |
| [SF-OPP-019](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-019) | Opportunity | Persist multiline Unicode Opportunity description | E2E Sales Manager |
| [SF-OPP-020](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-020) | Opportunity | Edit Opportunity Amount to a small decimal | E2E Sales Manager |
| [SF-OPP-021](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-021) | Opportunity | Persist Opportunity Close Date today | E2E Sales Manager |
| [SF-OPP-022](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-022) | Opportunity | Persist Opportunity Close Date one year ahead | E2E Sales Manager |
| [SF-OPP-023](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-023) | Opportunity | Persist manually entered probability | E2E Sales Manager |
| [SF-OPP-024](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-024) | Opportunity | Persist Unicode Next Step | E2E Sales Manager |
| [SF-QUO-014](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-014) | Quote | Recalculate Quote total with tax 12.34 and shipping 0 | E2E Sales Manager |
| [SF-QUO-015](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-015) | Quote | Recalculate Quote total with tax 0 and shipping 5.67 | E2E Sales Manager |
| [SF-QUO-016](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-016) | Quote | Recalculate Quote total with tax 1000000.99 and shipping 12345.67 | E2E Sales Manager |
| [SF-QUO-017](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-017) | Quote | Recalculate Quote total with tax 0.01 and shipping 0.01 | E2E Sales Manager |
| [SF-QUO-018](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-018) | Quote | Persist Quote expiration today | E2E Sales Manager |
| [SF-QUO-019](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-019) | Quote | Persist empty Quote description | E2E Sales Manager |
| [SF-QUO-020](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-020) | Quote | Persist multiline Unicode Quote description | E2E Sales Manager |
| [SF-QUO-021](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-021) | Quote | Return Accepted Quote to Draft | E2E Sales Manager |
| [SF-OPP-025](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-025) | Opportunity | Clear a saved Unicode Next Step | E2E Sales Manager |
| [SF-OPP-026](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-026) | Opportunity | Cancel a manual probability change | E2E Sales Manager |
| [SF-OPP-027](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-027) | Opportunity | Persist 0% probability on an open Opportunity | E2E Sales Manager |
| [SF-OPP-028](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-028) | Opportunity | Persist 100% probability on an open Opportunity | E2E Sales Manager |
| [SF-OPP-029](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-029) | Opportunity | Cancel a Close Date change | E2E Sales Manager |
| [SF-OPP-030](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-030) | Opportunity | Edit an open Opportunity Close Date into the past | E2E Sales Manager |
| [SF-OPP-031](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-031) | Opportunity | Persist Order Number | E2E Sales Manager |
| [SF-OPP-032](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-032) | Opportunity | Persist Main Competitor(s) | E2E Sales Manager |
| [SF-OPP-033](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-033) | Opportunity | Persist Tracking Number | E2E Sales Manager |
| [SF-OPP-034](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-OPP-034) | Opportunity | Isolate edits between Opportunities sharing an Account | E2E Sales Manager |
| [SF-CON-014](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-014) | Contract | Create a thirty-six-month Draft Contract | E2E Sales Manager |
| [SF-CON-015](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-015) | Contract | Edit a Draft Contract term to 1 months | E2E Sales Manager |
| [SF-CON-016](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-016) | Contract | Edit a Draft Contract term to 36 months | E2E Sales Manager |
| [SF-CON-017](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-017) | Contract | Persist empty Special Terms | E2E Sales Manager |
| [SF-CON-018](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-018) | Contract | Persist multiline Unicode Special Terms | E2E Sales Manager |
| [SF-CON-019](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-019) | Contract | Cancel Special Terms editing | E2E Sales Manager |
| [SF-CON-020](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-020) | Contract | Edit Contract Start Date into the past | E2E Sales Manager |
| [SF-CON-021](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-021) | Contract | Cancel Contract Start Date editing | E2E Sales Manager |
| [SF-CON-022](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-022) | Contract | Isolate two Draft Contracts sharing an Account | E2E Sales Manager |
| [SF-CON-023](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-CON-023) | Contract | Revise Contract Description ownership marker | E2E Sales Manager |
| [SF-QUO-022](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-022) | Quote | Persist Quote expiration one year ahead | E2E Sales Manager |
| [SF-QUO-023](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-023) | Quote | Cancel Quote expiration editing | E2E Sales Manager |
| [SF-QUO-024](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-024) | Quote | Cancel Quote tax and shipping editing | E2E Sales Manager |
| [SF-QUO-025](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-025) | Quote | Quote Presented → Denied without changing its Opportunity | E2E Sales Manager |
| [SF-QUO-026](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-026) | Quote | Quote Denied → Draft without changing its Opportunity | E2E Sales Manager |
| [SF-QUO-027](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-027) | Quote | Rename the same Quote twice | E2E Sales Manager |
| [SF-QUO-028](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-028) | Quote | Edit Tax while preserving the other charge | E2E Sales Manager |
| [SF-QUO-029](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-029) | Quote | Edit Shipping and Handling while preserving the other charge | E2E Sales Manager |
| [SF-QUO-030](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-030) | Quote | Cancel Quote Description editing | E2E Sales Manager |
| [SF-QUO-031](https://github.com/ak91hu/sf-e2e-tst/wiki/SF-QUO-031) | Quote | Isolate Quotes belonging to different Opportunities | E2E Sales Manager |

Editable source: [docs/test-design.ts](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/test-design.ts). Repository copy: [docs/TEST_DESIGN.md](https://github.com/ak91hu/sf-e2e-tst/blob/main/docs/TEST_DESIGN.md). Generated wiki pages: [docs/wiki](https://github.com/ak91hu/sf-e2e-tst/tree/main/docs/wiki).
