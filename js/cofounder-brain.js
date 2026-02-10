/**
 * SYNTHIA Co-Founder Brain
 * Natalie Dawson Persona - Caring, Lifestyle-Focused Leadership
 * Implements CO-FOUNDER philosophy: Revenue Above All
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        personaName: 'Natalie',
        personaTitle: 'Digital Co-Founder',
        philosophy: 'Revenue Above All',
        memoryKey: 'synthia_cofounder_brain'
    };

    // Brain State
    let brainState = {};

    /**
     * Initialize the Co-Founder Brain
     */
    function init() {
        loadState();
        trackVisit();
        
        console.log(`[Co-Founder Brain] ${CONFIG.personaName} initialized`);
        
        return brainState;
    }

    /**
     * Load brain state from memory
     */
    function loadState() {
        try {
            const stored = localStorage.getItem(CONFIG.memoryKey);
            if (stored) {
                brainState = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('[Co-Founder Brain] Failed to load state:', error);
            brainState = {};
        }
    }

    /**
     * Save brain state
     */
    function saveState() {
        try {
            localStorage.setItem(CONFIG.memoryKey, JSON.stringify(brainState));
        } catch (error) {
            console.warn('[Co-Founder Brain] Failed to save state:', error);
        }
    }

    /**
     * Track visitor visit
     */
    function trackVisit() {
        if (!brainState.visits) brainState.visits = 0;
        brainState.visits++;
        brainState.last_visit = new Date().toISOString();
        saveState();
    }

    /**
     * Get personalized greeting
     * @param {string} lang - Language code
     * @returns {string}
     */
    function getGreeting(lang = 'es') {
        const greetings = {
            es: {
                new: '¡Hola! Soy Natalie, tu Co-Founder Digital. 🌸',
                returning: '¡Qué alegría verte de nuevo! 🌟',
                lead: '¡Bienvenido de nuevo, miembro de la familia SYNTHIA! 🎉'
            },
            en: {
                new: 'Hi! I\'m Natalie, your Digital Co-Founder. 🌸',
                returning: 'So happy to see you again! 🌟',
                lead: 'Welcome back, SYNTHIA family member! 🎉'
            }
        };

        const visitor = window.SynthiaMemory?.getProfile();
        const isReturning = visitor?.is_returning;
        const isLead = visitor?.is_lead;

        if (isLead) {
            return greetings[lang].lead;
        } else if (isReturning) {
            return greetings[lang].returning;
        }
        return greetings[lang].new;
    }

    /**
     * Get Co-Founder advice based on context
     * @param {string} context - Context key
     * @param {Object} data - Context data
     * @returns {Object}
     */
    function giveAdvice(context, data = {}) {
        const adviceDatabase = {
            startup: {
                es: {
                    message: '🏗️ Para startups, recuerda: construye lo mínimo viable primero.',
                    revenueAdvice: 'Cada feature debe generar ingresos o reducir churn.',
                    nextStep: 'Identifica tu métrica de éxito principal y optimiza para ella.'
                },
                en: {
                    message: '🏗️ For startups: build minimum viable first.',
                    revenueAdvice: 'Every feature must generate revenue or reduce churn.',
                    nextStep: 'Identify your primary success metric and optimize for it.'
                }
            },
            scaling: {
                es: {
                    message: '📈 Etapa de scaling detectada.',
                    revenueAdvice: 'Automatiza lo que funciona, elimina lo que no.',
                    nextStep: 'Implementa métricas de attribution claras.'
                },
                en: {
                    message: '📈 Scaling stage detected.',
                    revenueAdvice: 'Automate what works, eliminate what doesn\'t.',
                    nextStep: 'Implement clear attribution metrics.'
                }
            },
            conversion: {
                es: {
                    message: '💰 Conversión optimizada = ingresos recurrentes.',
                    revenueAdvice: 'Reduce fricción en cada paso del funnel.',
                    nextStep: 'A/B testea constantemente.'
                },
                en: {
                    message: '💰 Optimized conversion = recurring revenue.',
                    revenueAdvice: 'Reduce friction at every step of the funnel.',
                    nextStep: 'A/B test constantly.'
                }
            }
        };

        const lang = window.SynthiaI18n?.getLanguage() || 'es';
        const advice = adviceDatabase[context] || adviceDatabase.startup;

        return {
            persona: CONFIG.personaName,
            context,
            ...advice[lang],
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Qualify a lead
     * @param {Object} leadData - Lead information
     * @returns {Object}
     */
    function qualifyLead(leadData) {
        let score = 0;
        const maxScore = 100;
        const factors = [];

        // Budget factor
        if (leadData.budget) {
            if (leadData.budget >= 1000) {
                score += 30;
                factors.push({ name: 'budget', value: 'high', points: 30 });
            } else if (leadData.budget >= 100) {
                score += 15;
                factors.push({ name: 'budget', value: 'medium', points: 15 });
            }
        }

        // Timeline factor
        if (leadData.timeline) {
            if (leadData.timeline === 'immediate') {
                score += 25;
                factors.push({ name: 'timeline', value: 'immediate', points: 25 });
            } else if (leadData.timeline === 'short') {
                score += 15;
                factors.push({ name: 'timeline', value: 'short', points: 15 });
            }
        }

        // Authority factor (decision maker)
        if (leadData.authority) {
            score += 25;
            factors.push({ name: 'authority', value: 'decision_maker', points: 25 });
        }

        // Need factor
        if (leadData.need) {
            score += 20;
            factors.push({ name: 'need', value: 'clear_need', points: 20 });
        }

        // Determine category
        let category, recommendation, nextAction;

        if (score >= 75) {
            category = 'hot';
            recommendation = 'Hot lead - Schedule call immediately';
            nextAction = 'Personal outreach within 1 hour';
        } else if (score >= 50) {
            category = 'warm';
            recommendation = 'Warm lead - Nurture sequence';
            nextAction = 'Add to email sequence, follow up in 3 days';
        } else {
            category = 'cold';
            recommendation = 'Cold lead - Content nurturing';
            nextAction = 'Add to newsletter, retargeting campaign';
        }

        const result = {
            lead_id: leadData.id || generateId(),
            score,
            max_score: maxScore,
            category,
            recommendation,
            next_action: nextAction,
            factors,
            qualified_at: new Date().toISOString(),
            persona: CONFIG.personaName
        };

        // Save to brain
        if (!brainState.qualified_leads) brainState.qualified_leads = [];
        brainState.qualified_leads.push(result);
        saveState();

        return result;
    }

    /**
     * Generate revenue recommendations
     * @param {Object} context - Business context
     * @returns {Array}
     */
    function getRevenueRecommendations(context) {
        const lang = window.SynthiaI18n?.getLanguage() || 'es';

        const recommendations = [
            {
                id: 'lead-gen',
                priority: 1,
                title: lang === 'es' ? 'Optimizar Lead Generation' : 'Optimize Lead Generation',
                impact: 'high',
                effort: 'medium',
                revenue_potential: '+25-40%',
                action: lang === 'es' 
                    ? 'Implementar exit-intent popups y content upgrades'
                    : 'Implement exit-intent popups and content upgrades'
            },
            {
                id: 'conversion',
                priority: 2,
                title: lang === 'es' ? 'Mejorar Conversion Rate' : 'Improve Conversion Rate',
                impact: 'high',
                effort: 'low',
                revenue_potential: '+15-25%',
                action: lang === 'es'
                    ? 'Simplificar checkout y añadir trust badges'
                    : 'Simplify checkout and add trust badges'
            },
            {
                id: 'retention',
                priority: 3,
                title: lang === 'es' ? 'Aumentar Retención' : 'Increase Retention',
                impact: 'medium',
                effort: 'high',
                revenue_potential: '+20-30%',
                action: lang === 'es'
                    ? 'Implementar email automation y loyalty program'
                    : 'Implement email automation and loyalty program'
            }
        ];

        return recommendations;
    }

    /**
     * Get brain insights
     * @returns {Object}
     */
    function getInsights() {
        const visitor = window.SynthiaMemory?.getProfile();
        const session = window.SynthiaMemory?.getSession();

        return {
            persona: CONFIG.personaName,
            philosophy: CONFIG.philosophy,
            visitor_insights: {
                visit_count: visitor?.visit_count || 0,
                is_returning: visitor?.is_returning || false,
                is_lead: visitor?.is_lead || false,
                days_since_first_visit: visitor?.days_since_first_visit || 0
            },
            session_insights: {
                duration_seconds: session?.duration || 0,
                page_views: session?.page_views || 0
            },
            brain_insights: {
                qualified_leads_count: brainState.qualified_leads?.length || 0,
                total_visits: brainState.visits || 0
            }
        };
    }

    /**
     * Track business milestone
     * @param {string} milestone - Milestone name
     * @param {Object} data - Milestone data
     */
    function trackMilestone(milestone, data = {}) {
        if (!brainState.milestones) brainState.milestones = [];
        
        brainState.milestones.push({
            milestone,
            data,
            achieved_at: new Date().toISOString()
        });
        
        saveState();
    }

    /**
     * Get personalized recommendations based on visitor behavior
     * @returns {Array}
     */
    function getPersonalizedRecommendations() {
        const visitor = window.SynthiaMemory?.getProfile();
        const lang = window.SynthiaI18n?.getLanguage() || 'es';

        const recommendations = [];

        // First time visitor
        if (!visitor?.is_returning) {
            recommendations.push({
                type: 'onboarding',
                message: lang === 'es'
                    ? '🌟 ¡Bienvenido! Descubre cómo SYNTHIA puede transformar tu negocio.'
                    : '🌟 Welcome! Discover how SYNTHIA can transform your business.',
                action: 'show_demo'
            });
        }

        // Returning visitor, no lead
        if (visitor?.is_returning && !visitor?.is_lead) {
            recommendations.push({
                type: 'conversion',
                message: lang === 'es'
                    ? '💡 ¿Listo para dar el siguiente paso? Agenda una demo gratuita.'
                    : '💡 Ready to take the next step? Schedule a free demo.',
                action: 'schedule_demo'
            });
        }

        // Lead but not converted
        if (visitor?.is_lead) {
            recommendations.push({
                type: 'retention',
                message: lang === 'es'
                    ? '🎁 Member benefit: Descarga nuestra guía gratuita de IA para negocios.'
                    : '🎁 Member benefit: Download our free AI for business guide.',
                action: 'download_guide'
            });
        }

        return recommendations;
    }

    /**
     * Generate unique ID
     * @returns {string}
     */
    function generateId() {
        return 'cf_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Clear brain state
     */
    function clear() {
        brainState = {};
        localStorage.removeItem(CONFIG.memoryKey);
    }

    /**
     * Export brain data
     * @returns {Object}
     */
    function exportData() {
        return {
            brain_state: brainState,
            exported_at: new Date().toISOString(),
            persona: CONFIG.personaName
        };
    }

    // Initialize
    init();

    // Expose API globally
    window.SynthiaCoFounder = {
        init,
        getGreeting,
        giveAdvice,
        qualifyLead,
        getRevenueRecommendations,
        getInsights,
        trackMilestone,
        getPersonalizedRecommendations,
        clear,
        exportData,
        // Constants
        PERSONA_NAME: CONFIG.personaName,
        PHILOSOPHY: CONFIG.philosophy
    };

})();
