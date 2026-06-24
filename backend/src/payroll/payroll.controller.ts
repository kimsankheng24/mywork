import { Controller, Post, Param } from '@nestjs/common';
import { PayrollService } from './payroll.service';

@Controller('api/v1/payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('process/:periodId')
  processPayroll(@Param('periodId') periodId: string) {
    return this.payrollService.processPayroll(periodId);
  }
}
