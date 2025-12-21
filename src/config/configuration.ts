import { registerAs } from '@nestjs/config';

const env = process.env;

export default registerAs('config', () => ({
  server: {
    env: env.NODE_ENV,
    port: env.PORT,
  },
  logger: {
    level: env.LOG_LEVEL,
    prettyPrint: env.PRETTY_PRINT_LOG === 'true',
  },
  swagger: {
    enabled: env.SWAGGER_ENABLED === 'true',
  },
  pg: {
    readHost: env.DB_READ_HOST,
    readPort: env.DB_READ_PORT,
    readDatabase: env.DB_READ_NAME,
    readUsername: env.DB_READ_USERNAME,
    readPassword: env.DB_READ_PASSWORD,
    writeHost: env.DB_WRITE_HOST,
    writePort: env.DB_WRITE_PORT,
    writeDatabase: env.DB_WRITE_NAME,
    writeUsername: env.DB_WRITE_USERNAME,
    writePassword: env.DB_WRITE_PASSWORD,
  },

  discord: {
    webhook: {
      success: env.SUCCESS_DISCORD_WEBHOOK,
      error: env.ERROR_DISCORD_WEBHOOK,
    },
    notifyRoles: env.DISCORD_NOTIFY_ROLES,
  },
}));
