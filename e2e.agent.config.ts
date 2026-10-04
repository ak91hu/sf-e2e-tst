import config from './e2e.config.ts';
import { semanticEvidence } from './support/agent-tools.ts';
import { chatgpt } from 'e2e/oauth/chatgpt';
import { gateway } from 'ai';
import { environment } from './support/environment.ts';
export default { ...config, tests: ['tests/auth.setup.e2e.ts', 'tests/agent/*.e2e.ts'], cache: 'read-write' as const,
  agents: { default: {
    model: environment.provider === 'chatgpt' ? chatgpt(environment.model) : gateway(environment.model),
    maxSteps: 40, maxModelCalls: 40, judgmentTimeout: 90_000,
    tools: { semanticEvidence },
    context: 'Salesforce Lightning, English UI. Read persisted fields from Details; the Path labels alone do not prove the current stage. Use exact record names supplied by the test.',
    system: 'Only manipulate the exact E2E-TA- records named in the goal through UI. Never delete any record or accept a deletion confirmation. Preserve every created record permanently. Never modify settings, permissions, other records, or validation rules. For Cancel do not save. Verify the stated values using visible UI evidence. Authentication secrets are handled by the engine; do not inspect authentication pages or session credentials.',
  } },
};
