import { describe, it, expect } from 'vitest';

import {
  AssetSchema,
  AssetStatusEnum,
  AssetTypeEnum,
  RoleEnum,
  ReviewDecisionEnum,
  CreateAssetSchema,
  UpdateAssetSchema,
  ApprovalQueueFiltersSchema,
  ReviewAssetSchema,
  BulkApproveSchema,
  BulkRejectSchema,
} from '../asset';

describe('AssetStatusEnum', () => {
  it('should accept valid asset statuses', () => {
    const validStatuses = [
      'DRAFT',
      'PENDING_REVIEW',
      'IN_REVIEW',
      'APPROVED',
      'REJECTED',
      'ARCHIVED',
    ];
    validStatuses.forEach((status) => {
      expect(() => AssetStatusEnum.parse(status)).not.toThrow();
    });
  });

  it('should reject invalid status values', () => {
    expect(() => AssetStatusEnum.parse('INVALID')).toThrow();
    expect(() => AssetStatusEnum.parse('')).toThrow();
    expect(() => AssetStatusEnum.parse(123)).toThrow();
  });

  it('should be case-sensitive', () => {
    expect(() => AssetStatusEnum.parse('draft')).toThrow();
    expect(() => AssetStatusEnum.parse('Draft')).toThrow();
  });
});

describe('AssetTypeEnum', () => {
  it('should accept valid asset types', () => {
    const validTypes = ['DESIGN', 'SPECIFICATION', 'PROTOTYPE', 'DOCUMENTATION'];
    validTypes.forEach((type) => {
      expect(() => AssetTypeEnum.parse(type)).not.toThrow();
    });
  });

  it('should reject invalid type values', () => {
    expect(() => AssetTypeEnum.parse('INVALID')).toThrow();
    expect(() => AssetTypeEnum.parse(null)).toThrow();
  });

  it('should not accept undefined', () => {
    expect(() => AssetTypeEnum.parse(undefined)).toThrow();
  });
});

describe('RoleEnum', () => {
  it('should accept valid roles', () => {
    const validRoles = ['VIEWER', 'CONTRIBUTOR', 'REVIEWER', 'ADMIN'];
    validRoles.forEach((role) => {
      const result = RoleEnum.safeParse(role);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid roles', () => {
    const result = RoleEnum.safeParse('SUPER_ADMIN');
    expect(result.success).toBe(false);
  });

  it('should provide type inference', () => {
    const role = RoleEnum.parse('ADMIN');
    expect(role).toBe('ADMIN');
  });
});

describe('ReviewDecisionEnum', () => {
  it('should accept valid review decisions', () => {
    expect(ReviewDecisionEnum.parse('APPROVED')).toBe('APPROVED');
    expect(ReviewDecisionEnum.parse('REJECTED')).toBe('REJECTED');
    expect(ReviewDecisionEnum.parse('CHANGES_REQUESTED')).toBe('CHANGES_REQUESTED');
  });

  it('should reject invalid decisions', () => {
    expect(() => ReviewDecisionEnum.parse('PENDING')).toThrow();
  });

  it('should handle safeParse correctly', () => {
    const result = ReviewDecisionEnum.safeParse('INVALID_DECISION');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
    }
  });
});

describe('AssetSchema', () => {
  const validAsset = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    type: 'DESIGN',
    title: 'Test Asset',
    description: 'A test description',
    content: { data: 'test' },
    version: 1,
    status: 'DRAFT',
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    assigneeId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    submittedAt: null,
    reviewedAt: null,
    parentId: null,
  };

  it('should validate a complete valid asset', () => {
    const result = AssetSchema.safeParse(validAsset);
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUID for id', () => {
    const invalid = { ...validAsset, id: 'not-a-uuid' };
    const result = AssetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should require title to be at least 1 character', () => {
    const invalid = { ...validAsset, title: '' };
    const result = AssetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should enforce title max length of 200', () => {
    const invalid = { ...validAsset, title: 'x'.repeat(201) };
    const result = AssetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should require version to be a positive integer', () => {
    const invalidZero = { ...validAsset, version: 0 };
    const invalidNegative = { ...validAsset, version: -1 };
    const invalidFloat = { ...validAsset, version: 1.5 };

    expect(AssetSchema.safeParse(invalidZero).success).toBe(false);
    expect(AssetSchema.safeParse(invalidNegative).success).toBe(false);
    expect(AssetSchema.safeParse(invalidFloat).success).toBe(false);
  });

  it('should allow null for nullable fields', () => {
    const withNulls = {
      ...validAsset,
      description: null,
      content: null,
      assigneeId: null,
      submittedAt: null,
      reviewedAt: null,
      parentId: null,
    };
    const result = AssetSchema.safeParse(withNulls);
    expect(result.success).toBe(true);
  });
});

