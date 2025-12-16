/**
 * Advanced idempotency middleware with rate limiting
 */
const keyUsageMap = new Map<string, { count: number; firstUsed: number }>();

export default () => {
  return async (ctx, next) => {
    if (!["POST", "PUT"].includes(ctx.request.method)) {
      return next();
    }

    const key = ctx.request.headers["idempotency-key"];

    if (!key) {
      return ctx.badRequest("Idempotency-Key header is required");
    }

    if (typeof key !== "string" || key.trim().length === 0) {
      return ctx.badRequest("Idempotency-Key must be a non-empty string");
    }

    if (key.length > 255) {
      return ctx.badRequest("Idempotency-Key must be less than 255 characters");
    }

    const validKeyPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validKeyPattern.test(key)) {
      return ctx.badRequest(
        "Idempotency-Key must contain only letters, numbers, hyphens, and underscores"
      );
    }

    // Rate limiting: max 10 requests per key per minute
    const now = Date.now();
    const usage = keyUsageMap.get(key);

    if (usage) {
      const timeSinceFirst = now - usage.firstUsed;

      // Reset counter after 1 minute
      if (timeSinceFirst > 60000) {
        keyUsageMap.set(key, { count: 1, firstUsed: now });
      } else if (usage.count >= 10) {
        return ctx.tooManyRequests(
          "Too many requests with this idempotency key. Please wait before retrying."
        );
      } else {
        usage.count++;
      }
    } else {
      keyUsageMap.set(key, { count: 1, firstUsed: now });
    }

    // Clean up old entries (prevent memory leak)
    if (keyUsageMap.size > 10000) {
      const oldestAllowed = now - 60000;
      for (const [k, v] of keyUsageMap.entries()) {
        if (v.firstUsed < oldestAllowed) {
          keyUsageMap.delete(k);
        }
      }
    }

    ctx.state.idempotencyKey = key.trim();

    await next();
  };
};
