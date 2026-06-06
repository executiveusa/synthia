import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  Bot,
  Gauge,
  MessageSquare,
  Mic,
  Network,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type BackendHealth = {
  status: string;
  version: string;
  port: string | number;
  timestamp: string;
  services: Record<string, string>;
};

type PricingTier = {
  id: string;
  name: string;
  priceMXN: number;
  creem_id: string;
};

type Sphere = {
  id: string;
  name: string;
  role: string;
  locale: string;
  color: string;
};

type Tool = {
  id: string;
  name: string;
  description: string;
  defaultSphere: string;
  keywords: string[];
};

type CouncilResponse = {
  sphereId: string;
  sphereName: string;
  locale: string;
  color: string;
  response: string;
};

type IntentRoute = {
  route: {
    tool_id: string;
    tool_name: string;
    default_sphere: string;
    confidence: number;
    routing_method: string;
  };
  intent: string;
  agent_id: string;
  timestamp: string;
};

type VoiceResult = {
  id: string;
  text: string;
  voiceId: string;
  audioUrl: string | null;
  duration: number;
  timestamp: string;
};

const DEFAULT_COUNCIL_SPHERES = ["synthia", "alex", "ing-teknos"];

function statusTone(status?: string): "default" | "secondary" | "destructive" {
  if (!status) return "secondary";
  const lower = status.toLowerCase();
  if (lower === "ok" || lower === "ready" || lower === "connected" || lower === "configured") {
    return "default";
  }
  if (lower === "degraded" || lower === "pending" || lower === "unconfigured") {
    return "secondary";
  }
  return "destructive";
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.clients.stats.useQuery();
  const { data: clients, isLoading: clientsLoading } = trpc.clients.list.useQuery();
  const { data: spheres, isLoading: spheresLoading } = trpc.spheres.list.useQuery();
  const { data: tools, isLoading: toolsLoading } = trpc.herald.tools.useQuery();
  const { data: voiceHealth, isLoading: voiceHealthLoading } = trpc.voice.health.useQuery();
  const { data: tiers, isLoading: tiersLoading } = trpc.payments.tiers.useQuery();

  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [backendHealthLoading, setBackendHealthLoading] = useState(true);
  const [selectedSpheres, setSelectedSpheres] = useState<string[]>(DEFAULT_COUNCIL_SPHERES);
  const [councilMessage, setCouncilMessage] = useState("Necesito una prioridad operativa para hoy.");
  const [councilResult, setCouncilResult] = useState<CouncilResponse[] | null>(null);
  const [intentInput, setIntentInput] = useState("Deploy the control panel and verify the backend.");
  const [intentResult, setIntentResult] = useState<IntentRoute | null>(null);
  const [voiceText, setVoiceText] = useState("Resumen ejecutivo del estado del backend.");
  const [voiceResult, setVoiceResult] = useState<VoiceResult | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHealth() {
      try {
        const response = await fetch("/health");
        const payload = (await response.json()) as BackendHealth;
        if (active) {
          setBackendHealth(payload);
        }
      } catch (error) {
        if (active) {
          setBackendHealth({
            status: "error",
            version: "unknown",
            port: "unknown",
            timestamp: new Date().toISOString(),
            services: {
              health: error instanceof Error ? error.message : "Unable to reach backend health endpoint",
            },
          });
        }
      } finally {
        if (active) {
          setBackendHealthLoading(false);
        }
      }
    }

    void loadHealth();

    return () => {
      active = false;
    };
  }, []);

  const councilMutation = trpc.spheres.council.useMutation();
  const dispatchMutation = trpc.herald.dispatch.useMutation();
  const synthMutation = trpc.voice.synthesize.useMutation();

  const toggleSphere = (sphereId: string) => {
    setSelectedSpheres(current =>
      current.includes(sphereId)
        ? current.filter(id => id !== sphereId)
        : [...current, sphereId]
    );
  };

  const runCouncil = async () => {
    if (!councilMessage.trim() || selectedSpheres.length === 0) {
      toast.error("Select at least one sphere and add a message.");
      return;
    }

    try {
      const result = await councilMutation.mutateAsync({
        message: councilMessage,
        history: [],
        sphereIds: selectedSpheres,
      });
      setCouncilResult(result.responses as CouncilResponse[]);
      toast.success("Council responses received.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Council dispatch failed.");
    }
  };

  const runDispatch = async () => {
    if (!intentInput.trim()) {
      toast.error("Add an intent to route.");
      return;
    }

    try {
      const result = await dispatchMutation.mutateAsync({
        intent: intentInput,
        agent_id: "synthia",
        execute: false,
      });
      setIntentResult(result as IntentRoute);
      toast.success("Intent routed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Intent routing failed.");
    }
  };

  const runVoice = async () => {
    if (!voiceText.trim()) {
      toast.error("Add text to synthesize.");
      return;
    }

    try {
      const result = await synthMutation.mutateAsync({
        text: voiceText,
        voiceId: "synthia-primary",
        language: "es",
      });
      setVoiceResult(result as VoiceResult);
      toast.success("Voice job prepared.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Voice synthesis failed.");
    }
  };

  const availableSpheres = spheres ?? [];
  const availableTools = tools ?? [];
  const availableTiers = tiers ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Panel de Control</h1>
            <p className="max-w-2xl text-muted-foreground">
              Observa el backend, dirige el consejo de agentes y verifica la configuracion real
              del sistema antes de tocar clientes o pagos.
            </p>
          </div>
          <Button
            className="gradient-teal-purple text-white font-semibold"
            onClick={() => {
              window.location.href = "/onboarding";
            }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Backend
                </CardTitle>
                <Server className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-foreground">
                    {backendHealthLoading ? "..." : backendHealth?.status ?? "unknown"}
                  </div>
                  <Badge variant={statusTone(backendHealth?.status)}>
                    {backendHealthLoading ? "checking" : backendHealth?.status ?? "unknown"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {backendHealth?.timestamp
                    ? new Date(backendHealth.timestamp).toLocaleString("es-MX")
                    : "Esperando respuesta del health endpoint"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-secondary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Spheres
                </CardTitle>
                <Bot className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {spheresLoading ? "..." : availableSpheres.length}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Agentes disponibles en el consejo
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Voice
                </CardTitle>
                <Mic className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {voiceHealthLoading ? "..." : voiceHealth?.status ?? "unknown"}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Providers configurados en tiempo real
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tiers
                </CardTitle>
                <Gauge className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {tiersLoading ? "..." : availableTiers.length}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Planes de pago y IDs de Creem
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Observed Backend
              </CardTitle>
              <CardDescription>
                Estado real del servicio HTTP y de sus dependencias de runtime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Version</div>
                  <div className="mt-1 font-medium">{backendHealth?.version ?? "unknown"}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Port</div>
                  <div className="mt-1 font-medium">{backendHealth?.port ?? "unknown"}</div>
                </div>
              </div>

              <div className="space-y-2">
                {backendHealthLoading ? (
                  <div className="text-sm text-muted-foreground">Checking health endpoint...</div>
                ) : backendHealth ? (
                  Object.entries(backendHealth.services).map(([service, value]) => (
                    <div key={service} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <span className="text-sm font-medium capitalize">{service}</span>
                      <Badge variant={statusTone(value)}>{value}</Badge>
                    </div>
                  ))
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Secret Wiring
              </CardTitle>
              <CardDescription>
                What the runtime sees from its configured providers and product IDs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(voiceHealth?.providers ?? {}).map(([provider, state]) => (
                  <div key={provider} className="rounded-lg border p-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{provider}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={statusTone(state)}>{state}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {availableTiers.map(tier => (
                  <div key={tier.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <div className="text-sm font-medium">{tier.name}</div>
                      <div className="text-xs text-muted-foreground">${tier.priceMXN.toLocaleString("es-MX")} MXN</div>
                    </div>
                    <code className="max-w-[50%] truncate text-xs text-muted-foreground">{tier.creem_id}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Council Dispatch
              </CardTitle>
              <CardDescription>
                Send a message to multiple spheres and compare their responses side by side.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {availableSpheres.length > 0 ? (
                  availableSpheres.map(sphere => {
                    const selected = selectedSpheres.includes(sphere.id);
                    return (
                      <Button
                        key={sphere.id}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSphere(sphere.id)}
                        className="gap-2"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sphere.color }} />
                        {sphere.name}
                      </Button>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground">Loading sphere registry...</div>
                )}
              </div>

              <Textarea
                value={councilMessage}
                onChange={event => setCouncilMessage(event.target.value)}
                className="min-h-28"
                placeholder="Describe the decision or update you want the council to work through."
              />

              <div className="flex items-center gap-3">
                <Button onClick={runCouncil} disabled={councilMutation.isPending}>
                  <Send className="mr-2 h-4 w-4" />
                  {councilMutation.isPending ? "Dispatching..." : "Consult Council"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedSpheres.length} sphere(s) selected
                </span>
              </div>

              {councilResult && (
                <div className="space-y-3">
                  {councilResult.map(response => (
                    <div key={response.sphereId} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="font-medium">{response.sphereName}</div>
                        <Badge variant="outline">{response.locale}</Badge>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{response.response}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Tools and Routing
              </CardTitle>
              <CardDescription>
                Translate plain language into an operational route.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={intentInput}
                onChange={event => setIntentInput(event.target.value)}
                className="min-h-28"
                placeholder="Example: launch the onboarding flow and prepare a report for the owner."
              />
              <Button onClick={runDispatch} className="w-full" disabled={dispatchMutation.isPending}>
                <Wand2 className="mr-2 h-4 w-4" />
                {dispatchMutation.isPending ? "Routing..." : "Dispatch Intent"}
              </Button>

              {intentResult && (
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Route</div>
                  <div className="font-medium">{intentResult.route.tool_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Default sphere: {intentResult.route.default_sphere}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {(intentResult.route.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">Registered tools</div>
                <div className="space-y-2">
                  {toolsLoading ? (
                    <div className="text-sm text-muted-foreground">Loading tools...</div>
                  ) : (
                    availableTools.map((tool: Tool) => (
                      <div key={tool.id} className="rounded-lg border px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{tool.name}</span>
                          <Badge variant="outline">{tool.defaultSphere}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Synthesis
              </CardTitle>
              <CardDescription>
                Validate the voice layer and check the configured providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={voiceText}
                onChange={event => setVoiceText(event.target.value)}
                className="min-h-24"
                placeholder="Write the text to synthesize."
              />
              <div className="flex items-center gap-3">
                <Button onClick={runVoice} disabled={synthMutation.isPending}>
                  <Mic className="mr-2 h-4 w-4" />
                  {synthMutation.isPending ? "Synthesizing..." : "Prepare Voice Job"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {voiceHealthLoading ? "Checking providers..." : "Voice providers observed above"}
                </span>
              </div>

              {voiceResult && (
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="font-medium">{voiceResult.voiceId}</div>
                    <Badge variant="outline">{Math.ceil(voiceResult.duration / 1000)}s</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{voiceResult.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Agent Registry
              </CardTitle>
              <CardDescription>
                Live list of spheres registered by the backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableSpheres.length === 0 ? (
                <div className="text-sm text-muted-foreground">Loading sphere registry...</div>
              ) : (
                availableSpheres.map(sphere => (
                  <div key={sphere.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{sphere.name}</div>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sphere.color }} />
                    </div>
                    <div className="text-xs text-muted-foreground">{sphere.role}</div>
                    <div className="text-xs text-muted-foreground">{sphere.locale}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Recientes</CardTitle>
            <CardDescription>
              Lista de todos los clientes registrados en la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientsLoading ? (
              <div className="py-8 text-center text-muted-foreground">Cargando clientes...</div>
            ) : !clients || clients.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No hay clientes registrados aun.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Negocio
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Propietario
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Fecha de Registro
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client.id} className="border-b border-border transition-colors hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {client.businessName}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {client.ownerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {client.email}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                              client.status === "active"
                                ? "bg-primary/20 text-primary"
                                : client.status === "pending"
                                ? "bg-accent/20 text-accent"
                                : client.status === "paused"
                                ? "bg-secondary/20 text-secondary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {client.status === "active"
                              ? "Activo"
                              : client.status === "pending"
                              ? "Pendiente"
                              : client.status === "paused"
                              ? "Pausado"
                              : "Cancelado"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(client.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.location.href = `/onboarding/pairing/${client.id}`;
                            }}
                          >
                            Ver Detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
