import { Controller } from '@nestjs/common';
import { MemberService } from './member.service';
import { Body, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('semesters/:semesterId/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(
    @Param('semesterId') semesterId: string,
    @Body() dto: CreateMemberDto,
  ) {
    return this.memberService.create(semesterId, dto);
  }

  @Get()
  findAll(@Param('semesterId') semesterId: string) {
    return this.memberService.findAll(semesterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.memberService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
