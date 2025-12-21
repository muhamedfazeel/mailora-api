import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpRestService } from './http-rest.service';
import { CustomLoggerModule } from 'src/common/logger/custom-logger.module';
import { CONTENT_TYPE } from 'src/common/constants';

@Module({
  imports: [
    CustomLoggerModule,
    HttpModule.registerAsync({
      inject: ['REQUEST'],
      useFactory: (req: Request) => ({
        transformRequest: [
          (data: any, headers: Record<string, string>): string => {
            headers['unique_id'] = req?.headers?.['unique_id'] as string;

            // Checking header has form-urlencoded content type
            const header = headers['Content-Type'];
            const isHeaderUrlEncoded = header === CONTENT_TYPE.FORM_URL_ENCODED;

            // Adding content type only when request body is present
            if (data) {
              headers['Content-Type'] = `${
                isHeaderUrlEncoded
                  ? CONTENT_TYPE.FORM_URL_ENCODED
                  : CONTENT_TYPE.JSON
              } ; charset=utf-8`;
              headers['Accept'] = CONTENT_TYPE.JSON;
            }

            return (isHeaderUrlEncoded ? data : JSON.stringify(data)) as string;
          },
        ],
      }),
    }),
  ],
  exports: [HttpRestService],
  providers: [HttpRestService],
})
export class HttpRestModule {}
