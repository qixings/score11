// Sample data for reward history
const rewardHistory = [
    { type: "Deposit", amount: "₹3000", date: "2024-09-01", time: "10:30 AM" },
    { type: "Rebate", amount: "₹30", date: "2024-09-01", time: "11:00 AM" }
];

let currentPage = 1;
const itemsPerPage = 10;

let rewardClaimed = {
    deposit: false,
    rebate: false,
};

// Timer for reward reset (e.g., 5 minutes)
const rewardResetTime = 5 * 60 * 1000; // 5 minutes in milliseconds

// Initialize user's balance (example starting balance)
let userBalance = 10000; // ₹10,000 initial balance

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the scroll behavior
    const scrollContainer = document.getElementById("vipLevelsScroll");
    scrollContainer.addEventListener("scroll", handleScrollSnap);

    // Initialize the first page of the history
    showHistoryPage(1);

    // Initialize reward buttons (disable if already claimed)
    if (rewardClaimed.deposit) hideRewardItem("deposit");
    if (rewardClaimed.rebate) hideRewardItem("rebate");

    // Show default benefits (Bronze level)
    showBenefits("bronze");

    // Update the initial balance display
    updateUserBalance(userBalance);
});

function handleScrollSnap() {
    const scrollContainer = document.getElementById("vipLevelsScroll");
    const cards = document.querySelectorAll(".vip-level-card");
    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = card;
        }
    });

    if (closestCard) {
        const level = closestCard.querySelector("h3").textContent.toLowerCase();
        showBenefits(level); // Call showBenefits based on the level card that is centered
    }
}


// Function to show VIP benefits based on level
function showBenefits(level) {
    const benefits = {
        bronze: { commission: "5%", rebate: "₹500" },
        silver: { commission: "7%", rebate: "₹1000" },
        gold: { commission: "10%", rebate: "₹2000" },
        platinum: { commission: "12%", rebate: "₹5000" },
        diamond: { commission: "15%", rebate: "₹10000" },
    };

    const { commission, rebate } = benefits[level];
    document.querySelector(".vip-benefits").innerHTML = `
        <p> Benefit Level </p>
        <h3 style="margin:3px; filter: drop-shadow(0px 0px 6px rgb(0, 157, 255));">${level.toUpperCase()}</h3>
        <div class="benefit-item">
            <div class="benefit-icon gift"></div>
            <div style="width: 160px;">
                <h4>Subordinate Deposit Commission:</h4>
                <p>You can receive this daily based on your team deposit.</p>
            </div>
            <div style="text-align: center;width: 110px;">
                <p><strong style="font-size: 25px;color: greenyellow;">Up to ${commission}</strong></p>
            </div>
        </div>
        <div class="benefit-item">
            <div class="benefit-icon money"></div>
            <div style="width: 160px;">
                <h4>Monthly Rebate:</h4>
                <p>You can receive this every month.</p>
            </div>
            <div style="text-align: center;width: 110px;">
                <p><strong style="font-size: 25px;color: greenyellow;">${rebate}</strong></p>
            </div>
        </div>
    `;
}

// Function to claim a reward
function claimReward(type) {
    if (rewardClaimed[type]) {
        showPopupMessage("Reward already claimed!");
        return;
    }

    // Update the history with claimed reward
    const date = new Date();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString();
    const amount = type === "deposit" ? "₹3000" : "₹30";

    rewardHistory.unshift({ type: type === "deposit" ? "Deposit" : "Rebate", amount, date: dateString, time });
    showHistoryPage(1); // Refresh history to show the latest claimed reward

    // Mark reward as claimed
    rewardClaimed[type] = true;

    // Hide the reward item
    hideRewardItem(type);

    // Update user balance based on the reward claimed
    const rewardAmount = type === "deposit" ? 3000 : 30;
    userBalance += rewardAmount; // Add reward amount to the balance
    updateUserBalance(userBalance); // Update the balance in the UI

    // Check if all rewards are claimed
    if (rewardClaimed.deposit && rewardClaimed.rebate) {
        showAllRewardsClaimedMessage();
    }

    // Show confirmation popup
    showPopupMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} reward claimed!`);

    // Reset the claim button after the timer ends
    setTimeout(() => {
        rewardClaimed[type] = false;
        showRewardItem(type);
    }, rewardResetTime);
}

// Function to hide a reward item
function hideRewardItem(type) {
    const rewardItem = document.querySelector(`.reward-item.${type}`);
    if (rewardItem) {
        rewardItem.style.display = 'none';
    }
}

// Function to show a reward item
function showRewardItem(type) {
    const rewardItem = document.querySelector(`.reward-item.${type}`);
    if (rewardItem) {
        rewardItem.style.display = 'flex';
    }

    // If the "All rewards have been claimed" message is displayed, remove it
    const allClaimedMessage = document.querySelector('.all-claimed-message');
    if (allClaimedMessage) {
        allClaimedMessage.remove();
    }
}

// Example function to update user balance dynamically
function updateUserBalance(newBalance) {
    document.querySelector('.user-balance').textContent = `₹${newBalance}`;
}

// Function to display the "All rewards have been claimed" message
function showAllRewardsClaimedMessage() {
    const rewardsContainer = document.querySelector('.rewards');

    // Remove any existing message
    const existingMessage = document.querySelector('.all-claimed-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('p');
    message.classList.add('all-claimed-message');
    message.textContent = 'All rewards have been claimed.';
    message.style.textAlign = 'center';
    message.style.fontSize = '12px';
    message.style.color = '#fff';
    message.style.marginTop = '10px';

    rewardsContainer.appendChild(message);
}

// Function to display history with pagination
function showHistoryPage(page) {
    currentPage = page;
    const historyList = document.getElementById("historyList");
    const pagination = document.getElementById("pagination");
    historyList.innerHTML = ""; // Clear the current list
    pagination.innerHTML = ""; // Clear pagination buttons

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const historyPage = rewardHistory.slice(start, end);

    historyPage.forEach((item) => {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        historyItem.innerHTML = `
            <p>${item.type} - ${item.amount}</p>
            <p>${item.date} - ${item.time}</p>
        `;
        historyList.appendChild(historyItem);
    });

    // Calculate total pages
    const totalPages = Math.ceil(rewardHistory.length / itemsPerPage);

    // Create pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.onclick = () => showHistoryPage(i);
        if (i === page) button.classList.add("active");
        pagination.appendChild(button);
    }
}

// Function to switch between tabs
function showTab(tabId) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach((tab) => {
        if (tab.id === tabId) {
            tab.style.display = "block";
            setTimeout(() => {
                tab.classList.add("active");
            }, 10);
        } else {
            tab.classList.remove("active");
            setTimeout(() => {
                tab.style.display = "none";
            }, 500);
        }
    });

    const tabLinks = document.querySelectorAll(".tab-link");
    tabLinks.forEach((link) => link.classList.remove("active"));
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add("active");
}

// Function to show popup messages
function showPopupMessage(message) {
    const popup = document.createElement("div");
    popup.classList.add("popup-message");
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3000);
}
