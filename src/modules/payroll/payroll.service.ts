import { Injectable } from '@nestjs/common';

import { PayrollInMemoryRepository } from './payroll.repository';

@Injectable()
export class PayrollService {
  constructor(private readonly payrollRepository: PayrollInMemoryRepository) {}

  /**
   * Retrieves the net salary for the gojobber on a specific month.
   * Each end of month, the net salary is sent to the bank account of the gojobber.
   */
  getNetSalary(gojobberId: string, month: string): number {
    const payroll = this.payrollRepository.load(gojobberId, month);

    if (!payroll) {
      return 0;
    }

    return payroll.total;
  }
}
