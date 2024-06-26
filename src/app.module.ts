import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.schema';
import { EventModule } from './event/event.module';
import config from './config/config';
import { router } from './config/router';
import { RouterModule } from '@nestjs/core';
import { AttendeeModule } from './attendee/attendee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    EventModule,
    RouterModule.register(router),
    AttendeeModule,
  ],
})
export class AppModule {}
