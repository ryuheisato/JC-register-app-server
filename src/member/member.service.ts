import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(semesterId: string, dto: CreateMemberDto) {
    try {
      // まず、指定されたsemesterIdが存在するかどうかを確認
      console.log(this.prisma.semester);
      const existingSemester = await this.prisma.semester.findUnique({
        where: {
          id: Number(semesterId),
        },
      });

      if (!existingSemester) {
        throw new BadRequestException(
          `Semester with ID ${semesterId} not found.`,
        );
      }

      // 1. MemberテーブルでそのstudentIDを持つメンバーが存在するかどうかを確認
      let existingMember = await this.prisma.member.findFirst({
        where: {
          studentID: dto.studentId,
        },
      });

      // 2. もし存在しなければ、新しいメンバーをMemberテーブルに追加
      if (!existingMember) {
        existingMember = await this.prisma.member.create({
          data: {
            name: dto.name,
            studentID: dto.studentId,
          },
        });
      }

      // 3. そのセメスターで同じstudentIDを持つメンバーが既に存在するかどうかを確認
      const existingSemesterMember =
        await this.prisma.semesterMember.findUnique({
          where: {
            semesterId_studentID: {
              semesterId: Number(semesterId),
              studentID: dto.studentId,
            },
          },
        });

      // 4. 既に存在する場合はエラーメッセージを返す
      if (existingSemesterMember) {
        throw new BadRequestException(
          'Member with this studentID is already registered for this semester.',
        );
      }

      // 5. 存在しない場合はSemesterMemberテーブルに新しいレコードを追加
      await this.prisma.semesterMember.create({
        data: {
          semesterId: Number(semesterId),
          memberId: existingMember.id,
          studentID: dto.studentId,
        },
      });

      return existingMember;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create a member.');
    }
  }

  async findAll(semesterId: string) {
    try {
      return await this.prisma.member.findMany({
        where: {
          semesters: {
            some: {
              semesterId: Number(semesterId),
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Failed to find members.');
    }
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }

    return member;
  }

  async update(id: string, dto: UpdateMemberDto) {
    try {
      return await this.prisma.member.update({
        where: {
          id: Number(id),
        },
        data: {
          name: dto.name,
          studentID: dto.studentId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update a member.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.member.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete a member.');
    }
  }
}
