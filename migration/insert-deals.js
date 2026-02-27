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
    "company": "newcleo",
    "month": "February",
    "year": 2026,
    "sectors": ["Energy", "CleanTech"],
    "description": "European developer of advanced nuclear technologies focused on lead-cooled fast reactors (LFRs) powered by fuel derived from recycled nuclear waste.",
    "website_url": "https://www.newcleo.com",
    "hq": "Paris",
    "round": "Series B",
    "amount_raised_eur": 75.0,
    "investors": ["Kairos", "Indaco Ventures", "Azimut Investments", "CERN Pension Fund", "Walter Tosto", "Danieli & C.", "Cementir Holding", "Orion Valves", "NextChem", "Family Offices"],
    "founders": [{ "name": "Stefano Buono" }],
    "news_summary": "newcleo closed a €75M financing round, bringing capital raised over the past 12 months to more than €105M and total funding since 2021 to €645M. Proceeds support R&D infrastructure in Europe (including PRECURSOR) and expansion in the US.",
    "news_source": ["Marketscreener", "PR"],
    "news_url": ["https://www.marketscreener.com", null]
  },
  {
    "company": "Hublo",
    "month": "February",
    "year": 2026,
    "sectors": ["HealthTech", "SaaS & Enterprise"],
    "description": "Workforce management SaaS platform for healthcare institutions covering recruitment, scheduling, internal mobility, and communication.",
    "website_url": "https://www.hublo.com",
    "hq": "Paris",
    "round": "Growth",
    "amount_raised_eur": 40.0,
    "investors": ["Revaia"],
    "founders": [{ "name": "Antoine Loron" }],
    "news_summary": "Revaia committed €40M via a reinvestment vehicle to continue supporting Hublo following its 2025 sale to Five Arrows. Hublo is used by 22,000+ managers across 5,000+ healthcare facilities.",
    "news_source": ["EU Startups"],
    "news_url": ["https://www.eu-startups.com"]
  },
  {
    "company": "MyC",
    "month": "February",
    "year": 2026,
    "sectors": ["HealthTech", "SaaS & Enterprise"],
    "description": "B2B SaaS platform for managing employee health in industrial and multi-site environments, centralizing medical data for compliance and coordination.",
    "website_url": "https://www.myc.ai",
    "hq": "Paris",
    "round": "Series A",
    "amount_raised_eur": 10.0,
    "investors": ["Hi Inov", "IXO", "Elaia", "OSS Ventures"],
    "founders": [{ "name": "Laurent Bonnardot" }, { "name": "Benjamin Crevant" }],
    "news_summary": "MyC raised €10M to accelerate product development (including AI-driven analysis and automation) and scale its international commercial footprint.",
    "news_source": ["Tech.eu"],
    "news_url": ["https://tech.eu"]
  },
  {
    "company": "Apmonia Therapeutics",
    "month": "February",
    "year": 2026,
    "sectors": ["BioTech"],
    "description": "Clinical-stage biotech developing targeted cancer therapies by addressing the extracellular matrix (ECM) in solid tumors.",
    "website_url": "https://www.apmonia-therapeutics.com",
    "hq": "Reims",
    "round": "Series A",
    "amount_raised_eur": 10.0,
    "investors": ["Capital Grand Est", "Finovam Gestion", "Fondation Fournier-Majoie", "Angels Santé", "Capital Cell"],
    "founders": [{ "name": "Albin Jeanne" }],
    "news_summary": "Apmonia raised €10M to advance lead asset TAX2 into first-in-human clinical development and finance a Phase I trial in France and Belgium.",
    "news_source": ["Journal des Entreprises"],
    "news_url": ["https://www.lejournaldesentreprises.com"]
  },
  {
    "company": "Linkup",
    "month": "February",
    "year": 2026,
    "sectors": ["AI & Machine Learning"],
    "description": "API-first real-time search infrastructure for AI models and autonomous agents, creating an AI-native index optimized for machine consumption.",
    "website_url": "https://www.linkup.so",
    "hq": "Paris",
    "round": "Seed",
    "amount_raised_eur": 10.0,
    "investors": ["Gradient", "Elaia", "Leblon Capital", "Weekend Fund", "Seedcamp", "Axeleo Capital", "OPRTRS Club", "Motier Ventures", "Business Angels", "Arthur Mensch", "Florian Douetteau", "Olivier Pomel"],
    "founders": [{ "name": "Philippe Mizrahi" }, { "name": "Boris Toledano" }, { "name": "Denis Charrier" }],
    "news_summary": "After a €3M seed round (Nov 2024), Linkup raised an additional $10M to scale its teams across Paris, New York, and San Francisco and expand partnerships with trusted media publishers.",
    "news_source": ["Maddyness", "Linkup"],
    "news_url": ["https://www.maddyness.com", "https://www.linkup.so"]
  },
  {
    "company": "UBEES",
    "month": "February",
    "year": 2026,
    "sectors": ["AgriTech"],
    "description": "Regenerative pollination provider combining professional apiculture, connected beehives with sensors, agronomic data, and on-the-ground support.",
    "website_url": "https://www.ubees.com",
    "hq": "Paris",
    "round": "Series A",
    "amount_raised_eur": 8,
    "investors": ["Starquest", "Capagro", "Newtree Impact"],
    "founders": [{ "name": "Louis Delelis-Fanien" }],
    "news_summary": "UBEES raised €8M Series A to accelerate international expansion (Latin America and Africa), develop connected hive technologies, and strengthen impact measurement capabilities.",
    "news_source": ["Les Echos"],
    "news_url": ["https://www.lesechos.fr"]
  },
  {
    "company": "Bobine",
    "month": "February",
    "year": 2026,
    "sectors": ["CleanTech"],
    "description": "Industrial cleantech developing electricity-based chemical recycling for non-recyclable plastics using heterogeneous catalysis and electromagnetic induction.",
    "website_url": "https://www.bobine.tech",
    "hq": "Lyon",
    "round": "Series A",
    "amount_raised_eur": 7.5,
    "investors": ["Axeleo Capital", "UI Investissement", "Angelor", "CA Création", "CACF Capital Innovation", "C.A.V.", "Quest Investment"],
    "founders": [{ "name": "Vincent Simonneau" }],
    "news_summary": "Bobine raised €13M total including €7.5M equity to industrialize its chemical recycling process, with a pilot at Michelin’s materials center and plans to scale to a 1-ton/day demonstrator.",
    "news_source": ["Les Echos"],
    "news_url": ["https://www.lesechos.fr"]
  },
  {
    "company": "Dionymer",
    "month": "February",
    "year": 2026,
    "sectors": ["CleanTech", "BioTech"],
    "description": "Industrial biotech converting food waste into bio-based polymers (PHA) via sugar extraction and bacterial fermentation.",
    "website_url": "https://www.dionymer.com",
    "hq": "Pessac",
    "round": "Series A",
    "amount_raised_eur": 7.0,
    "investors": ["UI Investissement", "BNP Paribas Développement", "Bpifrance", "Naco", "Irdi", "Aquiti", "AFI Ventures", "Resilience"],
    "founders": [{ "name": "Thomas Hennebel" }, { "name": "Guillaume Charbonnier" }, { "name": "Antoine Brege" }],
    "news_summary": "Dionymer raised €7M to finance a 100-ton/year industrial demonstrator planned for 2026, expand commercial traction into plastics and textiles, and prepare for a larger factory by 2030.",
    "news_source": ["Les Echos"],
    "news_url": ["https://www.lesechos.fr"]
  },
  {
    "company": "Geolinks Services",
    "month": "February",
    "year": 2026,
    "sectors": ["DeepTech", "Energy"],
    "description": "Passive seismic subsurface monitoring and dynamic modeling solution (FlowTerra™) for mining, CO₂ storage, natural hydrogen, and geothermal applications.",
    "website_url": "https://www.geolinks-services.com",
    "hq": "Paris",
    "round": "Seed",
    "amount_raised_eur": 3.4,
    "investors": ["Calderion", "Bpifrance", "BRGM Invest", "InnoEnergy"],
    "founders": [{ "name": "Jean-Charles Ferran" }],
    "news_summary": "Raised funding to support commercial launch of FlowTerra™ in 2026 and strengthen AI/geoscience/modeling teams; also mentions €2.6M additional financing for €6M total support.",
    "news_source": ["Bpifrance", "LinkedIn"],
    "news_url": ["https://www.bpifrance.fr", "https://www.linkedin.com"]
  },
  {
    "company": "DermaScan",
    "month": "February",
    "year": 2026,
    "sectors": ["MedTech", "AI & Machine Learning"],
    "description": "Healthtech building specialized early-stage skin cancer screening centers combining advanced imaging, AI, and optimized workflows.",
    "website_url": "https://www.dermascan.fr",
    "hq": "Paris",
    "round": "Seed",
    "amount_raised_eur": 2.5,
    "investors": ["Ring Capital", "Techmind", "Kima Ventures", "199 Ventures", "Hexa", "Business Angels", "Céline Lazorthes", "Jean-Charles Samuelian"],
    "founders": [{ "name": "Florian Legris" }, { "name": "Hadrien Lepage" }],
    "news_summary": "DermaScan raised €2.5M after opening two Paris screening centers, with plans to expand to major French cities.",
    "news_source": ["Maddyness"],
    "news_url": ["https://www.maddyness.com"]
  },
  {
    "company": "Entent",
    "month": "February",
    "year": 2026,
    "sectors": ["CleanTech", "DeepTech", "Industrial Decarbonization", "Energy Hardware"],
    "description": "Heat-to-power solution converting low-temperature industrial waste heat (from ~60°C) into electricity using a thermo-acoustic cycle.",
    "website_url": "https://www.entent.io",
    "hq": "Aix-en-Provence",
    "round": "Seed",
    "amount_raised_eur": 2.4,
    "investors": ["Team For The Planet", "CAAP Création", "Sowefund"],
    "founders": [{ "name": "Mathias Fonlupt" }],
    "news_summary": "Entent raised €2.4M to launch first commercial deployments of its Pulse machines, including an installation at a Michelin site starting in Q1 2026.",
    "news_source": ["Mesinfos"],
    "news_url": ["https://www.mesinfos.fr"]
  },
  {
    "company": "PRESAGE",
    "month": "February",
    "year": 2026,
    "sectors": ["AI & Machine Learning"],
    "description": "AI-driven world models that simulate cloud infrastructure causality to enable predictive operations and reduce incident risk.",
    "website_url": "https://www.presage.ai",
    "hq": "Paris",
    "round": "Seed",
    "amount_raised_eur": 1.2,
    "investors": ["welovefounders", "Kima Ventures", "Boost10x"],
    "founders": [{ "name": "Arthur Chevalier" }, { "name": "Annah Augier" }, { "name": "Hamza Aassif" }],
    "news_summary": "PRESAGE raised €1.2M to accelerate product development and initiate first deployments of its AI world models for cloud infrastructure teams.",
    "news_source": ["LinkedIn"],
    "news_url": ["https://www.linkedin.com"]
  },
  {
    "company": "Sailiz",
    "month": "February",
    "year": 2026,
    "sectors": ["E-commerce & Retail"],
    "description": "Women-focused technical nautical apparel brand emphasizing recyclable, PFC-free mono-material garments and repairability.",
    "website_url": "https://www.sailiz.com",
    "hq": "Lorient",
    "round": "Pre-Seed",
    "amount_raised_eur": 0.2,
    "investors": ["Bretagne Sud Angels", "Michel Le Bars", "Philippe Guidoux", "Business Angels"],
    "founders": [{ "name": "Solène Saclier" }],
    "news_summary": "Sailiz raised €200K (two tranches: €150K closed, €50K open) to expand product development, hire a textile engineer, and expand in Europe.",
    "news_source": ["Boat Industry", "LinkedIn"],
    "news_url": ["https://www.boatindustry.fr", "https://www.linkedin.com"]
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
