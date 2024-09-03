let isAddressEditable = true;
let currentAddress = ''; // Store the saved address
let isFirstTimeAddress = true; // Track if it's the first time editing the address

// Function to load the default username and phone number
function loadUserInfo(defaultUsername, registeredPhone) {
    document.getElementById('username').value = defaultUsername;
    document.getElementById('phoneNumber').value = registeredPhone;
    document.getElementById('phoneNumber').disabled = true; // Disable phone number editing
}

// Save personal information
function savePersonalInfo() {
    const username = document.getElementById('username').value;
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const postalCode = document.getElementById('postalCode').value;

    if (isAddressEditable) {
        currentAddress = `${street}, ${city}, ${state}, ${postalCode}`.trim();
        if (currentAddress === '') {
            showPopupMessage('Please enter a valid address.');
            return;
        }

        // Hide the address input section and show the saved address section
        document.getElementById('addressInputSection').style.display = 'none';
        document.getElementById('savedAddressSection').style.display = 'block';
        document.getElementById('displayAddress').textContent = currentAddress;
        isAddressEditable = false;

        if (isFirstTimeAddress) {
            showPopupMessage('Your personal information has been saved successfully.');
            isFirstTimeAddress = false; // Mark that the address has been saved once
        } else {
            showPopupMessage('Your personal information has been updated successfully.');
        }
    }
}

// Enable address editing with OTP verification after the first time
function enableAddressEdit() {
    if (isFirstTimeAddress) {
        // If it's the first time editing, just allow the user to edit without OTP
        document.getElementById('addressInputSection').style.display = 'block';
        document.getElementById('savedAddressSection').style.display = 'none';
        const [street, city, state, postalCode] = currentAddress.split(', ');
        document.getElementById('street').value = street || '';
        document.getElementById('city').value = city || '';
        document.getElementById('state').value = state || '';
        document.getElementById('postalCode').value = postalCode || '';
        isAddressEditable = true;
    } else {
        // Require OTP verification for subsequent edits
        showPopupMessage('You need to verify your identity to edit the address.');
        sendOTP(); // Simulate OTP sending

        // Show OTP input field
        document.getElementById('otpInputSection').style.display = 'flex';
        document.getElementById('otpInputSection').style.flexDirection='column';
        document.getElementById('otpInputSection').style.gap='10px';
    }
}

// Simulate OTP sending
function sendOTP() {
    showPopupMessage('OTP has been sent to your registered phone number.');
}

// Handle OTP submission and verification
function verifySubmittedOTP() {
    const otp = document.getElementById('otp').value;
    if (verifyOTP(otp)) {
        // OTP is correct, allow address editing
        document.getElementById('addressInputSection').style.display = 'block';
        document.getElementById('savedAddressSection').style.display = 'none';
        const [street, city, state, postalCode] = currentAddress.split(', ');
        document.getElementById('street').value = street;
        document.getElementById('city').value = city;
        document.getElementById('state').value = state;
        document.getElementById('postalCode').value = postalCode;
        isAddressEditable = true;
        document.getElementById('otpInputSection').style.display = 'none';
    } else {
        showPopupMessage('Invalid OTP. Please try again.');
    }
}

// Simulate OTP verification
function verifyOTP(otp) {
    return otp === '123456'; // Example OTP for simulation
}

// Show popup message
function showPopupMessage(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup-message');
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Example usage of loadUserInfo function
// loadUserInfo('default_user123', '1234567890');
