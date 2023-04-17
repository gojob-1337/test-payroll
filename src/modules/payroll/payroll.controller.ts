import { Controller, Get, Param } from '@nestjs/common';

import { PayrollService } from './payroll.service';

@Controller()
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('net-salary/:gojobberId/:month')
  getNetSalary(@Param('gojobberId') gojobberId: string, @Param('month') month: string): number {
    return this.payrollService.getNetSalary(gojobberId, month);
  }
}
