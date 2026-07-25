import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/users/entities/user.entity';

/**
 * Extracts the authenticated user (attached by the JWT strategy) from the
 * request. Optionally returns a single property when a key is provided.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    return data ? user?.[data] : user;
  },
);
