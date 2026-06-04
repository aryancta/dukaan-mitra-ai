"use client";

import Link from "next/link";
import { Info } from "lucide-react";

interface DemoBannerProps {
  showGemini?: boolean;
  showMongo?: boolean;
}

export function DemoBanner({ showGemini, showMongo }: DemoBannerProps) {
  if (!showGemini && !showMongo) return null;

  const parts: string[] = [];
  if (showGemini) parts.push("Gemini");
  if (showMongo) parts.push("MongoDB Atlas");

  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        Demo mode: add your {parts.join(" and ")} API key in{" "}
        <Link href="/settings" className="font-medium underline">
          Settings
        </Link>{" "}
        to enable live results. Seeded data still works for the pitch.
      </p>
    </div>
  );
}
