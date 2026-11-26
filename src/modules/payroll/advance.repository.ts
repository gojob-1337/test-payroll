import { Injectable } from '@nestjs/common';

import { Advance } from './advance';

@Injectable()
export class AdvanceInMemoryRepository {
  private store = new Map<string, Advance>();

  load(gojobberId: string, month: string): Advance | undefined {
    return this.store.get(`${gojobberId}:${month}`);
  }

  save(advance: Advance): void {
    this.store.set(`${advance.gojobberId}:${advance.month}`, advance);
  }
}
