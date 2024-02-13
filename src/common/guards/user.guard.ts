import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { extractSession } from '../decorators';

@Injectable()
export class UserGuard implements CanActivate {
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const session = extractSession(ctx);

    if (!session) {
      return false;
    }

    return true;
  }
}
