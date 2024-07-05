// Function to handle balance refresh
function refreshBalance() {
    // Get the current balance from the game
    const updatedBalance = getBalance();
    document.getElementById('wallet-balance').textContent = updatedBalance.toFixed(2);
    
    // Add rotate animation
    const refreshIcon = document.querySelector('.fa-arrows-rotate');
    refreshIcon.classList.add('rotate');

    // Remove rotate animation after 1 second
    setTimeout(() => {
        refreshIcon.classList.remove('rotate');
    }, 1000);
}

// Functions to handle button clicks
function withdraw() {
    window.location.href = 'withdraw.html';
}

function deposit() {
    window.location.href = 'deposit.html';
}

function addBankAccount() {
    window.location.href = 'add-bank-account.html';
}

// Functions to handle navigation
function navigateTo(page) {
    window.location.href = page + '.html';
}

// Function to redirect to game
function redirectToGame(game) {
    window.location.href = game + '.html';
}

// Function to redirect to aviator game
function redirectToAviator() {
    window.location.href = 'aviator.html';
}
// Function to redirect to color trading game
function redirectToColortrading() {
    window.location.href = 'colortrading.html';
}
// Function to redirect to big small game
function redirectToBigsmall() {
    window.location.href = 'bigsmall.html';
}
// Function to redirect to Spin Win game
function redirectToSpinwin() {
    window.location.href = 'spinwin.html';
}

// Initial function calls to set up event listeners and refresh balance on load
document.addEventListener("DOMContentLoaded", function() {
    // Refresh the balance on page load
    refreshBalance();

    // Attach event listeners
    document.querySelector('.balance-actions button:nth-child(1)').addEventListener('click', withdraw);
    document.querySelector('.balance-actions button:nth-child(2)').addEventListener('click', deposit);
    document.querySelector('.balance-actions button:nth-child(3)').addEventListener('click', addBankAccount);
    document.querySelector('.balance-info button').addEventListener('click', refreshBalance);

    document.querySelector('.games-section .game:nth-child(1)').addEventListener('click', function() { redirectToGame('satta'); });
    document.querySelector('.games-section .game:nth-child(2)').addEventListener('click', redirectToResults);

    const navItems = document.querySelectorAll('.navigation-menu .nav-item');
    navItems[0].addEventListener('click', function() { navigateTo('home'); });
    navItems[1].addEventListener('click', function() { navigateTo('activity'); });
    navItems[2].addEventListener('click', function() { navigateTo('refer'); });
    navItems[3].addEventListener('click', function() { navigateTo('agent'); });
    navItems[4].addEventListener('click', function() { navigateTo('user-profile'); });
});


// JavaScript for banner slider
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlides() {
    slides.forEach(slide => {
        slide.style.transform = `translateX(-${slideIndex * 100}%)`;
    });
}

function nextSlide() {
    if (slideIndex < totalSlides - 1) {
        slideIndex++;
    } else {
        slideIndex = 0;
    }
    showSlides();
}

// Automatically advance slides every few seconds
setInterval(nextSlide, 5000); // Adjust timing as needed





function navigateTo(page) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.navigation-menu .nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Add active class to the clicked nav item
    const activeItem = document.querySelector(`.nav-item[onclick="navigateTo('${page}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    // Redirect to the appropriate page
    window.location.href = `${page}.html`; // Adjust this logic based on your actual routing
}

// Set initial active state based on the current page
document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname.split('/').pop().split('.').shift();
    const activeItem = document.querySelector(`.nav-item[onclick="navigateTo('${currentPath}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
});
