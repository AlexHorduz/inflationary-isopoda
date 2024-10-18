document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('user-input-button');
    const chatHistory = document.getElementById('chat-history');
    const chatList = document.getElementById('chat-list');

    let currentChatId = 1;
    const chatIds = [1, 2, 3];

    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws');  // Adjust URL if needed

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            const formattedMessage = JSON.stringify({ message, chatId: currentChatId });
            ws.send(formattedMessage); // Send the message via WebSocket
            chatHistory.innerHTML += `<p><strong>Ви:</strong> ${escapeHtml(message)}</p>`;
            userInput.value = '';
            chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the bottom
        }
    }

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Receive and display messages from WebSocket
    ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        const { message, chatId } = data;

        if (chatId == currentChatId) {
            chatHistory.innerHTML += `<p><strong>Бот:</strong> ${escapeHtml(message)}</p>`;
            chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the bottom
        }
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

    function removeChat(chatId) {
        const chatToRemove = chatList.querySelector(`li[data-chat-id="${chatId}"]`);
        if (chatToRemove) {
            chatList.removeChild(chatToRemove);
            const index = chatIds.indexOf(Number(chatId));
            if (index > -1) {
                chatIds.splice(index, 1);
            }
            if (currentChatId == chatId) {
                currentChatId = chatIds.length > 0 ? chatIds[0] : null; 
                document.getElementById('current-chat-title').textContent = currentChatId ? `Чат ${currentChatId}` : '';
                chatHistory.innerHTML = '';
                updateActiveChat();
            }
        }
    }

    document.getElementById('add-chat-button').addEventListener('click', () => {
        let newChatId = Math.max(...chatIds) + 1; 
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

        chatList.appendChild(newChatItem);
        updateActiveChat();
    });

    updateActiveChat();
});
