import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { ErrorInterceptor } from './error-interceptor';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorInterceptor],
    }).compile();

    interceptor = module.get<ErrorInterceptor>(ErrorInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should handle BadRequestException', (done) => {
    const context: ExecutionContext = {} as ExecutionContext;
    const next: CallHandler = {
      handle: () =>
        throwError(() => ({
          response: { message: 'Bad Request' },
          status: 400,
        })),
    };

    interceptor.intercept(context, next).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Bad Request');
        done();
      },
    });
  });

  it('should handle InternalServerErrorException', (done) => {
    const context: ExecutionContext = {} as ExecutionContext;
    const next: CallHandler = {
      handle: () => throwError(() => new Error('Unexpected error')),
    };

    interceptor.intercept(context, next).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('An unexpected error occurred');
        done();
      },
    });
  });

  it('should pass through without error', (done) => {
    const context: ExecutionContext = {} as ExecutionContext;
    const next: CallHandler = {
      handle: () => of('test'),
    };

    interceptor.intercept(context, next).subscribe({
      next: (value) => {
        expect(value).toBe('test');
        done();
      },
    });
  });
});
