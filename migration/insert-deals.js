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
  company: "Aviwell",
  description: "Aviwell is a deep-tech animal nutrition company developing AI-driven, microbiome-based solutions to improve animal health, growth, and resilience. Built on decades of microbiome research, the company leverages its proprietary Aneto™ platform to design native bacterial ecologies with defined modes of action, enabling antibiotic-free, sustainable nutrition for poultry and aquaculture.",
  hq: "Toulouse",
  round: "Series A",
  amount: 11,
  month: "January",
  year: 2026,
  sectors: ["AgriTech", "FoodTech", "HealthTech", "BioTech", "AI & Machine Learning"],
  investors: ["Blue Revolution Fund", "Blast.Club", "SWEN Capital Partners", "Elaia", "MFS Investment Management"],
  founders: [
    { name: "Rémy Burcelin" },
    { name: "Mouli Ramani" }
  ],
  news_url: "https://www.linkedin.com/posts/aviwell_aviwell-welcomes-brf-blast-and-swen-to-our-activity-7420485842999164928-55SB?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAE0kG8BObj6r7nc5sfWRNVZaz22BQG3gmI",
  news_summary: "Aviwell closed an €11M Series A led by Blue Revolution Fund to scale its AI-powered Aneto™ microbiome discovery platform and advance nature-based biological solutions for antibiotic-free animal nutrition, supporting validation and industrial scale-up for poultry and aquaculture.",
  website: "https://www.aviwell.fr/?ref=frenchtechjournal.com"
},

{
  company: "Twin",
  description: "Twin is an AI platform that lets non-technical users build fully autonomous agents capable of running entire businesses end-to-end — from planning and decision-making to execution. Using browser control, self-correction, long-term memory, and a hybrid model stack, Twin enables complex operational workflows to be created in minutes without writing code.",
  hq: "Paris",
  round: "Seed",
  amount: 8.4,
  month: "January",
  year: 2026,
  sectors: ["AI & Machine Learning"],
  investors: ["LocalGlobe", "Kima Ventures", "betaworks", "Irregular Expressions", "Motier Ventures", "Andrena Ventures", "Drysdale Ventures"],
  founders: [
    { name: "Hugo Mercier" },
    { name: "João Justi" }
  ],
  news_url: "https://www.linkedin.com/posts/hugomercier_what-a-ride-after-2-months-of-beta-and-activity-7422211846599880704-9SSI?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAE0kG8BObj6r7nc5sfWRNVZaz22BQG3gmI",
  news_summary: "Twin publicly launched on January 27 after a one-month beta in which users deployed 100,000+ autonomous agents, and announced a $10M seed round led by LocalGlobe to build an “AI company builder” enabling self-sufficient AI-run businesses.",
  website: "https://builder.twin.so/?ref=frenchtechjournal.com"
},

{
  company: "Atlas V Group",
  description: "Atlas V is a European leader in VR and immersive content, known for premium narrative experiences developed with top-tier creative talent and global entertainment IPs. The studio is diversifying into free-to-play immersive gaming and location-based VR, building a vertically integrated model spanning creation, production, and publishing of scalable XR experiences.",
  hq: "Paris",
  round: "Series A",
  amount: 5,
  month: "January",
  year: 2026,
  sectors: ["Gaming"],
  investors: ["HTC"],
  founders: [
    { name: "Antoine Cayrol" },
    { name: "Arnaud Colinart" }
  ],
  news_url: "https://variety.com/2026/digital/global/atlas-v-raise-6-million-diversify-gaming-location-based-vr-1236642469/?ref=frenchtechjournal.com",
  news_summary: "Atlas V raised €5M led by strategic investor HTC to accelerate diversification into social and casual free-to-play VR gaming and location-based immersive experiences, leveraging its premium XR track record and HTC’s ecosystem to scale distribution.",
  website: "https://atlasv.io/?ref=frenchtechjournal.com"
},

