import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log('Error intercepted:', err);

        if (err.response && err.status) {
          return throwError(
            () => new BadRequestException(err.response.message),
          );
        }

        return throwError(
          () =>
            new InternalServerErrorException('An unexpected error occurred'),
        );
      }),
    );
  }
}
