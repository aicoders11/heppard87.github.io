
import React, { useState } from 'react';

const ToggleSwitch: React.FC = () => {
    const [isOn, setIsOn] = useState(false);

    const id = React.useId();

    return (
        <div className="relative inline-block w-16 h-8">
            <input
                type="checkbox"
                id={`switch-${id}`}
                className="absolute w-0 h-0 opacity-0"
                checked={isOn}
                onChange={() => setIsOn(!isOn)}
            />
            <label
                htmlFor={`switch-${id}`}
                className={`block w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${isOn ? 'bg-cyan-500/50' : 'bg-purple-800/60'}`}
            >
                <span
                    className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 ease-in-out shadow-lg
                    ${isOn ? 'translate-x-8' : 'translate-x-0'}
                    ${isOn ? 'shadow-cyan-200' : ''}`}
                ></span>
            </label>
        </div>
    );
};

export default ToggleSwitch;
