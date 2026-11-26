import { BadRequestException, Injectable } from '@nestjs/common';

import { Advance } from './advance';
import { AdvanceInMemoryRepository } from './advance.repository';
import { PayrollInMemoryRepository } from './payroll.repository';

@Injectable()
export class AdvanceService {
  constructor(
    private readonly payrollRepository: PayrollInMemoryRepository,
    private readonly advanceRepository: AdvanceInMemoryRepository,
  ) {}

  compute(gojobberId: string, amount: number): Advance {
    const now = new Date();
    const year = now.getFullYear();
    const monthNumber = (now.getMonth() + 1).toString().padStart(2, '0');
    const month = `${year}-${monthNumber}`;

    if (this.advanceRepository.load(gojobberId, month)) {
      throw new BadRequestException('An advance has already been requested this month');
    }

    // Une avance ne peut pas depasser 50% de l'argent gagne par le gojobber sur le mois courant
    const res = this.payrollRepository.load(gojobberId, month);
    const earnedMoney = res ? res.total : 0;
    if (amount > earnedMoney / 2) {
      throw new BadRequestException('The advance cannot exceed 50% of the money earned this month');
    }

    const advance: Advance = { gojobberId, month, amount };
    this.advanceRepository.save(advance);

    return advance;
  }
}
