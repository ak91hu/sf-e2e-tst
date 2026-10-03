/** Plain English display names; the original API and locator remain in details. */
function target(label: string): string {
  const leaf = label.split(' >> ').at(-1) ?? label;
  if (leaf.startsWith('getByRole("dialog"')) return 'dialog';
  const names = [...leaf.matchAll(/(?:name:\s*|getBy(?:Label|Text|Placeholder|TestId)\()"((?:\\.|[^"\\])*)"/g)];
  if (names.length) {
    try { return JSON.parse(`"${names.at(-1)![1]}"`) as string; } catch { return 'control'; }
  }
  const pattern = /(?:name:\s*|getBy(?:Label|Text|Placeholder)\()\/([^\n]+?)\/[a-z]*/.exec(leaf)?.[1];
  if (pattern) {
    const simple = pattern.replace(/^\^/, '').replace(/\$$/, '').replaceAll('\\*?', '').replaceAll('\\s*', '').replaceAll('\\s+', ' ').trim();
    if (/^[\w ()/-]+$/.test(simple) && simple) return simple;
  }
  return /getByRole\("([^"]+)"/.exec(leaf)?.[1] ?? 'page';
}

function destination(label: string): string {
  const path = /\/lightning\/(o|r)\/([^/?]+)(?:\/[^/?]+)?\/(new|edit|view|list)/.exec(label)
    ?? /\/lightning\/(o)\/([^/?]+)\/(new|list)/.exec(label);
  if (path) {
    const object = ({ Product2: 'Product', Pricebook2: 'Price Book' } as Record<string, string>)[path[2]!] ?? path[2];
    return `Open ${object} ${{ new: 'creation form', edit: 'edit form', view: 'record', list: 'list' }[path[3]!]}`;
  }
  return 'Open page';
}

export function readableStepName(api: string, label: string): string {
  const name = target(label);
  const names: Record<string, string> = {
    'locator.tap': `Click ${name}`, 'locator.fill': `Enter ${name}`, 'locator.clear': `Clear ${name}`,
    'locator.press': `Use keyboard in ${name}`, 'locator.focus': `Focus ${name}`,
    'locator.check': `Select ${name}`, 'locator.uncheck': `Clear ${name} selection`,
    'expect.toBeVisible': `Check ${name} is visible`, 'expect.not.toBeVisible': `Check ${name} is closed or hidden`,
    'expect.toHaveValue': `Check ${name} value`, 'expect.toContainText': `Check ${name} text`,
    'expect.toHaveText': `Check ${name} text`, 'expect.toHaveCount': `Check number of ${name} controls`,
    'expect.toHaveAttribute': `Check ${name} attribute`, 'expect.toBeSelected': `Check ${name} is selected`,
    'expect.toBeChecked': `Check ${name} is selected`, 'expect.toBeEnabled': `Check ${name} is enabled`,
    'expect.toHaveURL': 'Check current page address', 'expect.not.toHaveURL': 'Check the previous record page is closed',
    'browser.evaluate': 'Read visible page data', 'browser.url': 'Read current page address',
    'browser.route': 'Configure browser request handling', 'browser.unroute': 'Remove browser request handling',
    'app.clearState': 'Clear browser session', 'session.save': 'Save verified user session',
    'agent.act': 'Perform the requested UI changes', 'agent.assert': 'Check the requested UI result',
    'agent.extract': 'Read structured data from the UI',
  };
  if (api === 'browser.goto' || api === 'app.open') return destination(label);
  if (api === 'salesforceAuth.open') return /service/i.test(label) ? 'Sign in as Service Manager' : 'Sign in as Sales Manager';
  return names[api] ?? `Run ${api.replaceAll('.', ' ')}`;
}
