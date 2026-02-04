import { describe, it, expect } from 'vitest';

import { UserSchema, CreateUserSchema, UpdateUserSchema } from '../user';

describe('UserSchema', () => {
  const validUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a complete valid user', () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should require valid UUID for id', () => {
    const invalid = { ...validUser, id: 'not-a-uuid' };
    const result = UserSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should require valid email format', () => {
    const invalidEmails = [
      'not-an-email',
      'missing@domain',
      '@nodomain.com',
      'spaces in@email.com',
    ];
    invalidEmails.forEach((email) => {
      const result = UserSchema.safeParse({ ...validUser, email });
      expect(result.success).toBe(false);
    });
  });

  it('should require name with at least 1 character', () => {
    const result = UserSchema.safeParse({ ...validUser, name: '' });
    expect(result.success).toBe(false);
  });

  it('should enforce name max length of 100', () => {
    const tooLong = UserSchema.safeParse({ ...validUser, name: 'x'.repeat(101) });
    const atLimit = UserSchema.safeParse({ ...validUser, name: 'x'.repeat(100) });
    expect(tooLong.success).toBe(false);
    expect(atLimit.success).toBe(true);
  });

  it('should require Date objects for timestamps', () => {
    const withStringDate = { ...validUser, createdAt: '2024-01-01' };
    const result = UserSchema.safeParse(withStringDate);
    expect(result.success).toBe(false);
  });

  it('should require all fields', () => {
    const missingFields = [
      { ...validUser, id: undefined },
      { ...validUser, email: undefined },
      { ...validUser, name: undefined },
      { ...validUser, createdAt: undefined },
      { ...validUser, updatedAt: undefined },
    ];
    missingFields.forEach((invalid) => {
      const result = UserSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateUserSchema', () => {
  it('should validate valid create input', () => {
    const input = {
      email: 'newuser@example.com',
      name: 'New User',
    };
    const result = CreateUserSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should require email field', () => {
    const input = { name: 'No Email' };
    const result = CreateUserSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should require name field', () => {
    const input = { email: 'test@example.com' };
    const result = CreateUserSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should validate email format', () => {
    const input = { email: 'invalid-email', name: 'Test' };
    const result = CreateUserSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should validate name constraints', () => {
    expect(CreateUserSchema.safeParse({ email: 'test@example.com', name: '' }).success).toBe(false);
    expect(
      CreateUserSchema.safeParse({ email: 'test@example.com', name: 'x'.repeat(101) }).success
    ).toBe(false);
  });

  it('should not allow extra fields (stripped)', () => {
    const input = {
      email: 'test@example.com',
      name: 'Test User',
      extraField: 'should be ignored',
    };
    const result = CreateUserSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect('extraField' in result.data).toBe(false);
    }
  });
});

describe('UpdateUserSchema', () => {
  it('should allow updating name only', () => {
    const input = { name: 'Updated Name' };
    const result = UpdateUserSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should allow empty object (no updates)', () => {
    const result = UpdateUserSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should validate name when provided', () => {
    expect(UpdateUserSchema.safeParse({ name: '' }).success).toBe(false);
    expect(UpdateUserSchema.safeParse({ name: 'x'.repeat(101) }).success).toBe(false);
    expect(UpdateUserSchema.safeParse({ name: 'Valid Name' }).success).toBe(true);
  });

  it('should strip unknown fields', () => {
    const input = {
      name: 'New Name',
      email: 'should-not-be-allowed@example.com',
    };
    const result = UpdateUserSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect('email' in result.data).toBe(false);
    }
  });

  it('should handle undefined values correctly', () => {
    const input = { name: undefined };
    const result = UpdateUserSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
