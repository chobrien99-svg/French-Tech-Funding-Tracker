/**
 * French Tech Funding Tracker - SIREN/SIRET Matching Script
 *
 * Matches companies in the database with their official French SIREN/SIRET
 * numbers using the INSEE Sirene API.
 *
 * Prerequisites:
 *   1. Create an account at https://api.insee.fr/
 *   2. Create an application and subscribe to "API Sirene" (free tier)
 *   3. Copy your API key and set it in environment variables
 *
 * Usage:
 *   export SUPABASE_URL="https://your-project.supabase.co"
 *   export SUPABASE_SERVICE_KEY="your-service-role-key"
 *   export INSEE_API_KEY="your-api-key"
 *   node match-siren.js
 *
 * Options:
 *   --dry-run       Preview matches without updating the database
 *   --limit N       Process only N companies (for testing)
 *   --company NAME  Process only a specific company by name
 *   --force         Re-match companies that already have a SIREN
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// =============================================
// CONFIGURATION
// =============================================

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tlwqkglfyjydwsgjrclx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const INSEE_API_KEY = process.env.INSEE_API_KEY;

// INSEE API endpoint (new portal URL)
const INSEE_SIRENE_URL = 'https://api.insee.fr/api-sirene/3.11/siret';

// Rate limiting: INSEE free tier allows 30 requests/minute
const RATE_LIMIT_DELAY_MS = 2100; // ~28 requests/minute to stay safe

// Match confidence thresholds
const CONFIDENCE = {
    HIGH: 'high',       // Auto-approve: exact name + city match
    MEDIUM: 'medium',   // Review recommended: partial match
    LOW: 'low'          // Manual review required: weak match
};

// Parse CLI arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const CONFIRM = args.includes('--confirm'); // Show results first, then ask to apply
const FORCE = args.includes('--force');
const limitIndex = args.indexOf('--limit');
const LIMIT = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : null;
const companyIndex = args.indexOf('--company');
const SPECIFIC_COMPANY = companyIndex !== -1 ? args[companyIndex + 1] : null;

// =============================================
// VALIDATION
// =============================================

function validateConfig() {
    const errors = [];

    if (!SUPABASE_SERVICE_KEY) {
        errors.push('SUPABASE_SERVICE_KEY environment variable is required');
    }
    if (!INSEE_API_KEY) {
        errors.push('INSEE_API_KEY environment variable is required');
    }

    if (errors.length > 0) {
        console.error('\n  Configuration errors:');
        errors.forEach(e => console.error(`    - ${e}`));
        console.error('\n  See .env.example for setup instructions.\n');
        process.exit(1);
    }
}

// =============================================
// INSEE API CLIENT
// =============================================

/**
 * Search the Sirene API for a company
 * @param {string} companyName - Company name to search
 * @param {string} city - City to filter by (optional)
 * @returns {Promise<Array>} - Array of matching establishments
 */
