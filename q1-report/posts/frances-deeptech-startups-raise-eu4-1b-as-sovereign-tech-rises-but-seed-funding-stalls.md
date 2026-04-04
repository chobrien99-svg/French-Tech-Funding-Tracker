---
title: "France’s Deeptech Startups Raise €4.1B As Sovereign Tech Rises But Seed Funding Stalls"
slug: "frances-deeptech-startups-raise-eu4-1b-as-sovereign-tech-rises-but-seed-funding-stalls"
date: "2026-03-16T14:08:47.000+01:00"
updated: "2026-04-03T23:25:17.000+02:00"
tags:
  - AI
  - Deep Dives
authors:
  - Chris O'Brien
excerpt: "Seven years after France launched its Deeptech Plan, startups are raising record funding and driving industrial innovation. But behind the €4.1B headline, early-stage investment is tightening, and the ecosystem faces a growing private capital gap."
featured: "true"
feature_image: "https://www.frenchtechjournal.com/content/images/2026/03/bpifrance_deeptech_hero-1-.png"
---

<p>Seven years into France's Plan Deeptech, the numbers tell a story of steady, almost stubborn, growth. </p><p>In 2025, France's deeptech startups raised a record €4.1 billion. That's four times what they pulled in when the plan launched in 2019, and now represents about half of all French Tech fundraising. </p>
<!--kg-card-begin: html-->
<figure class="kg-card kg-image-card kg-width-wide embed">
<style>
  .tab-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1rem; }
  .tab-btn {
    font-size: 13px;
    padding: 7px 14px;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border-secondary);
    background: var(--color-background-primary);
    color: var(--color-text-secondary);
    cursor: pointer;
    font-weight: 400;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .tab-btn:hover {
    background: var(--color-background-secondary);
    color: var(--color-text-primary);
  }
  .tab-btn.active {
    background: var(--color-background-tertiary);
    color: var(--color-text-primary);
    font-weight: 500;
    border-color: var(--color-border-primary);
  }
  .stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 1.5rem; }
  .stat-card {
    background: var(--color-background-secondary);
    border-radius: var(--border-radius-md);
    padding: 1rem;
  }
  .stat-label { font-size: 13px; color: var(--color-text-secondary); }
  .stat-value { font-size: 24px; font-weight: 500; color: var(--color-text-primary); }
  .legend { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 8px; font-size: 12px; color: var(--color-text-secondary); }
  .legend-item { display: flex; align-items: center; gap: 4px; }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .chart-note { font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 6px; }
  .chart-source { font-size: 11px; color: var(--color-text-tertiary); margin-top: 8px; }
</style>

<div style="padding: 1rem 0;">

  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">French deeptech raised (2025)</div>
      <div class="stat-value">€4.1B</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Share sovereign tech</div>
      <div class="stat-value">72%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active startups</div>
      <div class="stat-value">2,830</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Deeptech unicorns</div>
      <div class="stat-value">15</div>
    </div>
  </div>

  <div class="tab-row">
    <button class="tab-btn" id="btn-history" onclick="showChart('history')">Funding by stage</button>
    <button class="tab-btn" id="btn-sovereign" onclick="showChart('sovereign')">Sovereign tech shift</button>
    <button class="tab-btn" id="btn-global" onclick="showChart('global')">Global deeptech race</button>
    <button class="tab-btn" id="btn-sectors" onclick="showChart('sectors')">French sectors 2025</button>
  </div>

  <div id="legend-history" class="legend" style="display:none;">
    <span class="legend-item"><span class="legend-dot" style="background:#EF9F27;"></span>Seed</span>
    <span class="legend-item"><span class="legend-dot" style="background:#1D9E75;"></span>Series A</span>
    <span class="legend-item"><span class="legend-dot" style="background:#534AB7;"></span>Series B</span>
    <span class="legend-item"><span class="legend-dot" style="background:#378ADD;"></span>Series C+</span>
  </div>

  <div id="legend-sovereign" class="legend" style="display:none;">
    <span class="legend-item"><span class="legend-dot" style="background:#378ADD;"></span>Sovereign technologies</span>
    <span class="legend-item"><span class="legend-dot" style="background:#B4B2A9;"></span>Other deeptech</span>
  </div>

  <div id="legend-global" class="legend" style="display:none;">
    <span class="legend-item"><span class="legend-dot" style="background:#378ADD;"></span>United States</span>
    <span class="legend-item"><span class="legend-dot" style="background:#1D9E75;"></span>Europe (incl. UK)</span>
    <span class="legend-item"><span class="legend-dot" style="background:#D85A30;"></span>China</span>
  </div>

  <div id="legend-sectors" class="legend" style="display:none;">
    <span class="legend-item"><span class="legend-dot" style="background:#378ADD;"></span>AI 43%</span>
    <span class="legend-item"><span class="legend-dot" style="background:#D4537E;"></span>Health 24%</span>
    <span class="legend-item"><span class="legend-dot" style="background:#1D9E75;"></span>Energy 8%</span>
    <span class="legend-item"><span class="legend-dot" style="background:#EF9F27;"></span>Semiconductors 7%</span>
    <span class="legend-item"><span class="legend-dot" style="background:#534AB7;"></span>Aero/transport 4%</span>
    <span class="legend-item"><span class="legend-dot" style="background:#888780;"></span>Defense 4%</span>
    <span class="legend-item"><span class="legend-dot" style="background:#B4B2A9;"></span>Other 10%</span>
  </div>

  <div id="chart-note" class="chart-note"></div>

  <div style="position: relative; width: 100%; height: 320px;">
    <canvas id="mainChart"></canvas>
  </div>

  <div class="chart-source">Source: Bpifrance / Observatoire LesDeeptech.fr / Dealroom</div>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script>
