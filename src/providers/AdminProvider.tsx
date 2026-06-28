"use client";

import { SessionProvider } from "next-auth/react";

interface AdminProviderProps {
  children: React.ReactNode;
}

export default function AdminProvider({ children }: AdminProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}