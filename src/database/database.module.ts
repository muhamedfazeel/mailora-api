import { Module } from '@nestjs/common';
import { CustomLoggerModule } from '_@common/logger/custom-logger.module';
import { UtilsModule } from 'src/utils/utils.module';
import {
  pgReadConnectionFactory,
  pgWriteConnectionFactory,
} from './database.provider';
import { DatabaseService } from './database.service';
import { HttpRestModule } from 'src/http-rest/http-rest.module';

@Module({
  imports: [CustomLoggerModule, UtilsModule, HttpRestModule],
  providers: [
    pgReadConnectionFactory,
    pgWriteConnectionFactory,
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
