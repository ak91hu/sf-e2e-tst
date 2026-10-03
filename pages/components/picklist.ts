import { expect, type Locator, type Screen } from 'e2e';

// Select-only Lightning combobox: use native accessibility keyboard events.
// Every Enter is guarded by the exact semantic option's active-descendant ID.
// No application-state writes, forced clicks, coordinates or fixed sleeps.
export async function choosePicklist(screen: Screen, control: Locator, value: string) {
  const option = screen.getByRole('option', value, { exact: true, visible: true });
  // A form validation/focus update can close the list or reset its highlighted
  // item after a key. Re-read the real UI each time instead of predicting the
  // next index from a stale list. ArrowDown cycles the select-only combobox.
  // Only the unsaved selection is repeated; no Save or business test is retried.
  await expect.poll(async () => {
    const expanded = await control.getAttribute('aria-expanded') === 'true';
    if (!expanded) {
      if ((await control.textContent())?.trim() === value) return true;
      await control.press('ArrowDown'); return false;
    }
    if (!await option.isVisible()) return false;
    const targetId = await option.getAttribute('id');
    if (!targetId) throw new Error(`Picklist option has no native accessibility ID: ${value}`);
    if (await control.getAttribute('aria-activedescendant') === targetId) {
      await control.press('Enter');
    } else {
      await control.press('ArrowDown');
    }
    return false;
  }, { timeout: 30_000 }).toBe(true);
  await expect(control).toContainText(value);
  await expect(option).not.toBeVisible();
}
