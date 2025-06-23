// IMPORTANT: Replace this URL with your Supabase Edge Function URL
const N8N_WEBHOOK_URL = "https://mkivdveacuoazqgaigah.functions.supabase.co/ai-chatbot-function";
// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const aiTutorWidget = document.getElementById('ai-tutor-widget');
    const toggleButton = document.getElementById('ai-tutor-toggle-button');
    const chatOutput = document.getElementById('ai-tutor-chat-output');
    const chatInput = document.getElementById('ai-tutor-input');
    const sendButton = document.getElementById('ai-tutor-send-button');
    const toggleIconChevron = document.getElementById('toggle-icon-chevron');
    const toggleIconX = document.getElementById('toggle-icon-x');

    // --- Helper Functions ---

    /**
     * Appends a message to the chat display.
     * @param {string} sender - The sender of the message (e.g., "You", "AI Tutor").
     * @param {string} text - The message text.
     * @param {boolean} isUser - True if the message is from the user, false if from AI.
     */
    const appendMessage = (sender, text, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `p-2 my-1 rounded-lg max-w-[80%] ${
            isUser 
                ? 'self-end bg-blue-100 text-blue-800 ml-auto' 
                : 'self-start bg-gray-200 text-gray-800 mr-auto'
        }`;
        
        // Use marked.js to convert markdown to HTML if it's the AI's response
        // Marked.js should be loaded via CDN in index.html
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${isUser ? text : marked.parse(text)}`;
        
        chatOutput.appendChild(messageDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to bottom
    };

    /**
     * Toggles the visibility and animation of the chat widget.
     */
    const toggleChatWidget = () => {
        const isOpen = aiTutorWidget.classList.contains('h-[400px]'); // Check current open state

        if (isOpen) {
            // Close the widget
            aiTutorWidget.classList.remove('h-[400px]', 'opacity-100', 'translate-y-0');
            aiTutorWidget.classList.add('h-0', 'opacity-0', 'translate-y-full');
            
            toggleIconChevron.classList.remove('hidden');
            toggleIconX.classList.add('hidden');
        } else {
            // Open the widget
            aiTutorWidget.classList.remove('h-0', 'opacity-0', 'translate-y-full');
            aiTutorWidget.classList.add('h-[400px]', 'opacity-100', 'translate-y-0');

            toggleIconChevron.classList.add('hidden');
            toggleIconX.classList.remove('hidden');

            chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to bottom on open
        }
    };

    /**
     * Sends the user's message to the n8n webhook and displays AI's response.
     */
    const sendMessage = async () => {
        const userText = chatInput.value.trim();
        if (userText === '') return;

        appendMessage('You', userText, true); // True because it's a user message
        chatInput.value = '';
        sendButton.disabled = true; // Disable to prevent multiple requests

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userText })
            });

            if (!response.ok) {
                // If the response status is not 2xx, throw an error
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' })); // Try parsing as JSON, fallback
                throw new Error(errorData.error || `HTTP error! Status: ${response.status} - ${errorData.message || 'Server error'}`);
            }

            const data = await response.json();
            if (data.response) {
                appendMessage('AI Tutor', data.response);
            } else {
                appendMessage('AI Tutor', "I received an empty or unexpected response. Please try rephrasing your question.");
                console.warn('Unexpected response structure from n8n:', data);
            }

        } catch (error) {
            console.error('Error communicating with AI Tutor:', error);
            appendMessage('AI Tutor', `Sorry, I'm having trouble right now: ${error.message}. Please check your internet connection or try again later.`);
        } finally {
            sendButton.disabled = false; // Re-enable button
            chatInput.focus(); // Keep focus on input
        }
    };

    // --- Event Listeners ---
    
    toggleButton.addEventListener('click', toggleChatWidget);
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Display welcome message
    appendMessage('AI Tutor', '👋 Hello! I\'m your AI Tutor. I\'m here to help you learn and answer any questions you might have. What would you like to know?');

    // Initialize widget in closed state
    aiTutorWidget.classList.add('h-0', 'opacity-0', 'translate-y-full');
    toggleIconX.classList.add('hidden');
}); 