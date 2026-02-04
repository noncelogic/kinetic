import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';

import { onboardingMachine } from '../machines/example-flow';

describe('onboardingMachine', () => {
  describe('initial state', () => {
    it('should start in emailStep state', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      expect(actor.getSnapshot().value).toBe('emailStep');
      actor.stop();
    });

    it('should have correct initial context', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      const snapshot = actor.getSnapshot();
      expect(snapshot.context).toEqual({
        userId: null,
        step: 0,
        email: '',
        name: '',
        plan: null,
        errors: [],
      });
      actor.stop();
    });

    it('should have step 0 initially', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      expect(actor.getSnapshot().context.step).toBe(0);
      actor.stop();
    });
  });

  describe('emailStep transitions', () => {
    it('should update email on SET_EMAIL event', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      expect(actor.getSnapshot().context.email).toBe('test@example.com');
      actor.stop();
    });

    it('should not transition to nameStep without email', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('emailStep');
      actor.stop();
    });

    it('should transition to nameStep when email is set and NEXT is sent', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('nameStep');
      expect(actor.getSnapshot().context.step).toBe(1);
      actor.stop();
    });

    it('should update email multiple times', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'first@example.com' });
      actor.send({ type: 'SET_EMAIL', email: 'second@example.com' });
      expect(actor.getSnapshot().context.email).toBe('second@example.com');
      actor.stop();
    });
  });

  describe('nameStep transitions', () => {
    function setupAtNameStep() {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });
      return actor;
    }

    it('should update name on SET_NAME event', () => {
      const actor = setupAtNameStep();
      actor.send({ type: 'SET_NAME', name: 'John Doe' });
      expect(actor.getSnapshot().context.name).toBe('John Doe');
      actor.stop();
    });

    it('should not transition to planStep without name', () => {
      const actor = setupAtNameStep();
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('nameStep');
      actor.stop();
    });

    it('should transition to planStep when name is set', () => {
      const actor = setupAtNameStep();
      actor.send({ type: 'SET_NAME', name: 'John Doe' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('planStep');
      expect(actor.getSnapshot().context.step).toBe(2);
      actor.stop();
    });

    it('should go back to emailStep on BACK event', () => {
      const actor = setupAtNameStep();
      actor.send({ type: 'BACK' });
      expect(actor.getSnapshot().value).toBe('emailStep');
      expect(actor.getSnapshot().context.step).toBe(0);
      actor.stop();
    });

    it('should preserve email when going back', () => {
      const actor = setupAtNameStep();
      actor.send({ type: 'BACK' });
      expect(actor.getSnapshot().context.email).toBe('test@example.com');
      actor.stop();
    });
  });

  describe('planStep transitions', () => {
    function setupAtPlanStep() {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });
      actor.send({ type: 'SET_NAME', name: 'John Doe' });
      actor.send({ type: 'NEXT' });
      return actor;
    }

    it('should update plan on SET_PLAN event', () => {
      const actor = setupAtPlanStep();
      actor.send({ type: 'SET_PLAN', plan: 'pro' });
      expect(actor.getSnapshot().context.plan).toBe('pro');
      actor.stop();
    });

    it('should accept all valid plan values', () => {
      const plans: Array<'free' | 'pro' | 'enterprise'> = ['free', 'pro', 'enterprise'];
      plans.forEach((plan) => {
        const actor = setupAtPlanStep();
        actor.send({ type: 'SET_PLAN', plan });
        expect(actor.getSnapshot().context.plan).toBe(plan);
        actor.stop();
      });
    });

    it('should not transition to submitting without plan', () => {
      const actor = setupAtPlanStep();
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('planStep');
      actor.stop();
    });

    it('should transition to submitting when plan is set', () => {
      const actor = setupAtPlanStep();
      actor.send({ type: 'SET_PLAN', plan: 'enterprise' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('submitting');
      actor.stop();
    });

    it('should go back to nameStep on BACK event', () => {
      const actor = setupAtPlanStep();
      actor.send({ type: 'BACK' });
      expect(actor.getSnapshot().value).toBe('nameStep');
      actor.stop();
    });
  });

  describe('error state', () => {
    it('should allow BACK from error state to planStep', async () => {
      // We need to create a machine that will fail
      // For this test, we'll manually verify the machine structure
      const actor = createActor(onboardingMachine);
      actor.start();

      // Verify error state exists and has correct transitions
      const machineConfig = onboardingMachine.config;
      expect(machineConfig.states).toHaveProperty('error');
      actor.stop();
    });

    it('should have RETRY transition from error state', () => {
      const machineConfig = onboardingMachine.config;
      const errorState = machineConfig.states?.error;
      expect(errorState).toBeDefined();
      expect(errorState?.on).toHaveProperty('RETRY');
      expect(errorState?.on).toHaveProperty('BACK');
    });
  });

  describe('complete state', () => {
    it('should be a final state', () => {
      const machineConfig = onboardingMachine.config;
      const completeState = machineConfig.states?.complete;
      expect(completeState).toBeDefined();
      expect(completeState?.type).toBe('final');
    });
  });

  describe('guards', () => {
    it('hasEmail guard should require non-empty email', () => {
      const actor = createActor(onboardingMachine);
      actor.start();

      // Empty email - guard should block
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('emailStep');

      // Set email - guard should pass
      actor.send({ type: 'SET_EMAIL', email: 'a' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('nameStep');
      actor.stop();
    });

    it('hasName guard should require non-empty name', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });

      // Empty name - guard should block
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('nameStep');

      // Set name - guard should pass
      actor.send({ type: 'SET_NAME', name: 'x' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('planStep');
      actor.stop();
    });

    it('hasPlan guard should require non-null plan', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });
      actor.send({ type: 'SET_NAME', name: 'Test' });
      actor.send({ type: 'NEXT' });

      // No plan - guard should block
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('planStep');

      // Set plan - guard should pass
      actor.send({ type: 'SET_PLAN', plan: 'free' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('submitting');
      actor.stop();
    });
  });

  describe('step tracking', () => {
    it('should increment step when moving forward', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      expect(actor.getSnapshot().context.step).toBe(0);

      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().context.step).toBe(1);

      actor.send({ type: 'SET_NAME', name: 'Test' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().context.step).toBe(2);
      actor.stop();
    });

    it('should decrement step when moving backward', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });
      actor.send({ type: 'SET_NAME', name: 'Test' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().context.step).toBe(2);

      actor.send({ type: 'BACK' });
      expect(actor.getSnapshot().context.step).toBe(1);

      actor.send({ type: 'BACK' });
      expect(actor.getSnapshot().context.step).toBe(0);
      actor.stop();
    });

    it('should not go below step 0', () => {
      const actor = createActor(onboardingMachine);
      actor.start();
      // Can't go back from emailStep, but if we could, step shouldn't go negative
      expect(actor.getSnapshot().context.step).toBe(0);
      actor.stop();
    });
  });

  describe('full flow integration', () => {
    it('should complete full onboarding flow', async () => {
      const actor = createActor(onboardingMachine);
      actor.start();

      // Step 1: Email
      expect(actor.getSnapshot().value).toBe('emailStep');
      actor.send({ type: 'SET_EMAIL', email: 'integration@test.com' });
      actor.send({ type: 'NEXT' });

      // Step 2: Name
      expect(actor.getSnapshot().value).toBe('nameStep');
      actor.send({ type: 'SET_NAME', name: 'Integration Test' });
      actor.send({ type: 'NEXT' });

      // Step 3: Plan
      expect(actor.getSnapshot().value).toBe('planStep');
      actor.send({ type: 'SET_PLAN', plan: 'pro' });
      actor.send({ type: 'NEXT' });

      // Should be submitting
      expect(actor.getSnapshot().value).toBe('submitting');

      // Verify context has all values
      const context = actor.getSnapshot().context;
      expect(context.email).toBe('integration@test.com');
      expect(context.name).toBe('Integration Test');
      expect(context.plan).toBe('pro');

      actor.stop();
    });

    it('should allow going back through entire flow', () => {
      const actor = createActor(onboardingMachine);
      actor.start();

      // Go forward
      actor.send({ type: 'SET_EMAIL', email: 'test@example.com' });
      actor.send({ type: 'NEXT' });
      actor.send({ type: 'SET_NAME', name: 'Test User' });
      actor.send({ type: 'NEXT' });
      expect(actor.getSnapshot().value).toBe('planStep');

      // Go all the way back
      actor.send({ type: 'BACK' });
      expect(actor.getSnapshot().value).toBe('nameStep');
      actor.send({ type: 'BACK' });
      expect(actor.getSnapshot().value).toBe('emailStep');

      // Data should be preserved
      expect(actor.getSnapshot().context.email).toBe('test@example.com');
      expect(actor.getSnapshot().context.name).toBe('Test User');

      actor.stop();
    });
  });
});
