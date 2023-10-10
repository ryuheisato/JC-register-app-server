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
      return await this.prisma.semester.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete a semester.');
    }
  }
}
