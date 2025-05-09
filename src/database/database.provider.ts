import { Pool } from 'pg';
import { Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { from, lastValueFrom, timer } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import * as K from './constants/database.constants';
import configuration from '../config/configuration'; // Your config provider
import { CustomLogger } from '_@common/logger/custom-logger.service'; // Optional
import { DATABASE_DEFAULT_PORT } from '_@common/constants';
import { DiscordNotificationService } from 'src/discord/discord-notification.service';
import { DiscordNotificationParams } from 'src/discord/interface/discord-notification.interface';
import { DISCORD_MESSAGE_TYPE } from '_@common/types/discord-message.type';

export const pgReadConnectionFactory: Provider = generateDBPool({
  isWriteReplica: false,
  provider: K.POSTGRES_READ_CONNECTION.PROVIDER,
  connectionName: K.POSTGRES_READ_CONNECTION.NAME,
  factoryName: K.POSTGRES_READ_CONNECTION.FACTORY,
});

export const pgWriteConnectionFactory: Provider = generateDBPool({
  isWriteReplica: true,
  provider: K.POSTGRES_WRITE_CONNECTION.PROVIDER,
  connectionName: K.POSTGRES_WRITE_CONNECTION.NAME,
  factoryName: K.POSTGRES_WRITE_CONNECTION.FACTORY,
});

function generateDBPool({
  connectionName,
  isWriteReplica,
  provider,
  factoryName,
}): Provider {
  return {
    provide: provider,
    useFactory: async (config: ConfigType<typeof configuration>) => {
      const logger = new CustomLogger(factoryName);
      const discord = new DiscordNotificationService(config, logger);
      logger.setContext(factoryName);

      const writePool = {
        host: config.pg.writeHost,
        database: config.pg.writeDatabase,
        port: parseInt(
          config.pg.writePort || String(DATABASE_DEFAULT_PORT),
          10,
        ), // Default to '5432' if undefined
        user: config.pg.writeUsername,
        password: config.pg.writePassword,
        max: K.MAX_CONNECTION,
      };
      const readPool = {
        host: config.pg.readHost,
        database: config.pg.readDatabase,
        port: parseInt(config.pg.readPort || String(DATABASE_DEFAULT_PORT), 10), // Default to '5432' if undefined
        user: config.pg.readUsername,
        password: config.pg.readPassword,
      };
      const pool = new Pool(isWriteReplica ? writePool : readPool);

      return lastValueFrom(
        from(pool.connect()).pipe(
          retry({
            count: K.MAX_ATTEMPT,
            delay: (error: Error, retryCount) => {
              logger.warn(
                `Unable to connect to ${connectionName}. ${error.message}. Retrying ${retryCount}...`,
              );
              return timer(K.ATTEMPT_DELAY);
            },
            resetOnSuccess: true,
          }),
          catchError(async (err) => {
            const message = `${K.DATABASE_CONNECTION} [${connectionName}] ${err}`;

            const discordMessage: DiscordNotificationParams = {
              message,
              level: DISCORD_MESSAGE_TYPE.ERROR,
            };
            throw err;
          }),
          tap(() => {
            logger.log(`Connected to Postgres ${connectionName} successfully!`);
          }),
        ),
      );
    },
    inject: [configuration.KEY],
  };
}
