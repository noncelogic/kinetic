import { prisma } from '@repo/database';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { feedbackRouter } from '../routers/feedback';

// Mock @repo/database
vi.mock('@repo/database', () => ({
  prisma: {
    feedback: {
      create: vi.fn(),
    },
  },
}));

// Type assertion for mocked prisma
const mockPrisma = prisma as unknown as {
  feedback: {
    create: ReturnType<typeof vi.fn>;
  };
};

// Create a caller for testing
function createTestCaller(userId?: string) {
  return feedbackRouter.createCaller({
    prisma: mockPrisma as never,
    userId,
  });
}

describe('feedbackRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submit', () => {
    it('should create bug feedback with type mapping', async () => {
      const mockFeedback = {
        id: '1',
        title: 'Bug Report',
        description: 'Something is broken',
        type: 'BUG_REPORT',
        metadata: {},
        authorEmail: 'user@example.com',
        authorId: null,
        createdAt: new Date(),
      };
      mockPrisma.feedback.create.mockResolvedValue(mockFeedback);

      const caller = createTestCaller();
      await caller.submit({
        title: 'Bug Report',
        description: 'Something is broken',
        type: 'BUG',
        email: 'user@example.com',
      });

      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: {
          title: 'Bug Report',
          description: 'Something is broken',
          type: 'BUG_REPORT',
          metadata: {},
          authorEmail: 'user@example.com',
          authorId: undefined,
        },
      });
    });

    it('should create feature feedback with type mapping', async () => {
      mockPrisma.feedback.create.mockResolvedValue({});

      const caller = createTestCaller();
      await caller.submit({
        title: 'Feature Request',
        description: 'Please add dark mode',
        type: 'FEATURE',
      });

      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'FEATURE_REQUEST',
        }),
      });
    });

    it('should create general feedback without type mapping', async () => {
      mockPrisma.feedback.create.mockResolvedValue({});

      const caller = createTestCaller();
      await caller.submit({
        title: 'General Feedback',
        description: 'Great product!',
        type: 'GENERAL',
      });

      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'GENERAL',
        }),
      });
    });

    it('should include userId when authenticated', async () => {
      mockPrisma.feedback.create.mockResolvedValue({});

      const caller = createTestCaller('user-123');
      await caller.submit({
        title: 'Authenticated Feedback',
        description: 'From a logged in user',
        type: 'GENERAL',
      });

      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          authorId: 'user-123',
        }),
      });
    });

    it('should handle metadata field', async () => {
      mockPrisma.feedback.create.mockResolvedValue({});

      const caller = createTestCaller();
      await caller.submit({
        title: 'With Metadata',
        description: 'Has extra info',
        type: 'BUG',
        metadata: { screenshot: 'base64data', url: '/broken-page' },
      });

      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: { screenshot: 'base64data', url: '/broken-page' },
        }),
      });
    });

    it('should require title with at least 1 character', async () => {
      const caller = createTestCaller();

      await expect(
        caller.submit({
          title: '',
          description: 'Description',
          type: 'GENERAL',
        })
      ).rejects.toThrow();
    });

    it('should validate email format when provided', async () => {
      const caller = createTestCaller();

      await expect(
        caller.submit({
          title: 'Feedback',
          description: 'Description',
          type: 'GENERAL',
          email: 'invalid-email',
        })
      ).rejects.toThrow();
    });

    it('should reject invalid type values', async () => {
      const caller = createTestCaller();

      await expect(
        caller.submit({
          title: 'Feedback',
          description: 'Description',
          type: 'INVALID_TYPE' as 'BUG',
        })
      ).rejects.toThrow();
    });

    it('should allow missing optional email', async () => {
      mockPrisma.feedback.create.mockResolvedValue({});

      const caller = createTestCaller();
      await caller.submit({
        title: 'Anonymous Feedback',
        description: 'No email provided',
        type: 'GENERAL',
      });

      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          authorEmail: undefined,
        }),
      });
    });
  });
});
