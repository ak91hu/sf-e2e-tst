/** Restore Sales only after the runner captures any failed Service UI. */
export class WorkflowPersonas {
  private needsSalesRestoration = false;

  private readonly login: (persona: 'sales' | 'service') => Promise<void>;
  constructor(login: (persona: 'sales' | 'service') => Promise<void>) { this.login = login; }

  async service() {
    this.needsSalesRestoration = true;
    await this.login('service');
  }

  async sales() {
    await this.login('sales');
    this.needsSalesRestoration = false;
  }

  async restoreForCleanup() {
    if (this.needsSalesRestoration) await this.sales();
  }
}
