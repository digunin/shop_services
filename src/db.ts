import pg from 'pg';
import 'dotenv/config';

export const db = new pg.Pool({
  user: process.env.APP_DB_USER,
  host: process.env.APP_DB_HOST,
  database: process.env.APP_DB_NAME,
  password: process.env.APP_DB_PASSWORD,
  port: Number(process.env.APP_DB_PORT),
});
