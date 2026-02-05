
import React from 'react';

interface VinesProps {
  growthLevel: number;
  sentimentScore: number;
}

const Vine: React.FC<{ path: string; length: number; isVisible: boolean; strokeWidth: number }> = ({ path, length, isVisible, strokeWidth }) => {
  const style: React.CSSProperties = {
    strokeDasharray: length,
    strokeDashoffset: isVisible ? 0 : length,
    transition: 'stroke-dashoffset 3s ease-in-out, stroke-width 1.5s ease-in-out',
  };
  return (
    <path
      d={path}
      fill="none"
      stroke="url(#vineGradient)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      style={style}
    />
  );
};

const Vines: React.FC<VinesProps> = ({ growthLevel, sentimentScore }) => {
  const paths = [
    { path: "M 10 10 C 50 100, 150 100, 200 200 S 250 350, 150 400", length: 500 },
    { path: "M 99vw 10 C 95vw 150, 85vw 120, 80vw 250 S 70vw 400, 85vw 500", length: 600 },
    { path: "M 10 99vh C 100 90vh, 50 80vh, 150 70vh S 300 500, 200 450", length: 700 },
    { path: "M 99vw 99vh C 90vw 90vh, 95vw 85vh, 85vw 75vh S 70vw 550, 80vw 500", length: 650 },
    { path: "M 50vw 10 C 40vw 150, 60vw 150, 50vw 300 S 45vw 500, 50vw 600", length: 600 },
  ];

  // Base stroke width of 2, increases up to 4 with positive sentiment, decreases to 1 with negative
  const dynamicStrokeWidth = 2 + (sentimentScore * 2);

  return (
    <svg width="100%" height="100%" className="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <defs>
        <linearGradient id="vineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff00ff', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {paths.map((p, index) => (
        <Vine 
            key={index} 
            path={p.path} 
            length={p.length} 
            isVisible={growthLevel > index * 2 + 1} 
            strokeWidth={dynamicStrokeWidth}
        />
      ))}
    </svg>
  );
};

export default Vines;
