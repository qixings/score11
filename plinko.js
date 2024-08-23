// Global Variables
let balance = 55245.00;
let currentBet = 0;
let roundNumber = 1;
let historyData = [];
const roundsPerPage = 10;
let currentPage = 1;
const maxWidth = 335; // Make the width equal to the result slots width



// New Variables for Auto Mode
let isAutoMode = false;
let autoBetRounds = 0;
let currentAutoRound = 0;

// DOM Elements for Switches
const manualBetButton = document.getElementById('mannualBet');
const autoBetButton = document.getElementById('autoBet');


// DOM Element for Row Selection
const rowCountSelect = document.getElementById('row-count');

// DOM Elements
const balanceAmount = document.getElementById('balance-amount');
const betAmountInput = document.getElementById('bet-amount');
const betButton = document.getElementById('bet');
const plinkoBoard = document.getElementById('plinko-board');
const resultSlots = document.getElementById('result-slots');
const historyList = document.getElementById('history-list');
const paginationContainer = document.getElementById('pagination');




const switchesContainer = document.querySelector('.switches');
const amountControls = document.querySelector('.amount-controls');

// Add an additional section for Auto mode
const autoBetSection = document.createElement('div');
autoBetSection.classList.add('auto-bet-section');
autoBetSection.innerHTML = `
    <input type="number" id="auto-rounds" min="1" placeholder="Number of Rounds">
`;
amountControls.appendChild(autoBetSection);
autoBetSection.style.display = 'none'; // Initially hide the auto-bet section





// Set initial active mode
manualBetButton.classList.add('active');
betButton.textContent = 'Bet';

// Event Listeners for Mode Switching
manualBetButton.addEventListener('click', function() {
    isAutoMode = false;
    manualBetButton.classList.add('active');
    autoBetButton.classList.remove('active');
    autoBetSection.style.display = 'none'; // Hide auto-bet section
    betButton.textContent = 'Bet'; // Change button text back to Bet
});

autoBetButton.addEventListener('click', function() {
    isAutoMode = true;
    manualBetButton.classList.remove('active');
    autoBetButton.classList.add('active');
    autoBetSection.style.display = 'block'; // Show auto-bet section
    betButton.textContent = 'Start'; // Change button text to Start
});






// Disable Row Selection
function disableRowSelection() {
    rowCountSelect.disabled = true;
}

// Enable Row Selection
function enableRowSelection() {
    rowCountSelect.disabled = false;
}







// Update balance display
function updateBalanceDisplay() {
    balanceAmount.textContent = balance.toFixed(2);
}

// Initialize Plinko board (Pins and Slots)
function initializePlinkoBoard() {
    createPins();
    createResultSlots();
}

function createPins(pinRows = 16) { // Default to 16 rows
    const boardHeight = plinkoBoard.offsetHeight;
    const triangleHeight = boardHeight * 0.8;
    const pinSpacingY = triangleHeight / pinRows;
    const verticalOffset = (boardHeight - triangleHeight) / 2-10;

    plinkoBoard.innerHTML = ''; // Clear the Plinko board before adding new pins

    for (let row = 1; row <= pinRows; row++) {
        const y = verticalOffset + row * pinSpacingY - pinSpacingY / 2;
        const pinsInRow = row;
        const rowWidth = row === 1 ? 0 : (pinsInRow / pinRows) * maxWidth;

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('pin-row');
        rowDiv.style.width = `${rowWidth}px`;
        rowDiv.style.position = 'absolute';
        rowDiv.style.top = `${y}px`;
        rowDiv.style.left = '49%';
        rowDiv.style.transform = 'translateX(-50%)';

        for (let col = 0; col < pinsInRow; col++) {
            const pin = document.createElement('div');
            pin.classList.add('pin');
            pin.style.position = row === 1 ? 'relative' : 'absolute';
            pin.style.left = row === 1 ? '50%' : `${(col * 100) / (pinsInRow - 1)}%`;

            rowDiv.appendChild(pin);
        }

        plinkoBoard.appendChild(rowDiv);
    }

    createBoundaries(verticalOffset, triangleHeight, maxWidth);
}

