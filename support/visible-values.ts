/** Parse the exact USD formatting displayed by Salesforce, including valid thousands groups. */
export function money(text: string): number {
  if (!/^-?\$(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2}$/.test(text)) throw new Error(`Invalid visible USD amount: ${text}`);
  return Number(text.replace(/[$,]/g, ''));
}
