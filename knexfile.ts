import { config } from 'dotenv';
config();

const env = process.env;

export default {
  develop: {
    client: 'pg',
    connection: {
      database: env.DB_WRITE_NAME,
      user: env.DB_WRITE_USERNAME,
      password: env.DB_WRITE_PASSWORD,
      host: env.DB_DB_WRITE_HOST,
      port: env.DB_DB_WRITE_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