async function searchSirene(companyName, city = null) {
    // Normalize the company name for search
    const normalizedName = escapeQuery(companyName).toUpperCase();

    // Build search query - quote multi-word names for phrase matching
    // denominationUniteLegale: company legal name
    // libelleCommuneEtablissement: city of establishment
    // etatAdministratifUniteLegale: A = active, C = closed
    let query;
    if (normalizedName.includes(' ')) {
        // Use quoted phrase for multi-word names
        query = `denominationUniteLegale:"${normalizedName}"`;
    } else {
        // Use wildcard for single-word names
        query = `denominationUniteLegale:${normalizedName}*`;
    }

    if (city) {
        const normalizedCity = escapeQuery(city).toUpperCase();
        if (normalizedCity.includes(' ')) {
            query += ` AND libelleCommuneEtablissement:"${normalizedCity}"`;
        } else {
            query += ` AND libelleCommuneEtablissement:${normalizedCity}*`;
        }
    }

    // Only search active companies
    query += ' AND etatAdministratifUniteLegale:A';

    const url = `${INSEE_SIRENE_URL}?q=${encodeURIComponent(query)}&nombre=10`;

    // Debug logging
    if (process.env.DEBUG) {
        console.log(`    DEBUG Query: ${query}`);
        console.log(`    DEBUG URL: ${url}`);
    }

    const response = await fetch(url, {
        headers: {
            'X-INSEE-Api-Key-Integration': INSEE_API_KEY,
            'Accept': 'application/json'
        }
    });

    // Debug logging
    if (process.env.DEBUG) {
        console.log(`    DEBUG Status: ${response.status}`);
    }

    if (response.status === 404) {
        // No results found
        return [];
    }

    if (response.status === 429) {
        throw new Error('Rate limit exceeded - wait and retry');
    }

    if (!response.ok) {
        const text = await response.text();
        if (process.env.DEBUG) {
            console.log(`    DEBUG Error: ${text}`);
        }
        throw new Error(`Sirene search failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    if (process.env.DEBUG) {
        console.log(`    DEBUG Results: ${data.etablissements?.length || 0} found`);
    }
    return data.etablissements || [];
}

/**
 * Escape special characters in search query
 */
function escapeQuery(str) {
    // Escape Lucene special characters and normalize
    return str
        .replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// =============================================
// MATCHING LOGIC
// =============================================

/**
 * Normalize company name for comparison
 */
function normalizeName(name) {
    return name
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^A-Z0-9\s]/g, ' ')     // Remove special chars
        .replace(/\b(SAS|SA|SARL|SASU|SNC|EURL|SCI|GIE)\b/g, '') // Remove legal forms
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Calculate similarity between two strings (0-1)
 */
function similarity(str1, str2) {
    const s1 = normalizeName(str1);
    const s2 = normalizeName(str2);

    if (s1 === s2) return 1.0;

    // Check if one contains the other
    if (s1.includes(s2) || s2.includes(s1)) {
        const shorter = s1.length < s2.length ? s1 : s2;
        const longer = s1.length >= s2.length ? s1 : s2;
        return shorter.length / longer.length;
    }

    // Levenshtein distance-based similarity
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1.0;

    const distance = levenshteinDistance(s1, s2);
    return 1 - (distance / maxLen);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,      // deletion
                dp[i][j - 1] + 1,      // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return dp[m][n];
}

/**
 * Find the best match from search results
 * @param {string} companyName - Name to match
 * @param {string} city - Expected city
 * @param {Array} results - Sirene API results
 * @returns {Object|null} - Best match with confidence score
 */
function findBestMatch(companyName, city, results) {
    if (!results || results.length === 0) {
        return null;
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const etablissement of results) {
        const uniteLegale = etablissement.uniteLegale || {};
        const denominationOfficielle = uniteLegale.denominationUniteLegale || '';
        const sigle = uniteLegale.sigleUniteLegale || '';
        const cityEtab = etablissement.libelleCommuneEtablissement || '';

        // Calculate name similarity
        const nameSim = Math.max(
            similarity(companyName, denominationOfficielle),
            sigle ? similarity(companyName, sigle) : 0
        );

        // Calculate city match bonus
        const cityMatch = city && cityEtab &&
            normalizeName(city) === normalizeName(cityEtab);
        const cityBonus = cityMatch ? 0.2 : 0;

        // Headquarters bonus (etablissementSiege = true)
        const isHQ = etablissement.etablissementSiege === true;
        const hqBonus = isHQ ? 0.1 : 0;

        const totalScore = nameSim + cityBonus + hqBonus;

        if (totalScore > bestScore) {
            bestScore = totalScore;
            bestMatch = {
                siren: etablissement.siren,
                siret: etablissement.siret,
                denominationOfficielle,
                sigle,
                city: cityEtab,
                isHQ,
                nameSimilarity: nameSim,
                cityMatch,
                score: totalScore
            };
        }
    }

    if (!bestMatch) return null;

    // Determine confidence level
    // Perfect name match (>=0.98) is HIGH even without city match
    // (city data in funding tracker may be inaccurate)
    let confidence;
    if (bestMatch.nameSimilarity >= 0.98) {
        confidence = CONFIDENCE.HIGH;
    } else if (bestMatch.nameSimilarity >= 0.95 && bestMatch.cityMatch) {
        confidence = CONFIDENCE.HIGH;
    } else if (bestMatch.nameSimilarity >= 0.8 || (bestMatch.nameSimilarity >= 0.6 && bestMatch.cityMatch)) {
        confidence = CONFIDENCE.MEDIUM;
    } else {
        confidence = CONFIDENCE.LOW;
    }

    return {
        ...bestMatch,
        confidence
    };
}

// =============================================
// DATABASE OPERATIONS
// =============================================

const supabase = SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
}) : null;

/**
 * Fetch companies that need SIREN matching
 */
async function fetchCompaniesToMatch() {
    let query = supabase
        .from('companies')
        .select('id, name, hq_city_name, website, siren, siret')
        .eq('hq_country', 'France')
        .order('name');

    if (!FORCE) {
        query = query.is('siren', null);
    }

    if (SPECIFIC_COMPANY) {
        query = query.ilike('name', `%${SPECIFIC_COMPANY}%`);
    }

    if (LIMIT) {
        query = query.limit(LIMIT);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch companies: ${error.message}`);
    }

    return data || [];
}

