"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Guest } from "@/types/guest";

interface Props {
  guest: Guest;
  onRsvpComplete?: (status: "confirmed" | "declined") => void;
  rsvpDone?: boolean;
}

// Nén + cắt vuông ảnh về 240×240 để tránh phình localStorage.
function resizeImage(file: File, size = 240): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no-ctx"));
        return;
      }
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load-fail"));
    };
    img.src = url;
  });
}

export default function RSVPForm({ guest, onRsvpComplete, rsvpDone }: Props) {
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // cho phép chọn lại cùng 1 file
    if (!file || !file.type.startsWith("image/")) return;
    setAvatarBusy(true);
    try {
      const dataUrl = await resizeImage(file);
      setAvatar(dataUrl);
    } catch {}
    setAvatarBusy(false);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const note = noteRef.current?.value.trim() ?? "";

    try {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();
      const { data: existing } = await supabase
        .from("rsvp")
        .select("id")
        .eq("guest_key", guest.key)
        .maybeSingle();

      let avatarUrl: string | null = null;
      if (avatar) {
        try {
          const blob = await (await fetch(avatar)).blob();
          const path = `${guest.key}-${Date.now()}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(path, blob, { contentType: "image/jpeg", upsert: true });
          if (!uploadError) {
            const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(path);
            avatarUrl = publicData.publicUrl;
          }
        } catch {}
      }

      if (!existing) {
        await supabase.from("rsvp").insert({
          guest_key: guest.key,
          display_name: guest.display,
          attendance: "yes",
          note: note || null,
          avatar_url: avatarUrl,
        });
      } else if (avatarUrl) {
        await supabase.from("rsvp").update({ avatar_url: avatarUrl }).eq("guest_key", guest.key);
      }
    } catch {}

    try {
      if (note) localStorage.setItem("rsvp_note", note);
      if (avatar) localStorage.setItem("rsvp_avatar", avatar);
    } catch {}

    setLoading(false);
    setTransforming(true);
    onRsvpComplete?.("confirmed");
  };

  if (rsvpDone) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <p className="font-serif text-2xl text-ocean-deep">
            Cảm ơn {guest.display}!
          </p>
          <p className="text-ocean-deep/60 mt-2 text-sm">
            Hẹn gặp {guest.pronoun} ở lễ tốt nghiệp nhé.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        animate={transforming ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-serif text-2xl text-ocean-deep text-center mb-6">
          {guest.display} có đến không?
        </h3>

        <div className="flex flex-col items-center mb-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rsvp-avatar-picker relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/60 bg-ocean-cream/70 flex items-center justify-center text-ocean-deep/55 hover:border-ocean-mid transition-colors"
            aria-label="Tải ảnh của bạn"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Ảnh của bạn" className="w-full h-full object-cover" />
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            )}
            {avatarBusy && (
              <span className="absolute inset-0 bg-white/50 flex items-center justify-center text-[10px] text-ocean-deep">…</span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePickFile}
            className="hidden"
          />
          <span className="mt-2 text-[11px] text-ocean-deep/50 font-sans">
            {avatar ? "Đổi ảnh khác" : "Thêm ảnh của bạn (tùy chọn)"}
          </span>
        </div>

        <textarea
          placeholder="Lời nhắn gửi đến Khôi..."
          ref={noteRef}
          onKeyDownCapture={(event) => event.stopPropagation()}
          className="input-3d w-full p-3 rounded-xl bg-ocean-cream/75 text-ocean-deep placeholder:text-ocean-deep/38 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean-mid"
          rows={3}
        />
        <p className="mt-2 text-[11px] text-ocean-deep/45 text-center font-sans">
          Ảnh và lời nhắn sẽ theo sinh vật biển của {guest.pronoun} bơi quanh đại dương ✨
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="button-3d w-full mt-4 py-3 rounded-xl font-sans font-medium text-sm bg-ocean-night text-ocean-cream disabled:opacity-40 hover:bg-ocean-deep transition-colors"
        >
          {loading ? "Đang gửi..." : "Sẽ đến ✓"}
        </button>
      </motion.div>
    </div>
  );
}
