
import React from 'react';

interface BoredomButtonProps {
    onClick: () => void;
}

const BoredomButton: React.FC<BoredomButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="absolute bottom-4 right-4 z-20 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-400 text-white flex items-center justify-center
            font-bold text-3xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 hover:shadow-[0_0_20px_rgba(255,100,100,0.7)] active:scale-95 animate-pulse"
            title="Boredom Button"
        >
            ?
        </button>
    );
};

export default BoredomButton;
