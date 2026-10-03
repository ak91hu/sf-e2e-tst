/** Restore the cleanup identity only after the runner captures a failed UI. */
export class WorkflowPersonas {
  private needsSalesRestoration = false;

  constructor(private readonly login: (persona: 'sales' | 'service') => Promise<void>) {}

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
