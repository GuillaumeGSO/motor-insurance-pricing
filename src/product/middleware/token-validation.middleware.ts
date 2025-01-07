import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (typeof decoded !== 'string' && 'roles' in decoded) {
        req.headers['roles'] = decoded.roles;
      } else {
        throw new UnauthorizedException('Invalid token payload');
      }
      next();
    } catch (error) {
      throw new UnauthorizedException(error.message
      );
    }
  }
}
