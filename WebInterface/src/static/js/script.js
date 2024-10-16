document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('user-input-button');
    const chatHistory = document.getElementById('chat-history');
    const chatList = document.getElementById('chat-list');

    let currentChatId = 1; // Default active chat ID
    const chatIds = [1, 2, 3]; // Array to keep track of active chat IDs

    // Function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Send the message to the backend
            fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            }).then(response => {
                return response.json();
            }).then(data => {
                // Append escaped message to chat history
                chatHistory.innerHTML += `<p><strong>Ви:</strong> ${escapeHtml(message)}</p>`;
                userInput.value = ''; // Clear input after sending
                // Load bot response
                loadBotResponse();
            });
        }
    }

    // Event listener for the Send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener for the Enter key
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default behavior (form submission)
            sendMessage(); // Call sendMessage function
        }
    });

    // Function to load bot response (simulated here)
    function loadBotResponse() {
        fetch('/get-latest-message')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    chatHistory.innerHTML += `<p><strong>Бот:</strong> ${escapeHtml(data.message)}</p>`;
                    chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to bottom
                }
            });
    }

    // Function to update active chat and highlight
    function updateActiveChat() {
        const chatListItems = document.querySelectorAll('#chat-list li');
        chatListItems.forEach(item => {
            item.classList.remove('active-chat'); // Remove active class from all items
            const deleteButton = item.querySelector('.delete-chat-button');
            deleteButton.style.display = 'none'; // Hide delete button initially
        });
        const newActiveChatItem = chatList.querySelector('li[data-chat-id="' + currentChatId + '"]');
        if (newActiveChatItem) {
            newActiveChatItem.classList.add('active-chat'); // Set new active chat
            const activeDeleteButton = newActiveChatItem.querySelector('.delete-chat-button');
            activeDeleteButton.style.display = 'inline'; // Show delete button for active chat
        }
    }

    // Chat selection
    chatList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' || e.target.classList.contains('delete-chat-button')) {
            if (e.target.classList.contains('delete-chat-button')) {
                const chatIdToRemove = e.target.parentElement.getAttribute('data-chat-id');
                removeChat(chatIdToRemove); // Call remove chat function
                return;
            }

            currentChatId = e.target.getAttribute('data-chat-id'); // Get the chat ID from the clicked item
            document.getElementById('current-chat-title').textContent = `Чат ${currentChatId}`;
            chatHistory.innerHTML = ''; // Clear chat history for the selected chat
            updateActiveChat(); // Update the active chat highlight
        }
    });

    // Function to remove chat
    function removeChat(chatId) {
        const chatToRemove = chatList.querySelector(`li[data-chat-id="${chatId}"]`);
        if (chatToRemove) {
            chatList.removeChild(chatToRemove);
            // Remove the chat ID from the array
            const index = chatIds.indexOf(Number(chatId));
            if (index > -1) {
                chatIds.splice(index, 1);
            }
            // Update active chat if the current one is removed
            if (currentChatId == chatId) {
                currentChatId = chatIds.length > 0 ? chatIds[0] : null; // Reset currentChatId to the first chat or null if no chats left
                document.getElementById('current-chat-title').textContent = currentChatId ? `Чат ${currentChatId}` : ''; // Update title
                chatHistory.innerHTML = ''; // Clear chat history
                updateActiveChat(); // Update active chat highlight
            }
        }
    }

    // Add new chat functionality
    document.getElementById('add-chat-button').addEventListener('click', () => {
        // Create a new chat ID
        let newChatId = Math.max(...chatIds) + 1; // Increment based on existing chat IDs
        chatIds.push(newChatId); // Add new ID to array

        const newChatItem = document.createElement('li');
        newChatItem.setAttribute('data-chat-id', newChatId);
        newChatItem.innerHTML = `Чат ${newChatId} <button class="delete-chat-button" style="display:none;">🗑️</button>`; // Add delete button with initial hidden state

        // Add click event for the new chat item
        newChatItem.addEventListener('click', () => {
            currentChatId = newChatId; // Update current chat ID
            document.getElementById('current-chat-title').textContent = `Чат ${currentChatId}`;
            chatHistory.innerHTML = ''; // Clear chat history for the selected chat
            updateActiveChat(); // Update active chat
        });

        chatList.appendChild(newChatItem); // Add new chat to the list
        updateActiveChat(); // Update active chat highlight for new chat
    });

    // Initially set the active chat on page load
    updateActiveChat();
});
