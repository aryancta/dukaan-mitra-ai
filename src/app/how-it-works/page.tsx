import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "1. Shopkeeper speaks",
    body: "Hindi, English, or Hinglish: sales and out-of-stock items in one breath.",
  },
  {
    title: "2. Gemini parses intent",
    body: "Gemini 2.0 Flash extracts quantities and actions. Offline regex backs demo mode.",
  },
  {
    title: "3. MongoDB MCP resolves SKUs",
    body: "Atlas Vector Search (or semantic fallback) maps dahi to Amul Curd 500g.",
  },
  {
    title: "4. MCP writes inventory",
    body: "updateOne and insertMany tools adjust stock and log sales. Every call is traced on screen.",
  },
  {
    title: "5. Forecast and reorder",
    body: "Festival rules flag Navratri dairy spikes. A supplier WhatsApp-style draft waits for Confirm order.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-teal-950">How it works</h1>
      <p className="mt-3 text-teal-700">
        Dukaan Mitra is an ADK-style autonomous loop: understand, store, forecast, act - with
        a human confirm gate before reorders.
      </p>

      <div className="mt-8 space-y-4">
        {steps.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-lg">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-teal-700">{s.body}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-saffron-200 bg-saffron-50 p-6">
        <h2 className="font-semibold text-teal-950">Impact</h2>
        <p className="mt-2 text-sm text-teal-800">
          India has 12M+ kirana stores; studies cite 25-30% revenue leakage from stockouts and
          spoilage when inventory stays in the owner&apos;s head. Voice removes the literacy and
          time barrier that killed every dashboard product before us.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-saffron-800 hover:underline"
        >
          Try the live dashboard
        </Link>
      </div>
    </div>
  );
}
