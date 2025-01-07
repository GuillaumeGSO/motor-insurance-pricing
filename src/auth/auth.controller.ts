import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Res() res, @Body() user: UserDto) {
    const token = this.authService.login(user);
    return res.json(token);
  }
}
