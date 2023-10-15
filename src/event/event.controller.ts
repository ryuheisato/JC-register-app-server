import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { Body, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('semesters/:semesterId/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Param('semesterId') semesterId: string, @Body() dto: CreateEventDto) {
    return this.eventService.create(semesterId, dto);
  }

  @Get()
  findAll(@Param('semesterId') semesterId: string) {
    return this.eventService.findAll(semesterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('semesterId') semesterId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventService.update(semesterId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
