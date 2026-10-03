import { test } from '../support/core-fixtures.ts';

// Setup tests are only runnable as dependencies of a regular test.
test('SF-AUTH-001 | Hitelesített Opportunity lista elérhető', {
  session: 'salesforce',
  tags: ['auth', 'smoke', 'regression'],
}, async ({ sales }) => {
  await sales.opportunities.assertListCanCreate();
});
