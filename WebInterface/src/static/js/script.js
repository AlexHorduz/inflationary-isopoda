function sendMessage() {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();

    if (userMessage) {
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.textContent = userMessage;

        chatWindow.appendChild(userMessageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        setTimeout(() => {
            const botMessageElement = document.createElement('div');
            botMessageElement.className = 'message bot-message';
            botMessageElement.textContent = 'Processing your request...';

            chatWindow.appendChild(botMessageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 1000);

        userInput.value = '';
    }
}

document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('user-input-button').addEventListener('click', function (e) {
    sendMessage();
});
