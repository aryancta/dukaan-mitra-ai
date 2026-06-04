"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AgentPlan } from "@/components/dashboard/agent-plan";
import { ForecastCard } from "@/components/dashboard/forecast-card";
import { McpLogPanel } from "@/components/dashboard/mcp-log";
import { ReorderCard } from "@/components/dashboard/reorder-card";
import { StockGrid } from "@/components/dashboard/stock-grid";
import { VoicePanel } from "@/components/dashboard/voice-panel";
import { DemoBanner } from "@/components/demo-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildAuthHeaders, loadApiKeys } from "@/lib/api-headers";
import type { AgentProcessResult, Product, ReorderDraft } from "@/lib/types";

interface InventoryPayload {
  mode: string;
  storeName: string;
  ownerName: string;
  products: Product[];
  mcpLogs: { tool: string; args: Record<string, unknown>; resultSummary: string; timestamp: string }[];
  pendingReorder?: ReorderDraft;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [inventory, setInventory] = useState<InventoryPayload | null>(null);
  const [lastResult, setLastResult] = useState<AgentProcessResult | null>(null);
  const [keys, setKeys] = useState(loadApiKeys());

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory", { headers: buildAuthHeaders(keys) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInventory(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load inventory");
    } finally {
      setLoading(false);
    }
  }, [keys]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    const onStorage = () => setKeys(loadApiKeys());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onResult = (result: AgentProcessResult) => {
    setLastResult(result);
    fetchInventory();
  };

  const highlightIds =
    lastResult?.stockUpdates.map((s) => s.productId) ?? [];

  const products = inventory?.products ?? [];
  const mcpLogs = lastResult?.mcpLogs ?? inventory?.mcpLogs ?? [];
  const reorder = lastResult?.reorderDraft ?? inventory?.pendingReorder;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-teal-950">Live store mirror</h1>
          <p className="text-teal-700">
            {inventory?.storeName ?? "Sharma Kirana"} · {inventory?.ownerName ?? "Ramesh Sharma"}
          </p>
          <p className="text-xs text-teal-600 mt-1">
            Mode: {lastResult?.mode ?? inventory?.mode ?? "demo"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchInventory()}
          disabled={loading || processing}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="mt-4">
        <DemoBanner
          showGemini={!keys.gemini}
          showMongo={!keys.mongodbUri}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice / text capture</CardTitle>
            </CardHeader>
            <CardContent>
              <VoicePanel onResult={onResult} onProcessing={setProcessing} />
            </CardContent>
          </Card>

          {loading && !products.length ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-saffron-600" />
            </div>
          ) : (
            <StockGrid products={products} highlightIds={highlightIds} />
          )}

          {lastResult?.assistantReply && (
            <Card className="bg-teal-50/50">
              <CardContent className="pt-5 text-sm text-teal-900">
                <strong>Agent:</strong> {lastResult.assistantReply}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agent plan</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentPlan steps={lastResult?.plan ?? []} />
              {!lastResult?.plan?.length && (
                <p className="text-sm text-teal-600">Submit a phrase to see the plan.</p>
              )}
            </CardContent>
          </Card>

          <ForecastCard forecast={lastResult?.forecast} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reorder (human confirm)</CardTitle>
            </CardHeader>
            <CardContent>
              <ReorderCard draft={reorder} onConfirmed={fetchInventory} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">MongoDB MCP trace</CardTitle>
            </CardHeader>
            <CardContent>
              <McpLogPanel logs={mcpLogs} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
