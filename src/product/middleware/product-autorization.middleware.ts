import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../../auth/auth.dto';

@Injectable()
export class ProductAuthorizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isAdmin = req.headers['roles']?.includes(Role.Admin);
    if (!isAdmin) {
      throw new UnauthorizedException('Unauthorized access to products');
    }
    next();
  }
}
