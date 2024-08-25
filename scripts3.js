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

// Function to redirect to specific games
function redirectToOptionTrading() {
    window.location.href = 'optiontrading.html';
}

function redirectToMines() {
    window.location.href = 'mines.html';
}

function redirectToColortrading() {
    window.location.href = 'colortrading.html';
}

function redirectToBigsmall() {
    window.location.href = 'bigsmall.html';
}
function redirectToPlinko() {
    window.location.href = 'plinko.html';
}
function redirectToSpinwin() {
    window.location.href = 'spinwin.html';
}




function scrollGames(direction) {
    const gamesContainer = document.querySelector('.games-container');
    const gameWidth = 120 + 8; // Icon width (120px) + gap (8px)

    if (direction === 'right') {
        gamesContainer.scrollBy({
            left: gameWidth * 1, // Scroll by three icons at a time
            behavior: 'smooth'
        });
    } else if (direction === 'left') {
        gamesContainer.scrollBy({
            left: -gameWidth * 1, // Scroll back by three icons at a time
            behavior: 'smooth'
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const gamesContainer = document.querySelector('.games-container');

    // Reset scroll to start after load
    gamesContainer.scrollLeft = 0;

    // Snapping to position after manual scrolling
    gamesContainer.addEventListener('scroll', () => {
        clearTimeout(gamesContainer.snapTimeout);
        gamesContainer.snapTimeout = setTimeout(() => {
            let currentScroll = gamesContainer.scrollLeft;
            let nearestPosition = Math.round(currentScroll / (120 + 8)) * (120 + 8);
            gamesContainer.scrollTo({
                left: nearestPosition,
                behavior: 'smooth'
            });
        }, 100); // Adjust timeout as needed
    });
});



// Initial function calls to set up event listeners on load
document.addEventListener("DOMContentLoaded", function() {
    // Attach event listeners for game icons
    document.querySelector('.games-section .game:nth-child(1)').addEventListener('click', redirectToOptionTrading);
    document.querySelector('.games-section .game:nth-child(2)').addEventListener('click', redirectToColortrading);
    document.querySelector('.games-section .game:nth-child(3)').addEventListener('click', redirectToMines);
    document.querySelector('.games-section .game:nth-child(4)').addEventListener('click', redirectToBigsmall);
    document.querySelector('.games-section .game:nth-child(5)').addEventListener('click', redirectToPlinko); // Plinko should be here
    document.querySelector('.games-section .game:nth-child(6)').addEventListener('click', function() { redirectToGame('satta'); });
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
