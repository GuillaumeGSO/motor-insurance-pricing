import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Use this in controller to debug intercept cache usage
@Injectable()
export class LoggingCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(LoggingCacheInterceptor.name);

  trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = super.trackBy(context);
    if (cacheKey) {
      this.logger.log(`Cache key: ${cacheKey}`);
    }
    return cacheKey;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheKey = this.trackBy(context);
    return (await super.intercept(context, next)).pipe(
      tap((response) => {
        if (cacheKey) {
          this.logger.log(`Cache hit for key: ${cacheKey}`);
        } else {
          this.logger.log(`Cache miss for key: ${cacheKey}`);
        }
      }),
    );
  }
}