{
  company: "Recupere Metals",
  description: "Recupere Metals is a French industrial startup developing a patented mechanical process to transform copper waste directly into high-performance copper wires without melting or refining, offering a low-carbon alternative for industrial copper supply.",
  hq: "Paris",
  round: "Seed",
  amount: 5,
  month: "January",
  year: 2026,
  sectors: ["DeepTech", "Hardware", "CleanTech", "Energy"],
  investors: ["SistaFund", "Endgame Capital", "Ring Capital", "Triple Impact Ventures", "Business Angels", "Sake Bosch"],
  founders: [
    { name: "Katie Marsh" },
    { name: "Julien Vaïssette" }
  ],
  news_url: "https://www.maddyness.com/2026/01/30/face-a-une-demande-de-cuivre-qui-explose-recupere-metals-leve-5-millions-deuros/?ref=frenchtechjournal.com",
  news_summary: "Founded in March 2025, Recupere Metals raised €5M to move from R&D to industrial production and scale manufacturing capacity for its low-carbon copper wire process, targeting applications in electric motors, data centers, and digital infrastructure.",
  website: "https://www.recupere-metals.com/?ref=frenchtechjournal.com"
},

{
  company: "AYAQ",
  description: "AYAQ is a French technical apparel brand focused on high-performance outdoor clothing, built on field-tested functionality, durability, and a long-term product vision. Founded by Olympic gold medalist Vincent Defrasne, AYAQ combines elite performance standards with premium positioning.",
  hq: "Paris",
  round: "Growth",
  amount: 3.2,
  month: "January",
  year: 2026,
  sectors: ["E-commerce & Retail"],
  investors: ["Mike Horn"],
  founders: [
    { name: "Vincent Defrasne" }
  ],
  news_url: "https://www.sporteco.com/une-augmentation-de-capital-chez-ayaq/?ref=frenchtechjournal.com",
  news_summary: "AYAQ raised €3.2M in equity (plus non-dilutive financing) to accelerate international expansion and its product roadmap, welcoming explorer Mike Horn as a shareholder while management retains majority ownership; the brand entered Japan in September 2025 and is preparing broader rollout.",
  website: "https://ayaq.com/?ref=frenchtechjournal.com"
},

{
  company: "GoCanopy",
  description: "GoCanopy is an AI-native operating system for institutional real estate investors, transforming fragmented internal data into compounding institutional intelligence via human-in-the-loop agentic workflows that ingest unstructured documents into a single system of record.",
  hq: "Paris",
  round: "Seed",
  amount: 2.1,
  month: "January",
  year: 2026,
  sectors: ["PropTech & Real Estate", "AI & Machine Learning"],
  investors: ["ISAI", "BNP Paribas Développement", "Yellow", "Andrew Baum", "Ludovic Jacquot"],
  founders: [
    { name: "William He" },
    { name: "Yash Pabbisetti" }
  ],
  news_url: "https://www.eu-startups.com/2026/01/gocanopy-ends-bootstrapping-streak-and-raises-e2-1-million-to-build-ai-operating-system-for-institutional-real-estate-investors/?ref=frenchtechjournal.com",
  news_summary: "GoCanopy raised €2.1M in seed funding to build an AI operating system for institutional real estate investors, expanding enterprise-grade product development and international growth across Paris and London; users include major asset managers such as Brookfield and certain Apollo-managed funds.",
  website: "https://www.gocanopy.tech/?ref=frenchtechjournal.com"
},

{
  company: "Radiant",
  description: "Radiant is an industrial climate tech startup developing high-temperature solar thermal solutions to decarbonise industrial heat, combining next-generation heliostats, a proprietary receiver, and thermal energy storage to replace fossil-fuel-based equipment.",
  hq: "Massy",
  round: "Seed",
  amount: 2,
  month: "January",
  year: 2026,
  sectors: ["Energy", "CleanTech"],
  investors: ["Tiresias Angels", "Selim Cherif", "Business Angels", "Hexa"],
  founders: [
    { name: "Thomas Delhon" },
    { name: "Alexandre Meurisse" }
  ],
  news_url: "https://tech.eu/2026/01/27/radiant-joins-hexas-carbon-zero-programme-and-raises-eur2m-to-decarbonise-industrial-heat/?ref=frenchtechjournal.com",
  news_summary: "Selected for Hexa’s Carbon Zero program, Radiant closed a €2M round to industrialize its solar thermal technology and finance a first industrial demonstrator in Le Mans, targeting 200°C–1,000°C heat for sectors such as cement, glass, and asphalt.",
  website: "https://www.radiant-energy.eu/?ref=frenchtechjournal.com"
},