/**
 * Update company with SIREN/SIRET data
 */
async function updateCompanySiren(companyId, match) {
    if (DRY_RUN) {
        return true;
    }

    const { error } = await supabase
        .from('companies')
        .update({
            siren: match.siren,
            siret: match.siret,
            updated_at: new Date().toISOString()
        })
        .eq('id', companyId);

    if (error) {
        console.error(`    Failed to update: ${error.message}`);
        return false;
    }

    return true;
}

// =============================================
// MAIN EXECUTION
// =============================================

async function main() {
    console.log('=================================================');
    console.log('French Tech Funding - SIREN/SIRET Matching');
    console.log('=================================================');

    if (DRY_RUN) {
        console.log('MODE: Dry run (no database updates)');
    }
    if (FORCE) {
        console.log('MODE: Force re-match existing SIRENs');
    }
    if (LIMIT) {
        console.log(`MODE: Limited to ${LIMIT} companies`);
    }
    if (SPECIFIC_COMPANY) {
        console.log(`MODE: Matching company "${SPECIFIC_COMPANY}"`);
    }

    validateConfig();

    // Fetch companies
    console.log('\n--- Fetching companies ---');
    const companies = await fetchCompaniesToMatch();
    console.log(`Found ${companies.length} companies to process`);

    if (companies.length === 0) {
        console.log('\nNo companies to process. Use --force to re-match existing.');
        process.exit(0);
    }

    console.log('\n--- Using INSEE API key authentication ---');

    // Process companies
    console.log('\n--- Processing companies ---');
    const results = {
        high: [],     // Auto-approved matches
        medium: [],   // Need review
        low: [],      // Weak matches
        notFound: [], // No results
        error: []     // API errors
    };

    for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        const progress = `[${i + 1}/${companies.length}]`;

        console.log(`\n${progress} ${company.name}`);
        console.log(`    City: ${company.hq_city_name || 'unknown'}`);

        try {
            // Search Sirene API
            const searchResults = await searchSirene(company.name, company.hq_city_name);

            if (searchResults.length === 0) {
                // Try without city filter
                const broaderSearch = await searchSirene(company.name);
                if (broaderSearch.length === 0) {
                    console.log('    Result: NOT FOUND');
                    results.notFound.push({
                        company: company.name,
                        city: company.hq_city_name
                    });
                    await delay(RATE_LIMIT_DELAY_MS);
                    continue;
                }
                searchResults.push(...broaderSearch);
            }

            // Find best match
            const match = findBestMatch(company.name, company.hq_city_name, searchResults);

            if (!match) {
                console.log('    Result: NO MATCH');
                results.notFound.push({
                    company: company.name,
                    city: company.hq_city_name
                });
            } else {
                console.log(`    Match: ${match.denominationOfficielle}`);
                console.log(`    SIREN: ${match.siren} | SIRET: ${match.siret}`);
                console.log(`    Confidence: ${match.confidence.toUpperCase()} (score: ${match.score.toFixed(2)})`);

                const record = {
                    companyId: company.id,
                    companyName: company.name,
                    companyCity: company.hq_city_name,
                    ...match
                };

                // Update database for high confidence matches
                if (match.confidence === CONFIDENCE.HIGH) {
                    if (!DRY_RUN && !CONFIRM) {
                        const updated = await updateCompanySiren(company.id, match);
                        console.log(`    Database: ${updated ? 'UPDATED' : 'FAILED'}`);
                    } else {
                        console.log(`    Database: PENDING (will confirm later)`);
                    }
                    results.high.push(record);
                } else if (match.confidence === CONFIDENCE.MEDIUM) {
                    results.medium.push(record);
                } else {
                    results.low.push(record);
                }
            }
        } catch (err) {
            console.log(`    Error: ${err.message}`);
            results.error.push({
                company: company.name,
                error: err.message
            });
        }

        // Rate limiting
        await delay(RATE_LIMIT_DELAY_MS);
    }

    // Print summary
    printSummary(results);

    // Handle --confirm mode: ask user if they want to apply high confidence matches
    if (CONFIRM && results.high.length > 0) {
        console.log('\n--- HIGH CONFIDENCE MATCHES TO APPLY ---');
        for (const r of results.high) {
            console.log(`  ${r.companyName} -> ${r.denominationOfficielle} (SIREN: ${r.siren})`);
        }

        const confirmed = await askConfirmation(`\nApply these ${results.high.length} high confidence matches? (y/n): `);
        if (confirmed) {
            await applyHighConfidenceMatches(results.high);
        } else {
            console.log('\nNo changes made.');
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Prompt user for confirmation
 */
function askConfirmation(question) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.toLowerCase().startsWith('y'));
        });
    });
}

