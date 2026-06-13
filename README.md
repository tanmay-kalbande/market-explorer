# MARKETCAP// Explorer

A premium, glassmorphism-styled stock market visualization dashboard. It fetches, parses, and visualizes live company rankings and market capitalization data in real-time.

## ✨ Features

- 📊 **Treemap (Tiles) View:** Interactive layout with dynamic sizing based on market cap.
- 🔀 **Sankey Flow View:** Flow representation of market caps from Country to Company.
- 📋 **List View:** Clean, sorted, tabular ranking list.
- 🌫️ **Glassmorphism Design:** Curated dark theme with rich glass containers, smooth micro-animations, and custom detail side panels.
- ⚡ **Auto-Updating Serverless API:** Automatic backend scraping from CompaniesMarketCap via Vercel Serverless Functions with built-in CDN caching.

## 🚀 Deployment

This project is fully optimized for **Vercel** with zero-configuration required:

1. Push this folder to a GitHub repository.
2. Link the repository to your Vercel account.
3. Vercel will automatically configure the static site routing and host the `/api/market-data` Node.js serverless function.

## 📂 Project Structure

- `index.html` — The main frontend web page, stylesheets, and visualization scripts.
- `vercel.json` — Routing and Clean URLs configuration.
- `api/market-data.js` — Vercel Serverless Function that scrapes, parses, and caches data.
