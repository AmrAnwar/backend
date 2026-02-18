import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './auth.guard';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return undefined;
    }
    return (user as { user_id: string }).user_id;
  },
);
