// Sample gift code history data (20 example entries)
let giftCodeHistory = [
    { code: "A1B2C3D4E5F6G7H8I9J0", amount: "₹500", date: "2024-09-01", time: "10:30 AM" },
    { code: "Z9Y8X7W6V5U4T3S2R1Q0", amount: "₹300", date: "2024-09-02", time: "11:45 AM" },
];

let currentPage = 1;
const itemsPerPage = 10;

// Function to claim a gift code
// Function to claim a gift code
function claimGiftCode() {
    const giftCodeInput = document.getElementById('giftCodeInput').value.trim();

    // Validate gift code input
    if (giftCodeInput.length !== 20 || !/^[a-zA-Z0-9]+$/.test(giftCodeInput)) {
        showPopupMessage("Please enter a valid 20-character alphanumeric gift code.", 4000); // Display popup message
        return;
    }

    // For demo purposes, we'll generate a random amount and date
    const amount = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    // Add the gift code to history
    giftCodeHistory.unshift({
        code: giftCodeInput,
        amount: `₹${amount}`,
        date: date,
        time: time
    });

    // Clear the input field
    document.getElementById('giftCodeInput').value = '';

    // Reset to page 1 and update the history display
    currentPage = 1;
    updateGiftCodeHistory();

    // Show success popup
    showPopupMessage(`Gift code claimed successfully! Amount: ₹${amount}`, 4000);
}



// Function to update the gift code history display with pagination
function updateGiftCodeHistory() {
    const historyList = document.getElementById('giftCodeHistoryList');
    historyList.innerHTML = ''; // Clear previous items

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, giftCodeHistory.length);

    for (let i = startIndex; i < endIndex; i++) {
        const item = giftCodeHistory[i];
        const historyItem = document.createElement('li');
        historyItem.innerHTML = `<div style="display:flex; align-items:center; gap:15px;"><div>Code: <strong style="color:#bb7cfd;">${item.code}</strong> <br> Amount: <strong style="color:greenyellow;">${item.amount}</div> <div style="font-size:9px; color:#ffba00;padding-bottom: 13px;"></strong> <br> Date: ${item.date} <br> Time: ${item.time} </div> </div>`;
        historyList.appendChild(historyItem);
    }

    // Update pagination info
    document.getElementById('currentPage').textContent = currentPage;
    document.querySelector('.prev-page').disabled = currentPage === 1;
    document.querySelector('.next-page').disabled = currentPage * itemsPerPage >= giftCodeHistory.length;
}




// Function to show popup messages
function showPopupMessage(message, duration = 3000) {
    const popup = document.getElementById('popupMessage');
    popup.textContent = message;
    popup.classList.add('show');

    // Hide the popup after the specified duration
    setTimeout(() => {
        popup.classList.remove('show');
    }, duration);
}



// Function to handle pagination
function changePage(direction) {
    currentPage += direction;
    updateGiftCodeHistory();
}

// Function to switch between History and Rules tabs
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(tab).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
}

// Initialize page
updateGiftCodeHistory();
