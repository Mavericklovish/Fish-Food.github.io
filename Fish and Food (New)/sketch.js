const canvas = document.getElementById('fishingCanvas');
const ctx = canvas.getContext('2d');

// Define canvas dimensions and other constants
const lakeWidth = canvas.width;
const lakeHeight = 500;

const backgroundImage = new Image();
backgroundImage.src = 'underwater.jpg';

let mouseX, mouseY; // Variables to track mouse position
let fish = []; // Array to hold fish objects
let foods = []; // Array to hold food objects


foods.push({ x: 500, y: 500 });
foods.push({ x: 450, y: 350 });
foods.push({ x: 950, y: 100 });
foods.push({ x: 600, y: 500 });
foods.push({ x: 750, y: 250 });
foods.push({ x: 1200, y: 550 });
foods.push({ x: 1000, y: 650 });


// Define fish and food objects
function initializeFish() {
    fish = [
        { x: 500, y: 350, size: 45, velocityX: -5.0 },
        { x: 300, y: 400, size: 50, velocityX: -2.5 },
        { x: 100, y: 300, size: 30, velocityX: -3.5 },
        { x: 1000, y: 150, size: 45, velocityX: -2.5 },
        { x: 1200, y: 200, size: 55, velocityX: -4.25 },
        { x: 1200, y: 600, size: 35, velocityX: -1.75 },
    ];
}

function drawFish() {
    fish.forEach(f => {
        drawSingleFish(f.x, f.y, f.size);
    });
}

// Draw water background
function drawWater() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = '#80c904';
    // ctx.fillRect(0, waterLevel-35, lakeWidth, canvas.height - waterLevel);
}

function drawSingleFish(x, y, size) {
    // Body
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + size * 0.6, y - size * 0.8, x + size * 1.2, y - size * 0.4);
    ctx.quadraticCurveTo(x + size * 1.2, y, x + size * 1.2, y + size * 0.4);
    ctx.quadraticCurveTo(x + size * 0.6, y + size * 0.8, x, y);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x + size * 0.4, y, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(x + size * 1.2, y);
    ctx.lineTo(x + size * 1.5, y - size * 0.5);
    ctx.lineTo(x + size * 1.5, y + size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Pectoral fins
    ctx.beginPath();
    ctx.moveTo(x + size * 0.7, y - size * 0.5);
    ctx.lineTo(x + size * 0.9, y - size * 0.3);
    ctx.lineTo(x + size * 0.9, y - size * 0.7);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + size * 0.7, y + size * 0.5);
    ctx.lineTo(x + size * 0.9, y + size * 0.3);
    ctx.lineTo(x + size * 0.9, y + size * 0.7);
    ctx.closePath();
    ctx.fill();
}

// Draw food
function drawFood() {
    // Iterate over food array and draw each food item
    foods.forEach(food => {
        // Draw food object
        ctx.fillStyle = 'yellow'; // Change color as needed
        ctx.beginPath();
        ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Update fish positions and check for nearby food
function updateFish() {
    fish.forEach(f => {
        // Find the nearest food
        let nearestFood = null;
        let minDistance = Infinity;
        let nearestFoodIndex = -1;

        foods.forEach((food, index) => {
            const distance = Math.sqrt((f.x - food.x) ** 2 + (f.y - food.y) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                nearestFood = food;
                nearestFoodIndex = index;
            }
        });

        if (nearestFood) {
            // Calculate the angle towards the nearest food
            const angle = Math.atan2(nearestFood.y - f.y, nearestFood.x - f.x);

            // Move the fish towards the food
            const speed = 1; // Adjust speed as needed
            f.x += Math.cos(angle) * speed;
            f.y += Math.sin(angle) * speed;

            // Check if the fish has reached the food
            if (minDistance < f.size) {
                // Remove the food from the array
                foods.splice(nearestFoodIndex, 1);
            }
        } else {
            // If no food is found, move the fish randomly
            // f.x += f.velocityX;
            // if (f.x < 0) {
            //     f.x = lakeWidth;
            // } else if (f.x > lakeWidth) {
            //     f.x = 0;
            // }
            f.velocityX=0;
        }
    });
}

// Function to handle mouse clicks
canvas.addEventListener('click', function(event) {
    // Get mouse coordinates relative to canvas
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    // Create new food object at the clicked position
    foods.push({ x: clickX, y: clickY });
});

// Main draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWater();
    drawFish(); // Draw fishes
    drawFood();
    updateFish(); // Update fish positions
    requestAnimationFrame(draw);
}

// Start animation loop
initializeFish(); // Initialize fish positions
draw();