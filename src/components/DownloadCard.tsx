"use client";

import { useRef, useCallback } from "react";
import type { Guest } from "@/types/guest";

interface Props {
  guest: Guest;
}

export default function DownloadCard({ guest }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const link = document.createElement("a");
    link.download = `thiep-tot-nghiep-${guest.key}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [guest.key]);

  return (
    <div className="text-center">
      {/* Hidden card for rendering */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={cardRef}
          style={{ width: 1080, height: 1350 }}
          className="relative flex flex-col items-center justify-center text-center p-16"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #0a1628 0%, #1a4a6b 30%, #5b8fa8 60%, #c4a882 85%, #f0e8d8 100%)",
            }}
          />
          <div className="relative z-10 text-white">
            <p className="text-3xl mb-8 opacity-80">Gửi {guest.display},</p>
            <h2
              className="text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Lễ Tốt Nghiệp
            </h2>
            <div className="text-2xl space-y-2 mb-10 opacity-90">
              <p>Chủ nhật, 05/07/2026</p>
              <p>14:00 chiều</p>
            </div>
            <div className="text-xl opacity-80 space-y-1">
              <p>Hội trường Nguyễn Văn Đạo</p>
              <p>144 Xuân Thủy, Cầu Giấy, Hà Nội</p>
            </div>
            <div className="mt-16 text-lg opacity-60">
              <p>Trần Đức Đăng Khôi</p>
              <p>UET — ĐHQGHN</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="button-3d px-8 py-3 rounded-xl bg-ocean-deep text-ocean-cream font-sans text-sm font-medium hover:bg-ocean-night transition-colors backdrop-blur-sm"
      >
        Tải thiệp mời &darr;
      </button>
    </div>
  );
}
