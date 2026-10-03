import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { readSemanticsFunction } from '../node_modules/@e2e-dev/web/dist/in-page/read-semantics.js';

test('Synthetic ShadowRoot IDREF stays scoped when getElementById is blocked', async ({ app, browser }) => {
  await browser.route('**/*', route => route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: `<!doctype html>
    <span id="label:with.dots">Wrong document label</span><section id="host"></section>
    <script>
      const root = document.getElementById('host').attachShadow({mode:'open'});
      root.innerHTML = '<span id="label:with.dots">Scoped New</span><button aria-labelledby="label:with.dots">X</button>';
      Object.defineProperty(root, 'getElementById', {value() {throw new Error('Disallowed getElementById on ShadowRoot');}});
    </script>` }));
  await app.open('/semantic-shadow');
  // Execute the actual engine reader, serializable to the same page world.
  const result = await browser.evaluate(`() => {
    const read = ${readSemanticsFunction.toString()};
    const button = document.getElementById('host').shadowRoot.querySelector('button');
    return read(button, { testIdAttribute: 'data-testid', secureFieldSelector: 'input[type="password"]', mode: {kind:'node'} });
  }`);
  expect((result as {name: string}).name).toBe('Scoped New');
});
