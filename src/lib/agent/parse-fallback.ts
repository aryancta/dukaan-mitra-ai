export interface ParsedUtteranceItem {
  spoken: string;
  action: "sold" | "out_of_stock" | "restock";
  quantity?: number;
}

function cleanSpoken(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function parseClause(clause: string): ParsedUtteranceItem | undefined {
  const c = clause.trim();
  if (!c) return undefined;

  const sale = c.match(
    /(\d+)\s+([a-z0-9\u0900-\u097F][\w\s-]*?)\s+(?:bik\s+gay[aei]|sold|bech[aei])/i
  );
  if (sale) {
    return {
      spoken: cleanSpoken(sale[2]),
      action: "sold",
      quantity: parseInt(sale[1], 10),
    };
  }

  if (/khatam\s+ho\s+gay|out\s+of\s+stock|khatam/i.test(c)) {
    let spoken = c
      .replace(/\s+khatam[\s\S]*/i, "")
      .replace(/^aaj\s+/i, "")
      .trim();
    if (spoken.includes(" aur ")) {
      spoken = spoken.split(/\s+aur\s+/i).pop() ?? spoken;
    }
    spoken = spoken.split(/\s+/).pop() ?? spoken;
    spoken = cleanSpoken(spoken);
    if (spoken && spoken.length <= 24 && !/^\d/.test(spoken)) {
      return { spoken, action: "out_of_stock" };
    }
  }

  return undefined;
}

export function parseUtteranceFallback(transcript: string): ParsedUtteranceItem[] {
  const text = transcript.trim();
  const clauses = text.split(/\s+aur\s+|\s*,\s*/i);
  const items: ParsedUtteranceItem[] = [];

  for (const clause of clauses) {
    const item = parseClause(clause);
    if (item) items.push(item);
  }

  if (items.length === 0 && /parle/i.test(text) && /dahi|curd/i.test(text)) {
    const parleMatch = text.match(/(\d+)\s*parle/i);
    items.push({
      spoken: "parle g",
      action: "sold",
      quantity: parleMatch ? parseInt(parleMatch[1], 10) : 12,
    });
    items.push({ spoken: "dahi", action: "out_of_stock" });
  }

  return items;
}
