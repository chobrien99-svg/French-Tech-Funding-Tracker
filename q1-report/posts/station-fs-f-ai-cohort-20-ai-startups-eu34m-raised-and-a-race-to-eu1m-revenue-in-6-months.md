---
title: "Station F’s F/AI Cohort: 20 AI Startups, €34M Raised, and a Race to €1M Revenue in 6 Months"
slug: "station-fs-f-ai-cohort-20-ai-startups-eu34m-raised-and-a-race-to-eu1m-revenue-in-6-months"
date: "2026-03-17T23:42:09.000+01:00"
updated: "2026-04-03T23:19:40.000+02:00"
tags:
  - AI
authors:
  - Chris O'Brien
excerpt: "Backed by OpenAI, Meta, Google, and top VCs like Sequoia and Lightspeed, the inaugural batch brings together mostly sub-12-month-old startups building across AI infrastructure, agents, and enterprise tools—already capitalized and moving fast toward scale."
featured: "true"
feature_image: "https://www.frenchtechjournal.com/content/images/2026/03/fai_cohort_graphic.png"
---

<p>Station F's new F/ai accelerator program selected 20 early-stage AI startups for its inaugural batch, which launched on January 13 and will conclude on April 9 with a "Deal Day." </p><p>The program is backed by major AI players, including OpenAI, Anthropic, Mistral AI, Microsoft, Meta, and Google, as well as top VC firms such as Sequoia Capital, General Catalyst, and Lightspeed. </p><p>About 80% of the selected companies were founded within the past 12 months, and three-quarters have already raised pre-seed rounds between €1M and €6M, totaling €34M across the cohort. </p><p>The goal is to help participants reach €1M in revenue within six months.</p>
<!--kg-card-begin: html-->
<figure class="kg-card kg-image-card kg-width-wide embed">
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>F/ai Cohort Explorer — Station F</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #050810;
    --surface: #0d1117;
    --surface-raised: #151b27;
    --surface-hover: #1a2233;
    --border: rgba(99,110,140,0.15);
    --border-accent: rgba(99,141,255,0.25);
    --text-primary: #e4e8f0;
    --text-secondary: #8892a6;
    --text-muted: #525c70;
    --accent: #638dff;
    --accent-glow: rgba(99,141,255,0.12);
    --infra: #638dff;
    --agents: #c084fc;
    --commerce: #34d399;
    --compliance: #fb923c;
    --vertical: #f472b6;
    --marketing: #fbbf24;
    --card-radius: 10px;
    --font-display: 'Sora', sans-serif;
    --font-mono: 'IBM Plex Mono', monospace;
  }

  .explorer {
    max-width: 1060px;
    margin: 0 auto;
    padding: 32px 24px 48px;
    font-family: var(--font-display);
    background: var(--bg);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    font-size: 15px;
    border-radius: 12px;
    line-height: 1.5;
  }

  .explorer *, .explorer *::before, .explorer *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ── HEADER ─────────────────────────── */
  .explorer-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .header-left h1 {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.5px;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .header-left h1 span { color: var(--accent); }

  .header-left p {
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .header-stats {
    display: flex;
    gap: 20px;
    flex-shrink: 0;
  }

  .stat {
    text-align: right;
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .stat-label {
    font-size: 0.65rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 1px;
  }

  /* ── CONTROLS ───────────────────────── */
  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 22px;
    flex-wrap: wrap;
    align-items: center;
  }

  .filter-btn {
    font-family: var(--font-display);
    font-size: 0.73rem;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    user-select: none;
  }

  .filter-btn:hover {
    border-color: var(--border-accent);
    color: var(--text-primary);
    background: var(--surface-raised);
  }

  .filter-btn.active {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-glow);
  }

  .filter-btn .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-right: 5px;
    vertical-align: middle;
    position: relative;
    top: -0.5px;
  }

  .controls-right {
    margin-left: auto;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .sort-select {
    font-family: var(--font-display);
    font-size: 0.73rem;
    padding: 6px 12px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23525c70'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 26px;
  }

  .sort-select:hover {
    border-color: var(--border-accent);
    color: var(--text-primary);
  }

  .result-count {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  /* ── GRID ────────────────────────────── */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
  }

  /* ── CARD ────────────────────────────── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.25s;
  }

  .card:hover {
    border-color: var(--border-accent);
    background: var(--surface-raised);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

  .card:hover::before { opacity: 1; }

  .card[data-sector="Infrastructure"]::before { background: var(--infra); }
  .card[data-sector="Agents"]::before { background: var(--agents); }
  .card[data-sector="Commerce"]::before { background: var(--commerce); }
  .card[data-sector="Compliance"]::before { background: var(--compliance); }
  .card[data-sector="Vertical AI"]::before { background: var(--vertical); }
  .card[data-sector="Marketing"]::before { background: var(--marketing); }

  .card-main {
    padding: 16px 18px 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .card-info { flex: 1; min-width: 0; }

  .card-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 3px;
    letter-spacing: -0.3px;
  }

  .card-oneliner {
    font-size: 0.73rem;
    color: var(--text-secondary);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    flex-shrink: 0;
  }

  .sector-badge {
    font-size: 0.6rem;
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  .sector-badge[data-sector="Infrastructure"] { background: rgba(99,141,255,0.12); color: var(--infra); }
  .sector-badge[data-sector="Agents"] { background: rgba(192,132,252,0.12); color: var(--agents); }
  .sector-badge[data-sector="Commerce"] { background: rgba(52,211,153,0.12); color: var(--commerce); }
  .sector-badge[data-sector="Compliance"] { background: rgba(251,146,60,0.12); color: var(--compliance); }
  .sector-badge[data-sector="Vertical AI"] { background: rgba(244,114,182,0.12); color: var(--vertical); }
  .sector-badge[data-sector="Marketing"] { background: rgba(251,191,36,0.12); color: var(--marketing); }

  .funding-tag {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .funding-tag.has-funding { color: var(--text-secondary); }

  /* ── EXPANDED ────────────────────────── */
  .card-details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
  }

  .card.expanded .card-details {
    max-height: 400px;
  }

  .card-details-inner {
    padding: 0 18px 16px;
    border-top: 1px solid var(--border);
    margin-top: 0;
    padding-top: 14px;
  }

  .detail-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 0.73rem;
    line-height: 1.5;
  }

  .detail-label {
    font-family: var(--font-mono);
    font-weight: 500;
    color: var(--text-muted);
    min-width: 72px;
    flex-shrink: 0;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-top: 1px;
  }

  .detail-value {
    color: var(--text-secondary);
  }

  .detail-value a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid rgba(99,141,255,0.25);
  }

  .detail-value a:hover { border-color: var(--accent); }

  .why-it-matters {
    margin-top: 10px;
    padding: 10px 12px;
    background: rgba(99,141,255,0.04);
    border-radius: 6px;
    border-left: 2px solid var(--accent);
    font-size: 0.73rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .why-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }

  /* ── EXPAND INDICATOR ───────────────── */
  .expand-icon {
    position: absolute;
    bottom: 8px;
    right: 14px;
    font-size: 0.65rem;
    color: var(--text-muted);
    transition: all 0.25s;
    pointer-events: none;
  }

  .card:hover .expand-icon { color: var(--accent); }
  .card.expanded .expand-icon { transform: rotate(180deg); }

  /* ── EMPTY STATE ────────────────────── */
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  /* ── ANIMATIONS ─────────────────────── */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card { animation: fadeInUp 0.4s ease both; }

  .card:nth-child(1) { animation-delay: 0.02s; }
  .card:nth-child(2) { animation-delay: 0.04s; }
  .card:nth-child(3) { animation-delay: 0.06s; }
  .card:nth-child(4) { animation-delay: 0.08s; }
  .card:nth-child(5) { animation-delay: 0.10s; }
  .card:nth-child(6) { animation-delay: 0.12s; }
  .card:nth-child(7) { animation-delay: 0.14s; }
  .card:nth-child(8) { animation-delay: 0.16s; }
  .card:nth-child(9) { animation-delay: 0.18s; }
  .card:nth-child(10) { animation-delay: 0.20s; }
  .card:nth-child(11) { animation-delay: 0.22s; }
  .card:nth-child(12) { animation-delay: 0.24s; }
  .card:nth-child(13) { animation-delay: 0.26s; }
  .card:nth-child(14) { animation-delay: 0.28s; }
  .card:nth-child(15) { animation-delay: 0.30s; }
  .card:nth-child(16) { animation-delay: 0.32s; }
  .card:nth-child(17) { animation-delay: 0.34s; }
  .card:nth-child(18) { animation-delay: 0.36s; }
  .card:nth-child(19) { animation-delay: 0.38s; }
  .card:nth-child(20) { animation-delay: 0.40s; }

  /* ── RESPONSIVE ─────────────────────── */
  @media (max-width: 700px) {
    .explorer { padding: 20px 14px 36px; }
    .explorer-header { flex-direction: column; align-items: flex-start; }
    .header-stats { align-self: flex-start; }
    .card-grid { grid-template-columns: 1fr; }
    .controls-right { margin-left: 0; width: 100%; justify-content: space-between; }
  }

  /* ── CREDIT ─────────────────────────── */
  .credit {
    text-align: center;
    margin-top: 32px;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>

<div class="explorer">
  <div class="explorer-header">
    <div class="header-left">
      <h1>Station F · F/<span>ai</span> Cohort Explorer</h1>
      <p>20 AI startups selected for the inaugural batch — Jan–Apr 2026</p>
    </div>
    <div class="header-stats">
      <div class="stat">
        <div class="stat-value">€34M</div>
        <div class="stat-label">Total Raised</div>
      </div>
      <div class="stat">
        <div class="stat-value">20</div>
        <div class="stat-label">Startups</div>
      </div>
      <div class="stat">
        <div class="stat-value">6</div>
        <div class="stat-label">Sectors</div>
      </div>
    </div>
  </div>

  <div class="controls">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="Infrastructure"><span class="dot" style="background:var(--infra)"></span>Infrastructure</button>
    <button class="filter-btn" data-filter="Agents"><span class="dot" style="background:var(--agents)"></span>Agents</button>
    <button class="filter-btn" data-filter="Commerce"><span class="dot" style="background:var(--commerce)"></span>Commerce</button>
    <button class="filter-btn" data-filter="Compliance"><span class="dot" style="background:var(--compliance)"></span>Compliance</button>
    <button class="filter-btn" data-filter="Vertical AI"><span class="dot" style="background:var(--vertical)"></span>Vertical AI</button>
    <button class="filter-btn" data-filter="Marketing"><span class="dot" style="background:var(--marketing)"></span>Marketing</button>
    <div class="controls-right">
      <select class="sort-select" id="sortSelect">
        <option value="name">Sort: Name</option>
        <option value="funding-desc">Sort: Funding ↓</option>
        <option value="funding-asc">Sort: Funding ↑</option>
        <option value="sector">Sort: Sector</option>
      </select>
      <span class="result-count" id="resultCount">20 / 20</span>
    </div>
  </div>

  <div class="card-grid" id="cardGrid"></div>

  <div class="credit">THE FRENCH TECH JOURNAL · 2026</div>
</div>

<script>
const DATA = [
  {
    name: "Alpic",
    oneliner: "All-in-one cloud platform for deploying, hosting, and securing MCP servers for AI agents.",
    sector: "Infrastructure",
    funding: 5100000,
    fundingLabel: "€5.1M pre-seed",
    hq: "Paris / San Francisco",
    founders: "Pierre-Louis Theron, Nikolay Rodionov, Frédéric Barthelet, Charles Sonigo, Erica Beavers",
    investors: "K5 Global, Irregular Expression, Yellow, Drysdale, Kima Ventures, Galion.exe",
    website: "https://alpic.ai",
    why: "One of the clearer infrastructure bets on the rise of MCP as a standard interface between AI agents and external services."
  },
  {
    name: "Rippletide",
    oneliner: "Decision database infrastructure making enterprise AI agents deterministic, explainable, and compliant.",
    sector: "Infrastructure",
    funding: 4000000,
    fundingLabel: "€4M seed",
    hq: "Paris / San Francisco",
    founders: "Patrick Joubert (CEO), Yann Bilien (Chief Scientist)",
    investors: "OneRagtime",
    website: "https://rippletide.com",
    why: "Attacking a real enterprise bottleneck in agent adoption: reliability, auditability, and decision control."
  },
  {
    name: "Revox",
    oneliner: "Voice AI infrastructure for outbound and inbound calls at scale, focused on reliable production deployment.",
    sector: "Infrastructure",
    funding: 3000000,
    fundingLabel: "$3M pre-seed",
    hq: "Paris",
    founders: "Aric Lasry (ex-Dust), Jean-Baptiste de La Fage (ex-PLUME / YC)",
    investors: "Seedcamp, Weekend Fund, Drysdale, Kima",
    website: "https://getrevox.com",
    why: "Pitching itself as the infra layer that makes voice agents dependable enough for revenue-critical workflows."
  },
  {
    name: "Elix AI",
    oneliner: "Tool for managing daily business operations by creating and overseeing a dedicated AI workforce.",
    sector: "Agents",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Paris",
    founders: "Muhammad Saad, Maliha Khalid",
    investors: "N/A",
    website: "https://agentelix.ai",
    why: "Tackles a critical blind spot in AI adoption by giving companies full visibility into how operations function and where AI can drive ROI."
  },
  {
    name: "Draft'n Run",
    oneliner: "Open-source, no-code visual platform for building, deploying, and monitoring AI workflows.",
    sector: "Infrastructure",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Paris",
    founders: "Christian Verbrugge, Marc Sanselme, Mel Maysson Owen",
    investors: "N/A",
    website: "https://draftnrun.com",
    why: "Open-source and visual-builder positioning may help it win dev/ops teams that want speed without full custom engineering."
  },
  {    
    name: "Nativ",
    oneliner: "Nativ is the AI execution layer for high-volume B2B transactions, unifying automation and decision intelligence across industrial supply chain operations.",
    sector: "Agents",
    funding: 3000000,
    fundingLabel: "$3M pre-seed",
    hq: "Paris",
    founders: "Noemie El-Baz (CEO), Benoit Reulier (CPO), Alexandre Meunier (CTO)",
    investors: "Serena, Moitier Ventures, Kima Ventures, Ovni Capital",
    website: "https://www.gonativ.ai/",
    why: "Nativ is building an AI-powered execution layer that automates the messy upstream work in B2B transactions — turning fragmented orders, confirmations, and delivery updates into clean, ERP-ready decisions. The platform is designed for high-volume industrial and retail environments where exceptions are the norm, claiming to reduce order errors by 80% and cut manual processing work in half. Nativ integrates with existing ERP systems without requiring supplier onboarding or workflow changes, and is already deployed with aerospace and retail clients, generating hundreds of millions in revenue."
  },
  {
    name: "Sillage",
    oneliner: "AI sales agents that monitor commercial signals and orchestrate enterprise sales actions.",
    sector: "Agents",
    funding: 100000,
    fundingLabel: "Seed",
    hq: "Paris",
    founders: "Arthur Coudouy, Arnaud Weiss",
    investors: "Super Capital, Backfuture",
    website: "https://getsillage.com",
    why: "Turns fragmented market signals into timely sales action, improving conversion efficiency and reducing wasted outreach."
  },
  {
    name: "Seavium",
    oneliner: "AI-powered offshore vessel chartering platform with real-time market intelligence and ship search.",
    sector: "Vertical AI",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Marseille",
    founders: "Samuel Drai, Adrien Barrau",
    investors: "ZEBOX",
    website: "https://seavium.com",
    why: "Already showing strong traction nearing €1M GMV in 2025, with AI-powered vessel search and growing commercial activity."
  },
  {
    name: "Well",
    oneliner: "AI-native financial data platform that aggregates, structures, enriches, and analyzes data from banks and tools.",
    sector: "Vertical AI",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Paris",
    founders: "Bastien Blanc, Maxime Champoux",
    investors: "Arthur Querou",
    website: "https://wellapp.ai",
    why: "Eliminates manual finance workflows and enables faster, data-driven decisions with minimal operational overhead."
  },
  {
    name: "Nabel",
    oneliner: "Platform that transforms surveys into scalable voice-based customer conversations.",
    sector: "Vertical AI",
    funding: 0,
    fundingLabel: "N/A",
    hq: "N/A",
    founders: "Yousri Sellami, Tom Hayat",
    investors: "N/A",
    website: null,
    why: null
  },
  {
    name: "Lemrock",
    oneliner: "Infrastructure enabling brands to sell products directly inside AI agents like ChatGPT and Claude.",
    sector: "Commerce",
    funding: 6000000,
    fundingLabel: "€6M",
    hq: "Paris",
    founders: "Roxane Laigle (CEO), Sasha Collin (CPO), Clément Nguyen (CTO)",
    investors: "Galion.exe, Jean-Baptiste Rudelle, Michaël Benabou, and others",
    website: "https://lemrock.com",
    why: "One of the more compelling commerce infrastructure plays for a world where product discovery shifts from search to AI agents."
  },
  {
    name: "Synaps",
    oneliner: "Tool for reshaping e-commerce around AI agents with automated product data transformation.",
    sector: "Commerce",
    funding: 1400000,
    fundingLabel: "€1.4M seed",
    hq: "Paris",
    founders: "Hugo Benloulou",
    investors: "Entrepreneurs First, Super Capital, Kima Ventures, HUB612",
    website: "https://gosynaps.com/",
    why: "Tackles one of the biggest bottlenecks in e-commerce—messy, fragmented product data—by turning it into marketplace-ready listings."
  },
  {
    name: "GetMint",
    oneliner: "Helps brands measure and improve how they appear in AI-generated responses across major platforms.",
    sector: "Marketing",
    funding: 4000000,
    fundingLabel: "€4M pre-seed",
    hq: "Paris",
    founders: "Joan Burkovic, Matthieu Poitrimolt, Emmanuel Costa",
    investors: "50 Partners, Kima Ventures, Clover, Better Angle",
    website: "https://getmint.ai",
    why: "An early European bet on 'AI SEO' / generative engine optimization, a category likely to matter as conversational interfaces grow."
  },
  {
    name: "Figen AI",
    oneliner: "AI agents for wealth advisors, generating analyses, proposals, and client deliverables faster.",
    sector: "Vertical AI",
    funding: 0,
    fundingLabel: "Self-financed",
    hq: "Paris",
    founders: "Vincent Aurez, Nicolas Paulus, Maxime Perdu",
    investors: "1,200+ professional users",
    website: "https://www.figenai.com",
    why: "Sits at the intersection of vertical AI and wealth-tech, where document-heavy, expertise-heavy workflows are ripe for agent support."
  },
  {
    name: "Topograph",
    oneliner: "Business identity verification infrastructure for AML and compliance-heavy onboarding.",
    sector: "Compliance",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Paris",
    founders: "Emmanuel Scharff, Pierre-Henri Janssens",
    investors: "N/A",
    website: "https://topograph.co",
    why: "Removes a major bottleneck in KYB and compliance by giving fintechs direct, real-time access to verified company data."
  },
  {
    name: "DeepRecall",
    oneliner: "AI-powered regulatory intelligence for marketplaces, monitoring product safety alerts across jurisdictions.",
    sector: "Compliance",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Paris",
    founders: "Adam Rida",
    investors: "N/A",
    website: "https://deeprecall.io",
    why: "Addresses a critical scalability problem by automating product safety enforcement across millions of listings."
  },
  {
    name: "Mankinds",
    oneliner: "AI readiness/evaluation platform scoring AI systems before deployment across trust dimensions.",
    sector: "Compliance",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Paris",
    founders: "Laurent Zhang, Baptiste Bordet",
    investors: "N/A",
    website: "https://mankinds.io",
    why: "Well placed in the emerging 'AI audit/trust ops' layer as AI assurance shifts from best practice to buyer and regulatory requirement."
  },
  {
    name: "HyperGTM",
    oneliner: "Platform for expanding executive networks in an AI-driven commercial environment.",
    sector: "Agents",
    funding: 592000,
    fundingLabel: "$592K pre-seed",
    hq: "London",
    founders: "Adit Trivedi, Mohamad El-Samani, Rasheed Wihaib",
    investors: "Haatch, Houghton Street Ventures",
    website: "https://hypergtm.com",
    why: "Tackles a core bottleneck in enterprise sales—access to decision-makers—by compressing months of outreach into weeks."
  },
  {
    name: "Massive Dynamic",
    oneliner: "AI-native marketing operations suite for large-scale digital advertising teams.",
    sector: "Marketing",
    funding: 3000000,
    fundingLabel: "€3M pre-seed",
    hq: "Paris",
    founders: "Trystan Chabert, Guillaume Le Roy",
    investors: "Seedcamp, Founders Future, Tiny Supercomputer, Kima Ventures",
    website: "https://www.massive-dynamic.ai",
    why: "A strong pick in the 'AI copilots for high-spend operators' category, especially for performance marketing teams."
  },
  {
    name: "MediaROI",
    oneliner: "Platform integrating AI, attribution, and incrementality measurement for marketing campaign evaluation.",
    sector: "Marketing",
    funding: 0,
    fundingLabel: "N/A",
    hq: "Paris",
    founders: "Antoine Szalewski, David Sourenian, Florent Bolzinger",
    investors: "N/A",
    website: "https://www.mediaroi.io",
    why: "Unifies MMM, attribution, and incrementality into a single AI-driven platform for continuous, reliable marketing decisions."
  }
];

const grid = document.getElementById('cardGrid');
const resultCount = document.getElementById('resultCount');
const sortSelect = document.getElementById('sortSelect');
let activeFilter = 'all';

function formatFunding(val) {
  if (val >= 1000000) return '€' + (val / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (val >= 1000) return '€' + Math.round(val / 1000) + 'K';
  return '';
}

function renderCards(data) {
  grid.innerHTML = '';
  if (data.length === 0) {
    grid.innerHTML = '<div class="empty-state">No startups match this filter.</div>';
    resultCount.textContent = '0 / 20';
    return;
  }
  resultCount.textContent = data.length + ' / 20';

  data.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.sector = c.sector;
    card.style.animationDelay = (i * 0.03) + 's';

    const detailRows = [];
    if (c.founders && c.founders !== 'N/A') detailRows.push(`<div class="detail-row"><div class="detail-label">Founders</div><div class="detail-value">${c.founders}</div></div>`);
    if (c.hq && c.hq !== 'N/A') detailRows.push(`<div class="detail-row"><div class="detail-label">HQ</div><div class="detail-value">${c.hq}</div></div>`);
    if (c.investors && c.investors !== 'N/A') detailRows.push(`<div class="detail-row"><div class="detail-label">Investors</div><div class="detail-value">${c.investors}</div></div>`);
    if (c.website) detailRows.push(`<div class="detail-row"><div class="detail-label">Website</div><div class="detail-value"><a href="${c.website}" target="_blank" rel="noopener">${c.website.replace('https://', '')}</a></div></div>`);

    const whyHtml = c.why ? `<div class="why-it-matters"><div class="why-label">Why it matters</div>${c.why}</div>` : '';

    card.innerHTML = `
      <div class="card-main">
        <div class="card-info">
          <div class="card-name">${c.name}</div>
          <div class="card-oneliner">${c.oneliner}</div>
        </div>
        <div class="card-meta">
          <div class="sector-badge" data-sector="${c.sector}">${c.sector}</div>
          <div class="funding-tag ${c.funding > 0 ? 'has-funding' : ''}">${c.fundingLabel}</div>
        </div>
      </div>
      <div class="card-details">
        <div class="card-details-inner">
          ${detailRows.join('')}
          ${whyHtml}
        </div>
      </div>
      <div class="expand-icon">▼</div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      card.classList.toggle('expanded');
    });

    grid.appendChild(card);
  });
}

function getFilteredSorted() {
  let filtered = activeFilter === 'all' ? [...DATA] : DATA.filter(c => c.sector === activeFilter);

  const sort = sortSelect.value;
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'funding-desc') filtered.sort((a, b) => b.funding - a.funding);
  else if (sort === 'funding-asc') filtered.sort((a, b) => a.funding - b.funding);
  else if (sort === 'sector') filtered.sort((a, b) => a.sector.localeCompare(b.sector) || a.name.localeCompare(b.name));

  return filtered;
}

function update() { renderCards(getFilteredSorted()); }

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    update();
  });
});

sortSelect.addEventListener('change', update);

update();
</script>

</body>
</html>
</figure>
<!--kg-card-end: html-->
<hr><p><strong>1. Alpic</strong> — All-in-one cloud platform for deploying, hosting, and securing MCP servers for AI agents.</p><ul><li>Website: <a href="https://alpic.ai/?ref=frenchtechjournal.com">Alpic</a></li><li>Founders: Pierre-Louis Theron (CEO), Nikolay Rodionov (COO), Frédéric Barthelet (CTO), Charles Sonigo (CPO), Erica Beavers (CMO)</li><li>Funding: €5.1M pre-seed</li><li>Investors: K5 Global, Irregular Expression, Yellow, Drysdale, Kima Ventures, and Galion.exe, plus angel founders from companies including Mistral, Datadog, and Dataiku</li><li>HQ: Paris/San Francisco</li><li><strong>Why it matters:</strong> One of the clearer infrastructure bets on the rise of MCP as a standard interface between AI agents and external services.</li></ul><hr><p><strong>2. Rippletide</strong> — Decision database infrastructure making enterprise AI agents deterministic, explainable, and compliant.</p><ul><li>Website: <a href="https://www.rippletide.com/?ref=frenchtechjournal.com">Rippletide</a></li><li>Founders: Patrick Joubert (CEO) and Yann Bilien (Chief Scientist). Joubert is a serial entrepreneur who previously founded Recast.AI (acquired by SAP) and Ponicode (acquired by CircleCI).</li><li>Funding: €4M</li><li>Investors: OneRagtime</li><li>HQ: Paris/San Francisco</li><li><strong>Why it matters:</strong> Rippletide is attacking a real enterprise bottleneck in agent adoption: reliability, auditability, and decision control.</li></ul><hr><p><strong>3. Revox</strong> — Voice AI infrastructure company for outbound and inbound calls at scale. Its product focuses on reliable production deployment, including call orchestration and the reduction of failures such as IVR dead-ends, voicemail misclassification, and looping edge cases.</p><ul><li>Website: <a href="https://www.getrevox.com/?ref=frenchtechjournal.com">Revox</a></li><li>Founders: Aric Lasry (first engineer at Dust) and Jean-Baptiste de La Fage (previously founded PLUME, a YC-backed AI geospatial platform)</li><li>Funding: $3M pre-seed</li><li>Investors: Seedcamp, with Weekend Fund, Drysdale, Kima, and others</li><li>HQ: Paris</li><li><strong>Why it matters:</strong> Revox is pitching itself as the infra layer that makes voice agents dependable enough for revenue-critical workflows.</li></ul><hr><p><strong>4. Elix AI</strong> — Tool for managing daily business operations by creating and overseeing a dedicated AI workforce.</p><ul><li>Website: <a href="https://agentelix.ai/?ref=frenchtechjournal.com" rel="noreferrer">Elix</a></li><li>Founders: Muhammad Saad, Maliha Khalid</li><li><strong>Funding: N/A</strong></li><li><strong>Investors: N/A</strong></li><li><strong>HQ: Paris</strong></li><li><strong>Why it matters:</strong> Elix tackles a critical blind spot in AI adoption by giving companies full visibility into how their operations actually function, revealing where workflows break down and where AI can truly drive ROI. Instead of relying on guesswork, it enables organizations to target high-impact use cases, reducing wasted AI spend and accelerating meaningful operational improvements.</li></ul><hr><p><strong>5. Draft'n Run</strong> — Open-source, no-code visual platform for building, deploying, and monitoring AI workflows.</p><ul><li>Website: <a href="https://draftnrun.com/?ref=frenchtechjournal.com" rel="noreferrer"><strong>Draft'n Run</strong></a></li><li>Founders: Christian Verbrugge, Marc Sanselme, Mel Maysson Owen</li><li>Funding: N/A</li><li>Investors: N/A</li><li>HQ: Paris</li><li><strong>Why it matters:</strong> The company sits in the crowded AI workflow tooling layer, but its open-source and visual-builder positioning may help it win developer/ops teams that want speed without full custom engineering.</li></ul><hr><p><strong>6. Nativ</strong> — Nativ is the AI execution layer for high-volume B2B transactions, unifying automation and decision intelligence across industrial supply chain operations.</p><ul><li>Website: <a href="https://www.gonativ.ai/?ref=frenchtechjournal.com"><strong>Nativ</strong></a></li><li>Founders: Noemie El-Baz (CEO), Benoit Reulier (CPO), Alexandre Meunier (CTO)</li><li>Funding: $3M pre-seed</li><li>Investors: Serena, Moitier Ventures, Kima Ventures, Ovni Capital </li><li>HQ: Paris</li><li>Why it matters: <strong>Nativ</strong> is building an AI-powered execution layer that automates the messy upstream work in B2B transactions — turning fragmented orders, confirmations, and delivery updates into clean, ERP-ready decisions. The platform is designed for high-volume industrial and retail environments where exceptions are the norm, claiming to reduce order errors by 80% and cut manual processing work in half. Nativ integrates with existing ERP systems without requiring supplier onboarding or workflow changes, and is already deployed with aerospace and retail clients, generating hundreds of millions in revenue.</li></ul><hr><p><strong>7. Sillage</strong> — AI sales agents that monitor commercial signals and orchestrate enterprise sales actions.</p><ul><li>Website: <a href="http://getsillage.com/?ref=frenchtechjournal.com" rel="noreferrer">Sillage</a></li><li>Founders: Arthur Coudouy, Arnaud Weiss</li><li>Funding: Seed</li><li>Investors: Super Capital, Fred ROBERT, Backfuture</li><li>HQ: Paris</li><li><strong>Why it matters:</strong> Sillage it turns fragmented market signals into timely sales action. Instead of relying on static lists or generic outbound, sales teams can prioritize accounts that are actually showing signs of movement. That can improve conversion efficiency, reduce wasted outreach, and help reps engage prospects with stronger timing and context.</li></ul><hr><p><strong>8. Seavium</strong> — AI-powered offshore vessel chartering/search platform that gives charterers, brokers, and owners real-time market intelligence, ship search, technical data, AIS tracking, and direct owner access.</p><ul><li>Website: <a href="https://www.seavium.com/?ref=frenchtechjournal.com" rel="noreferrer">Seavium</a></li><li>Founders: Samuel Drai, Adrien Barrau</li><li>Funding: N/A</li><li>Investors: ZEBOX</li><li>HQ: Marseille</li><li><strong>Why it matters: </strong>The company is already showing strong traction, with AI-powered vessel search, real-time tracking, and growing commercial activity nearing €1M GMV in 2025. With this support, Seavium aims to dominate the French market quickly and scale internationally by expanding partnerships, integrations, and product capabilities.</li></ul><hr><p><strong>9. Well</strong> — Building an AI-native financial data platform that aggregates data from banks, tools, and documents into a unified system, automatically structuring, enriching, and analyzing it to power real-time business intelligence and reporting.</p><ul><li><strong>Website: </strong><a href="https://wellapp.ai/?ref=frenchtechjournal.com" rel="noreferrer"><strong>Well</strong></a></li><li><strong>Founders: </strong>Bastien Blanc, Maxime Champoux</li><li><strong>Funding: </strong>N/A</li><li><strong>Investors: </strong>Arthur Querou,</li><li><strong>HQ: </strong>Paris</li><li><strong>Why it matters: </strong>By turning fragmented financial data into a reliable, queryable “system of record,” Well eliminates manual finance workflows and enables founders and teams to make faster, data-driven decisions with minimal operational overhead.</li></ul><hr><p><strong>10. Nabel</strong> — Platform that transforms surveys into scalable voice-based customer conversations.</p><ul><li><strong>Website: N/A</strong></li><li><strong>Founders: </strong>Yousri Sellami and Tom Hayat</li><li><strong>Funding: N/A</strong></li><li><strong>Investors: N/A</strong></li><li><strong>HQ: N/A</strong></li><li><strong>Why it matters: N/A</strong></li></ul><hr><p><strong>11. Lemrock</strong> — Infrastructure enabling brands to sell products directly inside AI agents like ChatGPT and Claude.</p><ul><li>Website: <a href="https://lemrock.com/?ref=frenchtechjournal.com">Lemrock</a></li><li>Founders: Roxane Laigle (CEO), Sasha Collin (CPO), and Clément Nguyen (CTO). Collin and Nguyen are repeat YC S24 founders.</li><li>Funding: €6M</li><li>Investors: Galion.exe, Jean-Baptiste Rudelle, Michaël Benabou, Gary Anssens, Frédéric Halley, Emmanuelle Brizay, and Antoine Lizée</li><li>HQ: Paris</li><li><strong>Why it matters:</strong> One of the more compelling commerce infrastructure plays for a world where product discovery shifts from search results and marketplaces to AI agents.</li></ul><hr><p><strong>12. Synaps</strong> — Tool for reshaping e-commerce around AI agents.</p><ul><li>Website: <a href="https://gosynaps.com/?ref=frenchtechjournal.com" rel="noreferrer"><strong>Synaps</strong></a></li><li>Founders: Hugo Benloulou</li><li>Funding: €1.4M Seed</li><li>Investors: <strong>Entrepreneurs First, Super Capital, Transpose Platform Management</strong>, <strong>Kima Ventures, and HUB612</strong></li><li>HQ: Paris</li><li><strong>Why it matters: </strong>Synaps tackles one of the biggest bottlenecks in e-commerce—messy, fragmented product data—by automatically turning it into marketplace-ready listings, dramatically reducing onboarding time and operational friction. By enabling instant, multi-channel distribution with optimized content, it helps brands scale faster across marketplaces and improve visibility and conversion rates with minimal manual effort.</li></ul><hr><p><strong>13. GetMint</strong> — Helps brands measure, monitor, and improve how they appear in AI-generated responses across platforms such as ChatGPT, Gemini, Claude, Perplexity, and Google AI Overviews.</p><ul><li>Website: <a href="https://getmint.ai/?ref=frenchtechjournal.com">GetMint</a></li><li>Founders: Joan Burkovic, Matthieu Poitrimolt, Emmanuel Costa </li><li>Funding: €4M pre-seed</li><li>Investors: <strong>50 Partners, Kima Ventures, Clover, Better Angle</strong>, and strategic angels, including <strong>Philippe Corrot, Emmanuel Grenier, and Frédéric Halley</strong></li><li>HQ: Paris</li><li><strong>Why it matters: </strong>GetMint is an early European bet on “AI SEO” / generative engine optimization, a category likely to matter as conversational interfaces absorb more product discovery and brand research.</li></ul><hr><p><strong>14. Figen AI</strong> — Provides AI agents for wealth advisors, helping generate analyses, proposals, and client deliverables faster. The company frames itself as reducing advisor admin work so human advisors can spend more time on higher-value client interaction.</p><ul><li>Website: <a href="https://www.figenai.com/?ref=frenchtechjournal.com">Figen AI</a></li><li>Founders: Vincent Aurez (President), Nicolas Paulus, and Maxime Perdu</li><li>Funding: Self-financed</li><li>Investors: 1,200+ professional users</li><li>HQ: Paris</li><li><strong>Why it matters: </strong>Figen sits at the intersection of vertical AI and wealth-tech, where document-heavy, expertise-heavy workflows are especially ripe for agent support.</li></ul><hr><p><strong>15. Topograph</strong> — Building business identity verification infrastructure for AML and compliance-heavy onboarding use cases.</p><ul><li>Website: <a href="https://www.topograph.co/?ref=frenchtechjournal.com" rel="noreferrer"><strong>Topograph</strong></a></li><li><strong>Founders: </strong>Emmanuel Scharff, Pierre-Henri Janssens</li><li><strong>Funding: N/A</strong></li><li><strong>Investors: N/A</strong></li><li><strong>HQ: </strong>Paris</li><li><strong>Why it matters: </strong>Topograph removes a major bottleneck in KYB and compliance by giving fintechs direct, real-time access to verified company data from official registers, eliminating reliance on outdated aggregators and manual processes. By improving data accuracy, speed, and traceability, it enables faster onboarding, lower compliance costs, and more scalable regulatory operations—critical as financial services become increasingly automated and global.</li></ul><hr><p><strong>16. DeepRecall</strong> — Provides AI-powered regulatory intelligence for marketplaces, monitoring product safety alerts across jurisdictions, matching them against catalog data, and generating automated enforcement decisions with audit-grade evidence.</p><ul><li><strong>Website: </strong><a href="https://deeprecall.io/?ref=frenchtechjournal.com" rel="noreferrer"><strong>DeepRecall</strong></a></li><li><strong>Founders: </strong>Adam Rida</li><li><strong>Funding: </strong>N/A</li><li><strong>Investors: </strong>N/A</li><li><strong>HQ: </strong>Paris</li><li><strong>Why it matters: </strong>DeepRecall addresses a critical scalability problem for marketplaces by automating product safety enforcement, turning complex regulatory signals into real-time, auditable decisions across millions of listings. As regulatory pressure intensifies and product risks increase, it enables platforms to stay compliant, protect consumer trust, and avoid costly fines without relying on manual review processes.</li></ul><hr><p><strong>17. Mankinds</strong> — Mankinds is an AI readiness/evaluation platform that scores AI systems before deployment across trust dimensions such as privacy, security, fairness, explainability, and accountability, giving teams a “go / no-go” decision framework.</p><ul><li><strong>Website: </strong><a href="https://www.mankinds.io/?ref=frenchtechjournal.com" rel="noreferrer"><strong>Mankinds</strong></a></li><li><strong>Founders: </strong>Laurent Zhang, Baptiste Bordet</li><li><strong>Funding: N/A</strong></li><li><strong>Investors: N/A</strong></li><li><strong>HQ: </strong>Paris</li><li><strong>Why it matters: </strong>As AI assurance shifts from an internal best practice to a buyer and regulatory requirement, Mankinds is well placed in the emerging “AI audit/trust ops” layer.</li></ul><hr><p><strong>18. HyperGTM</strong> — Platform for expanding executive networks in an AI-driven commercial environment.</p><ul><li>Website: <a href="https://www.hypergtm.com/?ref=frenchtechjournal.com" rel="noreferrer"><strong>HyperGTM</strong></a></li><li>Founders: Adit Trivedi, Mohamad El-Samani, Rasheed Wihaib</li><li>Funding: $592K pre-Seed</li><li>Investors: <strong>Haatch</strong> and <strong>Houghton Street Ventures</strong></li><li>HQ: London</li><li><strong>Why it matters:</strong> HyperGTM tackles a core bottleneck in enterprise sales—access to decision-makers—by using AI agents to compress months-long executive outreach into weeks. By automating high-touch, 1:1 account-based marketing at scale, it enables teams to generate more pipeline, reduce customer acquisition costs, and win deals faster in an increasingly noisy and low-trust digital environment.</li></ul><hr><p><strong>19. Massive Dynamic</strong> – Building an AI-native marketing operations suite/orchestration layer for large-scale digital advertising teams, helping professional media buyers automate campaign execution and manage complex spend across channels and geographies.</p><ul><li><strong>Founders:</strong> Trystan Chabert, Guillaume Le Roy</li><li><strong>Website:</strong> <a href="https://www.massive-dynamic.ai/?ref=frenchtechjournal.com" rel="noreferrer"><strong>Massive Dynamic</strong></a></li><li><strong>Funding: </strong>€3M pre-seed in July 2025.</li><li><strong>Investors: </strong>Seedcamp, Founders Future, Tiny Supercomputer Investment Company, Purple, OPRTRS Club, New Renaissance Ventures, and Kima Ventures. </li><li><strong>Why it matters:</strong> A strong pick in the “AI copilots for high-spend operators” category, especially for performance marketing teams managing large, messy, real-time campaign environments.</li></ul><hr><p><strong>20. MediaROI</strong> — Platform integrating AI, attribution, and incrementality measurement for marketing campaign evaluation.</p><ul><li>Website: <a href="https://www.mediaroi.io/?ref=frenchtechjournal.com#/" rel="noreferrer"><strong>MediaROI</strong></a></li><li>Founders: Antoine Szalewski, David Sourenian, Florent Bolzinger</li><li>Funding: N/A</li><li>Investors: N/A</li><li>HQ: Paris</li><li><strong>Why it matters:</strong> MediaROI addresses a long-standing gap in marketing measurement by unifying MMM, attribution, and incrementality into a single AI-driven platform, enabling companies to move from fragmented analysis to continuous, reliable decision-making. By turning complex measurement into real-time, actionable insights, it helps marketers optimize budget allocation, improve ROI, and justify spend in an increasingly data-driven and scrutinized environment.</li></ul>
