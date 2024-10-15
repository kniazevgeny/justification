import { Context, Next } from "koa";

const rateLimitMap: { [key: string]: { count: number; resetTime: number } } =
  {};
const WORD_LIMIT = 80000;

export interface RateLimitedContext extends Context {
  state: {
    user?: any;
    wordCount?: number;
  };
}

export const rateLimiter = async (ctx: RateLimitedContext, next: Next) => {
  const userEmail = ctx.state.user.email;
  const currentTime = Date.now();
  const nextDayStart = new Date(currentTime + 24 * 60 * 60 * 1000).setHours(
    0,
    0,
    0,
    0
  );

  if (!rateLimitMap[userEmail]) {
    rateLimitMap[userEmail] = {
      count: 0,
      resetTime: nextDayStart,
    };
  }

  if (currentTime > rateLimitMap[userEmail].resetTime) {
    rateLimitMap[userEmail].count = 0;
    rateLimitMap[userEmail].resetTime = nextDayStart;
  }

  const wordCount = ctx.state.wordCount || 0;
  if (rateLimitMap[userEmail].count + wordCount > WORD_LIMIT) {
    ctx.status = 402;
    ctx.body = { message: "Payment Required: Rate limit exceeded" };
    return;
  }

  rateLimitMap[userEmail].count += wordCount;
  await next();
};

// Export a reset function for testing purposes
export const resetRateLimit = () => {
  for (const key in rateLimitMap) {
    delete rateLimitMap[key];
  }
};
