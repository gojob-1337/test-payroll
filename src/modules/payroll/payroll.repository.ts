import { Injectable } from '@nestjs/common';

import { Payroll } from './payroll';

@Injectable()
export class PayrollInMemoryRepository {
  private store = new Map<string, number | undefined>();

  load(gojobberId: string, month: string): Payroll | undefined {
    const total = this.store.get(`${gojobberId}:${month}`);
    if (!total) {
      return undefined;
    }

    return { gojobberId, month, total };
  }

  save(gojobberId: string, month: string, total: number): void {
    this.store.set(`${gojobberId}:${month}`, total);
  }
}
