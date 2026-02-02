import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import {
  ApprovalQueueFiltersSchema,
  ReviewAssetSchema,
  BulkApproveSchema,
  BulkRejectSchema,
  IdSchema,
} from '@repo/entities';
import { z } from 'zod';

// Role hierarchy for RBAC - using string literals to match Prisma enum
type Role = 'VIEWER' | 'CONTRIBUTOR' | 'REVIEWER' | 'ADMIN';
type AssetStatus = 'DRAFT' | 'PENDING_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
type AuditAction = 
  | 'ASSET_CREATED' | 'ASSET_UPDATED' | 'ASSET_SUBMITTED' | 'ASSET_REVIEWED'
  | 'ASSET_APPROVED' | 'ASSET_REJECTED' | 'ASSET_ARCHIVED' | 'ASSET_RESTORED'
  | 'USER_CREATED' | 'USER_UPDATED' | 'USER_DEACTIVATED' | 'USER_ROLE_CHANGED'
  | 'SYSTEM_EVENT';

const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 0,
  CONTRIBUTOR: 1,
  REVIEWER: 2,
  ADMIN: 3,
};

// Helper to check role access
const hasMinRole = (userRole: Role, minRole: Role): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole];
  const minLevel = ROLE_HIERARCHY[minRole];
  if (userLevel === undefined || minLevel === undefined) return false;
  return userLevel >= minLevel;
};

// Audit log helper - uses any for prisma tx to avoid complex typing
async function createAuditLog(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  action: AuditAction,
  entityType: string,
  entityId: string,
  actorId: string | null,
  actorEmail: string | null,
  metadata?: Record<string, unknown>,
  assetId?: string,
): Promise<unknown> {
  return prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      actorId,
      actorEmail,
      metadata,
      assetId,
      createdAt: new Date(),
    },
  });
}

