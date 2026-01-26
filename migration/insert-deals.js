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
  company: "Pennylane",
  description: "Pennylane is a unified financial and accounting operating system for accounting firms and their SME clients, combining accounting production, financial management, electronic invoicing, and integrated financial services. Founded in 2020, the platform positions itself as a sovereign, product-led alternative to legacy accounting software, increasingly powered by AI.",
  hq: "Paris",
  round: "Growth",
  amount: 175,
  month: "January",
  year: 2026,
  sectors: ["Fintech", "AI & Machine Learning"],
  investors: [
    "TCV",
    "Blackstone Growth",
    "Sequoia Capital",
    "DST Global",
    "CapitalG",
    "Meritech Capital"
  ],
  founders: [
    { name: "Arthur Waller" },
    { name: "Tancrède Besnard" },
    { name: "Félix Blossier" },
    { name: "Thierry Déo" },
    { name: "Édouard Mascré" },
    { name: "Quentin de Metz" }
  ],
  news_url: "",
  news_summary: "Pennylane raised €175M in a growth round led by TCV, with participation from Blackstone Growth and all major historical investors. The round was completed with limited dilution and a strict governance charter ensuring founder control, pricing stability, and product continuity. The capital will support AI-driven product development, European expansion, electronic invoicing infrastructure, and the expansion of embedded financial services, as Pennylane aims to become the European leader in financial and accounting operating systems for SMEs and their advisors.",
  website: "https://www.pennylane.com"
},
    {
  company: "Stoïk",
  description: "Stoïk is a European cyber insurtech combining cyber insurance, proactive security software, and 24/7 incident response into a single integrated offering. Founded in 2021, the company targets SMEs and mid-sized enterprises with an AI-powered, full-stack cyber risk model covering prevention, detection, insurance coverage, and post-incident recovery, positioning itself as the embedded “CISO of Europe.”",
  hq: "Paris",
  round: "Series C",
  amount: 20,
  month: "January",
  year: 2026,
  sectors: ["Cybersecurity", "AI & Machine Learning"],
  investors: [
    "Impala",
    "Opera Tech Ventures",
    "Alven",
    "Andreessen Horowitz (a16z)"
  ],
  founders: [
    { name: "Jules Veyrat" },
    { name: "Alexandre Andreini" },
    { name: "Nicolas Sayer" },
    { name: "Philippe Mangematin" }
  ],
  news_url: "",
  news_summary: "Stoïk raised a €20M Series C to accelerate European expansion and deepen its AI-driven cyber prevention, detection, and incident response capabilities. The company now insures more than 10,000 businesses across six European countries and generated nearly €50M in gross written premiums in 2025, growing over 200% year-on-year. The funding will support team expansion and reinforce Stoïk’s ambition to become a continent-wide cyber risk operating partner rather than a pure insurance provider.",
  website: "https://www.stoik.io"
},
{
  company: "Symbiotic Security",
  description: "Symbiotic Security is building the world’s first AI code generation agent designed to produce secure code by default. Its flagship product, Symbiotic Code, embeds security directly into the code generation process through enforced prehooks, automated verification, and agentic remediation, eliminating security debt at the moment code is written. The platform is model-agnostic and supports leading LLMs across cloud and on-prem environments.",
  hq: "New York City, Paris",
  round: "Seed",
  amount: 10,
  month: "January",
  year: 2026,
  sectors: ["Cybersecurity", "AI & Machine Learning"],
  investors: [
    "Alven",
    "Drysdale Ventures",
    "Lerer Hippeau",
    "Axeleo Capital",
    "Factorial Capital"
  ],
  founders: [
    { name: "Jérôme Robert" },
    { name: "Édouard Viot" }
  ],
  news_url: "",
  news_summary: "Symbiotic Security announced the launch of Symbiotic Code alongside a $10M Seed round led by Alven. The platform addresses rising enterprise risk from AI-generated code, which research shows contains vulnerabilities in a majority of cases. Funding will support product acceleration, go-to-market expansion, and the commercial rollout ahead of a full launch in March.",
  website: "https://www.symbiotic.security"
},
{
  company: "Eclaircie",
  description: "Eclaircie is a developer and installer of agricultural photovoltaic power plants, specializing in rooftop solar installations for agricultural buildings. The company designs, finances, builds, and operates solar-equipped farm infrastructure, supporting agricultural modernization while enabling long-term renewable energy production.",
  hq: "Lorient",
  round: "Crowdfunding",
  amount: 6.9,
  month: "January",
  year: 2026,
  sectors: ["CleanTech & Energy", "AgriTech & FoodTech"],
  investors: [
    "Arkéa Banque Entreprises et Institutionnels (ABEI)",
    "Enerfip"
  ],
  founders: [
    { name: "Nicolas Bergeron" }
  ],
  news_url: "",
  news_summary: "Eclaircie secured €6.9M to launch its first photovoltaic construction program, Caliaco 1, combining senior bank debt from Arkéa Banque Entreprises et Institutionnels with participatory financing via Enerfip. The funding will support the construction of 17 rooftop solar plants across agricultural sites in western France, totaling 5.8 MW of capacity, with long-term operation and eventual ownership transfer to farmers.",
  website: "https://www.eclaircie.fr"
},
{
  company: "The Sanctuary Group",
  description: "The Sanctuary Group is a French studio-based fitness platform operating discipline-specific, immersive sports studios. Through branded concepts such as Le Cercle (boxing), Poses (yoga), and Decibel (dance), the group delivers curated coaching experiences combining music, lighting, and scenography within purpose-built environments.",
  hq: "Paris",
  round: "Growth",
  amount: 4.7,
  month: "January",
  year: 2026,
  sectors: ["E-commerce & Retail"],
  investors: [
    "Blast",
    "Seventure Partners",
    "M Capital",
    "Smalt Capital"
  ],
  founders: [
    { name: "Renaud Nataf" },
    { name: "Alexandre Wilhem" }
  ],
  news_url: "",
  news_summary: "The Sanctuary Group raised €4.7M in a growth round led by Blast, with participation from existing investors Seventure Partners, M Capital, and Smalt Capital. The funding will support expansion across France and internationally, the rollout of new studios, and the launch of a selective franchise model as the group accelerates European growth.",
  website: "https://www.thesanctuarygroup.com"
},
{
  company: "Neo Xperiences",
  description: "Neo Xperiences is a technology scale-up specializing in immersive and interactive leisure experiences. Its proprietary technology transforms walls into interactive play surfaces, combining physical activity, gaming, and phygital experiences. The company is expanding beyond entertainment into health and rehabilitation use cases.",
  hq: "Caen",
  round: "Series A",
  amount: 3.6,
  month: "January",
  year: 2026,
  sectors: ["E-commerce & Retail"],
  investors: [
    "Go Capital",
    "Bpifrance",
    "Normandy Development Agency"
  ],
  founders: [
    { name: "Boris Courté" }
  ],
  news_url: "",
  news_summary: "Neo Xperiences raised €3.6M to accelerate its expansion in France and internationally across indoor leisure and immersive entertainment markets. The funding will support product industrialization, increased R&D, and team expansion as the company targets rapid growth and broader adoption across leisure, tourism, and health sectors.",
  website: "https://www.neoxperiences.com"
},
{
  company: "Anodine",
  description: "Anodine is an industrial deeptech startup developing rechargeable catalytic coatings for mixed metal oxide (MMO) electrodes used in electrolysis systems. Originating from over ten years of academic research at Université Grenoble Alpes and CNRS, the company has developed a patented technology that reduces the use of critical metals by more than 50% while enabling electrode reuse and recharging, supporting eco-design, circularity, and European industrial sovereignty.",
  hq: "Grenoble",
  round: "Seed",
  amount: 2.5,
  month: "January",
  year: 2026,
  sectors: ["DeepTech", "CleanTech & Energy"],
  investors: [
    "Sowefund",
    "Grenoble Angels",
    "Business Angels",
    "Bpifrance",
    "Banque Populaire Auvergne-Rhône-Alpes",
    "Crédit Agricole Sud Rhône Alpes",
    "SATT Linksium"
  ],
  founders: [
    { name: "Damien Mouchel dit Leguerrier" }
  ],
  news_url: "",
  news_summary: "Anodine raised €2.5M to prepare its industrial scale-up phase and accelerate commercial deployment of its rechargeable MMO electrode technology. The round was led by Sowefund and Grenoble Angels alongside business angels and public partners. The funding will support industrialization of a proprietary dip-coating process enabling electrode rechargeability while reducing reliance on critical metals for strategic applications such as water treatment, electrolysis, nuclear infrastructure, and PFAS depollution.",
  website: "https://www.anodine.tech"
},
{
  company: "Notom",
  description: "Notom is an industrial software startup developing a platform that modernizes legacy factory automation systems without replacing existing machines. The solution connects industrial equipment to modern IT systems, enabling data exploitation and the gradual integration of AI to improve production efficiency across industrial environments.",
  hq: "Saint-Ouen",
  round: "Seed",
  amount: 2,
  month: "January",
  year: 2026,
  sectors: ["AI & Machine Learning"],
  investors: [
    "SistaFund",
    "Kima Ventures",
    "Olympe Capital",
    "Business Angels",
    "Aude Guo"
  ],
  founders: [
    { name: "Paola Fedou" },
    { name: "Jean-Philippe Gross" }
  ],
  news_url: "",
  news_summary: "Founded in 2025 by former Innovafeed engineers, Notom raised €2M just months after launch to accelerate development of its industrial automation platform. The funding will support product development, team expansion, and deployments with early industrial clients, primarily in the agri-food sector, positioning Notom as an enabler of AI adoption in factories without costly equipment replacement.",
  website: "https://www.notom.ai"
},
{
  company: "Windcoop",
  description: "Windcoop is a maritime freight cooperative structured as a Société Coopérative d’Intérêt Collectif (SCIC), developing low-carbon container shipping services powered by wind propulsion. The cooperative brings together citizens, companies, and partners under a shared-governance model applied to maritime logistics.",
  hq: "Lorient",
  round: "Crowdfunding",
  amount: 1.4,
  month: "January",
  year: 2026,
  sectors: ["CleanTech & Energy"],
  investors: [
    "Crowdfunding"
  ],
  founders: [
    { name: "Alice de Cointet de Fillain" },
    { name: "Matthieu Brunet-Kimmel" },
    { name: "Nils Joyeux-Zylberman" },
    { name: "Francois Harary" },
    { name: "Victor Depoers" },
    { name: "Julien Noe" },
    { name: "Amaury Bolvin" },
    { name: "Louise Chopinet" }
  ],
  news_url: "",
  news_summary: "Windcoop closed its third citizen funding round by raising €1.4M, significantly exceeding its initial target. The funding coincides with the start of construction of its first wind-powered container ship, Miaraka, which will operate a direct shipping route between France and Madagascar from 2027, delivering an estimated 60% reduction in CO₂ emissions compared to conventional maritime transport.",
  website: "https://www.wind.coop"
},
{
  company: "checkDPE",
  description: "checkDPE is a digital platform designed to improve the reliability and usability of the Diagnostic de Performance Énergétique (DPE), a key regulatory metric impacting real estate value and compliance. Built on proprietary AI modules, the platform analyzes existing DPEs, simulates post-renovation performance, and helps prioritize and manage energy renovation actions for individuals and professionals.",
  hq: "Paris",
  round: "Seed",
  amount: 1.2,
  month: "January",
  year: 2026,
  sectors: ["CleanTech & Energy", "AI & Machine Learning", "PropTech & Real Estate"],
  investors: [
    "Demea Sustainable Investment",
    "Bpifrance"
  ],
  founders: [
    { name: "Emmanuel Blanchet" },
    { name: "Germain Blanchet" }
  ],
  news_url: "",
  news_summary: "checkDPE raised €1.2M in a funding round led by Demea Sustainable Investment to deploy its platform to the general public, initiate B2B market entry, and accelerate product development. Positioned at the intersection of regulation, AI, and energy efficiency, the company targets the fast-growing residential renovation market driven by tightening climate regulations.",
  website: "https://www.checkdpe.fr"
}, 
{
  company: "AI Verse",
  description: "AI Verse is a deeptech company specializing in the generation of high-fidelity synthetic datasets for training computer vision models. Its proprietary platform procedurally creates fully annotated, photorealistic image datasets with pixel-level precision, enabling AI development in environments where real-world data is scarce, costly, or impossible to collect.",
  hq: "Biot",
  round: "Seed",
  amount: 5,
  month: "January",
  year: 2026,
  sectors: ["AI & Machine Learning"],
  investors: [
    "Supernova Invest",
    "Creazur",
    "Innovacom",
    "Bpifrance"
  ],
  founders: [
    { name: "Benoît Morisset" },
    { name: "Arnauld Lamorlette" }
  ],
  news_url: "",
  news_summary: "AI Verse raised €5M to support its next phase of growth, strengthening technical, product, and commercial teams while accelerating platform deployment and international expansion. The company targets mission-critical AI use cases across defence, robotics, industrial inspection, smart cities, and autonomous systems.",
  website: "https://www.aiverse.ai"
}, 
{
  company: "Obside",
  description: "Obside is a fintech platform that democratizes algorithmic trading by allowing users to create and execute automated trading strategies using natural language. Through a multi-agent AI system, the platform translates plain-language instructions into executable trading logic across stocks, forex, and crypto, removing the need for coding or complex configuration.",
  hq: "Laval",
  round: "Seed",
  amount: 0.5,
  month: "January",
  year: 2026,
  sectors: ["Fintech", "AI & Machine Learning"],
  investors: [
    "Business Angels"
  ],
  founders: [
    { name: "Thibaud Sultan" },
    { name: "Benjamin Sultan" },
    { name: "Florent Poux" }
  ],
  news_url: "",
  news_summary: "Obside raised €500K from private investors, bringing total seed funding to €515K and valuing the company at €2.5M. The funding will be used to expand the engineering team and accelerate international growth as Obside positions itself as a natural-language-driven trading automation platform accessible beyond professional trading desks.",
  website: "https://www.obside.ai"
}
];
// =============================================
// SECTOR UTILITIES
// =============================================

const SECTOR_COLORS = {
    'AI & Machine Learning': '#8b5cf6',
    'SaaS & Enterprise': '#3b82f6',
    'FinTech': '#eab308',
    'HealthTech': '#10b981',
    'HealthTech & BioTech': '#10b981',
    'CleanTech & Energy': '#84cc16',
    'Cybersecurity': '#f43f5e',
    'E-commerce & Retail': '#f59e0b',
    'FoodTech & AgriTech': '#22c55e',
    'AgriTech & FoodTech': '#22c55e',
    'PropTech & Real Estate': '#06b6d4',
    'EdTech': '#14b8a6',
    'Mobility & Logistics': '#3b82f6',
    'Mobility & Transportation': '#3b82f6',
    'DeepTech & Hardware': '#6366f1',
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
