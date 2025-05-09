import { Module } from '@nestjs/common';
import { CustomLoggerModule } from '_@common/logger/custom-logger.module';
import { DiscordNotificationService } from './discord-notification.service';

@Module({
  imports: [CustomLoggerModule],
  providers: [DiscordNotificationService],
  exports: [DiscordNotificationService],
})
export class DiscordNotificationModule {}
