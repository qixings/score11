// Example betting history data with new games
const bettingHistory = [
    { game: "Crash", amount: 1000, date: "2024-09-01", time: "10:30 AM", result: "won" },
    { game: "Trading", amount: 500, date: "2024-09-02", time: "02:15 PM", result: "lost" },
    { game: "Snake", amount: 1500, date: "2024-09-03", time: "08:45 PM", result: "won" },
    { game: "Color Trading", amount: 1200, date: "2024-09-04", time: "12:30 PM", result: "won" },
    { game: "Big Small", amount: 500, date: "2024-09-05", time: "09:30 PM", result: "lost" },
    { game: "Mines", amount: 800, date: "2024-09-06", time: "01:30 PM", result: "won" },
    { game: "Plinko", amount: 2000, date: "2024-09-07", time: "03:15 PM", result: "lost" },
    { game: "Number Trading", amount: 1800, date: "2024-09-08", time: "06:45 PM", result: "won" },
    { game: "Spin Win", amount: 3000, date: "2024-09-09", time: "11:15 AM", result: "lost" },
    { game: "Crash", amount: 1200, date: "2024-09-10", time: "10:30 AM", result: "won" },
    { game: "Trading", amount: 800, date: "2024-09-11", time: "02:15 PM", result: "lost" },
    { game: "Snake", amount: 2000, date: "2024-09-12", time: "08:45 PM", result: "won" },
    { game: "Color Trading", amount: 1500, date: "2024-09-13", time: "12:30 PM", result: "won" },
    { game: "Big Small", amount: 1000, date: "2024-09-14", time: "09:30 PM", result: "lost" },
    { game: "Mines", amount: 700, date: "2024-09-15", time: "01:30 PM", result: "won" },
    { game: "Plinko", amount: 1300, date: "2024-09-16", time: "03:15 PM", result: "lost" },
    { game: "Number Trading", amount: 1100, date: "2024-09-17", time: "06:45 PM", result: "won" },
    { game: "Spin Win", amount: 1700, date: "2024-09-18", time: "11:15 AM", result: "lost" },
    { game: "Crash", amount: 1000, date: "2024-09-19", time: "10:30 AM", result: "won" },
    { game: "Trading", amount: 500, date: "2024-09-20", time: "02:15 PM", result: "lost" },
    // Add more if needed...
];

let currentPage = 1;
const itemsPerPage = 15;

function loadBettingHistoryPage(page, filteredHistory) {
    const bettingHistoryList = document.getElementById("bettingHistoryList");
    bettingHistoryList.innerHTML = "";  // Clear previous items

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredHistory.length);

    for (let i = startIndex; i < endIndex; i++) {
        const item = filteredHistory[i];
        const resultClass = item.result === "won" ? "won" : "lost";
        const bettingItem = `
            <div class="betting-item">
                <p><strong>${item.game}</strong></p>
                <p>Amount: ₹${item.amount} | Date: ${item.date} | Time: ${item.time} | 
                <span class="result ${resultClass}">${item.result.charAt(0).toUpperCase() + item.result.slice(1)}</span></p>
            </div>
        `;
        bettingHistoryList.innerHTML += bettingItem;
    }

    updatePagination(page, filteredHistory);
}

function updatePagination(page, filteredHistory) {
    const pageNumbers = document.querySelector(".page-numbers");
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    pageNumbers.textContent = `${page} of ${totalPages}`;

    const prevButton = document.querySelector(".prev-page");
    const nextButton = document.querySelector(".next-page");

    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
}

// Event Listeners for Pagination
document.querySelector(".prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadBettingHistoryPage(currentPage, applyFilters());
    }
});

document.querySelector(".next-page").addEventListener("click", () => {
    if (currentPage < Math.ceil(applyFilters().length / itemsPerPage)) {
        currentPage++;
        loadBettingHistoryPage(currentPage, applyFilters());
    }
});

// Apply filters and return the filtered history
function applyFilters() {
    const filterGame = document.getElementById("filterGame").value;
    const filterResult = document.getElementById("filterResult").value;
    const filterDate = document.getElementById("filterDate").value;

    return bettingHistory.filter((item) => {
        const gameMatch = filterGame === "" || item.game === filterGame;
        const resultMatch = filterResult === "" || item.result === filterResult;
        const dateMatch = filterDate === "" || item.date === filterDate;

        return gameMatch && resultMatch && dateMatch;
    });
}

// Filter Button Event Listener
document.getElementById("applyFilters").addEventListener("click", () => {
    currentPage = 1; // Reset to page 1 after applying filters
    loadBettingHistoryPage(currentPage, applyFilters());
});

// Initial load
loadBettingHistoryPage(1, bettingHistory);
