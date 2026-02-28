"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

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
      <Link href={m.href} className="hover:text-accent transition-colors">
        {m.text}
      </Link>
    ) : (
      <span>{m.text}</span>
    );
  }, [messages]);

  if (!content || dismissed) return null;

  return (
    <div className="bg-accent text-accent-foreground">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 text-xs font-semibold uppercase tracking-wider md:px-6 lg:px-8">
        <div className="truncate text-center">{content}</div>
        {dismissible ? (
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              try {
                window.localStorage.setItem(storageKey, "1");
              } catch {}
            }}
            className="absolute right-4 shrink-0 rounded-lg p-1 hover:bg-accent-foreground/10"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
