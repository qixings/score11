// Global Variables
let boardSize = 5;
let mineCount = 3;
let gemCount = boardSize * boardSize - mineCount;
let board = [];
let revealedCells = 0;
let gameActive = false;
let currentBet = 0;
let balance = 55245.00;
let roundNumber = 1;
let potentialProfit = 0;
let profitMultiplier = 1;
let remainingGems = gemCount;
let historyData = [];
let currentPage = 1;
const roundsPerPage = 10;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const betAmountInput = document.getElementById('bet-amount');
const minesInput = document.getElementById('mines');
const gemsInput = document.getElementById('gems');  // Gems input field
const balanceAmount = document.getElementById('balance-amount');
const betButton = document.getElementById('bet');
const cashoutButton = document.getElementById('cashout');
const historyList = document.getElementById('history-list');
const preAmountButtons = document.querySelectorAll('.pre-amount-buttons button');
const adjustAmountButtons = document.querySelectorAll('.amount-controls button');
const refreshButton = document.querySelector('.refresh');
const paginationContainer = document.getElementById('pagination');

// Load the sound files
const gemSound = new Audio('gemsound.mp3');
const mineSound = new Audio('minesound.mp3');
const cashoutSound = new Audio('cashoutSound.mp3'); // Cashout success sound
const gameOverSound = new Audio('gameOverSound.mp3'); // Game over sound


// Event Listeners
betButton.addEventListener('click', startGame);
cashoutButton.addEventListener('click', cashout);
minesInput.addEventListener('change', updateMineGemCount);
preAmountButtons.forEach(button => button.addEventListener('click', () => setAmount(button.textContent.replace('₹', '') === "All In" ? balance : parseFloat(button.textContent.replace('₹', '')))));
adjustAmountButtons.forEach(button => button.addEventListener('click', () => adjustAmount(parseFloat(button.textContent))));
refreshButton.addEventListener('click', refreshBalance);

// Initialize balance display and set mine selection options
updateBalanceDisplay();
populateMineOptions();
minesInput.value = mineCount;
updateRemainingGemsDisplay(); // Initialize the remaining gems display

// Populate mine selection options (1 to 24)
function populateMineOptions() {
    minesInput.innerHTML = ''; // Clear any existing options
    for (let i = 1; i <= 24; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        minesInput.appendChild(option);
    }
}

// Start Game Function
function startGame() {
    currentBet = parseFloat(betAmountInput.value);
    if (isNaN(currentBet) || currentBet <= 0) {
        showPopupMessage('Please enter a valid bet amount.');
        return;
    }
    if (currentBet > balance) {
        showPopupMessage('Insufficient balance to place this bet.');
        return;
    }
    balance -= currentBet;
    updateBalanceDisplay();
    gameActive = true;
    revealedCells = 0;
    profitMultiplier = calculateProfitMultiplier(); // Calculate based on mine count
    potentialProfit = currentBet;
    remainingGems = gemCount;  // Reset remaining gems for the new round
    cashoutButton.disabled = true; // Disable cashout initially
    cashoutButton.style.backgroundColor = 'rgb(0 166 177)'; // Reset cashout button color
    createBoard();
    updateButtonsState();
}
// Create Game Board
function createBoard() {
    // Clear existing board
    gameBoard.innerHTML = '';

    if (!gameActive) {
        // Display a tip message when no bet is placed
        const tipMessage = document.createElement('div');
        tipMessage.classList.add('tip-message');
        tipMessage.textContent = 'Place a bet to start the game and reveal the tiles!';
        gameBoard.appendChild(tipMessage);
        return; // Exit the function if no game is active
    }

    board = [];

    // Generate empty board
    for (let row = 0; row < boardSize; row++) {
        const rowArray = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => revealCell(row, col));
            gameBoard.appendChild(cell);
            rowArray.push({
                element: cell,
                hasMine: false,
                hasGem: false,
                revealed: false
            });
        }
        board.push(rowArray);
    }

    // Place mines and gems
    placeMinesAndGems();
}

