export const SERVER_NAME = 'Mailora API Server';

export const API_GLOBAL_PREFIX = '/api/';

export const NODE_ENVIRONMENT = {
  LOCAL: 'local',
  DEVELOPMENT: 'develop',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

export const NODE_ENVIRONMENTS = Object.values(NODE_ENVIRONMENT);

export const LOGGER_LEVELS = ['log', 'error', 'warn', 'debug'];

export const DATABASE_DEFAULT_PORT = 5432;

export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_URL_ENCODED: 'application/x-www-form-urlencoded',
};

export const FASTIFY_ERR_BODY_TOO_LARGE = 'FST_ERR_CTP_BODY_TOO_LARGE';

export const MAX_JSON_REQUEST_SIZE = 10485760;
