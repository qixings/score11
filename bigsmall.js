let balance = 55555.45;
let serialNumber = 2024061800001;
let timerDuration = 15; // 15 seconds
let timerInterval;
let selectedSize;
let myBets = [];
let gameHistory = [];
let publicBets = [];
let currentResult;

function startTimer() {
    clearInterval(timerInterval);
    let timeRemaining = timerDuration;
    document.getElementById('timer-value').textContent = formatTime(timeRemaining);

    // Start the breathing effect
    const bigButton = document.getElementById('big');
    const smallButton = document.getElementById('small');
    bigButton.classList.add('breathing');
    smallButton.classList.add('breathing');

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer-value').textContent = formatTime(timeRemaining);

        // When 5 seconds are left, disable betting and show countdown
        if (timeRemaining <= 5 && timeRemaining > 0) {
            disableBetting();
            showCountdown(timeRemaining);
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);

            // Stop the breathing effect before showing the result
            bigButton.classList.remove('breathing');
            smallButton.classList.remove('breathing');

            hideCountdown();
            showResult();
        }
    }, 1000);
}

function disableBetting() {
    const betButtons = document.querySelectorAll('.money-button, .pre-amount-button');
    betButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5'; // Optional: Make buttons look disabled
    });
}

function enableBetting() {
    const betButtons = document.querySelectorAll('.money-button, .pre-amount-button');
    betButtons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1'; // Reset button opacity
    });
}

function showCountdown(seconds) {
    const countdownOverlay = document.querySelector('.countdown-overlay');
    countdownOverlay.textContent = seconds;
    countdownOverlay.classList.add('show');
}

function hideCountdown() {
    const countdownOverlay = document.querySelector('.countdown-overlay');
    countdownOverlay.classList.remove('show');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function showResult() {
    let possibleSizes = ['big', 'small'];
    currentResult = possibleSizes[Math.floor(Math.random() * possibleSizes.length)];
    const bigButton = document.getElementById('big');
    const smallButton = document.getElementById('small');

    // Ensure all previous animations are cleared
    bigButton.classList.remove('big-zoom', 'fade-out');
    smallButton.classList.remove('small-zoom', 'fade-out');
    
    // Trigger reflow to reset the CSS animation (forces the browser to recognize the removed classes)
    void bigButton.offsetWidth;
    void smallButton.offsetWidth;
    
    // Add shuffle effect before deciding the result
    bigButton.classList.add('shuffle', 'big-shuffle');
    smallButton.classList.add('shuffle', 'small-shuffle');

    // Decide and reveal the result
    setTimeout(() => {
        // Remove shuffle effect
        bigButton.classList.remove('shuffle', 'big-shuffle');
        smallButton.classList.remove('shuffle', 'small-shuffle');

        // Apply respective zoom and fade classes
        if (currentResult === 'big') {
            bigButton.classList.add('big-zoom');
            smallButton.classList.add('fade-out');
        } else {
            smallButton.classList.add('small-zoom');
            bigButton.classList.add('fade-out');
        }

        // Record the result in game history
        const resultEntry = { serial: serialNumber, result: currentResult };
        gameHistory.unshift(resultEntry); // Add to the top
        addGameHistory(resultEntry);

        // Update my bets with win/loss
        updateMyBets();

        // Show result popup only if a bet was placed
        if (myBets.length > 0) {
            showResultPopup();
        }

        // Reset selectedSize
        selectedSize = null;
    }, 2000); // Duration of shuffle effect

    // Reset after showing the result
    setTimeout(() => {
        // Explicitly remove zoom and fade-out classes
        bigButton.classList.remove('big-zoom', 'fade-out');
        smallButton.classList.remove('small-zoom', 'fade-out');

        // Start the next round
        startNewRound();
    }, 4000); // Duration to show winning size
}

function startNewRound() {
    updateSerialNumber();
    enableBetting();
    startTimer();

    // Ensure animations are reset before starting the next round
    const bigButton = document.getElementById('big');
    const smallButton = document.getElementById('small');
    bigButton.classList.remove('big-zoom', 'fade-out');
    smallButton.classList.remove('small-zoom', 'fade-out');
}

function updateMyBets() {
    myBets.forEach(bet => {
        if (bet.result === null) {
            bet.result = bet.size === currentResult ? 'Won' : 'Lost';
            const listItem = document.getElementById(`my-bet-${bet.serial}`);
            if (listItem) {
                let winnings = 0;
                if (bet.result === 'Won') {
                    winnings = bet.amount * 2; // 2x multiplier for BIG/SMALL
                    balance += winnings;
                    document.getElementById('balance-amount').textContent = balance.toFixed(2);
                } else {
                    winnings = -bet.amount;
                }
                listItem.textContent = `${bet.result} - ₹${winnings.toFixed(2)}`;
            }
        }
    });
}

function updateSerialNumber() {
    serialNumber++;
    document.getElementById('serial-number').textContent = serialNumber;
}

function showBetPopup(size) {
    selectedSize = size;
    document.getElementById('bet-popup').classList.add('show');
}

function cancelBet() {
    document.getElementById('bet-popup').classList.remove('show');
}

function setAmount(amount) {
    document.getElementById('bet-amount').value = amount;
}

function placeBet() {
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount.');
        return;
    }

    if (betAmount > balance) {
        alert('Insufficient balance.');
        return;
    }

    balance -= betAmount;
    document.getElementById('balance-amount').textContent = balance.toFixed(2);
    addBetToLists(selectedSize, betAmount);
    cancelBet();
}

