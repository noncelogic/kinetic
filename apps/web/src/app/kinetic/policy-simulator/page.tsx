'use client';

import { useState, useCallback, type ReactElement } from 'react';
import { z } from 'zod';

// ============================================================================
// POLICY DEFINITION - Human Readable
// ============================================================================
const POLICY_TEXT = `DUAL APPROVAL POLICY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Purpose: Prevent unauthorized large transactions

RULE 1: Transaction Threshold
├─ Any transaction ≥ $10,000 USD requires dual approval
└─ Single approval sufficient for amounts < $10,000

RULE 2: Approval Requirements  
├─ Minimum 2 authorized approvers must sign
├─ Approvers must be distinct individuals
└─ Self-approval is prohibited

RULE 3: Audit Trail
├─ All approval decisions must be logged
├─ Timestamp and approver identity recorded
└─ Rejection reason must be documented`;

// ============================================================================
// ZOD GUARDRAIL - Code Translation
// ============================================================================
const THRESHOLD = 10_000;

const ApproverSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  role: z.enum(['admin', 'manager', 'approver']),
  approvedAt: z.string().datetime(),
});

const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.literal('USD'),
  description: z.string(),
  requestedBy: z.string().uuid(),
  approvals: z.array(ApproverSchema),
});

// The actual guardrail that enforces dual approval
const DualApprovalGuardrail = TransactionSchema.superRefine((tx, ctx) => {
  // Rule 1: Check if dual approval is required
  if (tx.amount >= THRESHOLD) {
    // Rule 2: Verify minimum approvers
    if (tx.approvals.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `POLICY VIOLATION: Transaction of $${tx.amount.toLocaleString()} requires minimum 2 approvals. Found: ${tx.approvals.length.toString()}`,
        path: ['approvals'],
      });
    }

    // Rule 2: Verify distinct approvers
    const approverIds = tx.approvals.map((a) => a.id);
    const uniqueApprovers = new Set(approverIds);
    if (uniqueApprovers.size !== approverIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'POLICY VIOLATION: Approvers must be distinct individuals',
        path: ['approvals'],
      });
    }

    // Rule 2: No self-approval
    if (tx.approvals.some((a) => a.id === tx.requestedBy)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'POLICY VIOLATION: Self-approval is prohibited',
        path: ['approvals'],
      });
    }
  }
});

// ============================================================================
// ZOD CODE AS STRING (for display)
// ============================================================================
const ZOD_CODE = `// Zod Guardrail Implementation
const THRESHOLD = 10_000;

const ApproverSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  role: z.enum(['admin', 'manager', 'approver']),
  approvedAt: z.string().datetime(),
});

const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.literal('USD'),
  description: z.string(),
  requestedBy: z.string().uuid(),
  approvals: z.array(ApproverSchema),
});

const DualApprovalGuardrail = TransactionSchema
  .superRefine((tx, ctx) => {
    // RULE 1: Transaction Threshold
    if (tx.amount >= THRESHOLD) {
      
      // RULE 2: Minimum 2 approvers required
      if (tx.approvals.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: \`Transaction of $\${tx.amount} 
                    requires minimum 2 approvals\`,
          path: ['approvals'],
        });
      }
      
      // RULE 2: Distinct approvers
      const ids = tx.approvals.map(a => a.id);
      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Approvers must be distinct',
          path: ['approvals'],
        });
      }
      
      // RULE 2: No self-approval
      if (tx.approvals.some(a => a.id === tx.requestedBy)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Self-approval prohibited',
          path: ['approvals'],
        });
      }
    }
  });`;

// ============================================================================
// POLICY HIGHLIGHTING RULES
// ============================================================================
interface ViolationHighlight {
  lineStart: number;
  lineEnd: number;
  rule: string;
}

const POLICY_LINES = POLICY_TEXT.split('\n');

const VIOLATION_HIGHLIGHTS: Record<string, ViolationHighlight> = {
  'minimum 2 approvals': {
    lineStart: 10, // "Minimum 2 authorized approvers must sign"
    lineEnd: 10,
    rule: 'RULE 2: Approval Requirements',
  },
  'distinct individuals': {
    lineStart: 11, // "Approvers must be distinct individuals"
    lineEnd: 11,
    rule: 'RULE 2: Approval Requirements',
  },
  'Self-approval': {
    lineStart: 12, // "Self-approval is prohibited"
    lineEnd: 12,
    rule: 'RULE 2: Approval Requirements',
  },
};

