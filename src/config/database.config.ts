import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 35432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  synchronize: process.env.NODE_ENV === 'DEV',
  logging: process.env.NODE_ENV === 'DEV',
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}));