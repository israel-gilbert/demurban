import React, { useId } from 'react';

interface UrbanTextProps {
  children: string;
  fontSize?: number;
  letterSpacing?: number;
  glow?: boolean;
}

export default function UrbanText({ 
  children, 
  fontSize = 90, 
  letterSpacing = 6,
  glow = true 
}: UrbanTextProps) {
  const uniqueId = useId();
  const clipId = `slash-cut-${uniqueId}`;
  const filterId = `liquid-warp-${uniqueId}`;

  const textLength = children.length;
  const viewBoxWidth = Math.max(500, textLength * (fontSize * 0.65));
  const viewBoxHeight = fontSize * 1.4;
  const midY = fontSize * 0.95;

  return (
    <svg 
      className="w-full h-auto block select-none" 
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
      xmlns="http://w3.org"
      style={{ filter: glow ? 'drop-shadow(0px 6px 15px rgba(255, 0, 51, 0.45))' : 'none' }}
    >
      <defs>
        {/* 
          STREET GRAFFITI FILTER Matrix
          baseFrequency: Controls the tightness of the curves. Lower = large organic waves.
          scale: Controls the intensity of the stretch/curve distortion (35 makes it highly stylized).
        */}
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.012 0.05" 
            numOctaves="2" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="35" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>

        {/* Dynamic Razor Slash Shape tailored to cut across warped curves */}
        <clipPath id={clipId}>
          <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} />
          <polygon 
            points={`
              ${viewBoxWidth * 0.02},${viewBoxHeight * 0.46} 
              ${viewBoxWidth * 0.35},${viewBoxHeight * 0.39} 
              ${viewBoxWidth * 0.65},${viewBoxHeight * 0.48} 
              ${viewBoxWidth * 0.98},${viewBoxHeight * 0.41} 
              ${viewBoxWidth * 0.98},${viewBoxHeight * 0.49} 
              ${viewBoxWidth * 0.65},${viewBoxHeight * 0.55} 
              ${viewBoxWidth * 0.35},${viewBoxHeight * 0.46} 
              ${viewBoxWidth * 0.02},${viewBoxHeight * 0.53}
            `} 
          />
        </clipPath>
      </defs>

      {/* Grouping elements under the liquid-warp filter to make them melt organically */}
      <g filter={`url(#${filterId})`}>
        {/* Red Background Outer Stroke Base layer */}
        <text 
          x="50%" 
          y={midY} 
          textAnchor="middle" 
          fill="none" 
          stroke="#ff0033" 
          strokeWidth="6" 
          fontFamily="Impact, sans-serif" 
          fontSize={fontSize} 
          fontWeight="900" 
          letterSpacing={letterSpacing} 
          clipPath={`url(#${clipId})`}
        >
          {children.toUpperCase()}
        </text>
        
        {/* Primary White Solid Foreground Typography layer */}
        <text 
          x="50%" 
          y={midY} 
          textAnchor="middle" 
          fill="#ffffff" 
          fontFamily="Impact, sans-serif" 
          fontSize={fontSize} 
          fontWeight="900" 
          letterSpacing={letterSpacing} 
          clipPath={`url(#${clipId})`}
        >
          {children.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
