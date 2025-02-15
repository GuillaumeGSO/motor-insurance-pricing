import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserDto } from '../auth.dto';
import { NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a token for valid user credentials', async () => {
    const userDto: UserDto = { username: 'admin', password: 'admin' };
    const token = { access_token: 'mockToken' };
    jest.spyOn(authService, 'login').mockReturnValue(token);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .expect(201);

    expect(response.body).toEqual(token);
    expect(authService.login).toHaveBeenCalledWith(userDto);
  });

  it('should fail for invalid user credentials', async () => {
    const userDto: UserDto = { username: 'invalid', password: 'invalid' };
    jest.spyOn(authService, 'login').mockImplementation(() => {
      throw new NotFoundException('Wrong credentials');
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .expect(404);

    expect(response.body.message).toBe('Wrong credentials');
    expect(authService.login).toHaveBeenCalledWith(userDto);
  });

  it('should fail for valid username but wrong password', async () => {
    const userDto: UserDto = { username: 'admin', password: 'wrongpassword' };
    jest.spyOn(authService, 'login').mockImplementation(() => {
      throw new NotFoundException('Wrong credentials');
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .expect(404);

    expect(response.body.message).toBe('Wrong credentials');
    expect(authService.login).toHaveBeenCalledWith(userDto);
  });
});