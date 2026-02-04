import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { schemaToFields } from '../use-zod-form';

describe('schemaToFields', () => {
  it('should convert a simple schema to field configs', () => {
    const schema = z.object({
      name: z.string().describe('Your Name'),
      age: z.number().describe('Your Age'),
    });

    const fields = schemaToFields(schema);

    expect(fields).toHaveLength(2);
    expect(fields[0]).toEqual({
      name: 'name',
      type: 'text',
      required: true,
      label: 'Your Name',
    });
    expect(fields[1]).toEqual({
      name: 'age',
      type: 'number',
      required: true,
      label: 'Your Age',
    });
  });

  it('should detect email fields', () => {
    const schema = z.object({
      contactEmail: z.string().email().describe('Contact Email'),
    });

    const fields = schemaToFields(schema);

    expect(fields[0]?.type).toBe('email');
  });

  it('should detect boolean fields as checkbox', () => {
    const schema = z.object({
      subscribe: z.boolean().describe('Subscribe to newsletter'),
    });

    const fields = schemaToFields(schema);

    expect(fields[0]?.type).toBe('checkbox');
  });

  it('should detect enum fields as select', () => {
    const schema = z.object({
      status: z.enum(['active', 'inactive', 'pending']).describe('Status'),
    });

    const fields = schemaToFields(schema);

    expect(fields[0]?.type).toBe('select');
  });

  it('should mark optional fields correctly', () => {
    const schema = z.object({
      required: z.string().describe('Required Field'),
      optional: z.string().optional().describe('Optional Field'),
    });

    const fields = schemaToFields(schema);

    expect(fields.find((f) => f.name === 'required')?.required).toBe(true);
    expect(fields.find((f) => f.name === 'optional')?.required).toBe(false);
  });

  it('should use field name as label if no description', () => {
    const schema = z.object({
      username: z.string(),
    });

    const fields = schemaToFields(schema);

    expect(fields[0]?.label).toBe('username');
  });

  it('should handle mixed field types', () => {
    const schema = z.object({
      email: z.string().email().describe('Email'),
      password: z.string().describe('Password'),
      age: z.number().describe('Age'),
      remember: z.boolean().describe('Remember me'),
      role: z.enum(['user', 'admin']).describe('Role'),
    });

    const fields = schemaToFields(schema);

    expect(fields).toHaveLength(5);
    expect(fields.map((f) => f.type)).toEqual(['email', 'text', 'number', 'checkbox', 'select']);
  });

  it('should handle empty schema', () => {
    const schema = z.object({});
    const fields = schemaToFields(schema);
    expect(fields).toHaveLength(0);
  });

  it('should preserve field order', () => {
    const schema = z.object({
      first: z.string().describe('First'),
      second: z.string().describe('Second'),
      third: z.string().describe('Third'),
    });

    const fields = schemaToFields(schema);

    expect(fields.map((f) => f.name)).toEqual(['first', 'second', 'third']);
  });
});
