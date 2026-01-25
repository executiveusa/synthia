import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

type PricingTier = "basico" | "profesional" | "empresarial";

const PRICING_TIERS = {
  basico: {
    name: "Básico",
    price: "599",
    features: [
      "1,000 mensajes/mes",
      "Respuestas de voz",
      "Soporte por email",
    ],
  },
  profesional: {
    name: "Profesional",
    price: "1,299",
    features: [
      "5,000 mensajes/mes",
      "Voz + diseño de marca",
      "Soporte prioritario",
      "Análisis avanzado",
    ],
  },
  empresarial: {
    name: "Empresarial",
    price: "2,999",
    features: [
      "Mensajes ilimitados",
      "Todas las funciones",
      "Gerente de cuenta dedicado",
      "Personalización completa",
    ],
  },
};

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<PricingTier>("profesional");
  
  // Form state
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");

  const createClientMutation = trpc.clients.create.useMutation({
    onSuccess: (data) => {
      toast.success("¡Cliente creado exitosamente!");
      // Navigate to QR pairing page
      navigate(`/onboarding/pairing/${data.clientId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el cliente");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate business info
      if (!businessName || !ownerName || !email || !phone) {
        toast.error("Por favor completa todos los campos requeridos");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Create client
      createClientMutation.mutate({
        businessName,
        ownerName,
        email,
        phone,
        whatsappNumber: whatsappNumber || undefined,
        businessDescription: businessDescription || undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Bienvenida a SYNTHIA™
            </h1>
            <p className="text-xl text-muted-foreground">
              Configura tu asistente de IA en minutos
            </p>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : "1"}
              </div>
              <span className="hidden sm:inline font-medium">Información</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted-foreground'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
              }`}>
                {step > 2 ? <Check className="w-5 h-5" /> : "2"}
              </div>
              <span className="hidden sm:inline font-medium">Plan</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                {step === 1 ? "Información de tu Negocio" : "Selecciona tu Plan"}
              </CardTitle>
              <CardDescription>
                {step === 1 
                  ? "Cuéntanos sobre tu negocio para personalizar tu asistente"
                  : "Elige el plan que mejor se adapte a tus necesidades"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Nombre del Negocio *</Label>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Ej: Boutique María"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Tu Nombre *</Label>
                        <Input
                          id="ownerName"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Ej: María González"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="maria@ejemplo.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+52 55 1234 5678"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">Número de WhatsApp (opcional)</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+52 55 1234 5678"
                      />
                      <p className="text-sm text-muted-foreground">
                        Si es diferente al teléfono principal
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción del Negocio (opcional)</Label>
                      <Textarea
                        id="description"
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                        placeholder="Describe brevemente tu negocio y qué vendes..."
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <RadioGroup value={selectedTier} onValueChange={(value) => setSelectedTier(value as PricingTier)}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(PRICING_TIERS).map(([key, tier]) => (
                          <Label
                            key={key}
                            htmlFor={key}
                            className={`cursor-pointer transition-all ${
                              selectedTier === key
                                ? 'ring-2 ring-primary'
                                : 'ring-1 ring-border hover:ring-primary/50'
                            }`}
                          >
                            <Card className="border-0">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                                    <div className="mt-2">
                                      <span className="text-3xl font-bold">${tier.price}</span>
                                      <span className="text-muted-foreground ml-1">MXN/mes</span>
                                    </div>
                                  </div>
                                  <RadioGroupItem value={key} id={key} />
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                      <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </Label>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold mb-2">Resumen de tu Selección</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-medium text-foreground">Negocio:</span> {businessName}</p>
                        <p><span className="font-medium text-foreground">Plan:</span> {PRICING_TIERS[selectedTier].name}</p>
                        <p><span className="font-medium text-foreground">Precio:</span> ${PRICING_TIERS[selectedTier].price} MXN/mes</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-between pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={createClientMutation.isPending}
                    >
                      Atrás
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="ml-auto gradient-teal-purple text-white font-semibold"
                    disabled={createClientMutation.isPending}
                  >
                    {createClientMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : step === 1 ? (
                      <>
                        Continuar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Crear Mi Asistente
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
