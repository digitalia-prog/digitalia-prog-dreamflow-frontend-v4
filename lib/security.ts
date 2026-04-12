import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function checkQuota(key: string, limit: number) {
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24 * 7);
  }

  return count <= limit;
}
