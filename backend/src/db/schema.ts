import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  cfAccessId: text('cf_access_id'),
  roleId: text('role_id').notNull().references(() => roles.id),
  isActive: integer('is_active').default(1),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

export const departments = sqliteTable('departments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').unique().notNull(),
  managerId: text('manager_id'), // Self referencing employee ID
});

export const positions = sqliteTable('positions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  departmentId: text('department_id').notNull().references(() => departments.id),
});

export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  employeeCode: text('employee_code').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  khmerName: text('khmer_name'),
  gender: text('gender'),
  dob: text('dob'),
  nationalId: text('national_id'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  photoUrl: text('photo_url'),
  departmentId: text('department_id').references(() => departments.id),
  positionId: text('position_id').references(() => positions.id),
  managerId: text('manager_id'), // Self referencing
  joinDate: text('join_date').notNull(),
  employmentType: text('employment_type').notNull(),
  basicSalary: real('basic_salary').default(0.0),
  numberOfDependents: integer('number_of_dependents').default(0),
  status: text('status').default('ACTIVE'),
});

export const attendanceLogs = sqliteTable('attendance_logs', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull().references(() => employees.id),
  recordDate: text('record_date').notNull(),
  timeIn: text('time_in'),
  timeOut: text('time_out'),
  lateMinutes: integer('late_minutes').default(0),
  earlyLeaveMinutes: integer('early_leave_minutes').default(0),
  workHours: real('work_hours').default(0.0),
  otHours: real('ot_hours').default(0.0),
  status: text('status').notNull(),
});

export const payrollPeriods = sqliteTable('payroll_periods', {
  id: text('id').primaryKey(),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  status: text('status').default('DRAFT'),
});

export const payrollRecords = sqliteTable('payroll_records', {

  id: text('id').primaryKey(),
  payrollPeriodId: text('payroll_period_id').notNull(),
  employeeId: text('employee_id').notNull().references(() => employees.id),
  basicSalary: real('basic_salary').default(0.0),
  totalAllowances: real('total_allowances').default(0.0),
  totalBonuses: real('total_bonuses').default(0.0),
  totalOtPay: real('total_ot_pay').default(0.0),
  grossSalary: real('gross_salary').default(0.0),
  taxDeduction: real('tax_deduction').default(0.0),
  nssfEmployeeDeduction: real('nssf_employee_deduction').default(0.0),
  nssfEmployerContribution: real('nssf_employer_contribution').default(0.0),
  otherDeductions: real('other_deductions').default(0.0),
  netSalary: real('net_salary').default(0.0),
});
