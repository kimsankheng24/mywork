import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { payrollRecords, payrollPeriods, employees } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PayrollService {
  constructor(private readonly dbService: DbService) {}

  // Cambodia NSSF Rates (as of recent policies)
  // Occupational Risk (100% Employer) -> roughly 0.8%
  // Health (50/50) -> 2.6% total -> 1.3% Employee, 1.3% Employer
  // Pension (50/50) -> 4% total -> 2% Employee, 2% Employer
  // Ceiling salary for NSSF is usually 1,200,000 KHR. We will assume USD equivalent is ~$300 cap.
  private calculateNSSF(grossSalary: number) {
    const NSSF_CEILING_USD = 300;
    const base = Math.min(grossSalary, NSSF_CEILING_USD);
    
    return {
      employeeNssf: base * (0.013 + 0.02), // 3.3%
      employerNssf: base * (0.013 + 0.02 + 0.008) // 4.1%
    };
  }

  // Simplified Cambodia Tax on Salary Brackets (Monthly in USD approx)
  private calculateTax(taxableIncome: number, dependents: number) {
    // Minus rebate for dependents (~37.5 USD per dependent)
    const income = Math.max(0, taxableIncome - (dependents * 37.5));
    
    if (income <= 375) return 0;
    if (income <= 500) return income * 0.05 - 18.75;
    if (income <= 2125) return income * 0.10 - 43.75;
    if (income <= 3125) return income * 0.15 - 150;
    return income * 0.20 - 306.25;
  }

  async processPayroll(payrollPeriodId: string) {
    // 1. Get all active employees
    const allEmployees = await this.dbService.db.select().from(employees).where(eq(employees.status, 'ACTIVE')).all();
    
    const results = [];

    for (const emp of allEmployees) {
      // In a real app, calculate actual OT and allowances from DB
      const basicSalary = emp.basicSalary || 0;
      const totalAllowances = 50; // Mock fixed allowance
      const totalBonuses = 0;
      const totalOtPay = 0;
      
      const grossSalary = basicSalary + totalAllowances + totalBonuses + totalOtPay;
      
      const { employeeNssf, employerNssf } = this.calculateNSSF(grossSalary);
      
      const taxableIncome = grossSalary - employeeNssf;
      const taxDeduction = this.calculateTax(taxableIncome, emp.numberOfDependents || 0);
      
      const netSalary = grossSalary - employeeNssf - taxDeduction;

      const record = {
        id: crypto.randomUUID(),
        payrollPeriodId,
        employeeId: emp.id,
        basicSalary,
        totalAllowances,
        totalBonuses,
        totalOtPay,
        grossSalary,
        taxDeduction,
        nssfEmployeeDeduction: employeeNssf,
        nssfEmployerContribution: employerNssf,
        otherDeductions: 0,
        netSalary,
      };
      
      results.push(record);
      await this.dbService.db.insert(payrollRecords).values(record).execute();
    }

    return results;
  }
}
