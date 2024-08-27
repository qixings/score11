let balance = 55555.45;
let serialNumber = 2024061800001;
let timerDuration = 10; // 1 minute in seconds
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

        if (timeRemaining <= 5) {
            disableBetting();
            closeBetPopup(); // Automatically close the bet popup if open
            showCountdownPopup(timeRemaining);
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            hideCountdownPopup();
            showResult();
        }
    }, 1000);
}



function closeBetPopup() {
    const betPopup = document.getElementById('bet-popup');
    if (betPopup.classList.contains('show')) {
        betPopup.classList.remove('show'); // Close the popup if it's open
    }
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

    if (timerDuration <= 5) { // Disable placing bet during last 5 seconds
        alert('Betting is closed. Please wait for the next round.');
        return;
    }

    balance -= betAmount;
    document.getElementById('balance-amount').textContent = balance.toFixed(2);
    addBetToLists(selectedColor, betAmount);
    closeBetPopup(); // Close the popup after placing the bet
}



function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function disableBetting() {
    const colors = document.querySelectorAll('.color');
    colors.forEach(color => {
        color.style.pointerEvents = 'none';
        color.style.opacity = '0.5'; // Reduce opacity to indicate disabled state
    });
}

function showCountdownPopup(secondsRemaining) {
    const countdownPopup = document.getElementById('countdown-popup');
    countdownPopup.textContent = secondsRemaining; // Display the remaining seconds
    countdownPopup.classList.add('show');
}

function hideCountdownPopup() {
    const countdownPopup = document.getElementById('countdown-popup');
    countdownPopup.classList.remove('show');
}







function startBreathingEffect() {
    const colors = document.querySelectorAll('.color');
    colors.forEach(color => {
        color.classList.add('breathing'); // Add the breathing effect
    });
}

function stopBreathingEffect() {
    const colors = document.querySelectorAll('.color');
    colors.forEach(color => {
        color.classList.remove('breathing'); // Remove the breathing effect
    });
}

