document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('user-input-button');
    const chatHistory = document.getElementById('chat-history');
    const chatList = document.getElementById('chat-list');
    const noChatsMessage = document.getElementById('no-chats-message');
    const voiceInputButton = document.getElementById('voice-input-button');

    let currentChatId = 1;
    let chatIds = [1, 2, 3];
    let recognition;

    const ws = new WebSocket('ws://localhost:8000/ws');

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function updateChatDisplay() {
        const chatItems = document.getElementById('chat-items');
        noChatsMessage.style.display = chatItems.children.length === 0 ? 'block' : 'none';
    }

    function addMessageToChat(message, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';

        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.innerHTML = `<strong>${sender === 'user' ? 'Ви' : 'Бот'}:</strong> ${escapeHtml(message)}`;

        messageContainer.appendChild(messageElement);
        chatHistory.appendChild(messageContainer);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            const formattedMessage = JSON.stringify({ message, chatId: currentChatId });
            ws.send(formattedMessage);
            addMessageToChat(message, 'user');
            userInput.value = '';
        }
    }

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        const { message, chatId } = data;

        if (chatId == currentChatId) {
            addMessageToChat(message, 'bot');
        }
    };

    ws.onerror = function (error) {
        console.error('WebSocket error:', error);
    };

    ws.onclose = function () {
        console.warn('WebSocket connection closed. Attempting to reconnect...');
        // Optionally, implement a reconnection strategy
    };

    function updateActiveChat() {
        const chatListItems = document.querySelectorAll('#chat-list li');
        chatListItems.forEach(item => {
            item.classList.remove('active-chat');
            const deleteButton = item.querySelector('.delete-chat-button');
            deleteButton.style.display = 'none';
        });
        const newActiveChatItem = chatList.querySelector('li[data-chat-id="' + currentChatId + '"]');
        if (newActiveChatItem) {
            newActiveChatItem.classList.add('active-chat');
            const activeDeleteButton = newActiveChatItem.querySelector('.delete-chat-button');
            activeDeleteButton.style.display = 'inline';
        }
    }

    chatList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' || e.target.classList.contains('delete-chat-button')) {
            if (e.target.classList.contains('delete-chat-button')) {
                const chatIdToRemove = e.target.parentElement.getAttribute('data-chat-id');
                removeChat(chatIdToRemove);
                return;
            }

            currentChatId = e.target.getAttribute('data-chat-id');
            document.getElementById('current-chat-title').textContent = `Чат ${currentChatId}`;
            chatHistory.innerHTML = '';
            updateActiveChat();
        }
    });

    async function removeChat(chatId) {
        const response = await fetch(`/api/chats/${chatId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const chatToRemove = chatList.querySelector(`li[data-chat-id="${chatId}"]`);
            if (chatToRemove) {
                chatList.removeChild(chatToRemove);
                chatIds = chatIds.filter(id => id != chatId);
                if (currentChatId == chatId) {
                    currentChatId = chatIds.length > 0 ? chatIds[0] : null;
                    document.getElementById('current-chat-title').textContent = currentChatId ? `Чат ${currentChatId}` : '';
                    chatHistory.innerHTML = '';
                    updateActiveChat();
                }
                updateChatDisplay();
            }
        } else {
            console.error('Failed to delete chat');
        }
    }

    document.getElementById('add-chat-button').addEventListener('click', async () => {
        const newChatId = chatIds.length > 0 ? Math.max(...chatIds) + 1 : 1;
        chatIds.push(newChatId);

        const newChatItem = document.createElement('li');
        newChatItem.setAttribute('data-chat-id', newChatId);
        newChatItem.innerHTML = `Чат ${newChatId} <button class="delete-chat-button" style="display:none;">🗑️</button>`;

        newChatItem.addEventListener('click', () => {
            currentChatId = newChatId;
            document.getElementById('current-chat-title').textContent = `Чат ${currentChatId}`;
            chatHistory.innerHTML = '';
            updateActiveChat();
        });

        const response = await fetch('/api/chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatId: newChatId })
        });

        if (response.ok) {
            chatList.appendChild(newChatItem);
            updateActiveChat();
        } else {
            console.error('Failed to add chat');
        }
    });

    function startVoiceInput() {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.onstart = () => {
            voiceInputButton.style.backgroundColor = '#ffcccc'; 
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            sendMessageWithVoiceInput(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Voice input error:', event.error);
            resetVoiceInputButton();
        };

        recognition.onend = () => {
            resetVoiceInputButton();
            if (recognition) {
                recognition.stop(); 
            }
        };

        recognition.start();
    }

    function resetVoiceInputButton() {
        voiceInputButton.style.backgroundColor = ''; 
    }

    voiceInputButton.addEventListener('mousedown', startVoiceInput);
    voiceInputButton.addEventListener('mouseup', () => {
        if (recognition) {
            recognition.stop(); 
        }
    });

    function sendMessageWithVoiceInput(message) {
        if (message) {
            const formattedMessage = JSON.stringify({ message, chatId: currentChatId });
            ws.send(formattedMessage);
            addMessageToChat(message, 'user');
        }
    }

    updateActiveChat();
    updateChatDisplay();
});
