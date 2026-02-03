'use client';

import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@repo/ui';
import { Play, ShieldCheck, AlertTriangle, Loader2, UploadCloud, Sliders } from 'lucide-react';
import { trpc } from '@/trpc/client';
import { useState } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import { useSession } from 'next-auth/react';

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

  const selectedJob = jobsQuery.data?.find((j: any) => j.id === selectedJobId);
  const policyQuery = trpc.media.checkPolicy.useQuery(
    { assetId: selectedJob?.assetId! },
    { enabled: !!selectedJob?.assetId }
  );

  const generateMutation = trpc.media.generate.useMutation({
    onSuccess: () => {
      setPrompt('');
      utils.media.listJobs.invalidate();
    },
  });

  const handleGenerate = () => {
    if (!session?.user?.id) return;
    
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
                    <TabsTrigger value="generate" className="flex-1">Generate</TabsTrigger>
                    <TabsTrigger value="remix" className="flex-1">Remix</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="generate" className="flex-1 p-4 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-muted-foreground">Prompt</label>
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
                    ) : session ? 'Generate Asset' : 'Sign In to Generate'}
                  </Button>
                </TabsContent>

                <TabsContent value="remix" className="flex-1 p-4">
                  <div className="h-full flex flex-col space-y-4">
                    <div className="rounded-lg border border-dashed p-4 text-center">
                      <UploadDropzone
                        endpoint="mediaUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Files: ", res);
                          // TODO: Trigger Remix Mutation
                        }}
                        onUploadError={(error: Error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                        appearance={{
                          button: "bg-primary text-primary-foreground text-xs px-2 py-1",
                          container: "flex flex-col items-center justify-center gap-2",
                          label: "text-xs text-muted-foreground hover:text-primary transition-colors"
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
                {jobsQuery.data?.map((job: any) => (
                  <Card 
                    key={job.id} 
                    className={`group cursor-pointer transition-colors ${selectedJobId === job.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary'}`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                      {job.status === 'COMPLETED' ? (
                        <>
                          <Play className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="absolute bottom-2 right-2 text-xs font-mono bg-black/50 text-white px-1 rounded">02:30</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                           <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                           <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{job.status}</span>
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
                             <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs">Approved</Badge>
                           ) : (
                             <Badge variant="secondary" className="text-xs">Pending Review</Badge>
                           )
                        ) : (
                           <Badge variant="outline" className="text-xs">Generating</Badge>
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
            <div className="h-full p-4 border-l bg-muted/10 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-sm uppercase">Compliance Audit</h3>
              </div>
              
              {!selectedJob ? (
                <div className="text-xs text-muted-foreground text-center py-10">Select an asset to audit</div>
              ) : policyQuery.isLoading ? (
                 <div className="text-xs text-muted-foreground text-center py-10">Running Policy Engine...</div>
              ) : (
                policyQuery.data?.map((rule: any) => (
                  <Card key={rule.ruleId} className={rule.status === 'FAIL' ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/20 bg-green-500/5'}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Policy {rule.ruleId}: {rule.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <p className="text-muted-foreground">{rule.message || "Compliance check passed."}</p>
                      <div className="bg-black/80 text-green-400 p-2 rounded font-mono text-[10px]">
                        {rule.schemaCode}
                      </div>
                      <div className={`flex items-center gap-2 pt-2 ${rule.status === 'FAIL' ? 'text-red-500' : 'text-green-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${rule.status === 'FAIL' ? 'bg-red-500' : 'bg-green-500'}`} />
                        {rule.status === 'FAIL' ? 'Failed' : 'Passed'}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
}
