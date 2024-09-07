 let generatedOTP; // Store the generated OTP
        let timerInterval; // Store the interval for the OTP countdown

        // Function to handle Forgot Password flow
        function forgotPassword() {
            document.getElementById('currentPassword').style.display = 'none'; // Hide current password input
            document.getElementById('otpSection').style.display = 'block'; // Show OTP section
            document.getElementById('actionButton').textContent = 'Send OTP'; // Change button to "Send OTP"
            document.getElementById('actionButton').onclick = sendOTP; // Change button action to "Send OTP"
            showPopupMessage('Please enter your new password. OTP will be sent.');
        }

        // Function to save new password (default behavior)
        function saveNewPassword() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!currentPassword) {
                showPopupMessage('Please enter your current password.');
                return;
            }

            // Validate new passwords
            if (newPassword !== confirmPassword) {
                showPopupMessage('New passwords do not match!');
                return;
            }

            // Simulate saving new password (in a real app, send to backend)
            showPopupMessage('Password changed successfully!');
        }

        // Function to simulate sending an OTP to the user's phone
        function sendOTP() {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate new passwords
            if (newPassword !== confirmPassword) {
                showPopupMessage('Passwords do not match!');
                return;
            }

            // Simulate OTP generation and "sending" to user's phone
            generatedOTP = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
            console.log("Generated OTP (for demo):", generatedOTP); // Show OTP in console for demo

            // Disable the Send OTP button and start the timer
            document.getElementById('sendOtpButton').disabled = true;
            startOTPTimer(30); // Start a 30-second timer

            // Show success popup
            showPopupMessage('OTP sent to your registered phone number.');

            // Show the verify OTP button now
            document.getElementById('verifyButton').style.display = 'inline';
        }

        // Function to start the OTP timer and handle re-enabling the "Send OTP" button
        function startOTPTimer(duration) {
            let timer = duration;
            const timerDisplay = document.getElementById('otpTimer');
            timerDisplay.style.display = 'inline'; // Show the timer
            timerDisplay.textContent = `Resend OTP in ${timer}s`;

            timerInterval = setInterval(() => {
                timer--;
                timerDisplay.textContent = `Resend OTP in ${timer}s`;

                if (timer <= 0) {
                    clearInterval(timerInterval); // Clear the interval when timer ends
                    timerDisplay.style.display = 'none'; // Hide the timer
                    document.getElementById('sendOtpButton').disabled = false; // Re-enable the button
                }
            }, 1000);
        }

        // Function to verify the OTP and change the password
        function verifyOTP() {
            const otpInput = document.getElementById('otpInput').value.trim();

            if (parseInt(otpInput) === generatedOTP) {
                // Simulate password change (in a real app, send to backend)
                showPopupMessage('Password changed successfully!');
            } else {
                showPopupMessage('Invalid OTP. Please try again.');
            }
        }

        // Function to show popup messages
        function showPopupMessage(message, duration = 3000) {
            const popup = document.getElementById('popupMessage');
            popup.textContent = message;
            popup.classList.add('show');

            // Hide the popup after the specified duration
            setTimeout(() => {
                popup.classList.remove('show');
            }, duration);
        }

        // Function to toggle 2FA
        function toggle2FA(isEnabled) {
            const inputSection = document.getElementById('2faInputSection');
            if (isEnabled) {
                inputSection.style.display = 'block'; // Show input field for 2FA verification
                showPopupMessage('Please provide your mobile number or email to enable 2FA.');
            } else {
                inputSection.style.display = 'none';  // Hide input field when 2FA is disabled
                showPopupMessage('2FA disabled.');
            }
        }

        // Function to verify 2FA input
        function verify2FA() {
            const input = document.getElementById('2faInput').value.trim();
            
            // Basic validation for email or phone number
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\d{10}$/; // 10-digit phone number validation

            if (!emailRegex.test(input) && !phoneRegex.test(input)) {
                showPopupMessage('Please enter a valid email or 10-digit phone number.');
                return;
            }

            // Simulate enabling 2FA (in a real app, this would be sent to the backend)
            showPopupMessage('Two-Factor Authentication enabled successfully!');
        }

        // Function to display login activity
        function loadLoginActivity() {
            const activityList = document.getElementById('loginActivityList');
            activityList.innerHTML = ''; // Clear previous entries

            // Simulated login activity data
            const loginData = [
                { date: '2024-09-01', device: 'Chrome - Windows' },
                { date: '2024-09-02', device: 'Safari - iPhone' },
                { date: '2024-09-03', device: 'Firefox - MacBook' }
            ];

            // Display login activity in list
            loginData.forEach((entry) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.date} - ${entry.device}`;
                activityList.appendChild(listItem);
            });
        }

        // Function to log out from all devices
        function logoutFromAllDevices() {
            // Simulate log out from all devices
            showPopupMessage('Logged out from all devices.');
        }

        // Load initial login activity on page load
        loadLoginActivity();