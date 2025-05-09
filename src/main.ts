import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as K from './common/constants';
import { AppModule } from './app.module';
import { name, description, version } from 'package.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from './common/logger/custom-logger.service';
import { SuccessResponseInterceptor } from './interceptors/success-response.interceptor';

async function bootstrap() {
  const logger = new CustomLogger('Main');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: K.MAX_JSON_REQUEST_SIZE }),
  );

  app.useLogger(logger);
  app.setGlobalPrefix(K.API_GLOBAL_PREFIX);
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const config = app.get<ConfigService>(ConfigService);
  const port: string = config.get('config.server.port') || '3000';
  const env: string | undefined = config.get<string>('config.server.env');
  const swaggerEnabled: boolean | undefined = config.get(
    'config.swagger.enabled',
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  if (swaggerEnabled) {
    const options = new DocumentBuilder()
      .setTitle(name)
      .setDescription(`${description}\nRunning on ${env} Mode`)
      .setVersion(version)
      .addServer(`http://localhost:${port}`, 'Local Dev Server')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(parseInt(port, 10), '0.0.0.0');
  logger.log(`🚀 Application is running on port ${port} in ${env} environment`);
}
void bootstrap();
