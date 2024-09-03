// Function to open tabs
function openTab(tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

// Function to validate Account Holder's Name (only alphabets allowed)
function validateAccountHolderName(input) {
    const errorElement = document.getElementById('accountHolderNameError');
    const regex = /^[A-Za-z\s]+$/;

    // Remove non-alphabetic characters as the user types
    input.value = input.value.replace(/[^A-Za-z\s]/g, '');

    if (!regex.test(input.value)) {
        errorElement.textContent = 'Please enter a valid name (alphabets only).';
        input.classList.add('invalid-input');
    } else {
        errorElement.textContent = '';
        input.classList.remove('invalid-input');
    }
}

// Function to validate Account Number (only digits, 11-16 characters)
function validateAccountNumber(input) {
    const errorElement = document.getElementById('accountNumberError');

    // Remove non-numeric characters as the user types
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length < 11 || input.value.length > 16) {
        errorElement.textContent = 'Please enter a valid account number (11 to 16 digits).';
        input.classList.add('invalid-input');
    } else {
        errorElement.textContent = '';
        input.classList.remove('invalid-input');
    }
}

// Function to validate IFSC Code (4 letters followed by 7 alphanumeric characters)
function validateIFSCCode(input) {
    const errorElement = document.getElementById('ifscCodeError');
    const regex = /^[A-Za-z]{4}[0-9]{7}$/; // 4 alphabets followed by 7 digits

    if (!regex.test(input.value)) {
        errorElement.textContent = 'Please enter a valid IFSC code (e.g., SBIN0001234).';
        input.classList.add('invalid-input');
    } else {
        errorElement.textContent = '';
        input.classList.remove('invalid-input');
    }
}

// Function to validate Phone Number (only digits, exactly 10 characters)
function validatePhoneNumber(input) {
    const errorElement = document.getElementById('phoneNumberError');

    // Remove non-numeric characters as the user types
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length !== 10) {
        errorElement.textContent = 'Please enter a valid 10-digit phone number.';
        input.classList.add('invalid-input');
    } else {
        errorElement.textContent = '';
        input.classList.remove('invalid-input');
    }
}

// Function to simulate requesting an OTP
function requestOTP() {
    const accountHolderName = document.getElementById('accountHolderName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const ifscCode = document.getElementById('ifscCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    if (accountHolderName && accountNumber.length >= 11 && accountNumber.length <= 16 && ifscCode && phoneNumber.length === 10) {
        // Save the phone number for later verification
        currentPhoneNumber = phoneNumber;

        // Simulate sending OTP to the phone number
        showPopup(`OTP has been sent to ${phoneNumber}`);

        // Show the OTP section
        document.getElementById('otpSection').style.display = 'block';
    } else {
        showPopup('Please fill out all fields correctly before requesting OTP.');
    }
}

// Function to simulate verifying OTP
function verifyOTP() {
    const otp = document.getElementById('otp').value;

    // Simulate OTP verification
    if (otp === '123456') {
        showPopup('OTP verified successfully.');

        // Save the account details and update the account info display
        saveBankAccountDetails();

        // Hide the OTP section
        document.getElementById('otpSection').style.display = 'none';
    } else {
        showPopup('Invalid OTP. Please try again.');
    }
}

// Function to save and display bank account details
function saveBankAccountDetails() {
    const accountHolderName = document.getElementById('accountHolderName').value;
    const bankName = document.getElementById('bankName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const ifscCode = document.getElementById('ifscCode').value;

    const bankAccountInfo = document.getElementById('bankAccountInfo');
    bankAccountInfo.innerHTML = `
        <h3>Bank Account</h3>
        <p>Account Holder: ${accountHolderName}</p>
        <p>Bank: ${bankName}</p>
        <p>Account Number: ${accountNumber}</p>
        <p>IFSC Code: ${ifscCode}</p>
        <button onclick="showSupportMessage()">Edit</button>
    `;

    // Disable the form fields after saving the account
    disableForm('bankForm');

    // Show the saved accounts section
    document.getElementById('savedAccountsSection').style.display = 'block';
}

// Function to save and display USDT wallet details
function addUSDTWallet() {
    const walletAddress = document.getElementById('walletAddress').value;
    const networkType = document.getElementById('networkType').value;

    const usdtWalletInfo = document.getElementById('usdtWalletInfo');
    usdtWalletInfo.innerHTML = `
        <h3>USDT Wallet</h3>
        <p>Wallet Address: ${walletAddress}</p>
        <p>Network: ${networkType}</p>
        <button onclick="showSupportMessage()">Edit</button>
    `;

    // Disable the form fields after saving the account
    disableForm('usdtForm');

    // Show the saved accounts section
    document.getElementById('savedAccountsSection').style.display = 'block';
}

// Function to disable form fields
function disableForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select, button[type="submit"]');
    inputs.forEach(input => input.disabled = true);
}

// Function to show support message when user clicks on "Edit"
function showSupportMessage() {
    showPopup('If you need to change/modify your bank account, please contact customer support with required document proof.');
}

// Function to show a popup modal
function showPopup(message) {
    const popupModal = document.getElementById('popupModal');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
    popupModal.style.display = 'block';
}

// Function to close the popup modal
function closePopup() {
    document.getElementById('popupModal').style.display = 'none';
}
