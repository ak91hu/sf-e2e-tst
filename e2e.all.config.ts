import regression from './e2e.config.ts';
import agent from './e2e.agent.config.ts';

// One run and one report: 95 standard UI cases, 3 AI UI cases and 2 setups = 100.
export default { ...agent, tests: [...regression.tests, 'tests/agent/*.e2e.ts'], cache: 'off' as const };
