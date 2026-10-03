import config from './e2e.config.ts';
export default { ...config, tests: ['maintenance/auth.setup.e2e.ts', 'maintenance/recover.e2e.ts'], output: '.e2e/recovery' };
