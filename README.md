# 🌊 On-Chain Fund-Flow Heatmap

Visualize weekly money movement **between major crypto assets and wallet cohorts** (exchanges, whales, miners, smart contracts) in a single glance.

> **Stack** Next.js • TypeScript • TailwindCSS • Recharts (Heatmap) • SWR • Glassnode/CryptoQuant APIs
> **Deploy Target** Vercel (edge-optimized)
> **Goal** Give you data-driven talking points for Anchorage/FalconX convos within 10 seconds of page load.

---

## 📈 Features

| Feature                | Details                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| **Dynamic Heatmap**    | Wallet-flow net Δ in USD (positive = inflow, negative = outflow) across BTC, ETH, SOL, XRP, USDT, USDC. |
| **Time Selector**      | Rolling 7-day, 30-day, YTD presets + custom range.                                                      |
| **Cohort Filters**     | Checkboxes for *Exchanges*, *Whales (> 1K BTC equiv)*, *Miners*, *Smart Contracts*, *Retail* (< 1 BTC). |
| **Tooltip Drill-Down** | Hover ≈ raw numbers, YoY %, and link to tx explorer.                                                    |
| **Auto-Refresh**       | Re-queries every 30 min via SWR + `revalidateOnFocus: false` to keep Vercel cold-start costs low.       |
| **Dark / Light Mode**  | Tailwind-driven; respects system preference.                                                            |

---

## 🗂 Project Structure

```text
.
├── src/
│   ├── lib/
│   │   └── api.ts            # fetcher wrapped in SWR w/ Rate-Limit retries
│   ├── components/
│   │   ├── Heatmap.tsx       # <Heatmap data={...} />
│   │   ├── CohortToggle.tsx
│   │   └── DateRangePicker.tsx
│   ├── app/
│   │   ├── page.tsx          # layout + SEO + hero copy
│   │   ├── layout.tsx        # SWR config + metadata
│   │   └── globals.css       # Tailwind base + custom styles
│   └── ...
├── .env.local.example        # API keys template
└── README.md                 # This file
```

---

## 🔧 Setup

1. **Clone & Install**

   ```bash
   git clone <your-repo-url>
   cd onchain-heatmap
   npm install
   ```

2. **Environment Vars**

   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   
   # Edit .env.local with your API keys
   GLASSNODE_API_KEY=your_glassnode_api_key
   CRYPTOQUANT_API_KEY=your_cryptoquant_api_key
   NEXT_PUBLIC_ASSETS=BTC,ETH,SOL,XRP,USDT,USDC
   ```

3. **Dev**

   ```bash
   npm run dev
   ```

4. **Deploy** — push to GitHub → import repo in Vercel → add env vars.

---

## 🧩 Core Logic

```ts
// src/lib/api.ts
export async function getExchangeFlows(asset: string, start: number, end: number) {
  const url = `https://api.glassnode.com/v2/metrics/transactions/volume_change_from_exchanges?asset=${asset}&api_key=${process.env.GLASSNODE_API_KEY}&s=${start}&u=${end}&i=1d`;
  const res = await fetch(url);
  const data = await res.json();
  return data.map(d => ({ date: d.t, value: d.v }));
}
```

`Heatmap.tsx` merges the cohorts into a matrix and feeds Recharts' `ResponsiveContainer` + `Surface` with a custom colorScale derived from `d3-scale`.

---

## 📊 Extending

* **Add Chains** – Update `NEXT_PUBLIC_ASSETS`, no redeploy needed thanks to ISR.
* **CSV Export** – Add `pages/api/export.ts` to pipe JSON → CSV and tee into a download button.
* **Alerting** – Tie into Slack webhook if net outflow > $500 M in 24h.

---

## 🚀 Performance

- **Edge-optimized** for Vercel deployment
- **SWR caching** with 30-minute refresh intervals
- **Rate-limit handling** with exponential backoff
- **Dark mode** support with system preference detection
- **Responsive design** for mobile and desktop

---

## 📜 License

MIT © 2025 Prashant Radhakrishnan
