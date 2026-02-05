
import React, { useState, useRef } from 'react';

interface ImageEditPanelProps {
    onEdit: (prompt: string, imageB64: string) => void;
    isLoading: boolean;
}

const ImageEditPanel: React.FC<ImageEditPanelProps> = ({ onEdit, isLoading }) => {
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (prompt && image && !isLoading) {
            onEdit(prompt, image);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center flex-grow w-full my-4 min-h-0 bg-black/30 backdrop-blur-sm rounded-lg border border-cyan-500/20 p-4 space-y-4">
            {!image ? (
                <div 
                    onClick={handleUploadClick}
                    className="w-full h-full flex items-center justify-center border-2 border-dashed border-purple-500/50 rounded-lg cursor-pointer hover:bg-purple-500/10 transition-colors"
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />
                    <span className="text-purple-200">Click to upload an image</span>
                </div>
            ) : (
                <div className="relative w-full max-w-lg aspect-square">
                    <img src={image} alt="Upload preview" className="object-contain w-full h-full rounded-lg" />
                     {isLoading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                            <div className="w-16 h-16 border-4 border-dashed border-cyan-400 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            )}
            <div className="w-full max-w-lg flex space-x-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your edit... (e.g., 'add a retro filter')"
                    className="flex-grow bg-black/50 border border-purple-500/30 rounded-full p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    disabled={!image || isLoading}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!image || !prompt || isLoading}
                    className="px-6 py-3 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-white font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default ImageEditPanel;
