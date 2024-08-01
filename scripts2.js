document.addEventListener('DOMContentLoaded', function() {
    showPage('loading-page');
    setTimeout(function() {
        showPage('language-page');
    }, 2000);
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none'; // Ensure all pages are hidden
    });
    const page = document.getElementById(pageId);
    page.classList.add('active');
    page.style.display = 'block'; // Show the active page
}

function selectLanguage(language) {
    // Set language preference in the app
    showPage('login-page');
}

function showEmailLogin() {
    showPage('email-login-page');
}
function showPhoneLogin() {
    showPage('login-page');
}

function showSignUp() {
    showPage('signup-page');
}
function showLogin() {
    showPage('login-page');
}

// Example: Add event listeners for forms
document.getElementById('phone-login').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle phone login
    const phone = event.target.querySelector('input[type="tel"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    // Add logic to send data to backend
    console.log('Phone login:', phone, password);
});

document.querySelector('#email-login-page form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle email login
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    // Add logic to send data to backend
    console.log('Email login:', email, password);
});

document.querySelector('#signup-page form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle sign up
    const phone = event.target.querySelector('input[type="tel"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    const confirmPassword = event.target.querySelector('input[type="password"]:nth-child(2)').value;
    const invitationCode = event.target.querySelector('input[type="text"]').value;
    const agreement = event.target.querySelector('input[type="checkbox"]').checked;
    // Add logic to send data to backend
    console.log('Sign up:', phone, password, confirmPassword, invitationCode, agreement);
});













document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));


});

function showLoginPage() {
    document.getElementById('loading-page').style.display = 'none';
    document.getElementById('language-page').style.display = 'none'; // Show language selection initially
    document.getElementById('login-page').style.display = 'block';
}

function showSignUp() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('email-login-page').style.display = 'none';
    document.getElementById('signup-page').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('email-login-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
}

// Example function to handle login form submission
document.getElementById('phone-login').addEventListener('submit', function(event) {
    event.preventDefault();
    const phone = event.target.querySelector('input[type="tel"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    // Simulated backend logic (replace with actual backend integration later)
    if (phone === '8080' && password === 'admin') {
        // Simulate login success
        const userData = {
            isLoggedIn: true,
            username: 'Test User',
            phone: phone // You can store more user data if needed
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirect to home page
        window.location.href = 'home.html'; // Replace 'home.html' with your home page URL
    } else {
        alert('Invalid credentials. Please try again.');
    }
});
