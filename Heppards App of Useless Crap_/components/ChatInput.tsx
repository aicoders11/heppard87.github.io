
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative flex items-center space-x-2 p-2 bg-black/80 backdrop-blur-md rounded-full border border-purple-500/30">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Talk to Lumina..."
          className="flex-grow bg-transparent text-white placeholder-cyan-200/50 resize-none focus:outline-none p-2"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-white flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform="rotate(315)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
