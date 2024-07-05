

/* script.js */

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('ID copied to clipboard');
    });
}



document.getElementById('logoutButton').addEventListener('click', function() {
    // Clear user data from local storage
    localStorage.removeItem('userData');
    
    // Redirect to the login page
    window.location.href = 'index.html'; // Adjust the path as necessary
});





