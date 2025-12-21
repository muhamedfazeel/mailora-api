import * as Joi from 'joi';
import * as K from '../common/constants';

export default Joi.object({
  // Server
  NODE_ENV: Joi.string()
    .valid(...K.NODE_ENVIRONMENTS)
    .default(K.NODE_ENVIRONMENTS[0]),
  PORT: Joi.number().required(),

  // Logger
  LOG_LEVEL: Joi.string()
    .valid(...K.LOGGER_LEVELS)
    .default(K.LOGGER_LEVELS[0]),
  PRETTY_PRINT_LOG: Joi.string().default('false'),

  // Swagger
  SWAGGER_ENABLED: Joi.string().valid('true', 'false').default('false'),

  // Database
  // Read Replica
  DB_READ_HOST: Joi.string().required(),
  DB_READ_PORT: Joi.number().default(K.DATABASE_DEFAULT_PORT),
  DB_READ_NAME: Joi.string().required(),
  DB_READ_USERNAME: Joi.string().required(),
  DB_READ_PASSWORD: Joi.string().required(),
  // Write Replica
  DB_WRITE_HOST: Joi.string().required(),
  DB_WRITE_PORT: Joi.number().default(K.DATABASE_DEFAULT_PORT),
  DB_WRITE_NAME: Joi.string().required(),
  DB_WRITE_USERNAME: Joi.string().required(),
  DB_WRITE_PASSWORD: Joi.string().required(),

  // Discord
  SUCCESS_DISCORD_WEBHOOK: Joi.string().uri().default(null),
  ERROR_DISCORD_WEBHOOK: Joi.string().uri().default(null),
  DISCORD_NOTIFY_ROLES: Joi.string().default(null),
});
