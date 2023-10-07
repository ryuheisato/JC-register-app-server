import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MemberController],
  providers: [PrismaService, MemberService],
})
export class MemberModule {}
