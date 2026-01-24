/**
 * French Tech Funding Tracker - JSON to Supabase Migration
 *
 * This script migrates the funding-data.json file to a normalized
 * Supabase PostgreSQL database.
 *
 * Usage:
 *   1. Set environment variables SUPABASE_URL and SUPABASE_SERVICE_KEY
 *   2. Run: node migrate.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// =============================================
// CONFIGURATION
// =============================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Use service key for migrations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Error: Missing environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY');
    console.error('');
    console.error('Example:');
    console.error('  export SUPABASE_URL="https://your-project.supabase.co"');
    console.error('  export SUPABASE_SERVICE_KEY="your-service-role-key"');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Parse founders string into array of {name, linkedin_url}
 * Format: "Name One (https://linkedin.com/in/name1), Name Two (https://linkedin.com/in/name2)"
 * Or: "Name One, Name Two" (no LinkedIn)
 * Or: "Name One" (single founder)
 */
function parseFounders(foundersString) {
    if (!foundersString || foundersString.trim() === '') {
        return [];
    }

    const founders = [];

    // Split by comma, but be careful of commas inside parentheses
    // Use regex to split on comma followed by space and a capital letter (new name)
    const parts = foundersString.split(/,\s*(?=[A-Z])/);

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // Check if there's a LinkedIn URL in parentheses
        const linkedinMatch = trimmed.match(/^(.+?)\s*\(?(https?:\/\/[^\s)]+)\)?$/);

        if (linkedinMatch) {
            founders.push({
                full_name: linkedinMatch[1].trim(),
                linkedin_url: linkedinMatch[2].trim()
            });
        } else {
            // No LinkedIn URL, just the name
            // Remove any trailing parentheses or incomplete URLs
            const cleanName = trimmed.replace(/\s*\([^)]*$/, '').trim();
            if (cleanName) {
                founders.push({
                    full_name: cleanName,
                    linkedin_url: null
                });
            }
        }
    }

    return founders;
}

/**
 * Parse investors string into array of investor names
 * Format: "Investor One, Investor Two, Investor Three"
 */
function parseInvestors(investorsString) {
    if (!investorsString || investorsString.trim() === '') {
        return [];
    }

    return investorsString
        .split(',')
        .map(inv => inv.trim())
        .filter(inv => inv.length > 0);
}

/**
 * Generate a URL-friendly slug from a string
 */
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[&]/g, '-and-')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Get sector color based on name
 */
function getSectorColor(sectorName) {
    const colorMap = {
        'AI & Machine Learning': '#8b5cf6',
        'SaaS & Enterprise': '#3b82f6',
        'FinTech': '#eab308',
        'HealthTech': '#10b981',
        'CleanTech & Energy': '#84cc16',
        'Cybersecurity': '#f43f5e',
        'E-commerce & Retail': '#f59e0b',
        'FoodTech & AgriTech': '#22c55e',
        'PropTech & Real Estate': '#06b6d4',
        'EdTech': '#14b8a6',
        'Mobility & Logistics': '#3b82f6',
        'DeepTech & Hardware': '#6366f1',
        'Media & Entertainment': '#ec4899',
        'BioTech & Pharma': '#10b981',
        'HRTech': '#8b5cf6',
        'LegalTech': '#64748b',
        'SpaceTech': '#1e3a8a',
        'Gaming': '#a855f7',
        'InsurTech': '#0ea5e9',
        'MarTech': '#f97316'
    };
    return colorMap[sectorName] || '#64748b';
}

// =============================================
// CACHES (to avoid duplicate inserts)
// =============================================

const sectorCache = new Map();     // name -> id
const investorCache = new Map();   // name -> id
const personCache = new Map();     // name+linkedin -> id
const cityCache = new Map();       // name -> id
const companyCache = new Map();    // name -> id

// =============================================
// DATABASE INSERT FUNCTIONS
// =============================================

