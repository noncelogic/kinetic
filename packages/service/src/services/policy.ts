import { z } from 'zod';

export const C2PAMetadataSchema = z.object({
  c2pa: z.boolean().refine(val => val === true, {
    message: "Policy 4.2: AI Disclosure - Media must include C2PA metadata indicating synthetic origin."
  })
});

export const AudioSafetySchema = z.object({
  piiDetected: z.boolean().refine(val => val === false, {
    message: "Policy 1.1: Audio Safety - Content contains PII."
  })
});

export type PolicyResult = {
  ruleId: string;
  name: string;
  status: 'PASS' | 'FAIL';
  message?: string;
  schemaCode: string;
};

export function simulatePolicyCheck(assetContent: any): PolicyResult[] {
  const results: PolicyResult[] = [];

  // Check 1: C2PA
  const c2paCheck = C2PAMetadataSchema.safeParse(assetContent);
  results.push({
    ruleId: '4.2',
    name: 'AI Disclosure',
    status: c2paCheck.success ? 'PASS' : 'FAIL',
    message: c2paCheck.success ? undefined : c2paCheck.error.issues[0].message,
    schemaCode: `z.object({ c2pa: z.boolean().refine(val => val === true) })`
  });

  // Check 2: Safety
  const safetyCheck = AudioSafetySchema.safeParse(assetContent);
  results.push({
    ruleId: '1.1',
    name: 'Audio Safety',
    status: safetyCheck.success ? 'PASS' : 'FAIL',
    message: safetyCheck.success ? undefined : safetyCheck.error.issues[0].message,
    schemaCode: `z.object({ piiDetected: z.boolean().refine(val => val === false) })`
  });

  return results;
}
