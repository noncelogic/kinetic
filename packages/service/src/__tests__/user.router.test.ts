import { TRPCError } from '@trpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { userRouter } from '../routers/user';

// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

// Create a caller for testing
function createTestCaller(userId?: string) {
  return userRouter.createCaller({
    prisma: mockPrisma as never,
    userId,
  });
}

describe('userRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should return user by valid UUID', async () => {
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const caller = createTestCaller();
      const result = await caller.getById({ id: '550e8400-e29b-41d4-a716-446655440000' });

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
      });
    });

    it('should return null for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const caller = createTestCaller();
      const result = await caller.getById({ id: '550e8400-e29b-41d4-a716-446655440000' });

      expect(result).toBeNull();
    });

    it('should reject invalid UUID format', async () => {
      const caller = createTestCaller();

      await expect(caller.getById({ id: 'invalid-uuid' })).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should return paginated users with default limit', async () => {
      const mockUsers = Array.from({ length: 21 }, (_, i) => ({
        id: `550e8400-e29b-41d4-a716-44665544000${i}`,
        email: `user${i}@example.com`,
        name: `User ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const caller = createTestCaller();
      await caller.list({});

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        take: 21, // limit + 1 for cursor detection
        cursor: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return nextCursor when more items exist', async () => {
      const mockUsers = Array.from({ length: 21 }, (_, i) => ({
        id: `550e8400-e29b-41d4-a716-${String(i).padStart(12, '0')}`,
        email: `user${i}@example.com`,
        name: `User ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const caller = createTestCaller();
      const result = await caller.list({ limit: 20 });

      expect(result.items).toHaveLength(20);
      expect(result.nextCursor).toBeDefined();
    });

    it('should not return nextCursor when at end of list', async () => {
      const mockUsers = Array.from({ length: 10 }, (_, i) => ({
        id: `550e8400-e29b-41d4-a716-${String(i).padStart(12, '0')}`,
        email: `user${i}@example.com`,
        name: `User ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const caller = createTestCaller();
      const result = await caller.list({ limit: 20 });

      expect(result.items).toHaveLength(10);
      expect(result.nextCursor).toBeUndefined();
    });

    it('should use cursor for pagination', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const caller = createTestCaller();
      await caller.list({ cursor: '550e8400-e29b-41d4-a716-446655440010' });

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        take: 21,
        cursor: { id: '550e8400-e29b-41d4-a716-446655440010' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should respect limit parameter', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const caller = createTestCaller();
      await caller.list({ limit: 50 });

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        take: 51,
        cursor: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('create', () => {
    it('should create user when authenticated', async () => {
      const newUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'new@example.com',
        name: 'New User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.create.mockResolvedValue(newUser);

      const caller = createTestCaller('user-123');
      const result = await caller.create({
        email: 'new@example.com',
        name: 'New User',
      });

      expect(result).toEqual(newUser);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { email: 'new@example.com', name: 'New User' },
      });
    });

    it('should reject creation without authentication', async () => {
      const caller = createTestCaller(); // No userId

      await expect(caller.create({ email: 'test@example.com', name: 'Test' })).rejects.toThrow(
        TRPCError
      );
    });

    it('should validate email format', async () => {
      const caller = createTestCaller('user-123');

      await expect(caller.create({ email: 'invalid-email', name: 'Test' })).rejects.toThrow();
    });

    it('should validate name length', async () => {
      const caller = createTestCaller('user-123');

      await expect(caller.create({ email: 'test@example.com', name: '' })).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update user when authenticated', async () => {
      const updatedUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'Updated Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const caller = createTestCaller('user-123');
      const result = await caller.update({
        id: '550e8400-e29b-41d4-a716-446655440000',
        data: { name: 'Updated Name' },
      });

      expect(result).toEqual(updatedUser);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: { name: 'Updated Name' },
      });
    });

    it('should reject update without authentication', async () => {
      const caller = createTestCaller();

      await expect(
        caller.update({
          id: '550e8400-e29b-41d4-a716-446655440000',
          data: { name: 'New Name' },
        })
      ).rejects.toThrow(TRPCError);
    });

    it('should validate UUID for id', async () => {
      const caller = createTestCaller('user-123');

      await expect(caller.update({ id: 'not-a-uuid', data: { name: 'Test' } })).rejects.toThrow();
    });

    it('should allow empty update data', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'Unchanged',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const caller = createTestCaller('user-123');
      await caller.update({
        id: '550e8400-e29b-41d4-a716-446655440000',
        data: {},
      });

      expect(mockPrisma.user.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete user when authenticated', async () => {
      const deletedUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'deleted@example.com',
        name: 'Deleted User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.delete.mockResolvedValue(deletedUser);

      const caller = createTestCaller('user-123');
      const result = await caller.delete({ id: '550e8400-e29b-41d4-a716-446655440000' });

      expect(result).toEqual(deletedUser);
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
      });
    });

    it('should reject delete without authentication', async () => {
      const caller = createTestCaller();

      await expect(caller.delete({ id: '550e8400-e29b-41d4-a716-446655440000' })).rejects.toThrow(
        TRPCError
      );
    });

    it('should validate UUID for id', async () => {
      const caller = createTestCaller('user-123');

      await expect(caller.delete({ id: 'invalid' })).rejects.toThrow();
    });
  });
});
