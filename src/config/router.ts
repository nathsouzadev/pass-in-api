import { EventModule } from '../event/event.module';

export const router = [
  {
    path: 'api',
    children: [
      {
        path: 'event',
        module: EventModule,
      },
    ],
  },
];
