import { Link } from "wouter";
import { Sparkles, MessageCircle, Mic, Palette, Briefcase, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function Home() {
  const { t } = useLanguage();

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

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageToggle />
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
                {t('hero.title')}
                <span className="ia-shimmer">{t('hero.ia')}</span>
              </span>
              <span className="tm-symbol">{t('hero.tm')}</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-cyan-300/90 mb-4 font-light tracking-wide">
            {t('hero.subtitle')}
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                {t('hero.cta.primary')}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/control">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
              >
                Panel de control
              </Button>
            </Link>
            <Link href="/skills">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
              >
                {t('hero.cta.secondary')}
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
            <span>{t('footer.built')}</span>
            <img src="/kupuri-logo.png" alt="Kupuri Media Studios" className="h-6 w-auto opacity-60" />
            <span className="font-medium">{t('footer.company')}</span>
          </div>
        </div>

        {/* Descubre más text */}
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <p className="text-slate-400/70 text-sm tracking-widest uppercase">{t('hero.scroll')}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {t('features.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* WhatsApp Feature */}
            <div className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('features.whatsapp.title')}</h3>
              <p className="text-slate-400">{t('features.whatsapp.description')}</p>
            </div>

            {/* Voice Feature */}
            <div className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-secondary transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
              <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('features.voice.title')}</h3>
              <p className="text-slate-400">{t('features.voice.description')}</p>
            </div>

            {/* Design Feature */}
            <div className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">
              <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('features.design.title')}</h3>
              <p className="text-slate-400">{t('features.design.description')}</p>
            </div>

            {/* Business Feature */}
            <div className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('features.business.title')}</h3>
              <p className="text-slate-400">{t('features.business.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2">{t('pricing.basic.name')}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gradient">{t('pricing.basic.price')}</span>
                <span className="text-slate-400">{t('pricing.basic.period')}</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.basic.feature1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.basic.feature2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.basic.feature3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.basic.feature4')}</span>
                </li>
              </ul>
              <Link href="/onboarding">
                <Button className="w-full" variant="outline">
                  {t('pricing.basic.cta')}
                </Button>
              </Link>
            </div>

            {/* Professional Plan (Most Popular) */}
            <div className="relative bg-card/50 backdrop-blur-sm border-2 border-primary rounded-2xl p-8 transform scale-105 shadow-lg shadow-primary/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-1 rounded-full text-sm font-semibold">
                {t('pricing.pro.badge')}
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('pricing.pro.name')}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gradient">{t('pricing.pro.price')}</span>
                <span className="text-slate-400">{t('pricing.pro.period')}</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.pro.feature1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.pro.feature2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.pro.feature3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.pro.feature4')}</span>
                </li>
              </ul>
              <Link href="/onboarding">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  {t('pricing.pro.cta')}
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-secondary transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2">{t('pricing.enterprise.name')}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gradient">{t('pricing.enterprise.price')}</span>
                <span className="text-slate-400">{t('pricing.enterprise.period')}</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.enterprise.feature1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.enterprise.feature2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.enterprise.feature3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{t('pricing.enterprise.feature4')}</span>
                </li>
              </ul>
              <Link href="/onboarding">
                <Button className="w-full" variant="outline">
                  {t('pricing.enterprise.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/kupuri-logo.png" alt="Kupuri Media" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gradient">SYNTHIA™</span>
              </div>
              <p className="text-slate-400 text-sm">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/skills" className="hover:text-primary transition-colors">{t('footer.features')}</Link></li>
                <li><Link href="/#pricing" className="hover:text-primary transition-colors">{t('footer.pricing')}</Link></li>
                <li><Link href="/skills" className="hover:text-primary transition-colors">{t('footer.demo')}</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">{t('footer.company_section')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('footer.careers')}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('footer.terms')}</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-border text-center text-slate-400 text-sm">
            <p>© 2026 SYNTHIA™. {t('footer.rights')}</p>
            <p className="mt-2">{t('footer.built')} <span className="text-primary font-semibold">{t('footer.company')}</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
