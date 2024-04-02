import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EventService {

  create = async (event) => prisma.event.create({
    data: {
      ...event,
      slug: event.title.toLowerCase().replace(/ /g, '-'),
    }
  })
}
