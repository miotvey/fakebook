import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserMappers } from './user.mapper';
import { UserDocument } from './interfaces/document.model';
import { UserInsert } from './interfaces/insert.models';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMappers,
  ) {}

  async findByLogin(login: string): Promise<UserDocument | null> {
    const user = await this.userRepository.findByLogin(login);

    if (!user) {
      return null;
    }

    const userDocument = this.userMapper.entityToDocument(user);
    return userDocument;
  }

  async insert(data: UserInsert): Promise<UserDocument> {
    const user = await this.userRepository.insert({
      login: data.login,
      password: data.password,
    });

    const userDocument = this.userMapper.entityToDocument(user);
    return userDocument;
  }
}
