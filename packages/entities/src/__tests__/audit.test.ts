import { describe, it, expect } from 'vitest';

import {
  AuditActionEnum,
  AuditLogSchema,
  AuditLogWithActorSchema,
  AuditLogFiltersSchema,
  CreateAuditLogSchema,
} from '../audit';

describe('AuditActionEnum', () => {
  it('should accept all valid asset lifecycle actions', () => {
    const assetActions = [
      'ASSET_CREATED',
      'ASSET_UPDATED',
      'ASSET_SUBMITTED',
      'ASSET_REVIEWED',
      'ASSET_APPROVED',
      'ASSET_REJECTED',
      'ASSET_ARCHIVED',
      'ASSET_RESTORED',
    ];
    assetActions.forEach((action) => {
      expect(AuditActionEnum.safeParse(action).success).toBe(true);
    });
  });

  it('should accept all valid user actions', () => {
    const userActions = ['USER_CREATED', 'USER_UPDATED', 'USER_DEACTIVATED', 'USER_ROLE_CHANGED'];
    userActions.forEach((action) => {
      expect(AuditActionEnum.safeParse(action).success).toBe(true);
    });
  });

  it('should accept system events', () => {
    expect(AuditActionEnum.safeParse('SYSTEM_EVENT').success).toBe(true);
  });

  it('should reject unknown actions', () => {
    expect(AuditActionEnum.safeParse('UNKNOWN_ACTION').success).toBe(false);
    expect(AuditActionEnum.safeParse('asset_created').success).toBe(false);
  });
});

describe('AuditLogSchema', () => {
  const validLog = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    action: 'ASSET_CREATED',
    entityType: 'Asset',
    entityId: '550e8400-e29b-41d4-a716-446655440001',
    actorId: '550e8400-e29b-41d4-a716-446655440002',
    actorEmail: 'user@example.com',
    metadata: { previousStatus: 'DRAFT', newStatus: 'PENDING_REVIEW' },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date(),
    assetId: '550e8400-e29b-41d4-a716-446655440001',
  };

  it('should validate a complete audit log', () => {
    const result = AuditLogSchema.safeParse(validLog);
    expect(result.success).toBe(true);
  });

  it('should require valid UUID for id field', () => {
    const invalid = { ...validLog, id: 'not-a-uuid' };
    const result = AuditLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should allow null for nullable fields', () => {
    const withNulls = {
      ...validLog,
      actorId: null,
      actorEmail: null,
      metadata: null,
      ipAddress: null,
      userAgent: null,
      assetId: null,
    };
    const result = AuditLogSchema.safeParse(withNulls);
    expect(result.success).toBe(true);
  });

  it('should validate actorEmail as proper email format', () => {
    const invalidEmail = { ...validLog, actorEmail: 'not-an-email' };
    const result = AuditLogSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
  });

  it('should require action from the enum', () => {
    const invalidAction = { ...validLog, action: 'INVALID_ACTION' };
    const result = AuditLogSchema.safeParse(invalidAction);
    expect(result.success).toBe(false);
  });
});

describe('AuditLogWithActorSchema', () => {
  const baseLog = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    action: 'USER_CREATED',
    entityType: 'User',
    entityId: '550e8400-e29b-41d4-a716-446655440001',
    actorId: '550e8400-e29b-41d4-a716-446655440002',
    actorEmail: 'admin@example.com',
    metadata: null,
    ipAddress: null,
    userAgent: null,
    createdAt: new Date(),
    assetId: null,
  };

  it('should validate log with embedded actor', () => {
    const withActor = {
      ...baseLog,
      actor: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Admin User',
        email: 'admin@example.com',
      },
    };
    const result = AuditLogWithActorSchema.safeParse(withActor);
    expect(result.success).toBe(true);
  });

  it('should allow null actor for system events', () => {
    const withNullActor = { ...baseLog, actor: null };
    const result = AuditLogWithActorSchema.safeParse(withNullActor);
    expect(result.success).toBe(true);
  });

  it('should validate actor email format', () => {
    const invalidActorEmail = {
      ...baseLog,
      actor: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Admin User',
        email: 'invalid-email',
      },
    };
    const result = AuditLogWithActorSchema.safeParse(invalidActorEmail);
    expect(result.success).toBe(false);
  });

  it('should require all actor fields when actor is present', () => {
    const incompleteActor = {
      ...baseLog,
      actor: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        // missing name and email
      },
    };
    const result = AuditLogWithActorSchema.safeParse(incompleteActor);
    expect(result.success).toBe(false);
  });
});

describe('AuditLogFiltersSchema', () => {
  it('should apply default values', () => {
    const result = AuditLogFiltersSchema.parse({});
    expect(result.limit).toBe(50);
    expect(result.cursor).toBeUndefined();
  });

  it('should validate UUID filters', () => {
    const input = {
      assetId: '550e8400-e29b-41d4-a716-446655440000',
      actorId: '550e8400-e29b-41d4-a716-446655440001',
    };
    const result = AuditLogFiltersSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUID for assetId', () => {
    const input = { assetId: 'not-valid-uuid' };
    const result = AuditLogFiltersSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should validate actions array with enum values', () => {
    const input = {
      actions: ['ASSET_CREATED', 'ASSET_UPDATED'],
    };
    const result = AuditLogFiltersSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject invalid actions in array', () => {
    const input = {
      actions: ['ASSET_CREATED', 'INVALID_ACTION'],
    };
    const result = AuditLogFiltersSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should enforce limit bounds', () => {
    expect(AuditLogFiltersSchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(AuditLogFiltersSchema.safeParse({ limit: 101 }).success).toBe(false);
    expect(AuditLogFiltersSchema.safeParse({ limit: 100 }).success).toBe(true);
    expect(AuditLogFiltersSchema.safeParse({ limit: 1 }).success).toBe(true);
  });

  it('should accept date range filters', () => {
    const input = {
      fromDate: new Date('2024-01-01'),
      toDate: new Date('2024-12-31'),
    };
    const result = AuditLogFiltersSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe('CreateAuditLogSchema', () => {
  it('should validate minimal create input', () => {
    const input = {
      action: 'SYSTEM_EVENT',
      entityType: 'System',
      entityId: 'health-check',
    };
    const result = CreateAuditLogSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should validate complete create input', () => {
    const input = {
      action: 'ASSET_CREATED',
      entityType: 'Asset',
      entityId: '550e8400-e29b-41d4-a716-446655440000',
      actorId: '550e8400-e29b-41d4-a716-446655440001',
      actorEmail: 'user@example.com',
      metadata: { source: 'api' },
      ipAddress: '10.0.0.1',
      userAgent: 'custom-agent/1.0',
      assetId: '550e8400-e29b-41d4-a716-446655440000',
    };
    const result = CreateAuditLogSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should require action field', () => {
    const input = {
      entityType: 'Asset',
      entityId: '123',
    };
    const result = CreateAuditLogSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should require entityType field', () => {
    const input = {
      action: 'ASSET_CREATED',
      entityId: '123',
    };
    const result = CreateAuditLogSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should require entityId field', () => {
    const input = {
      action: 'ASSET_CREATED',
      entityType: 'Asset',
    };
    const result = CreateAuditLogSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
