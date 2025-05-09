import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CustomLogger } from '_@common/logger/custom-logger.service';
import configuration from 'src/config/configuration';
import { DiscordNotificationParams } from './interface/discord-notification.interface';
import { HttpRestService } from 'src/http-rest/http-rest.service';
import { SERVER_NAME } from '_@common/constants';

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
  async sendNotification(params: DiscordNotificationParams): Promise<void> {
    try {
      const body = this.composeDiscordMessage(params);
      if (!this.config.discord.webhook) {
        throw new Error(
          'Discord webhook URL is not defined in the configuration.',
        );
      }
      await this.httpService.post(this.config.discord.webhook, body);
    } catch (err) {
      this.logger.error(`Discord notification error: ${err}`);
    }
  }

  private composeDiscordMessage(params: DiscordNotificationParams): any {
    const { message, level } = params;

    const embed = {
      title: `[${SERVER_NAME}] Notification`,
      description: message,
      color: level,
      timestamp: new Date().toISOString(),
    };

    return {
      content: this.config.discord.notifyRoles,
      embeds: [embed],
    };
  }
}
