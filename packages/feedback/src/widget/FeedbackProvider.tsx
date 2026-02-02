'use client';

import * as React from 'react';
import { FeedbackWidget } from './FeedbackWidget';
import type { FeedbackWidgetConfig, FeedbackSubmission } from '../types';

export interface FeedbackProviderProps extends FeedbackWidgetConfig {
  children: React.ReactNode;
}

const FeedbackContext = React.createContext<{
  submitFeedback: (submission: FeedbackSubmission) => Promise<void>;
  config: FeedbackWidgetConfig;
} | null>(null);

export function useFeedback() {
  const context = React.useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}

export function FeedbackProvider({ 
  children, 
  endpoint,
  projectId,
  ...widgetProps 
}: FeedbackProviderProps) {
  const config: FeedbackWidgetConfig = {
    endpoint,
    projectId,
    ...widgetProps,
  };

  const submitFeedback = React.useCallback(async (submission: FeedbackSubmission) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        ...submission,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to submit feedback');
    }

    return response.json();
  }, [endpoint, projectId]);

  return (
    <FeedbackContext.Provider value={{ submitFeedback, config }}>
      {children}
      <FeedbackWidget {...widgetProps} onSubmit={submitFeedback} />
    </FeedbackContext.Provider>
  );
}
