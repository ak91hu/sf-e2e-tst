import { expect } from 'e2e';
import { test } from '../support/auth-engine.ts';
import { SalesUi } from '../support/sales-ui.ts';

test('Page object accepts immediately formatted USD and preserves empty input', async ({ app, screen, browser }) => {
  await browser.route('**/*', route => new URL(route.request.url).pathname === '/__e2e__/numeric-input'
    ? route.fulfill({ headers: { 'Content-Type': 'text/html' }, body: `<!doctype html><title>Numeric UI fixture</title>
      <div role="dialog"><label>Amount<input oninput="if(this.value) this.value=Number(this.value.replace(/[$,]/g,'')).toLocaleString('en-US',{style:'currency',currency:'USD'})"></label><button>Save</button></div>` })
    : route.abort());
  await app.open('/__e2e__/numeric-input');
  const ui = new SalesUi(app, screen, browser);
  for (const amount of [1, 0, 0.01, 12345.67]) {
    await ui.fill('Amount', amount);
    await expect(ui.field('Amount')).toHaveValue(amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
  }
  await ui.fill('Amount', '');
  await expect(ui.field('Amount')).toHaveValue('');
});
