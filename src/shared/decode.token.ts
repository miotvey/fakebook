import { ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { unix } from 'moment';
import 'dotenv';
import { AppConfig } from '../config/env/app.config';

const algorithm = 'RS256';

export interface TokenPayload {
  uuid: string;
  login: string;
  createdAt: number;
  expireDate?: Date;
}

export async function decodeAuthToken(
  authToken: string,
): Promise<TokenPayload> {
  if (!authToken.length) {
    throw new ForbiddenException('Verification failed');
  }

  try {
    const payload: any = await jwt.verify(authToken, AppConfig.JWT_PUBLIC_KEY, {
      algorithms: [algorithm],
    });
    payload.expireDate = unix(payload.exp).toDate();

    return payload;
  } catch (e) {
    throw new ForbiddenException('Verification failed');
  }
}
