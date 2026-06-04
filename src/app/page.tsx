import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mic, Database, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-saffron-100 bg-gradient-to-b from-saffron-50 to-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-saffron-700">
              Google Cloud Rapid Agent Hackathon
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-teal-950 sm:text-5xl">
              Your kirana runs on voice, not spreadsheets
            </h1>
            <p className="mt-4 text-lg text-teal-800">
              Dukaan Mitra AI listens in Hindi or Hinglish, matches fuzzy names like
              &quot;dahi&quot; to real SKUs with MongoDB vector search, updates stock through
              the MongoDB MCP server, and drafts festival-aware reorders you confirm in one tap.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-saffron-600 px-8 text-base font-medium text-white hover:bg-saffron-700"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-saffron-200 bg-white px-8 text-base font-medium text-teal-950 hover:bg-saffron-50"
              >
                How it works
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <Image
              src="/hero-architecture.svg"
              alt="Architecture: voice to Gemini agent to MongoDB MCP to dashboard"
              width={520}
              height={360}
              priority
              className="rounded-xl border border-saffron-100 shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-teal-950">Built for solo shopkeepers</h2>
        <p className="mt-2 max-w-2xl text-teal-700">
          Over 12 million kirana stores still run on memory and paper. We wanted an agent
          that captures sales while you serve customers and only reorders when you say yes.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <Mic className="h-8 w-8 text-saffron-600" />
              <CardTitle className="mt-2">Speak naturally</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-teal-700">
              Say what sold and what ran out. No forms, no SKU codes.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Database className="h-8 w-8 text-saffron-600" />
              <CardTitle className="mt-2">MongoDB MCP actions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-teal-700">
              Vector search resolves aliases; MCP tools write sales and stock live.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-saffron-600" />
              <CardTitle className="mt-2">Festival forecasts</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-teal-700">
              Navratri-style spikes surfaced before you run out of curd and milk.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-saffron-100 bg-teal-950 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold">60-second demo</h2>
          <p className="mx-auto mt-2 max-w-xl text-teal-200">
            Open the dashboard, tap the mic, say: &quot;Aaj 12 Parle-G bik gaye aur dahi khatam
            ho gaya.&quot; Watch stock move, the forecast appear, and confirm the reorder.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-saffron-500 px-8 text-base font-medium text-white hover:bg-saffron-600"
          >
            Open live dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
