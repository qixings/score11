document.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    const balanceElement = document.getElementById('balance');
    const profileInfoFront = document.querySelector('.profile-info.front');
    const profileInfoBack = document.querySelector('.profile-info.back');

    function flipCard() {
        profileInfoFront.classList.toggle('active');
        profileInfoFront.classList.toggle('back');
        profileInfoBack.classList.toggle('active');
        profileInfoBack.classList.toggle('back');
    }

    // Example: Setting up balance and username from backend or stored data
    usernameElement.textContent = "Shiv Patel";
    balanceElement.textContent = "₹55554.45";

    document.querySelector('.bank-info-link').addEventListener('click', flipCard);
    profileInfoBack.addEventListener('click', flipCard);

    // Withdraw form functionality
    document.getElementById('withdraw-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const password = document.getElementById('withdraw-password').value;

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid withdraw amount.');
            return;
        }

        if (password === '') {
            alert('Please enter your withdraw password.');
            return;
        }

        // Simulate balance deduction
        let currentBalance = parseFloat(balanceElement.textContent.replace('₹', '').replace(',', ''));

        if (amount > currentBalance) {
            alert('Insufficient balance.');
            return;
        }

        currentBalance -= amount;
        balanceElement.textContent = `₹${currentBalance.toFixed(2)}`;

        // Simulate adding to withdraw history
        const withdrawRequest = {
            username: usernameElement.textContent,
            amount: amount,
            password: password,
            bankInfo: 'STATE BANK OF INDIA...****4977',
            requestTime: new Date().toLocaleString()
        };

        const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
        addWithdrawHistoryEntry(orderId, amount, withdrawRequest.bankInfo, withdrawRequest.requestTime, 'Processing');

        // Clear form fields
        document.getElementById('withdraw-amount').value = '';
        document.getElementById('withdraw-password').value = '';
        alert('Withdraw request submitted successfully!');
    });

    function addWithdrawHistoryEntry(orderId, amount, bankInfo, requestTime, status) {
        const historySection = document.getElementById('withdraw-history');
        const newEntry = document.createElement('div');
        newEntry.classList.add('history-entry');

        newEntry.innerHTML = `
            <div class="withdraw-data">
                <div class="data">
                    <div>Amount:</div>
                    <div style="margin-left: -15px;">₹${amount.toFixed(2)}</div>
                </div>
                <div class="data">
                    <div>Bank:</div>
                    <div>${bankInfo}</div>
                </div>
                <div class="data">
                    <div>Time:</div>
                    <div>${requestTime}</div>
                </div>
                <div class="data">
                    <div>Order ID:</div>
                    <div style="margin-left: -20px;">${orderId}</div>
                </div>
            </div>
            <div class="status-cont" style="background: #24d2cc; border-radius: 6px; font-weight: bold; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 75px; font-size: 12px;">
                <img src="processing.png" alt="" width="20px">
                <div><span class="status">${status}</span></div>
            </div>
        `;

        historySection.appendChild(newEntry);
    }

    function updateWithdrawalStatus(orderId, status) {
        const entries = document.querySelectorAll('.history-entry');
        entries.forEach(entry => {
            const orderIdElement = entry.querySelector('.data:nth-child(4) div:nth-child(2)');
            if (orderIdElement.textContent.trim() === orderId) {
                const statusCont = entry.querySelector('.status-cont');
                const statusText = statusCont.querySelector('.status');

                statusText.textContent = status;  // Update status text

                if (status === 'Success') {
                    statusCont.style.background = 'green';  // Set background to green for success
                } else if (status === 'Failed') {
                    statusCont.style.background = 'red';   // Set background to red for failed
                }
            }
        });
    }
});
