import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { CommonModule } from './common/common.module';
import { UtilsModule } from './utils/utils.module';
import configuration from './config/configuration';
import validationSchema from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    ApiModule,
    CommonModule,
    UtilsModule,
  ],
})
export class AppModule {}
