import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private async validateExistence(model, id: number, errorMessage: string) {
    const record = await model.findUnique({ where: { id: Number(id) } });
    if (!record) {
      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }
    return record;
  }

  async attendWithId(
    semesterId: number,
    eventId: number,
    dto: CreateAttendanceDto,
  ) {
    try {
      // 存在確認
      await this.validateExistence(
        this.prisma.semester,
        semesterId,
        `Semester with ID ${semesterId} not found.`,
      );
      await this.validateExistence(
        this.prisma.event,
        eventId,
        `Event with ID ${eventId} not found.`,
      );

      // メンバーの存在確認
      const existingMember = await this.prisma.member.findFirst({
        where: { studentID: dto.studentId },
      });
      if (!existingMember) {
        throw new BadRequestException(
          `Member with studentID ${dto.studentId} not found.`,
        );
      }

      // セメスターにおけるメンバーの存在確認
      const isMemberOfSemester = await this.prisma.semesterMember.findFirst({
        where: {
          semesterId: semesterId,
          memberId: existingMember.id,
        },
      });

      if (!isMemberOfSemester) {
        throw new BadRequestException(
          `Member with studentID ${dto.studentId} is not registered for the semester with ID ${semesterId}.`,
        );
      }

      // 既に出席しているか確認
      const existingAttendance = await this.prisma.eventAttendance.findFirst({
        where: {
          eventId: eventId,
          memberId: existingMember.id,
        },
      });

      if (existingAttendance) {
        throw new BadRequestException(
          `Member with studentID ${dto.studentId} has already recorded attendance for this event.`,
        );
      }

      // eventAttendanceの作成
      return await this.prisma.eventAttendance.create({
        data: {
          memberId: existingMember.id,
          eventId: eventId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to record attendance.');
    }
  }

  async attendWithName(
    semesterId: number,
    eventId: number,
    dto: CreateAttendanceDto,
  ) {
    try {
      // 存在確認
      await this.validateExistence(
        this.prisma.semester,
        semesterId,
        `Semester with ID ${semesterId} not found.`,
      );
      await this.validateExistence(
        this.prisma.event,
        eventId,
        `Event with ID ${eventId} not found.`,
      );

      // メンバーの存在確認 ここで見つからなければ一度も登録されていない
      const existingMember = await this.prisma.member.findFirst({
        where: { name: dto.name },
      });
      if (!existingMember) {
        throw new BadRequestException(`${dto.name} not found.`);
      }

      // セメスターにおけるメンバーの存在確認
      const isMemberOfSemester = await this.prisma.semesterMember.findFirst({
        where: {
          semesterId: semesterId,
          memberId: existingMember.id,
        },
      });

      if (!isMemberOfSemester) {
        throw new BadRequestException(
          `${dto.name} is not registered for the semester with ID ${semesterId}.`,
        );
      }

      // 既に出席しているか確認
      const existingAttendance = await this.prisma.eventAttendance.findFirst({
        where: {
          eventId: eventId,
          memberId: existingMember.id,
        },
      });

      if (existingAttendance) {
        throw new BadRequestException(
          `${dto.name} has already recorded attendance for this event.`,
        );
      }

      // eventAttendanceの作成
      return await this.prisma.eventAttendance.create({
        data: {
          memberId: existingMember.id,
          eventId: eventId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to record attendance.');
    }
  }

  async findAll(semesterId: number, eventId: number) {
    try {
      await this.validateExistence(
        this.prisma.semester,
        semesterId,
        `Semester with ID ${semesterId} not found.`,
      );
      await this.validateExistence(
        this.prisma.event,
        eventId,
        `Event with ID ${eventId} not found.`,
      );
      // セメスターとイベントIDを使用して出席者一覧を取得
      const eventAttendees = await this.prisma.eventAttendance.findMany({
        where: {
          eventId: eventId,
          event: {
            semesterId: semesterId,
          },
        },
        include: {
          member: true,
        },
      });

      // メンバーリストを返す
      return eventAttendees.map((attendance) => attendance.member);
    } catch (error) {
      throw new NotFoundException('Failed to find attendees.');
    }
  }
}
