
import React from 'react';
import { GameMode } from '../types';

interface GameMenuProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ selectedMode, onSelectMode }) => {
  const modes = Object.values(GameMode).filter(mode => mode !== GameMode.BoredomBuster);

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onSelectMode(mode)}
          className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ease-in-out transform ${
            selectedMode === mode
              ? 'bg-gradient-to-br from-cyan-300 to-pink-300 text-black shadow-[0_0_15px_rgba(255,255,255,0.6),inset_0_2px_0_rgba(255,255,255,0.5)] scale-105'
              : 'bg-black/40 text-purple-200 border border-purple-500/30 hover:bg-purple-500/20 hover:text-white hover:border-purple-400 hover:scale-105 hover:shadow-[0_0_10px_rgba(200,150,255,0.4)]'
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};

export default GameMenu;
