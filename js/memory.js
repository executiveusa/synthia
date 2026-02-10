/**
 * SYNTHIA Visitor Memory System
 * Persistent visitor tracking and personalization
 * Supports localStorage fallback for offline capability
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'synthia_visitor_memory',
        sessionKey: 'synthia_session',
        maxMemoryAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        memoryKeys: {
            visitorId: 'visitor_id',
            firstVisit: 'first_visit',
            lastVisit: 'last_visit',
            visitCount: 'visit_count',
            language: 'language',
            leads: 'leads',
            chatHistory: 'chat_history',
            preferences: 'preferences',
            events: 'events',
            custom: 'custom'
        }
    };

    // Singleton instance
    let memoryInstance = null;

    /**
     * Memory Manager Class
     */
    class VisitorMemory {
        constructor() {
            this.initialized = false;
            this.data = {};
            this.session = {};
        }

        /**
         * Initialize memory system
         */
        init() {
            if (this.initialized) return this;

            // Load persistent memory
            this.data = this.loadMemory();
            
            // Load session
            this.session = this.loadSession();
            
            // Check if new visitor
            if (!this.data.visitor_id) {
                this.createNewVisitor();
            }
            
            // Update visit tracking
            this.trackVisit();
            
            // Save initial state
            this.save();
            
            this.initialized = true;
            
            console.log('[Memory] Initialized for visitor:', this.data.visitor_id);
            return this;
        }

        /**
         * Create new visitor record
         */
        createNewVisitor() {
            this.data = {
                visitor_id: this.generateId(),
                first_visit: new Date().toISOString(),
                last_visit: new Date().toISOString(),
                visit_count: 0,
                leads: [],
                chat_history: [],
                events: [],
                preferences: {},
                custom: {}
            };
        }

        /**
         * Track a visit
         */
        trackVisit() {
            this.data.visit_count++;
            this.data.last_visit = new Date().toISOString();
            
            // Track session start
            this.session = {
                session_id: this.generateId(),
                start_time: new Date().toISOString(),
                page_views: 0,
                events: []
            };
        }

        /**
         * Track page view
         * @param {string} page - Page identifier
         * @param {Object} metadata - Additional metadata
         */
        trackPageView(page, metadata = {}) {
            if (!this.session.page_views) this.session.page_views = 0;
            this.session.page_views++;
            
            this.session.current_page = page;
            this.session.page_metadata = metadata;
            
            this.save();
        }

        /**
         * Track custom event
         * @param {string} eventName - Event name
         * @param {Object} eventData - Event data
         */
        trackEvent(eventName, eventData = {}) {
            const event = {
                name: eventName,
                data: eventData,
                timestamp: new Date().toISOString(),
                session_id: this.session.session_id
            };
            
            this.data.events.push(event);
            this.session.events.push(event);
            
            // Limit stored events
            while (this.data.events.length > 100) {
                this.data.events.shift();
            }
            
            this.save();
            
            return event;
        }

        /**
         * Add a lead to memory
         * @param {Object} lead - Lead data
         */
        addLead(lead) {
            const leadRecord = {
                ...lead,
                captured_at: new Date().toISOString()
            };
            
            this.data.leads.push(leadRecord);
            
            // Track event
            this.trackEvent('lead_captured', { lead_id: leadRecord.id });
            
            this.save();
            
            return leadRecord;
        }

        /**
         * Add chat message to history
         * @param {string} role - 'user' or 'bot'
         * @param {string} content - Message content
         */
        addChatMessage(role, content) {
            const message = {
                role,
                content,
                timestamp: new Date().toISOString()
            };
            
            this.data.chat_history.push(message);
            
            // Limit chat history
            while (this.data.chat_history.length > 50) {
                this.data.chat_history.shift();
            }
            
            this.save();
            
            return message;
        }

        /**
         * Set user preference
         * @param {string} key - Preference key
         * @param {*} value - Preference value
         */
        setPreference(key, value) {
            this.data.preferences[key] = value;
            this.save();
            
            this.trackEvent('preference_set', { key, value });
        }

        /**
         * Get user preference
         * @param {string} key - Preference key
         * @param {*} defaultValue - Default value
         * @returns {*}
         */
        getPreference(key, defaultValue = null) {
            return this.data.preferences[key] ?? defaultValue;
        }

        /**
         * Set custom data
         * @param {string} key - Data key
         * @param {*} value - Data value
         */
        setCustomData(key, value) {
            this.data.custom[key] = value;
            this.save();
        }

        /**
         * Get custom data
         * @param {string} key - Data key
         * @param {*} defaultValue - Default value
         * @returns {*}
         */
        getCustomData(key, defaultValue = null) {
            return this.data.custom[key] ?? defaultValue;
        }

        /**
         * Get visitor profile
         * @returns {Object}
         */
        getProfile() {
            return {
                visitor_id: this.data.visitor_id,
                first_visit: this.data.first_visit,
                last_visit: this.data.last_visit,
                visit_count: this.data.visit_count,
                leads_count: this.data.leads.length,
                language: this.data.preferences?.language || 'unknown',
                total_events: this.data.events.length,
                days_since_first_visit: this.getDaysSinceFirstVisit(),
                is_returning: this.data.visit_count > 1,
                is_lead: this.data.leads.length > 0
            };
        }

        /**
         * Get days since first visit
         * @returns {number}
         */
        getDaysSinceFirstVisit() {
            const first = new Date(this.data.first_visit);
            const now = new Date();
            return Math.floor((now - first) / (1000 * 60 * 60 * 24));
        }

        /**
         * Get session data
         * @returns {Object}
         */
        getSession() {
            return {
                ...this.session,
                duration: this.getSessionDuration(),
                page_views: this.session.page_views || 0
            };
        }

        /**
         * Get session duration in seconds
         * @returns {number}
         */
        getSessionDuration() {
            if (!this.session.start_time) return 0;
            const start = new Date(this.session.start_time);
            const now = new Date();
            return Math.floor((now - start) / 1000);
        }

        /**
         * Check if visitor is returning
         * @returns {boolean}
         */
        isReturning() {
            return this.data.visit_count > 1;
        }

        /**
         * Check if visitor is a lead
         * @returns {boolean}
         */
        isLead() {
            return this.data.leads.length > 0;
        }

        /**
         * Get lead status
         * @returns {Object|null}
         */
        getLeadStatus() {
            if (this.data.leads.length === 0) return null;
            
            const lastLead = this.data.leads[this.data.leads.length - 1];
            return {
                captured: true,
                email: lastLead.email,
                captured_at: lastLead.captured_at,
                converted: lastLead.converted || false
            };
        }

        /**
         * Clear all memory
         */
        clear() {
            localStorage.removeItem(CONFIG.storageKey);
            localStorage.removeItem(CONFIG.sessionKey);
            this.data = {};
            this.session = {};
            this.createNewVisitor();
            this.trackVisit();
            
            console.log('[Memory] Cleared');
        }

        /**
         * Export memory data
         * @returns {Object}
         */
        export() {
            return {
                visitor: this.data,
                session: this.session,
                exported_at: new Date().toISOString()
            };
        }

        /**
         * Load memory from storage
         * @returns {Object}
         */
        loadMemory() {
            try {
                const stored = localStorage.getItem(CONFIG.storageKey);
                if (stored) {
                    const data = JSON.parse(stored);
                    
                    // Check if memory is too old
                    if (data.first_visit) {
                        const age = Date.now() - new Date(data.first_visit).getTime();
                        if (age > CONFIG.maxMemoryAge) {
                            console.log('[Memory] Memory too old, clearing');
                            return {};
                        }
                    }
                    
                    return data;
                }
            } catch (error) {
                console.warn('[Memory] Failed to load:', error);
            }
            return {};
        }

        /**
         * Load session from storage
         * @returns {Object}
         */
        loadSession() {
            try {
                const stored = localStorage.getItem(CONFIG.sessionKey);
                if (stored) {
                    const session = JSON.parse(stored);
                    
                    // Check if session is still valid (30 minutes)
                    if (session.start_time) {
                        const age = Date.now() - new Date(session.start_time).getTime();
                        if (age > 30 * 60 * 1000) {
                            return {};
                        }
                    }
                    
                    return session;
                }
            } catch (error) {
                console.warn('[Memory] Failed to load session:', error);
            }
            return {};
        }

        /**
         * Save memory to storage
         */
        save() {
            try {
                localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.data));
                localStorage.setItem(CONFIG.sessionKey, JSON.stringify(this.session));
            } catch (error) {
                console.warn('[Memory] Failed to save:', error);
            }
        }

        /**
         * Generate unique ID
         * @returns {string}
         */
        generateId() {
            return 'synthia_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        }
    }

    /**
     * Initialize singleton
     */
    function init() {
        if (!memoryInstance) {
            memoryInstance = new VisitorMemory();
            memoryInstance.init();
        }
        return memoryInstance;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init();
    }

    // Expose API globally
    window.SynthiaMemory = {
        getInstance: init,
        get: () => init(),
        setPreference: (k, v) => init().setPreference(k, v),
        getPreference: (k, d) => init().getPreference(k, d),
        trackEvent: (n, d) => init().trackEvent(n, d),
        getProfile: () => init().getProfile(),
        isReturning: () => init().isReturning(),
        isLead: () => init().isLead(),
        getSession: () => init().getSession(),
        clear: () => init().clear(),
        export: () => init().export()
    };

})();
