import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';

import type { z } from 'zod';

/**
 * Create a type-safe form from a Zod schema
 *
 * The schema drives:
 * - TypeScript types for form values
 * - Runtime validation
 * - Error messages
 *
 * Agents can't produce invalid form shapes.
 */
export function useZodForm<T extends z.ZodType>(
  schema: T,
  options?: {
    defaultValues?: Partial<z.infer<T>>;
    onSubmit?: (values: z.infer<T>) => void | Promise<void>;
  }
) {
  type FormValues = z.infer<T>;

  const form = useForm({
    defaultValues: (options?.defaultValues ?? {}) as FormValues,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await options?.onSubmit?.(value as z.infer<T>);
    },
  });

  return form;
}

/**
 * Dynamic form builder from Zod schema
 * Inspects schema shape to generate field configs
 */
export function schemaToFields<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  const shape = schema.shape;

  return Object.entries(shape).map(([key, zodType]) => {
    const fieldType = getFieldType(zodType as z.ZodType);
    const isRequired = !zodType.isOptional();

    return {
      name: key,
      type: fieldType,
      required: isRequired,
      // Extract description if set via .describe()
      label: (zodType as z.ZodType).description ?? key,
    };
  });
}

function getFieldType(zodType: z.ZodType): 'text' | 'email' | 'number' | 'select' | 'checkbox' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeName = (zodType._def as any).typeName as string | undefined;

  if (typeName === 'ZodString') {
    // Check for email refinement
    const checks = (zodType as z.ZodString)._def.checks ?? [];
    if (checks.some((c: { kind: string }) => c.kind === 'email')) {
      return 'email';
    }
    return 'text';
  }
  if (typeName === 'ZodNumber') {
    return 'number';
  }
  if (typeName === 'ZodBoolean') {
    return 'checkbox';
  }
  if (typeName === 'ZodEnum') {
    return 'select';
  }

  return 'text';
}
