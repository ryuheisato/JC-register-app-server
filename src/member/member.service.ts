import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { parse } from 'papaparse';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(semesterId: string, dto: CreateMemberDto) {
    try {
      // まず、指定されたsemesterIdが存在するかどうかを確認
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

      // 5. 存在しない場合はSemesterMemberテーブルに新しいレコードを追加(別のセメスターに登録、要するにリピーター)
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
      // 関連するSemesterMemberレコードを削除
      await this.prisma.semesterMember.deleteMany({
        where: {
          memberId: Number(id),
        },
      });

      return await this.prisma.member.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete a member.');
    }
  }

  async uploadCsv(semesterId: string, file: Express.Multer.File) {
    try {
      // CSVデータのパース
      const csvData = file.buffer
        .toString()
        .split('\r\n')
        .slice(3)
        .join('\r\n');
      const results = parse(csvData, {
        header: true,
        skipEmptyLines: true,
      });

      const names = results.data
        .map((row) => `${row['First Name']} ${row['Last Name']}`)
        .filter(Boolean);

      for (const name of names) {
        console.log('Processing member:', name);

        // 既存のメンバーであるかを確認
        let existingMember = await this.prisma.member.findFirst({
          where: {
            name: name,
          },
        });

        // 存在しなければ、新しいメンバーとして登録
        if (!existingMember) {
          existingMember = await this.prisma.member.create({
            data: {
              name: name,
            },
          });
        }

        // そのセメスターで同じメンバーが既に関連付けられているかを確認
        const existingSemesterMember =
          await this.prisma.semesterMember.findUnique({
            where: {
              semesterId_memberId: {
                semesterId: Number(semesterId),
                memberId: existingMember.id,
              },
            },
          });

        // 存在しない場合は新しいレコードを追加
        if (!existingSemesterMember) {
          await this.prisma.semesterMember.create({
            data: {
              semesterId: Number(semesterId),
              memberId: existingMember.id,
            },
          });
        }
      }

      return { message: 'CSV processed successfully.' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to process CSV.');
    }
  }
}
