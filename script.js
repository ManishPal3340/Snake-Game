// Constants and variables
let inputDir = { x: 0, y: 0 };
// const foodSound = new Audio('');
// const gameOverSound = new Audio('');
// const moveSound = new Audio('');
// const musicSound = new Audio('');
let speed = 15; // added default speed value
let lastPointTime = 0;
let score = 0;
let snakeArr = [
    { x: 10, y: 10 }
];
let food = { x: 6, y: 15 };
let board = document.getElementById('board'); // Assuming 'board' is your container element
let scoreDisplay = document.getElementById('score'); // Assuming 'score' is your score element

// Game function
function main(ctime) {
    window.requestAnimationFrame(main);

    // Check if enough time has passed for the next move
    if ((ctime - lastPointTime) / 1000 < 1 / speed) return;
    lastPointTime = ctime; // Update last point time
    gameEngine(); // Update the game state
}

// Check for collision (simple version)
function isCollide(sarr) {
    // Check if the snake collides with itself or the walls (assuming 20x20 grid)
    for (let i = 1; i < sarr.length; i++) {
        if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) return true; // Collision with itself
    }
    if (sarr[0].x < 0 || sarr[0].y < 0 || sarr[0].x >= 20 || sarr[0].y >= 20) return true; // Collision with walls
    return false;
}

// Main game engine
function gameEngine() {
    // Check for collision with snake or walls
    if (isCollide(snakeArr)) {
        // gameOverSound.play();
        // musicSound.pause();
        inputDir = { x: 0, y: 0 }; // Stop the snake movement
        alert("Game over! Press any key to restart.");
        
        snakeArr = [{ x: 13, y: 15 }]; // Reset the snake
        
        score = 0; // Reset score
        updateScoreDisplay(); // Update the score display
    }

    // Check if snake eats food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        // Increase the score
        score += 10; // Or any other value you prefer

        // Play food sound (optional)
        // foodSound.play();

        // Update the score display
        updateScoreDisplay();

        // Generate new food coordinates
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };

        // Ensure food doesn't spawn on the snake
        while (snakeArr.some(segment => segment.x === food.x && segment.y === food.y)) {
            food = {
                x: Math.round(a + (b - a) * Math.random()),
                y: Math.round(a + (b - a) * Math.random())
            };
        }
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Draw the board
    board.innerHTML = ""; // Clear the board
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake'); // Head or body
        board.appendChild(snakeElement);
    });

    // Draw food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Update the score display
function updateScoreDisplay() {
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `Score: ${score}`;
    }
}

// Main game loop
window.requestAnimationFrame(main);

// Event listener for controlling snake movement
window.addEventListener('keydown', (e) => {
    // Prevent reverse direction
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {
                inputDir = { x: 0, y: -1 };
            }
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir = { x: 0, y: 1 };
            }
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir = { x: -1, y: 0 };
            }
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir = { x: 1, y: 0 };
            }
            break;
        default:
            break;
    }
});
