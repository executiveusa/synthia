import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Hero Section
    'hero.title': 'SYNTH',
    'hero.ia': 'IA',
    'hero.tm': '™',
    'hero.subtitle': 'Tu Asistente de IA por WhatsApp',
    'hero.description': 'Potencia tu negocio con inteligencia artificial que habla, escucha y entiende. Diseñado para emprendedoras mexicanas.',
    'hero.cta.primary': 'Comenzar Ahora',
    'hero.cta.secondary': 'Ver Demostración',
    'hero.scroll': 'DESCUBRE MÁS',

    // Features Section
    'features.title': 'Características Poderosas',
    'features.subtitle': 'Todo lo que necesitas para transformar tu negocio',
    'features.whatsapp.title': 'WhatsApp Nativo',
    'features.whatsapp.description': 'Conecta directamente con tus clientes en la plataforma que ya usan todos los días.',
    'features.voice.title': 'Voz en Español',
    'features.voice.description': 'Asistente de voz en español mexicano con ElevenLabs para conversaciones naturales.',
    'features.design.title': 'Asistencia de Diseño',
    'features.design.description': 'Ayuda con colores, marca, layouts y diseño visual para tu negocio.',
    'features.business.title': 'Herramientas de Negocio',
    'features.business.description': 'Gestión de clientes, agenda, seguimiento de leads y más.',

    // Pricing Section
    'pricing.title': 'Planes y Precios',
    'pricing.subtitle': 'Elige el plan perfecto para tu negocio',
    'pricing.basic.name': 'Básico',
    'pricing.basic.price': '$599',
    'pricing.basic.period': '/mes MXN',
    'pricing.basic.feature1': 'WhatsApp Business',
    'pricing.basic.feature2': 'Respuestas automáticas',
    'pricing.basic.feature3': 'Hasta 100 clientes',
    'pricing.basic.feature4': 'Soporte por email',
    'pricing.basic.cta': 'Comenzar',
    'pricing.pro.name': 'Profesional',
    'pricing.pro.price': '$1,299',
    'pricing.pro.period': '/mes MXN',
    'pricing.pro.feature1': 'Todo en Básico',
    'pricing.pro.feature2': 'Asistente de voz',
    'pricing.pro.feature3': 'Clientes ilimitados',
    'pricing.pro.feature4': 'Soporte prioritario',
    'pricing.pro.badge': 'Más Popular',
    'pricing.pro.cta': 'Comenzar',
    'pricing.enterprise.name': 'Empresarial',
    'pricing.enterprise.price': '$2,999',
    'pricing.enterprise.period': '/mes MXN',
    'pricing.enterprise.feature1': 'Todo en Profesional',
    'pricing.enterprise.feature2': 'Múltiples asistentes',
    'pricing.enterprise.feature3': 'Integraciones personalizadas',
    'pricing.enterprise.feature4': 'Gerente de cuenta dedicado',
    'pricing.enterprise.cta': 'Contactar',

    // Footer
    'footer.built': 'Desarrollado por',
    'footer.company': 'Kupuri Media Studios',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.product': 'Producto',
    'footer.company_section': 'Empresa',
    'footer.legal': 'Legal',
    'footer.features': 'Características',
    'footer.pricing': 'Precios',
    'footer.demo': 'Demostración',
    'footer.about': 'Acerca de',
    'footer.contact': 'Contacto',
    'footer.careers': 'Carreras',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',

    // Skills Marketplace
    'skills.title': 'Marketplace de Habilidades',
    'skills.subtitle': 'Descubre y activa habilidades para tu asistente',
    'skills.search': 'Buscar habilidades...',
    'skills.all': 'Todas',
    'skills.loading': 'Cargando habilidades...',
    'skills.error': 'Error al cargar habilidades',
    'skills.activate': 'Activar',
    'skills.learn_more': 'Más información',

    // Admin Dashboard
    'admin.title': 'Panel de Administración',
    'admin.clients': 'Clientes',
    'admin.revenue': 'Ingresos',
    'admin.subscriptions': 'Suscripciones',
    'admin.active_clients': 'Clientes Activos',
    'admin.total_clients': 'Total de Clientes',
    'admin.view_all': 'Ver todos',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
  },
  en: {
    // Hero Section
    'hero.title': 'SYNTH',
    'hero.ia': 'IA',
    'hero.tm': '™',
    'hero.subtitle': 'Your AI Assistant via WhatsApp',
    'hero.description': 'Power your business with artificial intelligence that speaks, listens, and understands. Designed for entrepreneurs.',
    'hero.cta.primary': 'Get Started',
    'hero.cta.secondary': 'View Demo',
    'hero.scroll': 'DISCOVER MORE',

    // Features Section
    'features.title': 'Powerful Features',
    'features.subtitle': 'Everything you need to transform your business',
    'features.whatsapp.title': 'WhatsApp Native',
    'features.whatsapp.description': 'Connect directly with your customers on the platform they use every day.',
    'features.voice.title': 'Voice in Spanish',
    'features.voice.description': 'Voice assistant in Mexican Spanish with ElevenLabs for natural conversations.',
    'features.design.title': 'Design Assistance',
    'features.design.description': 'Help with colors, branding, layouts, and visual design for your business.',
    'features.business.title': 'Business Tools',
    'features.business.description': 'Client management, scheduling, lead tracking, and more.',

    // Pricing Section
    'pricing.title': 'Plans & Pricing',
    'pricing.subtitle': 'Choose the perfect plan for your business',
    'pricing.basic.name': 'Basic',
    'pricing.basic.price': '$599',
    'pricing.basic.period': '/mo MXN',
    'pricing.basic.feature1': 'WhatsApp Business',
    'pricing.basic.feature2': 'Automated responses',
    'pricing.basic.feature3': 'Up to 100 clients',
    'pricing.basic.feature4': 'Email support',
    'pricing.basic.cta': 'Get Started',
    'pricing.pro.name': 'Professional',
    'pricing.pro.price': '$1,299',
    'pricing.pro.period': '/mo MXN',
    'pricing.pro.feature1': 'Everything in Basic',
    'pricing.pro.feature2': 'Voice assistant',
    'pricing.pro.feature3': 'Unlimited clients',
    'pricing.pro.feature4': 'Priority support',
    'pricing.pro.badge': 'Most Popular',
    'pricing.pro.cta': 'Get Started',
    'pricing.enterprise.name': 'Enterprise',
    'pricing.enterprise.price': '$2,999',
    'pricing.enterprise.period': '/mo MXN',
    'pricing.enterprise.feature1': 'Everything in Professional',
    'pricing.enterprise.feature2': 'Multiple assistants',
    'pricing.enterprise.feature3': 'Custom integrations',
    'pricing.enterprise.feature4': 'Dedicated account manager',
    'pricing.enterprise.cta': 'Contact Us',

    // Footer
    'footer.built': 'Built by',
    'footer.company': 'Kupuri Media Studios',
    'footer.rights': 'All rights reserved.',
    'footer.product': 'Product',
    'footer.company_section': 'Company',
    'footer.legal': 'Legal',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.demo': 'Demo',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.careers': 'Careers',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',

    // Skills Marketplace
    'skills.title': 'Skills Marketplace',
    'skills.subtitle': 'Discover and activate skills for your assistant',
    'skills.search': 'Search skills...',
    'skills.all': 'All',
    'skills.loading': 'Loading skills...',
    'skills.error': 'Error loading skills',
    'skills.activate': 'Activate',
    'skills.learn_more': 'Learn more',

    // Admin Dashboard
    'admin.title': 'Admin Dashboard',
    'admin.clients': 'Clients',
    'admin.revenue': 'Revenue',
    'admin.subscriptions': 'Subscriptions',
    'admin.active_clients': 'Active Clients',
    'admin.total_clients': 'Total Clients',
    'admin.view_all': 'View all',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage for saved language preference
    const saved = localStorage.getItem('synthia-language');
    return (saved === 'en' || saved === 'es') ? saved : 'es'; // Default to Spanish
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('synthia-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
