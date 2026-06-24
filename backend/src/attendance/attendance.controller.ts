import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('api/v1/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Post('check-in')
  checkIn(@Body('employeeId') employeeId: string) {
    return this.attendanceService.checkIn(employeeId);
  }

  @Post('check-out')
  checkOut(@Body('employeeId') employeeId: string) {
    return this.attendanceService.checkOut(employeeId);
  }
}
