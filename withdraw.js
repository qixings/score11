document.addEventListener('DOMContentLoaded', () => {
    const bankInfoButton = document.getElementById('bank-info-button');
    const changeBankButton = document.getElementById('change-bank-button');
    const profileInfo = document.querySelector('.profile-info');
    const bankInfoSection = document.querySelector('.bank-info-section');
    const cardInfo = document.getElementById('card-info');

    bankInfoButton.addEventListener('click', () => {
        profileInfo.classList.remove('active');
        bankInfoSection.classList.add('active');
        bankInfoButton.style.display = 'block';
        cardInfo.style.display = 'none';  // Hide the bank info button when showing bank info section
    });

    changeBankButton.addEventListener('click', () => {
        window.open('https://t.me/yourtelegramlink', '_blank');  // Open Telegram link in new tab
    });

    bankInfoSection.addEventListener('click', () => {
        bankInfoSection.classList.remove('active');
        profileInfo.classList.add('active');
        bankInfoButton.style.display = 'block';
        cardInfo.style.display = 'flex';  // Show the bank info button when flipping back to profile info
    });

    // Example: Setting up balance and username from a backend or stored data
    document.getElementById('username').textContent = "Shiv Patel";
    document.getElementById('balance').textContent = "₹55554.45";
});

document.getElementById('withdraw-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle the form submission
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
    const balanceElement = document.getElementById('balance');
    let currentBalance = parseFloat(balanceElement.textContent.replace('₹', '').replace(',', ''));

    if (amount > currentBalance) {
        alert('Insufficient balance.');
        return;
    }

    currentBalance -= amount;
    balanceElement.textContent = `₹${currentBalance.toFixed(2)}`;

    // Create withdraw request object
    const withdrawRequest = {
        username: document.getElementById('username').textContent,
        amount: amount,
        password: password,
        bankInfo: 'STATE BANK OF INDIA...****4977',
        requestTime: new Date().toLocaleString()
    };

    // Simulate adding to withdraw history
    const orderId = 'ORD' + Math.floor(Math.random() * 1000000);  // Simulated order ID
    addWithdrawHistoryEntry(orderId, amount, 'STATE BANK OF INDIA...****4977', withdrawRequest.requestTime, 'Processing');

    // Simulate sending request to admin panel (replace with actual API request)
    fetch('https://your-api-endpoint/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(withdrawRequest)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Withdraw request sent to admin:', data);
        // Assuming response includes status from backend
        updateWithdrawalStatus(orderId, data.status);  // Update status based on response
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error scenario if needed
    });

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
