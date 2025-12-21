import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CustomLogger } from '_@common/logger/custom-logger.service';
import configuration from 'src/config/configuration';
import { DiscordNotificationParams } from './interface/discord-notification.interface';
import { HttpRestService } from 'src/http-rest/http-rest.service';
import { SERVER_NAME } from '_@common/constants';
import { DISCORD_NOTIFICATION_TYPE } from '_@common/types/discord-notification.type';

type DiscordMessageType = {
  content: string | undefined;
  embeds: object[];
};

@Injectable()
export class DiscordNotificationService {
  private readonly httpService: HttpRestService;

  constructor(
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(DiscordNotificationService.name);
  }

  /**
   * Sends a message to a Discord channel using webhook.
   */
  async sendNotification(
    params: DiscordNotificationParams,
    type: DISCORD_NOTIFICATION_TYPE = DISCORD_NOTIFICATION_TYPE.INFO,
  ): Promise<void> {
    try {
      const body = this.composeDiscordMessage(
        params,
        type === DISCORD_NOTIFICATION_TYPE.ERROR,
      );
      if (!this.config.discord.webhook) {
        throw new Error(
          'Discord webhook URL is not defined in the configuration.',
        );
      }
      await this.httpService.post(
        type === DISCORD_NOTIFICATION_TYPE.ERROR
          ? (this.config.discord.webhook.error as string)
          : (this.config.discord.webhook.success as string),
        body,
      );
    } catch (err) {
      this.logger.error(`Discord notification error: ${err}`);
    }
  }

  private composeDiscordMessage(
    params: DiscordNotificationParams,
    notifyRoles?: boolean,
  ): DiscordMessageType {
    const { message, level } = params;
    const payload: DiscordMessageType = {
      content: undefined,
      embeds: [],
    };

    if (notifyRoles) {
      const roles = this.config.discord.notifyRoles?.split(',');
      if (roles && roles.length > 0) {
        payload.content = roles.map((role) => `<@&${role.trim()}>`).join(' ');
      }
    }
    payload.embeds.push({
      title: `[${SERVER_NAME}] Notification`,
      description: message,
      color: level,
      timestamp: new Date().toISOString(),
    });

    return payload;
  }
}