async function insertCity(cityName) {
    if (!cityName) return null;

    const cacheKey = cityName.toLowerCase();
    if (cityCache.has(cacheKey)) {
        return cityCache.get(cacheKey);
    }

    const { data, error } = await supabase
        .from('cities')
        .upsert({ name: cityName, country: 'France' }, { onConflict: 'name,country' })
        .select('id')
        .single();

    if (error) {
        console.error(`Error inserting city "${cityName}":`, error.message);
        return null;
    }

    cityCache.set(cacheKey, data.id);
    return data.id;
}

async function insertSector(sectorName) {
    if (!sectorName) return null;

    const cacheKey = sectorName.toLowerCase();
    if (sectorCache.has(cacheKey)) {
        return sectorCache.get(cacheKey);
    }

    const slug = slugify(sectorName);
    const color = getSectorColor(sectorName);

    const { data, error } = await supabase
        .from('sectors')
        .upsert({ name: sectorName, slug, color }, { onConflict: 'name' })
        .select('id')
        .single();

    if (error) {
        console.error(`Error inserting sector "${sectorName}":`, error.message);
        return null;
    }

    sectorCache.set(cacheKey, data.id);
    return data.id;
}

async function insertInvestor(investorName) {
    if (!investorName) return null;

    const cacheKey = investorName.toLowerCase();
    if (investorCache.has(cacheKey)) {
        return investorCache.get(cacheKey);
    }

    const { data, error } = await supabase
        .from('investors')
        .upsert({ name: investorName }, { onConflict: 'name' })
        .select('id')
        .single();

    if (error) {
        console.error(`Error inserting investor "${investorName}":`, error.message);
        return null;
    }

    investorCache.set(cacheKey, data.id);
    return data.id;
}

async function insertPerson(person) {
    if (!person || !person.full_name) return null;

    // Use name + linkedin as cache key to handle same name, different people
    const cacheKey = `${person.full_name.toLowerCase()}|${person.linkedin_url || ''}`;
    if (personCache.has(cacheKey)) {
        return personCache.get(cacheKey);
    }

    // For people, we don't upsert because same name might be different people
    // Instead, check if exact match exists
    const { data: existing } = await supabase
        .from('people')
        .select('id')
        .eq('full_name', person.full_name)
        .eq('linkedin_url', person.linkedin_url)
        .maybeSingle();

    if (existing) {
        personCache.set(cacheKey, existing.id);
        return existing.id;
    }

    const { data, error } = await supabase
        .from('people')
        .insert({
            full_name: person.full_name,
            linkedin_url: person.linkedin_url
        })
        .select('id')
        .single();

    if (error) {
        console.error(`Error inserting person "${person.full_name}":`, error.message);
        return null;
    }

    personCache.set(cacheKey, data.id);
    return data.id;
}

async function insertCompany(companyData, cityId) {
    const { data, error } = await supabase
        .from('companies')
        .insert({
            name: companyData.company,
            description: companyData.description,
            website: companyData.website,
            hq_city_id: cityId,
            hq_city_name: companyData.hq
        })
        .select('id')
        .single();

    if (error) {
        console.error(`Error inserting company "${companyData.company}":`, error.message);
        return null;
    }

    return data.id;
}

async function insertFundingRound(companyId, companyData) {
    const { data, error } = await supabase
        .from('funding_rounds')
        .insert({
            company_id: companyId,
            round_type: companyData.round,
            amount_eur: companyData.amount,
            announced_month: companyData.month,
            announced_year: 2025,
            news_url: companyData.news,
            source: 'ftj'
        })
        .select('id')
        .single();

    if (error) {
        console.error(`Error inserting funding round for "${companyData.company}":`, error.message);
        return null;
    }

    return data.id;
}

async function linkCompanySector(companyId, sectorId, isPrimary = false) {
    const { error } = await supabase
        .from('company_sectors')
        .upsert({
            company_id: companyId,
            sector_id: sectorId,
            is_primary: isPrimary
        }, { onConflict: 'company_id,sector_id' });

    if (error) {
        console.error('Error linking company to sector:', error.message);
    }
}

async function linkCompanyPerson(companyId, personId, role = 'founder') {
    const { error } = await supabase
        .from('company_people')
        .upsert({
            company_id: companyId,
            person_id: personId,
            role: role
        }, { onConflict: 'company_id,person_id,role' });

    if (error) {
        console.error('Error linking company to person:', error.message);
    }
}

