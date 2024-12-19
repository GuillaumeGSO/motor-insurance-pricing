import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'Invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    const isValidToken = token === process.env.API_TOKEN;
    if (!isValidToken) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    next();
  }
}
