    // JavaScript code for interactive animation
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    const resetButton = document.getElementById('resetButton');
    const loader = document.getElementById('loader');

    // Function to resize the canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
        init();
    }

    window.addEventListener('resize', resizeCanvas);

    // Event listener for mouse click on canvas
    canvas.addEventListener('click', (event) => {
        // Get the position of the click relative to the canvas
        const clickX = event.clientX - canvas.offsetLeft;
        const clickY = event.clientY - canvas.offsetTop;
        // Check if any shape was clicked
        shapes.forEach(shape => {
            const distance = Math.sqrt(Math.pow(shape.x - clickX, 2) + Math.pow(shape.y - clickY, 2));
            if (distance < shape.size) {
                // Change shape color and speed, and apply animation
                shape.color = colors[Math.floor(Math.random() * colors.length)];
                shape.speedX *= 1.5;
                shape.speedY *= 1.5;
                gsap.to(shape, { duration: 0.5, scale: 1.2, yoyo: true, repeat: 1 });
            }
        });
    });

    // Event listener for mouse movement on canvas
    canvas.addEventListener('mousemove', (event) => {
        // Get the position of the mouse relative to the canvas
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;
        let hovering = false;
        // Check if mouse is hovering over any shape
        shapes.forEach(shape => {
            const distance = Math.sqrt(Math.pow(shape.x - mouseX, 2) + Math.pow(shape.y - mouseY, 2));
            if (distance < shape.size) {
                hovering = true;
            }
        });
        // Change cursor style based on hovering state
        canvas.style.cursor = hovering ? 'pointer' : 'default';
    });

    // Event listener for mouse entering reset button
    resetButton.addEventListener('mouseenter', () => {
        // Animate the reset button when mouse enters
        gsap.to(resetButton, { duration: 0.3, scale: 1.2, backgroundColor: "#21a1f1" });
    });

    // Event listener for mouse leaving reset button
    resetButton.addEventListener('mouseleave', () => {
        // Animate the reset button when mouse leaves
        gsap.to(resetButton, { duration: 0.3, scale: 1, backgroundColor: "#61dafb" });
    });

    // Array to store shapes, their colors, and speeds
    const shapes = [];
    const colors = ['#ff6347', '#4682b4', '#32cd32', '#ff00ff', '#ffff00'];
    const speeds = [1, 2, 3];

    // Shape class definition
    class Shape {
        constructor(x, y, size, color, speedX, speedY, shapeType) {
            // Initialize shape properties
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
            this.shapeType = shapeType;
            this.angle = Math.random() * Math.PI * 2; // Random initial angle
            this.amplitude = Math.random() * 20 + 10; // Random amplitude for movement
        }

        // Function to draw the shape on canvas
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            if (this.shapeType === 'circle') {
                ctx.arc(0, 0, this.size, 0, Math.PI * 2, false);
            } else if (this.shapeType === 'triangle') {
                ctx.moveTo(0, -this.size);
                ctx.lineTo(-this.size, this.size);
                ctx.lineTo(this.size, this.size);
                ctx.closePath();
            } else if (this.shapeType === 'square') {
                ctx.rect(-this.size, -this.size, this.size * 2, this.size * 2);
            }
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        // Function to update shape position and behavior
        update() {
            // Update position based on speed and angle
            this.x += this.speedX + Math.sin(this.angle) * this.amplitude * 0.05;
            this.y += this.speedY + Math.cos(this.angle) * this.amplitude * 0.05;
            this.angle += 0.01; // Increment angle for rotation

            // Bounce off the walls, ensuring shapes stay
            if (this.x + this.size > canvas.width) {
                this.x = canvas.width - this.size;
                this.speedX *= -1;
            } else if (this.x - this.size < 0) {
                this.x = this.size;
                this.speedX *= -1;
            }
            if (this.y + this.size > canvas.height) {
                this.y = canvas.height - this.size;
                this.speedY *= -1;
            } else if (this.y - this.size < 0) {
                this.y = this.size;
                this.speedY *= -1;
            }

            this.draw();
        }
    }

    function init() {
        shapes.length = 0; // Clear previous shapes
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * (canvas.width - 60) + 30; // Adjusted to stay inside canvas
            const y = Math.random() * (canvas.height - 60) + 30; // Adjusted to stay inside canvas
            const size = Math.random() * 30 + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const speedX = speeds[Math.floor(Math.random() * speeds.length)];
            const speedY = speeds[Math.floor(Math.random() * speeds.length)];
            const shapeType = ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)];
            shapes.push(new Shape(x, y, size, color, speedX, speedY, shapeType));
        }

        // Hide the loader and show the canvas
        loader.style.display = 'none';
        canvas.style.display = 'block';
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach(shape => {
            shape.update();
        });
    }

    resetButton.addEventListener('click', () => {
        init();
    });

    resizeCanvas();
    animate();