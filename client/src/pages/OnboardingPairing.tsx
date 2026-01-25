import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Loader2, RefreshCw, Smartphone, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPairing() {
  const [, params] = useRoute("/onboarding/pairing/:clientId");
  const [, navigate] = useLocation();
  const clientId = params?.clientId ? parseInt(params.clientId) : null;

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Get client details
  const { data: client } = trpc.clients.getById.useQuery(
    { id: clientId! },
    { enabled: !!clientId }
  );

  // Initialize Clawdbot instance
  const initializeMutation = trpc.clawdbot.initialize.useMutation({
    onSuccess: () => {
      toast.success("Instancia inicializada");
      generateQRMutation.mutate({ clientId: clientId! });
    },
    onError: (error) => {
      toast.error(error.message || "Error al inicializar");
      setIsInitializing(false);
    },
  });

  // Generate QR code
  const generateQRMutation = trpc.clawdbot.generateQR.useMutation({
    onSuccess: (data) => {
      if (data.success && data.qrCode) {
        setQrCode(data.qrCode);
        setIsInitializing(false);
      } else {
        toast.error(data.message || "Error al generar código QR");
        setIsInitializing(false);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error al generar código QR");
      setIsInitializing(false);
    },
  });

  // Initialize on mount
  useEffect(() => {
    if (clientId && client) {
      initializeMutation.mutate({
        clientId,
        businessName: client.businessName,
        whatsappNumber: client.whatsappNumber || undefined,
      });
    }
  }, [clientId, client]);

  // Regenerate QR code
  const handleRegenerateQR = () => {
    if (clientId) {
      setIsInitializing(true);
      generateQRMutation.mutate({ clientId });
    }
  };

  // Simulate pairing success (in production, this would be detected by Clawdbot)
  const handleSimulatePairing = () => {
    setIsPaired(true);
    toast.success("¡WhatsApp conectado exitosamente!");
    setTimeout(() => {
      navigate("/onboarding/success");
    }, 2000);
  };

  if (!clientId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>ID de cliente no válido</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/onboarding")}>
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Conecta tu WhatsApp
            </h1>
            <p className="text-xl text-muted-foreground">
              Escanea el código QR para vincular tu cuenta
            </p>
          </motion.div>
        </div>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-primary" />
                Vinculación de WhatsApp
              </CardTitle>
              <CardDescription>
                Sigue estos pasos para conectar SYNTHIA™ a tu WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="font-semibold mb-3">Instrucciones:</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">1.</span>
                    <span>Abre WhatsApp en tu teléfono</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Toca <strong>Menú</strong> o <strong>Configuración</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">3.</span>
                    <span>Selecciona <strong>Dispositivos vinculados</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">4.</span>
                    <span>Toca <strong>Vincular un dispositivo</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">5.</span>
                    <span>Escanea el código QR de abajo</span>
                  </li>
                </ol>
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center py-8">
                {isInitializing ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Generando código QR...</p>
                  </div>
                ) : isPaired ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Check className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        ¡Conectado!
                      </h3>
                      <p className="text-muted-foreground">
                        Tu WhatsApp está vinculado correctamente
                      </p>
                    </div>
                  </motion.div>
                ) : qrCode ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border-4 border-primary/20">
                      <img
                        src={qrCode}
                        alt="QR Code para WhatsApp"
                        className="w-64 h-64"
                      />
                    </div>
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateQR}
                        disabled={generateQRMutation.isPending}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerar Código
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                    <p className="text-muted-foreground">
                      No se pudo generar el código QR
                    </p>
                    <Button onClick={handleRegenerateQR}>
                      Intentar de Nuevo
                    </Button>
                  </div>
                )}
              </div>

              {/* Important Note */}
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">Importante</h4>
                    <p className="text-sm text-muted-foreground">
                      El código QR expira después de 60 segundos. Si no lo escaneas a tiempo, 
                      haz clic en "Regenerar Código" para obtener uno nuevo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/onboarding")}
                  disabled={isPaired}
                >
                  Cancelar
                </Button>
                {/* Temporary button for demo purposes */}
                {!isPaired && qrCode && (
                  <Button
                    onClick={handleSimulatePairing}
                    className="gradient-teal-purple text-white font-semibold"
                  >
                    Simular Conexión (Demo)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Text */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          ¿Necesitas ayuda? Contáctanos en{" "}
          <a href="mailto:soporte@kupurimedia.com" className="text-primary hover:underline">
            soporte@kupurimedia.com
          </a>
        </div>
      </div>
    </div>
  );
}
