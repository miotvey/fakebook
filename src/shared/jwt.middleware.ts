import { ExceptionUtils } from 'src/common/exception.utils';

import { decodeAuthToken } from './decode.token';
import { UnauthorizedException } from '@nestjs/common';

export async function jwtTokenMiddleware(req, _res?, next?) {
  const authHeader: string | undefined = req.headers?.authorization;
  if (!authHeader) {
    return next && next();
  }
  const [, token] = authHeader.split(' ');

  if (!token) {
    return next && next();
    throw new UnauthorizedException();
  }

  try {
    const tokenData = await decodeAuthToken(token);

    req.session = {
      uuid: tokenData.uuid,
      login: tokenData.login,
    };
  } catch (err) {
    console.log(ExceptionUtils.detectMessage(err));
  }

  return next && next();
}
