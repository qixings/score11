let currentAmount = 0;
let autoSpinAmount = 0;
let autoSpinInterval;
let balance = 55245.00; // Initial balance
let isAutoSpinning = false;
let historyList = []; // Store history records
let currentPage = 1;
const recordsPerPage = 10;
const pagesToShow = 4; // Number of pages to show in pagination
let cumulativeRotation = 0; // Track cumulative rotation

function setAmount(amount) {
    currentAmount = amount;
    document.getElementById('bet-amount').value = amount;
}

function setAutoAmount(amount) {
    autoSpinAmount = amount;
    document.getElementById('auto-bet-amount').value = amount;
}

function adjustAmount(multiplier) {
    let amount = parseFloat(document.getElementById('bet-amount').value);
    if (!isNaN(amount) && amount > 0) {
        currentAmount = amount * multiplier;
        document.getElementById('bet-amount').value = currentAmount.toFixed(2);
    }
}

function adjustAutoAmount(multiplier) {
    let amount = parseFloat(document.getElementById('auto-bet-amount').value);
    if (!isNaN(amount) && amount > 0) {
        autoSpinAmount = amount * multiplier;
        document.getElementById('auto-bet-amount').value = autoSpinAmount.toFixed(2);
    }
}

function spin() {
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    
    if (isNaN(betAmount) || betAmount <= 0) {
        showWarning("Please enter or select an amount to spin.");
        return; // Exit the function to prevent spinning without a valid amount
    }

    if (isAutoSpinning) {
        showWarning("Auto Spin is currently running. Please stop Auto Spin before placing a manual bet.");
        return; // Exit the function to prevent manual spin while Auto Spin is active
    }

    currentAmount = betAmount;

    spinWheel(function(winningMultiplier) {
        let winnings = currentAmount * winningMultiplier;
        updateBalance(winnings);
        addHistoryRecord(winningMultiplier, winnings);
        displayHistory();
    });
}

function toggleAutoSpin() {
    if (isAutoSpinning) {
        stopAutoSpin();
    } else {
        startAutoSpin();
    }
}

function startAutoSpin() {
    const autoBetAmount = parseFloat(document.getElementById('auto-bet-amount').value);
    
    if (isNaN(autoBetAmount) || autoBetAmount <= 0) {
        showWarning("Please enter or select an amount for Auto Spin.");
        return; // Exit the function to prevent starting Auto Spin without a valid amount
    }

    if (isAutoSpinning) {
        showWarning("Auto Spin is already running.");
        return; // Do not start a new Auto Spin if one is already active
    }

    autoSpinAmount = autoBetAmount;

    isAutoSpinning = true;
    const autoSpinButton = document.getElementById('auto-spin-button');
    autoSpinButton.textContent = "STOP";
    autoSpinButton.style.backgroundColor = "#ff7f00"; // Change button color to orange
    autoSpinSequence();
}

function stopAutoSpin() {
    clearInterval(autoSpinInterval);
    isAutoSpinning = false;
    const autoSpinButton = document.getElementById('auto-spin-button');
    autoSpinButton.textContent = "AUTO SPIN";
    autoSpinButton.style.backgroundColor = "#1fa400"; // Revert button color to original green
}

function autoSpinSequence() {
    if (isAutoSpinning) {
        spinWheel(function(winningMultiplier) {
            let winnings = autoSpinAmount * winningMultiplier;
            updateBalance(winnings);
            addHistoryRecord(winningMultiplier, winnings);
            displayHistory();

            // Wait for a brief moment before starting the next spin
            setTimeout(autoSpinSequence, 1000); // Adjust the delay as needed
        });
    }
}

