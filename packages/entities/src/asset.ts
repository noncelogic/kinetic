import { z } from 'zod';

// Enums matching Prisma schema
export const AssetStatusEnum = z.enum([
  'DRAFT',
  'PENDING_REVIEW',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'ARCHIVED',
]);

export type AssetStatus = z.infer<typeof AssetStatusEnum>;

export const AssetTypeEnum = z.enum(['DESIGN', 'SPECIFICATION', 'PROTOTYPE', 'DOCUMENTATION']);

export type AssetType = z.infer<typeof AssetTypeEnum>;

export const RoleEnum = z.enum(['VIEWER', 'CONTRIBUTOR', 'REVIEWER', 'ADMIN']);

export type Role = z.infer<typeof RoleEnum>;

export const ReviewDecisionEnum = z.enum(['APPROVED', 'REJECTED', 'CHANGES_REQUESTED']);

export type ReviewDecision = z.infer<typeof ReviewDecisionEnum>;

// Asset schemas
export const AssetSchema = z.object({
  id: z.string().uuid(),
  type: AssetTypeEnum,
  title: z.string().min(1).max(200),
  description: z.string().nullable(),
  content: z.any().nullable(),
  version: z.number().int().positive(),
  status: AssetStatusEnum,
  ownerId: z.string().uuid(),
  assigneeId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  submittedAt: z.date().nullable(),
  reviewedAt: z.date().nullable(),
  parentId: z.string().uuid().nullable(),
});

export type Asset = z.infer<typeof AssetSchema>;

// Asset with relations (for API responses)
export const AssetWithRelationsSchema = AssetSchema.extend({
  owner: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }),
  assignee: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable(),
});

export type AssetWithRelations = z.infer<typeof AssetWithRelationsSchema>;

// Input schemas
export const CreateAssetSchema = z.object({
  type: AssetTypeEnum,
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  content: z.any().optional(),
});

export type CreateAssetInput = z.infer<typeof CreateAssetSchema>;

export const UpdateAssetSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  content: z.any().optional(),
});

export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;

// Approval queue filters
export const ApprovalQueueFiltersSchema = z.object({
  status: z.array(AssetStatusEnum).optional(),
  type: z.array(AssetTypeEnum).optional(),
  assigneeId: z.string().uuid().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'submittedAt', 'title', 'type']).default('submittedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
});

export type ApprovalQueueFilters = z.infer<typeof ApprovalQueueFiltersSchema>;

// Review input
export const ReviewAssetSchema = z.object({
  assetId: z.string().uuid(),
  decision: ReviewDecisionEnum,
  comments: z.string().optional(),
});

export type ReviewAssetInput = z.infer<typeof ReviewAssetSchema>;

// Bulk actions
export const BulkApproveSchema = z.object({
  assetIds: z.array(z.string().uuid()).min(1).max(50),
  comments: z.string().optional(),
});

export type BulkApproveInput = z.infer<typeof BulkApproveSchema>;

export const BulkRejectSchema = z.object({
  assetIds: z.array(z.string().uuid()).min(1).max(50),
  reason: z.string().min(1, 'Rejection reason is required'),
});

export type BulkRejectInput = z.infer<typeof BulkRejectSchema>;
