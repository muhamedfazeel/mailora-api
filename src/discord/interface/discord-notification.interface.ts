import { DISCORD_MESSAGE_TYPE } from '_@common/types/discord-message.type';

export interface DiscordNotificationParams {
  message: string;
  level: DISCORD_MESSAGE_TYPE;
}
