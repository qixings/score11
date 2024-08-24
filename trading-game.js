let balance = 55245.00;
let currentPrice = 1000;
let betAmount = null;
let chart;
let timerDuration = 10; // Default to 1 minute

let activeBet = null; // Track active bet data
let updateInterval = 1000; // Default update interval (1 second)

let historyData = []; // To store all history data
let currentPage = 1;
const itemsPerPage = 10; // Show 10 rounds per page

function initChart() {
    const canvas = document.getElementById('trading-graph');
    
    // Set the width and height of the canvas explicitly
    canvas.style.width = '358px';
    canvas.style.height = '320px'; // Adjust the height as necessary

    const ctx = canvas.getContext('2d');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [{
                label: 'Price',
                backgroundColor: 'rgb(0 129 174 / 20%)', // Fill color under the line
                borderColor: '#ffffff', // Line color
                borderWidth: 1, // Thickness of the main line
                data: [], // Price data
                fill: true, // Fill area under the line
                pointRadius: 1, // Show points
                tension: 0.3, // Add some smoothing to the line
            }, {
                label: 'Bet Line', // Dataset for bet line
                data: [], // Horizontal line data
                borderColor: '#ffcc00', // Yellow color for the bet line
                borderWidth: 1.5,
                pointRadius: 3,
                showLine: true,
                fill: false,
                borderDash: [5, 5], // Dashed line for the bet
            }]
        },
        options: {
            responsive: false, // Disable responsiveness to prevent automatic resizing
            layout: {
                padding: {
                    left: 0, // No padding on the left
                    right: 5, // No padding on the right
                    top: 20,
                    bottom: 10
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'h:mm:ss a'
                        }
                    },
                    position: 'bottom', // Time scale at the bottom
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 6 // Smaller font size for x-axis labels
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 6 // Smaller font size for y-axis labels
                        }
                    },
                    position: 'right', // Price scale on the right side
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            },
            animation: {
                duration: 800 // Smooth animation on update
            }
        }
    });

    // Pre-populate with some initial data
    prePopulateGraphData();
}

function prePopulateGraphData() {
    const now = new Date();
    let price = currentPrice;

    // Generate data points for the last 5 minutes (or whatever timeframe you prefer)
    for (let i = 60; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 1000);
        const priceChange = (Math.random() * 2 - 1) * 5; // Same fluctuation logic
        price = Math.max(940, Math.min(1060, price + priceChange));

        chart.data.labels.push(timestamp);
        chart.data.datasets[0].data.push(price);
    }

    // Make sure the Y-axis scales are properly set
    updateYAxisScale();
    chart.update();
}


function updateYAxisScale() {
    const prices = chart.data.datasets[0].data;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const buffer = (maxPrice - minPrice) * 0.1; // Add a 10% buffer
    chart.options.scales.y.min = Math.floor(minPrice - buffer); // Add padding
    chart.options.scales.y.max = Math.ceil(maxPrice + buffer);  // Add padding
}

function updateChart() {
    const now = new Date();
    const timeBuffer = 5000; // 5 seconds buffer

    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(currentPrice);

    // Maintain the x-axis range to the last selected timeframe
    const startTime = new Date(now.getTime() - timerDuration * 1000);
    chart.options.scales.x.min = startTime;
    chart.options.scales.x.max = new Date(now.getTime() + timeBuffer); // Add buffer to keep right end inside

    // Update the bet line
    if (activeBet) {
        const elapsedTime = (now - activeBet.startTime) / 1000; // seconds elapsed
        const remainingTime = timerDuration - elapsedTime; // Remaining time for the bet
        const endTime = new Date(activeBet.startTime.getTime() + (timerDuration * 1000));

        chart.data.datasets[1].data = [
            { x: activeBet.startTime, y: activeBet.priceLevel }, 
            { x: endTime, y: activeBet.priceLevel } 
        ];

        if (elapsedTime >= timerDuration) {
            // Time's up, determine result
            const result = currentPrice > activeBet.priceLevel ? 'up' : 'down';
            checkBetResult(result);
            activeBet = null; // Clear active bet after checking result
        }
    }

    // Limit the number of data points displayed (for performance reasons)
    if (chart.data.labels.length > timerDuration * 2) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    updateYAxisScale(); // Dynamically adjust Y-axis
    chart.update();
}

