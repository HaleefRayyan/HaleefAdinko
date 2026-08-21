import React from 'react';

// Adinko / Abiya Leaf Rosette Logo (Exact match with user image)
export const AdinkoLogo = ({ className = "", size = 46, style = {} }) => {
  return (
    <div 
      className={`logo-adinko-wrapper ${className}`} 
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Top Gold Arc */}
        <path 
          d="M 16 42 C 38 14, 78 14, 104 36" 
          stroke="#C5A638" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        
        {/* 4 Sparkle Stars along top right arc */}
        {/* Star 1 */}
        <g transform="translate(82, 14) scale(0.7)">
          <path d="M 5 0 L 6 3.5 L 9.5 4.5 L 6 5.5 L 5 9 L 4 5.5 L 0.5 4.5 L 4 3.5 Z" fill="#C5A638" />
        </g>
        {/* Star 2 */}
        <g transform="translate(90, 20) scale(0.9)">
          <path d="M 5 0 L 6 3.5 L 9.5 4.5 L 6 5.5 L 5 9 L 4 5.5 L 0.5 4.5 L 4 3.5 Z" fill="#C5A638" />
        </g>
        {/* Star 3 */}
        <g transform="translate(98, 28) scale(1.1)">
          <path d="M 5 0 L 6 3.5 L 9.5 4.5 L 6 5.5 L 5 9 L 4 5.5 L 0.5 4.5 L 4 3.5 Z" fill="#C5A638" />
        </g>
        {/* Star 4 */}
        <g transform="translate(106, 38) scale(1.3)">
          <path d="M 5 0 L 6 3.5 L 9.5 4.5 L 6 5.5 L 5 9 L 4 5.5 L 0.5 4.5 L 4 3.5 Z" fill="#C5A638" />
        </g>

        {/* Bottom Green Arc */}
        <path 
          d="M 12 72 C 34 104, 82 104, 108 68" 
          stroke="#5FA314" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />

        {/* Radial Leaves Group */}
        <g transform="translate(60, 58)">
          {/* Top-Left & Left Green Leaves */}
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#4B8210" transform="rotate(345)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#589B13" transform="rotate(15)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#6BAC18" transform="rotate(45)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#7CBD1C" transform="rotate(75)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#589B13" transform="rotate(105)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#4B8210" transform="rotate(135)" />
          
          {/* Bottom-Right & Right Gold / Ochre Leaves */}
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#A88B2A" transform="rotate(165)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#C5A638" transform="rotate(195)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#D6B84A" transform="rotate(225)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#C5A638" transform="rotate(255)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#A88B2A" transform="rotate(285)" />
          <path d="M0 -34 C -7 -20, -7 -7, 0 0 C 7 -7, 7 -20, 0 -34" fill="#6BAC18" transform="rotate(315)" />
        </g>

        {/* Centered ABIYA Brand Letters across the leaves */}
        <text 
          x="60" 
          y="66" 
          textAnchor="middle" 
          fill="#5A4A39" 
          fontFamily="'Montserrat', sans-serif" 
          fontWeight="900" 
          fontSize="23" 
          letterSpacing="7"
        >
          ABIYA
        </text>
      </svg>
    </div>
  );
};

// GhaziSportsHub Monogram Logo
export const GhaziLogo = ({ className = "", size = 42, color = "#FFFFFF" }) => {
  return (
    <div className={`logo-ghazi-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow backdrop subtle */}
        <ellipse cx="50" cy="50" rx="35" ry="35" fill="rgba(115, 182, 14, 0.15)" filter="blur(8px)" />
        
        {/* GSH Modern Monogram Flow */}
        <path 
          d="M 68 22 C 45 15, 20 28, 18 52 C 16 74, 38 86, 60 82 C 72 78, 76 68, 74 58 L 46 58 C 42 58, 38 54, 38 50 C 38 46, 42 42, 46 42 L 72 42 C 78 42, 84 46, 84 54 C 84 72, 68 92, 42 92 C 16 92, 6 70, 8 48 C 10 22, 34 8, 68 8 C 76 8, 82 12, 82 16 C 82 20, 76 22, 68 22 Z" 
          fill={color} 
        />
        {/* Right Swooshes */}
        <path 
          d="M 64 24 C 74 24, 86 32, 90 48 C 91 52, 87 56, 83 56 C 80 56, 76 52, 75 48 C 73 38, 66 32, 60 32 C 56 32, 54 28, 56 25 C 58 24, 61 24, 64 24 Z" 
          fill={color} 
        />
        <path 
          d="M 72 46 C 80 46, 92 54, 94 68 C 95 72, 91 76, 87 76 C 84 76, 80 72, 79 68 C 77 58, 72 54, 66 54 C 62 54, 60 50, 62 47 C 64 46, 68 46, 72 46 Z" 
          fill={color} 
        />
      </svg>
    </div>
  );
};

// Dual Brand Combination Logo (Used in Footer & Hero Badges)
export const DualBrandLogo = ({ className = "", size = 42, light = false }) => {
  return (
    <div className={`dual-brand-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
      <AdinkoLogo size={size} />
      <div style={{ width: '1.5px', height: `${size * 0.7}px`, background: light ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)' }} />
      <GhaziLogo size={size} color={light ? '#FFFFFF' : '#1C231A'} />
    </div>
  );
};
