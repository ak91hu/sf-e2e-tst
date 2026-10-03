import { defineTool, getToolContext } from 'e2e/agent';
import { tool } from 'ai';
import { z } from 'zod';

// Read-only UI evidence. The model has no REST/SOQL tools or fixture backdoor.
export const semanticEvidence = defineTool(tool({
  description: 'Read the current redacted Salesforce UI tree and visible text. Use for field, related-list, and permission evidence.',
  inputSchema: z.object({}),
  execute: async (_input, options) => {
    const observation = await getToolContext(options).observe({ tree: true });
    return { text: observation.text, tree: observation.tree, path: observation.path };
  },
}), { mutates: false, platforms: ['web'] });
