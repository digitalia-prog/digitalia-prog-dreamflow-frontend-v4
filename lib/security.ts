import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const BETA_DURATION_DAYS = 7;

export async function checkQuota(key: string, limit: number) {
  const now = Date.now();

  const betaKey = `beta:start:${key}`;
  const usageKey = `beta:usage:${key}`;

  const betaStart = await redis.get<number>(betaKey);

  // créer la date de début si inexistante
  if (!betaStart) {
    await redis.set(betaKey, now);
  }

  const start = betaStart || now;

  const diffDays =
    (now - start) / (1000 * 60 * 60 * 24);

  // si beta expirée
  if (diffDays > BETA_DURATION_DAYS) {
    return false;
  }

  const usage = await redis.incr(usageKey);

  if (usage === 1) {
    await redis.expire(
      usageKey,
      60 * 60 * 24 * BETA_DURATION_DAYS
    );
  }

  if (usage > limit) {
    return false;
  }

  return true;
}
