document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Set canvas to full window size
    let width, height;
    function resizeCanvas() {
        const hero = document.getElementById("hero-section");
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Particles configuration
    const particles = [];
    const maxParticles = 50;
    const connectionDistance = 180;
    const mouseDistance = 200;
    
    let mouse = {
        x: null,
        y: null
    };
    
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off walls gently
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fill();
        }
    }
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();
            
            // Connect to other particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Fade line based on distance
                    const opacity = 1 - (dist / connectionDistance);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`; // Neon blue tint
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            
            // Connect to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouseDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    // Stronger line for mouse connection
                    const opacity = 1 - (dist / mouseDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    
                    // Subtle repel effect from mouse (optional, makes it feel more interactive)
                    if (dist < 100) {
                        p1.vx += dx * 0.002;
                        p1.vy += dy * 0.002;
                        
                        // Cap speed
                        const speed = Math.sqrt(p1.vx * p1.vx + p1.vy * p1.vy);
                        if(speed > 2.5) {
                            p1.vx = (p1.vx / speed) * 2.5;
                            p1.vy = (p1.vy / speed) * 2.5;
                        }
                    }
                }
            }
        }
        
        
        if (isVisible) {
            requestAnimationFrame(animate);
        }
        
    }
    
    
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) animate();
        });
    }, { threshold: 0 });
    
    observer.observe(canvas);
        
});
