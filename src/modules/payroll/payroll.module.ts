import { Module } from '@nestjs/common';

import { AdvanceInMemoryRepository } from './advance.repository';
import { AdvanceService } from './advance.service';
import { PayrollController } from './payroll.controller';
import { PayrollInMemoryRepository } from './payroll.repository';
import { PayrollService } from './payroll.service';

@Module({
  imports: [],
  providers: [PayrollService, PayrollInMemoryRepository, AdvanceService, AdvanceInMemoryRepository],
  controllers: [PayrollController],
})
export class PayrollModule {}