describe('CreateAssetSchema', () => {
  it('should validate valid create input', () => {
    const input = {
      type: 'DESIGN',
      title: 'New Asset',
      description: 'Optional description',
    };
    const result = CreateAssetSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should allow missing optional fields', () => {
    const input = {
      type: 'SPECIFICATION',
      title: 'Minimal Asset',
    };
    const result = CreateAssetSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const noType = { title: 'Test' };
    const noTitle = { type: 'DESIGN' };

    expect(CreateAssetSchema.safeParse(noType).success).toBe(false);
    expect(CreateAssetSchema.safeParse(noTitle).success).toBe(false);
  });

  it('should reject empty title', () => {
    const input = { type: 'DESIGN', title: '' };
    const result = CreateAssetSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('UpdateAssetSchema', () => {
  it('should allow partial updates', () => {
    expect(UpdateAssetSchema.safeParse({ title: 'New Title' }).success).toBe(true);
    expect(UpdateAssetSchema.safeParse({ description: 'New desc' }).success).toBe(true);
    expect(UpdateAssetSchema.safeParse({ content: { new: 'data' } }).success).toBe(true);
  });

  it('should allow empty object (no changes)', () => {
    const result = UpdateAssetSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should validate title constraints when provided', () => {
    expect(UpdateAssetSchema.safeParse({ title: '' }).success).toBe(false);
    expect(UpdateAssetSchema.safeParse({ title: 'x'.repeat(201) }).success).toBe(false);
    expect(UpdateAssetSchema.safeParse({ title: 'Valid Title' }).success).toBe(true);
  });
});

describe('ApprovalQueueFiltersSchema', () => {
  it('should apply default values', () => {
    const result = ApprovalQueueFiltersSchema.parse({});
    expect(result.sortBy).toBe('submittedAt');
    expect(result.sortOrder).toBe('desc');
    expect(result.limit).toBe(25);
  });

  it('should validate status array filter', () => {
    const input = {
      status: ['PENDING_REVIEW', 'IN_REVIEW'],
    };
    const result = ApprovalQueueFiltersSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should enforce limit bounds', () => {
    expect(ApprovalQueueFiltersSchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(ApprovalQueueFiltersSchema.safeParse({ limit: 101 }).success).toBe(false);
    expect(ApprovalQueueFiltersSchema.safeParse({ limit: 50 }).success).toBe(true);
  });

  it('should validate sortBy enum values', () => {
    expect(ApprovalQueueFiltersSchema.safeParse({ sortBy: 'createdAt' }).success).toBe(true);
    expect(ApprovalQueueFiltersSchema.safeParse({ sortBy: 'invalid' }).success).toBe(false);
  });
});

describe('ReviewAssetSchema', () => {
  it('should validate complete review input', () => {
    const input = {
      assetId: '550e8400-e29b-41d4-a716-446655440000',
      decision: 'APPROVED',
      comments: 'Looks good!',
    };
    const result = ReviewAssetSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should allow review without comments', () => {
    const input = {
      assetId: '550e8400-e29b-41d4-a716-446655440000',
      decision: 'REJECTED',
    };
    const result = ReviewAssetSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should require valid UUID for assetId', () => {
    const input = {
      assetId: 'invalid-id',
      decision: 'APPROVED',
    };
    const result = ReviewAssetSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('BulkApproveSchema', () => {
  it('should validate bulk approval with valid UUIDs', () => {
    const input = {
      assetIds: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
    };
    const result = BulkApproveSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should require at least one asset ID', () => {
    const input = { assetIds: [] };
    const result = BulkApproveSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should enforce maximum of 50 asset IDs', () => {
    const tooMany = {
      assetIds: Array.from(
        { length: 51 },
        (_, i) => `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, '0')}`
      ),
    };
    const result = BulkApproveSchema.safeParse(tooMany);
    expect(result.success).toBe(false);
  });
});

describe('BulkRejectSchema', () => {
  it('should require rejection reason', () => {
    const input = {
      assetIds: ['550e8400-e29b-41d4-a716-446655440000'],
      reason: '',
    };
    const result = BulkRejectSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should validate complete bulk rejection', () => {
    const input = {
      assetIds: ['550e8400-e29b-41d4-a716-446655440000'],
      reason: 'Does not meet quality standards',
    };
    const result = BulkRejectSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should provide meaningful error for missing reason', () => {
    const input = {
      assetIds: ['550e8400-e29b-41d4-a716-446655440000'],
      reason: '',
    };
    const result = BulkRejectSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const reasonError = result.error.issues.find((i) => i.path.includes('reason'));
      expect(reasonError?.message).toBe('Rejection reason is required');
    }
  });
});
