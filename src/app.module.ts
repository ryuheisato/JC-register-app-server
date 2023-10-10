import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { SemesterModule } from './semester/semester.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [MemberModule, SemesterModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
