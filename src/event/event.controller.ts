import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { EventService } from './service/event.service';
import { createEventSchema } from './schema/create-event.schema';
import { registerAttendeeSchema } from './schema/register-attendee.schema';
import { getAttendeeSchema } from './schema/query-event.schema';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('event')
@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiCreatedResponse({
    description: 'Event created successfully',
    schema: {
      example: {
        data: {
          title: 'Event title',
          details: 'Event details',
          maxAttendees: 100,
          slug: 'event-title',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'An event with this title already exists',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        details: {
          type: 'string',
          nullable: true,
        },
        maxAttendees: {
          type: 'number',
          nullable: true,
        },
      },
    },
  })
  @Post()
  create(@Body() createEventRequest: typeof createEventSchema) {
    return this.eventService.create(createEventRequest);
  }

  @ApiBadRequestResponse({
    description: 'An attendee with this email already exists',
  })
  @ApiForbiddenResponse({ description: 'Event not found' })
  @ApiCreatedResponse({ description: 'Attendee registered successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
      },
    },
  })
  @ApiParam({ name: 'eventId', type: 'string' })
  @Post(':eventId/attendees')
  register(
    @Body() registerAttendeeRequest: typeof registerAttendeeSchema,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.registerAttendee(eventId, registerAttendeeRequest);
  }

  @ApiOkResponse({
    description: 'Event found',
    schema: {
      example: {
        data: {
          id: 'event-id',
          title: 'Event title',
          details: 'Event details',
          maxAttendees: 100,
          slug: 'event-title',
          attendeeAmount: 10,
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiParam({ name: 'eventId', type: 'string' })
  @Get(':eventId')
  getEvent(@Param('eventId') eventId: string) {
    return this.eventService.getEvent(eventId);
  }

  @ApiOkResponse({
    description: 'Attendees found',
    schema: {
      example: {
        attendees: [
          {
            id: 'attendee-id',
            name: 'Attendee name',
            email: 'attendee@email',
            createdAt: '2021-09-01T00:00:00Z',
            checkIn: '2021-09-02T00:00:00Z',
          },
        ],
      },
    },
  })
  @ApiParam({ name: 'eventId', type: 'string' })
  @ApiQuery({ name: 'query', type: 'string', required: false })
  @ApiQuery({ name: 'pageIndex', type: 'string', required: false })
  @Get(':eventId/attendees')
  getAttendees(
    @Param('eventId') eventId: string,
    @Query() query: typeof getAttendeeSchema,
  ) {
    return this.eventService.getAttendees(eventId, query);
  }
}
