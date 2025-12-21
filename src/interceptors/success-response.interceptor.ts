import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T | null;
}

interface ResponseStructure<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, ResponseStructure<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseStructure<T>> {
    return next.handle().pipe(
      map((data: { statusCode?: number; message?: string; data?: T }) => {
        const responseStructure: ResponseStructure<T> = {
          success: true,
          statusCode: data?.statusCode || HttpStatus.OK,
          message: data?.message || 'success',
          data: data?.data || null,
        };
        context.switchToHttp().getResponse<Response>().status(HttpStatus.OK);
        return responseStructure;
      }),
    );
  }
}
