import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('semesters/:semesterId/events/:eventId')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('attend-with-id')
  async attendWithId(
    @Param('semesterId') semesterId: string,
    @Param('eventId') eventId: string,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    return this.attendanceService.attendWithId(
      +semesterId,
      +eventId,
      createAttendanceDto,
    );
  }

  @Post('attend-with-name')
  async attendWithName(
    @Param('semesterId') semesterId: string,
    @Param('eventId') eventId: string,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    return this.attendanceService.attendWithName(
      +semesterId,
      +eventId,
      createAttendanceDto,
    );
  }

  @Get('attendees')
  findAll(
    @Param('semesterId') semesterId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.attendanceService.findAll(+semesterId, +eventId);
  }
}
