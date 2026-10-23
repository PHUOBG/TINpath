import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { TinPathLogo } from '../common/TinPathLogo';

interface FooterProps {
  onOpenGoogleHub: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGoogleHub, onOpenPrivacy }) => {
  return (
    <footer className="w-full bg-[#1A1A1A] text-gray-400 text-xs sm:text-sm border-t border-[#2A2A2A] mt-auto">
      <div className="w-full mx-auto px-3 sm:px-5 md:px-6 lg:px-8 xl:px-8 2xl:px-10 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Slogan and Brand */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <TinPathLogo
              size={46}
              textColor="text-white"
              subtextColor="text-blue-300 font-medium"
            />
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Chương trình GDPT 2018 môn Tin học cấp THPT (Lớp 10, 11, 12) · Cấu trúc đề thi định dạng mới từ năm 2025.
            </p>
          </div>

          {/* Quick Actions & Official Standards */}
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <button
              onClick={onOpenGoogleHub}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#FFC928]" />
              Hệ sinh thái Google
            </button>
            <span className="text-gray-600">·</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#22A06B]" />
              Quyền riêng tư & Bảo mật
            </button>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400 font-mono">Bản quyền © 2025-2026 TinPath</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
