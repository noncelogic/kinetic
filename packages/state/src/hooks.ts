import { useMachine } from '@xstate/react';
import { onboardingMachine } from './machines/example-flow';

/**
 * Hook for onboarding flow
 * Returns typed state + send function
 */
export function useOnboarding() {
  return useMachine(onboardingMachine);
}
