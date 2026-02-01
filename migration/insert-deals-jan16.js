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
  company: "Harmattan AI",
  description: "Defense technology company developing vertically integrated autonomous systems, including AI-enabled ISR and strike UAVs, layered air-defense solutions, drone interception, electronic warfare platforms, and C2 systems. Harmattan AI focuses on sovereign, controlled autonomy deployed at scale for NATO and allied forces.",
  hq: "Paris",
  round: "Series B",
  amount: 200,
  month: "January",
  year: 2026,
  sectors: ["DefenseTech", "AI & Machine Learning", "Aerospace"],
  investors: ["Dassault Aviation"],
  founders: [
    { name: "Mouad M’Ghari" },
    { name: "Martin de Gourcuff" },
    { name: "Edouard Rosset" }
  ],
  news_url: "",
  news_summary: "Harmattan AI raised a $200M Series B led by Dassault Aviation as part of a strategic partnership to integrate controlled, sovereign AI into next-generation combat aviation systems, including Rafale F5 and future UCAS programs.",
  website: "https://www.harmattan.ai"
},

{
  company: "FineHeart",
  description: "FineHeart is a clinical-stage medical technology company developing next-generation Active Implantable Medical Devices for advanced heart failure. Its flagship product, FlowMaker®, is the world’s first fully implantable cardiac output accelerator.",
  hq: "Bordeaux",
  round: "Series C",
  amount: 35,
  month: "January",
  year: 2026,
  sectors: ["HealthTech", "BioTech"],
  investors: [
    "Groupe Pasteur Mutualité",
    "Groupe Etchart",
    "European Innovation Council",
    "EIB Fund",
    "FH Founders",
    "Lurra",
    "IRDI Capital Investment",
    "Groupe Doliam",
    "NACO",
    "Aquiti Gestion",
    "Galia Gestion",
    "Broadview Ventures",
    "M Capital",
    "UI Investment",
    "Verve Capital"
  ],
  founders: [
    { name: "Arnaud Mascarell" },
    { name: "Dr. Stéphane Garrigue" },
    { name: "Dr. Philippe Ritter" }
  ],
  news_url: "",
  news_summary: "FineHeart secured €83M in combined private and public funding, including a €35M Series C and €48M in non-dilutive IPCEI Tech4Cure grants, to accelerate the clinical and industrial development of its FlowMaker® device.",
  website: "https://www.fineheart.fr"
},

{
  company: "SunLib",
  description: "SunLib is a French solar autoconsumption startup offering residential photovoltaic installations through a subscription model, removing upfront investment and credit constraints.",
  hq: "Aix-en-Provence",
  round: "Series A",
  amount: 25,
  month: "January",
  year: 2026,
  sectors: ["CleanTech", "Energy", "FinTech"],
  investors: ["Epopée Gestion"],
  founders: [
    { name: "Arnaud Langlois" }
  ],
  news_url: "",
  news_summary: "Founded 18 months ago, SunLib raised €25M in a Series A fully subscribed by Epopée Gestion to scale residential solar subscriptions, targeting 100,000 subscribers and 1.5 GW of installed capacity by 2030.",
  website: "https://www.sunlib.fr"
},

{
  company: "Enodia Therapeutics",
  description: "Biotech company developing small-molecule drugs that trigger degradation of disease-causing proteins as they are being synthesized, using a platform combining proteomics and machine learning.",
  hq: "Paris",
  round: "Seed",
  amount: 20.7,
  month: "January",
  year: 2026,
  sectors: ["AI & Machine Learning", "HealthTech", "BioTech"],
  investors: [
    "Elaia",
    "Pfizer Ventures",
    "Bpifrance",
    "Sambrinvest",
    "MACSF",
    "Investsud",
    "Argobio",
    "Institut Pasteur",
    "Wallonie Entreprendre"
  ],
  founders: [
    { name: "Caroline Demangel" },
    { name: "Yves Ribeill" }
  ],
  news_url: "",
  news_summary: "Enodia Therapeutics will advance its lead program toward preclinical candidate selection, with ambitions across inflammatory, autoimmune, and viral diseases.",
  website: ""
},

{
  company: "MYCOPHYTO",
  description: "MYCOPHYTO is a French pioneer in mycorrhizal biostimulants and soil regeneration, developing nature-inspired solutions that improve crop resilience, water retention, and yields.",
  hq: "Grasse",
  round: "Series A",
  amount: 16,
  month: "January",
  year: 2026,
  sectors: ["AgriTech", "FoodTech", "CleanTech", "Energy"],
  investors: [
    "Innovacom",
    "BNP Paribas",
    "Bpifrance",
    "CDG Invest",
    "Noshaq",
    "RSI",
    "Crédit Agricole"
  ],
  founders: [
    { name: "Justine Lipuma" }
  ],
  news_url: "",
  news_summary: "The Series A will fund MYCOPHYTO’s international expansion, the scaling of production through its first manufacturing plant, and the broader deployment of its mycorrhizal solutions across agriculture segments.",
  website: ""
},

