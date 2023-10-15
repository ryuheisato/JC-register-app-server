import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSemesterDto } from './dto/create-semester.dto';

@Injectable()
export class SemesterService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSemesterDto) {
    try {
      return await this.prisma.semester.create({
        data: {
          term: dto.term,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create a semester.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.semester.findMany();
    } catch (error) {
      throw new NotFoundException('Failed to find semesters.');
    }
  }

  async findOne(id: string) {
    const semester = await this.prisma.semester.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found.`);
    }

    return semester;
  }

  async remove(id: string) {
    try {
      // 1. EventAttendanceを削除
      const deleteEventAttendances = this.prisma.eventAttendance.deleteMany({
        where: {
          event: {
            semesterId: Number(id),
          },
        },
      });

      // 2. SemesterMembersを削除
      const deleteSemesterMembers = this.prisma.semesterMember.deleteMany({
        where: {
          semesterId: Number(id),
        },
      });

      // 3. Eventsを削除
      const deleteEvents = this.prisma.event.deleteMany({
        where: {
          semesterId: Number(id),
        },
      });

      // 4. Semesterを削除
      const deleteSemester = this.prisma.semester.delete({
        where: {
          id: Number(id),
        },
      });

      // 全ての操作を一つのトランザクションとして実行
      await this.prisma.$transaction([
        deleteEventAttendances,
        deleteSemesterMembers,
        deleteEvents,
        deleteSemester,
      ]);

      return {
        message: 'Semester and related data have been deleted successfully.',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete the semester.');
    }
  }
}
