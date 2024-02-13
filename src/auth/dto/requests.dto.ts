import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserBodyDto {
  @IsString()
  @IsNotEmpty()
  public readonly login: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class RegisterUserBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User login',
    example: 'Some_login',
    type: String,
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'User password',
    example: 'Some_password',
    type: String,
  })
  password: string;
}