{
  company: "Equitable Earth",
  description: "Certification platform for nature-based carbon removal projects focused on transparency, community impact, and ecological integrity, with one of the fastest certification processes in the market.",
  hq: "Paris",
  round: "Growth",
  amount: 12.6,
  month: "January",
  year: 2026,
  sectors: ["AgriTech", "FoodTech"],
  investors: ["US Family Office", "AENU", "noa", "Localglobe"],
  founders: [
    { name: "Priscille Raynaud" },
    { name: "Thibault Sorret" }
  ],
  news_url: "",
  news_summary: "Equitable Earth secured €5M in a seed-extension round to scale certification capacity and develop new methodologies for additional nature-based carbon removal project types.",
  website: ""
},

{
  company: "Kepplair Evolution",
  description: "Kepplair Evolution develops a multi-role firefighting aircraft by converting the ATR 72 into the KEPPLAIR 72, addressing wildfire response, cargo transport, and medical evacuation needs.",
  hq: "Toulouse",
  round: "Seed",
  amount: 5,
  month: "January",
  year: 2026,
  sectors: ["Aerospace", "ClimateTech", "DefenseTech"],
  investors: ["Groupe AVICO", "ORA"],
  founders: [
    { name: "David Joubert" }
  ],
  news_url: "",
  news_summary: "Kepplair Evolution closed €5M to support final design and EASA certification of the KEPPLAIR 72, with first deliveries planned before the 2027 wildfire season.",
  website: ""
},

{
  company: "Cementic",
  description: "Cementic develops a nanomaterial for root canal fillings that eliminates 99.99% of lingering bacteria, reducing post-treatment infections and antibiotic use.",
  hq: "Paris",
  round: "Seed",
  amount: 4,
  month: "January",
  year: 2026,
  sectors: ["HealthTech", "BioTech"],
  investors: ["Blast", "Business Angels", "Dental Professionals"],
  founders: [
    { name: "Samir Raddi" }
  ],
  news_url: "",
  news_summary: "Cementic is preparing to launch clinical trials in French dental clinics, with a U.S. market entry targeted within six months.",
  website: ""
},

{
  company: "Revox",
  description: "Revox builds a developer-first API enabling reliable, production-grade outbound AI calling at scale, addressing infrastructure failures that have limited real-world voice AI deployments.",
  hq: "Paris",
  round: "Pre-Seed",
  amount: 3,
  month: "January",
  year: 2026,
  sectors: ["AI & Machine Learning"],
  investors: [
    "Seedcamp",
    "Weekend Fund",
    "Drysdale",
    "Purple",
    "OPRTRS CLUB",
    "Firedrop",
    "Kima Ventures",
    "Tiny VC",
    "Business Angels"
  ],
  founders: [
    { name: "Aric Lasry" },
    { name: "Jean-Baptiste de La Fage" }
  ],
  news_url: "",
  news_summary: "Revox raised a $3M pre-seed led by Seedcamp to scale its voice AI infrastructure platform, initially targeting high-trust U.S. use cases such as debt collection and hiring.",
  website: ""
},

{
  company: "Sweetech",
  description: "Sweetech develops fermentation-based processes to produce rare sugars used in pharmaceuticals, cosmetics, and nutraceuticals as a sustainable alternative to synthetic chemistry.",
  hq: "Toulouse",
  round: "Seed",
  amount: 2.25,
  month: "January",
  year: 2026,
  sectors: ["HealthTech", "BioTech"],
  investors: ["Iron Hands Capital", "Bpifrance"],
  founders: [
    { name: "Julien Durand" },
    { name: "Yannick Malbert" }
  ],
  news_url: "",
  news_summary: "Sweetech will use the funding to support pilot production, customer acquisition, and R&D as it scales its sustainable rare sugar platform.",
  website: ""
},

{
  company: "Viti-Tunnel",
  description: "Viti-Tunnel develops a retractable physical protection system for row crops, shielding vineyards and other agricultural productions from climatic hazards while reducing chemical inputs.",
  hq: "Le Haillan",
  round: "Seed",
  amount: 2,
  month: "January",
  year: 2026,
  sectors: ["AgriTech", "FoodTech", "CleanTech", "Energy"],
  investors: [
    "Parnass",
    "Crédit Agricole Aquitaine Expansion",
    "Sowefund",
    "Demea Invest"
  ],
  founders: [
    { name: "Patrick Delmarre" }
  ],
  news_url: "",
  news_summary: "Viti-Tunnel closed a €2M funding round to accelerate commercial rollout in France and internationally across multiple crop categories.",
  website: ""
},

