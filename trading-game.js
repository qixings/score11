let balance = 55245.00;
let currentPrice = 1000;
let betAmount = null;
let chart;
let timerDuration = 60; // Default to 1 minute

let activeBet = null; // Track active bet data
let updateInterval = 1000; // Default update interval (1 second)
let slowUpdate = false; // Flag for slower updates in longer time frames

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
                backgroundColor: 'rgba(0, 255, 221, 0.2)', // Fill color under the line
                borderColor: '#ffffff', // Line color
                borderWidth: 2, // Thickness of the main line
                data: [], // Price data
                fill: true, // Fill area under the line
                pointRadius: 2, // Show points
                tension: 0.3, // Add some smoothing to the line
            }, {
                label: 'Bet Line', // Dataset for bet line
                data: [], // Horizontal line data
                borderColor: '#ffcc00', // Yellow color for the bet line
                borderWidth: 2,
                pointRadius: 5,
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
                    right: 0, // No padding on the right
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
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(currentPrice);

    // Update the bet line
    if (activeBet) {
        const elapsedTime = (now - activeBet.startTime) / 1000; // seconds elapsed
        const remainingTime = timerDuration - elapsedTime; // Remaining time for the bet
        const endTime = new Date(activeBet.startTime.getTime() + (timerDuration * 1000));

        // Both dots remain fixed, zoom out the graph instead
        const midpoint = new Date(activeBet.startTime.getTime() + (timerDuration * 1000 * 0.5));
        chart.data.datasets[1].data = [
            { x: midpoint, y: activeBet.priceLevel }, 
            { x: endTime, y: activeBet.priceLevel } 
        ];

        if (elapsedTime >= timerDuration) {
            // Time's up, determine result
            const result = currentPrice > activeBet.priceLevel ? 'up' : 'down';
            checkBetResult(result);
            activeBet = null; // Clear active bet after checking result
        }
    }

    if (chart.data.labels.length > 20) {
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
}

function setBetAmount(amount) {
    if (amount === 'all') {
        betAmount = balance;
    } else {
        betAmount = amount;
    }
    document.getElementById('bet-amount').value = betAmount;
    updateReturnAmount();
}

function updateReturnAmount() {
    const returnAmount = betAmount * 1.96;
    document.getElementById('return-amount').textContent = `+₹${returnAmount.toFixed(2)}`;
}

function placeBet(direction) {
    betAmount = parseFloat(document.getElementById('bet-amount').value);

    if (!betAmount || betAmount <= 0 || betAmount > balance) {
        alert('Please enter a valid bet amount within your balance.');
        return;
    }

    const initialPrice = currentPrice;
    const startTime = new Date();

    activeBet = {
        priceLevel: initialPrice,
        direction: direction,
        startTime: startTime
    };

    // Draw bet line with both dots fixed
    const endTime = new Date(startTime.getTime() + (timerDuration * 1000));
    const midpoint = new Date(startTime.getTime() + (timerDuration * 1000 * 0.5));
    chart.data.datasets[1].data = [
        { x: midpoint, y: initialPrice }, 
        { x: endTime, y: initialPrice } 
    ];
}

function checkBetResult(result) {
    const betDirection = activeBet.direction;
    const betPriceLevel = activeBet.priceLevel;

    const isWin = (betDirection === 'up' && currentPrice > betPriceLevel) || 
                  (betDirection === 'down' && currentPrice < betPriceLevel);

    if (isWin) {
        const winnings = betAmount * 1.96;
        balance += winnings;
        alert(`You won! Your balance is now ₹${balance.toFixed(2)}`);
    } else {
        balance -= betAmount; // Deduct bet amount from balance
        alert(`You lost! Better luck next time.`);
    }

    document.getElementById('balance-amount').textContent = balance.toFixed(2);

    // Clear bet line after result is checked
    chart.data.datasets[1].data = [];
}

function addToHistory(initialPrice, finalPrice, winnings) {
    const historyList = document.getElementById('history-list');
    const round = historyList.children.length + 1;

    const row = document.createElement('tr');
    row.innerHTML = `<td>${round}</td><td>₹${winnings.toFixed(2)}</td>`;
    historyList.appendChild(row);
}

function animateEndpoint() {
    const lastPoint = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
    if (lastPoint) {
        const ctx = chart.ctx;
        const pointIndex = chart.data.datasets[0].data.length - 1;
        const meta = chart.getDatasetMeta(0);
        const position = meta.data[pointIndex].getCenterPoint();

        ctx.beginPath();
        ctx.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

initChart();
setInterval(fluctuatePrice, updateInterval); // Adjust update frequency based on the selected time frame
setInterval(animateEndpoint, 500); // Blink the end point every half second
