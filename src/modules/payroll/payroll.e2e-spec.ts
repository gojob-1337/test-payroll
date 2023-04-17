import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { PayrollModule } from './payroll.module';
import { PayrollInMemoryRepository } from './payroll.repository';

describe('PayrollController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PayrollModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /net-salary', () => {
    it('returns the net salary of the gojobber on the given month', () => {
      const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
      const month = '2020-11';
      const earnedMoney = 258;

      app.get(PayrollInMemoryRepository).save(gojobberId, month, earnedMoney);

      return request(app.getHttpServer()).get(`/net-salary/${gojobberId}/${month}`).expect(HttpStatus.OK).expect('258');
    });
  });
});
