let balance = 55555.45;
let serialNumber = 2024061800001;
let timerDuration = 60; // 1 minute in seconds
let timerInterval;
let selectedColor;
let myBets = [];
let gameHistory = [];
let publicBets = [];
let currentResult;

function startTimer() {
    clearInterval(timerInterval);
    let timeRemaining = timerDuration;
    document.getElementById('timer-value').textContent = formatTime(timeRemaining);

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer-value').textContent = formatTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showResult();
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}






function showResult() {
    // Possible colors: 'red', 'purple', 'green'
    let possibleColors = ['red', 'purple', 'green', 'green', 'green']; // Adjust probability for purple
    currentResult = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    const colors = document.querySelectorAll('.color');

    // Shuffle animation
    colors.forEach(color => {
        color.style.animation = 'shuffle 1s infinite';
    });

    // Show winning color with zoom effect after shuffle animation
    setTimeout(() => {
        colors.forEach(color => {
            color.style.animation = '';
            if (color.id === currentResult) {
                color.classList.add('zoom');
            } else {
                color.style.opacity = 0;
            }
        });

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

        // Reset selectedColor
        selectedColor = null;
    }, 2000); // Duration of shuffle animation

    // Reset after showing the result
    setTimeout(() => {
        colors.forEach(color => {
            color.classList.remove('zoom');
            color.style.opacity = 1;
        });
        startNewRound();
    }, 4000); // Duration to show winning color
}

function updateMyBets() {
    myBets.forEach(bet => {
        if (bet.result === null) {
            if (bet.color === currentResult) {
                if (currentResult === 'purple') {
                    bet.result = 'Won 3.96x';
                    let winnings = bet.amount * 3.96; // 4x multiplier for purple
                    balance += winnings;
                    document.getElementById('balance-amount').textContent = balance.toFixed(2);
                    document.getElementById(`my-bet-${bet.serial}`).textContent = `${bet.result} - ₹${winnings.toFixed(2)}`;
                } else {
                    bet.result = 'Won';
                    let winnings = bet.amount * 1.96; // Adjust multiplier for other colors if needed
                    balance += winnings;
                    document.getElementById('balance-amount').textContent = balance.toFixed(2);
                    document.getElementById(`my-bet-${bet.serial}`).textContent = `${bet.result} - ₹${winnings.toFixed(2)}`;
                }
            } else {
                bet.result = 'Lost';
                let winnings = -bet.amount;
                document.getElementById(`my-bet-${bet.serial}`).textContent = `${bet.result} - ₹${winnings.toFixed(2)}`;
            }
        }
    });
}







function startNewRound() {
    updateSerialNumber();
    startTimer();
}

function updateSerialNumber() {
    serialNumber++;
    document.getElementById('serial-number').textContent =  serialNumber;
}

function showBetPopup(color) {
    selectedColor = color;
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
    addBetToLists(selectedColor, betAmount);
    cancelBet();
}

function addBetToLists(color, amount) {
    const betEntry = {
        serial: serialNumber,
        color: color,
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
    listItem.innerHTML = `<td>${betEntry.serial}</td><td>${betEntry.color}</td><td>₹${betEntry.amount.toFixed(2)}</td>`;
    publicBetsList.prepend(listItem); // Add to the top
}

function addMyBet(betEntry) {
    const myBetsList = document.getElementById('my-bets-list');
    const listItem = document.createElement('tr');
    listItem.innerHTML = `<td>${betEntry.serial}</td><td>${betEntry.color}</td><td>₹${betEntry.amount.toFixed(2)}</td><td id="my-bet-${betEntry.serial}"></td>`;
    myBetsList.prepend(listItem); // Add to the top
}

function updateMyBets() {
    myBets.forEach(bet => {
        if (bet.result === null) {
            bet.result = bet.color === currentResult ? 'Won' : 'Lost';
            const listItem = document.getElementById(`my-bet-${bet.serial}`);
            if (listItem) {
                let winnings = 0;
                if (bet.result === 'Won') {
                    winnings = bet.amount * 2; // Adjust multiplier for winnings based on color odds
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

function addGameHistory(resultEntry) {
    const gameHistoryList = document.getElementById('game-history-list');
    const listItem = document.createElement('tr');
    listItem.innerHTML = `<td>${resultEntry.serial}</td><td>${resultEntry.result}</td>`;
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

    // Check if there is a selectedColor (assuming selectedColor is where the bet color is stored)
    if (typeof selectedColor !== 'undefined' && selectedColor !== null) {
        resultPopup.classList.add('show');
        betNumber.textContent = `Bet on: ${selectedColor}`;
        serialNumberElement.textContent = `${serialNumber}`; // Set the serial number

        // Check if the current result matches the selected color
        if (currentResult === selectedColor) {
            resultMessage.textContent = 'You Won!';
            winningAmount.textContent = `Winning Amount: ₹${(myBets[0].amount * 2).toFixed(2)}`; // Adjust for color odds
        } else {
            resultMessage.textContent = 'Sorry, You Lost!';
            winningAmount.textContent = `Losing Amount: -₹${myBets[0].amount.toFixed(2)}`;
            // Apply black and white effect
            resultPopup.classList.add('black-and-white');
        }
    } else {
        // No bet placed scenario
        resultMessage.textContent = 'No bet placed.';
        serialNumberElement.textContent = ''; // Clear the serial number
        betNumber.textContent = '';
        winningAmount.textContent = '';
    }

    // Reset the selected color after showing the popup
    selectedColor = null;
}

function closeResultPopup() {
    const resultPopup = document.getElementById('result-popup');
    resultPopup.classList.remove('show');
}

// Initial function calls
document.addEventListener('DOMContentLoaded', () => {
    startTimer(); // Assuming this is for starting some game timer or process
});

// Function to refresh the balance
function refreshBalance() {
    // Simulate fetching balance from the server
    // In a real application, you would make an API call here and update the balance variable
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

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
});
document.addEventListener('DOMContentLoaded', () => {
    startTimer();

    // Add click event listeners to the color elements
    const colors = document.querySelectorAll('.color');
    colors.forEach(color => {
        color.addEventListener('click', () => showBetPopup(color.id));
    });
});
