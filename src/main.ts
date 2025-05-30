import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorInterceptor } from './interceptors/error-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ErrorInterceptor());

  const logLevels: LogLevel[] = (process.env.LOG_LEVELS || 'log,error,warn')
    .split(',')
    .filter((level) =>
      ['log', 'error', 'warn', 'debug', 'verbose'].includes(level),
    ) as LogLevel[];

  const logger = new Logger('MotorPricing');
  logger.log('Application is starting...');
  logger.log(`Log levels set to: ${logLevels.join(', ')}`);
  Logger.overrideLogger(logLevels);
  app.useLogger(logLevels);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Zurich Motor Pricing API')
    .setDescription('API documentation to handle pricing and admin tasks')
    .setVersion('1.0') // Version of your API
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

   // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // allow requests from Vite frontend
    credentials: true,               // if you're using cookies or auth headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
