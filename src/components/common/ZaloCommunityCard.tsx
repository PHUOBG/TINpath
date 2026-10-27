import React, { useState } from 'react';
import { QrCode, ExternalLink, Users, Sparkles, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ZaloCommunityCardProps {
  compact?: boolean;
}

export const ZaloCommunityCard: React.FC<ZaloCommunityCardProps> = ({ compact = false }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden flex flex-col">
        {/* Header styled like VNOI dark title box */}
        <div className="bg-[#202020] text-white px-4 py-2.5 flex items-center justify-between text-sm font-bold">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#0068FF] text-white font-extrabold flex items-center justify-center text-[11px] tracking-tight">
              Z
            </span>
            <span className="uppercase tracking-wide">Nhóm Zalo thảo luận</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-[#0068FF]/30 text-blue-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            1.4k+ online
          </span>
        </div>

        {/* Content body */}
        <div className="p-4 flex flex-col items-center text-center space-y-3">
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
            Cộng đồng Ôn thi Tin học GDPT 2018 Quảng Ngãi
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Nơi thầy cô & thủ khoa hỗ trợ giải đáp câu hỏi trắc nghiệm, bài tập SQL, Python 24/7.
          </p>

          {/* Mock QR Code Visual */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="p-2.5 bg-white rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700/60 shadow-xs cursor-pointer hover:border-[#0068FF] transition-all group relative"
            title="Nhấn để phóng to mã QR"
          >
            {/* SVG Mock QR Code */}
            <svg
              className="w-32 h-32 text-gray-900 transition-transform group-hover:scale-105"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Corner position markers (Top Left, Top Right, Bottom Left) */}
              {/* Top Left */}
              <rect x="5" y="5" width="26" height="26" fill="#111827" rx="3" />
              <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="13" width="10" height="10" fill="#0068FF" rx="1.5" />

              {/* Top Right */}
              <rect x="69" y="5" width="26" height="26" fill="#111827" rx="3" />
              <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="77" y="13" width="10" height="10" fill="#0068FF" rx="1.5" />

              {/* Bottom Left */}
              <rect x="5" y="69" width="26" height="26" fill="#111827" rx="3" />
              <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="77" width="10" height="10" fill="#0068FF" rx="1.5" />

              {/* Timing Pattern Lines */}
              <rect x="34" y="8" width="4" height="4" fill="#111827" />
              <rect x="42" y="8" width="4" height="4" fill="#111827" />
              <rect x="50" y="8" width="4" height="4" fill="#111827" />
              <rect x="58" y="8" width="4" height="4" fill="#111827" />

              <rect x="8" y="34" width="4" height="4" fill="#111827" />
              <rect x="8" y="42" width="4" height="4" fill="#111827" />
              <rect x="8" y="50" width="4" height="4" fill="#111827" />
              <rect x="8" y="58" width="4" height="4" fill="#111827" />

              {/* Data Blocks Grid */}
              <rect x="34" y="16" width="4" height="4" fill="#111827" />
              <rect x="42" y="16" width="4" height="4" fill="#111827" />
              <rect x="54" y="16" width="4" height="4" fill="#111827" />
              <rect x="34" y="24" width="4" height="4" fill="#111827" />
              <rect x="46" y="24" width="4" height="4" fill="#111827" />
              <rect x="58" y="24" width="4" height="4" fill="#111827" />

              <rect x="16" y="34" width="4" height="4" fill="#111827" />
              <rect x="24" y="34" width="4" height="4" fill="#111827" />
              <rect x="36" y="34" width="4" height="4" fill="#111827" />
              <rect x="44" y="34" width="4" height="4" fill="#111827" />
              <rect x="56" y="34" width="4" height="4" fill="#111827" />
              <rect x="68" y="34" width="4" height="4" fill="#111827" />
              <rect x="80" y="34" width="4" height="4" fill="#111827" />
              <rect x="88" y="34" width="4" height="4" fill="#111827" />

              <rect x="16" y="42" width="4" height="4" fill="#111827" />
              <rect x="28" y="42" width="4" height="4" fill="#111827" />
              <rect x="64" y="42" width="4" height="4" fill="#111827" />
              <rect x="76" y="42" width="4" height="4" fill="#111827" />
              <rect x="84" y="42" width="4" height="4" fill="#111827" />

              <rect x="16" y="50" width="4" height="4" fill="#111827" />
              <rect x="24" y="50" width="4" height="4" fill="#111827" />
              <rect x="68" y="50" width="4" height="4" fill="#111827" />
              <rect x="80" y="50" width="4" height="4" fill="#111827" />

              <rect x="16" y="58" width="4" height="4" fill="#111827" />
              <rect x="28" y="58" width="4" height="4" fill="#111827" />
              <rect x="64" y="58" width="4" height="4" fill="#111827" />
              <rect x="72" y="58" width="4" height="4" fill="#111827" />
              <rect x="88" y="58" width="4" height="4" fill="#111827" />

              {/* Bottom Right Data Clusters */}
              <rect x="36" y="68" width="4" height="4" fill="#111827" />
              <rect x="44" y="68" width="4" height="4" fill="#111827" />
              <rect x="56" y="68" width="4" height="4" fill="#111827" />
              <rect x="68" y="68" width="4" height="4" fill="#111827" />
              <rect x="80" y="68" width="4" height="4" fill="#111827" />

              <rect x="36" y="76" width="4" height="4" fill="#111827" />
              <rect x="48" y="76" width="4" height="4" fill="#111827" />
              <rect x="60" y="76" width="4" height="4" fill="#111827" />
              <rect x="72" y="76" width="4" height="4" fill="#111827" />
              <rect x="84" y="76" width="4" height="4" fill="#111827" />

              <rect x="40" y="84" width="4" height="4" fill="#111827" />
              <rect x="52" y="84" width="4" height="4" fill="#111827" />
              <rect x="64" y="84" width="4" height="4" fill="#111827" />
              <rect x="76" y="84" width="4" height="4" fill="#111827" />
              <rect x="88" y="84" width="4" height="4" fill="#111827" />

              {/* Center Logo Placeholder (Zalo Badge) */}
              <rect x="36" y="36" width="28" height="28" fill="white" rx="4" stroke="#0068FF" strokeWidth="2" />
              <rect x="40" y="40" width="20" height="20" fill="#0068FF" rx="3" />
              <text
                x="50"
                y="54"
                textAnchor="middle"
                fontSize="12"
                fontWeight="900"
                fill="white"
                fontFamily="sans-serif"
              >
                Z
              </text>
            </svg>

            <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 font-medium rounded">
              🔍 Phóng to
            </span>
          </div>

          <div className="w-full pt-1 space-y-1.5">
            <button
              onClick={() => setIsZoomOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4" /> Tham gia nhóm Zalo
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Mở ứng dụng Zalo trên điện thoại & quét mã
            </span>
          </div>
        </div>
      </div>

      {/* Enlarged QR Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-sm w-full p-5 border border-gray-200 dark:border-[#333] shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[#0068FF] text-white font-bold flex items-center justify-center text-xs">
                  Z
                </span>
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  Mã QR Nhóm Zalo TinPath
                </span>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300">
              Quét mã bằng camera hoặc tính năng <strong>Quét QR</strong> trên ứng dụng Zalo để tham gia nhóm:
            </p>

            <div className="p-4 bg-white rounded-xl border border-gray-200 inline-block shadow-md">
              <svg className="w-48 h-48 text-gray-900" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="26" height="26" fill="#111827" rx="3" />
                <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="13" width="10" height="10" fill="#0068FF" rx="1.5" />

                <rect x="69" y="5" width="26" height="26" fill="#111827" rx="3" />
                <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="77" y="13" width="10" height="10" fill="#0068FF" rx="1.5" />

                <rect x="5" y="69" width="26" height="26" fill="#111827" rx="3" />
                <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="77" width="10" height="10" fill="#0068FF" rx="1.5" />

                <rect x="34" y="8" width="4" height="4" fill="#111827" />
                <rect x="42" y="8" width="4" height="4" fill="#111827" />
                <rect x="50" y="8" width="4" height="4" fill="#111827" />
                <rect x="58" y="8" width="4" height="4" fill="#111827" />

                <rect x="8" y="34" width="4" height="4" fill="#111827" />
                <rect x="8" y="42" width="4" height="4" fill="#111827" />
                <rect x="8" y="50" width="4" height="4" fill="#111827" />
                <rect x="8" y="58" width="4" height="4" fill="#111827" />

                <rect x="16" y="34" width="4" height="4" fill="#111827" />
                <rect x="24" y="34" width="4" height="4" fill="#111827" />
                <rect x="36" y="34" width="4" height="4" fill="#111827" />
                <rect x="44" y="34" width="4" height="4" fill="#111827" />
                <rect x="56" y="34" width="4" height="4" fill="#111827" />
                <rect x="68" y="34" width="4" height="4" fill="#111827" />
                <rect x="80" y="34" width="4" height="4" fill="#111827" />

                <rect x="36" y="68" width="4" height="4" fill="#111827" />
                <rect x="44" y="68" width="4" height="4" fill="#111827" />
                <rect x="56" y="68" width="4" height="4" fill="#111827" />
                <rect x="68" y="68" width="4" height="4" fill="#111827" />

                <rect x="36" y="36" width="28" height="28" fill="white" rx="4" stroke="#0068FF" strokeWidth="2" />
                <rect x="40" y="40" width="20" height="20" fill="#0068FF" rx="3" />
                <text
                  x="50"
                  y="54"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="900"
                  fill="white"
                  fontFamily="sans-serif"
                >
                  Z
                </text>
              </svg>
            </div>

            <div className="text-[11px] text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Nhóm Zalo: Ôn Thi Tốt Nghiệp THPT Tin Học Quảng Ngãi
              </p>
              <p>Mã nhóm: zalo.me/g/tinpath_quangngai</p>
            </div>

            <button
              onClick={() => setIsZoomOpen(false)}
              className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#2C2C2C] text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};
