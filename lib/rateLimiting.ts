import redis from "./redisConfig";

// Progressive rate limiting windows
export const RATE_LIMIT_TIERS = {
  FIRST: {
    window: 5 * 60, // 5 minutes
    maxAttempts: 3,
  },
  SECOND: {
    window: 15 * 60, // 15 minutes
    maxAttempts: 6, // 3 additional attempts
  },
  THIRD: {
    window: 30 * 60, // 30 minutes
    maxAttempts: 9, // 3 additional attempts
  },
};

export async function rateLimiter(key: string): Promise<{
  allowed: boolean;
  timeLeft?: number;
  tierLevel?: string;
}> {
  const attempts = await redis.incr(`ratelimit:${key}`);
  const currentWindow = await redis.ttl(`ratelimit:${key}`);

  // First attempt, set initial window
  if (attempts === 1) {
    await redis.expire(`ratelimit:${key}`, RATE_LIMIT_TIERS.FIRST.window);
    return { allowed: true, tierLevel: "FIRST" };
  }

  // Determine current tier based on attempts
  if (attempts <= RATE_LIMIT_TIERS.FIRST.maxAttempts) {
    return {
      allowed: true,
      timeLeft: currentWindow,
      tierLevel: "FIRST",
    };
  } else if (attempts === RATE_LIMIT_TIERS.FIRST.maxAttempts + 1) {
    // Upgrade to second tier
    await redis.expire(`ratelimit:${key}`, RATE_LIMIT_TIERS.SECOND.window);
    return {
      allowed: true,
      timeLeft: RATE_LIMIT_TIERS.SECOND.window,
      tierLevel: "SECOND",
    };
  } else if (attempts <= RATE_LIMIT_TIERS.SECOND.maxAttempts) {
    return {
      allowed: true,
      timeLeft: currentWindow,
      tierLevel: "SECOND",
    };
  } else if (attempts === RATE_LIMIT_TIERS.SECOND.maxAttempts + 1) {
    // Upgrade to third tier
    await redis.expire(`ratelimit:${key}`, RATE_LIMIT_TIERS.THIRD.window);
    return {
      allowed: true,
      timeLeft: RATE_LIMIT_TIERS.THIRD.window,
      tierLevel: "THIRD",
    };
  } else if (attempts <= RATE_LIMIT_TIERS.THIRD.maxAttempts) {
    return {
      allowed: true,
      timeLeft: currentWindow,
      tierLevel: "THIRD",
    };
  }

  // Exceeded all tiers
  return {
    allowed: false,
    timeLeft: currentWindow,
    tierLevel: "BLOCKED",
  };
}

export async function resetRateLimit(key: string): Promise<void> {
  await redis.del(`ratelimit:${key}`);
}

export async function getRateLimitInfo(key: string): Promise<{
  remainingAttempts: number;
  currentTier: string;
  timeLeft: number;
}> {
  const [attempts, timeLeft] = await Promise.all([
    redis.get(`ratelimit:${key}`),
    redis.ttl(`ratelimit:${key}`),
  ]);

  const currentAttempts = parseInt(attempts as string) || 0;

  // Determine current tier and remaining attempts
  if (currentAttempts <= RATE_LIMIT_TIERS.FIRST.maxAttempts) {
    return {
      remainingAttempts: RATE_LIMIT_TIERS.FIRST.maxAttempts - currentAttempts,
      currentTier: "FIRST",
      timeLeft,
    };
  } else if (currentAttempts <= RATE_LIMIT_TIERS.SECOND.maxAttempts) {
    return {
      remainingAttempts: RATE_LIMIT_TIERS.SECOND.maxAttempts - currentAttempts,
      currentTier: "SECOND",
      timeLeft,
    };
  } else {
    return {
      remainingAttempts: Math.max(
        0,
        RATE_LIMIT_TIERS.THIRD.maxAttempts - currentAttempts
      ),
      currentTier: "THIRD",
      timeLeft,
    };
  }
}
