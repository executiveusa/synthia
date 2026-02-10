/**
 * SYNTHIA Neural Network Background
 * Elegant, subtle animated neural network visualization
 * Performance-optimized with canvas
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        particleCount: 40,
        connectionDistance: 150,
        mouseDistance: 200,
        particleSpeed: 0.3,
        particleSize: 3,
        color: 'rgba(255, 182, 193, 0.4)',
        accentColor: 'rgba(255, 218, 233, 0.6)'
    };

    // State
    let canvas = null;
    let ctx = null;
    let particles = [];
    let animationId = null;
    let mouse = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;

    /**
     * Particle class
     */
    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
            this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
            this.size = Math.random() * CONFIG.particleSize + 1;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.mouseDistance) {
                const force = (CONFIG.mouseDistance - distance) / CONFIG.mouseDistance;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
        }

        draw() {
            if (!ctx) return;
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            
            gradient.addColorStop(0, `rgba(255, 182, 193, ${this.baseAlpha})`);
            gradient.addColorStop(1, 'rgba(255, 182, 193, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    /**
     * Initialize the neural network canvas
     */
    function init() {
        canvas = document.getElementById('neural-network');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        
        // Set up canvas
        resize();
        
        // Create particles
        createParticles();
        
        // Event listeners
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);
        
        // Start animation
        animate();
        
        console.log('[NeuralNetwork] Initialized');
    }

    /**
     * Resize canvas to fill viewport
     */
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    /**
     * Create particles
     */
    function createParticles() {
        particles = [];
        const count = Math.min(CONFIG.particleCount, Math.floor((width * height) / 15000));
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    /**
     * Handle mouse move
     * @param {MouseEvent} e
     */
    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    /**
     * Handle mouse out
     */
    function handleMouseOut() {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    /**
     * Draw connections between particles
     */
    function drawConnections() {
        if (!ctx) return;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.connectionDistance) {
                    const alpha = (1 - distance / CONFIG.connectionDistance) * 0.3;
                    
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 182, 193, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    /**
     * Animation loop
     */
    function animate() {
        if (!ctx) return;
        
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(10, 14, 20, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        drawConnections();
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    }

    /**
     * Pause animation
     */
    function pause() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    /**
     * Resume animation
     */
    function resume() {
        if (!animationId) {
            animate();
        }
    }

    /**
     * Set particle color
     * @param {string} color - Hex or rgba color
     */
    function setColor(color) {
        CONFIG.color = color;
    }

    /**
     * Set accent color
     * @param {string} color - Hex or rgba color
     */
    function setAccentColor(color) {
        CONFIG.accentColor = color;
    }

    /**
     * Set particle count
     * @param {number} count - Number of particles
     */
    function setParticleCount(count) {
        CONFIG.particleCount = count;
        createParticles();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.SynthiaNeuralNetwork = {
        init,
        pause,
        resume,
        setColor,
        setAccentColor,
        setParticleCount
    };

})();