function createBoundaries(verticalOffset, triangleHeight, maxWidth) {
    const boundaryThickness = 2;

    const leftBoundary = document.createElement('div');
    leftBoundary.style.position = 'absolute';
    leftBoundary.style.left = `calc(50% - ${maxWidth / 2}px)`;
    leftBoundary.style.top = `${verticalOffset}px`;
    leftBoundary.style.width = `${boundaryThickness}px`;
    leftBoundary.style.height = `${triangleHeight}px`;
    leftBoundary.style.backgroundColor = 'transparent';
    leftBoundary.style.pointerEvents = 'none';
    plinkoBoard.appendChild(leftBoundary);

    const rightBoundary = document.createElement('div');
    rightBoundary.style.position = 'absolute';
    rightBoundary.style.left = `calc(50% + ${maxWidth / 2 - boundaryThickness}px)`;
    rightBoundary.style.top = `${verticalOffset}px`;
    rightBoundary.style.width = `${boundaryThickness}px`;
    rightBoundary.style.height = `${triangleHeight}px`;
    rightBoundary.style.backgroundColor = 'transparent';
    rightBoundary.style.pointerEvents = 'none';
    plinkoBoard.appendChild(rightBoundary);
}

// Create Result Slots
function createResultSlots(pinRows = 16) {
    const baseMultipliers = [5, 3, 2, 1.5, 1.2, 0.5, 0.2, 0.2, 0.5, 1.2, 1.5, 2, 3, 5];
    const multipliers = baseMultipliers.map(m => {
        return Math.max((m * (pinRows / 16)).toFixed(1), 0.1); // Adjust multiplier based on rows
    });

    resultSlots.innerHTML = ''; // Clear previous slots

    multipliers.forEach(multiplier => {
        const slot = document.createElement('div');
        slot.classList.add('slot');

        if (multiplier >= 5) {
            slot.classList.add('slot-5x');
        } else if (multiplier >= 3) {
            slot.classList.add('slot-3x');
        } else if (multiplier >= 2) {
            slot.classList.add('slot-2x');
        } else if (multiplier >= 1.5) {
            slot.classList.add('slot-1_5x');
        } else if (multiplier >= 1.2) {
            slot.classList.add('slot-1_2x');
        } else if (multiplier >= 0.5) {
            slot.classList.add('slot-0_5x');
        } else if (multiplier >= 0.2) {
            slot.classList.add('slot-0_2x');
        }

        slot.textContent = `${multiplier}x`;
        slot.dataset.multiplier = multiplier;
        resultSlots.appendChild(slot);
    });

    plinkoBoard.appendChild(resultSlots);
}

// Handle Bet/Start button click
betButton.addEventListener('click', function() {
    if (isAutoMode) {
        autoBetRounds = parseInt(document.getElementById('auto-rounds').value);
        if (isNaN(autoBetRounds) || autoBetRounds <= 0) {
            alert('Please enter a valid number of rounds for auto betting.');
            return;
        }
        startAutoBetting();
    } else {
        placeBet(); // Ensure this function exists and is being called
    }
});

// Modify the placeBet function to disable the row selection when a bet starts
function placeBet() {
    currentBet = parseFloat(betAmountInput.value);
    if (isNaN(currentBet) || currentBet <= 0 || currentBet > balance) {
        alert('Please enter a valid bet amount within your balance.');
        return;
    }

    balance -= currentBet;
    updateBalanceDisplay();
    disableRowSelection(); // Disable row selection when the bet starts
    dropBall(); // Trigger the ball drop here
}



// Modify the startAutoBetting function to disable the row selection for the entire auto-bet session
function startAutoBetting() {
    currentAutoRound = 0;
    disableRowSelection(); // Disable row selection when auto-bet starts
    autoBet();
}

function autoBet() {
    if (currentAutoRound < autoBetRounds) {
        placeBet();
        currentAutoRound++;
        setTimeout(autoBet, 1000); // Adjust the delay between auto-bets as needed
    } else {
        enableRowSelection(); // Enable row selection after all auto-bet rounds are completed
    }
}


// Event Listeners for Mode Switching
manualBetButton.addEventListener('click', function() {
    isAutoMode = false;
    manualBetButton.classList.add('active');
    autoBetButton.classList.remove('active');
    autoBetSection.style.display = 'none'; // Hide auto-bet section
    betButton.textContent = 'Bet'; // Change button text back to Bet
});

autoBetButton.addEventListener('click', function() {
    isAutoMode = true;
    manualBetButton.classList.remove('active');
    autoBetButton.classList.add('active');
    autoBetSection.style.display = 'block'; // Show auto-bet section
    betButton.textContent = 'Start'; // Change button text to Start
});






function dropBall() {
    const ball = document.createElement('div');
    ball.classList.add('plinko-ball');
    plinkoBoard.appendChild(ball);

    ball.style.left = `${plinkoBoard.offsetWidth / 2 - 7}px`;
    ball.style.top = `-10px`;

    const path = calculateBallPath();
    animateBall(ball, path);
}

