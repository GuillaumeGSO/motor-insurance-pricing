import { Request, Response } from 'express';
import { ProductAuthorizationMiddleware } from '../../middleware/product-autorization.middleware';

describe('ProductAuthorizationMiddleware', () => {
  let middleware: ProductAuthorizationMiddleware;

  beforeEach(() => {
    middleware = new ProductAuthorizationMiddleware();
  });

  it('should call next() if x-role header is admin', () => {
    // Mock request, response, and next function
    const req = {
      headers: {
        'x-role': 'admin',
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = jest.fn(); // Mock next function

    // Execute middleware
    middleware.use(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if x-role header is not admin', () => {
    // Mock request, response, and next function
    const req = {
      headers: {
        'x-role': 'user',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    // Execute middleware
    middleware.use(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized access to products',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if x-role header is missing', () => {
    // Mock request, response, and next function
    const req = {
      headers: {},
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    // Execute middleware
    middleware.use(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized access to products',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
