import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { employees } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class EmployeesService {
  constructor(private readonly dbService: DbService) {}

  async findAll() {
    return this.dbService.db.select().from(employees).all();
  }

  async findOne(id: string) {
    const result = await this.dbService.db.select().from(employees).where(eq(employees.id, id)).get();
    if (!result) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return result;
  }

  async create(employeeData: typeof employees.$inferInsert) {
    return this.dbService.db.insert(employees).values(employeeData).returning().get();
  }

  async update(id: string, employeeData: Partial<typeof employees.$inferInsert>) {
    const result = await this.dbService.db
      .update(employees)
      .set({ ...employeeData, status: employeeData.status || 'ACTIVE' }) // Ensure some default or dynamic update
      .where(eq(employees.id, id))
      .returning()
      .get();
      
    if (!result) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return result;
  }

  async remove(id: string) {
    // Soft delete
    return this.update(id, { status: 'TERMINATED' });
  }
}
