document.addEventListener("DOMContentLoaded", () => {
    const subordinates = [
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-09-1' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-09-1' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-08-29' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-08-28' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-09-1' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-08-28' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-09-1' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-09-1' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-09-1' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-09-1' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-08-29' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-09-1' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-09-1' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-08-20' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-0-1' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-08-29' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-09-1' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-08-29' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-08-28' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-09-1' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-08-28' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-09-1' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-09-1' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-09-1' },
        { level: 1, userId: '1607812', depositAmount: 4000, betAmount: 22105, commission: 165.79, date: '2024-09-1' },
        { level: 2, userId: '1128778', depositAmount: 54230, betAmount: 291200, commission: 157.78, date: '2024-08-30' },
        { level: 3, userId: '1242408', depositAmount: 90227.5, betAmount: 192400, commission: 101.46, date: '2024-09-1' },

        // Add more subordinate data here...
    ];

    const tableBody = document.getElementById("subordinateTableBody");
    const dateRangeSelector = document.getElementById("dateRangeSelector");
    const levelSelector = document.getElementById("levelSelector");
    const searchBar = document.getElementById("searchBar");
    const depositStatus = document.getElementById("depositStatus");
    const dateRange = document.getElementById("dateRange");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const currentPageDisplay = document.getElementById("currentPage");

    let currentPage = 1;
    const itemsPerPage = 15;
    let filteredData = []; // Store filtered data to use in pagination

    // Helper function to format dates as YYYY-MM-DD
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to paginate data
    function paginate(data, page) {
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        return data.slice(start, end);
    }

    // Function to populate the table with data
    function populateTable() {
        tableBody.innerHTML = ''; // Clear existing rows
        const paginatedData = paginate(filteredData, currentPage);

        if (paginatedData.length === 0) {
            const noDataRow = document.createElement("tr");
            noDataRow.innerHTML = `<td colspan="6" style="text-align: center;">No data found</td>`;
            tableBody.appendChild(noDataRow);
        } else {
            paginatedData.forEach(subordinate => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${subordinate.level}</td>
                    <td>${subordinate.userId}</td>
                    <td>₹${subordinate.depositAmount.toLocaleString()}</td>
                    <td>₹${subordinate.betAmount.toLocaleString()}</td>
                    <td>${subordinate.commission}</td>
                    <td>${subordinate.date}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Update pagination buttons
        currentPageDisplay.textContent = currentPage;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = filteredData.length <= currentPage * itemsPerPage;
    }

    // Function to filter data based on user inputs
    function filterData() {
        filteredData = subordinates.slice(); // Clone the array to avoid mutating the original

        // Sort data by date (latest first)
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Filter by level
        const selectedLevel = levelSelector.value;
        if (selectedLevel !== "all") {
            filteredData = filteredData.filter(sub => sub.level == selectedLevel);
        }

        // Filter by specific date (if a date is selected)
        const selectedDate = dateRangeSelector.value ? new Date(dateRangeSelector.value) : null;
        if (selectedDate) {
            filteredData = filteredData.filter(sub => {
                const subDate = new Date(sub.date);
                return subDate.toDateString() === selectedDate.toDateString();
            });
        }

        // Filter by date range selection
        const selectedRange = dateRange.value;
        const today = new Date();
        let rangeStartDate;

        if (selectedRange === "today") {
            filteredData = filteredData.filter(sub => {
                const subDate = new Date(sub.date);
                return subDate.toDateString() === today.toDateString();
            });
        } else if (selectedRange === "yesterday") {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            filteredData = filteredData.filter(sub => {
                const subDate = new Date(sub.date);
                return subDate.toDateString() === yesterday.toDateString();
            });
        } else if (selectedRange === "7") {
            rangeStartDate = new Date(today);
            rangeStartDate.setDate(today.getDate() - 7);
        } else if (selectedRange === "30") {
            rangeStartDate = new Date(today);
            rangeStartDate.setMonth(today.getMonth() - 1);
        } else if (selectedRange === "90") {
            rangeStartDate = new Date(today);
            rangeStartDate.setMonth(today.getMonth() - 3);
        } else if (selectedRange === "180") {
            rangeStartDate = new Date(today);
            rangeStartDate.setMonth(today.getMonth() - 6);
        }

        if (rangeStartDate) {
            filteredData = filteredData.filter(sub => new Date(sub.date) >= rangeStartDate);
            dateRangeSelector.value = ''; // Clear date input
        }

        // Filter by deposit status
        const selectedStatus = depositStatus.value;
        if (selectedStatus === "deposited") {
            filteredData = filteredData.filter(sub => sub.depositAmount > 0);
        } else if (selectedStatus === "notDeposited") {
            filteredData = filteredData.filter(sub => sub.depositAmount === 0);
        }

        // Filter by search term
        const searchTerm = searchBar.value.toLowerCase();
        if (searchTerm) {
            filteredData = filteredData.filter(sub => sub.userId.includes(searchTerm));
        }

        // Reset to the first page and populate the table with filtered data
        currentPage = 1;
        populateTable();
    }

    // Event listeners for filters
    dateRangeSelector.addEventListener("change", filterData);
    dateRange.addEventListener("change", filterData);
    levelSelector.addEventListener("change", filterData);
    searchBar.addEventListener("input", filterData);
    depositStatus.addEventListener("change", filterData);

    // Event listeners for pagination buttons
    prevPageBtn.addEventListener("click", () => {
        currentPage--;
        populateTable();
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        populateTable();
    });

    // Initial population of the table
    dateRange.value = "today";  // Set the date range to "today" by default
    filterData();  // Call filterData to show today's data on initial load
});
