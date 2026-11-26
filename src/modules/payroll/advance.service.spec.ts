import { BadRequestException } from '@nestjs/common';

import { AdvanceInMemoryRepository } from './advance.repository';
import { AdvanceService } from './advance.service';
import { PayrollInMemoryRepository } from './payroll.repository';

describe('AdvanceService', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('it works', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-11-15T10:00:00Z'));
    const payrollRepository = new PayrollInMemoryRepository();
    const advanceRepository = new AdvanceInMemoryRepository();
    const service = new AdvanceService(payrollRepository, advanceRepository);
    const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
    payrollRepository.save(gojobberId, '2020-11', 1000);

    const advance = service.compute(gojobberId, 300);

    expect(advance).toEqual({ gojobberId, month: '2020-11', amount: 300 });
    expect(advanceRepository.load(gojobberId, '2020-11')).toEqual({ gojobberId, month: '2020-11', amount: 300 });
  });

  it('accepts an advance equal to 50% of the money earned on the current month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-11-15T10:00:00Z'));
    const payrollRepository = new PayrollInMemoryRepository();
    const advanceRepository = new AdvanceInMemoryRepository();
    const service = new AdvanceService(payrollRepository, advanceRepository);
    const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
    payrollRepository.save(gojobberId, '2020-11', 1000);

    const advance = service.compute(gojobberId, 500);

    expect(advance).toEqual({ gojobberId, month: '2020-11', amount: 500 });
  });

  it('refuses an advance greater than 50% of the money earned on the current month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-11-15T10:00:00Z'));
    const payrollRepository = new PayrollInMemoryRepository();
    const advanceRepository = new AdvanceInMemoryRepository();
    const service = new AdvanceService(payrollRepository, advanceRepository);
    const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
    payrollRepository.save(gojobberId, '2020-11', 1000);

    expect(() => service.compute(gojobberId, 501)).toThrow(BadRequestException);
    expect(advanceRepository.load(gojobberId, '2020-11')).toBeUndefined();
  });

  it('only takes into account the money earned on the current month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-11-15T10:00:00Z'));
    const payrollRepository = new PayrollInMemoryRepository();
    const advanceRepository = new AdvanceInMemoryRepository();
    const service = new AdvanceService(payrollRepository, advanceRepository);
    const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
    payrollRepository.save(gojobberId, '2020-10', 1000);
    payrollRepository.save(gojobberId, '2020-11', 100);

    expect(() => service.compute(gojobberId, 300)).toThrow(BadRequestException);
  });

  it('refuses an advance when the gojobber has not earned any money on the current month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-11-15T10:00:00Z'));
    const payrollRepository = new PayrollInMemoryRepository();
    const advanceRepository = new AdvanceInMemoryRepository();
    const service = new AdvanceService(payrollRepository, advanceRepository);
    const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';

    expect(() => service.compute(gojobberId, 10)).toThrow(BadRequestException);
  });

  it('refuses a second advance on the same month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-11-15T10:00:00Z'));
    const payrollRepository = new PayrollInMemoryRepository();
    const advanceRepository = new AdvanceInMemoryRepository();
    const service = new AdvanceService(payrollRepository, advanceRepository);
    const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
    payrollRepository.save(gojobberId, '2020-11', 1000);
    service.compute(gojobberId, 100);

    expect(() => service.compute(gojobberId, 100)).toThrow(BadRequestException);
    expect(advanceRepository.load(gojobberId, '2020-11')).toEqual({ gojobberId, month: '2020-11', amount: 100 });
  });

  it('accepts a new advance on the next month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-11-15T10:00:00Z'));
    const payrollRepository = new PayrollInMemoryRepository();
    const advanceRepository = new AdvanceInMemoryRepository();
    const service = new AdvanceService(payrollRepository, advanceRepository);
    const gojobberId = 'e29e1e49-c952-4dd2-a49c-0a2cff391ce1';
    payrollRepository.save(gojobberId, '2020-11', 1000);
    payrollRepository.save(gojobberId, '2020-12', 1000);
    service.compute(gojobberId, 100);

    jest.setSystemTime(new Date('2020-12-02T10:00:00Z'));
    const advance = service.compute(gojobberId, 200);

    expect(advance).toEqual({ gojobberId, month: '2020-12', amount: 200 });
  });
});