/**
 * Apply high confidence matches to database
 */
async function applyHighConfidenceMatches(matches) {
    console.log('\n--- Applying high confidence matches ---');
    let successCount = 0;

    for (const match of matches) {
        const updated = await updateCompanySiren(match.companyId, match);
        if (updated) {
            console.log(`  ✓ ${match.companyName} -> ${match.siren}`);
            successCount++;
        } else {
            console.log(`  ✗ ${match.companyName} -> FAILED`);
        }
    }

    console.log(`\nUpdated ${successCount}/${matches.length} companies.`);
    return successCount;
}

function printSummary(results) {
    console.log('\n=================================================');
    console.log('SUMMARY');
    console.log('=================================================');
    console.log(`  High confidence (auto-updated): ${results.high.length}`);
    console.log(`  Medium confidence (needs review): ${results.medium.length}`);
    console.log(`  Low confidence (manual review): ${results.low.length}`);
    console.log(`  Not found: ${results.notFound.length}`);
    console.log(`  Errors: ${results.error.length}`);

    if (results.medium.length > 0) {
        console.log('\n--- MEDIUM CONFIDENCE MATCHES (review recommended) ---');
        for (const r of results.medium) {
            console.log(`\n  ${r.companyName} (${r.companyCity})`);
            console.log(`    -> ${r.denominationOfficielle}`);
            console.log(`    SIREN: ${r.siren} | Score: ${r.score.toFixed(2)}`);
        }
    }

    if (results.low.length > 0) {
        console.log('\n--- LOW CONFIDENCE MATCHES (manual review required) ---');
        for (const r of results.low) {
            console.log(`\n  ${r.companyName} (${r.companyCity})`);
            console.log(`    -> ${r.denominationOfficielle}`);
            console.log(`    SIREN: ${r.siren} | Score: ${r.score.toFixed(2)}`);
        }
    }

    if (results.notFound.length > 0) {
        console.log('\n--- NOT FOUND ---');
        for (const r of results.notFound) {
            console.log(`  ${r.company} (${r.city})`);
        }
    }

    if (DRY_RUN) {
        console.log('\n[DRY RUN] No database updates were made.');
        console.log('Run with --confirm to review and apply high-confidence matches.');
    }

    console.log('\n=================================================');
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    process.exit(1);
});
