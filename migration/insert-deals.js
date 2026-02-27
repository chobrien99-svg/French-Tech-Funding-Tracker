/**
 * French Tech Funding Tracker - Direct-to-Supabase Deal Insertion
 *
 * Single script that inserts new deals directly into Supabase with all
 * associated data (company, funding round, founders, investors, sectors,
 * news) in one pass. No JSON intermediary or follow-up patching needed.
 *
 * Usage:
 *   1. Add deals to the DEALS array below using the documented format
 *   2. Run:
 *        export SUPABASE_URL="https://tlwqkglfyjydwsgjrclx.supabase.co"
 *        export SUPABASE_SERVICE_KEY="your-service-role-key"
 *        node insert-deals.js
 *
 * Deal format:
 *   {
 *     company:     "Company Name",                          // REQUIRED
 *     description: "What the company does",                 // REQUIRED
 *     hq:          "Paris",                                 // REQUIRED
 *     round:       "Series A",                              // REQUIRED
 *     amount:      10.5,                                    // REQUIRED (millions EUR, null if undisclosed)
 *     month:       "January",                               // REQUIRED
 *     year:        2026,                                    // REQUIRED
 *     sectors:     ["AI & Machine Learning"],               // REQUIRED (at least one)
 *     investors:   ["Lead Investor", "Other Investor"],     // REQUIRED (at least one)
 *     founders:    [                                        // REQUIRED (at least one)
 *       { name: "Jane Doe", linkedin: "https://linkedin.com/in/janedoe" },
 *       { name: "John Doe" }                               // linkedin is optional
 *     ],
 *     news_url:    "https://example.com/article",           // recommended - link to news source
 *     news_summary:"Company raised €10M to expand...",      // optional - brief description of the deal
 *     website:     "https://company.com",                   // optional
 *   }
 */

const { createClient } = require('@supabase/supabase-js');

