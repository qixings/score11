// Game settings and variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 300;

let snake = [{ x: 140, y: 140 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let bombPositions = [];
let gameInterval;
let score = 0;
let betAmount = 0;
let totalMultiplier = 0;
let foodCount = 1;
let bombCount = 0;
let foodRemaining = 0;
let multipliers = [];
let gameActive = false;
let balance = 50000;

const balanceElement = document.getElementById('balance-amount');
const betButton = document.getElementById('bet');
const cashoutButton = document.getElementById('cashout');
const betAmountInput = document.getElementById('bet-amount');

// Initialize the game with a bet
function initGame() {
    document.getElementById('tip-message').style.display = 'none';
    snake = [{ x: 140, y: 140 }];
    direction = { x: 0, y: 0 };
    score = 0;
    totalMultiplier = 0;
    foodRemaining = foodCount;
    bombPositions = [];
    multipliers = generateMultipliers(foodCount);
    gameActive = true;
    betAmount = parseFloat(betAmountInput.value) || 0;

    if (betAmount <= 0 || betAmount > balance) {
        showPopup('Please enter a valid bet amount.');
        return;
    }

    balance -= betAmount;
    updateBalanceDisplay();
    placeFood();
    placeBombs();
    gameInterval = setInterval(gameLoop, 100);
    updateButtonsState();
}

// Show Popup
function showPopup(message) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popupOverlay.style.display = 'flex';
}

// Hide Popup
function hidePopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'none';
}

document.getElementById('popup-close-button').addEventListener('click', hidePopup);

// Generate random multipliers for food
function generateMultipliers(count) {
    let multipliers = [];
    let remainingMultiplier = count === 1 ? 1.2 : count === 5 ? 3 : 5;

    for (let i = 0; i < count - 1; i++) {
        let multiplier = (Math.random() * remainingMultiplier / (count - i)).toFixed(1);
        multipliers.push(parseFloat(multiplier));
        remainingMultiplier -= multiplier;
    }

    multipliers.push(parseFloat(remainingMultiplier.toFixed(1)));
    return multipliers.sort(() => Math.random() - 0.5);
}

// Place food on the board
// Place food on the board
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    totalMultiplier += multipliers.pop();

    // Position the food element with ripple effect
    const foodElement = document.getElementById('food');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
}


// Place bombs on the board
function placeBombs() {
    bombPositions = [];
    for (let i = 0; i < bombCount; i++) {
        let bombX = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        let bombY = Math.floor(Math.random() * (canvas.height / 20)) * 20;
        bombPositions.push({ x: bombX, y: bombY });
    }
}

// Main game loop
function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        endGame(false);
        return;
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    }
    draw();
}

// Move the snake
function moveSnake() {
    let newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);
    snake.pop();
}

// Check for collisions with walls, bombs, or itself
function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    for (let bomb of bombPositions) {
        if (snake[0].x === bomb.x && snake[0].y === bomb.y) {
            return true;
        }
    }
    return false;
}

// Handle food consumption
function eatFood() {
    snake.push({ ...snake[snake.length - 1] });
    foodRemaining--;
    cashoutButton.disabled = false;
    if (foodRemaining > 0) {
        placeFood();
    } else {
        endGame(true);
    }
}

// Draw the game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake with pointy tail effect
    snake.forEach((segment, index) => {
        ctx.fillStyle = 'lime';
        let size = 20 - index * (20 / snake.length); // Decrease size towards the tail
        ctx.beginPath();
        ctx.arc(segment.x + 10, segment.y + 10, size / 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Animate the food
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + 10, food.y + 10, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw bombs
    ctx.fillStyle = 'black';
    for (let bomb of bombPositions) {
        ctx.beginPath();
        ctx.arc(bomb.x + 10, bomb.y + 10, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// End the game
function endGame(win) {
    clearInterval(gameInterval);
    if (win) {
        showPopup(`You won! Your total multiplier is ${totalMultiplier.toFixed(2)}x`);
        balance += betAmount * totalMultiplier;
    } else {
        showPopup("Game Over! You lost your bet.");
    }
    updateBalanceDisplay();
    resetGame();
}

// Cash out the current winnings
function cashout() {
    clearInterval(gameInterval);
    showPopup(`You cashed out with a multiplier of ${totalMultiplier.toFixed(2)}x`);
    balance += betAmount * totalMultiplier;
    updateBalanceDisplay();
    resetGame();
}

// Reset the game
function resetGame() {
    gameActive = false;
    totalMultiplier = 0;
    foodRemaining = 0;
    document.getElementById('tip-message').style.display = 'flex';
    updateButtonsState();
}

// Update buttons state
function updateButtonsState() {
    betButton.disabled = gameActive;
    cashoutButton.disabled = !gameActive;
}

// Update balance display
function updateBalanceDisplay() {
    balanceElement.textContent = balance.toFixed(2);
}

// Event listeners
betButton.addEventListener('click', () => {
    foodCount = parseInt(document.getElementById('food').value);
    bombCount = parseInt(document.getElementById('bombs').value);
    initGame();
});

cashoutButton.addEventListener('click', cashout);

document.getElementById('upBtn').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -20 };
});
document.getElementById('downBtn').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: 20 };
});
document.getElementById('leftBtn').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -20, y: 0 };
});
document.getElementById('rightBtn').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: 20, y: 0 };
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -20 };
    if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 20 };
    if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -20, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 20, y: 0 };
});

function setAmount(amount) {
    betAmountInput.value = amount.toFixed(2);
}

function adjustAmount(factor) {
    let amount = parseFloat(betAmountInput.value) || 0;
    amount *= factor;
    betAmountInput.value = amount.toFixed(2);
}