let chart;
const ctx = document.getElementById('mainChart');

const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border-tertiary').trim() || 'rgba(0,0,0,0.08)';
const tickColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim() || '#666';

const baseScaleX = { grid: { display: false }, ticks: { font: { size: 12 }, color: tickColor } };
const baseScaleY = { grid: { color: gridColor }, ticks: { font: { size: 12 }, color: tickColor } };

const historyData = {
  labels: ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'],
  datasets: [
    { label: 'Seed', data: [120,150,180,200,250,300,400,500,550,580,572], backgroundColor: '#EF9F27', borderRadius: 3 },
    { label: 'Series A', data: [80,130,170,220,300,380,550,650,700,720,699], backgroundColor: '#1D9E75', borderRadius: 3 },
    { label: 'Series B', data: [50,100,150,200,280,400,900,1100,1200,1100,826], backgroundColor: '#534AB7', borderRadius: 3 },
    { label: 'Series C+', data: [30,50,80,150,170,300,900,1050,850,1700,2003], backgroundColor: '#378ADD', borderRadius: 3 }
  ]
};

const sovereignData = {
  labels: ['2019','2020','2021','2022','2023','2024','2025'],
  datasets: [
    { label: 'Sovereign technologies', data: [268,550,1100,1320,1250,1550,2900], backgroundColor: '#378ADD', borderRadius: 3 },
    { label: 'Other deeptech', data: [732,450,1650,1430,1500,1050,1200], backgroundColor: '#B4B2A9', borderRadius: 3 }
  ]
};

const globalData = {
  labels: ['2019','2020','2021','2022','2023','2024','2025'],
  datasets: [
    { label: 'United States', data: [25,30,55,50,45,82,137], backgroundColor: '#378ADD', borderRadius: 3 },
    { label: 'Europe (incl. UK)', data: [10.8,13,25.3,22,19.8,19.1,21.6], backgroundColor: '#1D9E75', borderRadius: 3 },
    { label: 'China', data: [12,15,20,18,16,18.4,16.2], backgroundColor: '#D85A30', borderRadius: 3 }
  ]
};

const sectorData = {
  labels: ['AI','Health','Energy','Semi-\nconductors','Aero/\ntransport','Defense','Other'],
  datasets: [{
    data: [1763,984,328,287,164,164,410],
    backgroundColor: ['#378ADD','#D4537E','#1D9E75','#EF9F27','#534AB7','#888780','#B4B2A9'],
    borderRadius: 3
  }]
};

const notes = {
  history: 'French deeptech fundraising by round stage, 2015\u20132025. Seed has plateaued around \u20ac600M while later stages have surged \u2014 Series C+ quadrupled since 2019.',
  sovereign: 'Sovereign tech share of French deeptech fundraising grew from 25% (\u20ac335M) in 2019 to 72% (\u20ac2.9B) in 2025.',
  global: 'US deeptech investment surged 67% in 2025 driven by AI mega-rounds (OpenAI, Anthropic, xAI). Europe grew 13%.',
  sectors: 'French deeptech fundraising by sector in 2025 \u2014 AI accounts for 43% of total, driven largely by Mistral AI\u2019s \u20ac1.7B Series C.'
};