// ============================================================================
// SIMULATION RESULT TYPE
// ============================================================================
interface SimulationResult {
  success: boolean;
  transaction: {
    amount: number;
    approvalCount: number;
  };
  violations: string[];
  highlightedLines: number[];
  timestamp: string;
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function PolicySimulatorPage(): ReactElement {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCode, setShowCode] = useState(true);

  // Simulate a violating transaction: $15k with only 1 approval
  const simulateViolation = useCallback((): void => {
    setIsAnimating(true);
    setResult(null);

    // Create a transaction that violates the policy
    const violatingTransaction = {
      id: crypto.randomUUID(),
      amount: 15_000, // Above threshold
      currency: 'USD' as const,
      description: 'Equipment purchase - urgent',
      requestedBy: 'user-001-uuid-here-1234',
      approvals: [
        {
          id: 'approver-001-uuid-here',
          name: 'Alice Manager',
          role: 'manager' as const,
          approvedAt: new Date().toISOString(),
        },
        // Only 1 approval! Policy requires 2 for amounts >= $10k
      ],
    };

    // Simulate network delay for dramatic effect
    setTimeout(() => {
      const validationResult = DualApprovalGuardrail.safeParse(violatingTransaction);

      if (!validationResult.success) {
        const violations = validationResult.error.issues.map((issue) => issue.message);
        const highlightedLines: number[] = [];

        // Find which policy lines to highlight based on violation messages
        violations.forEach((violation) => {
          Object.entries(VIOLATION_HIGHLIGHTS).forEach(([key, highlight]) => {
            if (violation.toLowerCase().includes(key.toLowerCase())) {
              for (let i = highlight.lineStart; i <= highlight.lineEnd; i++) {
                if (!highlightedLines.includes(i)) {
                  highlightedLines.push(i);
                }
              }
            }
          });
        });

        setResult({
          success: false,
          transaction: {
            amount: violatingTransaction.amount,
            approvalCount: violatingTransaction.approvals.length,
          },
          violations,
          highlightedLines,
          timestamp: new Date().toISOString(),
        });
      } else {
        setResult({
          success: true,
          transaction: {
            amount: violatingTransaction.amount,
            approvalCount: violatingTransaction.approvals.length,
          },
          violations: [],
          highlightedLines: [],
          timestamp: new Date().toISOString(),
        });
      }

      setIsAnimating(false);
    }, 800);
  }, []);

  // Simulate a compliant transaction
  const simulateCompliant = useCallback((): void => {
    setIsAnimating(true);
    setResult(null);

    const compliantTransaction = {
      id: crypto.randomUUID(),
      amount: 15_000,
      currency: 'USD' as const,
      description: 'Equipment purchase - approved',
      requestedBy: 'user-001-uuid-here-1234',
      approvals: [
        {
          id: 'approver-001-uuid-here',
          name: 'Alice Manager',
          role: 'manager' as const,
          approvedAt: new Date().toISOString(),
        },
        {
          id: 'approver-002-uuid-here',
          name: 'Bob Director',
          role: 'admin' as const,
          approvedAt: new Date().toISOString(),
        },
      ],
    };

    setTimeout(() => {
      const validationResult = DualApprovalGuardrail.safeParse(compliantTransaction);

      setResult({
        success: validationResult.success,
        transaction: {
          amount: compliantTransaction.amount,
          approvalCount: compliantTransaction.approvals.length,
        },
        violations: validationResult.success
          ? []
          : validationResult.error.issues.map((i) => i.message),
        highlightedLines: [],
        timestamp: new Date().toISOString(),
      });

      setIsAnimating(false);
    }, 800);
  }, []);

  const reset = useCallback((): void => {
    setResult(null);
  }, []);

