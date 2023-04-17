import { Module } from '@nestjs/common';

import { PayrollController } from './payroll.controller';
import { PayrollInMemoryRepository } from './payroll.repository';
import { PayrollService } from './payroll.service';

@Module({
  imports: [],
  providers: [PayrollService, PayrollInMemoryRepository],
  controllers: [PayrollController],
})
export class PayrollModule {}