{
  company: "Campsider",
  description: "Campsider is a curated marketplace for second-hand technical sports equipment, managing product qualification, pricing, logistics, delivery, and expert advice.",
  hq: "Lyon",
  round: "Seed",
  amount: 1.5,
  month: "January",
  year: 2026,
  sectors: ["Recommerce", "SportsTech", "Circular Economy"],
  investors: ["Founders Future", "50Partners Impact", "Sowefund"],
  founders: [
    { name: "Thomas Gounot" },
    { name: "Arthur Rocle" }
  ],
  news_url: "",
  news_summary: "Nearly profitable in France, Campsider raised €1.5M to fund European expansion, targeting Germany and Italy as it scales toward category leadership.",
  website: ""
},

{
  company: "Gamevestor",
  description: "Gamevestor is a regulated crowdinvesting platform dedicated to video game projects, enabling milestone-based investment while preserving studio independence.",
  hq: "Annecy",
  round: "Seed",
  amount: 0.55,
  month: "January",
  year: 2026,
  sectors: ["Gaming", "Fintech", "Creator Economy"],
  investors: [
    "ForsVC",
    "LeanSquare",
    "Noshaq",
    "Bpifrance",
    "Région Auvergne–Rhône-Alpes",
    "Business Angels"
  ],
  founders: [
    { name: "Ivan Marchand" },
    { name: "Arthur Van Clap" }
  ],
  news_url: "",
  news_summary: "Gamevestor secured AMF approval and ORIAS registration, enabling EU-wide operations ahead of a public launch scheduled for early 2026.",
  website: ""
},

{
  company: "Smartphone iD",
  description: "French startup reinventing identity photo and remote identity verification using AI-based biometric technology combined with human verification.",
  hq: "Paris",
  round: "Seed",
  amount: 0.2,
  month: "January",
  year: 2026,
  sectors: ["Cybersecurity", "AI & Machine Learning"],
  investors: ["QVEMA", "Kelly Massol", "Anthony Bourbon"],
  founders: [
    { name: "Émile Menetrey" }
  ],
  news_url: "",
  news_summary: "Following its appearance on M6, Smartphone iD secured €200K in funding and is targeting €5M in revenue by 2026.",
  website: ""
},

{
  company: "BW Ideol",
  description: "BW Ideol is a pioneer in floating offshore wind foundation technology, developing scalable concrete solutions to unlock deep-water wind resources.",
  hq: "La Ciotat",
  round: "Growth",
  amount: null,
  month: "January",
  year: 2026,
  sectors: ["CleanTech", "Energy"],
  investors: ["Holcim"],
  founders: [
    { name: "Paul de la Guérivière" },
    { name: "Pierre Coulombeau" }
  ],
  news_url: "",
  news_summary: "Holcim acquired a minority stake in BW Ideol and entered a strategic partnership to supply low-carbon concrete materials for floating offshore wind foundations.",
  website: ""
},
{
  company: "Abbelight",
  description: "Abbelight is a pioneer in super-resolution microscopy, delivering end-to-end nanoscopy solutions combining chemistry, optics, and data analysis.",
  hq: "Paris",
  round: "Series B",
  amount: null,
  month: "January",
  year: 2026,
  sectors: ["HealthTech", "BioTech"],
  investors: ["AVANT BIO"],
  founders: [
    { name: "Jean-Baptiste Marie" },
    { name: "Nicolas Bourg" }
  ],
  news_url: "",
  news_summary: "Abbelight closed a Series B led by AVANT BIO to accelerate imaging innovation and scale adoption beyond academic research into biopharma and CROs.",
  website: ""
},
];
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

    // 2. Company (check for existing first to avoid duplicates)
    const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('name', deal.company)
        .maybeSingle();

    if (existingCompany) {
        console.log(`    SKIPPED: company "${deal.company}" already exists (id: ${existingCompany.id})`);
        return 'skipped';
    }

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
    const companyId = companyData.id;
    console.log(`    Company created: ${companyId}`);

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
    return 'success';
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
    const results = { success: 0, skipped: 0, failed: 0 };

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
    console.log(`  Inserted: ${results.success}`);
    console.log(`  Skipped:  ${results.skipped} (already existed)`);
    console.log(`  Failed:   ${results.failed}`);
    console.log('=================================================');

    process.exit(results.failed > 0 ? 1 : 0);
}

main();
