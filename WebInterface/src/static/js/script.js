$(document).ready(function () {
    // Handle login form submission
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const formData = $(this).serialize();

        // Send the login request to the FastAPI backend
        $.post('/token', formData, function (response) {
            $('.auth-form').hide(); 
            $('.chat-container').show(); 
            alert('Вітаємо! Ви увійшли в систему.');
            localStorage.setItem('access_token', response.access_token);
        }).fail(function () {
            alert('Авторизація не вдалася! Перевірте ваші дані.');
        });
    });

    // Send user message
    $('#user-input-button').on('click', function () {
        sendMessage();
    });

    $('#user-input').on('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const chatWindow = $('#chat-window');
        const userInput = $('#user-input');
        const userMessage = userInput.val().trim();
        const accessToken = localStorage.getItem('access_token');

        if (userMessage) {
            const userMessageElement = $('<div class="message user-message"></div>').text(userMessage);
            chatWindow.append(userMessageElement);
            chatWindow.scrollTop(chatWindow[0].scrollHeight);

            // Send user message to backend
            $.ajax({
                type: 'POST',
                url: '/send_message', // Change this to your backend endpoint for sending messages
                headers: {
                    'Authorization': `Bearer ${accessToken}` // Include the token in the request headers
                },
                data: JSON.stringify({ message: userMessage }),
                contentType: 'application/json',
                success: function (response) {
                    // Simulate a bot response for now (you can later integrate a real backend call)
                    const botMessageElement = $('<div class="message bot-message"></div>').text('Bot: ' + response.reply);
                    chatWindow.append(botMessageElement);
                    chatWindow.scrollTop(chatWindow[0].scrollHeight);
                },
                error: function () {
                    alert('Не вдалося надіслати повідомлення.');
                }
            });

            userInput.val(''); // Clear input
        }
    }

    // Function to periodically fetch new messages from the backend
    function fetchMessages() {
        const accessToken = localStorage.getItem('access_token');
        $.ajax({
            type: 'GET',
            url: '/fetch_messages', // Change this to your backend endpoint for fetching messages
            headers: {
                'Authorization': `Bearer ${accessToken}` // Include the token in the request headers
            },
            success: function (response) {
                response.messages.forEach(function (msg) {
                    const botMessageElement = $('<div class="message bot-message"></div>').text(msg);
                    $('#chat-window').append(botMessageElement);
                });
                $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
            },
            error: function () {
                console.error('Не вдалося отримати повідомлення.');
            }
        });
    }

    // Fetch new messages every 5 seconds (change as needed)
    setInterval(fetchMessages, 5000);
});
