import { IConfig } from './config.interface';

export default (): IConfig => ({
  port: parseInt(process.env.PORT, 10 || 3000),
  db: {
    url: process.env.DB_URL,
  },
});
