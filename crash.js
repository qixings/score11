document.addEventListener('DOMContentLoaded', function() {
    const multiplierValue = document.querySelector('.multiplier-value');
    const gameOverText = document.querySelector('#game-over');
    const statusText = document.querySelector('#countdown');
    const statusBar = document.querySelector('.status-bar');
    const statusButton = document.querySelector('.status-button');
    const betButton = document.querySelector('.bet-button');
    const autoCashoutCheckbox = document.getElementById('auto-cashout');
    const cashoutAtInput = document.getElementById('cashout');
    const betAmountInput = document.querySelector('#bet-amount');
    const userBalanceElement = document.getElementById('user-balance');
    const preAmountButtons = document.querySelectorAll('.pre-amount');
    const halfButton = document.querySelector('.halfdouble button:first-child');
    const doubleButton = document.querySelector('.halfdouble button:last-child');
    const pastMultipliersContainer = document.querySelector('.past-multipliers');
    const historyPage = document.getElementById('multiplier-history-page');
    const historyContent = document.getElementById('history-content');
    const historyButton = document.getElementById('multiplier-history-button');
    const closeHistoryButton = document.getElementById('close-history-page');
    const expandingCircle = document.getElementById('expanding-circle'); // Circle element for expanding animation

    const publicBetsTab = document.getElementById('public-bets-tab');
    const myBetsTab = document.getElementById('my-bets-tab');
    const publicBetsContent = document.getElementById('public-bets');
    const myBetsContent = document.getElementById('my-bets');

    let initialCountdown = 5;
    let countdown = initialCountdown;
    let currentMultiplier = 1.00;
    let isGameRunning = false;
    let betPlaced = false;
    let betAmount = 0;
    let cashoutMultiplier = 0;
    let userBalance = 55458; // Starting balance
    let maxMultiplier = 30.00;
    let betLocked = false;
    let gameInterval;
    let pastMultipliers = [];

    // Update the displayed balance
    function updateBalance() {
        userBalanceElement.textContent = `₹${userBalance.toFixed(2)}`;
    }

    function startCountdown() {
        countdown = initialCountdown;
        currentMultiplier = 1.00;
        multiplierValue.textContent = `${currentMultiplier.toFixed(2)}×`;
        multiplierValue.style.color = "#ffffff";
        gameOverText.style.display = "none";
        statusButton.style.display = 'block';
    
        // Fully reset the status bar's width and transition properties
        statusBar.style.transition = 'none'; // Remove transition temporarily
        statusBar.style.width = "100%"; // Reset width to 100%
        statusBar.offsetHeight; // Trigger a reflow, flushing the CSS changes
        
        betLocked = false;
        betPlaced = false;
        cashoutMultiplier = 0;
    
        // Reset circle for the next round
        expandingCircle.setAttribute('r', '30'); // Reset radius
        expandingCircle.setAttribute('fill', '#6100c6'); // Reset color
    
        // Re-enable auto cashout toggle
        autoCashoutCheckbox.disabled = false;
    
        // Re-enable bet amount inputs, cashout inputs, and buttons
        disableBetAmountInputs(false);
    
        // Apply the transition and start the countdown animation after a small delay
        setTimeout(() => {
            statusBar.style.transition = `width ${initialCountdown}s linear`;
            statusBar.style.width = "0%"; // Animate to 0% over initialCountdown seconds
        }, 10); // Slight delay to ensure the transition is reapplied
    
        statusText.textContent = `Starting in ${countdown}`;
    
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                statusText.textContent = `Starting in ${countdown}`;
            } else {
                clearInterval(countdownInterval);
                startGame();
            }
        }, 1000);
    }

    function startGame() {
        isGameRunning = true;
        betLocked = true;

        // If bet is placed, change button to Cashout
        if (betPlaced) {
            betButton.innerHTML = `Cash Out<br><span class="winning-amount">₹0.00</span>`;
            betButton.style.backgroundColor = '#ff7f00'; // Change button color to orange
        }

        // Disable the auto cashout toggle, bet amount inputs, and "Cashout At" input
        autoCashoutCheckbox.disabled = true;
        disableBetAmountInputs(true);

        multiplierValue.textContent = `${currentMultiplier.toFixed(2)}×`;
        statusButton.style.display = 'none';

        gameInterval = setInterval(() => {
            if (!isGameRunning) {
                clearInterval(gameInterval);
                return;
            }

            if (currentMultiplier < maxMultiplier) {
                currentMultiplier += 0.01;
                updateCircle(currentMultiplier); // Update the circle as the multiplier grows
            }

            multiplierValue.textContent = `${currentMultiplier.toFixed(2)}×`;

            // Auto cashout logic
            if (autoCashoutCheckbox.checked && cashoutMultiplier === 0) {
                const autoCashoutValue = parseFloat(cashoutAtInput.value);
                if (currentMultiplier >= autoCashoutValue) {
                    cashout();
                }
            }

            // Update the button to show potential winnings
            if (betPlaced && cashoutMultiplier === 0) {
                let potentialWinnings = betAmount * currentMultiplier;
                betButton.innerHTML = `Cash Out<br><span class="winning-amount">₹${potentialWinnings.toFixed(2)}</span>`;
            }

            if (Math.random() < 0.01 || currentMultiplier >= maxMultiplier) {
                isGameRunning = false;
                multiplierValue.style.color = "#ff0000";
                gameOverText.textContent = "CRASHED"; // Update text to "CRASHED"
                gameOverText.style.display = "block";

                if (cashoutMultiplier === 0 && betPlaced) {
                    // User did not cash out, they lose the bet
                    showMessage(`Multiplier crashed at ${currentMultiplier.toFixed(2)}×. You lost ₹${betAmount}.`);
                    resetButton(); // Reset the button back to "Bet"
                }

                // Save the multiplier and update past multipliers
                updatePastMultipliers(currentMultiplier);

                setTimeout(() => {
                    startCountdown();
                }, 3000);
            }
        }, 100);
    }

    function updateCircle(multiplier) {
        const maxRadius = 375; // Set a maximum radius for the circle's growth
        const baseGrowthRate = 5; // Set a base growth rate for the circle
    
        // Calculate the new radius based on the multiplier
        let newRadius = 350 + multiplier * baseGrowthRate;
    
        // Cap the radius growth at maxRadius but ensure smooth transition
        if (newRadius > maxRadius) {
            newRadius = maxRadius;
        }
    
        // Apply the calculated radius to the circle
        expandingCircle.setAttribute('r', newRadius.toString());
    
        // Adjust 'cy' to always place the circle at the bottom of the container
        const svgHeight = document.getElementById('expanding-circle-svg').clientHeight;
        expandingCircle.setAttribute('cx', '0'); // Keep it at the left
        expandingCircle.setAttribute('cy', (svgHeight + 25).toString()); // Adjusted by 25 pixels to align perfectly
    
        // Change color based on multiplier value
        if (multiplier >= 1.50 && multiplier < 2.00) {
            expandingCircle.setAttribute('fill', '#0157a9'); // Slightly lighter blue
        } else if (multiplier >= 2.00 && multiplier < 2.50) {
            expandingCircle.setAttribute('fill', '#014ca9'); // Slightly deeper blue
        } else if (multiplier >= 2.50 && multiplier < 3.00) {
            expandingCircle.setAttribute('fill', '#013ba9'); // A bit darker blue
        } else if (multiplier >= 3.00 && multiplier < 3.50) {
            expandingCircle.setAttribute('fill', '#1233a9'); // Transition to purple-blue
        } else if (multiplier >= 3.50 && multiplier < 4.00) {
            expandingCircle.setAttribute('fill', '#2528a9'); // Deeper purple-blue
        } else if (multiplier >= 4.00 && multiplier < 4.50) {
            expandingCircle.setAttribute('fill', '#4a0074'); // More purple
        } else if (multiplier >= 4.50 && multiplier < 5.00) {
            expandingCircle.setAttribute('fill', '#2a0090'); // Transitioning to purple-pink
        } else if (multiplier >= 5.00 && multiplier < 5.50) {
            expandingCircle.setAttribute('fill', '#145bba'); // Deeper purple-pink
        } else if (multiplier >= 5.50 && multiplier < 6.00) {
            expandingCircle.setAttribute('fill', '#4a0da9'); // Slightly more pink
        } else if (multiplier >= 6.00 && multiplier < 6.50) {
            expandingCircle.setAttribute('fill', '#44006c'); // Darker purple-pink
        } else if (multiplier >= 6.50 && multiplier < 7.00) {
            expandingCircle.setAttribute('fill', '#3a05a9'); // Transitioning to pink
        } else if (multiplier >= 7.00 && multiplier < 7.50) {
            expandingCircle.setAttribute('fill', '#ad01a9'); // Pinker
        } else if (multiplier >= 7.50 && multiplier < 8.00) {
            expandingCircle.setAttribute('fill', '#002c7a'); // Pinkish-red
        } else if (multiplier >= 8.00 && multiplier < 8.50) {
            expandingCircle.setAttribute('fill', '#6e01c3'); // Deeper red-pink
        } else if (multiplier >= 8.50 && multiplier < 9.00) {
            expandingCircle.setAttribute('fill', '#550080'); // Even deeper red
        } else if (multiplier >= 9.00 && multiplier < 9.50) {
            expandingCircle.setAttribute('fill', '#7f009f'); // Almost red
        } else if (multiplier >= 9.50 && multiplier < 10.00) {
            expandingCircle.setAttribute('fill', '#4201e3'); // Vibrant red
        } else if (multiplier >= 10.00) {
            expandingCircle.setAttribute('fill', '#8100ff'); // Dark red
        }
    }

    betButton.addEventListener('click', function() {
        if (!betLocked && countdown > 0 && !betPlaced) {
            placeBet();
        } else if (isGameRunning && betPlaced && betButton.textContent.startsWith("Cash Out")) {
            cashout();
        } else if (!isGameRunning && betPlaced) {
            cancelBet();
        } else {
            showMessage("Betting is locked. Please wait for the next round.");
        }
    });

    function placeBet() {
        betAmount = parseFloat(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > userBalance) {
            showMessage("Please select or enter a valid bet amount within your balance.");
            return;
        }
        betPlaced = true;
        userBalance -= betAmount; // Deduct bet amount from balance
        updateBalance();
        showMessage(`Bet of ₹${betAmount} placed for this round.`);

        // Change button to Cancel
        betButton.textContent = "Cancel";
        betButton.style.backgroundColor = '#ff0000'; // Change button color to red
    }

    function cancelBet() {
        if (!betLocked && betPlaced) {
            userBalance += betAmount; // Refund the bet amount
            updateBalance();
            betPlaced = false;
            showMessage("Bet canceled.");

            // Reset button to Bet
            resetButton();
        }
    }

    function cashout() {
        if (isGameRunning && betPlaced && cashoutMultiplier === 0) {
            cashoutMultiplier = currentMultiplier;
            let winnings = betAmount * cashoutMultiplier;
            userBalance += winnings; // Add winnings to balance
            updateBalance();
            showMessage(`You cashed out at ${cashoutMultiplier.toFixed(2)}×. Winnings: ₹${winnings.toFixed(2)}.`);
            betPlaced = false; // Prevent further cashouts in this round
            resetButton(); // Reset the button back to "Bet"
        }
    }

    function resetButton() {
        betPlaced = false;
        betButton.textContent = "Bet";
        betButton.style.backgroundColor = '#32cd32'; // Reset button color to green

        // Re-enable auto cashout toggle and bet amount inputs for the next round
        autoCashoutCheckbox.disabled = false;
        disableBetAmountInputs(false);
    }

    function disableBetAmountInputs(disable) {
        betAmountInput.disabled = disable;
        cashoutAtInput.disabled = disable; // Disable the "Cashout At" input
        preAmountButtons.forEach(button => button.disabled = disable);
        halfButton.disabled = disable;
        doubleButton.disabled = disable;
    }

    // Event listeners for pre-defined amounts
    preAmountButtons.forEach(button => {
        button.addEventListener('click', function() {
            temporarilyEnableInput(() => {
                let amountValue = this.getAttribute('data-amount');
                let amount = (amountValue === 'all') ? userBalance : parseFloat(amountValue);

                // Ensure correct amount is inserted
                if (!isNaN(amount) && amount > 0) {
                    betAmountInput.value = amount.toFixed(2);
                }
            });
        });
    });

    // Event listeners for ½ and 2x buttons
    halfButton.addEventListener('click', function() {
        temporarilyEnableInput(() => {
            let currentAmount = parseFloat(betAmountInput.value) || 0;
            if (currentAmount > 0) {
                betAmountInput.value = (currentAmount / 2).toFixed(2);
            }
        });
    });

    doubleButton.addEventListener('click', function() {
        temporarilyEnableInput(() => {
            let currentAmount = parseFloat(betAmountInput.value) || 0;
            if (currentAmount > 0) {
                betAmountInput.value = (currentAmount * 2).toFixed(2);
            }
        });
    });

    // Temporarily enable the betAmountInput for input modifications
    function temporarilyEnableInput(action) {
        const wasDisabled = betAmountInput.disabled;
        if (wasDisabled) betAmountInput.disabled = false;

        action();

        if (wasDisabled) betAmountInput.disabled = true;
    }

    // Update past multipliers
    function updatePastMultipliers(multiplier) {
        pastMultipliers.unshift(multiplier.toFixed(2) + '×');
        if (pastMultipliers.length > 8) {
            pastMultipliers.pop();
        }
        renderPastMultipliers();
        updateHistoryPage();
    }

    // Render the past multipliers in the UI
    function renderPastMultipliers() {
        pastMultipliersContainer.innerHTML = '';
        pastMultipliers.forEach(multiplier => {
            const div = document.createElement('div');
            div.className = 'multiplier';
            div.textContent = multiplier;

            // Apply color based on multiplier value
            const multiplierValue = parseFloat(multiplier);
            if (multiplierValue < 2.00) {
                div.style.color = 'red';
            } else if (multiplierValue >= 2.00 && multiplierValue < 5.00) {
                div.style.color = '#78d8ff';
            } else if (multiplierValue >= 5.00 && multiplierValue < 10.00) {
                div.style.color = '#ff00ff';
            } else if (multiplierValue >= 10.00) {
                div.style.color = '#84ff00';
            }

            pastMultipliersContainer.appendChild(div);
        });
    }

    // Update the full history page
    function updateHistoryPage() {
        historyContent.innerHTML = '';
        pastMultipliers.forEach(multiplier => {
            const div = document.createElement('div');
            div.className = 'multiplier';
            div.textContent = multiplier;

            // Apply color based on multiplier value
            const multiplierValue = parseFloat(multiplier);
            if (multiplierValue < 2.00) {
                div.style.color = 'red';
            } else if (multiplierValue >= 2.00 && multiplierValue < 5.00) {
                div.style.color = '#78d8ff';
            } else if (multiplierValue >= 5.00 && multiplierValue < 10.00) {
                div.style.color = '#ff00ff';
            } else if (multiplierValue >= 10.00) {
                div.style.color = '#84ff00';
            }

            historyContent.appendChild(div);
        });
    }

    // Event listeners for history button and close button
    historyButton.addEventListener('click', function() {
        historyPage.style.display = 'flex';
    });

    closeHistoryButton.addEventListener('click', function() {
        historyPage.style.display = 'none';
    });

    // Switch between Public Bets and My Bets
    publicBetsTab.addEventListener('click', function() {
        publicBetsTab.classList.add('active');
        myBetsTab.classList.remove('active');
        publicBetsContent.style.display = 'block';
        myBetsContent.style.display = 'none';
    });

    myBetsTab.addEventListener('click', function() {
        myBetsTab.classList.add('active');
        publicBetsTab.classList.remove('active');
        publicBetsContent.style.display = 'none';
        myBetsContent.style.display = 'block';
    });

    function showMessage(message) {
        const popup = document.getElementById('message-popup');
        const popupText = document.getElementById('popup-text');

        popupText.textContent = message;
        popup.style.display = 'block';
        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300); // Wait for the transition to complete
        }, 2000); // Message display duration
    }

    // Initialize balance display
    updateBalance();

    startCountdown();
});