function addBetToLists(size, amount) {
    const betEntry = {
        serial: serialNumber,
        size: size,
        amount: amount,
        result: null
    };

    // Add to Public Bets
    publicBets.unshift(betEntry); // Add to the top
    addPublicBet(betEntry);

    // Add to My Bets
    myBets.unshift(betEntry); // Add to the top
    addMyBet(betEntry);
}

function addPublicBet(betEntry) {
    const publicBetsList = document.getElementById('public-bets-list');
    const listItem = document.createElement('tr');
    listItem.innerHTML = `<td>${betEntry.serial}</td><td>${betEntry.size.toUpperCase()}</td><td>₹${betEntry.amount.toFixed(2)}</td>`;
    publicBetsList.prepend(listItem); // Add to the top
}

function addMyBet(betEntry) {
    const myBetsList = document.getElementById('my-bets-list');
    const listItem = document.createElement('tr');
    listItem.innerHTML = `<td>${betEntry.serial}</td><td>${betEntry.size.toUpperCase()}</td><td>₹${betEntry.amount.toFixed(2)}</td><td id="my-bet-${betEntry.serial}"></td>`;
    myBetsList.prepend(listItem); // Add to the top
}

function addGameHistory(resultEntry) {
    const gameHistoryList = document.getElementById('game-history-list');
    const listItem = document.createElement('tr');
    listItem.innerHTML = `<td>${resultEntry.serial}</td><td>${resultEntry.result.toUpperCase()}</td>`;
    gameHistoryList.prepend(listItem); // Add to the top
}

function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-buttons button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabName).style.display = 'block';

    // Add active class to the clicked button
    event.target.classList.add('active');
}

function showResultPopup() {
    const resultPopup = document.getElementById('result-popup');
    const resultMessage = document.getElementById('result-message');
    const betNumber = document.getElementById('bet-number');
    const winningAmount = document.getElementById('winning-amount');
    const serialNumberElement = document.getElementById('serial-number'); // New serial number element

    // Reset the background effect
    resultPopup.classList.remove('black-and-white');

    // Check if there is a selectedSize (assuming selectedSize is where the bet size is stored)
    if (typeof selectedSize !== 'undefined' && selectedSize !== null) {
        resultPopup.classList.add('show');
        betNumber.textContent = `Bet on: ${selectedSize.toUpperCase()}`;
        serialNumberElement.textContent = `${serialNumber}`; // Set the serial number

        // Check if the current result matches the selected size
        if (currentResult === selectedSize) {
            resultMessage.textContent = 'You Won!';
            winningAmount.textContent = `Winning Amount: ₹${(myBets[0].amount * 2).toFixed(2)}`; // Adjust for size odds
        } else {
            resultMessage.textContent = 'Sorry, You Lost!';
            winningAmount.textContent = `Losing Amount: -₹${myBets[0].amount.toFixed(2)}`;
            // Apply black-and-white effect
            resultPopup.classList.add('black-and-white');
        }
    } else {
        // No bet placed scenario
        resultMessage.textContent = 'No bet placed.';
        serialNumberElement.textContent = ''; // Clear the serial number
        betNumber.textContent = '';
        winningAmount.textContent = '';
    }

    // Reset the selected size after showing the popup
    selectedSize = null;
}

function closeResultPopup() {
    const resultPopup = document.getElementById('result-popup');
    resultPopup.classList.remove('show');
}

// Initial function calls
document.addEventListener('DOMContentLoaded', () => {
    startTimer(); // Start the game timer

    // Add click event listeners to the BIG and SMALL buttons
    const sizes = document.querySelectorAll('.size-button');
    sizes.forEach(size => {
        size.addEventListener('click', () => showBetPopup(size.id));
    });
});

// Function to refresh the balance
function refreshBalance() {
    // Simulate fetching balance from the server
    const updatedBalance = balance; // Simulate fetched balance (no change in this demo)
    document.getElementById('balance-amount').textContent = updatedBalance.toFixed(2);

    // Add rotate animation
    const refreshIcon = document.querySelector('.fa-arrows-rotate');
    refreshIcon.classList.add('rotate');

    // Remove rotate animation after 1 second
    setTimeout(() => {
        refreshIcon.classList.remove('rotate');
    }, 1000);
}

document.querySelector('.fa-arrows-rotate').addEventListener('click', refreshBalance);