function euroLabel(v) { return v >= 1000 ? '\u20ac' + (v/1000).toFixed(1) + 'B' : '\u20ac' + v + 'M'; }

function createChart(type) {
  if (chart) chart.destroy();

  if (type === 'history') {
    chart = new Chart(ctx, {
      type: 'bar', data: historyData,
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...baseScaleX, stacked: true, ticks: { ...baseScaleX.ticks, autoSkip: false } }, y: { ...baseScaleY, stacked: true, ticks: { ...baseScaleY.ticks, callback: euroLabel } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.dataset.label + ': \u20ac' + c.raw + 'M' } } }
      }
    });
  } else if (type === 'sovereign') {
    chart = new Chart(ctx, {
      type: 'bar', data: sovereignData,
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...baseScaleX, stacked: true }, y: { ...baseScaleY, stacked: true, ticks: { ...baseScaleY.ticks, callback: euroLabel } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.dataset.label + ': \u20ac' + c.raw + 'M' } } }
      }
    });
  } else if (type === 'global') {
    chart = new Chart(ctx, {
      type: 'bar', data: globalData,
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: baseScaleX, y: { ...baseScaleY, ticks: { ...baseScaleY.ticks, callback: v => '\u20ac' + v + 'B' } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.dataset.label + ': \u20ac' + c.raw + 'B' } } }
      }
    });
  } else {
    chart = new Chart(ctx, {
      type: 'bar', data: sectorData,
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        scales: { x: { ...baseScaleY, ticks: { ...baseScaleY.ticks, callback: v => '\u20ac' + v + 'M' } }, y: { ...baseScaleX, ticks: { ...baseScaleX.ticks, autoSkip: false } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '\u20ac' + c.raw + 'M' } } }
      }
    });
  }
}

function showChart(type) {
  ['history','sovereign','global','sectors'].forEach(t => {
    document.getElementById('legend-' + t).style.display = t === type ? 'flex' : 'none';
    var btn = document.getElementById('btn-' + t);
    btn.classList.toggle('active', t === type);
  });
  document.getElementById('chart-note').textContent = notes[type];
  createChart(type);
}

