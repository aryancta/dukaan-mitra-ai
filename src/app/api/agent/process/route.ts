import { NextResponse } from "next/server";
import { processShopkeeperUtterance } from "@/lib/agent/processor";
import { keysFromRequest } from "@/lib/api-headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const transcript = String(body.transcript ?? "").trim();
    if (!transcript) {
      return NextResponse.json({ error: "transcript required" }, { status: 400 });
    }

    const keys = keysFromRequest(req);
    const result = await processShopkeeperUtterance(transcript, {
      geminiKey: keys.gemini,
      mongodbUri: keys.mongodbUri,
    });

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Agent processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
