document.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    const balanceElement = document.getElementById('balance');
    const qrSection = document.getElementById('qr-section');
    const qrCode = document.getElementById('qr-code');
    const upiIdElement = document.getElementById('upi-id');
    const utrSubmitButton = document.getElementById('utr-submit');
    const depositHistorySection = document.getElementById('deposit-history');
    const profileInfoFront = document.querySelector('.profile-info.front');
    const profileInfoBack = document.querySelector('.profile-info.back');

    const servers = [
        { id: 'server1', qr: 'qr1.png', upi: 'demoaccount1@paytm' },
        { id: 'server2', qr: 'qr2.png', upi: 'demoaccount2@paytm' },
        { id: 'server3', qr: 'qr1.png', upi: 'demoaccount3@paytm' }
    ];

    let selectedServer = null;
    let selectedAmount = 0;
    let balance = 55554.45;

    document.getElementById('server1').addEventListener('click', () => selectServer(servers[0]));
    document.getElementById('server2').addEventListener('click', () => selectServer(servers[1]));
    document.getElementById('server3').addEventListener('click', () => selectServer(servers[2]));

    document.querySelectorAll('.amount-button').forEach(button => {
        button.addEventListener('click', () => {
            selectedAmount = parseFloat(button.getAttribute('data-amount'));
            document.getElementById('custom-amount').value = selectedAmount;
        });
    });

    document.getElementById('pay-button').addEventListener('click', () => {
        const customAmount = parseFloat(document.getElementById('custom-amount').value);
        if (customAmount) {
            selectedAmount = customAmount;
        }

        if (!selectedServer || selectedAmount <= 0) {
            alert('Please select a server and enter a valid amount.');
            return;
        }

        qrCode.src = selectedServer.qr;
        upiIdElement.querySelector('span').textContent = selectedServer.upi;
        qrSection.classList.remove('hidden');
    });

    document.getElementById('copy-upi').addEventListener('click', () => {
        const upiIdText = upiIdElement.querySelector('span').textContent;
        navigator.clipboard.writeText(upiIdText).then(() => {
            alert('UPI ID copied to clipboard');
        });
    });

    utrSubmitButton.addEventListener('click', () => {
        const utrNumber = document.getElementById('utr-number').value;
        if (utrNumber === '') {
            alert('Please enter the UTR number.');
            return;
        }

        const depositEntry = {
            amount: selectedAmount,
            bankInfo: selectedServer.upi,
            requestTime: new Date().toLocaleString(),
            utrNumber: utrNumber,
            status: 'Processing'
        };

        addDepositHistoryEntry(depositEntry);
        updateBalance(selectedAmount);
        resetForm();
    });

    function selectServer(server) {
        selectedServer = server;
        servers.forEach(s => {
            const serverButton = document.getElementById(s.id);
            if (s === server) {
                serverButton.classList.add('selected');
            } else {
                serverButton.classList.remove('selected');
            }
        });
    }

    function addDepositHistoryEntry(entry) {
        const newEntry = document.createElement('div');
        newEntry.classList.add('history-entry');

        newEntry.innerHTML = `
            <div class="deposit-data" style=" text-align:left; font-size:12px; width: 280px;    margin-left: 5px;">
            <div style="display:flex;"> 
                <div>Amount:</div> <div style="    margin-left: 25px; text-align:left"> ₹${entry.amount.toFixed(2)}</div>
            </div>
            <div style="display:flex;">
                <div>Bank:</div> <div style="    margin-left: 40px; text-align:left"> ${entry.bankInfo}</div>
            </div>
            <div style="display:flex;">
                <div>Time:</div> <div style="    margin-left: 43px; text-align:left"> ${entry.requestTime}</div>
            </div>
            <div style="display:flex;">    
                <div>UTR: </div> <div style="    margin-left: 43px; text-align:left">${entry.utrNumber}</div>
            </div>    
            </div>
            <div class="status-cont ${entry.status === 'Processing' ? '' : (entry.status === 'Success' ? 'status-success' : 'status-failed')}" style="background: #24d2cc; border-radius: 6px; font-weight: bold; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 75px; font-size: 12px; height: inherit;"> <img src="processing.png" alt="" width="20px">
                ${entry.status}
            </div>
        `;

        depositHistorySection.appendChild(newEntry);
    }

    function resetForm() {
        selectedServer = null;
        selectedAmount = 0;
        document.getElementById('custom-amount').value = '';
        qrSection.classList.add('hidden');
        document.getElementById('utr-number').value = '';
        servers.forEach(s => {
            document.getElementById(s.id).classList.remove('selected');
        });
    }

    function updateBalance(amount) {
        balance += amount;
        balanceElement.textContent = `₹${balance.toFixed(2)}`;
    }

    function flipCard() {
        profileInfoFront.classList.toggle('active');
        profileInfoFront.classList.toggle('back');
        profileInfoBack.classList.toggle('active');
        profileInfoBack.classList.toggle('back');
    }

    // Example: Setting up balance and username from a backend or stored data
    usernameElement.textContent = "Shiv Patel";
    balanceElement.textContent = "₹55554.45";

    // Add event listeners for flip functionality
    document.querySelector('.bank-info-link').addEventListener('click', flipCard);
    profileInfoBack.addEventListener('click', flipCard);
});
