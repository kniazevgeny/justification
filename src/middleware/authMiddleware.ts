import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

export interface AuthenticatedContext extends Context {
  state: {
    user?: any;
  };
}

export const authenticateToken = async (ctx: AuthenticatedContext, next: Next) => {
  const authHeader = ctx.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'Unauthorized: Token not provided' };
    return;
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET as string);
    ctx.state.user = user;
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { message: 'Forbidden: Invalid token' };
  }
};
