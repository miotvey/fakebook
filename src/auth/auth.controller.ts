import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserBodyDto, RegisterUserBodyDto } from './dto/requests.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ValidateAuthorizationResponse } from './dto/responses.dto';
import { AuthResponse } from './interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'Register a new user',
    type: ValidateAuthorizationResponse.schema,
  })
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: RegisterUserBodyDto): Promise<AuthResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: ValidateAuthorizationResponse.schema,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserBodyDto): Promise<AuthResponse> {
    return this.authService.login(body);
  }
}
