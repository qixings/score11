document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector(".commission-table tbody");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const currentPageDisplay = document.getElementById("currentPage");

    const totalCommissionsDisplay = document.getElementById("totalCommissions");
    const paidCommissionsDisplay = document.getElementById("paidCommissions");
    const pendingCommissionsDisplay = document.getElementById("pendingCommissions");

    const dateRangeSelector = document.getElementById("dateRangeSelector");
    const commissionTypeSelector = document.getElementById("commissionTypeSelector");
    const statusSelector = document.getElementById("statusSelector");
    const searchBar = document.getElementById("searchBar");

    let commissionData = [];
    let filteredData = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    // Function to fetch data from backend (dummy data for now)
    async function fetchCommissionData() {
        // Replace this with an actual fetch call to your backend API
        commissionData = [
            { date: '2024-08-30', type: 'Referral Commission', amount: 500, status: 'Paid', details: 'Referral from user 12345' },
            { date: '2024-08-29', type: 'Bet Commission', amount: 300, status: 'Pending', details: 'Bet placed by user 12345' },
            // ... Add more dynamic data here
        ];

        // Update commission overview
        const totalCommissions = commissionData.reduce((sum, entry) => sum + entry.amount, 0);
        const paidCommissions = commissionData.filter(entry => entry.status === 'Paid').reduce((sum, entry) => sum + entry.amount, 0);
        const pendingCommissions = totalCommissions - paidCommissions;

        totalCommissionsDisplay.textContent = `₹${totalCommissions.toLocaleString()}`;
        paidCommissionsDisplay.textContent = `₹${paidCommissions.toLocaleString()}`;
        pendingCommissionsDisplay.textContent = `₹${pendingCommissions.toLocaleString()}`;

        filterData(); // Initialize filtering after data is fetched
    }

    // Function to paginate data
    function paginate(data, page) {
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        return data.slice(start, end);
    }

    // Function to populate the table with data
    function populateTable(data) {
        tableBody.innerHTML = ''; // Clear existing rows
        const paginatedData = paginate(data, currentPage);

        if (paginatedData.length === 0) {
            const noDataRow = document.createElement("tr");
            noDataRow.innerHTML = `<td colspan="5" style="text-align: center;">No data found</td>`;
            tableBody.appendChild(noDataRow);
        } else {
            paginatedData.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.type}</td>
                    <td>₹${item.amount.toLocaleString()}</td>
                    <td>${item.status}</td>
                    <td>${item.details}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Update pagination buttons
        currentPageDisplay.textContent = currentPage;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = data.length <= currentPage * itemsPerPage;
    }

    // Function to filter data based on user inputs
    function filterData() {
        filteredData = commissionData.slice(); // Clone the array to avoid mutating the original

        // Filter by date range
        const selectedDate = dateRangeSelector.value ? new Date(dateRangeSelector.value) : null;
        if (selectedDate) {
            filteredData = filteredData.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.toDateString() === selectedDate.toDateString();
            });
        }

        // Filter by commission type
        const selectedType = commissionTypeSelector.value;
        if (selectedType !== 'all') {
            filteredData = filteredData.filter(entry => entry.type === selectedType);
        }

        // Filter by status
        const selectedStatus = statusSelector.value;
        if (selectedStatus !== 'all') {
            filteredData = filteredData.filter(entry => entry.status === selectedStatus);
        }

        // Filter by search term
        const searchTerm = searchBar.value.toLowerCase();
        if (searchTerm) {
            filteredData = filteredData.filter(entry => entry.details.toLowerCase().includes(searchTerm));
        }

        // Reset to the first page and populate the table with filtered data
        currentPage = 1;
        populateTable(filteredData);
    }

    // Event listeners for filters
    dateRangeSelector.addEventListener("change", filterData);
    commissionTypeSelector.addEventListener("change", filterData);
    statusSelector.addEventListener("change", filterData);
    searchBar.addEventListener("input", filterData);

    // Event listeners for pagination buttons
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            populateTable(filteredData);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if ((currentPage * itemsPerPage) < filteredData.length) {
            currentPage++;
            populateTable(filteredData);
        }
    });

    // Fetch and populate data initially
    fetchCommissionData();
});