function showResult() {
    stopBreathingEffect(); // Stop the breathing effect before shuffling

    let possibleColors = ['red', 'purple', 'green'];
    let shuffleInterval;
    let shuffleDuration = 2000; // Total duration of shuffling (in milliseconds)
    let shuffleSpeed = 100; // Speed of shuffling (time between switches in milliseconds)

    const colors = document.querySelectorAll('.color');
    const serialNumberElement = document.getElementById('serial-number');

    // Start shuffling with a smooth transition
    shuffleInterval = setInterval(() => {
        let randomColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];
        colors.forEach(color => {
            color.style.transition = 'opacity 0.3s, transform 0.5s'; // Smooth transition
            color.style.opacity = (color.id === randomColor) ? 1 : 0.5;
            color.style.transform = (color.id === randomColor) ? 'scale(1.5)' : 'scale(1)';
        });
    }, shuffleSpeed);

    // Stop shuffling and show the result after shuffleDuration
    setTimeout(() => {
        clearInterval(shuffleInterval);
        currentResult = possibleColors[Math.floor(Math.random() * possibleColors.length)];

        colors.forEach(color => {
            if (color.id === currentResult) {
                color.classList.add('zoom');
                color.style.position = 'absolute';
                color.style.top = '50%';
                color.style.left = '50%';
                color.style.transform = 'translate(-50%, -50%) scale(2)'; // Increased zoom
                color.style.zIndex = '10'; // Bring the winning color to the front
                color.style.opacity = 1; // Ensure the winning color is fully visible

                // Adjust serial number position based on the zoomed image position
                serialNumberElement.style.position = 'relative';
                serialNumberElement.style.left = '50%';
                serialNumberElement.style.transform = 'translateX(-50%)';
            } else {
                color.style.opacity = 0; // Hide the other colors
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

        // Reset colors for next round
        setTimeout(() => {
            colors.forEach(color => {
                color.classList.remove('zoom');
                color.style.position = '';
                color.style.top = '';
                color.style.left = '';
                color.style.transform = 'scale(1)';
                color.style.zIndex = '';
                color.style.opacity = 1; // Reset opacity for all colors

                // Reset serial number position
                serialNumberElement.style.position = 'relative';
                serialNumberElement.style.left = '0';
                serialNumberElement.style.transform = 'none';
            });
            startBreathingEffect(); // Restart the breathing effect for the next round
            startNewRound();
        }, 4000);
    }, shuffleDuration);
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
    enableBetting(); // Re-enable betting for the new round
}

function enableBetting() {
    const colors = document.querySelectorAll('.color');
    colors.forEach(color => {
        color.style.pointerEvents = 'auto';
        color.style.opacity = '1'; // Restore opacity
    });
}

function updateSerialNumber() {
    serialNumber++;
    document.getElementById('serial-number').textContent =  serialNumber;
}

function showBetPopup(color) {
    if (timerDuration > 5) { // Ensure betting is allowed only when more than 5 seconds are remaining
        selectedColor = color;
        document.getElementById('bet-popup').classList.add('show');
    }
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

    if (timerDuration <= 5) { // Disable placing bet during last 5 seconds
        alert('Betting is closed. Please wait for the next round.');
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
    
    // Create the image element for the bet color
    const colorImage = document.createElement('img');
    colorImage.style.width = '30px'; // Set the size of the image
    colorImage.style.height = '30px'; // Set the size of the image
    colorImage.style.left = '0px';
    if (betEntry.color === 'red') {
        colorImage.src = 'red.png'; // Path to the red image
    } else if (betEntry.color === 'purple') {
        colorImage.src = 'PURPLE.png'; // Path to the purple image
    } else if (betEntry.color === 'green') {
        colorImage.src = 'GREEN.png'; // Path to the green image
    }

    listItem.innerHTML = `<td>${betEntry.serial}</td><td></td><td>₹${betEntry.amount.toFixed(2)}</td>`;
    listItem.children[1].appendChild(colorImage); // Append the image to the "Bet on" cell
    publicBetsList.prepend(listItem); // Add to the top of the public bets list
}


function addMyBet(betEntry) {
    const myBetsList = document.getElementById('my-bets-list');
    const listItem = document.createElement('tr');
    
    // Create the image element for the bet color
    const colorImage = document.createElement('img');
    colorImage.style.width = '30px'; // Set the size of the image
    colorImage.style.height = '30px'; // Set the size of the image
    colorImage.style.left = '0px';
    
    if (betEntry.color === 'red') {
        colorImage.src = 'red.png'; // Path to the red image
    } else if (betEntry.color === 'purple') {
        colorImage.src = 'PURPLE.png'; // Path to the purple image
    } else if (betEntry.color === 'green') {
        colorImage.src = 'GREEN.png'; // Path to the green image
    }

    listItem.innerHTML = `<td>${betEntry.serial}</td><td></td><td>₹${betEntry.amount.toFixed(2)}</td><td id="my-bet-${betEntry.serial}"></td>`;
    listItem.children[1].appendChild(colorImage); // Append the image to the "Bet on" cell
    myBetsList.prepend(listItem); // Add to the top of the my bets list
}


function addGameHistory(resultEntry) {
    const gameHistoryList = document.getElementById('game-history-list');
    const listItem = document.createElement('tr');
    
    // Create the image element for the winning color
    const colorImage = document.createElement('img');
    colorImage.style.width = '30px'; // Set the size of the image
    colorImage.style.height = '30px'; // Set the size of the image
    colorImage.style.left = '0px';
    
    if (resultEntry.result === 'red') {
        colorImage.src = 'red.png'; // Path to the red image
    } else if (resultEntry.result === 'purple') {
        colorImage.src = 'PURPLE.png'; // Path to the purple image
    } else if (resultEntry.result === 'green') {
        colorImage.src = 'GREEN.png'; // Path to the green image
    }

    listItem.innerHTML = `<td>${resultEntry.serial}</td><td></td>`;
    listItem.children[1].appendChild(colorImage); // Append the image to the second cell
    gameHistoryList.prepend(listItem); // Add to the top of the history list
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

    // Add click event listeners to the color elements
    const colors = document.querySelectorAll('.color');
    colors.forEach(color => {
        color.addEventListener('click', () => showBetPopup(color.id));
    });
});
