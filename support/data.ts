import { randomUUID } from 'node:crypto';

export const TEST_PREFIX = 'E2E-TA-';

export function uniqueName(label: string): string {
  return `${TEST_PREFIX}${label}-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
}

export function futureDate(days = 30): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Closed Won uses the Salesforce user's calendar date, including around UTC
// midnight. Provisioned personas use Europe/Budapest; keep CI in agreement.
export function salesforceToday(): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: process.env.SF_TIME_ZONE || 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export interface OpportunityData {
  name: string;
  accountName: string;
  closeDate: string;
  stage: string;
  amount: number;
  description: string;
}

export function opportunityData(accountName: string, label = 'Opportunity'): OpportunityData {
  return {
    name: uniqueName(label),
    accountName,
    closeDate: futureDate(),
    stage: '', // The UI helper supplies the configured initial stage.
    amount: 12_345.67,
    description: 'Automated Salesforce Opportunity regression fixture.',
  };
}
