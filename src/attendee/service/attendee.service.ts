import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';

@Injectable()
export class AttendeeService {
  constructor(private readonly prisma: PrismaService) {}

  getBadge = async (attendeeId: number, protocol: string, host: string) => {
    const attendee = await this.prisma.attendee.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: attendeeId,
      },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    const checkInURL = new URL(
      `/attendee/${attendeeId}/checkin`,
      `${protocol}://${host}`,
    );
    const { name, email, event } = attendee;
    return {
      badge: {
        name,
        email,
        event: event.title,
        checkInURL: checkInURL.toString(),
      },
    };
  };

  checkIn = async (attendeeId: number) => {
    const checkin = await this.prisma.attendee.findUnique({
      where: {
        id: attendeeId,
      },
    });

    if (checkin) {
      throw new BadRequestException('Attendee already checked in');
    }

    await this.prisma.checkIn.create({
      data: {
        attendeeId,
      },
    });

    return { message: 'Check in successful' };
  };
}
