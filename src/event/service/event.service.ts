import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createEventSchema } from '../schema/create-event.schema';
import { PrismaService } from '../../config/prisma/prisma.service';
import { registerAttendeeSchema } from '../schema/register-attendee.schema';
import { getAttendeeSchema } from '../schema/query-event.schema';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private genSlug = (title: string): string =>
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/ /g, '-');

  create = async (newEvent: typeof createEventSchema) => {
    const { title, details, maxAttendees } = createEventSchema.parse(newEvent);
    const slug = this.genSlug(title);

    const eventWithSlug = await this.prisma.event.findUnique({
      where: {
        slug,
      },
    });

    if (eventWithSlug !== null) {
      throw new ConflictException('An event with this title already exists');
    }

    return this.prisma.event.create({
      data: {
        title,
        details,
        maxAttendees,
        slug,
      },
    });
  };

  registerAttendee = async (
    eventId: string,
    attendee: typeof registerAttendeeSchema,
  ) => {
    const { name, email } = registerAttendeeSchema.parse(attendee);

    const attendeeFromEmail = await this.prisma.attendee.findUnique({
      where: {
        email_eventId: {
          email,
          eventId,
        },
      },
    });

    if (attendeeFromEmail !== null) {
      throw new BadRequestException(
        'An attendee with this email already exists',
      );
    }

    const [event, ammountAttendees] = await Promise.all([
      await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      }),
      await this.prisma.attendee.count({
        where: {
          eventId,
        },
      }),
    ]);

    if (event?.maxAttendees && event?.maxAttendees <= ammountAttendees) {
      throw new ForbiddenException('Event is full');
    }

    return this.prisma.attendee.create({
      data: {
        name,
        email,
        eventId,
      },
    });
  };

  getEvent = async (eventId: string) => {
    const event = await this.prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        details: true,
        maxAttendees: true,
        slug: true,
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      where: {
        id: eventId,
      },
    });

    if (event === null) {
      throw new NotFoundException('Event not found');
    }

    const { _count, ...eventData } = event;
    return {
      ...eventData,
      attendeeAmmount: _count.attendees,
    };
  };

  getAttendees = async (
    eventId: string,
    getAttendee: typeof getAttendeeSchema,
  ) => {
    const { pageIndex, query } = getAttendeeSchema.parse(getAttendee);

    const attendees = await this.prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true,
          },
        },
      },
      where: query
        ? {
            eventId,
            name: {
              contains: query,
            },
          }
        : {
            eventId,
          },
      take: 10,
      skip: pageIndex * 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      attendees: attendees.map((attendee) => {
        const { id, name, email, createdAt } = attendee;

        return {
          id,
          name,
          email,
          createdAt,
          checkIn: attendee.checkIn?.createdAt,
        };
      }),
    };
  };
}
