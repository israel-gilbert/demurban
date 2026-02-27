"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Message = { id: string; text: string; href?: string };

export default function AnnouncementTicker({
  messages,
  dismissible = true,
}: {
  messages: Message[];
  dismissible?: boolean;
}) {
  const storageKey = "demurban_ticker_dismissed";
  const initialDismissed =
    typeof window !== "undefined" ? window.localStorage.getItem(storageKey) === "1" : false;

  const [dismissed, setDismissed] = useState<boolean>(initialDismissed);

  const content = useMemo(() => {
    const m = messages?.[0];
    if (!m) return null;
    return m.href ? (
      <Link href={m.href} className="hover:opacity-80">
        {m.text}
      </Link>
    ) : (
      <span>{m.text}</span>
    );
  }, [messages]);

  if (!content || dismissed) return null;

  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-xs text-zinc-700 md:px-6 lg:px-8">
        <div className="truncate">{content}</div>
        {dismissible ? (
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              try {
                window.localStorage.setItem(storageKey, "1");
              } catch {}
            }}
            className="ml-3 shrink-0 rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            aria-label="Dismiss announcement"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
