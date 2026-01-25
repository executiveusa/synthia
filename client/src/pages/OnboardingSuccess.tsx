import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, MessageSquare, Palette, BarChart3, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function OnboardingSuccess() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full gradient-teal-purple flex items-center justify-center mx-auto mb-6 glow-teal">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            ¡Felicidades!
          </h1>
          <p className="text-xl text-muted-foreground">
            Tu asistente SYNTHIA™ está listo para usar
          </p>
        </motion.div>

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6 space-y-6">
              {/* What's Next */}
              <div>
                <h2 className="text-2xl font-bold mb-4">¿Qué sigue?</h2>
                <p className="text-muted-foreground mb-6">
                  Tu asistente de IA ya está conectado a tu WhatsApp. Aquí hay algunas cosas que puedes hacer:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Feature 1 */}
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="w-12 h-12 rounded-lg gradient-teal-purple flex items-center justify-center mb-3">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Envía Mensajes</h3>
                    <p className="text-sm text-muted-foreground">
                      Prueba enviando un mensaje de WhatsApp a tu número vinculado
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="w-12 h-12 rounded-lg gradient-purple-coral flex items-center justify-center mb-3">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Diseña tu Marca</h3>
                    <p className="text-sm text-muted-foreground">
                      Pide ayuda con logos, colores y materiales de marca
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-3">
                      <BarChart3 className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Gestiona Clientes</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatiza citas, seguimientos y tareas repetitivas
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                  Consejos Rápidos
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Puedes enviar mensajes de texto o de voz - SYNTHIA™ entiende ambos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Habla naturalmente en español mexicano - tu asistente está optimizada para entenderte
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Si SYNTHIA™ no está segura de algo, te lo dirá y buscará la información correcta
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Revisa tu panel de control para ver estadísticas de uso y mensajes
                    </span>
                  </li>
                </ul>
              </div>

              {/* Example Messages */}
              <div>
                <h3 className="font-semibold mb-3">Mensajes de Ejemplo para Probar</h3>
                <div className="space-y-2">
                  <div className="bg-muted/50 rounded-lg p-3 border border-border text-sm">
                    <span className="text-muted-foreground">💬</span>{" "}
                    <span className="text-foreground">"Hola SYNTHIA, ¿puedes ayudarme a crear un logo?"</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border text-sm">
                    <span className="text-muted-foreground">💬</span>{" "}
                    <span className="text-foreground">"¿Qué colores recomiendas para mi marca de joyería?"</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border text-sm">
                    <span className="text-muted-foreground">💬</span>{" "}
                    <span className="text-foreground">"Ayúdame a redactar un mensaje para mis clientes"</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/")}
                  className="gradient-teal-purple text-white font-semibold flex-1"
                >
                  Ir al Inicio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => window.open("https://wa.me/", "_blank")}
                  variant="outline"
                  className="flex-1"
                >
                  Abrir WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          ¿Tienes preguntas? Contáctanos en{" "}
          <a href="mailto:soporte@kupurimedia.com" className="text-primary hover:underline">
            soporte@kupurimedia.com
          </a>
        </div>
      </div>
    </div>
  );
}
