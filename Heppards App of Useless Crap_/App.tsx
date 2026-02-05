
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Message, GameMode } from './types';
import { streamMessage, generateImageEdit, analyzeSentiment } from './services/geminiService';
import { DOODLE_JUDGE_PROMPT, GAME_PROMPTS } from './constants';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import GameMenu from './components/GameMenu';
import Background from './components/Background';
import Vines from './components/Vines';
import BoredomButton from './components/BoredomButton';
import DoodleFight from './components/DoodleFight';
import ImageEditPanel from './components/ImageEditPanel';
import VoiceChatPanel from './components/VoiceChatPanel';
import FidgetPanel from './components/FidgetPanel';

type DoodleState = 'idle' | 'drawing' | 'judging';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { author: 'lumina', content: "Oh, hello there! The data-streams just shimmered a most delightful shade of lilac. What sparkly thoughts are you thinking?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Chat);
  const [doodleState, setDoodleState] = useState<DoodleState>('idle');
  const [sentimentScore, setSentimentScore] = useState(0); // -1 to 1
  const inactivityTimer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--sentiment-score', sentimentScore.toString());
  }, [sentimentScore]);

  const handleSendMessage = async (rawUserInput: string, options?: { image?: string }) => {
    if (!rawUserInput.trim() && !options?.image) return;

    // Analyze sentiment before sending the message
    if (!options?.image && rawUserInput.length > 5) {
        analyzeSentiment(rawUserInput).then(sentiment => {
            if(sentiment) {
                setSentimentScore(sentiment.score);
            }
        });
    }

    const userMessage: Message = { author: 'user', content: rawUserInput, image: options?.image };
    if (rawUserInput !== "Give me a Doodle-Fight prompt" && !options?.image) {
        setMessages(prev => [...prev, userMessage]);
    } else if (options?.image && rawUserInput === DOODLE_JUDGE_PROMPT) {
         setMessages(prev => [...prev, { author: 'user', content: '', image: options.image }]);
    }
    
    setIsLoading(true);

    const gameInstruction = GAME_PROMPTS[gameMode] || '';
    const fullPrompt = `${gameInstruction}\n\nUser: ${rawUserInput}`;

    let luminaResponse = '';
    const updateResponse = (chunk: string) => {
      luminaResponse += chunk;
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.author === 'lumina') {
          return [...prev.slice(0, -1), { author: 'lumina', content: luminaResponse }];
        }
        return [...prev, { author: 'lumina', content: luminaResponse }];
      });
    };

    try {
      await streamMessage(fullPrompt, messages, updateResponse, options?.image);
      if (gameMode === GameMode.DoodleFight && rawUserInput === "Give me a Doodle-Fight prompt") {
        setDoodleState('drawing');
      }
    } catch (error) {
      console.error("Failed to get response from Lumina:", error);
      setMessages(prev => [...prev, { author: 'lumina', content: "Oops, my connection to the bioluminescent dimension flickered for a moment. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageEdit = async (prompt: string, imageB64: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, {author: 'user', content: prompt, image: imageB64}]);
    
    try {
      const editedImage = await generateImageEdit(prompt, imageB64);
      if (editedImage) {
        setMessages(prev => [...prev, {author: 'lumina', content: "Voilà! A fresh glimpse from the data-stream.", image: editedImage}]);
      } else {
        setMessages(prev => [...prev, {author: 'lumina', content: "My apologies, the cosmic energies blurred my vision. Could you try that again?"}]);
      }
    } catch (error) {
      console.error("Failed to edit image:", error);
      setMessages(prev => [...prev, {author: 'lumina', content: "An unexpected glitch! The image seems to have dissolved into pure light."}]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoredomClick = () => {
    setGameMode(GameMode.BoredomBuster);
    handleSendMessage("I'm bored, give me a micro-challenge!");
  };

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setDoodleState('idle');
    if (mode === GameMode.DoodleFight) {
      handleSendMessage("Give me a Doodle-Fight prompt");
    }
  };

  const handleDoodleFinish = async (imageDataUrl: string) => {
    setDoodleState('judging');
    await handleSendMessage(DOODLE_JUDGE_PROMPT, { image: imageDataUrl });
    setDoodleState('idle');
  };

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = window.setTimeout(() => {
      if (doodleState === 'idle' && gameMode !== GameMode.ImageEdit && gameMode !== GameMode.VoiceChat && gameMode !== GameMode.Fidgets) {
        handleSendMessage("I haven't heard from you in a while, tell me about a dream you had.");
      }
    }, 30000); // 30 seconds
  }, [doodleState, gameMode]);

  useEffect(() => {
    resetInactivityTimer();
    return () => { if (inactivityTimer.current) clearTimeout(inactivityTimer.current); };
  }, [messages, resetInactivityTimer]);

  const latestLuminaMessage = messages.filter(m => m.author === 'lumina').pop()?.content || '';

  const showChatInput = gameMode !== GameMode.DoodleFight && gameMode !== GameMode.ImageEdit && gameMode !== GameMode.VoiceChat && gameMode !== GameMode.Fidgets;
  const showChatWindow = doodleState !== 'drawing' && gameMode !== GameMode.ImageEdit && gameMode !== GameMode.VoiceChat && gameMode !== GameMode.Fidgets;

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col items-center justify-center relative overflow-hidden">
      <Background sentimentScore={sentimentScore} />
      <Vines growthLevel={messages.length} sentimentScore={sentimentScore} />
      <div className="w-full h-screen max-w-4xl mx-auto flex flex-col p-4 z-10">
        <header className="text-center p-4 flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
            Heppards App of Useless Crap
          </h1>
          <p className="text-cyan-200 opacity-80">with your friend, Lumina</p>
        </header>

        <GameMenu selectedMode={gameMode} onSelectMode={handleSelectMode} />
        
        <div className="flex-grow flex flex-col min-h-0">
          {gameMode === GameMode.Fidgets && <FidgetPanel />}
          {gameMode === GameMode.VoiceChat && <VoiceChatPanel />}
          {gameMode === GameMode.ImageEdit && <ImageEditPanel onEdit={handleImageEdit} isLoading={isLoading} />}
          {doodleState === 'drawing' && <DoodleFight prompt={latestLuminaMessage} onFinish={handleDoodleFinish} />}
          {showChatWindow && <ChatWindow messages={messages} isLoading={isLoading} />}
        </div>
        
        {showChatInput && (
          <div className="mt-auto flex-shrink-0 pt-4">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        )}
      </div>
       <BoredomButton onClick={handleBoredomClick} />
    </div>
  );
}
