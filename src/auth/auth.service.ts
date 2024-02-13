import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { createHash } from 'crypto';
import {
  AuthResponse,
  GenerateToken,
  LoginUserBody,
  RegisterUserBody,
} from './interfaces';
import { generateAuthToken } from './utils/generate.user.token';
import * as process from 'process';
import { UserInsert } from '../user/interfaces/insert.models';
import { AppConfig } from '../config/env/app.config';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async register(data: RegisterUserBody) {
    const { login, password } = data;

    const existingUser = await this.userService.findByLogin(login);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким именем уже существует');
    }

    const hashPassword = createHash('sha256')
      .update(AppConfig.JWT_SECRET + password)
      .digest('hex');

    const userInsert: UserInsert = {
      login,
      password: hashPassword,
    };

    const user = await this.userService.insert(userInsert);

    return this.generateAuthToken({
      user,
      password,
    });
  }

  async login(data: LoginUserBody) {
    const { login, password } = data;

    const user = await this.userService.findByLogin(login);

    if (!user) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Пользователь с таким логин не существует',
        error: 'Bad Request',
      });
    }

    return this.generateAuthToken({
      user: { ...user },
      password,
    });
  }

  async generateAuthToken(data: GenerateToken): Promise<AuthResponse> {
    const { user, password } = data;

    if (
      user &&
      createHash('sha256')
        .update(AppConfig.JWT_SECRET + password)
        .digest('hex') !== user.password
    ) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Пользователя с таким логином и паролем не существует',
        error: 'Bad Request',
      });
    }

    const authToken = generateAuthToken(user.uuid, user.login);

    return {
      uuid: user.uuid,
      authToken,
    };
  }
}
