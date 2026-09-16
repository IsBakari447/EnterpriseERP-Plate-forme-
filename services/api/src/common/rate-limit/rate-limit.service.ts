import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

type RateLimitHit = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  resetAt: number;
};

type MemoryBucket = {
  count: number;
  resetAt: number;
};

@Injectable()
export class RateLimitService implements OnModuleDestroy {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly memoryBuckets = new Map<string, MemoryBucket>();
  private redisClient: RedisClientType | null = null;
  private redisConnectPromise: Promise<RedisClientType | null> | null = null;
  private redisDisabledUntil = 0;
  private hasLoggedMemoryFallback = false;

  async hit(key: string, limit: number, windowMs: number): Promise<RateLimitHit> {
    const redis = await this.getRedisClient();

    if (redis) {
      try {
        return await this.hitRedis(redis, key, limit, windowMs);
      } catch {
        this.disableRedisBriefly();
      }
    }

    return this.hitMemory(key, limit, windowMs);
  }

  async reset(key: string) {
    this.memoryBuckets.delete(key);

    const redis = await this.getRedisClient();
    if (!redis) return;

    try {
      await redis.del(key);
    } catch {
      this.disableRedisBriefly();
    }
  }

  async onModuleDestroy() {
    if (this.redisClient?.isOpen) {
      await this.redisClient.quit();
    }
  }

  private async hitRedis(redis: RedisClientType, key: string, limit: number, windowMs: number): Promise<RateLimitHit> {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.pExpire(key, windowMs);
    }

    const ttl = Math.max(await redis.pTTL(key), 0);
    const retryAfterMs = count > limit ? ttl : 0;

    return {
      allowed: count <= limit,
      remaining: Math.max(limit - count, 0),
      retryAfterMs,
      resetAt: Date.now() + ttl,
    };
  }

  private hitMemory(key: string, limit: number, windowMs: number): RateLimitHit {
    const now = Date.now();
    const existing = this.memoryBuckets.get(key);
    const bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs };

    bucket.count += 1;
    this.memoryBuckets.set(key, bucket);

    if (this.memoryBuckets.size > 10_000) {
      this.pruneMemoryBuckets(now);
    }

    const retryAfterMs = bucket.count > limit ? Math.max(bucket.resetAt - now, 0) : 0;

    return {
      allowed: bucket.count <= limit,
      remaining: Math.max(limit - bucket.count, 0),
      retryAfterMs,
      resetAt: bucket.resetAt,
    };
  }

  private async getRedisClient(): Promise<RedisClientType | null> {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.logMemoryFallback("REDIS_URL not configured");
      return null;
    }

    if (Date.now() < this.redisDisabledUntil) return null;

    if (this.redisClient?.isOpen) return this.redisClient;
    if (this.redisConnectPromise) return this.redisConnectPromise;

    this.redisConnectPromise = this.connectRedis(url);
    const client = await this.redisConnectPromise;
    this.redisConnectPromise = null;

    return client;
  }

  private async connectRedis(url: string): Promise<RedisClientType | null> {
    try {
      const client = createClient({ url });
      client.on("error", () => this.disableRedisBriefly());
      await client.connect();
      this.redisClient = client as RedisClientType;
      this.logger.log("[RateLimit] Redis connected - distributed rate limiting enabled");
      return this.redisClient;
    } catch {
      this.disableRedisBriefly("Redis unavailable");
      return null;
    }
  }

  private disableRedisBriefly(reason = "Redis command failed") {
    this.logMemoryFallback(reason);
    this.redisDisabledUntil = Date.now() + 30_000;
  }

  private logMemoryFallback(reason: string) {
    if (this.hasLoggedMemoryFallback) return;
    this.hasLoggedMemoryFallback = true;
    this.logger.warn(`[RateLimit] ${reason} - using memory fallback`);
  }

  private pruneMemoryBuckets(now: number) {
    for (const [key, bucket] of this.memoryBuckets.entries()) {
      if (bucket.resetAt <= now) {
        this.memoryBuckets.delete(key);
      }
    }
  }
}
