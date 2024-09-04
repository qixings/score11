// Example messages data
const messages = [
    {
        id: 1,
        sender: "System",
        subject: "Welcome to Score11!",
        content: "Thank you for joining Score11. We wish you all the best!",
        timestamp: "2024-08-31 12:34",
        isRead: false,
        category: "alerts"
    },
    {
        id: 2,
        sender: "Promotions",
        subject: "Special Offer Just for You!",
        content: "Get 20% bonus on your next deposit. Don't miss out!",
        timestamp: "2024-08-30 11:20",
        isRead: true,
        category: "promotions"
    },
    {
        id: 3,
        sender: "Support",
        subject: "Your Query has been Resolved",
        content: "Dear User, your query regarding withdrawal has been resolved.",
        timestamp: "2024-08-29 09:15",
        isRead: true,
        category: "support"
    },
];

// Function to filter and display messages
function filterMessages(category) {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = ''; // Clear the list

    const filteredMessages = messages.filter(msg => 
        category === 'all' ? true : (category === 'unread' ? !msg.isRead : msg.category === category)
    );

    filteredMessages.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${msg.isRead ? '' : 'unread'}`;
        messageItem.innerHTML = `
            <h4>${msg.subject}</h4>
            <p>${msg.sender} - ${msg.timestamp}</p>
        `;
        messageItem.onclick = () => showMessageDetails(msg.id);
        messageList.appendChild(messageItem);
    });

    // Update active category
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="filterMessages('${category}')"]`).classList.add('active');
}

// Function to show message details
function showMessageDetails(messageId) {
    const message = messages.find(msg => msg.id === messageId);

    document.getElementById('messageSubject').textContent = message.subject;
    document.getElementById('messageSender').textContent = `From: ${message.sender}`;
    document.getElementById('messageTimestamp').textContent = `Received: ${message.timestamp}`;
    document.getElementById('messageContent').textContent = message.content;

    document.getElementById('messageList').style.display = 'none';
    document.getElementById('messageDetails').style.display = 'block';

    message.isRead = true; // Mark message as read
}

// Function to return to the message list
function backToList() {
    document.getElementById('messageDetails').style.display = 'none';
    document.getElementById('messageList').style.display = 'block';
    filterMessages('all'); // Refresh message list
}

// Function to delete a message
function deleteMessage() {
    const messageSubject = document.getElementById('messageSubject').textContent;

    // Find the index of the message in the messages array
    const messageIndex = messages.findIndex(msg => msg.subject === messageSubject);

    // Remove the message from the array
    if (messageIndex !== -1) {
        messages.splice(messageIndex, 1); // Remove the message from the array
    }

    showPopupMessage(`Message "${messageSubject}" has been deleted.`);
    backToList(); // Return to the message list
}

// Function to toggle read/unread status
function toggleReadStatus() {
    const messageSubject = document.getElementById('messageSubject').textContent;
    const message = messages.find(msg => msg.subject === messageSubject);
    message.isRead = !message.isRead;
    showPopupMessage(`Message "${messageSubject}" marked as ${message.isRead ? 'read' : 'unread'}.`);
    backToList();
}

// Function to search messages
function searchMessages() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = ''; // Clear the list

    const filteredMessages = messages.filter(msg => 
        msg.subject.toLowerCase().includes(query) || 
        msg.sender.toLowerCase().includes(query) ||
        msg.content.toLowerCase().includes(query)
    );

    filteredMessages.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${msg.isRead ? '' : 'unread'}`;
        messageItem.innerHTML = `
            <h4>${msg.subject}</h4>
            <p>${msg.sender} - ${msg.timestamp}</p>
        `;
        messageItem.onclick = () => showMessageDetails(msg.id);
        messageList.appendChild(messageItem);
    });
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

// Initialize the inbox
document.addEventListener('DOMContentLoaded', () => {
    filterMessages('all');
});