  const handleToggleCode = useCallback((): void => {
    setShowCode((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Kinetic Policy Simulator</h1>
                <p className="text-sm text-slate-400">Policy-to-Code Translation Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleCode}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Split View */}
        <div className={`grid gap-6 ${showCode ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl mx-auto'}`}>
          {/* Left Panel: Policy Text */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <h2 className="text-lg font-medium text-white">Policy Document</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Human-readable</span>
            </div>
            <div className="p-6">
              <pre className="text-sm leading-relaxed">
                {POLICY_LINES.map((line, index) => {
                  const isHighlighted = result?.highlightedLines.includes(index) ?? false;
                  const isHeader = line.includes('RULE') || line.includes('DUAL APPROVAL');
                  const isSeparator = line.includes('━');

                  let textColorClass = 'text-slate-300';
                  if (isHighlighted) {
                    textColorClass = '';
                  } else if (isHeader) {
                    textColorClass = 'text-violet-300 font-semibold';
                  } else if (isSeparator) {
                    textColorClass = 'text-slate-600';
                  }

                  return (
                    <div
                      key={index}
                      className={`
                        px-3 py-0.5 -mx-3 rounded transition-all duration-500
                        ${isHighlighted 
                          ? 'bg-red-500/30 border-l-4 border-red-500 animate-pulse' 
                          : ''}
                        ${textColorClass}
                      `}
                    >
                      <span className="text-slate-600 select-none mr-4 text-xs w-6 inline-block">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {line.length > 0 ? line : ' '}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>

          {/* Right Panel: Zod Code */}
          {showCode && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <h2 className="text-lg font-medium text-white">Zod Guardrail</h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">Machine-enforced</span>
              </div>
              <div className="p-6 overflow-auto max-h-[600px]">
                <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                  <code>{ZOD_CODE}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="mt-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Transaction Simulation</h3>
              <p className="text-slate-400 text-sm">
                Test the guardrail with a $15,000 transaction requiring dual approval
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={simulateViolation}
                disabled={isAnimating}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${isAnimating 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/25 hover:scale-105'}
                `}
              >
                {isAnimating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  '⚠️ Violate Policy (1 approval)'
                )}
              </button>
              <button
                onClick={simulateCompliant}
                disabled={isAnimating}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${isAnimating 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105'}
                `}
              >
                ✓ Comply (2 approvals)
              </button>
              {result !== null && (
                <button
                  onClick={reset}
                  className="px-6 py-3 rounded-xl font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Result Panel */}
        {result !== null && (
          <div
            className={`
              mt-6 rounded-2xl border overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-4
              ${result.success 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-red-500/10 border-red-500/30'}
            `}
          >
            <div className={`px-6 py-4 border-b ${result.success ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-2xl
                  ${result.success ? 'bg-emerald-500/20' : 'bg-red-500/20'}
                `}>
                  {result.success ? '✓' : '✕'}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.success ? 'Transaction Approved' : 'Transaction Rejected'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    ${result.transaction.amount.toLocaleString()} with {result.transaction.approvalCount} approval(s)
                  </p>
                </div>
              </div>
            </div>
            
            {!result.success && result.violations.length > 0 && (
              <div className="p-6">
                <h4 className="text-sm font-medium text-red-400 mb-3 uppercase tracking-wide">
                  Policy Violations Detected
                </h4>
                <div className="space-y-3">
                  {result.violations.map((violation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <span className="text-red-400 mt-0.5">⚠</span>
                      <div>
                        <p className="text-red-300 font-mono text-sm">{violation}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          See highlighted policy section above
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.success && (
              <div className="p-6">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <div>
                    <p className="text-emerald-300 font-mono text-sm">
                      All policy requirements satisfied
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      Transaction meets dual approval threshold with 2 distinct approvers
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Log Entry */}
            <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Audit Entry: {result.timestamp}
                </span>
                <span className={`
                  text-xs font-medium px-2 py-1 rounded
                  ${result.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                `}>
                  {result.success ? 'APPROVED' : 'REJECTED'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Explanation Card */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📜</span>
            </div>
            <h3 className="text-white font-medium mb-2">Policy as Code</h3>
            <p className="text-slate-400 text-sm">
              Human-readable policies are translated into Zod schemas that enforce rules at runtime.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-white font-medium mb-2">Guardrail Enforcement</h3>
            <p className="text-slate-400 text-sm">
              Transactions are validated against Zod schemas before execution, preventing policy violations.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-white font-medium mb-2">Violation Traceability</h3>
            <p className="text-slate-400 text-sm">
              When violations occur, the exact policy clause is highlighted, creating clear accountability.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
