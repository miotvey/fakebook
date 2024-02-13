import { Injectable } from '@nestjs/common';

import { UserDocument } from './interfaces/document.model';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserMappers {
  entityToDocument(user: UserEntity): UserDocument {
    const document: UserDocument = {
      uuid: user.uuid,
      login: user.login,
      password: user.password,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return document;
  }
}
