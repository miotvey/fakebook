import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import 'dotenv/config';
import { PostgresConfig } from './config/env/postgres.config';

export const appDataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  username: PostgresConfig.DB_USERNAME,
  password: PostgresConfig.DB_PASSWORD,
  database: PostgresConfig.DB_NAME,
  schema: PostgresConfig.DB_SCHEMA,
  host: PostgresConfig.DB_HOST,
  port: PostgresConfig.DB_PORT,
  entities: [
    'dist/src/**/entities/*.entity.js',
    'dist/**/entities/*.entity.js',
  ],
  migrations: [
    'dist/infrastructure/migrations/**/*.js',
    'dist/src/infrastructure/migrations/**/*.js',
  ],
  subscribers: ['dist/subscriber/**/*.js'],
  migrationsRun: false,
  synchronize: true,
  logging: PostgresConfig.DB_LOG,
  ssl: PostgresConfig.DB_SSL ? { rejectUnauthorized: false } : false,
};

const AppDataSource = new DataSource(appDataSourceOptions);

export default AppDataSource;
