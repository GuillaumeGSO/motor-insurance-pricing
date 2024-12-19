import { Request, Response } from 'express';
import { TokenValidationMiddleware } from '../../middleware/token-validation.middleware';

describe('TokenValidationMiddleware', () => {
  let middleware: TokenValidationMiddleware;
  const validToken = 'valid_api_token';

  beforeAll(() => {
    process.env.API_TOKEN = validToken; // Mock environment variable
  });

  beforeEach(() => {
    middleware = new TokenValidationMiddleware();
  });

  it('should call next() if Authorization header has a valid Bearer token', () => {
    // Given
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    } as Request;

    const res = {} as Response;

    const next = jest.fn();

    //  When
    middleware.use(req, res, next);

    // Then
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if Authorization header is missing', () => {
    const req = {
      headers: {},
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid authorization header',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if Authorization header does not start with Bearer', () => {
    const req = {
      headers: {
        authorization: 'Token abc123',
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid authorization header',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    // Mock request, response, and next function
    const req = {
      headers: {
        authorization: 'Bearer invalid_token',
      },
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
      message: 'Invalid token',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
