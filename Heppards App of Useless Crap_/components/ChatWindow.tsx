
import React, { useEffect, useRef } from 'react';
import { type Message } from '../types';
import Markdown from 'react-markdown';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
    <svg width="60" height="20" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <path
            d="M 5,10 Q 15,0 25,10 T 45,10 T 65,10"
            stroke="url(#grad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="20 100"
            className="animate-wave"
            style={{ filter: 'url(#glow)' }}
        />
        <defs>
            <linearGradient id="grad">
                <stop offset="0%" stopColor="#ff00ff" />
                <stop offset="100%" stopColor="#00ffff" />
            </linearGradient>
        </defs>
    </svg>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-black/30 backdrop-blur-sm rounded-lg border border-cyan-500/20 my-4 custom-scrollbar">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
          <div
            className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-2 rounded-2xl flex flex-col ${
              msg.author === 'user'
                ? 'bg-purple-600/50 rounded-br-none'
                : 'bg-cyan-600/50 rounded-bl-none'
            }`}
          >
            {msg.image && (
              <img src={msg.image} alt="User content" className="rounded-lg mb-2 border-2 border-purple-300/50" />
            )}
            {msg.content && (
              <div className="prose prose-invert prose-p:my-2 prose-headings:my-2 text-white">
                 <Markdown>{msg.content}</Markdown>
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start animate-pop-in">
           <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-cyan-600/50 rounded-bl-none">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