showChart('history');
</script>
</figure>
<!--kg-card-end: html-->
<p>Some 410 new deeptech startups were created during the year, more than double the 178 created in 2018. The ecosystem now counts 2,830 active startups generating €5.4 billion in annual revenue and employing 50,000 people directly, according to Bpifrance.</p><p>"Seven years — that's starting to be the age of reason," Paul-François Fournier, Bpifrance's executive director for innovation, told journalists at a press conference launching the report. "This is no longer anecdotal. It's a real ecosystem."</p><h2 id="a-deeptech-ecosystem-reaches-critical-mass">A Deeptech Ecosystem Reaches Critical Mass</h2><p>Those 2,830 startups operate more than 200 industrial sites across France, including 15 that have reached unicorn status and 57 that are publicly listed. Nearly half are classified as industrial startups, with health (42%), greentech (25%), and digital (21%) filling out the rest. </p><p>Fournier noted that when these startups build their own production sites, more than 90% do so in France. Bpifrance considers this a powerful rebuttal to those who wonder whether public innovation spending actually generates domestic industrial activity.</p><p>But peel back the headline figures and a more complex picture emerges. </p><h2 id="ai-mega-rounds-are-skewing-the-numbers">AI Mega-Rounds Are Skewing the Numbers</h2><p>The record €4.1 billion was heavily driven by artificial intelligence. More specifically, Mistral AI's monster €1.7 billion Series C. </p><p>Remove AI from the equation, and the picture is more muted. </p><p>Early-stage funding has plateaued around €600 million, with fewer seed rounds and higher average ticket sizes, a sign that investors are getting more selective and, as Fournier candidly admitted, more cautious.</p><p>"The seed funds are having a really hard time raising," he said. "When funds take a long time to raise, they become a little more anxious, a little less active in deploying capital. That's something we're watching closely."</p><p>Health remained a bright spot, stable at around €1 billion. Fournier described the sector as "very resilient" with a complete economic model that functions even during downturns. </p><h2 id="capital-flows-toward-strategic-sovereignty">Capital Flows Toward Strategic Sovereignty</h2><p>But the real story of 2025 was the dramatic pivot toward what France calls "sovereign technologies." </p><p>Investment in strategic sectors such as defense, space, AI, cybersecurity, semiconductors, and energy surged from just 25% of deeptech fundraising in 2019 (€335 million) to a commanding 72% in 2025 (€2.9 billion). </p><p>The geopolitical reshuffling is reshaping where capital flows. The report highlights a gallery of companies driving this shift: </p><ul><li>Loft Orbital in shared space infrastructure </li><li>Unseenlab in maritime surveillance </li><li>Sekoia.io in predictive cybersecurity</li><li>DIAMFAB in diamond semiconductors</li><li>Calogena in nuclear micro-reactors</li></ul><h2 id="european-corporates-begin-moving-into-deeptech">European Corporates Begin Moving Into Deeptech</h2><p>Perhaps the most structurally significant trend of the year, though, was the growing engagement of large European corporates: </p><ul><li>Dassault Aviation took a stake in drone maker Harmattan AI. </li><li>Renault invested in Wandercraft's robotic exoskeletons. </li><li>ASML became the lead investor in Mistral AI's latest round. </li><li>Bosch, Nokia, and Nvidia all participated in Scintil Photonics' Series B. </li><li>Ipsen acquired ImCheck Therapeutics for €350 million.</li><li>Mistral snapped up serverless cloud platform Koyeb to reduce its external dependencies.</li></ul><p>Still, Fournier was honest about how much further corporates need to go. </p><p>Asked whether France's CAC 40 companies were truly playing the deeptech game, he said: "I think things are moving, but to be direct with you, the CAC 40 companies have not yet changed their approach to this sector in a systemic way. They need to reallocate a significant portion of their R&amp;D resources from a world they controlled, where they did their own innovation in-house, toward this new ecosystem that operates by very different rules."</p><p>He compared the shift to moving from Newtonian physics to something more probabilistic: "We're going from a world where you built a TGV in a linear, controlled way, to a world where there's a myriad of technologies appearing everywhere, and these companies need to learn to reintegrate and manage that."</p><h2 id="europe%E2%80%99s-deeptech-race-against-the-united-states">Europe’s Deeptech Race Against the United States</h2><p>The global context provides both motivation and anxiety. </p><p>The United States attracted a staggering €137 billion in deeptech investment in 2025, up 67% year-on-year, turbocharged by mega-rounds from OpenAI, Anthropic, xAI, and Databricks. </p><p>Europe managed €21.6 billion (+13%), while China pulled in €16.2 billion (-12%). France held its position as Europe's second-largest deeptech market behind the UK (€6 billion) and ahead of Germany (€2.8 billion). </p><p>The American surge is driven by a dynamic Europe that simply can't replicate: tech giants like Nvidia, Microsoft, and Meta pouring capital into AI startups not as traditional VC investors, but as strategic buyers of optionality. </p><p>"Our ecosystem isn't mature enough in Europe for that yet," he said. "We're still paying for the lead we lost in the 2000s. We don't have those giants."</p><h2 id="the-%E2%82%AC30-billion-question-who-will-fund-the-next-phase">The €30 Billion Question: Who Will Fund the Next Phase</h2><p>He also pushed back against defeatism, noting that outside of AI, the U.S. market is considerably more strained. And Europe has built genuine foundations: €132 billion invested in deeptech since 2020, 7,300 university spinouts, and 55 deeptech unicorns created on the continent, including 16 since 2020.</p><p>Looking ahead, the report identifies three priorities for what Bpifrance calls "Phase 3" of the plan: scaling up and industrializing the ecosystem. </p><p>First, building deeper European connections through startups operating across borders, shared offices, cross-border investors, and commercial partnerships.</p><p> Second, mobilizing massive private financing. The ecosystem will need €30 billion by 2030, and public money alone won't get there. </p><p>Third, bringing corporates much closer to the startup world through strategic partnerships, public procurement, and exits that create European champions.</p><p>"The problem is less and less public money," Fournier said. "The problem is more and more private money. If you want to build a European fund of funds today, you'll find significant public resources. But you'll have a terrible time finding private capital. That's the real problem."</p><h2 id="france%E2%80%99s-deeptech-ecosystem-faces-an-exit-test">France’s Deeptech Ecosystem Faces an Exit Test</h2><p>There were 27 exits in 2025, including three private equity buyouts, with EQT's acquisition of Waga Energy being the most notable. But Fournier acknowledged this needs to multiply dramatically. </p><p>That sense of urgency may be the defining mood of French deeptech right now. With just over a year until the next French presidential election and the end of 10 years of unwavering support from President "Startup Nation" Macron, the nation's innovation ecosystem is wondering if it may be ready to stand on its own.</p><p>"We'll attract capital if we can also deliver exits. And we'll deliver exits because we'll have grown these companies to a level of maturity," he said. "We have about three years to solve this equation."</p>
