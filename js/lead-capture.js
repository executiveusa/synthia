/**
 * SYNTHIA Lead Capture System
 * Handles lead form submission, validation, and tracking
 * Integrated with Supabase backend
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        supabaseUrl: 'https://your-project.supabase.co',
        supabaseKey: 'your-anon-key',
        formId: 'lead-form',
        storageKey: 'synthia_lead',
        validation: {
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            }
        }
    };

    /**
     * Initialize lead capture
     */
    function init() {
        const form = document.getElementById(CONFIG.formId);
        
        if (!form) {
            console.warn('[LeadCapture] Form not found');
            return;
        }

        form.addEventListener('submit', handleSubmit);
        
        // Add input validation listeners
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmail);
            emailInput.addEventListener('input', clearError);
        }

        console.log('[LeadCapture] Initialized');
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Get email value
        const email = emailInput?.value?.trim();
        
        // Validate
        if (!validateEmail(emailInput)) {
            showError(emailInput, getValidationMessage('email.required'));
            return;
        }

        if (!validateEmailPattern(email)) {
            showError(emailInput, getValidationMessage('email.invalid'));
            return;
        }

        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>⏳</span> ' + (window.SynthiaI18n?.getTranslation('cta.processing') || 'Procesando...');
        }

        try {
            // Create lead data
            const leadData = {
                email: email,
                language_pref: window.SynthiaI18n?.getLanguage() || 'es',
                source: detectSource(),
                campaign: detectCampaign(),
                referrer: document.referrer,
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                created_at: new Date().toISOString()
            };

            // Send to backend
            const response = await saveLead(leadData);
            
            // Handle success
            handleSuccess(response, form);
            
        } catch (error) {
            console.error('[LeadCapture] Error:', error);
            handleError(error, form);
        } finally {
            // Re-enable submit button
            if (submitBtn && submitBtn.dataset.originalText) {
                submitBtn.innerHTML = submitBtn.dataset.originalText;
                submitBtn.disabled = false;
            }
        }
    }

    /**
     * Validate email input
     * @param {HTMLInputElement} input - Email input
     * @returns {boolean}
     */
    function validateEmail(input) {
        if (!input) return false;
        
        const value = input.value.trim();
        
        if (!value) {
            showError(input, getValidationMessage('email.required'));
            return false;
        }
        
        if (!validateEmailPattern(value)) {
            showError(input, getValidationMessage('email.invalid'));
            return false;
        }
        
        clearError(input);
        return true;
    }

    /**
     * Validate email pattern
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    function validateEmailPattern(email) {
        return CONFIG.validation.email.pattern.test(email);
    }

    /**
     * Get validation message
     * @param {string} key - Message key
     * @returns {string}
     */
    function getValidationMessage(key) {
        const i18nKey = `validation.${key}`;
        const message = window.SynthiaI18n?.getTranslation(i18nKey);
        return message || key;
    }

    /**
     * Show error on input
     * @param {HTMLInputElement} input - Input element
     * @param {string} message - Error message
     */
    function showError(input, message) {
        if (!input) return;
        
        input.classList.add('error');
        input.classList.remove('valid');
        
        // Create or update error message
        let errorEl = input.parentNode.querySelector('.error-message');
        
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            input.parentNode.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        input.setAttribute('aria-invalid', 'true');
    }

    /**
     * Clear error from input
     * @param {HTMLInputElement} input - Input element
     */
    function clearError(input) {
        if (!input) return;
        
        input.classList.remove('error');
        input.classList.add('valid');
        
        const errorEl = input.parentNode.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
        
        input.setAttribute('aria-invalid', 'false');
    }

    /**
     * Detect lead source
     * @returns {string}
     */
    function detectSource() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('utm_source')) return urlParams.get('utm_source');
        if (urlParams.has('source')) return urlParams.get('source');
        if (urlParams.has('ref')) return `ref_${urlParams.get('ref')}`;
        
        // Check referrer
        const referrer = document.referrer;
        if (referrer.includes('google')) return 'google_organic';
        if (referrer.includes('facebook') || referrer.includes('meta')) return 'facebook';
        if (referrer.includes('linkedin')) return 'linkedin';
        if (referrer.includes('twitter') || referrer.includes('x.com')) return 'twitter';
        if (referrer.includes('instagram')) return 'instagram';
        if (referrer.includes('youtube')) return 'youtube';
        
        return 'direct';
    }

    /**
     * Detect campaign from URL
     * @returns {string|null}
     */
    function detectCampaign() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('utm_campaign') || urlParams.get('campaign') || null;
    }

    /**
     * Save lead to backend
     * @param {Object} leadData - Lead data
     * @returns {Promise<Object>}
     */
    async function saveLead(leadData) {
        // Try Supabase first
        if (typeof CONFIG.supabaseUrl !== 'undefined' && 
            CONFIG.supabaseUrl !== 'https://your-project.supabase.co') {
            try {
                const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/leads`, {
                    method: 'POST',
                    headers: {
                        'apikey': CONFIG.supabaseKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(leadData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.warn('[LeadCapture] Supabase failed, using local storage:', error);
            }
        }

        // Fallback to localStorage
        const leads = getStoredLeads();
        leadData.id = generateLeadId();
        leads.push(leadData);
        
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(leads));
        
        return { ...leadData, local: true };
    }

    /**
     * Get stored leads from localStorage
     * @returns {Array}
     */
    function getStoredLeads() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    /**
     * Generate unique lead ID
     * @returns {string}
     */
    function generateLeadId() {
        return 'lead_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Handle successful submission
     * @param {Object} response - Server response
     * @param {HTMLFormElement} form - Form element
     */
    function handleSuccess(response, form) {
        // Track conversion
        trackConversion(response);
        
        // Show success message
        showSuccessMessage(form);
        
        // Trigger any callbacks
        triggerLeadCallbacks(response);
        
        // Log
        console.log('[LeadCapture] Lead captured:', response);
    }

    /**
     * Show success message
     * @param {HTMLFormElement} form - Form element
     */
    function showSuccessMessage(form) {
        // Get translations
        const successTitle = window.SynthiaI18n?.getTranslation('lead.success.title') || '¡Bienvenido! 🎉';
        const successMessage = window.SynthiaI18n?.getTranslation('lead.success.message') || 'Revisa tu correo para comenzar.';
        
        // Create success element
        const successEl = document.createElement('div');
        successEl.className = 'form-success animate-fade-in';
        successEl.innerHTML = `
            <div class="form-success-icon">🎉</div>
            <h3>${successTitle}</h3>
            <p>${successMessage}</p>
        `;
        
        // Replace form with success message
        form.innerHTML = '';
        form.appendChild(successEl);
    }

    /**
     * Handle submission error
     * @param {Error} error - Error object
     * @param {HTMLFormElement} form - Form element
     */
    function handleError(error, form) {
        const errorMessage = window.SynthiaI18n?.getTranslation('lead.error') || 'Algo salió mal. Por favor intenta de nuevo.';
        
        // Show error in form
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error animate-fade-in';
        errorEl.style.cssText = `
            padding: 1rem;
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 0.75rem;
            color: #ff6b6b;
            text-align: center;
            margin-top: 1rem;
        `;
        errorEl.textContent = errorMessage;
        
        form.appendChild(errorEl);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorEl.remove();
        }, 5000);
    }

    /**
     * Track conversion
     * @param {Object} lead - Lead data
     */
    function trackConversion(lead) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                lead_id: lead.id,
                language: lead.language_pref,
                source: lead.source
            });
        }

        // Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                lead_id: lead.id,
                language: lead.language_pref
            });
        }

        // Custom event
        window.dispatchEvent(new CustomEvent('leadCaptured', { detail: lead }));
    }

    /**
     * Trigger registered callbacks
     * @param {Object} lead - Lead data
     */
    function triggerLeadCallbacks(lead) {
        // Check for registered callbacks
        if (typeof window.onLeadCaptured === 'function') {
            window.onLeadCaptured(lead);
        }

        // Dispatch event for other listeners
        window.dispatchEvent(new CustomEvent('leadCaptured', { detail: lead }));
    }

    /**
     * Get lead count
     * @returns {number}
     */
    function getLeadCount() {
        return getStoredLeads().length;
    }

    /**
     * Clear stored leads
     */
    function clearLeads() {
        localStorage.removeItem(CONFIG.storageKey);
    }

    /**
     * Export leads (for debugging/admin)
     * @returns {Array}
     */
    function exportLeads() {
        return getStoredLeads();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.SynthiaLeadCapture = {
        init,
        getLeadCount,
        clearLeads,
        exportLeads,
        trackConversion
    };

})();
