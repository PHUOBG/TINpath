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
  size = 40,
  className = '',
}) => {
  return (
    <img
      src="/images/logo/tinpath_logo.png"
      alt="TinPath Logo"
      width={size}
      height={size}
      onError={(e) => {
        // Fallback if needed
        (e.currentTarget as HTMLImageElement).src =
          '/images/landing/a_modern_clean_square_app_icon_for_an_educational_programming_platform_called.png';
      }}
      className={`shrink-0 rounded-xl object-contain shadow-sm ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
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
      {/* Official App Icon */}
      <TinPathIcon size={size} />

      {showText && (
        <div className="flex flex-col justify-center">
          {/* Main Title: Tin + Path */}
          <div className="flex items-baseline tracking-tight font-black leading-none text-xl sm:text-2xl">
            <span className={textColor ? textColor : 'text-[#0D3B82] dark:text-[#60A5FA]'}>
              Tin
            </span>
            <span className="text-[#1D7BF2] dark:text-[#38BDF8]">
              Path
            </span>
          </div>

          {/* Subtitle: "- Trường Trung Học Phổ Thông Trần Quốc Tuấn" */}
          <span
            className={`text-[11px] sm:text-xs font-semibold tracking-wide mt-0.5 leading-none ${
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

