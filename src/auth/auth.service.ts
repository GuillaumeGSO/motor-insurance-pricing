import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { Role, UserDto } from './auth.dto';

@Injectable()
export class AuthService {
  jwtOptions: JwtModuleOptions;

  //simulate user/role database thqt should be in its own service/repository
  users = [
    {
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin, Role.User],
    },
    {
      username: 'user',
      password: 'user',
      roles: [Role.User],
    },
  ];

  constructor(private readonly jwtService: JwtService) {
    this.jwtOptions = {
      secret: process.env.JWT_SECRET,
    };
  }

  login(userDto: UserDto) {
    const user = this.users.find(
      (u) => u.username === userDto.username && u.password === userDto.password,
    );

    if (!user) {
      throw new NotFoundException('Wrong credentials');
    }

    return {
      access_token: this.jwtService.sign(
        { roles: user.roles },
        this.jwtOptions,
      ),
    };
  }
}
