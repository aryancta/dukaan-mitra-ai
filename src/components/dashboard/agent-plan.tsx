"use client";

import { Check, Circle, Clock, Hand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AgentPlanStep } from "@/lib/types";

export function AgentPlan({ steps }: { steps: AgentPlanStep[] }) {
  if (!steps.length) return null;

  return (
    <ol className="space-y-3">
      {steps.map((s) => (
        <li key={s.id} className="flex gap-3 text-sm">
          <span className="mt-0.5 text-teal-700">
            {s.status === "done" && <Check className="h-4 w-4 text-emerald-600" />}
            {s.status === "running" && <Clock className="h-4 w-4 animate-pulse text-saffron-600" />}
            {s.status === "awaiting_confirm" && (
              <Hand className="h-4 w-4 text-amber-600" />
            )}
            {s.status === "pending" && <Circle className="h-4 w-4 text-teal-300" />}
          </span>
          <div className="flex-1">
            <p className="font-medium text-teal-950">{s.label}</p>
            {s.detail && <p className="text-teal-600">{s.detail}</p>}
            {s.status === "awaiting_confirm" && (
              <Badge variant="warning" className="mt-1">
                Needs your OK
              </Badge>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
