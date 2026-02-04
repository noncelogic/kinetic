'use client';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  Card,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@repo/ui';
import { Play, ShieldCheck, AlertTriangle, Loader2, Sliders, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { trpc } from '@/trpc/client';
import { UploadDropzone } from '@/utils/uploadthing';

export default function MediaBankPage() {
  const { data: session } = useSession();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [aspectRatio, setAspectRatio] = useState('16:9');

  const utils = trpc.useUtils();

  // Polling for jobs
  const jobsQuery = trpc.media.listJobs.useQuery(undefined, {
    refetchInterval: 1000,
  });

  const selectedJob = jobsQuery.data?.find((j) => j.id === selectedJobId);
  const policyQuery = trpc.media.checkPolicy.useQuery(
    { assetId: selectedJob?.assetId ?? '' },
    { enabled: !!selectedJob?.assetId }
  );

  const generateMutation = trpc.media.generate.useMutation({
    onSuccess: () => {
      setPrompt('');
      utils.media.listJobs.invalidate();
    },
  });

  const handleGenerate = () => {
    if (!session?.user?.id) {
      return;
    }

    generateMutation.mutate({
      prompt,
      userId: session.user.id,
    });
  };

  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Asset Bank</h1>
          <p className="text-muted-foreground">AI-Generated Content with Compliance Guardrails</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            Policy Engine Active
          </Badge>
        </div>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden bg-background">
        <ResizablePanelGroup orientation="horizontal">
          {/* LEFT: Generator */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full border-r bg-muted/10">
              <Tabs defaultValue="generate" className="h-full flex flex-col">
                <div className="px-4 pt-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="generate" className="flex-1">
                      Generate
                    </TabsTrigger>
                    <TabsTrigger value="remix" className="flex-1">
                      Remix
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="generate" className="flex-1 p-4 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-muted-foreground">
                        Prompt
                      </label>
                      <textarea
                        className="w-full p-3 rounded-md border bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        rows={4}
                        placeholder="Describe the track..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <Sliders className="w-3 h-3" /> Duration
                        </label>
                        <span className="text-xs text-muted-foreground">{duration}s</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="120"
                        step="15"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">Aspect Ratio (Cover Art)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['16:9', '1:1', '9:16'].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio)}
                            className={`text-xs py-1 px-2 rounded border ${aspectRatio === ratio ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={!prompt || generateMutation.isPending || !session}
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : session ? (
                      'Generate Asset'
                    ) : (
                      'Sign In to Generate'
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="remix" className="flex-1 p-4">
                  <div className="h-full flex flex-col space-y-4">
                    <div className="rounded-lg border border-dashed p-4 text-center">
                      <UploadDropzone
                        endpoint="mediaUploader"
                        onClientUploadComplete={(_res) => {
                          // TODO: Trigger Remix Mutation
                        }}
                        onUploadError={(error: Error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                        appearance={{
                          button: 'bg-primary text-primary-foreground text-xs px-2 py-1',
                          container: 'flex flex-col items-center justify-center gap-2',
                          label:
                            'text-xs text-muted-foreground hover:text-primary transition-colors',
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Upload an audio file or image to use as a reference for style transfer.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* CENTER: Grid */}
          <ResizablePanel defaultSize={50}>
            <div className="h-full p-4 overflow-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {jobsQuery.data?.map((job) => (
                  <Card
                    key={job.id}
                    className={`group cursor-pointer transition-colors ${selectedJobId === job.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary'}`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                      {job.status === 'COMPLETED' ? (
                        <>
                          <Play className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="absolute bottom-2 right-2 text-xs font-mono bg-black/50 text-white px-1 rounded">
                            02:30
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            {job.status}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm truncate w-32">{job.prompt}</p>
                          <p className="text-xs text-muted-foreground">AI Audio</p>
                        </div>
                        {job.status === 'COMPLETED' ? (
                          job.asset?.status === 'APPROVED' ? (
                            <Badge
                              variant="default"
                              className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs"
                            >
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Pending Review
                            </Badge>
                          )
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Generating
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT: Policy Simulator */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col bg-muted/10 border-l">
              <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Policy Engine</h3>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    v1.0.2 Active
                  </Badge>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-4">
                {!selectedJob ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                    <ShieldCheck className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Select an asset to inspect compliance chain.
                    </p>
                  </div>
                ) : policyQuery.isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 rounded-lg bg-muted/50" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {policyQuery.data?.map(
                      (
                        rule: { ruleId: string; name: string; status: string; message?: string },
                        i: number
                      ) => (
                        <div
                          key={rule.ruleId}
                          className={`group relative overflow-hidden rounded-lg border bg-background transition-all duration-500 animate-in slide-in-from-bottom-2 fade-in`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        >
                          {/* Status Bar */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1 ${rule.status === 'FAIL' ? 'bg-red-500' : 'bg-green-500'}`}
                          />

                          <div className="p-4 pl-5">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium flex items-center gap-2">
                                <span className="font-mono text-xs text-muted-foreground opacity-70">
                                  {rule.ruleId}
                                </span>
                                {rule.name}
                              </h4>
                              {rule.status === 'PASS' ? (
                                <div className="text-green-500 flex items-center gap-1">
                                  <span className="text-[10px] font-bold">PASS</span>
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="text-red-500 flex items-center gap-1">
                                  <span className="text-[10px] font-bold">FAIL</span>
                                  <AlertTriangle className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Code Block Visual */}
                            <div className="relative mt-3 rounded-md bg-zinc-950 p-3 font-mono text-[10px] text-zinc-400 overflow-hidden">
                              <div className="absolute top-2 right-2 flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                              </div>
                              <pre className="overflow-x-auto">
                                <code>
                                  <span className="text-purple-400">z</span>.object({'{'}
                                  {'\n'}
                                  {'  '}c2pa: <span className="text-yellow-400">z.boolean()</span>
                                  .refine(<span className="text-blue-400">val</span> {`=>`} val ==={' '}
                                  <span className="text-red-400">true</span>){'\n'}
                                  {'}'})
                                </code>
                              </pre>
                              {/* Scanning line effect */}
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-[200%] w-full animate-[scan_2s_ease-in-out_infinite]" />
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-xs">
                              <span
                                className={`font-medium ${rule.status === 'FAIL' ? 'text-red-500' : 'text-green-600'}`}
                              >
                                {rule.status === 'FAIL' ? 'VIOLATION DETECTED' : 'COMPLIANT'}
                              </span>
                              {rule.message && (
                                <span className="text-muted-foreground border-l pl-2 ml-auto truncate max-w-[150px]">
                                  {rule.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
