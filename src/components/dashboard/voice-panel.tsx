"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildAuthHeaders, loadApiKeys } from "@/lib/api-headers";
import type { AgentProcessResult } from "@/lib/types";

const DEMO_PHRASE =
  "Aaj 12 Parle-G bik gaye aur 5 Maggi bik gayi, dahi khatam ho gaya";

interface VoicePanelProps {
  onResult: (result: AgentProcessResult) => void;
  onProcessing: (v: boolean) => void;
}

export function VoicePanel({ onResult, onProcessing }: VoicePanelProps) {
  const [transcript, setTranscript] = useState(DEMO_PHRASE);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const submit = useCallback(async () => {
    const text = transcript.trim();
    if (!text) {
      toast.error("Boliye kuch ya type karein");
      return;
    }
    setLoading(true);
    onProcessing(true);
    try {
      const res = await fetch("/api/agent/process", {
        method: "POST",
        headers: buildAuthHeaders(loadApiKeys()),
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      onResult(data as AgentProcessResult);
      toast.success("Stock updated via MongoDB MCP");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Agent error");
    } finally {
      setLoading(false);
      onProcessing(false);
    }
  }, [transcript, onResult, onProcessing]);

  const startListening = useCallback(() => {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;
    if (!SR) {
      toast.message("Voice needs Chrome. Use the text box or demo phrase.");
      return;
    }
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      const text = ev.results[0]?.[0]?.transcript;
      if (text) setTranscript(text);
    };
    rec.onerror = () => toast.error("Mic error. Try typing instead.");
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
    toast.message("Sun raha hoon...");
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="lg"
          variant={listening ? "destructive" : "default"}
          onClick={listening ? stopListening : startListening}
          disabled={loading}
          aria-pressed={listening}
        >
          {listening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          {listening ? "Stop" : "Boliye (Hindi / Hinglish)"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setTranscript(DEMO_PHRASE)}
          disabled={loading}
        >
          Load demo phrase
        </Button>
      </div>
      <Textarea
        id="prompt"
        name="prompt"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Aaj 12 Parle-G bik gaye, dahi khatam ho gaya"
        rows={3}
      />
      <Button type="button" onClick={submit} disabled={loading} className="w-full sm:w-auto">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit to agent
      </Button>
    </div>
  );
}
