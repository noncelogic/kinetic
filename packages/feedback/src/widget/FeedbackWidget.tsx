'use client';

import html2canvas from 'html2canvas';
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  MessageCircle,
  Heart,
  X,
  Send,
  Loader2,
  Camera,
} from 'lucide-react';
import * as React from 'react';

import { cn, captureMetadata } from '../utils';

import type {
  FeedbackType,
  FeedbackWidgetConfig,
  FeedbackSubmission,
  FeedbackMetadata,
} from '../types';

const FEEDBACK_TYPES: {
  type: FeedbackType;
  icon: React.ElementType;
  label: string;
  description: string;
}[] = [
  { type: 'bug', icon: Bug, label: 'Bug Report', description: "Something isn't working" },
  {
    type: 'feature',
    icon: Lightbulb,
    label: 'Feature Request',
    description: 'Suggest an improvement',
  },
  { type: 'general', icon: MessageCircle, label: 'General', description: 'Other feedback' },
  { type: 'praise', icon: Heart, label: 'Praise', description: 'Share what you love' },
];

interface FeedbackWidgetProps extends Omit<FeedbackWidgetConfig, 'endpoint' | 'projectId'> {
  onSubmit: (submission: FeedbackSubmission) => Promise<void>;
}

export function FeedbackWidget({
  position = 'bottom-right',
  accentColor = '#6366f1',
  labels = {},
  user,
  onSubmit,
  onSuccess,
  onError,
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [step, setStep] = React.useState<'type' | 'form' | 'success'>('type');
  const [selectedType, setSelectedType] = React.useState<FeedbackType | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [screenshot, setScreenshot] = React.useState<string | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    email: user?.email || '',
  });

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const captureScreen = async () => {
    try {
      setIsCapturing(true);
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        logging: false,
      });
      setScreenshot(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Screenshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleTypeSelect = (type: FeedbackType) => {
    setSelectedType(type);
    setStep('form');
    // Auto-capture on form entry
    void captureScreen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !formData.title.trim()) {
      return;
    }

    setIsSubmitting(true);

    const metadata: FeedbackMetadata = {
      ...captureMetadata(),
      screenshot: screenshot || undefined,
      userId: user?.id,
      sessionId:
        typeof sessionStorage !== 'undefined'
          ? sessionStorage.getItem('feedback-session-id') || undefined
          : undefined,
    };

    const submission: FeedbackSubmission = {
      type: selectedType,
      title: formData.title.trim(),
      description: formData.description.trim(),
      email: formData.email.trim() || undefined,
      metadata,
    };

    try {
      await onSubmit(submission);
      setStep('success');
      onSuccess?.(submission);

      // Reset after delay
      setTimeout(() => {
        setIsOpen(false);
        setStep('type');
        setSelectedType(null);
        setScreenshot(null);
        setFormData({ title: '', description: '', email: user?.email || '' });
      }, 2000);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state after animation
    setTimeout(() => {
      setStep('type');
      setSelectedType(null);
      setScreenshot(null);
      setFormData({ title: '', description: '', email: user?.email || '' });
    }, 200);
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position])}>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg',
            'text-white font-medium transition-all duration-200',
            'hover:scale-105 hover:shadow-xl active:scale-95'
          )}
          style={{ backgroundColor: accentColor }}
          aria-label={labels.triggerButton || 'Send Feedback'}
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span className="hidden sm:inline">{labels.triggerButton || 'Feedback'}</span>
        </button>
      )}

      {/* Widget Panel */}
      {isOpen && (
        <div
          className={cn(
            'w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {labels.title || 'Send Feedback'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {step === 'type' && (
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TYPES.map(({ type, icon: Icon, label, description }) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-lg',
                      'border border-zinc-200 dark:border-zinc-700',
                      'hover:border-zinc-400 dark:hover:border-zinc-500',
                      'hover:bg-zinc-50 dark:hover:bg-zinc-800',
                      'transition-all duration-150'
                    )}
                  >
                    <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {label}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                      {description}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setStep('type')}
                  className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1"
                >
                  ← Back
                </button>

                {/* Screenshot Preview */}
                <div className="relative group">
                  {isCapturing ? (
                    <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 text-xs animate-pulse">
                      Capturing screen...
                    </div>
                  ) : screenshot ? (
                    <div className="relative h-24 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <img
                        src={screenshot}
                        alt="Screenshot"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setScreenshot(null)}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove screenshot"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void captureScreen()}
                      className="h-8 w-full border border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg flex items-center justify-center gap-2 text-xs text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Camera className="w-3 h-3" />
                      Attach Screenshot
                    </button>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="feedback-title"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    id="feedback-title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'border border-zinc-300 dark:border-zinc-600',
                      'bg-white dark:bg-zinc-800',
                      'text-zinc-900 dark:text-zinc-100',
                      'focus:ring-2 focus:ring-offset-2 focus:border-transparent',
                      'placeholder:text-zinc-400'
                    )}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                    placeholder="Brief summary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedback-description"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="feedback-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className={cn(
                      'w-full px-3 py-2 rounded-lg resize-none',
                      'border border-zinc-300 dark:border-zinc-600',
                      'bg-white dark:bg-zinc-800',
                      'text-zinc-900 dark:text-zinc-100',
                      'focus:ring-2 focus:ring-offset-2 focus:border-transparent',
                      'placeholder:text-zinc-400'
                    )}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                    placeholder="Tell us more..."
                  />
                </div>

                {!user?.email && (
                  <div>
                    <label
                      htmlFor="feedback-email"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Email (optional)
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg',
                        'border border-zinc-300 dark:border-zinc-600',
                        'bg-white dark:bg-zinc-800',
                        'text-zinc-900 dark:text-zinc-100',
                        'focus:ring-2 focus:ring-offset-2 focus:border-transparent',
                        'placeholder:text-zinc-400'
                      )}
                      style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                      placeholder="you@example.com"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim()}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
                    'text-white font-medium transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'hover:opacity-90'
                  )}
                  style={{ backgroundColor: accentColor }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {labels.submitButton || 'Submit'}
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Heart className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <p className="text-zinc-900 dark:text-zinc-100 font-medium">
                  {labels.successMessage || 'Thanks for your feedback!'}
                </p>
                <p className="text-sm text-zinc-500 mt-1">We appreciate you taking the time.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
