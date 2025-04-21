// Rain effect using HTML5 Canvas
document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element
    const canvas = document.getElementById('rainCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Call resize initially and on window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Raindrop class
    class Raindrop {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.speed = 5 + Math.random() * 10;
            this.length = 10 + Math.random() * 20;
            this.opacity = 0.1 + Math.random() * 0.3;
        }
        
        update() {
            this.y += this.speed;
            
            // Reset raindrop when it goes off screen
            if (this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        }
    }
    
    // Create raindrops
    const raindrops = [];
    const raindropCount = 200;
    
    for (let i = 0; i < raindropCount; i++) {
        raindrops.push(new Raindrop());
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with slight fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw raindrops
        raindrops.forEach(drop => {
            drop.update();
            drop.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}); 