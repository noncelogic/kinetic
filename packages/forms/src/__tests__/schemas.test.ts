import { describe, it, expect } from 'vitest';

import { ContactFormSchema, SignupFormSchema } from '../schemas';

describe('ContactFormSchema', () => {
  it('should validate a complete valid contact form', () => {
    const input = {
      email: 'user@example.com',
      name: 'John Doe',
      company: 'Acme Inc',
      message: 'This is a test message that is long enough.',
    };
    const result = ContactFormSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should allow missing optional company field', () => {
    const input = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'This is a test message that is long enough.',
    };
    const result = ContactFormSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should require valid email format', () => {
    const input = {
      email: 'invalid-email',
      name: 'John Doe',
      message: 'This is a test message.',
    };
    const result = ContactFormSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should require name with at least 2 characters', () => {
    const tooShort = {
      email: 'user@example.com',
      name: 'J',
      message: 'This is a test message.',
    };
    const justRight = {
      email: 'user@example.com',
      name: 'Jo',
      message: 'This is a test message.',
    };
    expect(ContactFormSchema.safeParse(tooShort).success).toBe(false);
    expect(ContactFormSchema.safeParse(justRight).success).toBe(true);
  });

  it('should enforce name max length of 100', () => {
    const tooLong = {
      email: 'user@example.com',
      name: 'x'.repeat(101),
      message: 'This is a test message.',
    };
    expect(ContactFormSchema.safeParse(tooLong).success).toBe(false);
  });

  it('should require message with at least 10 characters', () => {
    const tooShort = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'Too short',
    };
    const justRight = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'Just right!',
    };
    expect(ContactFormSchema.safeParse(tooShort).success).toBe(false);
    expect(ContactFormSchema.safeParse(justRight).success).toBe(true);
  });

  it('should enforce message max length of 1000', () => {
    const tooLong = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'x'.repeat(1001),
    };
    const atLimit = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'x'.repeat(1000),
    };
    expect(ContactFormSchema.safeParse(tooLong).success).toBe(false);
    expect(ContactFormSchema.safeParse(atLimit).success).toBe(true);
  });

  it('should have correct field descriptions', () => {
    const shape = ContactFormSchema.shape;
    expect(shape.email.description).toBe('Email Address');
    expect(shape.name.description).toBe('Full Name');
    expect(shape.company.description).toBe('Company (Optional)');
    expect(shape.message.description).toBe('Message');
  });
});

describe('SignupFormSchema', () => {
  const validSignup = {
    email: 'newuser@example.com',
    password: 'securepassword123',
    confirmPassword: 'securepassword123',
    acceptTerms: true,
  };

  it('should validate a complete valid signup form', () => {
    const result = SignupFormSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
  });

  it('should require valid email format', () => {
    const input = { ...validSignup, email: 'not-an-email' };
    const result = SignupFormSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should require password with at least 8 characters', () => {
    const tooShort = { ...validSignup, password: '1234567', confirmPassword: '1234567' };
    const justRight = { ...validSignup, password: '12345678', confirmPassword: '12345678' };
    expect(SignupFormSchema.safeParse(tooShort).success).toBe(false);
    expect(SignupFormSchema.safeParse(justRight).success).toBe(true);
  });

  it('should require passwords to match', () => {
    const mismatch = {
      ...validSignup,
      password: 'password123',
      confirmPassword: 'differentpassword',
    };
    const result = SignupFormSchema.safeParse(mismatch);
    expect(result.success).toBe(false);
    if (!result.success) {
      const matchError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
      expect(matchError?.message).toBe('Passwords do not match');
    }
  });

  it('should require acceptTerms to be true', () => {
    const notAccepted = { ...validSignup, acceptTerms: false };
    const result = SignupFormSchema.safeParse(notAccepted);
    expect(result.success).toBe(false);
    if (!result.success) {
      const termsError = result.error.issues.find((i) => i.path.includes('acceptTerms'));
      expect(termsError?.message).toBe('You must accept the terms');
    }
  });

  it('should reject undefined acceptTerms', () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
    const result = SignupFormSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should have correct field descriptions', () => {
    // Access the inner object schema (before the refine)
    const baseShape = SignupFormSchema._def.schema.shape;
    expect(baseShape.email.description).toBe('Email');
    expect(baseShape.password.description).toBe('Password');
    expect(baseShape.confirmPassword.description).toBe('Confirm Password');
    expect(baseShape.acceptTerms.description).toBe('I accept the terms and conditions');
  });

  it('should validate matching empty passwords as invalid (too short)', () => {
    const emptyPasswords = {
      email: 'test@example.com',
      password: '',
      confirmPassword: '',
      acceptTerms: true,
    };
    const result = SignupFormSchema.safeParse(emptyPasswords);
    expect(result.success).toBe(false);
  });
});
