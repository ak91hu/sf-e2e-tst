import { readFileSync } from 'node:fs';
import config from './e2e.config.ts';
const fields = JSON.parse(readFileSync('.e2e-auth/persona-setup.json', 'utf8'));
export default { ...config, tests: ['maintenance/users.e2e.ts'], output: '.e2e/users', secrets: {
  ...config.secrets,
  salesCurrentPassword: () => fields.sales.current, salesNextPassword: () => fields.sales.next, salesAnswer: () => fields.sales.answer,
  serviceCurrentPassword: () => fields.service.current, serviceNextPassword: () => fields.service.next, serviceAnswer: () => fields.service.answer,
} };
