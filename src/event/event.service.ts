import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(semesterId: string, dto: CreateEventDto) {
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

      return await this.prisma.event.create({
        data: {
          semesterId: Number(semesterId),
          name: dto.name,
          description: dto.description,
          date: new Date(dto.date),
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create a Event.');
    }
  }

  async findAll(semesterId: string) {
    try {
      return await this.prisma.event.findMany({
        where: {
          semesterId: Number(semesterId),
        },
      });
    } catch (error) {
      throw new NotFoundException('Failed to find events.');
    }
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }

    return event;
  }

  async update(semesterId: string, id: string, dto: UpdateEventDto) {
    try {
      return await this.prisma.event.update({
        where: {
          id: Number(id),
        },
        data: {
          semesterId: Number(semesterId),
          name: dto.name,
          description: dto.description,
          date: new Date(dto.date),
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update a event.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.event.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete a event.');
    }
  }
}
