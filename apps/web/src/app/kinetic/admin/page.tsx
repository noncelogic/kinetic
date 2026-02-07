'use client';

import { useCallback, useState, type ReactElement } from 'react';

import {
  SIMULATION_STEPS,
  generateAssets,
  type GenerationResult,
  type SimulationStep,
} from '../services/mock-generation-service';

import { PageContent, PageHeader } from '@/components/ui';

// ============================================================================
// TOAST SYSTEM (inline for demo - in production use context/sonner)
// ============================================================================

interface Toast {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'processing';
  progress?: number;
  timestamp: string;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}): ReactElement {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-in slide-in-from-right-4 duration-300
            rounded-xl border p-4 shadow-2xl backdrop-blur-lg
            ${toast.type === 'success' ? 'bg-green-900/90 border-green-500/50' : ''}
            ${toast.type === 'info' ? 'bg-[var(--bg-elevated)] border-[var(--border)]' : ''}
            ${toast.type === 'processing' ? 'bg-accent/10 border-accent/50' : ''}
            ${toast.type === 'warning' ? 'bg-amber-900/90 border-amber-500/50' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{toast.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-[var(--text-primary)] text-sm truncate">
                  {toast.title}
                </h4>
                <button
                  onClick={() => {
                    onDismiss(toast.id);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-[var(--text-secondary)] text-xs mt-1">{toast.description}</p>
              {toast.type === 'processing' && toast.progress !== undefined && (
                <div className="mt-2 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300 ease-out"
                    style={{ width: `${toast.progress.toString()}%` }}
                  />
                </div>
              )}
              <span className="text-[var(--text-muted)] text-[10px] mt-1 block">
                {new Date(toast.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function KineticAdminPage(): ReactElement {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<SimulationStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [prompt, setPrompt] = useState('Futuristic financial dashboard with holographic charts');

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now().toString()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { ...toast, id, timestamp: new Date().toISOString() }]);

    // Auto-dismiss non-processing toasts after 4s
    if (toast.type !== 'processing') {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    }

    return id;
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setResult(null);
    setCurrentStep(null);
    setStepIndex(0);

    // Initial toast
    const mainToastId = addToast({
      icon: '🚀',
      title: 'Generation Started',
      description: 'Initializing AI generation pipeline...',
      type: 'processing',
      progress: 0,
    });

    try {
      const genResult = await generateAssets({
        prompt,
        variations: 2,
        aspectRatio: '16:9',
        onStepProgress: (step, idx, total) => {
          setCurrentStep(step);
          setStepIndex(idx);

          const progress = Math.round(((idx + 1) / total) * 100);

          updateToast(mainToastId, {
            icon: step.icon,
            title: step.label,
            description: step.description,
            progress,
          });

          // Special toasts for key financial steps
          if (step.id === 'mpc-signing') {
            addToast({
              icon: '⚡',
              title: 'Simulating MPC Signing',
              description: 'Multi-party computation protocol executing across 3 threshold nodes',
              type: 'info',
            });
          } else if (step.id === 'netxd-settlement') {
            addToast({
              icon: '🏦',
              title: 'NetXD Settlement',
              description: 'Cross-domain atomic settlement in progress via NetXD protocol',
              type: 'info',
            });
          }
        },
        onAssetReady: (asset) => {
          addToast({
            icon: '🎨',
            title: 'Asset Generated',
            description: `"${asset.name}" ready for review`,
            type: 'success',
          });
        },
      });

      // Complete the main toast
      updateToast(mainToastId, {
        icon: '✅',
        title: 'Generation Complete',
        description: `${genResult.assets.length.toString()} asset(s) generated successfully`,
        type: 'success',
        progress: undefined,
      });

      // Auto-dismiss after showing success
      setTimeout(() => {
        dismissToast(mainToastId);
      }, 3000);

      setResult(genResult);
    } catch (error) {
      updateToast(mainToastId, {
        icon: '❌',
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'warning',
        progress: undefined,
      });
    } finally {
      setIsGenerating(false);
      setCurrentStep(null);
    }
  }, [prompt, addToast, updateToast, dismissToast]);

  return (
    <PageContent>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <PageHeader
        title="Admin"
        description="Mock AI generation service for testing"
        actions={
          <span
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium
              ${
                isGenerating
                  ? 'bg-accent/20 text-accent animate-pulse'
                  : 'bg-green-500/20 text-green-400'
              }
            `}
          >
            {isGenerating ? '● Processing' : '● Ready'}
          </span>
        }
      />

      {/* Generation Panel */}
      <div className="glass-card-elevated overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-medium">AI Asset Generation</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Simulates 2-second generation with MPC signing and NetXD settlement toasts
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Generation Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                disabled={isGenerating}
                className="w-full h-24 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none disabled:opacity-50"
                placeholder="Describe what you want to generate..."
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => {
                  void handleGenerate();
                }}
                disabled={isGenerating || !prompt.trim()}
                className={`
                  px-8 py-4 rounded-xl font-medium transition-all duration-300
                  ${
                    isGenerating || !prompt.trim()
                      ? 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed'
                      : 'btn-primary hover:shadow-lg hover:shadow-accent/25 hover:scale-105'
                  }
                `}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  '🚀 Generate Assets'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps (shown during generation) */}
      {isGenerating && currentStep && (
        <div className="glass-card-elevated overflow-hidden mb-6 animate-in slide-in-from-bottom-4">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-medium">Financial Simulation Pipeline</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SIMULATION_STEPS.map((step, idx) => {
                const isActive = step.id === currentStep.id;
                const isComplete = idx < stepIndex;
                const isPending = idx > stepIndex;

                return (
                  <div
                    key={step.id}
                    className={`
                      relative p-4 rounded-xl border transition-all duration-300
                      ${isActive ? 'bg-accent/20 border-accent/50 scale-105' : ''}
                      ${isComplete ? 'bg-green-500/10 border-green-500/30' : ''}
                      ${isPending ? 'bg-[var(--bg-primary)] border-[var(--border)] opacity-50' : ''}
                    `}
                  >
                    <div className="text-2xl mb-2">{step.icon}</div>
                    <h4
                      className={`text-sm font-medium mb-1 ${isActive ? 'text-accent' : isComplete ? 'text-green-400' : 'text-[var(--text-muted)]'}`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                      {step.description}
                    </p>
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl border-2 border-accent animate-pulse pointer-events-none" />
                    )}
                    {isComplete && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {result && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="glass-card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Generated Assets</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Job ID: <code className="text-accent font-mono">{result.job.id}</code>
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                ✓ {result.job.status}
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group relative rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)] hover:border-accent/50 transition-all duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={asset.fileUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{asset.name}</h3>
                      <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                        {asset.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-secondary)]">
                          {asset.mediaType}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-secondary)]">
                          {asset.aspectRatio}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] font-mono">
                          seed: {asset.metadata.seed}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Simulation Log */}
          <div className="mt-6 glass-card-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium">Simulation Audit Log</h2>
            </div>
            <div className="p-6">
              <div className="font-mono text-xs space-y-2 text-[var(--text-muted)]">
                {result.simulationLog.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="text-[var(--text-muted)]">[{entry.completedAt}]</span>
                    <span className="text-green-400">✓</span>
                    <span className="text-[var(--text-primary)]">{entry.step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="glass-card-elevated p-6">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="font-medium mb-2">MPC Signing</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Multi-party computation ensures no single entity controls the signing key. Threshold
            cryptography distributes trust.
          </p>
        </div>
        <div className="glass-card-elevated p-6">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
            <span className="text-2xl">🏦</span>
          </div>
          <h3 className="font-medium mb-2">NetXD Settlement</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Cross-domain atomic settlement enables asset transfers across heterogeneous networks
            with cryptographic finality.
          </p>
        </div>
        <div className="glass-card-elevated p-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h3 className="font-medium mb-2">Deterministic Assets</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Preset assets ensure consistent demo behavior. Seeds and parameters are locked for
            reproducible outputs.
          </p>
        </div>
      </div>
    </PageContent>
  );
}
