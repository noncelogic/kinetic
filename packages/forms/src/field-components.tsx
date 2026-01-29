'use client';

import type { FieldApi } from '@tanstack/react-form';

interface FieldInfoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<any, any, any, any>;
}

/**
 * Reusable field error display
 */
export function FieldInfo({ field }: FieldInfoProps) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-sm text-red-500 mt-1">
          {field.state.meta.errors.join(', ')}
        </p>
      )}
    </>
  );
}

/**
 * Text input field with label and validation
 */
export function TextField({
  field,
  label,
  type = 'text',
}: FieldInfoProps & { label: string; type?: 'text' | 'email' | 'password' }) {
  return (
    <div className="space-y-1">
      <label htmlFor={field.name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
      <FieldInfo field={field} />
    </div>
  );
}

/**
 * Select field for enums
 */
export function SelectField({
  field,
  label,
  options,
}: FieldInfoProps & { label: string; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-1">
      <label htmlFor={field.name} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={field.name}
        name={field.name}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FieldInfo field={field} />
    </div>
  );
}
