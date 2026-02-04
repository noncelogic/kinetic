/**
 * React Hook for Mock AI Generation Service
 *
 * Provides a clean interface for components to trigger AI generation
 * with financial simulation toasts.
 */

'use client';

import { useState, useCallback } from 'react';

import {
  generateAssets,
  SIMULATION_STEPS,
  type GeneratedAsset,
  type SimulationStep,
  type GenerationRequest,
  type GenerationResult,
} from '../services/mock-generation-service';

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseGenerationOptions {
  onStepStart?: (step: SimulationStep, index: number, total: number) => void;
  onStepComplete?: (step: SimulationStep, index: number, total: number) => void;
  onAssetReady?: (asset: GeneratedAsset) => void;
  onComplete?: (result: GenerationResult) => void;
  onError?: (error: Error) => void;
}

export interface UseGenerationReturn {
  /** Current generation status */
  status: 'idle' | 'generating' | 'completed' | 'error';

  /** Current simulation step (null when not generating) */
  currentStep: SimulationStep | null;

  /** Current step index (0-based) */
  stepIndex: number;

  /** Total number of steps */
  totalSteps: number;

  /** Progress percentage (0-100) */
  progress: number;

  /** Generated result (null until complete) */
  result: GenerationResult | null;

  /** Error message if generation failed */
  error: string | null;

  /** Start generation with the given prompt */
  generate: (request: GenerationRequest) => Promise<GenerationResult>;

  /** Reset state to idle */
  reset: () => void;

  /** All simulation steps for reference */
  steps: SimulationStep[];
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useGeneration(options: UseGenerationOptions = {}): UseGenerationReturn {
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState<SimulationStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = SIMULATION_STEPS.length;
  const progress =
    status === 'completed'
      ? 100
      : status === 'generating'
        ? Math.round(((stepIndex + 1) / totalSteps) * 100)
        : 0;

  const generate = useCallback(
    async (request: GenerationRequest): Promise<GenerationResult> => {
      setStatus('generating');
      setCurrentStep(null);
      setStepIndex(0);
      setResult(null);
      setError(null);

      try {
        const genResult = await generateAssets({
          ...request,
          onStepProgress: (step, idx, total) => {
            setCurrentStep(step);
            setStepIndex(idx);

            options.onStepStart?.(step, idx, total);

            // Also call the request's callback if provided
            request.onStepProgress?.(step, idx, total);
          },
          onAssetReady: (asset) => {
            options.onAssetReady?.(asset);
            request.onAssetReady?.(asset);
          },
        });

        setResult(genResult);
        setStatus('completed');
        setCurrentStep(null);

        options.onComplete?.(genResult);

        return genResult;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Generation failed';
        setError(errorMessage);
        setStatus('error');
        setCurrentStep(null);

        if (err instanceof Error) {
          options.onError?.(err);
        }

        throw err;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setCurrentStep(null);
    setStepIndex(0);
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    currentStep,
    stepIndex,
    totalSteps,
    progress,
    result,
    error,
    generate,
    reset,
    steps: SIMULATION_STEPS,
  };
}

// ============================================================================
// TOAST HELPERS
// ============================================================================

/**
 * Standard toast messages for financial simulation steps
 */
export const TOAST_MESSAGES = {
  'mpc-signing': {
    title: 'Simulating MPC Signing',
    description: 'Multi-party computation protocol executing across threshold nodes',
  },
  'netxd-settlement': {
    title: 'NetXD Settlement',
    description: 'Cross-domain atomic settlement in progress via NetXD protocol',
  },
  'mpc-keygen': {
    title: 'MPC Key Generation',
    description: 'Generating distributed key shares for secure signing',
  },
  broadcast: {
    title: 'Broadcasting Transaction',
    description: 'Propagating signed transaction to settlement network',
  },
  finalization: {
    title: 'Transaction Finalized',
    description: 'Asset generation confirmed with cryptographic proof',
  },
} as const;

/**
 * Get toast message for a simulation step
 */
export function getToastForStep(stepId: string): { title: string; description: string } | null {
  if (stepId in TOAST_MESSAGES) {
    return TOAST_MESSAGES[stepId as keyof typeof TOAST_MESSAGES];
  }

  return null;
}
