type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

const CAPACITY = 10;
const REFILL_PER_SECOND = 1;

export function consumeToken(key: string, cost = 1) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: CAPACITY, lastRefill: now };
  const elapsed = (now - bucket.lastRefill) / 1000;
  const refill = elapsed * REFILL_PER_SECOND;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + refill);
  bucket.lastRefill = now;

  if (bucket.tokens < cost) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.tokens -= cost;
  buckets.set(key, bucket);
  return true;
}
