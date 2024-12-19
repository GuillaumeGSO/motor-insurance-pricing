import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ProductAuthorizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isAdmin = req.headers['x-role'] === 'admin';
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access to products' });
    }
    next();
  }
}
