// Example transaction history data
const transactionHistory = [
    { type: "Deposit", amount: 1000, date: "2024-09-01", time: "10:30 AM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-02", time: "02:15 PM" },
    { type: "Deposit", amount: 1500, date: "2024-09-03", time: "08:45 PM" },
    { type: "Deposit", amount: 1200, date: "2024-09-04", time: "12:30 PM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-05", time: "09:30 PM" },
    { type: "Deposit", amount: 800, date: "2024-09-06", time: "01:30 PM" },
    { type: "Deposit", amount: 2000, date: "2024-09-07", time: "03:15 PM" },
    { type: "Withdrawal", amount: 1800, date: "2024-09-08", time: "06:45 PM" },
    { type: "Deposit", amount: 3000, date: "2024-09-09", time: "11:15 AM" },
    { type: "Deposit", amount: 1000, date: "2024-09-01", time: "10:30 AM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-02", time: "02:15 PM" },
    { type: "Deposit", amount: 1500, date: "2024-09-03", time: "08:45 PM" },
    { type: "Deposit", amount: 1200, date: "2024-09-04", time: "12:30 PM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-05", time: "09:30 PM" },
    { type: "Deposit", amount: 800, date: "2024-09-06", time: "01:30 PM" },
    { type: "Deposit", amount: 2000, date: "2024-09-07", time: "03:15 PM" },
    { type: "Withdrawal", amount: 1800, date: "2024-09-08", time: "06:45 PM" },
    { type: "Deposit", amount: 3000, date: "2024-09-09", time: "11:15 AM" },
    { type: "Deposit", amount: 1000, date: "2024-09-01", time: "10:30 AM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-02", time: "02:15 PM" },
    { type: "Deposit", amount: 1500, date: "2024-09-03", time: "08:45 PM" },
    { type: "Deposit", amount: 1200, date: "2024-09-04", time: "12:30 PM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-05", time: "09:30 PM" },
    { type: "Deposit", amount: 800, date: "2024-09-06", time: "01:30 PM" },
    { type: "Deposit", amount: 2000, date: "2024-09-07", time: "03:15 PM" },
    { type: "Withdrawal", amount: 1800, date: "2024-09-08", time: "06:45 PM" },
    { type: "Deposit", amount: 3000, date: "2024-09-09", time: "11:15 AM" },
    { type: "Deposit", amount: 1000, date: "2024-09-01", time: "10:30 AM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-02", time: "02:15 PM" },
    { type: "Deposit", amount: 1500, date: "2024-09-03", time: "08:45 PM" },
    { type: "Deposit", amount: 1200, date: "2024-09-04", time: "12:30 PM" },
    { type: "Withdrawal", amount: 500, date: "2024-09-05", time: "09:30 PM" },
    { type: "Deposit", amount: 800, date: "2024-09-06", time: "01:30 PM" },
    { type: "Deposit", amount: 2000, date: "2024-09-07", time: "03:15 PM" },
    { type: "Withdrawal", amount: 1800, date: "2024-09-08", time: "06:45 PM" },
    { type: "Deposit", amount: 3000, date: "2024-09-09", time: "11:15 AM" },
    // Add more transactions as needed...
];

let currentPage = 1;
const itemsPerPage = 15;

// Load transaction history page by page
function loadTransactionHistoryPage(page, filteredHistory) {
    const transactionHistoryList = document.getElementById("transactionHistoryList");
    transactionHistoryList.innerHTML = "";  // Clear previous items

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredHistory.length);

    for (let i = startIndex; i < endIndex; i++) {
        const item = filteredHistory[i];
        const typeClass = item.type === "Deposit" ? "deposit" : "withdrawal";
        const transactionItem = `
            <div class="transaction-item">
                <p><strong class="type ${typeClass}">${item.type}</strong></p>
                <p>Amount: ₹${item.amount} | Date: ${item.date} | Time: ${item.time}</p>
            </div>
        `;
        transactionHistoryList.innerHTML += transactionItem;
    }

    updatePagination(page, filteredHistory);
}

// Update pagination display
function updatePagination(page, filteredHistory) {
    const pageNumbers = document.querySelector(".page-numbers");
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    pageNumbers.textContent = `${page} of ${totalPages}`;

    const prevButton = document.querySelector(".prev-page");
    const nextButton = document.querySelector(".next-page");

    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
}

// Pagination Event Listeners
document.querySelector(".prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadTransactionHistoryPage(currentPage, applyFilters());
    }
});

document.querySelector(".next-page").addEventListener("click", () => {
    if (currentPage < Math.ceil(applyFilters().length / itemsPerPage)) {
        currentPage++;
        loadTransactionHistoryPage(currentPage, applyFilters());
    }
});

// Apply filters and return the filtered transaction history
function applyFilters() {
    const filterType = document.getElementById("filterTransactionType").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const minAmount = document.getElementById("minAmount").value;
    const maxAmount = document.getElementById("maxAmount").value;

    return transactionHistory.filter((item) => {
        const typeMatch = filterType === "" || item.type === filterType;
        const dateMatch = (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate);
        const amountMatch = (!minAmount || item.amount >= minAmount) && (!maxAmount || item.amount <= maxAmount);

        return typeMatch && dateMatch && amountMatch;
    });
}

// Filter Button Event Listener
document.getElementById("applyFilters").addEventListener("click", () => {
    currentPage = 1; // Reset to page 1 after applying filters
    loadTransactionHistoryPage(currentPage, applyFilters());
});

// Initial load
loadTransactionHistoryPage(1, transactionHistory);
