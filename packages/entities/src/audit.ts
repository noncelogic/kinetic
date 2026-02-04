import { z } from 'zod';

// Audit action enum matching Prisma
export const AuditActionEnum = z.enum([
  // Asset lifecycle
  'ASSET_CREATED',
  'ASSET_UPDATED',
  'ASSET_SUBMITTED',
  'ASSET_REVIEWED',
  'ASSET_APPROVED',
  'ASSET_REJECTED',
  'ASSET_ARCHIVED',
  'ASSET_RESTORED',
  // User actions
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DEACTIVATED',
  'USER_ROLE_CHANGED',
  // System events
  'SYSTEM_EVENT',
]);

export type AuditAction = z.infer<typeof AuditActionEnum>;

// Audit log schema
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  action: AuditActionEnum,
  entityType: z.string(),
  entityId: z.string(),
  actorId: z.string().uuid().nullable(),
  actorEmail: z.string().email().nullable(),
  metadata: z.any().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.date(),
  assetId: z.string().uuid().nullable(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

// Audit log with actor relation
export const AuditLogWithActorSchema = AuditLogSchema.extend({
  actor: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable(),
});

export type AuditLogWithActor = z.infer<typeof AuditLogWithActorSchema>;

// Query filters for audit logs
export const AuditLogFiltersSchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  assetId: z.string().uuid().optional(),
  actorId: z.string().uuid().optional(),
  actions: z.array(AuditActionEnum).optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

export type AuditLogFilters = z.infer<typeof AuditLogFiltersSchema>;

// Create audit log input (for internal use)
export const CreateAuditLogSchema = z.object({
  action: AuditActionEnum,
  entityType: z.string(),
  entityId: z.string(),
  actorId: z.string().uuid().optional(),
  actorEmail: z.string().email().optional(),
  metadata: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  assetId: z.string().uuid().optional(),
});

export type CreateAuditLogInput = z.infer<typeof CreateAuditLogSchema>;
