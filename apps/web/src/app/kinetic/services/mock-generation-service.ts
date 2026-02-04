/**
 * Mock AI Generation Service for Kinetic Phase 2
 *
 * Returns preset assets after a 2-second delay to simulate realistic generation flow.
 * Includes financial simulation toasts for MPC signing and settlement.
 */

// ============================================================================
// PRESET ASSETS - Deterministic responses for simulation
// ============================================================================

export interface GeneratedAsset {
  id: string;
  name: string;
  description: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO';
  fileUrl: string;
  contentType: string;
  aspectRatio: string;
  createdAt: string;
  metadata: {
    model: string;
    prompt: string;
    seed: number;
    steps: number;
    cfg: number;
  };
}

export interface GenerationJob {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  assets: GeneratedAsset[];
  createdAt: string;
  completedAt: string | null;
  error: string | null;
}

// Deterministic preset assets (no randomness)
const PRESET_ASSETS: GeneratedAsset[] = [
  {
    id: 'asset-kinetic-001',
    name: 'Corporate Brand Identity',
    description: 'AI-generated brand concept featuring modern gradients and geometric shapes',
    mediaType: 'IMAGE',
    fileUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
    contentType: 'image/jpeg',
    aspectRatio: '16:9',
    createdAt: new Date().toISOString(),
    metadata: {
      model: 'kinetic-v2',
      prompt: 'Modern corporate brand identity, geometric shapes, gradient colors',
      seed: 42,
      steps: 50,
      cfg: 7.5,
    },
  },
  {
    id: 'asset-kinetic-002',
    name: 'Abstract Data Visualization',
    description: 'Network topology visualization with flowing data streams',
    mediaType: 'IMAGE',
    fileUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    contentType: 'image/jpeg',
    aspectRatio: '16:9',
    createdAt: new Date().toISOString(),
    metadata: {
      model: 'kinetic-v2',
      prompt: 'Abstract data visualization, network topology, flowing streams',
      seed: 1337,
      steps: 50,
      cfg: 7.5,
    },
  },
  {
    id: 'asset-kinetic-003',
    name: 'Futuristic Interface Concept',
    description: 'Holographic UI elements with cyberpunk aesthetic',
    mediaType: 'IMAGE',
    fileUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
    contentType: 'image/jpeg',
    aspectRatio: '16:9',
    createdAt: new Date().toISOString(),
    metadata: {
      model: 'kinetic-v2',
      prompt: 'Futuristic holographic interface, cyberpunk, neon accents',
      seed: 2048,
      steps: 50,
      cfg: 7.5,
    },
  },
];

// ============================================================================
// FINANCIAL SIMULATION STEPS
// ============================================================================

export interface SimulationStep {
  id: string;
  label: string;
  description: string;
  durationMs: number;
  icon: '🔐' | '🔑' | '📡' | '💰' | '✅' | '🏦' | '⚡';
}

export const SIMULATION_STEPS: SimulationStep[] = [
  {
    id: 'init',
    label: 'Initializing Secure Session',
    description: 'Establishing encrypted channel for asset generation',
    durationMs: 300,
    icon: '🔐',
  },
  {
    id: 'mpc-keygen',
    label: 'MPC Key Generation',
    description: 'Generating distributed key shares across threshold nodes',
    durationMs: 400,
    icon: '🔑',
  },
  {
    id: 'mpc-signing',
    label: 'Simulating MPC Signing',
    description: 'Multi-party computation signing ceremony in progress',
    durationMs: 500,
    icon: '⚡',
  },
  {
    id: 'broadcast',
    label: 'Broadcasting to Network',
    description: 'Propagating signed transaction to settlement layer',
    durationMs: 300,
    icon: '📡',
  },
  {
    id: 'netxd-settlement',
    label: 'NetXD Settlement',
    description: 'Cross-domain settlement finalization via NetXD protocol',
    durationMs: 400,
    icon: '🏦',
  },
  {
    id: 'finalization',
    label: 'Transaction Finalized',
    description: 'Asset generation confirmed with cryptographic proof',
    durationMs: 100,
    icon: '✅',
  },
];

// ============================================================================
// MOCK GENERATION SERVICE
// ============================================================================

export interface GenerationRequest {
  prompt: string;
  variations?: number;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  onStepProgress?: (step: SimulationStep, stepIndex: number, totalSteps: number) => void;
  onAssetReady?: (asset: GeneratedAsset) => void;
}

export interface GenerationResult {
  job: GenerationJob;
  assets: GeneratedAsset[];
  simulationLog: {
    step: SimulationStep;
    completedAt: string;
  }[];
}

/**
 * Simulates AI asset generation with 2-second delay.
 * Fires progress callbacks for each financial simulation step.
 */
export async function generateAssets(request: GenerationRequest): Promise<GenerationResult> {
  const jobId = `job-${Date.now().toString(36)}`;
  const startTime = Date.now();
  const simulationLog: GenerationResult['simulationLog'] = [];

  // Total simulation time: ~2000ms spread across steps
  const totalDuration = SIMULATION_STEPS.reduce((sum, step) => sum + step.durationMs, 0);
  const scaleFactor = 2000 / totalDuration; // Scale to exactly 2s

  // Execute each simulation step
  for (let i = 0; i < SIMULATION_STEPS.length; i++) {
    const step = SIMULATION_STEPS[i];
    if (step === undefined) {
      continue;
    }
    const scaledDuration = Math.round(step.durationMs * scaleFactor);

    // Fire progress callback
    if (request.onStepProgress !== undefined) {
      request.onStepProgress(step, i, SIMULATION_STEPS.length);
    }

    // Wait for step duration
    await new Promise((resolve) => setTimeout(resolve, scaledDuration));

    // Log completion
    simulationLog.push({
      step,
      completedAt: new Date().toISOString(),
    });
  }

  // Select assets based on request (deterministic)
  const variations = request.variations ?? 1;
  const sanitizedVariations = variations > 0 ? variations : 1;
  const variationCount = Math.min(sanitizedVariations, PRESET_ASSETS.length);
  const selectedAssets = PRESET_ASSETS.slice(0, variationCount).map((asset, index) => ({
    ...asset,
    id: `${asset.id}-${jobId}-${index.toString()}`,
    metadata: {
      ...asset.metadata,
      prompt: request.prompt.length > 0 ? request.prompt : asset.metadata.prompt,
    },
  }));

  // Fire asset ready callbacks
  for (const asset of selectedAssets) {
    if (request.onAssetReady !== undefined) {
      request.onAssetReady(asset);
    }
  }

  const completedAt = new Date().toISOString();

  return {
    job: {
      id: jobId,
      status: 'COMPLETED',
      progress: 100,
      assets: selectedAssets,
      createdAt: new Date(startTime).toISOString(),
      completedAt,
      error: null,
    },
    assets: selectedAssets,
    simulationLog,
  };
}

/**
 * Calculate total simulation duration
 */
export function getSimulationDuration(): number {
  return 2000; // Always 2 seconds as per spec
}

/**
 * Get step by ID
 */
export function getStepById(stepId: string): SimulationStep | undefined {
  return SIMULATION_STEPS.find((s) => s.id === stepId);
}
