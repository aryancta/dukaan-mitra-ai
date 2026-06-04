"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadApiKeys, saveApiKeys } from "@/lib/api-headers";
import type { ApiKeys } from "@/lib/types";

export default function SettingsPage() {
  const [keys, setKeys] = useState<ApiKeys>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeys(loadApiKeys());
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveApiKeys(keys);
    setSaved(true);
    toast.success("Keys saved in this browser only");
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-teal-950">Settings</h1>
      <p className="mt-2 text-teal-700">
        Keys stay in <code className="rounded bg-teal-100 px-1 text-sm">localStorage</code> only.
        Leave blank to run the seeded demo.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Gemini API</CardTitle>
            <CardDescription>
              Sponsored by the hackathon. Powers Hindi / Hinglish parsing when set.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="gemini">API key</Label>
            <Input
              id="gemini"
              name="gemini"
              type="password"
              autoComplete="off"
              placeholder="AIza..."
              value={keys.gemini ?? ""}
              onChange={(e) => setKeys((k) => ({ ...k, gemini: e.target.value }))}
            />
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-saffron-700 hover:underline"
            >
              Get a free key at Google AI Studio
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>MongoDB Atlas connection</CardTitle>
            <CardDescription>
              Sponsored by the hackathon. Live writes use the same tool surface as the MongoDB
              MCP server (find, aggregate vector search, updateOne, insertMany).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="mongo">Connection URI</Label>
            <Input
              id="mongo"
              name="mongodbUri"
              type="password"
              autoComplete="off"
              placeholder="mongodb+srv://..."
              value={keys.mongodbUri ?? ""}
              onChange={(e) => setKeys((k) => ({ ...k, mongodbUri: e.target.value }))}
            />
            <a
              href="https://www.mongodb.com/cloud/atlas/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-saffron-700 hover:underline"
            >
              Create a free Atlas cluster
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs text-teal-600">
              MCP server docs:{" "}
              <a
                href="https://www.mongodb.com/docs/mcp-server/tools/"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                mongodb.com/docs/mcp-server
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">
            <Save className="h-4 w-4" />
            Save keys
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setKeys({});
              saveApiKeys({});
              toast.message("Cleared keys");
            }}
          >
            Clear
          </Button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center text-sm font-medium text-teal-800 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
        {saved && (
          <p className="text-sm text-emerald-700">Saved. Open the dashboard to use live mode.</p>
        )}
      </form>
    </div>
  );
}
