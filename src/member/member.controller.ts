import { Controller } from '@nestjs/common';
import { MemberService } from './member.service';
import { Body, Get, Param, Post } from '@nestjs/common';
import { CreateMemberDto } from './dto/member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() dto: CreateMemberDto) {
    return this.memberService.create(dto);
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }
}
