import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Mic, Palette, BarChart3, ArrowRight, Sparkles } from "lucide-react";

/**
 * SYNTHIA™ Landing Page
 * Premium AI WhatsApp Assistant for Mexican Women Entrepreneurs
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section with Mexico City Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/mexico-city-night.jpg')" }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
          {/* Hexagon pattern overlay */}
          <div className="absolute inset-0 pattern-hexagon opacity-30" />
          {/* Radial gradient glow */}
          <div className="absolute inset-0 gradient-radial-teal" />
        </div>

        {/* Kupuri Media Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 left-8 z-20"
        >
          <img 
            src="/kupuri-logo.jpg" 
            alt="Kupuri Media" 
            className="h-16 w-auto rounded-lg shadow-lg glow-teal"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Sparkle Icon */}
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-accent animate-pulse-glow" />
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-gradient mb-6 font-bold">
              SYNTHIA™
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground mb-4 font-medium"
            >
              Tu Asistente de IA por WhatsApp
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            >
              Potencia tu negocio con inteligencia artificial que habla, escucha y entiende.
              <br />
              <span className="text-primary font-semibold">Diseñado para emprendedoras mexicanas.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                className="gradient-teal-purple text-white font-semibold text-lg px-8 py-6 glow-teal hover:scale-105 transition-transform duration-300 group"
                onClick={() => window.location.href = '/onboarding'}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 py-6 transition-all duration-300"
              >
                Ver Demostración
              </Button>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="mt-12 text-muted-foreground text-sm"
            >
              <p className="flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                Desarrollado por Kupuri Media para emprendedoras mexicanas
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">Descubre más</span>
            <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-gradient mb-4">
              Características Poderosas
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para llevar tu negocio al siguiente nivel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: WhatsApp Native */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
            >
              <div className="w-14 h-14 rounded-xl gradient-teal-purple flex items-center justify-center mb-6 glow-teal group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">WhatsApp Nativo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Conecta directamente con tus clientes en la plataforma que ya usan todos los días.
              </p>
            </motion.div>

            {/* Feature 2: Voice First */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-secondary transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 group"
            >
              <div className="w-14 h-14 rounded-xl gradient-purple-coral flex items-center justify-center mb-6 glow-purple group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Voz en Español</h3>
              <p className="text-muted-foreground leading-relaxed">
                Habla naturalmente en español mexicano. Tu asistente entiende y responde con voz humana.
              </p>
            </motion.div>

            {/* Feature 3: Design Assistant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6 glow-coral group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Asistencia de Diseño</h3>
              <p className="text-muted-foreground leading-relaxed">
                Crea logos, paletas de colores y materiales de marca profesionales al instante.
              </p>
            </motion.div>

            {/* Feature 4: Business Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
            >
              <div className="w-14 h-14 rounded-xl gradient-teal-purple flex items-center justify-center mb-6 glow-teal group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Herramientas de Negocio</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gestiona clientes, agenda citas y automatiza tareas repetitivas sin esfuerzo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-gradient mb-4">
              Planes Accesibles
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige el plan perfecto para tu negocio. Sin sorpresas, sin costos ocultos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border-2 border-border rounded-2xl p-8 hover:border-primary transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-2">Básico</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-primary">$599</span>
                <span className="text-muted-foreground ml-2">MXN/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary/20 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">1,000 mensajes/mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary/20 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Respuestas de voz</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary/20 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Soporte por email</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Comenzar
              </Button>
            </motion.div>

            {/* Professional Plan - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border-2 border-primary rounded-2xl p-8 relative glow-teal transform scale-105"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Más Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Profesional</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gradient">$1,299</span>
                <span className="text-muted-foreground ml-2">MXN/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">5,000 mensajes/mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">Voz + diseño de marca</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">Soporte prioritario</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">Análisis avanzado</span>
                </li>
              </ul>
              <Button className="w-full gradient-teal-purple text-white font-semibold">
                Comenzar Ahora
              </Button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border-2 border-border rounded-2xl p-8 hover:border-secondary transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-2">Empresarial</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-secondary">$2,999</span>
                <span className="text-muted-foreground ml-2">MXN/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-secondary/20 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Mensajes ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-secondary/20 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Todas las funciones</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-secondary/20 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Gerente de cuenta dedicado</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-5 h-5 rounded-full bg-secondary/20 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Personalización completa</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Contactar Ventas
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pattern-hexagon opacity-20" />
        <div className="absolute inset-0 gradient-radial-teal" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-gradient mb-6">
              ¿Lista para Transformar tu Negocio?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Únete a cientos de emprendedoras mexicanas que ya están usando SYNTHIA™ para crecer más rápido.
            </p>
            <Button 
              size="lg" 
              className="gradient-teal-purple text-white font-semibold text-xl px-12 py-8 glow-teal hover:scale-105 transition-transform duration-300"
              onClick={() => window.location.href = '/onboarding'}
            >
              Comenzar Prueba Gratuita
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img src="/kupuri-logo.jpg" alt="Kupuri Media" className="h-10 w-auto rounded" />
              <span className="text-muted-foreground">© 2026 Kupuri Media. Todos los derechos reservados.</span>
            </div>
            <div className="flex gap-6 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
              <a href="#" className="hover:text-primary transition-colors">Términos</a>
              <a href="#" className="hover:text-primary transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
