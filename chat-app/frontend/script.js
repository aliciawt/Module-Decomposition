const chatsContainer = document.getElementById("chats-container");
const typingArea = document.getElementById("typing-area");
const typingBox = document.getElementById("typing-box");
const sendButton = document.getElementById("send-button");

const fakeMessages = [
    {message: "Omg this chat is so cute!! 🍡", username: "PixelPrincess", timestamp: "7:42 PM"},
    {message: "Right?? I love the pink vibes 💕", username: "You", timestamp: "7:43 PM"},
    {message: "Has anyone tried the new bubble tea place?", username: "LycheeKing", timestamp: "7:45 PM"}
]

function displayFakeMessage(fakeMessages) {
    for (const message of fakeMessages) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        if (message.username === "You") {
            messageDiv.classList.add("message-user");
        } else {
            messageDiv.classList.add("message-other");
        }

        const usernameDiv = document.createElement("div");
        usernameDiv.classList.add("message-username");
        usernameDiv.textContent = message.username;

        const textDiv = document.createElement("div");
        textDiv.classList.add("message-text");
        textDiv.textContent = message.message;

        const timeDiv = document.createElement("div");
        timeDiv.classList.add("message-timestamp");
        timeDiv.textContent = message.timestamp;

        messageDiv.appendChild(usernameDiv);
        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(timeDiv);

        chatsContainer.appendChild(messageDiv);
    }
}

// displayFakeMessage(fakeMessages);

async function loadMessagesFromBackend() {
    const response = await fetch('http://localhost:3000/messages');
    const messages = await response.json();
    
    for (const message of messages) {
        addNewMessageToChat(message);
    }
}

loadMessagesFromBackend();

function addNewMessageToChat(message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (message.username === "You") {
        messageDiv.classList.add("message-user");
    } else {
        messageDiv.classList.add("message-other");
    }

    const usernameDiv = document.createElement("div");
    usernameDiv.classList.add("message-username");
    usernameDiv.textContent = message.username;

    const textDiv = document.createElement("div");
    textDiv.classList.add("message-text");
    textDiv.style.whiteSpace = "pre-wrap";
    textDiv.textContent = message.message;

    const timeDiv = document.createElement("div");
    timeDiv.classList.add("message-timestamp");
    timeDiv.textContent = message.timestamp;

    messageDiv.appendChild(usernameDiv);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timeDiv);

    chatsContainer.appendChild(messageDiv);
}

function sendMessage() {
    const message = typingBox.value;

    if (message.trim() === "") {
        return;
    }

    const newMessage = {
        message: message,
        username: "You",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newMessage)
    })
    .then(response => response.json())
    .then(savedMessage => {
        addNewMessageToChat(savedMessage);  // Pakai pesan yang sudah disimpan backend
        typingBox.value = "";
        typingBox.focus();
    });
}

sendButton.addEventListener("click", sendMessage);

typingBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});