import { Context } from 'koa';
import jwt from 'jsonwebtoken';

interface TokenRequest {
  email: string
}

export const generateToken = async (ctx: Context) => {
  const { email } = ctx.request.body as TokenRequest;

  if (!email) {
    ctx.status = 400;
    ctx.body = { message: 'Email is required' };
    return;
  }

  const token = jwt.sign({ email }, process.env.TOKEN_SECRET as string, { expiresIn: '24h' });

  ctx.body = { token };
};