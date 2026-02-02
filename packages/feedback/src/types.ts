/**
 * Feedback Types
 * DB-first: These types mirror the expected database schema
 */

export type FeedbackType = 'bug' | 'feature' | 'general' | 'praise';
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export interface FeedbackMetadata {
  url?: string;
  userAgent?: string;
  viewport?: { width: number; height: number };
  timestamp: string;
  sessionId?: string;
  userId?: string;
  /** Screenshot data URL (optional) */
  screenshot?: string;
  /** Console errors captured at submission time */
  consoleErrors?: string[];
  /** Custom metadata from integrating app */
  custom?: Record<string, unknown>;
}

export interface FeedbackSubmission {
  type: FeedbackType;
  title: string;
  description: string;
  email?: string;
  metadata: FeedbackMetadata;
}

export interface Feedback extends FeedbackSubmission {
  id: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  assignedTo?: string;
  tags?: string[];
  internalNotes?: string;
}

// Widget Configuration
export interface FeedbackWidgetConfig {
  /** API endpoint for feedback submission */
  endpoint: string;
  /** Project/app identifier */
  projectId: string;
  /** UI Position */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Primary accent color */
  accentColor?: string;
  /** Enable screenshot capture */
  enableScreenshot?: boolean;
  /** Enable console error capture */
  captureConsoleErrors?: boolean;
  /** Custom labels */
  labels?: {
    triggerButton?: string;
    title?: string;
    submitButton?: string;
    successMessage?: string;
  };
  /** User context (pre-fill) */
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
  /** Called on successful submission */
  onSuccess?: (feedback: FeedbackSubmission) => void;
  /** Called on error */
  onError?: (error: Error) => void;
}
