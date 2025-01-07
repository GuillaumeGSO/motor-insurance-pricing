import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'Username', required: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}
