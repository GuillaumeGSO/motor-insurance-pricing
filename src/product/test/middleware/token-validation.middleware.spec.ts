import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { TokenValidationMiddleware } from '../../middleware/token-validation.middleware';

describe('TokenValidationMiddleware', () => {
  let middleware: TokenValidationMiddleware;
  const validToken = 'valid_api_token';
  let res;

  beforeAll(() => {
    process.env.API_TOKEN = validToken; // Mock environment variable
  });

  beforeEach(() => {
    middleware = new TokenValidationMiddleware();
    res = {} as Response;
  });

  it('should pass when token is valid for admin', () => {
    // Given
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    } as Request;

    jest.spyOn(jwt, 'verify').mockReturnValue({ roles: ['admin'] } as any);

    const next = jest.fn();

    //  When
    middleware.use(req, res, next);

    // Then
    expect(next).toHaveBeenCalled();
    expect(req.headers.roles).toEqual(['admin']);
  });

  it('should pass when token is valid for user', () => {
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    } as Request;

    jest.spyOn(jwt, 'verify').mockReturnValue({ roles: ['user'] } as any);

    const next = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.headers.roles).toEqual(['user']);
  });

  it('should fail when Authorization header is missing', () => {
    const req = {
      headers: {},
    } as Request;

    const next = jest.fn();

    try {
      middleware.use(req, res, next);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Authorization header is missing');
    }

    expect(next).not.toHaveBeenCalled();
  });

  it('should fail if token not found', () => {
    const req = {
      headers: {
        authorization: 'xxx',
      },
    } as Request;

    const next = jest.fn();

    try {
      middleware.use(req, res, next);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Token not found');
    }

    expect(next).not.toHaveBeenCalled();
  });

  it('should fail if token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bearer any_token',
      },
    } as Request;

    const next = jest.fn();

    jest.spyOn(jwt, 'verify').mockReturnValueOnce('invalid_token' as any);

    try {
      middleware.use(req, res, next);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid token payload');
    }

    expect(next).not.toHaveBeenCalled();
  });

  it('should fail if token is not verified', () => {
    const req = {
      headers: {
        authorization: 'Bearer any_token',
      },
    } as Request;

    const next = jest.fn();

    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Token not verified');
    });

    try {
      middleware.use(req, res, next);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Token not verified');
    }

    expect(next).not.toHaveBeenCalled();
  });
});
