const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 50, y: 50, size: 20, speed: 5 };
let items = [
    { x: 200, y: 200, collected: false },
    { x: 400, y: 300, collected: false },
    { x: 600, y: 100, collected: false } // Added more items
];
let obstacles = [
    { x: 300, y: 150, width: 30, height: 30, dx: 2 }, // Moving right
    { x: 500, y: 250, width: 30, height: 30, dx: -2 }, // Moving left
    { x: 100, y: 400, width: 30, height: 30, dx: 3 } // New moving obstacle
];
let score = 0;
let hijacked = false;

// Draw the player
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Draw the items
function drawItems() {
    items.forEach(item => {
        if (!item.collected) {
            ctx.fillStyle = 'red';
            ctx.fillRect(item.x, item.y, 20, 20);
        }
    });
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = 'black';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Check for collisions with items
function checkItemCollisions() {
    items.forEach(item => {
        if (!item.collected && 
            player.x < item.x + 20 && 
            player.x + player.size > item.x && 
            player.y < item.y + 20 && 
            player.y + player.size > item.y) {
            item.collected = true;
            score++;
        }
    });
}

// Check for collisions with obstacles
function checkObstacleCollisions() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.size > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.size > obstacle.y) {
            hijacked = true; // Activate hijack mode
            setTimeout(() => { hijacked = false; }, 2000); // Reset after 2 seconds
        }
    });
}

// Update the game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPlayer();
    drawItems();
    drawObstacles();
    
    checkItemCollisions();
    checkObstacleCollisions();

    // Adjust player speed if hijacked
    if (hijacked) {
        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';
        ctx.fillText("Hijacked! Slow Down!", canvas.width / 4, canvas.height / 2);
        player.speed = 2; // Reduce speed during hijack
    } else {
        player.speed = 5; // Normal speed
    }

    // Display Score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Move obstacles
    obstacles.forEach(obstacle => {
        obstacle.x += obstacle.dx;

        // Reverse direction if hitting canvas edges
        if (obstacle.x <= 0 || obstacle.x >= canvas.width - obstacle.width) {
            obstacle.dx *= -1;
        }
    });
}

// Move the player based on keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (player.y > 0) player.y -= player.speed;
            break;
        case 'ArrowDown':
            if (player.y < canvas.height - player.size) player.y += player.speed;
            break;
        case 'ArrowLeft':
            if (player.x > 0) player.x -= player.speed;
            break;
        case 'ArrowRight':
            if (player.x < canvas.width - player.size) player.x += player.speed;
            break;
    }
});

// Start the game loop
setInterval(update, 1000 / 30); // Update at 30 FPS