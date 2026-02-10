/**
 * SYNTHIA Internationalization (i18n) System
 * Bilingual support: Spanish (ES) first, English (EN) second
 * Auto-detects browser language preference
 */

(function() {
    'use strict';

    // Translation dictionary
    const translations = {
        es: {
            // Navigation
            'nav.cta': 'Comenzar Gratis',
            
            // Hero
            'hero.badge': '🚀 Liderando la Revolución IA 2025',
            'hero.headline': 'Tu Co-Founder Digital<br><span class="gradient-text">con Autonomía IA</span>',
            'hero.subheadline': 'Construye, escala y genera ingresos mientras duermes.<br>El único agente AI que recuerda, aprende y actúa por ti.',
            
            // CTA
            'cta.primary': 'Comenzar Gratis',
            'cta.secondary': 'Ver Demo',
            
            // Form
            'form.email': 'tu@email.com',
            'form.note': '🔒 Sin spam. Tus datos están seguros.',
            
            // Agent
            'agent.live': '🤖 3 Agentes activos ahora',
            
            // Scroll
            'scroll.indicator': 'Desliza para más',
            
            // Chat
            'chat.status': 'En línea',
            'chat.greeting': '¡Hola! Soy SYNTHIA. ¿Cómo puedo ayudarte hoy?',
            'chat.footer': 'CO-FOUNDER Philosophy: Revenue Above All',
            'chat.input.placeholder': 'Escribe tu mensaje...',
            'chat.send': 'Enviar',
            
            // Features
            'features.title': '¿Por qué SYNTHIA?',
            'features.1.title': 'Memoria Perfecta',
            'features.1.desc': 'Nunca olvida una conversación. Cada interacción construye sobre la anterior.',
            'features.2.title': 'Velocidad IA',
            'features.2.desc': 'Respuestas en menos de 50ms. Conversaciones naturales instantáneas.',
            'features.3.title': 'Seguridad Enterprise',
            'features.3.desc': 'Cifrado AES-256. Tus datos nunca salen de tu control.',
            'features.4.title': 'Bilingüe Nativo',
            'features.4.desc': 'ES/EN automático. Habla con tus clientes en su idioma.',
            
            // Lead Capture
            'lead.success.title': '¡Bienvenido a SYNTHIA! 🎉',
            'lead.success.message': 'Revisa tu correo electrónico para comenzar tu viaje IA.',
            'lead.error': 'Algo salió mal. Por favor intenta de nuevo.',
            
            // Form validation
            'validation.email.required': 'Por favor ingresa tu correo electrónico',
            'validation.email.invalid': 'Por favor ingresa un correo electrónico válido',
            
            // Chat responses
            'chat.help': 'Puedo ayudarte con:',
            'chat.help.1': '• Información sobre SYNTHIA',
            'chat.help.2': '• Precios y planes',
            'chat.help.3': '• Demos personalizados',
            'chat.help.4': '• Preguntas técnicas',
            
            // Co-Founder messages
            'cofounder.greeting': '¡Hola! Soy Natalie, tu Co-Founder Digital. Estoy aquí para ayudarte a escalar tu negocio con IA.',
            'cofounder.question': '¿Cuál es el mayor desafío de tu negocio hoy?'
        },
        en: {
            // Navigation
            'nav.cta': 'Start Free',
            
            // Hero
            'hero.badge': '🚀 Leading the AI Revolution 2025',
            'hero.headline': 'Your Digital Co-Founder<br><span class="gradient-text">with AI Autonomy</span>',
            'hero.subheadline': 'Build, scale, and generate income while you sleep.<br>The only AI agent that remembers, learns, and acts for you.',
            
            // CTA
            'cta.primary': 'Start Free',
            'cta.secondary': 'Watch Demo',
            
            // Form
            'form.email': 'your@email.com',
            'form.note': '🔒 No spam. Your data is safe.',
            
            // Agent
            'agent.live': '🤖 3 Agents active now',
            
            // Scroll
            'scroll.indicator': 'Scroll for more',
            
            // Chat
            'chat.status': 'Online',
            'chat.greeting': 'Hi! I\'m SYNTHIA. How can I help you today?',
            'chat.footer': 'CO-FOUNDER Philosophy: Revenue Above All',
            'chat.input.placeholder': 'Type your message...',
            'chat.send': 'Send',
            
            // Features
            'features.title': 'Why SYNTHIA?',
            'features.1.title': 'Perfect Memory',
            'features.1.desc': 'Never forgets a conversation. Each interaction builds on the last.',
            'features.2.title': 'AI Speed',
            'features.2.desc': 'Responses in under 50ms. Instant natural conversations.',
            'features.3.title': 'Enterprise Security',
            'features.3.desc': 'AES-256 encryption. Your data never leaves your control.',
            'features.4.title': 'Native Bilingual',
            'features.4.desc': 'Automatic ES/EN. Speak to your customers in their language.',
            
            // Lead Capture
            'lead.success.title': 'Welcome to SYNTHIA! 🎉',
            'lead.success.message': 'Check your email to begin your AI journey.',
            'lead.error': 'Something went wrong. Please try again.',
            
            // Form validation
            'validation.email.required': 'Please enter your email',
            'validation.email.invalid': 'Please enter a valid email',
            
            // Chat responses
            'chat.help': 'I can help you with:',
            'chat.help.1': '• Information about SYNTHIA',
            'chat.help.2': '• Pricing and plans',
            'chat.help.3': '• Personalized demos',
            'chat.help.4': '• Technical questions',
            
            // Co-Founder messages
            'cofounder.greeting': 'Hi! I\'m Natalie, your Digital Co-Founder. I\'m here to help you scale your business with AI.',
            'cofounder.question': 'What\'s the biggest challenge for your business today?'
        }
    };

    // Current language state
    let currentLang = 'es';
    let langStorageKey = 'synthia-lang';
    let onLanguageChangeCallbacks = [];

    /**
     * Initialize the i18n system
     */
    function init() {
        // Detect stored preference or browser language
        const storedLang = localStorage.getItem(langStorageKey);
        
        if (storedLang && ['es', 'en'].includes(storedLang)) {
            currentLang = storedLang;
        } else {
            // Auto-detect from browser
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('en')) {
                currentLang = 'en';
            }
        }

        // Apply translations
        applyTranslations();

        // Set up language switchers
        setupLanguageSwitchers();

        console.log(`[i18n] Initialized with language: ${currentLang}`);
    }

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    function applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(el => {
            const key = el.dataset.i18n;
            const translation = getTranslation(key);
            
            if (translation) {
                // Check for nested HTML (like spans with gradient-text)
                if (el.innerHTML.includes('<span') && translation.includes('<span')) {
                    el.innerHTML = translation;
                } else if (el.dataset.i18nPlaceholder) {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Apply to elements with data-i18n-placeholder
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const translation = getTranslation(key);
            if (translation) {
                el.placeholder = translation;
            }
        });

        // Update lang attribute on html
        document.documentElement.lang = currentLang;
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key (e.g., 'hero.headline')
     * @returns {string|null} Translation or null if not found
     */
    function getTranslation(key) {
        const keys = key.split('.');
        let value = translations[currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return typeof value === 'string' ? value : null;
    }

    /**
     * Check if a translation key exists
     * @param {string} key - Translation key
     * @returns {boolean}
     */
    function hasTranslation(key) {
        return getTranslation(key) !== null;
    }

    /**
     * Set the current language
     * @param {string} lang - Language code ('es' or 'en')
     */
    function setLanguage(lang) {
        if (!['es', 'en'].includes(lang)) {
            console.warn(`[i18n] Unknown language: ${lang}`);
            return;
        }

        currentLang = lang;
        localStorage.setItem(langStorageKey, lang);
        
        // Apply translations
        applyTranslations();

        // Update language switchers
        updateLanguageSwitchers();

        // Notify callbacks
        notifyLanguageChange(lang);

        console.log(`[i18n] Language changed to: ${lang}`);
    }

    /**
     * Get current language
     * @returns {string}
     */
    function getLanguage() {
        return currentLang;
    }

    /**
     * Toggle between languages
     */
    function toggleLanguage() {
        const newLang = currentLang === 'es' ? 'en' : 'es';
        setLanguage(newLang);
    }

    /**
     * Set up language switcher buttons
     */
    function setupLanguageSwitchers() {
        const switchers = document.querySelectorAll('.lang-switch button, [data-lang-switch]');
        
        switchers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.dataset.lang;
                if (lang) {
                    setLanguage(lang);
                }
            });
        });

        updateLanguageSwitchers();
    }

    /**
     * Update active state on language switchers
     */
    function updateLanguageSwitchers() {
        const switchers = document.querySelectorAll('.lang-switch button, [data-lang-switch]');
        
        switchers.forEach(btn => {
            if (btn.dataset.lang === currentLang) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });
    }

    /**
     * Register callback for language change
     * @param {Function} callback - Callback function
     */
    function onLanguageChange(callback) {
        if (typeof callback === 'function') {
            onLanguageChangeCallbacks.push(callback);
        }
    }

    /**
     * Notify all callbacks of language change
     * @param {string} lang - New language
     */
    function notifyLanguageChange(lang) {
        onLanguageChangeCallbacks.forEach(callback => {
            try {
                callback(lang);
            } catch (error) {
                console.error('[i18n] Callback error:', error);
            }
        });
    }

    /**
     * Get all translations for current language
     * @returns {Object}
     */
    function getAllTranslations() {
        return translations[currentLang] || {};
    }

    /**
     * Add or update translations dynamically
     * @param {Object} newTranslations - New translations to add
     * @param {string} lang - Language to update ('es' or 'en')
     */
    function addTranslations(newTranslations, lang = currentLang) {
        if (!translations[lang]) {
            translations[lang] = {};
        }
        
        Object.assign(translations[lang], newTranslations);
        
        // Apply if current language
        if (lang === currentLang) {
            applyTranslations();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API globally
    window.SynthiaI18n = {
        setLanguage,
        getLanguage,
        toggleLanguage,
        getTranslation,
        hasTranslation,
        onLanguageChange,
        getAllTranslations,
        addTranslations,
        translations
    };

})();