function fluctuatePrice() {
    const priceChange = (Math.random() * 2 - 1) * 5;
    currentPrice = Math.max(940, Math.min(1060, currentPrice + priceChange));
    updateChart();
}

function setTimeFrame(seconds, button) {
    timerDuration = seconds;
    slowUpdate = seconds > 60; // Apply slow updates for timeframes longer than 60 seconds
    updateInterval = slowUpdate ? 15000 : 1000; // Update every 15 seconds for longer frames, otherwise every 1 second
    document.querySelectorAll('.timer-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const now = new Date();
    const startTime = new Date(now.getTime() - seconds * 1000);

    chart.options.scales.x.min = startTime;
    chart.options.scales.x.max = now;

    chart.update();
}

function setBetAmount(amount) {
    if (amount === 'all') {
        betAmount = Math.round(balance * 100) / 100; // Round to 2 decimal places
    } else {
        betAmount = amount;
    }
    document.getElementById('bet-amount').value = betAmount.toFixed(2); // Ensure the input shows exactly 2 decimal places
    updateReturnAmount();
}


document.getElementById('bet-amount').addEventListener('input', function (e) {
    // Remove any non-numeric characters
    e.target.value = e.target.value.replace(/[^0-9]/g, '');

    // Update the return amount based on the valid input
    updateReturnAmount();
});

document.getElementById('bet-amount').addEventListener('input', updateReturnAmount);

function updateReturnAmount() {
    const betAmountInput = document.getElementById('bet-amount').value;
    if (!betAmountInput || parseFloat(betAmountInput) <= 0) {
        document.getElementById('return-amount').textContent = '+₹0.00'; // Display 0.00 when input is empty
    } else {
        const returnAmount = parseFloat(betAmountInput) * 1.96;
        document.getElementById('return-amount').textContent = `+₹${returnAmount.toFixed(2)}`;
    }
}

function disableButtons() {
    document.querySelectorAll('.bet-buttons button').forEach(button => {
        button.disabled = true;
        button.style.opacity = 0.5; // Optional: make buttons look disabled

        // Add event listener to show warning message if a disabled button is clicked
        button.addEventListener('click', showWarningMessage);
    });

    document.querySelectorAll('.graph-controls button').forEach(button => {
        button.disabled = true;
        button.style.opacity = 0.5; // Optional: make buttons look disabled

        // Add event listener to show warning message if a disabled button is clicked
        button.addEventListener('click', showWarningMessage);
    });
}

function enableButtons() {
    document.querySelectorAll('.bet-buttons button').forEach(button => {
        button.disabled = false;
        button.style.opacity = 1; // Optional: reset button opacity

        // Remove the warning message event listener when buttons are enabled
        button.removeEventListener('click', showWarningMessage);
    });

    document.querySelectorAll('.graph-controls button').forEach(button => {
        button.disabled = false;
        button.style.opacity = 1; // Optional: reset button opacity

        // Remove the warning message event listener when buttons are enabled
        button.removeEventListener('click', showWarningMessage);
    });
}

function showWarningMessage() {
    displayMessage('A bet is already running. Please wait for the result.', false);
}

function placeBet(direction) {
    betAmount = parseFloat(document.getElementById('bet-amount').value);

    if (!betAmount || betAmount <= 0 || betAmount > balance) {
        displayMessage('Please enter a valid bet amount within your balance.');
        return;
    }

    const initialPrice = currentPrice;
    const startTime = new Date();

    activeBet = {
        priceLevel: initialPrice,
        direction: direction,
        startTime: startTime
    };

    // Draw bet line with fixed left dot and moving right dot
    const endTime = new Date(startTime.getTime() + (timerDuration * 1000));
    chart.data.datasets[1].data = [
        { x: startTime, y: initialPrice }, 
        { x: endTime, y: initialPrice } 
    ];

    // Immediately update the chart to show the bet line without any delay
    chart.update('none');  // The 'none' parameter skips animations

    disableButtons(); // Disable the bet and time buttons after placing a bet
}

function checkBetResult(result) {
    const betDirection = activeBet.direction;
    const betPriceLevel = activeBet.priceLevel;
    const finalPrice = currentPrice;
    let winnings = 0;

    // Check for a draw scenario
    if (finalPrice === betPriceLevel) {
        displayMessage(`Draw! Your bet of ₹${betAmount.toFixed(2)} has been refunded.`, true);
        // No change to balance, just a refund
        winnings = 0;
    } else {
        const isWin = (betDirection === 'up' && finalPrice > betPriceLevel) || 
                      (betDirection === 'down' && finalPrice < betPriceLevel);

        if (isWin) {
            winnings = betAmount * 1.96;
            balance += winnings;
            displayMessage(`Congratulations! You won +₹${winnings.toFixed(2)}`, true);
        } else {
            winnings = -betAmount;
            balance -= betAmount; // Deduct bet amount from balance
            displayMessage(`Sorry! You lost -₹${betAmount.toFixed(2)}. Better luck next time!`, false);
        }
    }

    document.getElementById('balance-amount').textContent = balance.toFixed(2);

    // Update history with the bet amount and winnings
    addToHistory(betAmount, winnings, betDirection);

    // Clear bet line after result is checked
    chart.data.datasets[1].data = [];

    enableButtons(); // Re-enable buttons after the bet result

    // Clear the active bet
    activeBet = null;
}

function displayMessage(message, isWin) {
    const messageBox = document.getElementById('message-box');
    
    // Set the message text and color based on whether it's a win or loss
    if (isWin) {
        messageBox.innerHTML = `<span style="color: #7cff00;">${message}</span>`;
    } else {
        messageBox.innerHTML = `<span style="color: #ff0000;">${message}</span>`;
    }

    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000); // Display message for 3 seconds
}

