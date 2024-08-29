// Initialize the Socket.IO connection
const socket = io();

// Check if the connection is established
socket.on('connect', () => {
    console.log('Connected to the server');
});

// Handle connection errors
socket.on('connect_error', () => {
    console.error('Failed to connect to the server.');
});

// Username setup (replace with dynamic username if needed)
const username = 'Username'; // Replace this with your dynamic username logic

// Initialize Emoji Button
const picker = new EmojiButton();  // Ensure EmojiButton is defined here
const emojiButton = document.getElementById('emoji-button');
const messageInput = document.getElementById('chat-input');

// Toggle the emoji picker when the emoji button is clicked
emojiButton.addEventListener('click', () => {
    picker.togglePicker(emojiButton);
});

// Add the selected emoji to the chat input
picker.on('emoji', emoji => {
    messageInput.value += emoji;
});

// Sending a message
document.getElementById('send-message-btn').addEventListener('click', () => {
    const message = messageInput.value.trim();

    if (message) {
        // Emit the message to the server
        socket.emit('sendMessage', { text: message, user: username, time: new Date().toLocaleTimeString() }, (ack) => {
            if (ack?.error) {
                console.error('Message failed to send:', ack.error);
            } else {
                console.log('Message sent successfully');
            }
        });

        // Clear input field after sending
        messageInput.value = '';
    }
});

// Receiving messages
socket.on('receiveMessage', (message) => {
    const messagesContainer = document.getElementById('messages-container');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<strong>${message.user}</strong>: ${message.text} <span class="time">${message.time}</span>`;
    messagesContainer.appendChild(messageElement);

    // Scroll to bottom if the user is at or near the bottom of the chat
    const shouldScroll = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 1;
    if (shouldScroll) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

// Optional: Add "Enter" key listener for sending messages
document.getElementById('chat-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (new line in input)
        document.getElementById('send-message-btn').click(); // Trigger the send button click
    }
});

// Voice Recording
const recordButton = document.getElementById('record-voice-button');
let mediaRecorder;
let audioChunks = [];

recordButton.addEventListener('mousedown', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();

                // Send the audio file to the server or handle it as needed
                // socket.emit('sendVoiceMessage', { audio: audioBlob, user: username });

                // Clear audioChunks for the next recording
                audioChunks = [];
            });
        })
        .catch(error => {
            console.error('Error accessing the microphone', error);
        });
});

recordButton.addEventListener('mouseup', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
});
