import { Controller, Get, HttpCode, Param, Request } from '@nestjs/common';
import { AttendeeService } from './service/attendee.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('ateendee')
@Controller()
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @ApiOkResponse({
    description: 'Attendee badge',
    schema: {
      example: {
        badge: {
          name: 'John Doe',
          email: 'john@email.com',
          event: 'Event title',
          checkInURL: 'http://localhost:3000/attendee/1/checkin',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Attendee not found' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id/badge')
  findOne(@Request() request: any, @Param('id') id: string) {
    return this.attendeeService.getBadge(
      parseInt(id),
      request.protocol,
      request.host,
    );
  }

  @ApiCreatedResponse({
    description: 'Check in successful',
    schema: {
      example: {
        message: 'Check in successful',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Attendee already checked in' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id/checkin')
  @HttpCode(201)
  checkIn(@Param('id') id: string) {
    return this.attendeeService.checkIn(parseInt(id));
  }
}
