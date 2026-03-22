
import React from 'react';
import ToggleSwitch from './fidgets/ToggleSwitch';
import PopItGrid from './fidgets/PopItGrid';

const FidgetPanel: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-start flex-grow w-full my-4 min-h-0 bg-black/30 backdrop-blur-sm rounded-lg border border-cyan-500/20 p-6 space-y-8 overflow-y-auto">
            <div className="w-full max-w-md">
                <h3 className="text-lg font-bold text-center text-cyan-200 mb-4">Bioluminescent Switches</h3>
                <div className="p-4 bg-black/20 rounded-lg flex justify-around">
                    <ToggleSwitch />
                    <ToggleSwitch />
                    <ToggleSwitch />
                </div>
            </div>
             <div className="w-full max-w-md">
                <h3 className="text-lg font-bold text-center text-pink-200 mb-4">"Vapor Gloss" Pop-It</h3>
                <div className="p-4 bg-black/20 rounded-lg flex justify-center">
                    <PopItGrid />
                </div>
            </div>
        </div>
    );
};

export default FidgetPanel;
