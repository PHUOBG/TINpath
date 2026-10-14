import React from 'react';

interface TinPathLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  layout?: 'horizontal' | 'vertical';
}

/**
 * TinPath Vector Logo
 * Features:
 * - Academic mortarboard cap in royal blue with golden tassel
 * - Stylized bold "T" letterform
 * - Ascending curved highway/pathway with yellow dashed center lines
 * - Code symbol </> integrated on the right arm
 * - High-contrast, sharp vector rendering at all screen densities
 */
export const TinPathIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="TinPath Logo"
    >
      <defs>
        {/* Gradients matching the logo artwork */}
        <linearGradient id="tinpath-blue-grad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>

        <linearGradient id="cap-top-grad" x1="30" y1="20" x2="170" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        <linearGradient id="tassel-gold" x1="140" y1="40" x2="155" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        {/* Clip path for the road inside the T letter */}
        <clipPath id="t-shape-clip">
          <path d="M42 66 H158 C164 66 168 70 168 76 V108 C168 114 163 118 157 118 H132 V168 C132 174 127 178 121 178 H79 C73 178 68 174 68 168 V118 H42 C36 118 32 114 32 108 V76 C32 70 36 66 42 66 Z" />
        </clipPath>
      </defs>

      {/* 1. Base "T" Letterform */}
      <path
        d="M42 66 H158 C164 66 168 70 168 76 V108 C168 114 163 118 157 118 H132 V168 C132 174 127 178 121 178 H79 C73 178 68 174 68 168 V118 H42 C36 118 32 114 32 108 V76 C32 70 36 66 42 66 Z"
        fill="url(#tinpath-blue-grad)"
      />

      {/* 2. Curving Highway / Roadway inside T */}
      <g clipPath="url(#t-shape-clip)">
        {/* White road surface curving from bottom center up to top right */}
        <path
          d="M68 180 C68 140 82 120 102 102 C120 86 142 75 168 70 V105 C146 109 130 119 116 132 C104 144 98 160 98 180 Z"
          fill="#FFFFFF"
        />

        {/* Perspective Road Border Shadows */}
        <path
          d="M68 180 C68 140 82 120 102 102 C120 86 142 75 168 70"
          stroke="#0F387A"
          strokeWidth="3.5"
          fill="none"
        />
        <path
          d="M98 180 C98 160 104 144 116 132 C130 119 146 109 168 105"
          stroke="#0F387A"
          strokeWidth="3.5"
          fill="none"
        />

        {/* Yellow Dashed Center Lane Dividers */}
        <path
          d="M83 178 C83 166 84 154 87 146"
          stroke="#F59E0B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M92 135 C95 127 100 120 106 114"
          stroke="#F59E0B"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M115 106 C122 100 130 95 138 92"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M147 88 C153 86 159 84 165 83"
          stroke="#F59E0B"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* 3. Code Bracket symbol </> on the right wing */}
      <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* < bracket */}
        <path d="M143 89 L137 94.5 L143 100" />
        {/* / slash */}
        <path d="M149 87 L144 102" />
        {/* > bracket */}
        <path d="M150 89 L156 94.5 L150 100" />
      </g>

      {/* 4. Graduation Cap (Mũ Cử Nhân) */}
      {/* Cap Skull Under-Cap Band */}
      <path
        d="M58 46 C58 46 80 58 100 58 C120 58 142 46 142 46 V55 C142 66 120 74 100 74 C80 74 58 66 58 55 Z"
        fill="#1E3A8A"
      />

      {/* Diamond Mortarboard Top Plate */}
      <polygon
        points="100,16 166,36 100,56 34,36"
        fill="url(#cap-top-grad)"
        stroke="#1D4ED8"
        strokeWidth="1.5"
      />

      {/* Center Cap Button */}
      <ellipse cx="100" cy="36" rx="4.5" ry="3.5" fill="#1E3A8A" />
      <ellipse cx="100" cy="35" rx="3" ry="2" fill="#60A5FA" />

      {/* Golden Tassel hanging down to the right */}
      {/* Thread */}
      <path
        d="M100 36 C118 36 138 41 146 47 C148 50 149 55 149 60"
        stroke="url(#tassel-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tassel Bead & Fringe */}
      <circle cx="149" cy="62" r="3" fill="#EAB308" />
      <path
        d="M146 65 L145 79 C145 80 153 80 153 79 L152 65 Z"
        fill="url(#tassel-gold)"
      />
    </svg>
  );
};

export const TinPathLogo: React.FC<TinPathLogoProps> = ({
  className = '',
  size = 40,
  showText = true,
  textColor,
  subtextColor,
  layout = 'horizontal',
}) => {
  return (
    <div
      className={`flex items-center gap-2.5 select-none ${
        layout === 'vertical' ? 'flex-col text-center' : 'flex-row text-left'
      } ${className}`}
    >
      {/* Vector Icon */}
      <TinPathIcon size={size} />

      {showText && (
        <div className="flex flex-col justify-center">
          {/* Main Title: Tin (darker) + Path (lighter vibrant) */}
          <div className="flex items-baseline tracking-tight font-black leading-none text-xl sm:text-2xl">
            <span className={textColor ? textColor : 'text-[#0D3B82] dark:text-[#60A5FA]'}>
              Tin
            </span>
            <span className="text-[#1D7BF2] dark:text-[#38BDF8]">
              Path
            </span>
          </div>

          {/* Subtitle explicitly requested by user: "- Giáo dục Quảng Ngãi" */}
          <span
            className={`text-[11px] sm:text-xs font-semibold tracking-wide mt-0.5 leading-none ${
              subtextColor
                ? subtextColor
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            - Giáo dục Quảng Ngãi
          </span>
        </div>
      )}
    </div>
  );
};

export default TinPathLogo;
