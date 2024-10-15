import { Context, Next } from 'koa';

/**
 * Middleware to calculate the word count of the request body.
 */
export const wordCountMiddleware = async (ctx: Context, next: Next) => {
  const text: string = ctx.request.body as string;

  if (!text) {
    ctx.status = 400;
    ctx.body = { message: 'Bad Request: Text is required' };
    return;
  }

  const wordCount = text.split(/\s+/).length;;
  // Attach word count to context state
  ctx.state.wordCount = wordCount;

  await next();
};
