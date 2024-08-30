document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.querySelector('.cta-button');
    const referralInput = document.querySelector('.referral-link input');
    const referralSection = document.getElementById('referral-section');
    const copyFeedback = document.getElementById('copy-feedback');
    const copyLinkButton = document.getElementById('copy-link-button'); // Copy Link button

    // Event listener for "Get Your Referral Link" button
    copyButton.addEventListener('click', function() {
        // Scroll smoothly to the referral link section
        referralSection.scrollIntoView({ behavior: 'smooth' });

        // Optionally, delay the copying of the link until after scrolling
        setTimeout(() => {
            referralInput.select();
            referralInput.setSelectionRange(0, 99999); // For mobile devices

            navigator.clipboard.writeText(referralInput.value)
                .then(() => {
                    // Show feedback message
                    copyFeedback.textContent = 'Referral link copied!';
                    copyFeedback.style.display = 'block';

                    // Automatically hide the feedback after 3 seconds
                    setTimeout(() => {
                        copyFeedback.style.display = 'none';
                    }, 3000); // Adjust the delay as needed
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }, 500); // Adjust the delay as needed
    });

    // Event listener for "Copy Link" button
    copyLinkButton.addEventListener('click', function() {
        // Copy the referral link to the clipboard
        referralInput.select();
        referralInput.setSelectionRange(0, 99999); // For mobile devices

        navigator.clipboard.writeText(referralInput.value)
            .then(() => {
                // Show feedback message
                copyFeedback.textContent = 'Referral link copied!';
                copyFeedback.style.display = 'block';

                // Automatically hide the feedback after 3 seconds
                setTimeout(() => {
                    copyFeedback.style.display = 'none';
                }, 3000); // Adjust the delay as needed
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });
});
