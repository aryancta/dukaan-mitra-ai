# Dukaan Mitra AI

Voice-first inventory and reordering for India's kirana stores. Speak in Hindi or Hinglish; the agent resolves fuzzy item names, writes stock through MongoDB MCP tools, forecasts festival demand, and drafts supplier reorders you confirm in one tap.

![Architecture diagram](/public/hero-architecture.svg)

## Quick demo (60 seconds)

1. Open the [dashboard](http://localhost:3000/dashboard).
2. Tap **Load demo phrase** or the mic and say: `Aaj 12 Parle-G bik gaye aur dahi khatam ho gaya`.
3. Hit **Submit to agent** and watch Parle-G decrement, curd hit zero, MCP logs appear, Navratri forecast show, and a reorder draft wait for **Confirm order**.

Works with zero API keys (seeded demo). Add keys in [Settings](http://localhost:3000/settings) for live Gemini parsing and Atlas writes.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Docker

```bash
docker build -t app .
docker run -p 3000:3000 app
```

### API keys (optional)

| Service | Purpose | Get a key |
|---------|---------|-----------|
| Google Gemini | Hindi / Hinglish NLU | https://aistudio.google.com/apikey |
| MongoDB Atlas | Live inventory + vector search | https://www.mongodb.com/cloud/atlas/register |

Paste keys at `/settings`. They are stored in `localStorage` under `dukaanmitra_api_keys` and sent as `x-user-gemini-key` / `x-user-mongodb-uri` headers only.

## Tech stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Agent:** Gemini 2.0 Flash (parse), rule-based festival forecast, human-in-the-loop reorder confirm
- **Data layer:** MongoDB MCP-shaped tools (`find`, `$vectorSearch` aggregate, `updateOne`, `insertMany`) with in-memory demo fallback
- **Deploy:** Docker standalone on port 3000 (Cloud Run ready)

## Architecture

```
Shopkeeper voice/text
        |
        v
   Gemini parse (optional)
        |
        v
 MongoDB MCP tools -----> Atlas (when URI set)
   |  vector SKU match
   |  stock + sales writes
        |
        v
 Live dashboard (stock, forecast, reorder draft, MCP trace)
```

## MVP features

- Multilingual voice capture (Web Speech API + typed fallback)
- Fuzzy item-to-SKU resolution (vector search path + semantic fallback)
- Autonomous inventory updates via MCP tool surface
- Festival / seasonal demand forecasting (Navratri, Diwali rules)
- Human-in-the-loop reorder drafting
- Live mirror dashboard with MCP trace panel

## Participant

Aryan Choudhary (aryancta@gmail.com)

## Credits

- Problem framing: Smart-Kirana (SSRN), ISB kirana capstone analysis
- Pattern reference: MongoDB Smart Shopping Cart + MCP Winter 2026 auto-embed docs
- Hackathon: Google Cloud Rapid Agent Hackathon (Brick-and-Mortar Retail / MongoDB bucket)
