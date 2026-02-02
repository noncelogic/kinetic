'use client';

import { useCallback, useState, type ReactElement } from 'react';

import {
  SIMULATION_STEPS,
  generateAssets,
  type GenerationResult,
  type SimulationStep,
} from '../services/mock-generation-service';

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
            ${toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50' : ''}
            ${toast.type === 'info' ? 'bg-slate-800/90 border-slate-600/50' : ''}
            ${toast.type === 'processing' ? 'bg-violet-900/90 border-violet-500/50' : ''}
            ${toast.type === 'warning' ? 'bg-amber-900/90 border-amber-500/50' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{toast.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-white text-sm truncate">{toast.title}</h4>
                <button 
                  onClick={() => {
                    onDismiss(toast.id);
                  }}
                  className="text-slate-400 hover:text-white transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-slate-300 text-xs mt-1">{toast.description}</p>
              {toast.type === 'processing' && toast.progress !== undefined && (
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 ease-out"
                    style={{ width: `${toast.progress.toString()}%` }}
                  />
                </div>
              )}
              <span className="text-slate-500 text-[10px] mt-1 block">
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
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Kinetic Admin</h1>
                <p className="text-sm text-slate-400">Mock AI Generation Service</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`
                px-3 py-1.5 rounded-full text-xs font-medium
                ${isGenerating 
                  ? 'bg-violet-500/20 text-violet-300 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-300'}
              `}>
                {isGenerating ? '● Processing' : '● Ready'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Generation Panel */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-medium text-white">AI Asset Generation</h2>
            <p className="text-sm text-slate-400 mt-1">
              Simulates 2-second generation with MPC signing and NetXD settlement toasts
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
                  Generation Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                  }}
                  disabled={isGenerating}
                  className="w-full h-24 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none disabled:opacity-50"
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
                    ${isGenerating || !prompt.trim()
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105'}
                  `}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden mb-8 animate-in slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-medium text-white">Financial Simulation Pipeline</h2>
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
                        ${isActive ? 'bg-violet-500/20 border-violet-500/50 scale-105' : ''}
                        ${isComplete ? 'bg-emerald-500/10 border-emerald-500/30' : ''}
                        ${isPending ? 'bg-slate-900/30 border-slate-700/30 opacity-50' : ''}
                      `}
                    >
                      <div className="text-2xl mb-2">{step.icon}</div>
                      <h4 className={`text-sm font-medium mb-1 ${isActive ? 'text-violet-300' : isComplete ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{step.description}</p>
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl border-2 border-violet-500 animate-pulse pointer-events-none" />
                      )}
                      {isComplete && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
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
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-white">Generated Assets</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Job ID: <code className="text-violet-300">{result.job.id}</code>
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300">
                  ✓ {result.job.status}
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/50 hover:border-violet-500/50 transition-all duration-300"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={asset.fileUrl}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-white mb-1">{asset.name}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{asset.description}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-800">{asset.mediaType}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800">{asset.aspectRatio}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800">seed: {asset.metadata.seed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulation Log */}
            <div className="mt-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h2 className="text-lg font-medium text-white">Simulation Audit Log</h2>
              </div>
              <div className="p-6">
                <div className="font-mono text-xs space-y-2 text-slate-400">
                  {result.simulationLog.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="text-slate-600">[{entry.completedAt}]</span>
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white">{entry.step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-white font-medium mb-2">MPC Signing</h3>
            <p className="text-slate-400 text-sm">
              Multi-party computation ensures no single entity controls the signing key. 
              Threshold cryptography distributes trust.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🏦</span>
            </div>
            <h3 className="text-white font-medium mb-2">NetXD Settlement</h3>
            <p className="text-slate-400 text-sm">
              Cross-domain atomic settlement enables asset transfers across heterogeneous 
              networks with cryptographic finality.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-white font-medium mb-2">Deterministic Assets</h3>
            <p className="text-slate-400 text-sm">
              Preset assets ensure consistent demo behavior. Seeds and parameters 
              are locked for reproducible outputs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
