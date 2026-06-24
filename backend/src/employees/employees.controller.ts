import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { employees } from '../db/schema';

@Controller('api/v1/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  create(@Body() createEmployeeDto: typeof employees.$inferInsert) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: Partial<typeof employees.$inferInsert>) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
