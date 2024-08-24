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

// Function to redirect to color trading game
function redirectToOptiontrading() {
    window.location.href = 'optiontrading.html';

// Function to redirect to color trading game
function redirectToColortrading() {
    window.location.href = 'colortrading.html';
}
// Function to redirect to Mines game
function redirectToMines() {
    window.location.href = 'mines.html';
}

// Function to redirect to big small game
function redirectToBigsmall() {
    window.location.href = 'bigsmall.html';
}
// Function to redirect to Spin Win game
function redirectToPlinko() {
    window.location.href = 'plinko.html';
}
// Function to redirect to Mines game
function redirectToSatta() {
    window.location.href = 'satta.html';
}

// Function to redirect to Spin Win game
function redirectToSpinwin() {
    window.location.href = 'spinwin.html';
}



// Function to handle horizontal scroll
function scrollGamesContainer(direction) {
    const container = document.querySelector('.games-container');
    const scrollAmount = direction === 'left' ? -200 : 200; // Adjust scroll step as needed
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Initial function calls to set up event listeners on load
document.addEventListener("DOMContentLoaded", function() {

    // Attach event listeners for game icons
       document.querySelector('.games-section .game:nth-child(1)').addEventListener('click', redirectToOptiontrading);
   document.querySelector('.games-section .game:nth-child(2)').addEventListener('click', redirectToColortrading);
document.querySelector('.games-section .game:nth-child(3)').addEventListener('click', redirectToMines);
document.querySelector('.games-section .game:nth-child(4)').addEventListener('click', redirectToBigsmall);
document.querySelector('.games-section .game:nth-child(5)').addEventListener('click', redirectToPlinko);
document.querySelector('.games-section .game:nth-child(6)').addEventListener('click', redirectToSatta);
document.querySelector('.games-section .game:nth-child(7)').addEventListener('click', redirectToSpinwin);


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