async function linkFundingInvestor(fundingRoundId, investorId, isLead = false) {
    const { error } = await supabase
        .from('funding_round_investors')
        .upsert({
            funding_round_id: fundingRoundId,
            investor_id: investorId,
            is_lead: isLead
        }, { onConflict: 'funding_round_id,investor_id' });

    if (error) {
        console.error('Error linking funding round to investor:', error.message);
    }
}

// =============================================
// MAIN MIGRATION FUNCTION
// =============================================

async function migrate() {
    console.log('=============================================');
    console.log('French Tech Funding - JSON to Supabase Migration');
    console.log('=============================================\n');

    // Load JSON data
    const jsonPath = path.join(__dirname, '..', 'funding-data.json');

    if (!fs.existsSync(jsonPath)) {
        console.error(`Error: Could not find ${jsonPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const companies = JSON.parse(rawData);

    console.log(`Loaded ${companies.length} companies from JSON\n`);

    // Stats
    const stats = {
        companies: 0,
        fundingRounds: 0,
        sectors: 0,
        investors: 0,
        people: 0,
        cities: 0,
        errors: 0
    };

    // Process each company
    for (let i = 0; i < companies.length; i++) {
        const companyData = companies[i];
        const progress = `[${i + 1}/${companies.length}]`;

        try {
            console.log(`${progress} Processing: ${companyData.company}`);

            // 1. Insert city
            const cityId = await insertCity(companyData.hq);
            if (cityId && !cityCache.has(companyData.hq?.toLowerCase())) {
                stats.cities++;
            }

            // 2. Insert company
            const companyId = await insertCompany(companyData, cityId);
            if (!companyId) {
                stats.errors++;
                continue;
            }
            stats.companies++;

            // 3. Insert funding round
            const fundingRoundId = await insertFundingRound(companyId, companyData);
            if (fundingRoundId) {
                stats.fundingRounds++;
            }

            // 4. Process sectors
            const sectors = companyData.sectors || [];
            for (let j = 0; j < sectors.length; j++) {
                const sectorName = sectors[j];
                const sectorId = await insertSector(sectorName);
                if (sectorId) {
                    await linkCompanySector(companyId, sectorId, j === 0);
                    if (!sectorCache.has(sectorName.toLowerCase())) {
                        stats.sectors++;
                    }
                }
            }

            // 5. Process founders
            const founders = parseFounders(companyData.founders);
            for (const founder of founders) {
                const personId = await insertPerson(founder);
                if (personId) {
                    await linkCompanyPerson(companyId, personId, 'founder');
                    stats.people++;
                }
            }

            // 6. Process investors
            if (fundingRoundId) {
                const investorNames = parseInvestors(companyData.investors);
                for (let j = 0; j < investorNames.length; j++) {
                    const investorId = await insertInvestor(investorNames[j]);
                    if (investorId) {
                        // First investor is often the lead
                        await linkFundingInvestor(fundingRoundId, investorId, j === 0);
                        if (!investorCache.has(investorNames[j].toLowerCase())) {
                            stats.investors++;
                        }
                    }
                }
            }

        } catch (err) {
            console.error(`${progress} Error processing ${companyData.company}:`, err.message);
            stats.errors++;
        }
    }

    // Print summary
    console.log('\n=============================================');
    console.log('MIGRATION COMPLETE');
    console.log('=============================================');
    console.log(`Companies:      ${stats.companies}`);
    console.log(`Funding Rounds: ${stats.fundingRounds}`);
    console.log(`Sectors:        ${sectorCache.size}`);
    console.log(`Investors:      ${investorCache.size}`);
    console.log(`People:         ${personCache.size}`);
    console.log(`Cities:         ${cityCache.size}`);
    console.log(`Errors:         ${stats.errors}`);
    console.log('=============================================\n');

    if (stats.errors > 0) {
        console.log('Some errors occurred during migration. Please review the logs above.');
    } else {
        console.log('Migration completed successfully!');
    }
}

// =============================================
// RUN MIGRATION
// =============================================

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
