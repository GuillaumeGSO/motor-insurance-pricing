import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Generate a JWT token using user credentials',
  })
  @ApiBody({ type: UserDto })
  @ApiResponse({
    status: 201,
    description: 'JWT access token for authentication',
  })
  login(@Res() res, @Body() user: UserDto) {
    const token = this.authService.login(user);
    return res.json(token);
  }
}
