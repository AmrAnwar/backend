import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: Record<string, any> }>();
    const user: Record<string, any> | undefined = request.user;

    if (!user) {
      return undefined;
    }
    return user;
  },
);
