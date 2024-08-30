document.addEventListener("DOMContentLoaded", () => {
    // Simulated agent data
    const agentData = {
        direct: { register: 0, depositNumber: 1, depositAmount: 4000, firstDeposits: 0 },
        team: { register: 2, depositNumber: 12, depositAmount: 730609, firstDeposits: 0 },
        thisWeekRegistrations: 0,
        totalCommission: 6565.69,
        totalDirectSubordinates: 159,
        totalTeamSubordinates: 505
    };

    // Populate the direct and team data
    const populateData = (id, value) => {
        document.getElementById(id).textContent = value;
    };

    populateData('directRegister', agentData.direct.register);
    populateData('directDepositNumber', agentData.direct.depositNumber);
    populateData('directDepositAmount', `₹${agentData.direct.depositAmount}`);
    populateData('directFirstDeposits', agentData.direct.firstDeposits);

    populateData('teamRegister', agentData.team.register);
    populateData('teamDepositNumber', agentData.team.depositNumber);
    populateData('teamDepositAmount', `₹${agentData.team.depositAmount}`);
    populateData('teamFirstDeposits', agentData.team.firstDeposits);

    // Populate the invitation code and promotion data
    populateData('thisWeekRegistrations', agentData.thisWeekRegistrations);
    populateData('totalCommission', `₹${agentData.totalCommission}`);
    populateData('totalDirectSubordinates', agentData.totalDirectSubordinates);
    populateData('totalTeamSubordinates', agentData.totalTeamSubordinates);

    // Sample subordinate data for the chart
    const subordinateData = {
        labels: ["2024-08-01", "2024-08-02", "2024-08-03", "2024-08-04", "2024-08-05", "2024-08-06", "2024-08-07"],
        direct: [3, 5, 7, 6, 4, 8, 10],
        team: [10, 15, 20, 25, 22, 30, 35],
        directDeposits: [1000, 2000, 3000, 2500, 2000, 4000, 5000], // Sample direct deposit data
        teamDeposits: [5000, 10000, 15000, 12000, 10000, 20000, 25000]  // Sample team deposit data
    };

    const ctx = document.getElementById('subordinateChart').getContext('2d');
    let subordinateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: subordinateData.labels,
            datasets: [
                {
                    label: 'Direct Subordinates',
                    data: subordinateData.direct,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: true,
                    tension: 0.5,
                    pointRadius: 1, // Adjusted point size
                    borderWidth: 1,
                    pointHoverRadius: 5 // Adjusted hover size
                },
                {
                    label: 'Team Subordinates',
                    data: subordinateData.team,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.5,
                    pointRadius: 1, // Adjusted point size
                    borderWidth: 1,
                    pointHoverRadius: 5 // Adjusted hover size
                },
                {
                    label: 'Direct Deposits',
                    data: subordinateData.directDeposits,
                    borderColor: '#ff00f2',
                    backgroundColor: 'rgba(255, 87, 51, 0.1)',
                    fill: true,
                    tension: 0.5,
                    pointRadius: 1, // Adjusted point size
                    borderWidth: 1,
                    pointHoverRadius: 5 // Adjusted hover size
                },
                {
                    label: 'Team Deposits',
                    data: subordinateData.teamDeposits,
                    borderColor: '#e1ff00',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    fill: true,
                    tension: 0.5,
                    pointRadius: 1, // Adjusted point size
                    borderWidth: 1,
                    pointHoverRadius: 5 // Adjusted hover size
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    bottom: 45 // Increased padding at the bottom
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        color: '#ffffff',
                        font: { size: 10 }
                    },
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45, // Rotating labels to fit better
                        minRotation: 0,
                        autoSkip: true,
                        padding: 10 // Add padding to give labels more space
                    },
                    grid: {
                        color: '#1b3750', // Set the color of the grid lines for the x-axis
                        lineWidth: 1 // Adjust the width of the grid lines
                    },
                    offset: true // Space out the first and last label from the chart border
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Subordinates / Deposits',
                        color: '#ffffff',
                        font: { size: 10 }
                    },
                    ticks: {
                        font: { size: 10 },
                        stepSize: 5,
                        beginAtZero: true
                    },
                    grid: {
                        color: '#1b3750', // Set the color of the grid lines for the y-axis
                        lineWidth: 1 // Adjust the width of the grid lines
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top', // Place the legend at the top
                    align: 'start', // Align legends items to the start
                    labels: {
                        boxWidth: 20, // Size of the legend color box
                        padding: 10, // Padding around the legend items
                        font: {
                            size: 10 // Font size for legend labels
                        },
                        color: '#ffffff',
                        usePointStyle: true, // Use point styles instead of boxes
                    }
                }
            }
        }
    });

    // Update chart based on selected date range
    const updateChart = (range) => {
        const dataByRange = {
            '7': {
                labels: ["2024-08-01", "2024-08-02", "2024-08-03", "2024-08-04", "2024-08-05", "2024-08-06", "2024-08-07"],
                direct: [3, 5, 7, 6, 4, 8, 10],
                team: [10, 15, 20, 25, 22, 30, 35],
                directDeposits: [1000, 2000, 3000, 2500, 2000, 4000, 5000], // Update accordingly
                teamDeposits: [5000, 10000, 15000, 12000, 10000, 20000, 25000]  // Update accordingly
            },
            '30': {
                labels: ["2024-07-15", "2024-07-20", "2024-07-25", "2024-07-30", "2024-08-04", "2024-08-09", "2024-08-14"],
                direct: [2, 4, 6, 8, 10, 12, 14],
                team: [12, 18, 22, 28, 32, 40, 45],
                directDeposits: [500, 1500, 2500, 2000, 3000, 3500, 4000], // Update accordingly
                teamDeposits: [6000, 11000, 16000, 13000, 11000, 21000, 26000]  // Update accordingly
            },
            '90': {
                labels: ["2024-05-01", "2024-06-01", "2024-07-01", "2024-08-01"],
                direct: [10, 20, 30, 40],
                team: [30, 60, 90, 120],
                directDeposits: [1500, 2500, 3500, 4500], // Update accordingly
                teamDeposits: [7000, 12000, 17000, 22000]  // Update accordingly
            },
            '180': {
                labels: ["2024-02-01", "2024-04-01", "2024-06-01", "2024-08-01"],
                direct: [5, 15, 25, 35],
                team: [25, 45, 65, 85],
                directDeposits: [2000, 3000, 4000, 5000], // Update accordingly
                teamDeposits: [8000, 13000, 18000, 23000]  // Update accordingly
            }
        };

        const selectedData = dataByRange[range] || subordinateData;

        subordinateChart.data.labels = selectedData.labels;
        subordinateChart.data.datasets[0].data = selectedData.direct;
        subordinateChart.data.datasets[1].data = selectedData.team;
        subordinateChart.data.datasets[2].data = selectedData.directDeposits;
        subordinateChart.data.datasets[3].data = selectedData.teamDeposits;
        subordinateChart.update();
    };

    document.getElementById('dateRange').addEventListener('change', (event) => {
        updateChart(event.target.value);
    });
});
