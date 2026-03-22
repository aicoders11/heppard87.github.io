
import React, { useState } from 'react';

const PopItButton: React.FC = () => {
    const [isPopped, setIsPopped] = useState(false);

    const handleClick = () => {
        setIsPopped(!isPopped);
    };

    const poppedClasses = 'bg-gradient-to-t from-pink-900/80 to-purple-800/80 pop-it-in';
    const unpoppedClasses = 'bg-gradient-to-b from-pink-500/70 to-purple-500/70 pop-it-out';

    return (
        <button
            onClick={handleClick}
            className={`w-12 h-12 rounded-full transition-colors duration-200 shadow-inner
            ${isPopped ? poppedClasses : unpoppedClasses}`}
        />
    );
};


const PopItGrid: React.FC = () => {
    const grid = Array.from({ length: 16 }); // 4x4 grid

    return (
        <div className="grid grid-cols-4 gap-4">
            {grid.map((_, index) => (
                <PopItButton key={index} />
            ))}
        </div>
    );
};

export default PopItGrid;
