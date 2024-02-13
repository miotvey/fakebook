import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { UserEntity } from './entities/user.entity';
import { UserInsert } from './interfaces/insert.models';

@Injectable()
export class UserRepository {
  public readonly userRepository: Repository<UserEntity>;

  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(UserEntity);
  }
  async insert(data: UserInsert): Promise<UserEntity> {
    const user = this.userRepository.create({
      uuid: uuid(),
      login: data.login,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.insert(user);

    return user;
  }

  async findByLogin(login: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { login } });
    return user;
  }
}
