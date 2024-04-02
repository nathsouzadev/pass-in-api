import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './service/event.service';
import { z } from 'zod';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: any) {
    const createEventSchema = z.object({
      title: z.string().min(4),
      details: z.string().nullable(),
      maxAttendees: z.number().int().positive().nullable(),
    })

    const data = createEventSchema.parse(createEventDto);
    return this.eventService.create(data);
  }
}
