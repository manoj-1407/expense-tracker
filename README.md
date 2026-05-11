# Paisa — Expense Tracker

A personal expense tracker built with React + Vite for the **Marketing Mojito Web Developer Intern** assignment.

## Live Demo

> 🔗 **[Add your Vercel/Netlify URL here after deployment]**
> 
> GitHub: [Add your GitHub repo URL here]

---

## What I Built

A clean, responsive React application that lets you log, categorise, and manage personal expenses — with a live currency conversion feature, persistent storage, and dark mode support.

### Components

| Component | Responsibility |
|---|---|
| `ExpenseForm` | Add expenses with name, amount, and category |
| `ExpenseList` | Card-based display with category filter chips and delete |
| `SummaryPanel` | Hero display of running total, item count, top categories |
| `Breakdown` | Visual proportional bar chart by category |
| `CurrencyConverter` | Live exchange rate via Frankfurter.app with caching |

---

## API Used

**[Frankfurter.app](https://www.frankfurter.app/)** — a free, open-source exchange rate API backed by the European Central Bank. No API key required.

- Fetches live rates from INR to any selected currency
- Responses are **cached in-memory** to avoid redundant API calls
- Handles loading, error, and offline states gracefully — the UI never breaks or shows blank space if the API call fails
- Includes a manual **Retry** button on failure

Supported currencies: USD, EUR, GBP, INR, JPY, SGD, AED, CAD, AUD, CNY, CHF

---

## Features

- ✅ Add / delete expenses; clear all entries
- ✅ Category filter chips on the entries list
- ✅ Running total updates live as entries are added or removed
- ✅ Spending breakdown by category with proportional bars
- ✅ Live currency conversion with graceful error handling
- ✅ Dark / light theme toggle (persisted to localStorage)
- ✅ All expense data persisted in localStorage — survives page refresh
- ✅ Toast notifications for add/remove actions
- ✅ Shake animation on invalid form submission
- ✅ Fully responsive at 1600×900 and 414×749 (mobile)

---

## Challenges & What I'd Improve

The main challenge was building a resilient currency converter — Frankfurter.app occasionally has cold-start latency. I solved this with:
1. An explicit loading state so the UI never shows stale data
2. An error state with a retry button
3. In-memory caching so switching back to a previously fetched currency is instant

**Given more time I would add:**
- Monthly budget targets with a progress bar per category
- Inline expense editing (not just delete)
- A pie/bar chart view for the category breakdown using Recharts
- CSV export of all entries

---

## Stack

React 18 · Vite 4 · Plain CSS (CSS variables, no UI kit) · Frankfurter.app API

---

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to Vercel

```bash
npm run build
# Push to GitHub, then import repo at vercel.com — zero config needed for Vite
```

Or drag-drop the `/dist` folder to [netlify.com/drop](https://app.netlify.com/drop).