// Place Mines and Gems Randomly
function placeMinesAndGems() {
    let minesPlaced = 0;
    let gemsPlaced = 0;
    const totalCells = boardSize * boardSize;

    if (mineCount + gemCount > totalCells) {
        showPopupMessage('Too many mines and gems for the board size.');
        return;
    }

    while (minesPlaced < mineCount || gemsPlaced < gemCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        const cell = board[row][col];

        if (!cell.hasMine && !cell.hasGem) {
            if (minesPlaced < mineCount) {
                cell.hasMine = true;
                minesPlaced++;
            } else if (gemsPlaced < gemCount) {
                cell.hasGem = true;
                gemsPlaced++;
            }
        }
    }
}




// Reveal Cell on Click
function revealCell(row, col) {
    if (!gameActive) {
        showPopupMessage('Please place a bet to start the game.');
        return;
    }

    const cell = board[row][col];
    if (cell.revealed) return;

    cell.revealed = true;

    if (cell.hasMine) {
        const mineIcon = document.createElement('div');
        mineIcon.classList.add('mine');
        cell.element.appendChild(mineIcon);
        cell.element.style.backgroundColor = '#000000';  // Change to a red color when a mine is revealed
        mineSound.play();  // Play mine sound

        // Disable cashout button, change its color to red, and set amount to 0
        cashoutButton.disabled = true;
        cashoutButton.style.backgroundColor = '#ff0000';  // Change color to red
        cashoutButton.textContent = `CASHOUT ₹0`;  // Set cashout amount to 0

        revealAllTiles();  // Reveal all tiles when a mine is hit
        setTimeout(() => gameOver(), 1800);  // Delay the game over popup slightly for effect
    } else if (cell.hasGem) {
        const gemIcon = document.createElement('div');
        gemIcon.classList.add('gem');
        cell.element.appendChild(gemIcon);
        cell.element.style.backgroundColor = '#000000';  // Change to a green color when a gem is revealed
        gemSound.play();  // Play gem sound
        revealedCells++;
        remainingGems--;  // Decrease the number of remaining gems
        updateProfit();
        updateRemainingGemsDisplay(); // Update remaining gems display

        cashoutButton.disabled = false; // Enable cashout after revealing at least one tile
        cashoutButton.style.backgroundColor = '#ff7f00'; // Change cashout button color to orange

        // Delay win check to ensure gem is shown first
        setTimeout(() => {
            checkWinCondition();
        }, 200); // 200ms delay to allow the UI to update
    } else {
        cell.element.style.backgroundColor = '#888';
    }
}




// Update Potential Profit
function updateProfit() {
    profitMultiplier += 0.2; // Increase multiplier by 0.2 for each gem found
    potentialProfit = (currentBet * profitMultiplier).toFixed(2);
    cashoutButton.textContent = `CASHOUT ₹${potentialProfit}`;
    cashoutButton.style.backgroundColor = '#ff7f00'; // Change color to orange when there's a potential profit
}

// Check Win Condition
function checkWinCondition() {
    // If the number of revealed gems matches the gem count, the player wins
    if (revealedCells === gemCount) {
        showPopupMessage(`Congratulations! You found all gems and won ₹${potentialProfit}`, () => {
            addToHistory(potentialProfit);
            balance += parseFloat(potentialProfit);
            updateBalanceDisplay();
            resetGame();
        });
    }
}

function cashout() {
    if (!gameActive || revealedCells === 0) return; // Ensure at least one tile is revealed before cashout

    revealAllTiles();  // Reveal all tiles when cashing out

    cashoutSound.play(); // Play cashout success sound

    showPopupMessage(`You have cashed out and won ₹${potentialProfit}`, () => {
        addToHistory(potentialProfit);
        balance += parseFloat(potentialProfit);
        updateBalanceDisplay();
        resetGame();
    });
}

function revealAllTiles() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = board[row][col];
            if (!cell.revealed) {
                cell.revealed = true;
                if (cell.hasMine) {
                    const mineIcon = document.createElement('div');
                    mineIcon.classList.add('mine');
                    cell.element.appendChild(mineIcon);
                    cell.element.style.backgroundColor = '#000000';  // Change to a red color when a mine is revealed
                } else if (cell.hasGem) {
                    const gemIcon = document.createElement('div');
                    gemIcon.classList.add('gem');
                    cell.element.appendChild(gemIcon);
                    cell.element.style.backgroundColor = '#000000';  // Change to a green color when a gem is revealed
                } else {
                    cell.element.style.backgroundColor = '#888';
                }
            }
        }
    }
}


