import "reflect-metadata";
import { RateLimitService } from "../src/common/rate-limit/rate-limit.service";

async function main() {
  const service = new RateLimitService();
  const key = `security-test:${Date.now()}`;

  const first = await service.hit(key, 2, 100);
  const second = await service.hit(key, 2, 100);
  const blocked = await service.hit(key, 2, 100);

  if (!first.allowed || !second.allowed) {
    throw new Error("Expected requests inside the limit to be accepted.");
  }

  if (blocked.allowed || blocked.retryAfterMs <= 0) {
    throw new Error("Expected excess requests to be rejected with a retry window.");
  }

  await new Promise((resolve) => setTimeout(resolve, 120));
  const afterReset = await service.hit(key, 2, 100);

  if (!afterReset.allowed) {
    throw new Error("Expected access to be restored after the window expires.");
  }

  await service.onModuleDestroy();
  console.log("Rate limit security checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
