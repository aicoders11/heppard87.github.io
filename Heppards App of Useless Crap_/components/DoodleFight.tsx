
import React, { useRef, useEffect, useState } from 'react';

interface DoodleFightProps {
  prompt: string;
  onFinish: (imageDataUrl: string) => void;
}

const COLORS = [
    { color: 'rgba(0, 255, 255, 0.8)', shadow: '#00ffff' },
    { color: 'rgba(255, 0, 255, 0.8)', shadow: '#ff00ff' },
    { color: 'rgba(255, 255, 0, 0.8)', shadow: '#ffff00' },
    { color: 'rgba(0, 255, 0, 0.8)', shadow: '#00ff00' },
    { color: 'rgba(255, 100, 0, 0.8)', shadow: '#ff6400' },
];

const BRUSH_SIZES = [4, 8, 16];

const DoodleFight: React.FC<DoodleFightProps> = ({ prompt, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 600;
    canvas.height = 400;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#0a0a1a';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    contextRef.current = context;
  }, []);
  
  useEffect(() => {
      const context = contextRef.current;
      if(!context) return;
      context.strokeStyle = activeColor.color;
      context.shadowColor = activeColor.shadow;
      context.lineWidth = brushSize;
      context.shadowBlur = 10;
  }, [activeColor, brushSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    const getCoords = (e: MouseEvent | TouchEvent): [number, number] => {
        const rect = canvas.getBoundingClientRect();
        const event = 'touches' in e ? e.touches[0] : e;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return [(event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY];
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
        isDrawing = true;
        [lastX, lastY] = getCoords(e);
    };
    
    const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const context = contextRef.current;
        if (!context) return;
        const [x, y] = getCoords(e);
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke();
        [lastX, lastY] = [x, y];
    };

    const stopDrawing = () => isDrawing = false;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [activeColor, brushSize]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (canvasRef.current) onFinish(canvasRef.current.toDataURL('image/png'));
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onFinish]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full my-4 min-h-0">
      <div className="text-center p-2 bg-black/40 backdrop-blur-sm rounded-t-lg border-x border-t border-cyan-500/20 w-full max-w-[600px] mx-auto">
        <p className="text-cyan-200 text-sm">Lumina says to draw:</p>
        <h2 className="text-lg font-bold text-white leading-tight">{prompt}</h2>
      </div>
      <canvas ref={canvasRef} className="border-x border-cyan-500/20 w-full max-w-[600px] aspect-[3/2] mx-auto" />
      <div className="flex justify-between items-center p-2 bg-black/40 backdrop-blur-sm rounded-b-lg border-x border-b border-cyan-500/20 w-full max-w-[600px] mx-auto">
        <div className="flex items-center gap-2">
            {COLORS.map(c => <button key={c.color} onClick={() => setActiveColor(c)} className={`w-6 h-6 rounded-full border-2 ${activeColor.color === c.color ? 'border-white' : 'border-transparent'}`} style={{backgroundColor: c.color, boxShadow: `0 0 10px ${c.shadow}`}}/>)}
        </div>
        <div className="flex items-center gap-2">
            {BRUSH_SIZES.map(size => <button key={size} onClick={() => setBrushSize(size)} className={`rounded-full flex items-center justify-center ${brushSize === size ? 'bg-cyan-400' : 'bg-gray-700'}`} style={{width: size+12, height: size+12}}><div className="bg-white rounded-full" style={{width: size, height: size}}></div></button>)}
        </div>
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 animate-pulse">
            {timeLeft}
        </div>
      </div>
    </div>
  );
};

export default DoodleFight;
