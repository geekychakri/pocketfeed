import { Redis } from "@upstash/redis";

const globalForRedis = global as unknown as {
  redis: Redis;
};

const upstashRedis =
  globalForRedis.redis ||
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = upstashRedis;

export { upstashRedis };
