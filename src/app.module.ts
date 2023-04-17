import { Module } from '@nestjs/common';

import { PayrollModule } from './modules/payroll/payroll.module';

@Module({
  imports: [PayrollModule],
})
export class AppModule {}
