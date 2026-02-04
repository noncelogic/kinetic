import { describe, expect, it } from 'vitest';

import { healthRouter } from '../routers/health';

describe('healthRouter', () => {
  describe('ping', () => {
    it('should return ok status', async () => {
      const caller = healthRouter.createCaller({
        prisma: {} as never,
      });

      const result = await caller.ping();

      expect(result.ok).toBe(true);
    });

    it('should return ISO timestamp', async () => {
      const caller = healthRouter.createCaller({
        prisma: {} as never,
      });

      const result = await caller.ping();

      expect(result.ts).toBeDefined();
      expect(typeof result.ts).toBe('string');
      // Validate ISO format
      expect(() => new Date(result.ts)).not.toThrow();
      expect(new Date(result.ts).toISOString()).toBe(result.ts);
    });

    it('should return current timestamp (within tolerance)', async () => {
      const before = new Date();

      const caller = healthRouter.createCaller({
        prisma: {} as never,
      });
      const result = await caller.ping();

      const after = new Date();
      const resultDate = new Date(result.ts);

      expect(resultDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(resultDate.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
