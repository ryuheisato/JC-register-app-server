import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMemberDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMemberDto) {
    //データベースにdtoを保存する処理を書く
    return await this.prisma.member.create({
      data: {
        name: dto.name,
        studentID: dto.studentId,
      },
    });
  }

  async findAll() {
    return await this.prisma.member.findMany();
  }
}
