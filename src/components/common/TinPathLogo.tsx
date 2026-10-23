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
 * TinPath App Icon
 * Rendered using the official modern square educational app icon
 */
export const TinPathIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 44,
  className = '',
}) => {
  return (
    <img
      src="/images/logo/tinpath_logo.png"
      alt="TinPath Logo"
      width={size}
      height={size}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = '/images/logo/tinpath_logo.png';
      }}
      className={`shrink-0 object-contain drop-shadow-sm ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export const TinPathLogo: React.FC<TinPathLogoProps> = ({
  className = '',
  size = 44,
  showText = true,
  textColor,
  subtextColor,
  layout = 'horizontal',
}) => {
  return (
    <div
      className={`flex items-center gap-3 select-none ${
        layout === 'vertical' ? 'flex-col text-center' : 'flex-row text-left'
      } ${className}`}
    >
      {/* Official App Icon */}
      <TinPathIcon size={size} />

      {showText && (
        <div className="flex flex-col justify-center">
          {/* Main Title: Tin + Path */}
          <div className="flex items-baseline tracking-tight font-black leading-none text-2xl sm:text-[26px]">
            <span className={textColor ? textColor : 'text-[#0D3B82] dark:text-[#60A5FA]'}>
              Tin
            </span>
            <span className="text-[#1D7BF2] dark:text-[#38BDF8]">
              Path
            </span>
          </div>

          {/* Subtitle: "- Trường Trung Học Phổ Thông Trần Quốc Tuấn" */}
          <span
            className={`text-xs sm:text-[13px] font-semibold tracking-wide mt-1 leading-none ${
              subtextColor
                ? subtextColor
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            - Trường Trung Học Phổ Thông Trần Quốc Tuấn
          </span>
        </div>
      )}
    </div>
  );
};

export default TinPathLogo;