export const assetRouter = router({
  // Get approval queue - REVIEWER or ADMIN only
  approvalQueue: protectedProcedure
    .input(ApprovalQueueFiltersSchema)
    .query(async ({ ctx, input }) => {
      // Get user and check role
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user || !hasMinRole(user.role as Role, 'REVIEWER')) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only reviewers and admins can access the approval queue',
        });
      }

      const where: Record<string, unknown> = {};

      // Default to pending/in-review statuses
      if (input.status && input.status.length > 0) {
        where['status'] = { in: input.status };
      } else {
        where['status'] = { in: ['PENDING_REVIEW', 'IN_REVIEW'] };
      }

      if (input.type && input.type.length > 0) {
        where['type'] = { in: input.type };
      }

      if (input.assigneeId) {
        where['assigneeId'] = input.assigneeId;
      }

      if (input.search) {
        where['OR'] = [
          { title: { contains: input.search, mode: 'insensitive' } },
          { description: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      const items = await ctx.prisma.asset.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { [input.sortBy]: input.sortOrder },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { reviews: true },
          },
        },
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      // Get queue stats
      const stats = await ctx.prisma.asset.groupBy({
        by: ['status'],
        where: {
          status: { in: ['PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED'] },
        },
        _count: { _all: true },
      });

      const statsMap = stats.reduce(
        (acc: Record<string, number>, s: { status: string; _count: { _all: number } }) => {
          acc[s.status] = s._count._all;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        items,
        nextCursor,
        stats: statsMap,
      };
    }),

  // Get single asset
  getById: protectedProcedure
    .input(IdSchema)
    .query(async ({ ctx, input }) => {
      const asset = await ctx.prisma.asset.findUnique({
        where: { id: input.id },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          assignee: { select: { id: true, name: true, email: true } },
          reviews: {
            include: {
              reviewer: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!asset) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' });
      }

      return asset;
    }),

  // Get audit trail for an asset
  auditTrail: protectedProcedure
    .input(z.object({
      assetId: z.string().uuid(),
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user || !hasMinRole(user.role as Role, 'REVIEWER')) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only reviewers and admins can view audit trails',
        });
      }

      const items = await ctx.prisma.auditLog.findMany({
        where: { assetId: input.assetId },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, name: true, email: true } },
        },
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return { items, nextCursor };
    }),

  // Review (approve/reject) a single asset - REVIEWER or ADMIN
  review: protectedProcedure
    .input(ReviewAssetSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user || !hasMinRole(user.role as Role, 'REVIEWER')) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only reviewers and admins can review assets',
        });
      }

      const asset = await ctx.prisma.asset.findUnique({
        where: { id: input.assetId },
      });

      if (!asset) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' });
      }

      if (!(['PENDING_REVIEW', 'IN_REVIEW'] as AssetStatus[]).includes(asset.status as AssetStatus)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot review asset in ${asset.status} status`,
        });
      }

      // Determine new status
      let newStatus: AssetStatus;
      let auditAction: AuditAction;
      
      switch (input.decision) {
        case 'APPROVED':
          newStatus = 'APPROVED';
          auditAction = 'ASSET_APPROVED';
          break;
        case 'REJECTED':
          newStatus = 'REJECTED';
          auditAction = 'ASSET_REJECTED';
          break;
        case 'CHANGES_REQUESTED':
          newStatus = 'REJECTED'; // Goes back for revision
          auditAction = 'ASSET_REJECTED';
          break;
        default:
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid decision' });
      }

      // Use transaction for atomicity
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await ctx.prisma.$transaction(async (tx: any) => {
        // Create review record
        const review = await tx.assetReview.create({
          data: {
            assetId: input.assetId,
            reviewerId: ctx.userId,
            decision: input.decision,
            comments: input.comments,
          },
        });

        // Update asset status
        const updatedAsset = await tx.asset.update({
          where: { id: input.assetId },
          data: {
            status: newStatus,
            reviewedAt: new Date(),
          },
          include: {
            owner: { select: { id: true, name: true, email: true } },
          },
        });

        // Create audit log
        await createAuditLog(
          tx,
          auditAction,
          'Asset',
          input.assetId,
          ctx.userId,
          user.email,
          {
            decision: input.decision,
            comments: input.comments,
            previousStatus: asset.status,
            newStatus,
          },
          input.assetId,
        );

        return { asset: updatedAsset, review };
      });

      return result;
    }),

  // Bulk approve - ADMIN only
  bulkApprove: protectedProcedure
    .input(BulkApproveSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user || user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can perform bulk approvals',
        });
      }

      const assets = await ctx.prisma.asset.findMany({
        where: {
          id: { in: input.assetIds },
          status: { in: ['PENDING_REVIEW', 'IN_REVIEW'] },
        },
      });

      if (assets.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No valid assets found for approval',
        });
      }

      const validIds = assets.map((a: { id: string }) => a.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await ctx.prisma.$transaction(async (tx: any) => {
        // Create review records for each
        await Promise.all(
          validIds.map((assetId: string) =>
            tx.assetReview.create({
              data: {
                assetId,
                reviewerId: ctx.userId,
                decision: 'APPROVED',
                comments: input.comments || 'Bulk approved',
              },
            })
          )
        );

        // Update all assets
        await tx.asset.updateMany({
          where: { id: { in: validIds } },
          data: {
            status: 'APPROVED',
            reviewedAt: new Date(),
          },
        });

        // Create audit logs
        await Promise.all(
          assets.map((asset: { id: string; status: AssetStatus }) =>
            createAuditLog(
              tx,
              'ASSET_APPROVED',
              'Asset',
              asset.id,
              ctx.userId,
              user.email,
              {
                decision: 'APPROVED',
                comments: input.comments || 'Bulk approved',
                previousStatus: asset.status,
                newStatus: 'APPROVED',
                bulkAction: true,
                batchSize: validIds.length,
              },
              asset.id,
            )
          )
        );

        return { count: validIds.length };
      });

      return result;
    }),

  // Bulk reject - ADMIN only
  bulkReject: protectedProcedure
    .input(BulkRejectSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user || user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can perform bulk rejections',
        });
      }

      const assets = await ctx.prisma.asset.findMany({
        where: {
          id: { in: input.assetIds },
          status: { in: ['PENDING_REVIEW', 'IN_REVIEW'] },
        },
      });

      if (assets.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No valid assets found for rejection',
        });
      }

      const validIds = assets.map((a: { id: string }) => a.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await ctx.prisma.$transaction(async (tx: any) => {
        // Create review records
        await Promise.all(
          validIds.map((assetId: string) =>
            tx.assetReview.create({
              data: {
                assetId,
                reviewerId: ctx.userId,
                decision: 'REJECTED',
                comments: input.reason,
              },
            })
          )
        );

        // Update all assets
        await tx.asset.updateMany({
          where: { id: { in: validIds } },
          data: {
            status: 'REJECTED',
            reviewedAt: new Date(),
          },
        });

        // Create audit logs
        await Promise.all(
          assets.map((asset: { id: string; status: AssetStatus }) =>
            createAuditLog(
              tx,
              'ASSET_REJECTED',
              'Asset',
              asset.id,
              ctx.userId,
              user.email,
              {
                decision: 'REJECTED',
                reason: input.reason,
                previousStatus: asset.status,
                newStatus: 'REJECTED',
                bulkAction: true,
                batchSize: validIds.length,
              },
              asset.id,
            )
          )
        );

        return { count: validIds.length };
      });

      return result;
    }),

  // Claim asset for review (assign to self)
  claim: protectedProcedure
    .input(IdSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user || !hasMinRole(user.role as Role, 'REVIEWER')) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only reviewers and admins can claim assets',
        });
      }

      const asset = await ctx.prisma.asset.findUnique({
        where: { id: input.id },
      });

      if (!asset) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' });
      }

      if (asset.status !== 'PENDING_REVIEW') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only pending assets can be claimed',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await ctx.prisma.$transaction(async (tx: any) => {
        const updatedAsset = await tx.asset.update({
          where: { id: input.id },
          data: {
            assigneeId: ctx.userId,
            status: 'IN_REVIEW',
          },
          include: {
            owner: { select: { id: true, name: true, email: true } },
            assignee: { select: { id: true, name: true, email: true } },
          },
        });

        await createAuditLog(
          tx,
          'ASSET_REVIEWED',
          'Asset',
          input.id,
          ctx.userId,
          user.email,
          {
            action: 'claimed',
            previousStatus: asset.status,
            newStatus: 'IN_REVIEW',
            assigneeId: ctx.userId,
          },
          input.id,
        );

        return updatedAsset;
      });

      return result;
    }),

  // Release claim (unassign from self)
  release: protectedProcedure
    .input(IdSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const asset = await ctx.prisma.asset.findUnique({
        where: { id: input.id },
      });

      if (!asset) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' });
      }

      // Only assignee or admin can release
      if (asset.assigneeId !== ctx.userId && user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only the assigned reviewer or an admin can release this asset',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await ctx.prisma.$transaction(async (tx: any) => {
        const updatedAsset = await tx.asset.update({
          where: { id: input.id },
          data: {
            assigneeId: null,
            status: 'PENDING_REVIEW',
          },
          include: {
            owner: { select: { id: true, name: true, email: true } },
          },
        });

        await createAuditLog(
          tx,
          'ASSET_REVIEWED',
          'Asset',
          input.id,
          ctx.userId,
          user.email,
          {
            action: 'released',
            previousStatus: asset.status,
            newStatus: 'PENDING_REVIEW',
            previousAssigneeId: asset.assigneeId,
          },
          input.id,
        );

        return updatedAsset;
      });

      return result;
    }),

  // Get reviewers list (for assignment dropdown)
  getReviewers: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });

      if (!user || !hasMinRole(user.role as Role, 'REVIEWER')) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return ctx.prisma.user.findMany({
        where: {
          role: { in: ['REVIEWER', 'ADMIN'] },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        orderBy: { name: 'asc' },
      });
    }),
});
