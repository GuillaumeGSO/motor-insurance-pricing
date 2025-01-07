import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { NotFoundException } from '@nestjs/common';
import { UserDto, Role } from '../auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a token for valid user credentials', () => {
    const userDto: UserDto = { username: 'admin', password: 'admin' };
    const result = service.login(userDto);

    expect(result).toEqual({ access_token: 'mockToken' });
    expect(jwtService.sign).toHaveBeenCalledWith(
      { roles: [Role.Admin, Role.User] },
      service.jwtOptions,
    );
  });

  it('should throw NotFoundException for invalid user credentials', () => {
    const userDto: UserDto = { username: 'invalid', password: 'invalid' };

    expect(() => service.login(userDto)).toThrow(NotFoundException);
    expect(() => service.login(userDto)).toThrow('Wrong credentials');
  });

  it('should throw NotFoundException for valid username but wrong password', () => {
    const userDto: UserDto = { username: 'admin', password: 'wrongpassword' };

    expect(() => service.login(userDto)).toThrow(NotFoundException);
    expect(() => service.login(userDto)).toThrow('Wrong credentials');
  });
});