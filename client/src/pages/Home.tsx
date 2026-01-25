import { Link } from "wouter";
import { Sparkles, MessageCircle, Mic, Palette, Briefcase, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Kupuri Media Logo - Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <img 
          src="/kupuri-logo.png" 
          alt="Kupuri Media" 
          className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Mexico City Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/mexico-city-night.jpg')" }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
        
        {/* Geometric Hexagon Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="hexagon-pattern" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* SYNTHIA Logo with Premium Typography */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tight">
              <span className="synthia-text">
                SYNTH
                <span className="ia-shimmer">IA</span>
              </span>
              <span className="tm-symbol">™</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-cyan-300/90 mb-4 font-light tracking-wide">
            Tu Asistente de IA por WhatsApp
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Potencia tu negocio con inteligencia artificial que habla, escucha y entiende.
            <br />
            <span className="text-cyan-400">Diseñado para emprendedoras mexicanas.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Comenzar Ahora
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/skills">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
              >
                Ver Demostración
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-16">
            <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Kupuri Media Attribution */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-slate-400/60 text-sm">
            <span>Desarrollado por</span>
            <img src="/kupuri-logo.png" alt="Kupuri Media Studios" className="h-6 w-auto opacity-60" />
            <span className="font-medium">Kupuri Media Studios</span>
          </div>
        </div>

        {/* Descubre más text */}
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <p className="text-slate-400/70 text-sm tracking-widest uppercase">Descubre más</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Características Principales
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">WhatsApp Nativo</h3>
                <p className="text-slate-400 leading-relaxed">
                  Integración perfecta con WhatsApp. Tus clientes te contactan como siempre, pero con IA respondiendo 24/7.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Mic className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Voz en Español</h3>
                <p className="text-slate-400 leading-relaxed">
                  Mensajes de voz en español mexicano natural. Tus clientes pueden hablar y recibir respuestas por voz.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palette className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Asistencia de Diseño</h3>
                <p className="text-slate-400 leading-relaxed">
                  Ayuda con colores, branding, layouts y diseño visual para tu negocio. IA creativa a tu servicio.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Herramientas de Negocio</h3>
                <p className="text-slate-400 leading-relaxed">
                  Gestión de citas, seguimiento de clientes, generación de leads y más. Todo desde WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Planes y Precios
          </h2>
          <p className="text-center text-slate-400 mb-16 text-lg">
            Elige el plan perfecto para tu negocio
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Básico</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-cyan-400">$599</span>
                <span className="text-slate-400 ml-2">MXN/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">1,000 mensajes/mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Respuestas de texto</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Soporte por email</span>
                </li>
              </ul>
              <Link href="/onboarding">
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                  Comenzar
                </Button>
              </Link>
            </div>

            {/* Professional Plan (Popular) */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/50 hover:border-cyan-500 transition-all duration-300 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Más Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Profesional</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">$1,299</span>
                <span className="text-slate-400 ml-2">MXN/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">5,000 mensajes/mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Mensajes de voz</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Asistencia de diseño</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Soporte prioritario</span>
                </li>
              </ul>
              <Link href="/onboarding">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
                  Comenzar
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Empresarial</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-purple-400">$2,999</span>
                <span className="text-slate-400 ml-2">MXN/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Mensajes ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Todas las funciones</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Personalización completa</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Soporte 24/7</span>
                </li>
              </ul>
              <Link href="/onboarding">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Comenzar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/kupuri-logo.png" alt="Kupuri Media Studios" className="h-10 w-auto" />
              <div>
                <p className="text-slate-400 text-sm">Desarrollado por</p>
                <p className="text-white font-semibold">Kupuri Media Studios</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2026 SYNTHIA™. Todos los derechos reservados.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Diseñado para emprendedoras mexicanas
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
