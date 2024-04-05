import { Module } from '@nestjs/common';
import { AttendeeService } from './service/attendee.service';
import { AttendeeController } from './attendee.controller';
import { PrismaService } from '../config/prisma/prisma.service';

@Module({
  controllers: [AttendeeController],
  providers: [AttendeeService, PrismaService],
})
export class AttendeeModule {}
