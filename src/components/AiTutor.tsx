import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

// IMPORTANT: Replace this URL with your Supabase Edge Function URL
const N8N_WEBHOOK_URL = "https://mkivdveacuoazqgaigah.functions.supabase.co/ai-chatbot-function";

interface Message {
    sender: string;
    text: string;
    isUser: boolean;
}

export const AiTutor: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{
        sender: 'AI Tutor',
        text: 'Hello! I\'m your AI tutor. How can I help you study today?',
        isUser: false
    }]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatOutputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        if (chatOutputRef.current) {
            chatOutputRef.current.scrollTop = chatOutputRef.current.scrollHeight;
        }
    }, [messages]);

    const appendMessage = (sender: string, text: string, isUser: boolean) => {
        setMessages(prev => [...prev, { sender, text, isUser }]);
    };

    const sendMessage = async () => {
        const userText = inputText.trim();
        if (userText === '' || isSending) return;

        setInputText('');
        setIsSending(true);
        appendMessage('You', userText, true);

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userText })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP error! Status: ${response.status} - ${errorData.message || 'Server error'}`);
            }

            const data = await response.json();
            if (data.response) {
                appendMessage('AI Tutor', data.response, false);
            } else {
                appendMessage('AI Tutor', "I received an empty or unexpected response. Please try rephrasing your question.", false);
                console.warn('Unexpected response structure from n8n:', data);
            }
        } catch (error) {
            console.error('Error communicating with AI Tutor:', error);
            appendMessage('AI Tutor', `Sorry, I'm having trouble right now: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your internet connection or try again later.`, false);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col w-full max-w-sm transition-all duration-300 ease-in-out ${
            isOpen ? 'h-[400px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-full'
        }`}>
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-3 font-bold rounded-t-lg flex justify-between items-center">
                <span>AI Tutor</span>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:text-gray-200 focus:outline-none"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Output Area */}
            <div ref={chatOutputRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 text-sm">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 my-1 rounded-lg max-w-[80%] ${
                            msg.isUser
                                ? 'self-end bg-blue-100 text-blue-800 ml-auto'
                                : 'self-start bg-gray-200 text-gray-800 mr-auto'
                        }`}
                        dangerouslySetInnerHTML={{
                            __html: `<strong>${msg.sender}:</strong> ${msg.isUser ? msg.text : marked(msg.text)}`
                        }}
                    />
                ))}
            </div>

            {/* Chat Input Area */}
            <div className="p-3 border-t border-gray-200 flex">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask me a question..."
                    disabled={isSending}
                />
                <button
                    onClick={sendMessage}
                    disabled={isSending}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default AiTutor;
