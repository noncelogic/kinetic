import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { PaginationSchema, paginatedResponse, IdSchema } from '../common';

describe('PaginationSchema', () => {
  it('should apply default values', () => {
    const result = PaginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('should accept valid pagination input', () => {
    const input = { page: 5, limit: 50 };
    const result = PaginationSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(5);
      expect(result.data.limit).toBe(50);
    }
  });

  it('should reject non-positive page numbers', () => {
    expect(PaginationSchema.safeParse({ page: 0 }).success).toBe(false);
    expect(PaginationSchema.safeParse({ page: -1 }).success).toBe(false);
  });

  it('should reject non-positive limit values', () => {
    expect(PaginationSchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(PaginationSchema.safeParse({ limit: -5 }).success).toBe(false);
  });

  it('should enforce maximum limit of 100', () => {
    expect(PaginationSchema.safeParse({ limit: 100 }).success).toBe(true);
    expect(PaginationSchema.safeParse({ limit: 101 }).success).toBe(false);
  });

  it('should reject non-integer values', () => {
    expect(PaginationSchema.safeParse({ page: 1.5 }).success).toBe(false);
    expect(PaginationSchema.safeParse({ limit: 10.5 }).success).toBe(false);
  });
});

describe('paginatedResponse', () => {
  it('should create a valid paginated response schema', () => {
    const ItemSchema = z.object({ id: z.string(), name: z.string() });
    const PaginatedItemSchema = paginatedResponse(ItemSchema);

    const validResponse = {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ],
      total: 50,
      page: 1,
      limit: 20,
      totalPages: 3,
    };

    const result = PaginatedItemSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should allow empty items array', () => {
    const ItemSchema = z.object({ id: z.string() });
    const PaginatedItemSchema = paginatedResponse(ItemSchema);

    const emptyResponse = {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };

    const result = PaginatedItemSchema.safeParse(emptyResponse);
    expect(result.success).toBe(true);
  });

  it('should reject items that do not match the schema', () => {
    const ItemSchema = z.object({ id: z.string().uuid(), value: z.number() });
    const PaginatedItemSchema = paginatedResponse(ItemSchema);

    const invalidItems = {
      items: [{ id: 'not-a-uuid', value: 'not-a-number' }],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    const result = PaginatedItemSchema.safeParse(invalidItems);
    expect(result.success).toBe(false);
  });

  it('should require all pagination metadata fields', () => {
    const ItemSchema = z.object({ id: z.string() });
    const PaginatedItemSchema = paginatedResponse(ItemSchema);

    const missingTotal = {
      items: [],
      page: 1,
      limit: 20,
      totalPages: 0,
    };

    const result = PaginatedItemSchema.safeParse(missingTotal);
    expect(result.success).toBe(false);
  });

  it('should work with complex item schemas', () => {
    const ComplexItemSchema = z.object({
      id: z.string().uuid(),
      nested: z.object({
        count: z.number(),
        tags: z.array(z.string()),
      }),
      optional: z.string().optional(),
    });
    const PaginatedSchema = paginatedResponse(ComplexItemSchema);

    const validComplex = {
      items: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nested: { count: 5, tags: ['a', 'b'] },
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    const result = PaginatedSchema.safeParse(validComplex);
    expect(result.success).toBe(true);
  });
});

describe('IdSchema', () => {
  it('should validate valid UUID', () => {
    const input = { id: '550e8400-e29b-41d4-a716-446655440000' };
    const result = IdSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUID format', () => {
    const invalidIds = [
      { id: 'not-a-uuid' },
      { id: '550e8400-e29b-41d4-a716' }, // truncated
      { id: '550e8400-e29b-41d4-a716-446655440000-extra' }, // too long
      { id: '550E8400-E29B-41D4-A716-446655440000' }, // uppercase should still work
    ];

    // First three should fail
    expect(IdSchema.safeParse(invalidIds[0]).success).toBe(false);
    expect(IdSchema.safeParse(invalidIds[1]).success).toBe(false);
    expect(IdSchema.safeParse(invalidIds[2]).success).toBe(false);
    // Uppercase UUIDs are valid
    expect(IdSchema.safeParse(invalidIds[3]).success).toBe(true);
  });

  it('should require id field', () => {
    const result = IdSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject non-string id', () => {
    const result = IdSchema.safeParse({ id: 12345 });
    expect(result.success).toBe(false);
  });

  it('should reject empty string id', () => {
    const result = IdSchema.safeParse({ id: '' });
    expect(result.success).toBe(false);
  });
});