function addToHistory(betAmount, winnings, direction) {
    const round = historyData.length + 1;
    historyData.unshift({ round, betAmount, winnings, direction }); // Add new history at the beginning
    displayHistory(); // Display the current page history
}


function displayHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear the current display

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = historyData.slice(start, end);

    paginatedItems.forEach(item => {
        const row = document.createElement('tr');

        // Round Number Cell
        const roundCell = document.createElement('td');
        roundCell.textContent = item.round;
        row.appendChild(roundCell);

        // Bet Amount Cell
        const betAmountCell = document.createElement('td');
        betAmountCell.textContent = `₹${item.betAmount.toFixed(2)}`;
        row.appendChild(betAmountCell);

        // Bet On (Direction) Cell
        const directionCell = document.createElement('td');
        directionCell.textContent = item.direction.toUpperCase();
        directionCell.style.fontWeight = 'bold'; // Make bold
        if (item.direction.toLowerCase() === 'down') {
            directionCell.style.color = 'rgb(255 76 76)'; // Red color for DOWN
        } else if (item.direction.toLowerCase() === 'up') {
            directionCell.style.color = 'rgb(76 175 80)'; // Green color for UP
        }
        row.appendChild(directionCell);

        // Winning Amount Cell
        const winningsCell = document.createElement('td');
        const winningsText = item.winnings < 0 
            ? `-₹${Math.abs(item.winnings).toFixed(2)}` 
            : `₹${item.winnings.toFixed(2)}`;
        winningsCell.textContent = winningsText;
        winningsCell.style.color = item.winnings < 0 ? '#ff0000' : '#00ff00'; // Red for losses, green for gains
        row.appendChild(winningsCell);

        historyList.appendChild(row);
    });

    document.getElementById('page-number').textContent = ` ${currentPage}`;
    updatePaginationButtons();
}





function updatePaginationButtons() {
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage * itemsPerPage >= historyData.length;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayHistory();
    }
}

function nextPage() {
    if (currentPage * itemsPerPage < historyData.length) {
        currentPage++;
        displayHistory();
    }
}

// Call displayHistory initially to show the first page
displayHistory();

function withdraw() {
    window.location.href = 'withdraw.html'; // Redirect to withdraw page
}

function deposit() {
    window.location.href = 'deposit.html'; // Redirect to deposit page
}

// Run the graph update continuously even when the tab is not active
function continuousUpdate() {
    fluctuatePrice();
    setTimeout(continuousUpdate, updateInterval);
}

initChart();
continuousUpdate(); // Start the continuous update loop
setInterval(animateEndpoint, 500); // Blink the end point every half second
