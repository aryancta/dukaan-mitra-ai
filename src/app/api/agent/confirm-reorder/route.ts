import { NextResponse } from "next/server";
import { confirmPendingReorder } from "@/lib/agent/processor";
import { appendMcpLog } from "@/lib/store";
import { MCP_TOOLS } from "@/lib/mcp/tool-names";

export async function POST() {
  const confirmed = confirmPendingReorder();
  if (!confirmed) {
    return NextResponse.json(
      { error: "No pending reorder to confirm" },
      { status: 400 }
    );
  }

  appendMcpLog({
    tool: MCP_TOOLS.INSERT_SALES,
    args: {
      action: "confirm_reorder",
      reorderId: confirmed.id,
      lines: confirmed.lines.length,
    },
    resultSummary: `Reorder ${confirmed.id} confirmed (supplier message drafted)`,
  });

  return NextResponse.json({ reorder: confirmed });
}
