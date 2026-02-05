
import React from 'react';

interface BackgroundProps {
    sentimentScore: number;
}

const Background: React.FC<BackgroundProps> = ({ sentimentScore }) => {
  const showGlitch = sentimentScore < -0.6;
  
  const backgroundStyle: React.CSSProperties = {
      background: `linear-gradient(to bottom right, 
        hsl(var(--hue-1), var(--saturation), var(--brightness)), 
        hsl(var(--hue-2), var(--saturation), var(--brightness)), 
        hsl(var(--hue-3), var(--saturation), var(--brightness)))`,
      transition: 'all 2s ease-in-out',
  };

  return (
    <>
        <div 
            className="absolute inset-0 z-0 w-full h-full animate-gradient" 
            style={backgroundStyle}
        />
        {showGlitch && (
            <div 
                className="absolute inset-0 z-0 w-full h-full animate-glitch" 
                style={{ ...backgroundStyle, filter: 'brightness(1.2)' }}
            />
        )}
    </>
  );
};

export default Background;
