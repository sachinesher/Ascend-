
import React from 'react';

interface AstraMascotProps {
  state?: 'neutral' | 'proud' | 'beast' | 'roast';
  className?: string;
}

export const AstraMascot: React.FC<AstraMascotProps> = ({ state = 'neutral', className = "" }) => {
  const getEyeColor = () => {
    switch (state) {
      case 'beast': return '#f59e0b'; // Amber/Gold
      case 'proud': return '#10b981'; // Emerald
      case 'roast': return '#ef4444'; // Red
      default: return '#8b5cf6'; // Purple
    }
  };

  const getGlowIntensity = () => {
    return state === 'beast' ? 'animate-pulse' : '';
  };

  return (
    <div className={`relative ${className} ${state === 'proud' ? 'animate-bounce' : 'animate-none'}`} style={{ animationDuration: '3s' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        {/* Main Body/Armor */}
        <path 
          d="M20,40 L50,20 L80,40 L70,80 L30,80 Z" 
          fill="#1e293b" 
          stroke="#334155" 
          strokeWidth="2"
        />
        {/* Cyber Wings (Folded) */}
        <path d="M20,40 L10,60 L25,75" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <path d="M80,40 L90,60 L75,75" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        
        {/* Face Plate */}
        <path d="M35,35 L50,25 L65,35 L60,55 L40,55 Z" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1" />
        
        {/* Beak/Sensor */}
        <path d="M45,55 L50,65 L55,55" fill="#334155" />

        {/* Cyber Eyes */}
        <circle cx="43" cy="42" r="3" fill={getEyeColor()} className={getGlowIntensity()}>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="57" cy="42" r="3" fill={getEyeColor()} className={getGlowIntensity()}>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Energy Core */}
        <rect x="47" y="70" width="6" height="2" rx="1" fill={getEyeColor()} opacity="0.6" />
      </svg>
      
      {/* Background Aura */}
      <div className={`absolute inset-0 -z-10 blur-2xl opacity-20 transition-colors duration-500`} 
           style={{ backgroundColor: getEyeColor() }} />
    </div>
  );
};
