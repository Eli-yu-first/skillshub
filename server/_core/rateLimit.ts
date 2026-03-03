import { TRPCError } from "@trpc/server";

type RateLimitRecord = {
  count: number;
  lastReset: number;
};

// Simple in-memory rate limiter using sliding window concept
// Note: For multi-node production, this should map to Redis.
const rateLimitStore = new Map<string, RateLimitRecord>();

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

export async function checkRateLimit(ip: string, options: RateLimitOptions): Promise<void> {
  const { windowMs, maxRequests, keyPrefix } = options;
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record) {
    rateLimitStore.set(key, { count: 1, lastReset: now });
    return;
  }

  // If window expired, reset count
  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
    return;
  }

  // If window active and count exceeded
  if (record.count >= maxRequests) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Please try again later.`,
    });
  }

  // Increment count
  record.count += 1;
}

/**
 * Cleanup routine to prevent Map memory leak
 */
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, record]) => {
    // Arbitrary cleanup threshold: 1 hour idle
    if (now - record.lastReset > 60 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  });
}, 30 * 60 * 1000); // Check every 30 mins
