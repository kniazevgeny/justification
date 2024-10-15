import { rateLimiter, resetRateLimit, RateLimitedContext } from '../middleware/rateLimitMiddleware';

describe('Rate Limiter Middleware', () => {
  // Utility function to create a mock context
  const createMockContext = (userEmail: string, wordCount: number): RateLimitedContext => {
    const ctx = {
      state: {
        user: { email: userEmail },
        wordCount: wordCount,
      },
      status: 200,
      body: {},
      set: jest.fn(),
    } as unknown as RateLimitedContext;
    return ctx;
  };

  // Mock next function
  const mockNext = jest.fn<Promise<void>, []>().mockResolvedValue(undefined);

  beforeEach(() => {
    // Reset the rate limiter state before each test
    resetRateLimit();
    mockNext.mockClear();
  });

  test('should allow request within the rate limit and call next', async () => {
    const ctx = createMockContext('user1@example.com', 1000); // 1,000 words
    await rateLimiter(ctx, mockNext);

    expect(ctx.status).toBe(200); // Status remains unchanged
    expect(ctx.body).toEqual({}); // Body remains unchanged
    expect(mockNext).toHaveBeenCalled(); // next() is called
  });

  test('should block request that exceeds the rate limit', async () => {
    const ctx = createMockContext('user2@example.com', 80001); // 80,001 words
    await rateLimiter(ctx, mockNext);

    expect(ctx.status).toBe(402); // Payment Required
    expect(ctx.body).toEqual({ message: 'Payment Required: Rate limit exceeded' });
    expect(mockNext).not.toHaveBeenCalled(); // next() is not called
  });

  test('should accumulate word counts and block when limit is exceeded', async () => {
    const userEmail = 'user3@example.com';

    // First request: 70,000 words
    const ctx1 = createMockContext(userEmail, 70000);
    await rateLimiter(ctx1, mockNext);
    expect(ctx1.status).toBe(200);
    expect(mockNext).toHaveBeenCalled();

    // Second request: 10,000 words (total: 80,000)
    const ctx2 = createMockContext(userEmail, 10000);
    await rateLimiter(ctx2, mockNext);
    expect(ctx2.status).toBe(200);
    expect(mockNext).toHaveBeenCalled();

    mockNext.mockClear();

    // Third request: 1 word (total: 80,001)
    const ctx3 = createMockContext(userEmail, 1);
    await rateLimiter(ctx3, mockNext);
    expect(ctx3.status).toBe(402);
    expect(ctx3.body).toEqual({ message: 'Payment Required: Rate limit exceeded' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should reset count after window size', async () => {
    const userEmail = 'user4@example.com';

    // Mock Date.now() to control time
    const originalDateNow = Date.now;
    let mockTime = originalDateNow();
    jest.spyOn(Date, 'now').mockImplementation(() => mockTime);

    // First request: 80,000 words
    const ctx1 = createMockContext(userEmail, 80000);
    await rateLimiter(ctx1, mockNext);
    expect(ctx1.status).toBe(200);
    expect(mockNext).toHaveBeenCalled();

    mockNext.mockClear();

    // Second request: 1 word, should be blocked
    const ctx2 = createMockContext(userEmail, 1);
    await rateLimiter(ctx2, mockNext);
    expect(ctx2.status).toBe(402);
    expect(ctx2.body).toEqual({ message: 'Payment Required: Rate limit exceeded' });
    expect(mockNext).not.toHaveBeenCalled();

    // Advance time by WINDOW_SIZE + 1ms to simulate window reset
    mockTime += 24 * 60 * 60 * 1000 + 1; // 24 hours and 1 ms

    // Third request: 1 word, should be allowed after reset
    const ctx3 = createMockContext(userEmail, 1);
    await rateLimiter(ctx3, mockNext);
    expect(ctx3.status).toBe(200);
    expect(mockNext).toHaveBeenCalled();

    // Restore Date.now()
    jest.spyOn(Date, 'now').mockRestore();
  });

  test('should handle multiple users independently', async () => {
    const userEmail1 = 'user5@example.com';
    const userEmail2 = 'user6@example.com';

    // User 1: 80,000 words
    const ctx1 = createMockContext(userEmail1, 80000);
    await rateLimiter(ctx1, mockNext);
    expect(ctx1.status).toBe(200);
    expect(mockNext).toHaveBeenCalled();

    mockNext.mockClear();

    // User 2: 80,001 words
    const ctx2 = createMockContext(userEmail2, 80001);
    await rateLimiter(ctx2, mockNext);
    expect(ctx2.status).toBe(402);
    expect(ctx2.body).toEqual({ message: 'Payment Required: Rate limit exceeded' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should handle missing wordCount gracefully', async () => {
    const ctx = {
      state: {
        user: { email: 'user7@example.com' },
        // wordCount is undefined
      },
      status: 200,
      body: {},
      set: jest.fn(),
    } as unknown as RateLimitedContext;

    await rateLimiter(ctx, mockNext);

    expect(ctx.status).toBe(200); // Default status
    expect(mockNext).toHaveBeenCalled(); // next() is called
  });
});
