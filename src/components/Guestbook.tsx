"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Guest } from "@/types/guest";

interface GuestbookEntry {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
}

interface Props {
  guest: Guest;
}

export default function Guestbook({ guest }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof getSupabase>["channel"]> | null = null;
    try {
      const supabase = getSupabase();
      supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setEntries(data);
        });

      channel = supabase
        .channel("guestbook-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "guestbook" },
          (payload) => {
            setEntries((prev) => [payload.new as GuestbookEntry, ...prev]);
          }
        )
        .subscribe();
    } catch {
      // Supabase not configured yet
    }

    return () => {
      if (channel) {
        try { getSupabase().removeChannel(channel); } catch {}
      }
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);

    const supabase = getSupabase();
    await supabase.from("guestbook").insert({
      guest_key: guest.key,
      display_name: guest.display,
      message: message.trim(),
    });

    setMessage("");
    setSending(false);
  };

  return (
    <div>
      <h3 className="font-serif text-2xl text-ocean-deep text-center mb-6">
        Sổ lưu bút
      </h3>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Viết lời nhắn cho Khôi..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="input-3d min-w-0 flex-1 p-3 rounded-xl bg-ocean-cream/75 text-ocean-deep placeholder:text-ocean-deep/38 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-mid"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="button-3d px-4 py-3 rounded-xl bg-ocean-night text-ocean-cream text-sm font-medium disabled:opacity-40 hover:bg-ocean-deep transition-colors"
        >
          Gửi
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="message-card-3d p-3 rounded-lg bg-ocean-cream/55 text-sm"
          >
            <p className="text-ocean-deep/90">{entry.message}</p>
            <p className="text-ocean-deep/40 text-xs mt-1">
              — {entry.display_name}
            </p>
          </div>
        ))}

        {entries.length === 0 && (
          <p className="text-center text-ocean-deep/45 text-sm py-4">
            Chưa có lời nhắn nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  );
}
