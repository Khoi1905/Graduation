"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Guest } from "@/types/guest";
import guestsData from "../../data/guests.json";

const guests = guestsData as Record<string, Omit<Guest, "key">>;

export function useGuest(): Guest {
  const searchParams = useSearchParams();
  const key = searchParams.get("n") || "default";

  return useMemo(() => {
    const data = guests[key] || guests["default"];
    return { key: guests[key] ? key : "default", ...data };
  }, [key]);
}
