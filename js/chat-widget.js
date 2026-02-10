/**
 * SYNTHIA Chat Widget
 * Conversational AI widget with memory and personality
 * Natalie Dawson persona - caring, lifestyle-focused
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'synthia_chat_memory',
        messagesContainer: 'chat-messages',
        inputId: 'chat-input',
        formId: 'chat-form',
        widgetId: 'chat-widget',
        windowId: 'chat-window',
        badgeId: 'chat-badge',
        maxMessages: 50,
        typingDelay: 800,
        maxLength: 500
    };

    // Chat state
    let chatOpen = false;
    let messages = [];
    let isTyping = false;

    /**
     * Initialize chat widget
     */
    function init() {
        // Load memory
        loadMemory();

        // Set up event listeners
        setupEventListeners();

        // Check for unread messages
        updateBadge();

        // Show greeting if new conversation
        if (messages.length === 0) {
            setTimeout(() => showGreeting(), 500);
        }

        console.log('[ChatWidget] Initialized');
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Chat form submission
        const form = document.getElementById(CONFIG.formId);
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        // Input handling
        const input = document.getElementById(CONFIG.inputId);
        if (input) {
            input.addEventListener('keydown', handleKeydown);
            input.addEventListener('input', handleInput);
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatOpen) {
                toggleChat(false);
            }
        });

        // Close on backdrop click
        document.addEventListener('click', (e) => {
            const widget = document.getElementById(CONFIG.widgetId);
            const window = document.getElementById(CONFIG.windowId);
            
            if (chatOpen && 
                widget.contains(e.target) && 
                !window.contains(e.target)) {
                toggleChat(false);
            }
        });
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    function handleSubmit(e) {
        e.preventDefault();
        
        const input = document.getElementById(CONFIG.inputId);
        const message = input?.value.trim();
        
        if (!message || isTyping) return;
        
        // Add user message
        addMessage('user', message);
        
        // Clear input
        if (input) input.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI response
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateResponse(message);
            addMessage('bot', response);
            saveMemory();
        }, CONFIG.typingDelay + Math.random() * 500);
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} e
     */
    function handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = document.getElementById(CONFIG.formId);
            if (form) form.dispatchEvent(new Event('submit'));
        }
    }

    /**
     * Handle input changes
     */
    function handleInput() {
        const input = document.getElementById(CONFIG.inputId);
        if (input && input.value.length > CONFIG.maxLength) {
            input.value = input.value.slice(0, CONFIG.maxLength);
        }
    }

    /**
     * Toggle chat window
     * @param {boolean} [forceState] - Force state
     */
    function toggleChat(forceState) {
        chatOpen = forceState ?? !chatOpen;
        
        const window = document.getElementById(CONFIG.windowId);
        const trigger = document.querySelector('.chat-trigger');
        
        if (window) {
            if (chatOpen) {
                window.classList.remove('hidden');
                // Focus input
                setTimeout(() => {
                    const input = document.getElementById(CONFIG.inputId);
                    if (input) input.focus();
                }, 100);
                
                // Clear unread badge
                clearUnread();
            } else {
                window.classList.add('hidden');
            }
        }

        // Update trigger aria
        if (trigger) {
            trigger.setAttribute('aria-expanded', chatOpen);
        }

        // Dispatch event
        window.dispatchEvent(new CustomEvent('chatToggle', { 
            detail: { open: chatOpen } 
        }));
    }

    /**
     * Show typing indicator
     */
    function showTypingIndicator() {
        isTyping = true;
        
        const container = document.getElementById(CONFIG.messagesContainer);
        if (!container) return;
        
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot typing-indicator';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <span class="message-avatar">🧠</span>
            <div class="message-content">
                <span></span><span></span><span></span>
            </div>
        `;
        
        container.appendChild(typingEl);
        scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    function hideTypingIndicator() {
        isTyping = false;
        
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    /**
     * Add message to chat
     * @param {string} role - 'user' or 'bot'
     * @param {string} content - Message content
     */
    function addMessage(role, content) {
        const container = document.getElementById(CONFIG.messagesContainer);
        if (!container) return;

        // Check for links and format
        const formattedContent = formatMessage(content);

        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}`;
        messageEl.innerHTML = `
            <span class="message-avatar">${role === 'bot' ? '🧠' : '👤'}</span>
            <div class="message-content">
                <p>${formattedContent}</p>
                <span class="message-time">${formatTime(new Date())}</span>
            </div>
        `;

        container.appendChild(messageEl);
        
        // Add to messages array
        messages.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });

        // Limit messages
        while (messages.length > CONFIG.maxMessages) {
            messages.shift();
        }

        // Scroll to bottom
        scrollToBottom();

        // If chat is closed, show badge
        if (role === 'bot' && !chatOpen) {
            incrementUnread();
        }
    }

    /**
     * Format message content
     * @param {string} content - Raw content
     * @returns {string} Formatted HTML
     */
    function formatMessage(content) {
        // Escape HTML
        let formatted = content
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>');

        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');

        // Convert line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    /**
     * Generate bot response
     * @param {string} userMessage - User's message
     * @returns {string} Bot response
     */
    function generateResponse(userMessage) {
        const lang = window.SynthiaI18n?.getLanguage() || 'es';
        const lowerMessage = userMessage.toLowerCase();

        // Check for keywords and generate context-aware response
        if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            return lang === 'es' 
                ? '¡Hola! 👋 ¡Qué alegría conocerte! Soy Natalie, tu Co-Founder Digital. Estoy aquí para ayudarte a transformar tu negocio con IA. ¿Qué te trae por aquí hoy?'
                : 'Hi there! 👋 So happy to meet you! I\'m Natalie, your Digital Co-Founder. I\'m here to help you transform your business with AI. What brings you here today?';
        }

        if (lowerMessage.includes('precio') || lowerMessage.includes('price') || lowerMessage.includes('costo')) {
            return lang === 'es'
                ? '¡Excelente pregunta! Tenemos planes para cada etapa de tu negocio. Nuestro plan Starter comienza en $49/mes y incluye todo lo básico para comenzar. ¿Te gustaría que te envíe una comparación detallada de planes?'
                : 'Great question! We have plans for every stage of your business. Our Starter plan starts at $49/month and includes everything you need to get started. Would you like me to send you a detailed comparison of plans?';
        }

        if (lowerMessage.includes('demo') || lowerMessage.includes('prueba') || lowerMessage.includes('trial')) {
            return lang === 'es'
                ? '¡Me encanta tu interés! 🎉 Podemos agendar una demo personalizada de 30 minutos donde podrás ver SYNTHIA en acción con tus propios casos de uso. ¿Qué día te funciona mejor?'
                : 'I love your interest! 🎉 We can schedule a personalized 30-minute demo where you can see SYNTHIA in action with your own use cases. What day works best for you?';
        }

        if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('soporte')) {
            return lang === 'es'
                ? '¡Claro que sí! 😊 Estoy aquí para ayudarte. Puedo asistirte con información sobre precios, agendar demos, resolver dudas técnicas, o simplemente charlar sobre cómo la IA puede transformar tu negocio. ¿En qué puedo ayudarte?'
                : 'Of course! 😊 I\'m here to help. I can assist you with pricing information, scheduling demos, answering technical questions, or just chatting about how AI can transform your business. How can I help?';
        }

        if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
            return lang === 'es'
                ? '¡De nada! 🙏 Ha sido un placer ayudarte. Recuerda que estoy aquí cuando me necesites. ¿Hay algo más en lo que pueda asistirte?'
                : 'You\'re welcome! 🙏 It\'s been a pleasure helping you. Remember, I\'m here whenever you need me. Is there anything else I can help you with?';
        }

        // Default response
        return lang === 'es'
            ? 'Gracias por tu mensaje 💬. Me encantaría saber más. ¿Podrías contarme más detalles sobre lo que necesitas? Estoy aquí para ayudarte en lo que sea.'
            : 'Thanks for your message 💬. I\'d love to learn more. Could you tell me more about what you need? I\'m here to help you with whatever you need.';
    }

    /**
     * Show greeting message
     */
    function showGreeting() {
        const lang = window.SynthiaI18n?.getLanguage() || 'es';
        const greeting = lang === 'es' 
            ? '¡Hola! Soy SYNTHIA. ¿Cómo puedo ayudarte hoy? 🌟'
            : 'Hi! I\'m SYNTHIA. How can I help you today? 🌟';
        
        addMessage('bot', greeting);
        
        // Show quick replies
        setTimeout(() => showQuickReplies(), 1000);
    }

    /**
     * Show quick reply options
     */
    function showQuickReplies() {
        const lang = window.SynthiaI18n?.getLanguage() || 'es';
        
        const container = document.getElementById(CONFIG.messagesContainer);
        if (!container) return;

        const quickRepliesEl = document.createElement('div');
        quickRepliesEl.className = 'quick-replies';
        
        const replies = lang === 'es'
            ? ['Más información', 'Ver precios', 'Agendar demo']
            : ['More info', 'View pricing', 'Schedule demo'];
        
        const actions = ['info', 'pricing', 'demo'];
        
        quickRepliesEl.innerHTML = replies.map((reply, i) => 
            `<button class="quick-reply" data-action="${actions[i]}">${reply}</button>`
        ).join('');
        
        container.appendChild(quickRepliesEl);
        
        // Add click handlers
        quickRepliesEl.querySelectorAll('.quick-reply').forEach(btn => {
            btn.addEventListener('click', () => handleQuickReply(btn.dataset.action));
        });
    }

    /**
     * Handle quick reply
     * @param {string} action - Action type
     */
    function handleQuickReply(action) {
        const lang = window.SynthiaI18n?.getLanguage() || 'es';
        
        const messages = {
            info: lang === 'es' 
                ? 'Me gustaría más información sobre SYNTHIA' 
                : 'I\'d like more information about SYNTHIA',
            pricing: lang === 'es' 
                ? 'Quiero ver los precios y planes' 
                : 'I want to see pricing and plans',
            demo: lang === 'es' 
                ? 'Me interesa agendar una demo' 
                : 'I\'m interested in scheduling a demo'
        };
        
        addMessage('user', messages[action]);
        
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                const response = generateResponse(messages[action]);
                addMessage('bot', response);
                saveMemory();
            }, CONFIG.typingDelay);
        }, 300);
    }

    /**
     * Scroll messages container to bottom
     */
    function scrollToBottom() {
        const container = document.getElementById(CONFIG.messagesContainer);
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /**
     * Format timestamp
     * @param {Date} date - Date object
     * @returns {string} Formatted time
     */
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Update unread badge
     */
    function updateBadge() {
        const unread = getUnreadCount();
        const badge = document.getElementById(CONFIG.badgeId);
        
        if (badge) {
            if (unread > 0) {
                badge.textContent = unread > 9 ? '9+' : unread;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    /**
     * Increment unread count
     */
    function incrementUnread() {
        const memory = getMemory();
        memory.unread = (memory.unread || 0) + 1;
        saveMemory();
        updateBadge();
    }

    /**
     * Clear unread count
     */
    function clearUnread() {
        const memory = getMemory();
        memory.unread = 0;
        saveMemory();
        updateBadge();
    }

    /**
     * Get unread count
     * @returns {number}
     */
    function getUnreadCount() {
        const memory = getMemory();
        return memory.unread || 0;
    }

    /**
     * Get chat memory
     * @returns {Object}
     */
    function getMemory() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            return stored ? JSON.parse(stored) : { messages: [], unread: 0 };
        } catch {
            return { messages: [], unread: 0 };
        }
    }

    /**
     * Load memory from storage
     */
    function loadMemory() {
        const memory = getMemory();
        messages = memory.messages || [];
        
        // Restore messages to UI
        const container = document.getElementById(CONFIG.messagesContainer);
        if (container && messages.length > 0) {
            container.innerHTML = '';
            
            messages.forEach(msg => {
                const messageEl = document.createElement('div');
                messageEl.className = `message ${msg.role}`;
                messageEl.innerHTML = `
                    <span class="message-avatar">${msg.role === 'bot' ? '🧠' : '👤'}</span>
                    <div class="message-content">
                        <p>${formatMessage(msg.content)}</p>
                        <span class="message-time">${formatTime(new Date(msg.timestamp))}</span>
                    </div>
                `;
                container.appendChild(messageEl);
            });
            
            scrollToBottom();
        }
    }

    /**
     * Save memory to storage
     */
    function saveMemory() {
        const memory = {
            messages: messages.slice(-CONFIG.maxMessages),
            unread: getUnreadCount(),
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(memory));
        } catch (error) {
            console.warn('[ChatWidget] Failed to save memory:', error);
        }
    }

    /**
     * Clear chat memory
     */
    function clearMemory() {
        messages = [];
        localStorage.removeItem(CONFIG.storageKey);
        
        const container = document.getElementById(CONFIG.messagesContainer);
        if (container) {
            container.innerHTML = '';
        }
        
        showGreeting();
    }

    // Make toggleChat globally accessible
    window.toggleChat = toggleChat;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.SynthiaChat = {
        toggleChat,
        addMessage,
        clearMemory,
        getMemory
    };

})();