// Calculate ball path
function calculateBallPath() {
    const path = [];
    let currentX = plinkoBoard.offsetWidth / 2;
    const pinRowWidth = maxWidth;
    const verticalSpacing = (plinkoBoard.offsetHeight - 30)/ 16;

    for (let i = 0; i < 16; i++) {
        const direction = weightedDirection(i);
        const rowWidth = (i + 1) / 16 * pinRowWidth;
        const minX = (plinkoBoard.offsetWidth / 2) - (rowWidth / 2);
        const maxX = (plinkoBoard.offsetWidth / 2) + (rowWidth / 2);
        const horizontalSpacing = 25;
        currentX += direction * horizontalSpacing;

        currentX = Math.max(minX, Math.min(currentX, maxX));

        const yPosition = verticalSpacing * (i + 1);
        path.push({ x: currentX, y: yPosition });
    }

    const slotWidth = resultSlots.offsetWidth / resultSlots.children.length;
    let slotIndex = Math.floor(currentX / slotWidth);
    slotIndex = Math.max(0, Math.min(slotIndex, resultSlots.children.length - 1));
    const multiplier = parseFloat(resultSlots.children[slotIndex].dataset.multiplier);

    return { pathPoints: path, multiplier: multiplier };
}

// Function to determine direction with row-based weighted probability
function weightedDirection(row) {
    const random = Math.random();

    if (row < 5) {
        if (random < 0.8) {
            return 0;
        } else {
            return Math.random() < 0.5 ? -1 : 1;
        }
    } else if (row < 12) {
        if (random < 0.8) {
            return 0;
        } else {
            return Math.random() < 0.7 ? -1 : 1;
        }
    } else {
        if (random < 0.6) {
            return 0;
        } else {
            return Math.random() < 0.5 ? -1 : 1;
        }
    }
}

function animateBall(ball, pathData) {
    const { pathPoints, multiplier } = pathData;
    let index = 0;
    let velocityY = 5;
    let velocityX = 2;
    let gravity = 0.3;
    let damping = 0.3;

    function moveBall() {
        if (index < pathPoints.length) {
            const point = pathPoints[index];
            const targetX = point.x;
            const targetY = point.y;

            const currentX = parseFloat(ball.style.left);
            const currentY = parseFloat(ball.style.top);

            velocityY += gravity;
            velocityX = (targetX - currentX) * 0.1;

            let newX = currentX + velocityX;
            let newY = currentY + velocityY;

            const pins = document.querySelectorAll('.pin');
            pins.forEach(pin => {
                const pinRect = pin.getBoundingClientRect();
                const ballRect = ball.getBoundingClientRect();

                const distX = Math.abs(ballRect.left + ballRect.width / 2 - (pinRect.left + pinRect.width / 2));
                const distY = Math.abs(ballRect.top + ballRect.height / 2 - (pinRect.top + pinRect.height / 2));

                if (distX < 5 && distY < 5) {
                    createRippleEffect(pin);
                }
            });

            if (newY >= targetY && Math.abs(velocityY) > 0.1) {
                velocityY = -velocityY * damping;
                newY = targetY;
                index++;
            } else if (newY >= targetY && Math.abs(velocityY) <= 0.1) {
                index++;
            }

            const minX = (plinkoBoard.offsetWidth - maxWidth) / 2;
            const maxX = (plinkoBoard.offsetWidth + maxWidth) / 2;
            newX = Math.max(minX, Math.min(newX, maxX));

            ball.style.left = `${newX}px`;
            ball.style.top = `${newY}px`;

            requestAnimationFrame(moveBall);
        } else {
            alignBallToSlot(ball, multiplier);
        }
    }

    moveBall();
}

function createRippleEffect(pin) {
    pin.classList.add('ripple');
    setTimeout(() => {
        pin.classList.remove('ripple');
    }, 400);
}



// Modify the alignBallToSlot function to enable the row selection after the bet ends (only in manual mode)
function alignBallToSlot(ball, multiplier) {
    const resultSlots = document.getElementById('result-slots');
    const slotsRect = resultSlots.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    const closestSlot = [...resultSlots.children].reduce((closest, slot) => {
        const slotRect = slot.getBoundingClientRect();
        const distance = Math.abs(ballRect.left + ballRect.width / 2 - (slotRect.left + slotRect.width / 2));
        return distance < closest.distance ? { slot, distance } : closest;
    }, { distance: Infinity }).slot;

    const slotCenter = closestSlot.getBoundingClientRect().left + closestSlot.getBoundingClientRect().width / 2;
    ball.style.left = `${slotCenter - ballRect.width / 2}px`;

    closestSlot.classList.add('highlight');

    setTimeout(() => {
        closestSlot.classList.remove('highlight');
        if (!isAutoMode || (isAutoMode && currentAutoRound === autoBetRounds)) {
            enableRowSelection(); // Re-enable row selection after the ball touches the result slot and auto mode is done
        }
    }, 500);

    setTimeout(() => {
        plinkoBoard.removeChild(ball);
        calculateWinnings(multiplier);
    }, 500);
}