function spinWheel(callback) {
    const wheel = document.getElementById('wheel');
    const spinSound = document.getElementById('spin-sound');
    const totalSegments = 16;
    const segmentAngle = 360 / totalSegments;
    const rotations = 360 * 5; // 5 full rotations

    const multipliers = [0.3, 0.5, 0.9, 1, 1.3, 1.5, 1.9, 2, 2.3, 2.5, 2.9, 3, 3.3, 3.5, 3.9, 4];
    
    // Randomly select a segment index
    const segmentIndex = Math.floor(Math.random() * multipliers.length);
    const winningMultiplier = multipliers[segmentIndex];

    // Calculate the exact angle where the wheel should stop (center of the segment)
    const landingAngle = (segmentIndex * segmentAngle) + (segmentAngle / 2);

    // Adjust the landing angle if necessary (to match the visual indicator)
    const visualOffset = -9; // Adjust this value as needed (in degrees)
    const adjustedLandingAngle = landingAngle + visualOffset;

    const spinAmount = rotations + adjustedLandingAngle;

    // Apply the cumulative rotation
    cumulativeRotation += spinAmount;

    // Set the volume for the spin sound
    spinSound.volume = 0.07; // Adjust this value between 0.0 and 1.0

    // Play the spin sound
    spinSound.currentTime = 0;
    spinSound.play();

    // Spin the wheel
    wheel.style.transition = 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)';
    wheel.style.transform = `rotate(${cumulativeRotation}deg)`;

    // Trigger the callback after the spin is done
    setTimeout(() => {
        spinSound.pause();
        spinSound.currentTime = 0; // Reset the sound to the beginning
        callback(winningMultiplier);
    }, 4000); // Match the duration of the spin
}

  




function updateBalance(winnings) {
    balance += winnings; // Add the winnings to the balance
    document.getElementById('balance-amount').textContent = balance.toFixed(2); // Update the displayed balance
}

function addHistoryRecord(multiplier, winnings) {
    // Add new record at the beginning of the list for most recent first
    historyList.unshift({ multiplier, winnings });
    displayHistory();
}

function displayHistory() {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const currentHistory = historyList.slice(start, end);

    const historyContainer = document.getElementById('history-list');
    historyContainer.innerHTML = '';

    currentHistory.forEach(record => {
        let newRow = document.createElement('tr');

        // Multiplier Cell
        let multiplierCell = document.createElement('td');
        multiplierCell.textContent = record.multiplier + "x";
        multiplierCell.style.color = getMultiplierColor(record.multiplier);
        newRow.appendChild(multiplierCell);

        // Winnings Cell
        let winningsCell = document.createElement('td');
        winningsCell.textContent = "+₹" + record.winnings.toFixed(2);
        winningsCell.style.color = getWinningsColor(record.winnings);
        newRow.appendChild(winningsCell);

        historyContainer.appendChild(newRow);
    });

    displayPagination();
}

function displayPagination() {
    const totalPages = Math.ceil(historyList.length / recordsPerPage);
    const paginationContainer = document.getElementById('pagination');

    paginationContainer.innerHTML = '';

    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    // Display page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.style.backgroundColor = i === currentPage ? "#00ffd5" : ""; // Highlight the active page
        pageButton.style.border = "none";
        pageButton.style.borderRadius = "2px";
        pageButton.style.marginLeft = "2px";
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayHistory();
        });
        paginationContainer.appendChild(pageButton);
    }

    // Display "Next" button if there are more pages
    if (endPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = "Next";
        nextButton.addEventListener('click', () => {
            currentPage = endPage + 1;
            displayHistory();
        });
        paginationContainer.appendChild(nextButton);
    }
}

function getMultiplierColor(multiplier) {
    if (multiplier >= 10) return "#eb00ff"; // Rich color for high multipliers
    if (multiplier >= 5) return "#00ffdd"; // Slightly less rich color
    return "#00dbff"; // Color for lower multipliers
}

function getWinningsColor(winnings) {
    if (winnings >= 500) return "#7fff00"; // Dark Green for highest winnings
    if (winnings >= 250) return "#008000"; // Green
    if (winnings >= 100) return "#32CD32"; // Lime Green
    if (winnings >= 50) return "#7FFF00"; // Chartreuse
    return "#ADFF2F"; // Green Yellow for lower winnings
}

// Function to show custom warning
function showWarning(message) {
    const warningContainer = document.getElementById('warning-container');
    if (!warningContainer) {
        const container = document.createElement('div');
        container.id = 'warning-container';
        container.style.position = 'fixed';
        container.style.top = '580px'; // Positioning 20px from the top of the screen
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.backgroundColor = 'rgba(255, 69, 0, 0.9)';
        container.style.color = '#fff';
        container.style.padding = '10px 20px';
        container.style.borderRadius = '5px';
        container.style.zIndex = '1000';
        container.style.textAlign = 'center';
        document.body.appendChild(container);
        container.textContent = message;
        setTimeout(() => {
            container.remove();
        }, 3000); // Remove warning after 4 seconds
    } else {
        warningContainer.textContent = message;
    }
}
