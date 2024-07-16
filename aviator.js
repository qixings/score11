document.addEventListener("DOMContentLoaded", () => {
    const serialNumber = document.getElementById("serialNumber");
    const walletBalance = document.getElementById("walletBalance");
    const multiplierValue = document.getElementById("multiplierValue");
    const rocket = document.getElementById("rocket");
    const betAmountLeft = document.getElementById("betAmountLeft");
    const betAmountRight = document.getElementById("betAmountRight");
    const autoCashoutInput = document.getElementById("autoCashout");
    const autoCashoutValueInput = document.getElementById("autoCashoutValue");
    const betButtonLeft = document.getElementById("betButtonLeft");
    const betButtonRight = document.getElementById("betButtonRight");
    const historyTable = document.getElementById("historyTable");
    const timerDisplay = document.getElementById("timerDisplay");
    const timerLoading = document.getElementById("timerLoading");
  
    let walletBalanceAmount = parseFloat(walletBalance.innerText);
    let betAmount;
    let gameInterval = 20000; // 20 seconds for placing bets
    let countdown = gameInterval / 1000; // 20 seconds countdown
    let countdownTimer;
    let flightMultiplier;
    let multiplier = 0.05;
    let crashMultiplier;
    let isBetPlaced = false;
    let currentBetButton;
  
    const startGame = () => {
      // Reset multiplier
      multiplier = 0.1;
      multiplierValue.innerText = ""; // Hide multiplier initially
      timerDisplay.innerText = `${countdown}s`; // Display initial countdown time
      multiplierValue.style.color = "white"; // Reset multiplier text color to white
  
      // Reset rocket position to the bottom left
      rocket.style.transform = "translate(0px, 0px)"; // Start from bottom left
  
      // Reset bet button state
      if (isBetPlaced && currentBetButton) {
        currentBetButton.innerText = "BET";
        currentBetButton.style.backgroundColor = ""; // Reset to original color
        currentBetButton.disabled = false;
        isBetPlaced = false;
      }
  
      // Show timer loading animation
      timerLoading.style.display = "block";
      timerLoading.style.width = "0%"; // Reset loading bar
  
      // Countdown timer for placing bets
      countdown = gameInterval / 1000;
      countdownTimer = setInterval(() => {
        countdown -= 1;
        timerDisplay.innerText = `${countdown}s`; // Update the timer display
        timerLoading.style.width = `${((gameInterval / 1000 - countdown) / (gameInterval / 1000)) * 100}%`; // Update loading bar width
        if (countdown <= 0) {
          clearInterval(countdownTimer);
          timerLoading.style.display = "none"; // Hide the timer loading animation
          launchFlight();
        }
      }, 1000);
    };
  
    const launchFlight = () => {
      // Hide the timer display when flight starts
      timerDisplay.style.display = "none";
  
      // Show multiplier when flight starts
      multiplierValue.innerText = `${multiplier.toFixed(2)}x`;
  
      // Generate a random crash multiplier between 1.10 and 5.00
      crashMultiplier = Math.random() * 4.9 + 1.1;
  
      let rocketPositionX = 0;
      let rocketPositionY = 0; // Start from bottom left
      let zoomFactor = 1; // Initial zoom factor
      let zoomDirection = 1; // Zoom direction: 1 for zooming in, -1 for zooming out
      flightMultiplier = setInterval(() => {
        multiplier += 0.01;
        rocketPositionX += 2; // Move rocket rightwards
        rocketPositionY -= 1; // Move rocket upwards
  
        // Apply slight zoom in/out effect
        zoomFactor += 0.01 * zoomDirection;
        if (zoomFactor > 1.1) {
          zoomDirection = -1;
        } else if (zoomFactor < 1.0) {
          zoomDirection = 1;
        }
  
        // Ensure rocket stays within container bounds
        rocketPositionX = Math.min(rocketPositionX, rocket.parentElement.clientWidth - rocket.clientWidth);
        rocketPositionY = Math.max(rocketPositionY, -rocket.parentElement.clientHeight + rocket.clientHeight);
  
        rocket.style.transform = `translate(${rocketPositionX}px, ${rocketPositionY}px) scale(${zoomFactor})`;
        multiplierValue.innerText = `${multiplier.toFixed(2)}x`;
  
        // Update bet button with potential earnings
        if (isBetPlaced && currentBetButton) {
          currentBetButton.innerText = `Cash Out ₹${(betAmount * multiplier).toFixed(2)}`;
        }
  
        // Auto cashout if enabled
        if (autoCashoutInput.checked && multiplier >= parseFloat(autoCashoutValueInput.value)) {
          clearInterval(flightMultiplier);
          cashOut();
        }
  
        // Check for crash condition
        if (multiplier >= crashMultiplier) {
          clearInterval(flightMultiplier);
          // Change color of the multiplier text to indicate crash
          multiplierValue.style.color = "red";
          setTimeout(startGame, 3000); // Restart game after 3 seconds
        }
      }, 100);
    };
  
    const placeBet = (betButton, betInput) => {
      let betAmount = parseFloat(betInput.value);
      if (!isNaN(betAmount)) {
        if (walletBalanceAmount >= betAmount && !isBetPlaced) {
          walletBalanceAmount -= betAmount;
          walletBalance.innerText = `₹${walletBalanceAmount.toFixed(2)}`;
          betButton.innerText = `Cash Out ₹${betAmount.toFixed(2)}`;
          betButton.style.backgroundColor = "yellow";
          isBetPlaced = true;
          currentBetButton = betButton;
        } else if (isBetPlaced) {
          cashOut();
        } else {
          alert("Insufficient balance to place bet!");
        }
      } else {
        alert("Please enter a valid bet amount.");
      }
    };
  
    const cashOut = () => {
      clearInterval(flightMultiplier);
      walletBalanceAmount += betAmount * multiplier;
      walletBalance.innerText = `₹${walletBalanceAmount.toFixed(2)}`;
      betButtonLeft.disabled = false;
      betButtonRight.disabled = false;
      betButtonLeft.innerText = 'BET';
      betButtonRight.innerText = 'BET';
      betButtonLeft.style.backgroundColor = '';
      betButtonRight.style.backgroundColor = '';
      isBetPlaced = false;
  
      // Update history table
      let historyRow = document.createElement('div');
      historyRow.classList.add('history-row');
      historyRow.innerHTML = `<div class="serial">${serialNumber.innerText}</div><div class="winning-number">${multiplier.toFixed(2)}x</div>`;
      historyTable.appendChild(historyRow);
  
      setTimeout(startGame, 3000); // Restart game after 3 seconds
    };
  
    betButtonLeft.addEventListener("click", () => placeBet(betButtonLeft, betAmountLeft));
    betButtonRight.addEventListener("click", () => placeBet(betButtonRight, betAmountRight));
  
    const setBetAmount = (amount, side) => {
      if (side === "Left") {
        betAmountLeft.value = amount;
      } else if (side === "Right") {
        betAmountRight.value = amount;
      }
    };
  
    window.setBetAmount = setBetAmount; // Ensure this function is accessible globally
  
    startGame();
  });
  


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



  // Optional: JavaScript for checkbox functionality
  const checkbox = document.getElementById('autoCashout');
  checkbox.addEventListener('change', function() {
    // Perform actions when checkbox state changes
    if (this.checked) {
      // Checkbox is checked
      // Perform actions when auto cashout is enabled
    } else {
      // Checkbox is not checked
      // Perform actions when auto cashout is disabled
    }
  });