
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.content-section');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    // Navigation handler
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 && 
            !sidebar.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
        }
    });
    
    // Handle navigation clicks
    function handleNavClick(e) {
        e.preventDefault();
        
        // Update active nav link
        navLinks.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // Switch sections
        const targetId = this.getAttribute('data-section');
        switchSection(targetId);
        
        // Close mobile menu
        if (window.innerWidth < 992) {
            sidebar.classList.remove('show');
        }
    }
    
    // Switch content sections
    function switchSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Animate skills if needed
            if (sectionId === 'skills') {
                setTimeout(animateSkills, 100);
            }
        }
    }
    
    // Animate skill progress bars
    function animateSkills() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 200);
        });
    }
    
    // Initialize constellation animation
    initConstellation();
});

// Constellation Animation
function initConstellation() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Configuration
    const config = {
        starCount: 80,
        connectionDistance: 150,
        mouseRadius: 200,
        starSpeed: 0.2,
        colors: {
            stars: '#64b5f6',
            connections: '#42a5f5',
            mouseConnections: '#2196f3'
        }
    };
    
    // Stars array
    let stars = [];
    let mouse = { x: 0, y: 0, isActive: false };
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        createStars();
    }
    
    // Create stars
    function createStars() {
        stars = [];
        for (let i = 0; i < config.starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * config.starSpeed,
                vy: (Math.random() - 0.5) * config.starSpeed,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    // Get distance between two points
    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    // Draw star
    function drawStar(star) {
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = config.colors.stars;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 30;
        ctx.shadowColor = config.colors.stars;
        ctx.fill();
        ctx.restore();
    }
    
    // Draw connection line
    function drawConnection(x1, y1, x2, y2, opacity, color = config.colors.connections) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }
    
    // Update star positions
    function updateStars() {
        stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;
            
            // Bounce off edges
            if (star.x <= 0 || star.x >= canvas.width) star.vx *= -1;
            if (star.y <= 0 || star.y >= canvas.height) star.vy *= -1;
            
            // Keep within bounds
            star.x = Math.max(0, Math.min(canvas.width, star.x));
            star.y = Math.max(0, Math.min(canvas.height, star.y));
        });
    }
    
    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updateStars();
        
        // Draw stars and connections
        stars.forEach((star, i) => {
            drawStar(star);
            
            // Connect to nearby stars
            for (let j = i + 1; j < stars.length; j++) {
                const otherStar = stars[j];
                const distance = getDistance(star.x, star.y, otherStar.x, otherStar.y);
                
                if (distance < config.connectionDistance) {
                    const opacity = (1 - distance / config.connectionDistance) * 0.5;
                    drawConnection(star.x, star.y, otherStar.x, otherStar.y, opacity);
                }
            }
            
            // Connect to mouse if active
            if (mouse.isActive) {
                const mouseDistance = getDistance(star.x, star.y, mouse.x, mouse.y);
                if (mouseDistance < config.mouseRadius) {
                    const opacity = (1 - mouseDistance / config.mouseRadius) * 0.8;
                    drawConnection(star.x, star.y, mouse.x, mouse.y, opacity, config.colors.mouseConnections);
                }
            }
        });
        
        // Draw mouse point if active
        if (mouse.isActive) {
            ctx.save();
            ctx.fillStyle = config.colors.mouseConnections;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 15;
            ctx.shadowColor = config.colors.mouseConnections;
            ctx.fill();
            ctx.restore();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Mouse event handlers
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.isActive = true;
    }
    
    function handleMouseLeave() {
        mouse.isActive = false;
    }
    
    // Touch event handlers for mobile
    function handleTouchMove(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
        mouse.isActive = true;
    }
    
    function handleTouchEnd() {
        mouse.isActive = false;
    }
    
    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize
    resizeCanvas();
    animate();
    
    // Cleanup function (if needed)
    return function cleanup() {
        cancelAnimationFrame(animationId);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', resizeCanvas);
    };
}