// =============================================
// CONFIGURATION
// =============================================

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tlwqkglfyjydwsgjrclx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
    console.error('Usage: SUPABASE_SERVICE_KEY=your-key node insert-deals.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// =============================================
// DEALS TO INSERT
// =============================================
// Replace this array with new deals each time you run the script.

const DEALS = [
 {
  company: "newcleo",
  description: "newcleo is a European developer of advanced nuclear technologies focused on lead-cooled fast reactors (LFRs) powered by fuel derived from recycled nuclear waste. By combining proven reactor physics with next-generation fuel cycles, newcleo aims to deliver steady, competitive, low-carbon electricity and industrial heat for energy-intensive industries such as steel, chemicals, cement, shipping, and offshore infrastructure.",
  hq: "Paris, Turin",
  round: "Series B",
  amount: 75,
  month: "January",
  year: 2026,
  sectors: ["Energy", "CleanTech"],
  investors: ["Kairos", "Indaco Ventures", "Azimut Investments", "CERN Pension Fund", "Walter Tosto", "Danieli & C.", "Cementir Holding", "Orion Valves", "NextChem", "Family Offices"],
  founders: [
    { name: "Stefano Buono" }
  ],
  news_url: "https://www.marketscreener.com/news/newcleo-secures-eur75-million-funding-round-with-cementir-among-investors-ce7e5bd3d189f427?ref=frenchtechjournal.com",
  news_summary: "newcleo closed a €75M round, bringing total funding since 2021 to €645M, with continued financial backing and new industrial investors across steel, cement, valves, engineering, and energy-adjacent sectors. Proceeds will fund European R&D infrastructure including the 10 MW non-nuclear lead-cooled PRECURSOR test reactor and support expansion in the US, while advancing licensing and siting in France and large-scale facilities in Italy.",
  website: "https://www.newcleo.com/"
},

{
  company: "Hublo",
  description: "Hublo is a workforce management SaaS platform dedicated to healthcare institutions, enabling hospitals, clinics, nursing homes, and providers to manage staffing end-to-end—from recruitment and scheduling to internal mobility and communication—centralising both ad-hoc and recurring staffing needs.",
  hq: "Paris",
  round: "Growth",
  amount: 40,
  month: "January",
  year: 2026,
  sectors: ["HealthTech", "SaaS & Enterprise"],
  investors: ["Revaia"],
  founders: [
    { name: "Antoine Loron" }
  ],
  news_url: "https://www.eu-startups.com/2026/02/healthtech-platform-hublo-secures-e40-million-revaia-reinvestment-to-support-post-exit-growth-phase/?ref=frenchtechjournal.com",
  news_summary: "Revaia committed €40M via a reinvestment vehicle to continue supporting Hublo after its 2025 sale to Five Arrows. Hublo is used by 22,000+ managers across 5,000+ facilities, supports ~1M healthcare professionals, and has quadrupled ARR since 2021 while reaching break-even and expanding into a full workforce and talent management suite.",
  website: "https://www.hublo.com/"
},

{
  company: "MyC",
  description: "MyC is a B2B SaaS platform for managing employee health in industrial, multi-site, and high-risk environments. The cloud solution centralizes medical data to help medical teams, HR, and compliance functions coordinate care and meet regulatory obligations across complex, low-connectivity settings.",
  hq: "Paris",
  round: "Series A",
  amount: 10,
  month: "January",
  year: 2026,
  sectors: ["HealthTech", "SaaS & Enterprise"],
  investors: ["Hi inov", "IXO", "Elaia", "OSS Ventures"],
  founders: [
    { name: "Laurent Bonnardot" },
    { name: "Benjamin Crevant" }
  ],
  news_url: "https://tech.eu/2026/02/03/french-healthtech-myc-secures-eur10m-to-digitise-medical-operations-for-complex-worksites/?ref=frenchtechjournal.com",
  news_summary: "MyC raised €10M to accelerate product development—especially AI-driven analysis and automation—and scale internationally. Founded in 2020, it is deployed across ~400 sites in 60+ countries, serving 500,000+ beneficiaries in regulated sectors such as energy, industry, maritime, defense, and specialized medical services.",
  website: "https://www.myc.doctor/"
},

{
  company: "Apmonia Therapeutics",
  description: "Apmonia Therapeutics is a clinical-stage biotech developing targeted cancer therapies by addressing the extracellular matrix (ECM), modeling protein–protein interactions to generate therapeutic candidates aimed at improving drug penetration and efficacy in solid tumors.",
  hq: "Reims",
  round: "Series A",
  amount: 10,
  month: "January",
  year: 2026,
  sectors: ["BioTech"],
  investors: ["Capital Grand Est", "Finovam Gestion", "Fondation Fournier-Majoie", "Angels Santé", "Capital Cell"],
  founders: [
    { name: "Albin Jeanne" }
  ],
  news_url: "https://www.lejournaldesentreprises.com/article/apmonia-therapeutics-boucle-une-levee-de-fonds-pour-accelerer-le-developpement-de-ses-therapies-2136072?ref=frenchtechjournal.com#selection-3047.149-3089.659",
  news_summary: "Apmonia Therapeutics raised €10M to take its lead asset TAX2 into first-in-human development, financing a Phase I trial in France and Belgium across multiple solid tumor indications. Total funding since 2019 is ~€21M including €9.5M from the EIC in 2024, and the company is strengthening governance and its ECM-focused discovery platform.",
  website: "https://apmonia-therapeutics.com/"
},

{
  company: "Linkup",
  description: "Linkup is building a real-time search engine designed specifically for AI systems via an API-first architecture, enabling AI models and agents to search, retrieve, and validate web information in real time using an AI-native index built from fine-grained “atoms of information.”",
  hq: "Paris",
  round: "Seed",
  amount: 8.46,
  month: "January",
  year: 2026,
  sectors: ["AI & Machine Learning"],
  investors: ["Gradient", "Elaia", "Leblon Capital", "Weekend Fund", "Seedcamp", "Axeleo Capital", "OPRTRS Club", "Motier Ventures", "Business Angels", "Arthur Mensch", "Florian Douetteau", "Olivier Pomel"],
  founders: [
    { name: "Philippe Mizrahi" },
    { name: "Boris Toledano" },
    { name: "Denis Charrier" }
  ],
  news_url: "https://www.maddyness.com/2026/02/03/des-anciens-de-spotify-lyft-et-carrefour-levent-10-millions-de-dollars-pour-batir-le-google-search-de-lia/?ref=frenchtechjournal.com",
  news_summary: "After closing a €3M seed in November 2024, Linkup raised an additional $10M to scale its real-time web search API for AI agents, addressing reliability risks such as misinformation and bot-generated content. The company will expand teams across Paris, New York, and San Francisco and deepen partnerships with trusted publishers.",
  website: "https://www.linkup.so/"
},

{
  company: "UBEES",
  description: "UBEES provides scalable regenerative pollination programs combining professional apiculture, connected beehives with sensors, agronomic data, and field support to help farmers and brands monitor ecosystem health, improve practices, protect biodiversity, and increase smallholder incomes.",
  hq: "Paris",
  round: "Series A",
  amount: 8,
  month: "January",
  year: 2026,
  sectors: ["AgriTech"],
  investors: ["Starquest", "Capagro", "Newtree Impact"],
  founders: [
    { name: "Louis Delelis-Fanien" }
  ],
  news_url: "https://www.lesechos.fr/start-up/impact/ubees-la-start-up-qui-fait-ami-avec-les-abeilles-2213535?ref=frenchtechjournal.com",
  news_summary: "UBEES raised €8M to accelerate international expansion—especially in Latin America and Africa—advance its connected hive technologies, strengthen impact measurement, and build a global community of farmers generating additional income through apiculture.",
  website: "https://www.ubees.com/"
},

{
  company: "Bobine",
  description: "Bobine is an industrial cleantech startup developing an electricity-based chemical recycling technology for non-recyclable plastics. Its process combines heterogeneous catalysis and electromagnetic induction to produce polymers equivalent to virgin plastic without relying on pyrolysis.",
  hq: "Lyon",
  round: "Series A",
  amount: 7.5,
  month: "January",
  year: 2026,
  sectors: ["CleanTech"],
  investors: ["Axeleo Capital", "UI Investissement", "Angelor", "CA Création", "CACF Capital Innovation", "C.A.V.", "Quest Investment"],
  founders: [
    { name: "Vincent Simonneau" }
  ],
  news_url: "https://www.lesechos.fr/start-up/impact/bobine-la-start-up-qui-innove-dans-le-recyclage-chimique-des-plastiques-2213803?ref=frenchtechjournal.com",
  news_summary: "Bobine raised €13M to accelerate industrialisation of its chemical recycling technology, including €7.5M in equity led by Axeleo Capital. The company claims major efficiency gains versus conventional approaches and is running an industrial pilot at Michelin’s materials center, aiming to scale from 100 kg/day to a 1 ton/day demonstrator.",
  website: "https://bobine-chemistry.com/"
},

{
  company: "Dionymer",
  description: "Dionymer develops an industrial biotech process converting food waste into bio-based PHA polymers via a two-step approach—sugar extraction followed by bacterial fermentation—enabling consistent, high-quality biopolymers for multiple industrial applications.",
  hq: "Pessac",
  round: "Series A",
  amount: 7,
  month: "January",
  year: 2026,
  sectors: ["CleanTech", "BioTech"],
  investors: ["UI Investissement", "BNP Paribas Développement", "Bpifrance", "Naco", "Irdi", "Aquiti", "AFI Ventures", "Resilience"],
  founders: [
    { name: "Thomas Hennebel" },
    { name: "Guillaume Charbonnier" },
    { name: "Antoine Brege" }
  ],
  news_url: "https://www.lesechos.fr/start-up/deals/dionymer-la-start-up-qui-veut-convertir-nos-dechets-alimentaires-en-bioplastique-2213674?ref=frenchtechjournal.com",
  news_summary: "Dionymer raised €7M to scale production of PHA biopolymers from food waste, financing a 100-ton/year demonstrator planned for 2026 and preparing for a 1,000-ton/year factory by 2030. The technology is validated at pilot scale with early cosmetic customers and expansion planned into plastics and textiles.",
  website: "https://www.dionymer.com/"
},

{
  company: "Geolinks Services",
  description: "Geolinks Services develops passive-seismic subsurface monitoring and modeling solutions. Its FlowTerra™ product enables near–real-time dynamic subsurface modeling to visualize underground fluid movements, improving safety for mining, CO₂ storage, and exploration of natural hydrogen and next-generation geothermal resources.",
  hq: "Paris",
  round: "Seed",
  amount: 3.4,
  month: "January",
  year: 2026,
  sectors: ["DeepTech", "Energy"],
  investors: ["Calderion", "Bpifrance", "BRGM Invest", "InnoEnergy"],
  founders: [
    { name: "Jean-Charles Ferran" }
  ],
  news_url: "https://presse.bpifrance.fr/geolinks-services-leve-6-meur-aupres-de-calderion-du-fonds-french-tech-seed-gere-pour-le-compte-de-letat-par-bpifrance-dans-le-cadre-de-france-2030-brgm-invest-et-innoenergy-pour-industrialiser-flowt?ref=frenchtechjournal.com",
  news_summary: "Geolinks Services raised €3.4M, alongside €2.6M in additional financing (total €6M), to support the 2026 commercial launch of FlowTerra™ for mining, CCS, and natural hydrogen markets, strengthening teams in AI, geosciences, and modeling and scaling industrial operations.",
  website: "https://geolinks-services.com/"
},

{
  company: "DermaScan",
  description: "DermaScan builds specialized centers for early-stage skin cancer screening, combining advanced medical technologies including total-body mapping and AI with optimized workflows to speed diagnosis and reduce pressure on dermatologists.",
  hq: "Paris",
  round: "Seed",
  amount: 2.5,
  month: "January",
  year: 2026,
  sectors: ["MedTech", "AI & Machine Learning"],
  investors: ["Ring Capital", "Techmind", "Kima Ventures", "199 Ventures", "Hexa", "Business Angels", "Céline Lazorthes", "Jean-Charles Samuelian"],
  founders: [
    { name: "Florian Legris" },
    { name: "Hadrien Lepage" }
  ],
  news_url: "https://www.maddyness.com/2026/02/02/sante-celine-lazorthes-jean-charles-samuelian-kima-et-hexa-misent-sur-une-pepite-specialisee-dans-le-depistage-du-cancer-de-la-peau/",
  news_summary: "DermaScan raised €2.5M to expand its network of skin cancer screening centers across major French cities after opening two Paris sites and reporting early detection outcomes at scale, with only ~10% of patients referred onward to dermatologists.",
  website: "https://www.dermascan.fr/"
},

{
  company: "Entent",
  description: "Entent develops Heat-to-Power solutions converting low-temperature industrial waste heat into electricity. Its patented Pulse machine uses a thermo-acoustic cycle capable of valorising heat from as low as 60°C to improve energy efficiency and support industrial decarbonisation.",
  hq: "Aix-en-Provence",
  round: "Seed",
  amount: 2.4,
  month: "January",
  year: 2026,
  sectors: ["CleanTech", "DeepTech", "Industrial Decarbonization", "Energy Hardware"],
  investors: ["Team For The Planet", "CAAP Création", "Sowefund"],
  founders: [
    { name: "Mathias Fonlupt" }
  ],
  news_url: "https://mesinfos.fr/13080-aix-en-provence/aix-en-provence-entent-leve-24-millions-d-euros-pour-decarboner-l-industrie-238905.html?ref=frenchtechjournal.com",
  news_summary: "Entent raised €2.4M to launch first commercial deployments of its Pulse machines and prepare a future Series A, with a first industrial installation planned at a Michelin site starting in Q1 2026 and ambitions to deploy dozens of machines within three years.",
  website: "https://entent.fr/"
},

{
  company: "PRESAGE",
  description: "PRESAGE develops AI-driven world models designed to capture the causal behavior of cloud infrastructures, simulating the impact of actions before deployment so teams can shift from reactive incident management to predictive operations.",
  hq: "Paris",
  round: "Seed",
  amount: 1.2,
  month: "January",
  year: 2026,
  sectors: ["AI & Machine Learning"],
  investors: ["welovefounders", "Kima Ventures", "Boost10x"],
  founders: [
    { name: "Arthur Chevalier" },
    { name: "Annah Augier" },
    { name: "Hamza Aassif" }
  ],
  news_url: "https://www.linkedin.com/posts/benjamin-rey3_presage-l%C3%A8ve-12-m-presage-raises-12m-activity-7424746500116877313-Fah8?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAE0kG8BObj6r7nc5sfWRNVZaz22BQG3gmI",
  news_summary: "PRESAGE raised €1.2M to accelerate product development and begin first deployments of its causal world models for cloud infrastructure, shaped by feedback from 100+ senior engineering leaders across companies such as Front, Doctolib, Voodoo, Heetch, Nodle, and FlexAI.",
  website: "https://presagelabs.ai/"
},

{
  company: "Sailiz",
  description: "Sailiz designs technical nautical clothing specifically adapted to women, focusing on performance-driven design and eco-responsibility through recyclable, PFC-free mono-material garments and strong repairability.",
  hq: "Lorient",
  round: "Pre-Seed",
  amount: 0.2,
  month: "January",
  year: 2026,
  sectors: ["E-commerce & Retail"],
  investors: ["Bretagne Sud Angels", "Michel Le Bars", "Philippe Guidoux", "Business Angels"],
  founders: [
    { name: "Solène Saclier" }
  ],
  news_url: "https://www.boatindustry.com/news/51188/sailiz-strengthens-its-development-with-a-200000-fundraising-round?ref=frenchtechjournal.com",
  news_summary: "Sailiz raised €200K in a first round (two tranches: €150K closed, €50K still open) to expand its women-focused technical sailing apparel line, recruit a textile engineer, and pursue European expansion targeting the UK, Spain, and Scandinavia.",
  website: "https://sailiz.fr/"
};
// =============================================
// SECTOR UTILITIES
// =============================================

const SECTOR_COLORS = {
    'AI & Machine Learning': '#8b5cf6',
    'SaaS & Enterprise': '#3b82f6',
    'FinTech': '#eab308',
    'HealthTech': '#10b981',
    'BioTech': '#10b981',
    'HealthTech & BioTech': '#10b981',
    'CleanTech': '#84cc16',
    'Energy': '#facc15',
    'CleanTech & Energy': '#84cc16',
    'Cybersecurity': '#f43f5e',
    'E-commerce & Retail': '#f59e0b',
    'FoodTech': '#22c55e',
    'AgriTech': '#16a34a',
    'FoodTech & AgriTech': '#22c55e',
    'AgriTech & FoodTech': '#22c55e',
    'PropTech & Real Estate': '#06b6d4',
    'EdTech': '#14b8a6',
    'Mobility & Logistics': '#3b82f6',
    'Mobility & Transportation': '#3b82f6',
    'DeepTech': '#a855f7',
    'Hardware': '#6366f1',
    'DeepTech & Hardware': '#6366f1',
    'Web3': '#fb923c',
    'Media & Entertainment': '#ec4899',
    'BioTech & Pharma': '#10b981',
    'HRTech': '#8b5cf6',
    'LegalTech': '#64748b',
    'SpaceTech': '#1e3a8a',
    'SpaceTech & Aerospace': '#1e3a8a',
    'Gaming': '#a855f7',
    'InsurTech': '#0ea5e9',
    'MarTech': '#f97316'
};

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[&]/g, '-and-')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// =============================================
// VALIDATION
// =============================================

function validateDeal(deal, index) {
    const errors = [];
    const label = `Deal #${index + 1}` + (deal.company ? ` (${deal.company})` : '');

    if (!deal.company || typeof deal.company !== 'string')
        errors.push('company is required (string)');
    if (!deal.description || typeof deal.description !== 'string')
        errors.push('description is required (string)');
    if (!deal.hq || typeof deal.hq !== 'string')
        errors.push('hq is required (string)');
    if (!deal.round || typeof deal.round !== 'string')
        errors.push('round is required (string)');
    if (deal.amount !== null && deal.amount !== undefined && typeof deal.amount !== 'number')
        errors.push('amount must be a number or null');
    if (!deal.month || typeof deal.month !== 'string')
        errors.push('month is required (string)');
    if (!deal.year || typeof deal.year !== 'number')
        errors.push('year is required (number)');

    if (!Array.isArray(deal.sectors) || deal.sectors.length === 0)
        errors.push('sectors is required (non-empty array of strings)');
    if (!Array.isArray(deal.investors) || deal.investors.length === 0)
        errors.push('investors is required (non-empty array of strings)');
    if (!Array.isArray(deal.founders) || deal.founders.length === 0)
        errors.push('founders is required (non-empty array of {name, linkedin?})');

    if (deal.founders && Array.isArray(deal.founders)) {
        deal.founders.forEach((f, i) => {
            if (typeof f === 'string') {
                errors.push(`founders[${i}]: use {name: "${f}"} instead of a plain string`);
            } else if (!f.name || typeof f.name !== 'string') {
                errors.push(`founders[${i}]: name is required (string)`);
            }
        });
    }

    if (!deal.news_url) {
        errors.push('news_url is missing (recommended: link to news source article)');
    }

    if (errors.length > 0) {
        console.error(`\n  VALIDATION ISSUES for ${label}:`);
        const blocking = errors.filter(e => !e.startsWith('news_url'));
        const warnings = errors.filter(e => e.startsWith('news_url'));
        blocking.forEach(e => console.error(`    ERROR: ${e}`));
        warnings.forEach(e => console.warn(`    WARNING: ${e}`));
        return blocking.length === 0; // warnings don't block
    }

    return true;
}

// =============================================
// DATABASE OPERATIONS
// =============================================

// In-memory caches to avoid redundant upserts within a single run
const cityCache = new Map();
const sectorCache = new Map();
const investorCache = new Map();
const personCache = new Map();

async function upsertCity(name) {
    if (!name) return null;
    const key = name.toLowerCase();
    if (cityCache.has(key)) return cityCache.get(key);

    const { data, error } = await supabase
        .from('cities')
        .upsert({ name, country: 'France' }, { onConflict: 'name,country' })
        .select('id')
        .single();

    if (error) {
        console.error(`    City upsert failed (${name}): ${error.message}`);
        return null;
    }
    cityCache.set(key, data.id);
    return data.id;
}

async function upsertSector(name) {
    if (!name) return null;
    const key = name.toLowerCase();
    if (sectorCache.has(key)) return sectorCache.get(key);

    const slug = slugify(name);
    const color = SECTOR_COLORS[name] || '#64748b';

    const { data, error } = await supabase
        .from('sectors')
        .upsert({ name, slug, color }, { onConflict: 'name' })
        .select('id')
        .single();

    if (error) {
        console.error(`    Sector upsert failed (${name}): ${error.message}`);
        return null;
    }
    sectorCache.set(key, data.id);
    return data.id;
}

async function upsertInvestor(name) {
    if (!name) return null;
    const key = name.toLowerCase();
    if (investorCache.has(key)) return investorCache.get(key);

    const { data, error } = await supabase
        .from('investors')
        .upsert({ name }, { onConflict: 'name' })
        .select('id')
        .single();

    if (error) {
        console.error(`    Investor upsert failed (${name}): ${error.message}`);
        return null;
    }
    investorCache.set(key, data.id);
    return data.id;
}

async function upsertPerson(founder) {
    const name = founder.name;
    const linkedin = founder.linkedin || null;
    const key = `${name.toLowerCase()}|${linkedin || ''}`;
    if (personCache.has(key)) return personCache.get(key);

    // Check for existing person with same name and linkedin
    const query = supabase.from('people').select('id').eq('full_name', name);
    if (linkedin) {
        query.eq('linkedin_url', linkedin);
    } else {
        query.is('linkedin_url', null);
    }
    const { data: existing } = await query.maybeSingle();

    if (existing) {
        personCache.set(key, existing.id);
        return existing.id;
    }

    // Also check by name only (may exist from older import without linkedin)
    if (linkedin) {
        const { data: byName } = await supabase
            .from('people')
            .select('id, linkedin_url')
            .eq('full_name', name)
            .is('linkedin_url', null)
            .maybeSingle();

        if (byName) {
            // Update existing record with the linkedin URL
            await supabase
                .from('people')
                .update({ linkedin_url: linkedin })
                .eq('id', byName.id);
            personCache.set(key, byName.id);
            return byName.id;
        }
    }

    const { data, error } = await supabase
        .from('people')
        .insert({ full_name: name, linkedin_url: linkedin })
        .select('id')
        .single();

    if (error) {
        console.error(`    Person insert failed (${name}): ${error.message}`);
        return null;
    }
    personCache.set(key, data.id);
    return data.id;
}

// =============================================
// DEAL INSERTION
// =============================================

async function insertDeal(deal, index) {
    const label = `[${index + 1}/${DEALS.length}]`;
    console.log(`\n${label} ${deal.company}`);

    // 1. City
    const cityId = await upsertCity(deal.hq);

    // 2. Company (reuse existing or create new)
    const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('name', deal.company)
        .maybeSingle();

    let companyId;
    if (existingCompany) {
        companyId = existingCompany.id;
        console.log(`    Company already exists: ${companyId} — adding new funding round`);

        // Update company info with latest data
        const updates = {};
        if (deal.description) updates.description = deal.description;
        if (deal.website) updates.website = deal.website;
        if (cityId) { updates.hq_city_id = cityId; updates.hq_city_name = deal.hq; }
        if (Object.keys(updates).length > 0) {
            updates.updated_at = new Date().toISOString();
            await supabase.from('companies').update(updates).eq('id', companyId);
            console.log(`    Company info updated`);
        }
    } else {
        const { data: companyData, error: companyErr } = await supabase
            .from('companies')
            .insert({
                name: deal.company,
                description: deal.description,
                website: deal.website || null,
                hq_city_id: cityId,
                hq_city_name: deal.hq
            })
            .select('id')
            .single();

        if (companyErr) {
            console.error(`    Company insert failed: ${companyErr.message}`);
            return 'failed';
        }
        companyId = companyData.id;
        console.log(`    Company created: ${companyId}`);
    }

    // 3. Funding round (with news_url and notes)
    const { data: roundData, error: roundErr } = await supabase
        .from('funding_rounds')
        .insert({
            company_id: companyId,
            round_type: deal.round,
            amount_eur: deal.amount || null,
            announced_month: deal.month,
            announced_year: deal.year,
            news_url: deal.news_url || null,
            notes: deal.news_summary || null,
            source: 'ftj'
        })
        .select('id')
        .single();

    if (roundErr) {
        console.error(`    Funding round insert failed: ${roundErr.message}`);
        return 'failed';
    }
    const fundingRoundId = roundData.id;
    console.log(`    Funding round created: ${fundingRoundId}`);

    // 4. Sectors (dynamic upsert, not hardcoded IDs)
    for (let i = 0; i < deal.sectors.length; i++) {
        const sectorId = await upsertSector(deal.sectors[i]);
        if (sectorId) {
            const { error } = await supabase
                .from('company_sectors')
                .upsert(
                    { company_id: companyId, sector_id: sectorId, is_primary: i === 0 },
                    { onConflict: 'company_id,sector_id' }
                );
            if (error) console.error(`    Sector link failed (${deal.sectors[i]}): ${error.message}`);
        }
    }
    console.log(`    Sectors linked: ${deal.sectors.join(', ')}`);

    // 5. Founders (with linkedin URLs)
    for (const founder of deal.founders) {
        const personId = await upsertPerson(founder);
        if (personId) {
            const { error } = await supabase
                .from('company_people')
                .upsert(
                    { company_id: companyId, person_id: personId, role: 'founder' },
                    { onConflict: 'company_id,person_id,role' }
                );
            if (error) console.error(`    Founder link failed (${founder.name}): ${error.message}`);
        }
    }
    console.log(`    Founders linked: ${deal.founders.map(f => f.name).join(', ')}`);

    // 6. Investors
    for (let i = 0; i < deal.investors.length; i++) {
        const investorId = await upsertInvestor(deal.investors[i]);
        if (investorId) {
            const { error } = await supabase
                .from('funding_round_investors')
                .upsert(
                    { funding_round_id: fundingRoundId, investor_id: investorId, is_lead: i === 0 },
                    { onConflict: 'funding_round_id,investor_id' }
                );
            if (error) console.error(`    Investor link failed (${deal.investors[i]}): ${error.message}`);
        }
    }
    console.log(`    Investors linked: ${deal.investors.join(', ')}`);

    // Summary
    const newsStatus = deal.news_url ? 'URL' : (deal.news_summary ? 'summary only' : 'none');
    console.log(`    News: ${newsStatus}`);
    console.log(`    DONE`);
    return existingCompany ? 'added' : 'success';
}

// =============================================
// MAIN
// =============================================

async function main() {
    console.log('=================================================');
    console.log('French Tech Funding - Direct-to-Supabase Insertion');
    console.log('=================================================');
    console.log(`Deals to insert: ${DEALS.length}`);

    if (DEALS.length === 0) {
        console.log('\nNo deals to insert. Add deals to the DEALS array and re-run.');
        console.log('See the deal format documentation at the top of this file.');
        process.exit(0);
    }

    // Validate all deals before inserting any
    console.log('\n--- Validation ---');
    let allValid = true;
    for (let i = 0; i < DEALS.length; i++) {
        if (!validateDeal(DEALS[i], i)) {
            allValid = false;
        }
    }

    if (!allValid) {
        console.error('\nFix the validation errors above before running.');
        process.exit(1);
    }
    console.log('All deals passed validation.');

    // Insert deals
    console.log('\n--- Insertion ---');
    const results = { success: 0, added: 0, failed: 0 };

    for (let i = 0; i < DEALS.length; i++) {
        try {
            const result = await insertDeal(DEALS[i], i);
            results[result]++;
        } catch (err) {
            console.error(`    Unexpected error: ${err.message}`);
            results.failed++;
        }
    }

    // Summary
    console.log('\n=================================================');
    console.log('RESULTS');
    console.log(`  New companies: ${results.success}`);
    console.log(`  New rounds (existing companies): ${results.added}`);
    console.log(`  Failed:   ${results.failed}`);
    console.log('=================================================');

    process.exit(results.failed > 0 ? 1 : 0);
}

main();
