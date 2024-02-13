import * as jwt from 'jsonwebtoken';
import { AppConfig } from '../../config/env/app.config';

const expirationPeriod = '30d';
const algorithm = 'RS256';

export interface TokenPayload {
  uuid: string;
  login: string;
  createdAt: number;
  expireDate?: Date;
}

export function generateAuthToken(uuid: string, login: string): string {
  const payload: TokenPayload = {
    uuid,
    login,
    createdAt: Date.now(),
  };

  return generateUserToken(payload);
}

export function generateUserToken(
  payload: TokenPayload,
  expiresIn?: string,
): string {
  const header = { typ: 'JWT', alg: algorithm };

  return jwt.sign(payload, AppConfig.JWT_PRIVATE_KEY, {
    algorithm,
    header,
    expiresIn: expiresIn || expirationPeriod,
  });
}
