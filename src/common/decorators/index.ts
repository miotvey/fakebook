import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserSession } from '../interfaces';

export function extractSession<T extends UserSession>(
  ctx: ExecutionContext,
): T | undefined {
  const { session } = ctx.switchToHttp().getRequest();

  return session;
}

export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return extractSession(ctx);
  },
);
