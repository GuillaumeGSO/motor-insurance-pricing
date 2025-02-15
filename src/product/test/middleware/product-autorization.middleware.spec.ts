import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductAuthorizationMiddleware } from '../../middleware/product-autorization.middleware';

describe('ProductAuthorizationMiddleware', () => {
  let middleware: ProductAuthorizationMiddleware;
  let res: Response;

  beforeEach(() => {
    middleware = new ProductAuthorizationMiddleware();
    res = {} as Response;
  });

  it('should pass when roles contains only admin', () => {
    // Given
    const req = {
      headers: {
        roles: ['admin'],
      },
    } as unknown as Request;

    const next = jest.fn();

    // When
    middleware.use(req, res, next);

    // Then
    expect(next).toHaveBeenCalled();
  });

  it('should pass when roles contains admin', () => {
    const req = {
      headers: {
        roles: ['user', 'admin'],
      },
    } as unknown as Request;

    const next = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should fail when roles is not admin', () => {
    const req = {
      headers: {
        roles: 'user',
      },
    } as unknown as Request;

    const next = jest.fn();

    try {
      middleware.use(req, res, next);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Unauthorized access to products');
    }

    expect(next).not.toHaveBeenCalled();
  });

  it('should fail when no roles is set', () => {
    const req = {
      headers: {},
    } as Request;

    const next = jest.fn();

    try {
      middleware.use(req, res, next);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Unauthorized access to products');
    }

    expect(next).not.toHaveBeenCalled();
  });
});
