import { BadRequestException, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { Advance } from './advance';
import { AdvanceService } from './advance.service';
import { PayrollService } from './payroll.service';

@Controller()
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService,
    private readonly advanceService: AdvanceService,
  ) {}

  @Get('net-salary/:gojobberId/:month')
  getNetSalary(@Param('gojobberId') gojobberId: string, @Param('month') month: string): number {
    return this.payrollService.getNetSalary(gojobberId, month);
  }

  @Get('advance/:gojobberId/:amount')
  requestAdvance(@Param('gojobberId') gojobberId: string, @Param('amount', ParseIntPipe) amount: number): Advance {
    if (amount <= 0) {
      throw new BadRequestException('The advance amount must be positive');
    }

    return this.advanceService.compute(gojobberId, amount);
  }
}