{
  company: "Evolutive Agronomy",
  description: "Evolutive Agronomy develops biological crop protection solutions that are high-performance and easy to deploy, focusing on soil pests and beneficial organisms to reduce reliance on chemical inputs while improving agronomic outcomes.",
  hq: "Sophia Antipolis",
  round: "Pre-Seed",
  amount: 1.8,
  month: "January",
  year: 2026,
  sectors: ["AgriTech", "BioTech"],
  investors: ["50 Partners", "Business Angels"],
  founders: [
    { name: "Antoine Pasquier" },
    { name: "Lucie Monticelli" }
  ],
  news_url: "https://www.nicematin.com/economie/avec-ses-acariens-predateurs-cette-starup-azureenne-a-un-plan-sans-pesticide-pour-aider-les-agriculteurs-a-lutter-contre-les-ravageurs-des-sols-10664758?ref=frenchtechjournal.com",
  news_summary: "Evolutive Agronomy raised €1.8M to accelerate field deployment of ByeNematode®, a biological solution based on predatory mites targeting root-knot nematodes, while scaling production and continuing farm-aligned R&D.",
  website: "https://evolutiveagronomy.com/solution-bye-nematode/?ref=frenchtechjournal.com"
},

{
  company: "Dowgo",
  description: "Dowgo is a French fintech building blockchain-based investment infrastructure to finance private impact assets, connecting professional and institutional investors with project developers across the investment lifecycle from issuance to secondary trading.",
  hq: "Paris",
  round: "Seed",
  amount: 2,
  month: "January",
  year: 2026,
  sectors: ["FinTech", "Web3"],
  investors: ["Bpifrance", "50 Partners", "Cube Accelerator", "Emmanuel Picot", "Damien Guermonprez"],
  founders: [
    { name: "Oscar Dumant" },
    { name: "Romain Menetrier" }
  ],
  news_url: "https://finyear.com/dowgo-leve-2-millions-deuros?ref=frenchtechjournal.com",
  news_summary: "Dowgo announced a €2M seed round to finalize deployment of its regulated-grade blockchain platform for impact private assets, including primary issuance and a secondary market for liquidity; its regulatory application is under review by French authorities under the EU Pilot Regime framework.",
  website: "https://www.dowgo.com/en?ref=frenchtechjournal.com"
},

{
  company: "ATOBA Energy",
  description: "ATOBA Energy is a midstream Sustainable Aviation Fuel aggregator designed to unlock industrial-scale growth of SAF by resolving the financial deadlock between airlines and producers through aggregated offtake portfolios and optimized pricing indexes.",
  hq: "Lyon",
  round: "Pre-Seed",
  amount: 1.265,
  month: "January",
  year: 2026,
  sectors: ["ClimateTech", "SpaceTech & Aerospace"],
  investors: ["Undisclosed"],
  founders: [
    { name: "Arnaud Namer" }
  ],
  news_url: "https://atoba.energy/blog/atoba-raises-1.5m-pre-seed-round-to-unlock-scaling-of-sustainable-aviation-fuel?ref=frenchtechjournal.com",
  news_summary: "ATOBA Energy raised an oversubscribed $1.5M pre-seed to scale its SAF aggregation platform and expand offtake agreements with producers, airlines, and resellers, enabling bankable long-term SAF contracts to accelerate industrial deployment.",
  website: "https://www.atoba.energy/?ref=frenchtechjournal.com"
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
