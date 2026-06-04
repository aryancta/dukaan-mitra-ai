"use client";

import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildAuthHeaders } from "@/lib/api-headers";
import type { ReorderDraft } from "@/lib/types";

interface ReorderCardProps {
  draft?: ReorderDraft;
  onConfirmed: () => void;
}

export function ReorderCard({ draft, onConfirmed }: ReorderCardProps) {
  const [loading, setLoading] = useState(false);

  if (!draft) {
    return (
      <p className="text-sm text-teal-600">
        Low-stock items will trigger a draft supplier message here.
      </p>
    );
  }

  async function confirm() {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/confirm-reorder", {
        method: "POST",
        headers: buildAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Confirm failed");
      toast.success("Reorder confirmed (draft saved)");
      onConfirmed();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4 text-amber-700" />
          Supplier reorder (draft)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-1 text-sm text-teal-900">
          {draft.lines.map((l) => (
            <li key={l.productId}>
              {l.productName}: <strong>{l.suggestedQty}</strong> {l.unit}
            </li>
          ))}
        </ul>
        <pre className="max-h-40 overflow-auto rounded-lg bg-white p-3 text-xs text-teal-800 whitespace-pre-wrap border border-saffron-100">
          {draft.supplierMessage}
        </pre>
        {draft.status === "pending" ? (
          <Button onClick={confirm} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirm order
          </Button>
        ) : (
          <p className="text-sm font-medium text-emerald-700">Order confirmed</p>
        )}
      </CardContent>
    </Card>
  );
}
