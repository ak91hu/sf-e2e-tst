# Salesforce regression requirements

- Never delete test Opportunity or Quote records from the sandbox.
- Preserve every created test record, including supporting Accounts, Contracts,
  Cases, Products and Price Books. Do not implement cleanup, recovery or cascade
  deletion. Deletion dialogs may be inspected only if they are cancelled.
- The complete suite selects exactly 100 results: 98 UI cases and two UI-verified
  authentication setups. Business preparation, actions and assertions use UI.
- Successful results must include PNG evidence and links to all records created
  by that case. Keep per-attempt journals and report evidence.
