document.addEventListener('DOMContentLoaded', function() {
    const getReferralLinkButton = document.querySelector('.cta-button');
    const referralInput = document.querySelector('.referral-link input');
    const referralSection = document.getElementById('referral-section');
    const copyFeedback = document.getElementById('copy-feedback');
    const copyLinkButton = document.getElementById('copy-link-button');

    // Modal elements
    const modal = document.getElementById('stats-modal');
    const viewStatsButton = document.querySelector('.progress-tracker .cta-button'); // "View Detailed Stats" button
    const closeModalButton = document.getElementById('close-modal');

    console.log('Script loaded successfully');

    // Simulated data (replace this with your actual data source)
    const referralData = {
        totalReferrals: null,        // Replace with real data or null
        successfulReferrals: null,   // Replace with real data or null
        totalEarnings: null,         // Replace with real data or null
        nextReferrals: null,         // Replace with real data or null
        nextReward: null,            // Replace with real data or null
        progressPercentage: null     // Replace with real data or null
    };

    // Function to update the UI with dynamic data
    function updateReferralData(data) {
        // Utility function to display data or '--' with a specific class
        function displayDataOrPlaceholder(elementId, value) {
            const element = document.getElementById(elementId);
            if (value !== null && value !== undefined) {
                element.innerText = value;
            } else {
                element.innerHTML = '<span class="placeholder">--</span>';
            }
        }

        displayDataOrPlaceholder('total-referrals', data.totalReferrals);
        displayDataOrPlaceholder('successful-referrals', data.successfulReferrals);
        displayDataOrPlaceholder('total-earnings', data.totalEarnings !== null ? `₹${data.totalEarnings}` : null);
        displayDataOrPlaceholder('next-referrals', data.nextReferrals);
        displayDataOrPlaceholder('next-reward', data.nextReward);

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar .progress');
        const progressPercentage = data.progressPercentage || 0; // Default to 0% if not provided
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('data-progress', progressPercentage);

        if (progressPercentage === 0) {
            progressBar.innerHTML = '<span class="placeholder">--</span>';
        }
    }

    // Call the function to update UI
    updateReferralData(referralData);

    // Event listener for "Get Your Referral Link" button
    getReferralLinkButton.addEventListener('click', function() {
        console.log('Get Your Referral Link button clicked');

        // Scroll smoothly to the referral link section with a slight offset
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = referralSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Copy the referral link after scrolling
        setTimeout(() => {
            console.log('Attempting to copy the referral link');
            referralInput.select();
            referralInput.setSelectionRange(0, 99999); // For mobile devices

            navigator.clipboard.writeText(referralInput.value)
                .then(() => {
                    console.log('Referral link copied');
                    // Show feedback message
                    copyFeedback.textContent = 'Referral link copied!';
                    copyFeedback.style.display = 'block';

                    // Automatically hide the feedback after 3 seconds
                    setTimeout(() => {
                        copyFeedback.style.display = 'none';
                    }, 3000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }, 500);
    });

    // Event listener for "Copy Link" button
    copyLinkButton.addEventListener('click', function() {
        console.log('Copy Link button clicked');

        // Copy the referral link to the clipboard
        referralInput.select();
        referralInput.setSelectionRange(0, 99999); // For mobile devices

        navigator.clipboard.writeText(referralInput.value)
            .then(() => {
                console.log('Referral link copied');
                // Show feedback message
                copyFeedback.textContent = 'Referral link copied!';
                copyFeedback.style.display = 'block';

                // Automatically hide the feedback after 3 seconds
                setTimeout(() => {
                    copyFeedback.style.display = 'none';
                }, 3000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });

    // Event listener for "View Detailed Stats" button to open the modal
    viewStatsButton.addEventListener('click', function() {
        console.log('View Detailed Stats button clicked');
        modal.style.display = 'block';

        // Update modal data
        updateModalData(referralData);
    });

    // Event listener for close button to close the modal
    closeModalButton.addEventListener('click', function() {
        console.log('Close button clicked');
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            console.log('Clicked outside modal, closing it');
            modal.style.display = 'none';
        }
    });

    // Function to update modal data
    function updateModalData(data) {
        // Utility function to display data or '--' with a specific class
        function displayDataOrPlaceholderModal(elementId, value) {
            const element = document.getElementById(elementId);
            if (value !== null && value !== undefined) {
                element.innerText = value;
            } else {
                element.innerHTML = '<span class="placeholder">--</span>';
            }
        }

        // Update modal content with data
        displayDataOrPlaceholderModal('modal-total-referrals', data.totalReferrals);
        displayDataOrPlaceholderModal('modal-successful-referrals', data.successfulReferrals);
        displayDataOrPlaceholderModal('modal-total-earnings', data.totalEarnings !== null ? `₹${data.totalEarnings}` : null);
        displayDataOrPlaceholderModal('modal-next-referrals', data.nextReferrals);
        displayDataOrPlaceholderModal('modal-next-reward', data.nextReward);
    }
});
