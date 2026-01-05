document.addEventListener('DOMContentLoaded', () => {
    // Wrapping everything inside this function fixes the "already declared" error
    
    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatBody = document.getElementById('chatBody');

    // 1. Toggle Chat Window
    if (chatIcon && chatWindow) {
        chatIcon.addEventListener('click', () => {
            // Toggle a class to show/hide (requires CSS for .show { display: flex; })
            // Or simple style toggle:
            if (chatWindow.style.display === 'flex') {
                chatWindow.style.display = 'none';
            } else {
                chatWindow.style.display = 'flex';
            }
        });
    }

    // 2. Function to Add Message
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender); // 'user' or 'bot'
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        
        // Auto-scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 3. Handle User Input
    function handleUserMessage() {
        const text = chatInput.value.trim();
        if (text) {
            // Add User Message
            addMessage(text, 'user');
            chatInput.value = '';

            // Simulate Bot Response
            setTimeout(() => {
                const responses = [
                    "That's interesting! Tell me more.",
                    "We offer web, security, and cloud services.",
                    "I'll have a human contact you shortly.",
                    "Cyber security is our specialty."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }

    // 4. Event Listeners for Sending
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', handleUserMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
    }
});