function calculateWinnings(multiplier) {
    const winnings = currentBet * multiplier;
    balance += winnings;
    updateBalanceDisplay();
    addToHistory(roundNumber, winnings.toFixed(2), multiplier);
    roundNumber++;
    updateSidebar(multiplier);
}

function addToHistory(round, winnings, multiplier) {
    const roundData = {
        round: round,
        amount: parseFloat(winnings).toFixed(2),
        multiplier: multiplier.toFixed(2)
    };

    historyData.unshift(roundData);
    renderHistory();
    updatePaginationControls();
}

function updateSidebar(multiplier) {
    const sidebar = document.getElementById('results-sidebar');
    const multiplierItem = document.createElement('div');
    multiplierItem.classList.add('result-item');
    multiplierItem.textContent = `${multiplier}x`;

    sidebar.prepend(multiplierItem);

    const maxItems = 5;
    while (sidebar.children.length > maxItems) {
        sidebar.removeChild(sidebar.lastChild);
    }
}

function renderHistory() {
    historyList.innerHTML = '';

    const startIndex = (currentPage - 1) * roundsPerPage;
    const endIndex = startIndex + roundsPerPage;

    const roundsToDisplay = historyData.slice(startIndex, endIndex);

    roundsToDisplay.forEach((round) => {
        const row = document.createElement('tr');
        const roundCell = document.createElement('td');
        const multiplierCell = document.createElement('td');
        const amountCell = document.createElement('td');

        roundCell.textContent = `#${round.round}`;
        multiplierCell.textContent = `${round.multiplier}x`;
        amountCell.textContent = `₹${round.amount}`;

        row.appendChild(roundCell);
        row.appendChild(multiplierCell);
        row.appendChild(amountCell);

        historyList.appendChild(row);
    });
}

function updatePaginationControls() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(historyData.length / roundsPerPage);
    const maxVisiblePages = 4;
    let startPage = currentPage - Math.floor(maxVisiblePages / 2);
    let endPage = currentPage + Math.floor(maxVisiblePages / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(maxVisiblePages, totalPages);
    }
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '◀️';
    prevButton.style.border = "none";
    prevButton.style.borderRadius = "2px";
    prevButton.style.marginRight = "2px";
    prevButton.style.background = "none";
    prevButton.disabled = currentPage === 1;

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderHistory();
            updatePaginationControls();
        }
    });

    paginationContainer.appendChild(prevButton);

    if (startPage > 1) {
        const firstPageButton = createPageButton(1);
        paginationContainer.appendChild(firstPageButton);

        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            paginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPageButton(i);
        paginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            paginationContainer.appendChild(ellipsis);
        }

        const lastPageButton = createPageButton(totalPages);
        paginationContainer.appendChild(lastPageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '▶️';
    nextButton.style.border = "none";
    nextButton.style.borderRadius = "2px";
    nextButton.style.marginLeft = "2px";
    nextButton.style.background = "none";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderHistory();
            updatePaginationControls();
        }
    });

    paginationContainer.appendChild(nextButton);
}

function createPageButton(page) {
    const pageButton = document.createElement('button');
    pageButton.textContent = page;
    pageButton.style.backgroundColor = page === currentPage ? "#00ffd5" : "";
    pageButton.style.border = "none";
    pageButton.style.borderRadius = "2px";
    pageButton.style.marginLeft = "2px";
    pageButton.style.color = "black";
    pageButton.style.fontSize = "9px";
    pageButton.style.height = "15px";

    pageButton.addEventListener('click', () => {
        currentPage = page;
        renderHistory();
        updatePaginationControls();
    });

    return pageButton;
}

document.querySelectorAll('.pre-amount-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const amount = parseFloat(button.textContent.replace('₹', '')) || balance;
        setAmount(amount);
    });
});

function setAmount(amount) {
    if (amount === undefined) {
        amount = balance;
    }
    betAmountInput.value = amount.toFixed(2);
}

function adjustAmount(multiplier) {
    let currentAmount = parseFloat(betAmountInput.value);
    if (!isNaN(currentAmount) && currentAmount > 0) {
        currentAmount *= multiplier;
        betAmountInput.value = currentAmount.toFixed(2);
    }
}

function updatePinRows() {
    const rowCount = parseInt(document.getElementById('row-count').value);
    plinkoBoard.innerHTML = '';
    createPins(rowCount);
    createResultSlots(rowCount);
}

initializePlinkoBoard();
updateBalanceDisplay();

function withdraw() {
    window.location.href = 'withdraw.html';
}

function deposit() {
    window.location.href = 'deposit.html';
}