function gameOver() {
    gameOverSound.play(); // Play game over sound

    showPopupMessage('Game Over! You hit a mine.', () => {
        cashoutButton.textContent = `CASHOUT ₹0`; // Set cashout button to show ₹0
        cashoutButton.style.backgroundColor = '#ff0000'; // Change color to red when the game is over
        addToHistory(0);
        resetGame();
    });
}

// Reset Game State
function resetGame() {
    gameActive = false;
    currentBet = 0;
    potentialProfit = 0;
    profitMultiplier = 1;

    // Reset mineCount and gemCount
    mineCount = parseInt(minesInput.value) || 3; // Default to 3 mines if input is invalid
    gemCount = boardSize * boardSize - mineCount; // Recalculate remaining gems based on the current mine count

    remainingGems = gemCount; // Reset remaining gems

    // Reset the minesInput dropdown to the selected value
    minesInput.value = mineCount;

    cashoutButton.textContent = 'CASHOUT'; // Reset cashout button
    cashoutButton.style.backgroundColor = 'rgb(0 166 177)'; // Reset color to original blue (or your default color)

    updateButtonsState();
    createBoard(); // Re-create the board, which will also show the tip message
    updateRemainingGemsDisplay(); // Update the display for remaining gems
}


// Update Buttons State
function updateButtonsState() {
    betButton.disabled = gameActive;
    cashoutButton.disabled = !gameActive;
    minesInput.disabled = gameActive;
    betAmountInput.disabled = gameActive;
    preAmountButtons.forEach(button => button.disabled = gameActive);
    adjustAmountButtons.forEach(button => button.disabled = gameActive);
}

// Set Bet Amount from Preset Buttons
function setAmount(amount) {
    betAmountInput.value = amount.toFixed(2);
}

// Adjust Bet Amount
function adjustAmount(factor) {
    let amount = parseFloat(betAmountInput.value) || 0;
    amount *= factor;
    betAmountInput.value = amount.toFixed(2);
}

// Update Mine and Gem Counts
function updateMineGemCount() {
    mineCount = parseInt(minesInput.value) || 0;
    gemCount = boardSize * boardSize - mineCount;  // Automatically calculate gem count based on mine count

    if (mineCount < 1) mineCount = 1;
    if (gemCount < 1) gemCount = 1; // Ensure at least 1 gem

    remainingGems = gemCount;  // Reset remaining gems when counts are updated
    updateRemainingGemsDisplay();  // Update the display for remaining gems
}

// Update Balance Display
function updateBalanceDisplay() {
    balanceAmount.textContent = balance.toFixed(2);
}

// Refresh Balance
function refreshBalance() {
    showPopupMessage('Balance refreshed!');
    updateBalanceDisplay();
}

// Add Result to History
function addToHistory(amountWon) {
    const roundData = {
        round: roundNumber,
        amount: parseFloat(amountWon).toFixed(2)
    };

    // Add the round data to the historyData array
    historyData.unshift(roundData);

    // Update the round number
    roundNumber++;

    // Render the updated history
    renderHistory();

    // Update the pagination controls
    updatePaginationControls();
}

// Function to calculate the profit multiplier based on the number of mines selected
function calculateProfitMultiplier() {
    return 1 + (mineCount / 5);
}

// Function to update the remaining gems display
function updateRemainingGemsDisplay() {
    gemsInput.value = remainingGems;
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

// Deposit Function
function deposit() {
    // Redirect to the deposit page
    window.location.href = 'deposit.html';
}

// Withdraw Function
function withdraw() {
    // Redirect to the withdraw page
    window.location.href = 'withdraw.html';
}

// Popup Message Function
function showPopupMessage(message, callback) {
    // Create an overlay
    const overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');

    // Create the popup box
    const popupBox = document.createElement('div');
    popupBox.classList.add('popup-box');

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (callback) callback(); // Execute the callback after the popup is closed
    });

    // Append elements to the popup box
    popupBox.appendChild(messageElement);
    popupBox.appendChild(closeButton);

    // Append the popup box to the overlay
    overlay.appendChild(popupBox);

    // Append the overlay to the body
    document.body.appendChild(overlay);
}




