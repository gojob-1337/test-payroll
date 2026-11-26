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

  describe('GET /advance', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('grants the advance on the current month', () => {
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(new Date('2020-11-15T10:00:00Z'));
      const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
      app.get(PayrollInMemoryRepository).save(gojobberId, '2020-11', 1000);

      return request(app.getHttpServer())
        .get(`/advance/${gojobberId}/300`)
        .expect(HttpStatus.OK)
        .expect({ gojobberId, month: '2020-11', amount: 300 });
    });

    it('refuses a non positive amount', () => {
      const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';

      return request(app.getHttpServer()).get(`/advance/${gojobberId}/0`).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
