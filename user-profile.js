document.addEventListener('DOMContentLoaded', function () {
    // Function to copy user ID to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('ID copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Logout button functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('userData');
            window.location.href = 'index.html'; // Adjust the path as necessary
        });
    }

    // Function to open the modal
    function openLanguageModal() {
        const languageModal = document.getElementById('languageModal');
        if (languageModal) {
            languageModal.style.display = 'flex';
            languageModal.style.zIndex = '9999';
        } else {
            console.error('Language modal not found');
        }
    }

    // Function to close the modal
    function closeModal() {
        const languageModal = document.getElementById('languageModal');
        if (languageModal) {
            languageModal.style.display = 'none';
        } else {
            console.error('Language modal not found');
        }
    }

    // Translations data for Hindi
    const translations = {
        hi: {
            welcome: "प्रोफ़ाइल में आपका स्वागत है",
            balance: "वॉलेट बैलेंस",
            history: "बेटिंग हिस्ट्री",
            transaction: "लेन-देन का इतिहास",
            logout: "लॉग आउट",
            bettingHistory: "बेटिंग हिस्ट्री",
            transactionHistory: "लेन-देन",
            learningCenter: "लर्निंग सेंटर",
            giftCode: "गिफ्ट कोड",
            customerService: "कस्टमर सर्विस सेंटर",
            securitySettings: "सुरक्षा और गोपनीयता सेटिंग्स",
            languageSettings: "भाषा सेटिंग्स",
            appearanceSettings: "दिखावट सेटिंग्स"
        }
    };

    // Function to apply Hindi translations to the UI
    function applyTranslations(selectedLanguage) {
        const selectedLangData = translations[selectedLanguage];
        
        if (!selectedLangData) {
            console.error(`No translations found for language: ${selectedLanguage}`);
            showPopupMessage('Translation not available for the selected language');
            return;
        }

        const welcomeElement = document.querySelector('h2');
        if (welcomeElement) {
            welcomeElement.textContent = selectedLangData.welcome;
        }

        const balanceElement = document.querySelector('.balance-info-user p');
        if (balanceElement) {
            balanceElement.textContent = selectedLangData.balance;
        }

        const bettingHistoryElement = document.querySelector('.cont-content a[href="betting-history.html"] h3');
        if (bettingHistoryElement) {
            bettingHistoryElement.innerHTML = `${selectedLangData.bettingHistory}<br><p>My betting history</p>`;
        }

        const transactionElement = document.querySelector('.cont-content a[href="transaction-history.html"] h3');
        if (transactionElement) {
            transactionElement.innerHTML = `${selectedLangData.transactionHistory}<br><p>My transaction history</p>`;
        }

        const learningCenterElement = document.querySelector('.cont-content a[href="learning-center.html"] h3');
        if (learningCenterElement) {
            learningCenterElement.innerHTML = `${selectedLangData.learningCenter}<br><p>All kinds of video tutorials</p>`;
        }

        const giftCodeElement = document.querySelector('.cont-content a[href="gift-code.html"] h3');
        if (giftCodeElement) {
            giftCodeElement.innerHTML = `${selectedLangData.giftCode}<br><p>Gift Code management</p>`;
        }

        const customerServiceElement = document.querySelector('.cont-content a[href="https://t.me/ronypatelvip"] h3');
        if (customerServiceElement) {
            customerServiceElement.innerHTML = `${selectedLangData.customerService}<br><p>Resolution to all kinds of problems</p>`;
        }

        const securitySettingsElement = document.querySelector('.setting-cont a[href="security-settings.html"]');
        if (securitySettingsElement) {
            securitySettingsElement.innerHTML = `<img src="privacysettingicon.png" alt="" width="25px" style="filter: invert()"> ${selectedLangData.securitySettings}`;
        }

        const languageSettingsElement = document.querySelector('.setting-cont a[href="#languageModal"]');
        if (languageSettingsElement) {
            languageSettingsElement.innerHTML = `<img src="translateicon.png" alt="" width="25px" style="filter: invert()"> ${selectedLangData.languageSettings}`;
        }

        const appearanceSettingsElement = document.querySelector('.setting-cont a[href="appearance-settings.html"]');
        if (appearanceSettingsElement) {
            appearanceSettingsElement.innerHTML = `<img src="settingsicon.png" alt="" width="25px" style="filter: invert()"> ${selectedLangData.appearanceSettings}`;
        }

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.textContent = selectedLangData.logout;
        }
    }

    // Function to save the selected language
    function saveLanguage() {
        const selectedLanguage = document.getElementById('languageDropdown').value;
        
        if (selectedLanguage === 'hi') {
            applyTranslations('hi');
            showPopupMessage('Language changed to Hindi');
        } else {
            showPopupMessage('Language set to English');
        }

        closeModal();
    }

    // Helper function to show a popup message
    function showPopupMessage(message, duration = 3000) {
        const popup = document.getElementById('popupMessage');
        if (popup) {
            popup.textContent = message;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, duration);
        } else {
            console.error('Popup element not found');
        }
    }

    // Attach event listeners
    const languageSettingsLink = document.getElementById('languageSettingsLink');
    if (languageSettingsLink) {
        languageSettingsLink.addEventListener('click', function (event) {
            event.preventDefault();
            openLanguageModal();
        });
    }

    const saveLanguageButton = document.getElementById('saveLanguageButton');
    if (saveLanguageButton) {
        saveLanguageButton.addEventListener('click', saveLanguage);
    }
});
