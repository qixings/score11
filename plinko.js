// Global Variables
let balance = 55245.00;
let currentBet = 0;
let autoBetActive = false;
let betInterval = null;
let roundNumber = 1;
let historyData = [];
let currentPage = 1;
const roundsPerPage = 10;

// DOM Elements
const balanceAmount = document.getElementById('balance-amount');
const betAmountInput = document.getElementById('bet-amount');
const manualButton = document.getElementById('manual-button');
const autoButton = document.getElementById('auto-button');
const manualSection = document.getElementById('manual-section');
const autoSection = document.getElementById('auto-section');
const betButton = document.getElementById('bet');
const startAutoBetButton = document.getElementById('start-auto-bet');
const stopAutoBetButton = document.getElementById('stop-auto-bet');
const plinkoBoard = document.getElementById('plinko-board');
const resultSlots = document.getElementById('result-slots');
const historyList = document.getElementById('history-list');
const paginationContainer = document.getElementById('pagination');

// Initialize balance display
updateBalanceDisplay();

// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Events = Matter.Events;

// Create an engine
const engine = Engine.create();
engine.world.gravity.y = 1; // Adjust gravity for more realistic movement

// Create a renderer
const render = Render.create({
    element: plinkoBoard,
    engine: engine,
    options: {
        width: 450,
        height: 402,
        wireframes: false, // Solid shapes
        background: '#0e1c28'
    }
});

// Create pins
function createPins() {
    const pinRadius = 4;
    const pinOffset = 30;

    for (let row = 1; row <= 16; row++) {
        for (let col = 0; col < row; col++) {
            const x = 225 + (col - row / 2) * pinOffset;
            const y = row * pinOffset + 10;
            const pin = Bodies.circle(x, y, pinRadius, { isStatic: true, render: { fillStyle: 'white' } });
            Composite.add(engine.world, pin);
        }
    }
}

// Create boundaries
function createBoundaries() {
    const ground = Bodies.rectangle(225, 395, 450, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(0, 200, 20, 402, { isStatic: true });
    const rightWall = Bodies.rectangle(450, 200, 20, 402, { isStatic: true });
    Composite.add(engine.world, [ground, leftWall, rightWall]);
}

// Create result slots
function createResultSlots() {
    const slotWidth = 30;
    const slotPositions = [40, 90, 140, 190, 240, 290, 340, 390];

    slotPositions.forEach((x, index) => {
        const slot = Bodies.rectangle(x, 380, slotWidth, 10, { isStatic: true, render: { fillStyle: '#ff4757' } });
        slot.label = resultSlots.children[index].textContent; // Set the label to the multiplier
        Composite.add(engine.world, slot);
    });
}

// Drop the ball
function dropBall() {
    const ball = Bodies.circle(225, 10, 7, { restitution: 0.9, render: { fillStyle: 'yellow' } });
    ball.label = 'ball';
    Composite.add(engine.world, ball);
}

// Set up the Plinko board
createPins();
createBoundaries();
createResultSlots();

// Run the engine and renderer
Engine.run(engine);
Render.run(render);

// Run the runner
const runner = Runner.create();
Runner.run(runner, engine);

// Drop a ball when the Bet button is clicked
betButton.addEventListener('click', function() {
    currentBet = parseFloat(betAmountInput.value);
    if (isNaN(currentBet) || currentBet <= 0 || currentBet > balance) {
        alert('Please enter a valid bet amount within your balance.');
        return;
    }

    balance -= currentBet;
    updateBalanceDisplay();
    dropBall(); // Trigger the ball drop here
});

// Handle ball collision with slots
Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        if (bodyA.label === 'ball' && bodyB.label) {
            const multiplier = parseFloat(bodyB.label);
            let winnings = currentBet * multiplier;
            balance += winnings;
            updateBalanceDisplay();
            addToHistory(roundNumber, winnings.toFixed(2));
            roundNumber++;
        }
    });
});

// Function to update balance display
function updateBalanceDisplay() {
    balanceAmount.textContent = balance.toFixed(2);
}

// Function to add a result to the history
function addToHistory(round, winnings) {
    const roundData = {
        round: round,
        amount: parseFloat(winnings).toFixed(2)
    };

    // Add the round data to the historyData array
    historyData.unshift(roundData);

    // Render the updated history
    renderHistory();

    // Update the pagination controls
    updatePaginationControls();
}

// Function to render the history based on the current page
function renderHistory() {
    historyList.innerHTML = ''; // Clear the current history display

    // Determine the start and end indices for the current page
    const startIndex = (currentPage - 1) * roundsPerPage;
    const endIndex = startIndex + roundsPerPage;

    // Slice the historyData array to get the rounds for the current page
    const roundsToDisplay = historyData.slice(startIndex, endIndex);

    // Render the rounds on the page
    roundsToDisplay.forEach((round) => {
        const row = document.createElement('tr');
        const roundCell = document.createElement('td');
        const amountCell = document.createElement('td');

        roundCell.textContent = `#${round.round}`;
        amountCell.textContent = `₹${round.amount}`;

        row.appendChild(roundCell);
        row.appendChild(amountCell);

        historyList.appendChild(row);
    });
}

// Function to update the pagination controls
function updatePaginationControls() {
    paginationContainer.innerHTML = ''; // Clear the existing pagination controls

    // Calculate the total number of pages
    const totalPages = Math.ceil(historyData.length / roundsPerPage);

    // Render the pagination controls
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.style.backgroundColor = i === currentPage ? "#00ffd5" : ""; // Highlight the active page
        pageButton.style.border = "none";
        pageButton.style.borderRadius = "2px";
        pageButton.style.marginLeft = "2px";

        // Add click event listener to change the page
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderHistory();
            updatePaginationControls();
        });

        paginationContainer.appendChild(pageButton);
    }
}

// Switching between manual and auto mode
manualButton.addEventListener('click', () => switchMode('manual'));
autoButton.addEventListener('click', () => switchMode('auto'));

function switchMode(mode) {
    if (mode === 'manual') {
        manualButton.classList.add('active');
        autoButton.classList.remove('active');
        manualSection.style.display = 'block';
        autoSection.style.display = 'none';
    } else if (mode === 'auto') {
        autoButton.classList.add('active');
        manualButton.classList.remove('active');
        manualSection.style.display = 'none';
        autoSection.style.display = 'block';
    }
}

// Set the pre-defined amounts when the buttons are clicked
document.querySelectorAll('.pre-amount-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const amount = parseFloat(button.textContent.replace('₹', '')) || balance;
        setAmount(amount);
    });
});

function setAmount(amount) {
    betAmountInput.value = amount.toFixed(2);
}

// Start and stop auto-betting
startAutoBetButton.addEventListener('click', function() {
    autoBetActive = true;
    startAutoBet();
    startAutoBetButton.style.display = 'none';
    stopAutoBetButton.style.display = 'block';
});

stopAutoBetButton.addEventListener('click', function() {
    stopAutoBet();
    stopAutoBetButton.style.display = 'none';
    startAutoBetButton.style.display = 'block';
});

function startAutoBet() {
    if (autoBetActive) {
        betInterval = setInterval(() => {
            betButton.click(); // Simulate a bet click
        }, 3000); // Adjust the interval timing as needed
    }
}

function stopAutoBet() {
    clearInterval(betInterval);
    autoBetActive = false;
}
