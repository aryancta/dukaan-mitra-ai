"use client";

import type { McpToolLog } from "@/lib/types";

export function McpLogPanel({ logs }: { logs: McpToolLog[] }) {
  if (!logs.length) {
    return (
      <p className="text-sm text-teal-600">
        MCP tool calls appear here when the agent writes inventory.
      </p>
    );
  }

  return (
    <ul className="space-y-2 text-xs font-mono">
      {logs.map((log, i) => (
        <li
          key={`${log.timestamp}-${i}`}
          className="rounded-lg border border-teal-100 bg-teal-50/50 p-2"
        >
          <span className="font-semibold text-saffron-800">{log.tool}</span>
          <span className="text-teal-600"> · {log.resultSummary}</span>
        </li>
      ))}
    </ul>
  );
}
