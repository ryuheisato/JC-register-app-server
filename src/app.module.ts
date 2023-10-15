import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { SemesterModule } from './semester/semester.module';
import { EventModule } from './event/event.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [MemberModule, SemesterModule, EventModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
