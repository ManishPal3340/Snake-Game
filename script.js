// Constants and variables
let inputDir = { x: 0, y: 0 };
let speed = 10;
let lastPointTime = 0;
let score = 0;
let snakeArr = [{ x: 10, y: 10 }];
let food = { x: 6, y: 15 };
let board = document.getElementById('board');
let scoreDisplay = document.getElementById('score');

// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
const minSwipeDistance = 30;

// Game function
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPointTime) / 1000 < 1 / speed) return;
    lastPointTime = ctime;
    gameEngine();
}

// Check for collision
function isCollide(sarr) {
    for (let i = 1; i < sarr.length; i++) {
        if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) return true;
    }
    if (sarr[0].x < 0 || sarr[0].y < 0 || sarr[0].x >= 20 || sarr[0].y >= 20) return true;
    return false;
}

// Update score display
function updateScoreDisplay() {
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `Score: ${score}`;
    }
}

// Main game engine
function gameEngine() {
    if (isCollide(snakeArr)) {
        inputDir = { x: 0, y: 0 };
        alert("Game over! Press OK to restart.");
        snakeArr = [{ x: 10, y: 10 }];
        score = 0;
        updateScoreDisplay();
        food = { x: 6, y: 15 };
    }

    // Check if snake eats food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        score += 10;
        updateScoreDisplay();
        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
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
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Draw food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Keyboard controls
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});

// Touch swipe controls
board.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

board.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > minSwipeDistance && inputDir.x !== -1) {
            inputDir = { x: 1, y: 0 }; // Right
        } else if (deltaX < -minSwipeDistance && inputDir.x !== 1) {
            inputDir = { x: -1, y: 0 }; // Left
        }
    } else {
        if (deltaY > minSwipeDistance && inputDir.y !== -1) {
            inputDir = { x: 0, y: 1 }; // Down
        } else if (deltaY < -minSwipeDistance && inputDir.y !== 1) {
            inputDir = { x: 0, y: -1 }; // Up
        }
    }
});

// Touch button controls
document.getElementById('up').addEventListener('click', () => {
    if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
});
document.getElementById('down').addEventListener('click', () => {
    if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
});
document.getElementById('left').addEventListener('click', () => {
    if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
});
document.getElementById('right').addEventListener('click', () => {
    if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
});

// Start game loop
window.requestAnimationFrame(main);
