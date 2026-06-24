import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { attendanceLogs } from '../db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class AttendanceService {
  constructor(private readonly dbService: DbService) {}

  async findAll() {
    return this.dbService.db.select().from(attendanceLogs).all();
  }

  async checkIn(employeeId: string) {
    // Basic check-in logic
    const recordDate = new Date().toISOString().split('T')[0];
    const timeIn = new Date().toISOString();
    
    return this.dbService.db.insert(attendanceLogs).values({
      id: crypto.randomUUID(),
      employeeId,
      recordDate,
      timeIn,
      status: 'PRESENT',
    }).returning().get();
  }

  async checkOut(employeeId: string) {
    const recordDate = new Date().toISOString().split('T')[0];
    const timeOut = new Date().toISOString();
    
    // Find today's record
    const todayRecord = await this.dbService.db
      .select()
      .from(attendanceLogs)
      .where(and(eq(attendanceLogs.employeeId, employeeId), eq(attendanceLogs.recordDate, recordDate)))
      .get();
      
    if (!todayRecord) {
      throw new NotFoundException(`No check-in record found for today for employee #${employeeId}`);
    }

    return this.dbService.db
      .update(attendanceLogs)
      .set({ timeOut })
      .where(eq(attendanceLogs.id, todayRecord.id))
      .returning()
      .get();
  }
}
