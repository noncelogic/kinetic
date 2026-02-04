import { setup, assign, fromPromise } from 'xstate';

/**
 * Example: Multi-step onboarding flow
 *
 * States are explicit — agents can't produce impossible transitions.
 * Context is typed — no hallucinated data shapes.
 */

export interface OnboardingContext {
  userId: string | null;
  step: number;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise' | null;
  errors: string[];
}

type OnboardingEvent =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_PLAN'; plan: 'free' | 'pro' | 'enterprise' }
  | { type: 'SUBMIT' }
  | { type: 'RETRY' };

export const onboardingMachine = setup({
  types: {
    context: {} as OnboardingContext,
    events: {} as OnboardingEvent,
  },
  guards: {
    hasEmail: ({ context }) => context.email.length > 0,
    hasName: ({ context }) => context.name.length > 0,
    hasPlan: ({ context }) => context.plan !== null,
  },
  actions: {
    incrementStep: assign({ step: ({ context }) => context.step + 1 }),
    decrementStep: assign({
      step: ({ context }) => Math.max(0, context.step - 1),
    }),
    setEmail: assign({
      email: (_, params: { email: string }) => params.email,
    }),
    setName: assign({ name: (_, params: { name: string }) => params.name }),
    setPlan: assign({
      plan: (_, params: { plan: 'free' | 'pro' | 'enterprise' }) => params.plan,
    }),
    clearErrors: assign({ errors: [] }),
  },
  actors: {
    submitOnboarding: fromPromise(
      async ({ input }: { input: { email: string; name: string; plan: string | null } }) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { userId: `user_${Date.now()}`, ...input };
      }
    ),
  },
}).createMachine({
  id: 'onboarding',
  initial: 'emailStep',
  context: {
    userId: null,
    step: 0,
    email: '',
    name: '',
    plan: null,
    errors: [],
  },
  states: {
    emailStep: {
      on: {
        SET_EMAIL: {
          actions: [{ type: 'setEmail', params: ({ event }) => ({ email: event.email }) }],
        },
        NEXT: {
          target: 'nameStep',
          guard: 'hasEmail',
          actions: 'incrementStep',
        },
      },
    },
    nameStep: {
      on: {
        SET_NAME: {
          actions: [{ type: 'setName', params: ({ event }) => ({ name: event.name }) }],
        },
        NEXT: {
          target: 'planStep',
          guard: 'hasName',
          actions: 'incrementStep',
        },
        BACK: {
          target: 'emailStep',
          actions: 'decrementStep',
        },
      },
    },
    planStep: {
      on: {
        SET_PLAN: {
          actions: [{ type: 'setPlan', params: ({ event }) => ({ plan: event.plan }) }],
        },
        NEXT: {
          target: 'submitting',
          guard: 'hasPlan',
        },
        BACK: {
          target: 'nameStep',
          actions: 'decrementStep',
        },
      },
    },
    submitting: {
      invoke: {
        src: 'submitOnboarding',
        input: ({ context }) => ({
          email: context.email,
          name: context.name,
          plan: context.plan,
        }),
        onDone: { target: 'complete' },
        onError: { target: 'error' },
      },
    },
    error: {
      on: {
        RETRY: { target: 'submitting', actions: 'clearErrors' },
        BACK: { target: 'planStep' },
      },
    },
    complete: {
      type: 'final',
    },
  },
});

export type OnboardingMachine = typeof onboardingMachine;
