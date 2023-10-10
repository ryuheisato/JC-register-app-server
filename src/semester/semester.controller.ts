import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { CreateSemesterDto } from './dto/create-semester.dto';

@Controller('semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @Get()
  findAll() {
    return this.semesterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semesterService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semesterService.remove(id);
  }
}
