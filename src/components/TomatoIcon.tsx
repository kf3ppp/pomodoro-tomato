import React from 'react';

interface TomatoIconProps {
  className?: string;
  size?: number;
}

export const TomatoIcon: React.FC<TomatoIconProps> = ({ className = '', size = 48 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_12px_rgba(255,75,30,0.35)]"
      >
        <defs>
          {/* Main tomato body radial gradient */}
          <radialGradient id="tomatoBody" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FF6B4A" />
            <stop offset="35%" stopColor="#EA3323" />
            <stop offset="75%" stopColor="#B31217" />
            <stop offset="100%" stopColor="#75060A" />
          </radialGradient>

          {/* Top highlight glow */}
          <radialGradient id="specularHighlight" cx="35%" cy="25%" r="30%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF8F70" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF4A26" stopOpacity="0" />
          </radialGradient>

          {/* Leaf green gradient */}
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="50%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>

          {/* Stem gradient */}
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Bottom shadow underneath */}
          <radialGradient id="ambientShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Shadow base */}
        <ellipse cx="32" cy="57" rx="22" ry="4" fill="url(#ambientShadow)" />

        {/* Main Tomato Bulbs (plump 3-lobed shape) */}
        <path
          d="M32 56C19 56 10 47 10 35C10 23 20 18 32 18C44 18 54 23 54 35C54 47 45 56 32 56Z"
          fill="url(#tomatoBody)"
        />

        {/* Subtle lobe creases */}
        <path
          d="M26 19C24 28 24 45 28 55"
          stroke="#7A070B"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M38 19C40 28 40 45 36 55"
          stroke="#7A070B"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Specular gloss shine */}
        <ellipse
          cx="24"
          cy="28"
          rx="10"
          ry="6"
          transform="rotate(-25 24 28)"
          fill="url(#specularHighlight)"
        />
        <ellipse
          cx="42"
          cy="29"
          rx="5"
          ry="3"
          transform="rotate(15 42 29)"
          fill="url(#specularHighlight)"
          opacity="0.6"
        />

        {/* Green Calyx / Leaves */}
        {/* Leaf Left */}
        <path
          d="M32 20C27 18 19 19 16 23C18 25 24 23 30 21"
          fill="url(#leafGrad)"
        />
        {/* Leaf Right */}
        <path
          d="M32 20C37 18 45 19 48 23C46 25 40 23 34 21"
          fill="url(#leafGrad)"
        />
        {/* Leaf Bottom-Left */}
        <path
          d="M32 20C26 23 23 29 24 33C27 30 29 25 32 22"
          fill="url(#leafGrad)"
        />
        {/* Leaf Bottom-Right */}
        <path
          d="M32 20C38 23 41 29 40 33C37 30 35 25 32 22"
          fill="url(#leafGrad)"
        />
        {/* Leaf Top-Center */}
        <path
          d="M32 20C31 15 28 12 30 9C33 12 33 16 32 20"
          fill="url(#leafGrad)"
        />

        {/* Little stem */}
        <path
          d="M32 20C32 15 34 11 38 8"
          stroke="url(#stemGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
