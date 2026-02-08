/**
 * Update Investors for Specific Funding Rounds in Supabase
 *
 * For each company listed, this script:
 *   1. Finds the company by name
 *   2. Finds ALL funding rounds for that company
 *   3. Deletes existing investor associations for those rounds
 *   4. Creates/upserts new investors and links them
 *
 * Special case: AlgenScribe updates founders (company_people) instead.
 *
 * Usage:
 *   export SUPABASE_URL="https://tlwqkglfyjydwsgjrclx.supabase.co"
 *   export SUPABASE_SERVICE_KEY="your-service-role-key"
 *   node update-investors.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tlwqkglfyjydwsgjrclx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
    console.error('Usage: SUPABASE_SERVICE_KEY=your-key node update-investors.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// =============================================
// INVESTOR UPDATES
// =============================================

const INVESTOR_UPDATES = [
    {
        company: 'TheraPPI Bioscience',
        investors: ['Bpifrance', 'FONGIT'],
    },
    {
        company: 'XXII',
        investors: ['Sopra Steria Ventures', 'CMA-CGM Group', 'CIB Development', 'Kima Ventures', 'Duval Group', 'Defence Innovation Fund', '574 Invest', 'Techmind'],
    },
    {
        company: 'PulseSight Therapeutics',
        investors: ['Korea Investment Partners', 'Pureos Bioventures', '+ND Capital'],
    },
    {
        company: 'DareWin Evolution',
        investors: ['Big Idea Ventures'],
    },
    {
        company: 'Beez Biotech',
        investors: ['Philippe Angeli', 'Arnaud Maury', 'Nelly Lerestif', 'Business Angels', 'Fr\u00e9d\u00e9ric Massie'],
    },
    {
        company: 'Zero Industries',
        investors: ['Heartfelt', 'Project Europe'],
    },
    {
        company: 'Tibeka Protections',
        investors: ['Undisclosed'],
    },
    {
        company: 'Aircap',
        investors: ['Better Angle', 'Kima Ventures', 'Business Angels'],
    },
    {
        company: 'AuraLIP',
        investors: ['Femmes Business Angels', 'BADGE'],
    },
    {
        company: 'Vaultys',
        investors: ['Bpifrance', 'Business Angels', 'Marie-H\u00e9l\u00e8ne Fagard', 'Alsace Business Angels'],
    },
    {
        company: 'vebo\u00b0',
        investors: ['Marco & Co', 'Pays de la Loire', 'Atlantique Business Angels Booster'],
    },
    {
        company: 'Naali',
        investors: ['Business Angels', 'Jean-Michel Aulas', 'Jean-Michel Karam', 'Kelly Massol'],
    },
    {
        company: 'Initiativ',
        investors: ['U-Investors', 'Frenchfounders', 'Business Angels', 'Holmarcom'],
    },
    {
        company: 'fluiidd',
        investors: ['INSEAD BA Network', 'R\u00e9gion Sud Investissement', 'Provence Angels', 'Femmes Business Angels'],
    },
    {
        company: 'Luchrome',
        investors: ['Arts et M\u00e9tiers Business Angels', 'R\u00e9gion Nouvelle-Aquitaine', "Techno'Start", 'Femmes Business Angels', 'Les Business Angels des Grandes Ecoles', 'Bpifrance'],
    },
    {
        company: 'Cube (formerly Cube3)',
        investors: ['Jean-Pierre Nadir', 'Emmanuel Picot', 'Bpifrance', 'Amixem', 'Banque Populaire Grand Ouest', 'Nicolas Bacca'],
    },
    {
        company: 'CR-Industry',
        investors: ['France Active Pays de la Loire', 'Credit Agricole Atlantique Vendee', 'Business Angels', 'Atlantique Business Angels Booster', 'BNP Paribas', 'Pays de la Loire Participations'],
    },
    {
        company: 'Unlimited Driving Corporation (UDC)',
        investors: ['\u00c9cole des Mines de Saint-\u00c9tienne', 'CNRS', 'Business Angels', 'Bpifrance'],
    },
    {
        company: 'Cellura (formerly SoftCell Therapeutics)',
        investors: ['Angels Bay Invest', 'Seed for Good', 'Thierry Letartre', 'Business Angels'],
    },
    {
        company: 'Santafoo',
        investors: ['Crowdfunding', 'WiSeed'],
    },
    {
        company: 'MNGRS.AI',
        investors: ['Business Angels', 'Aur\u00e9lien Tchouam\u00e9ni', 'Mamby Laye Diomand\u00e9', 'Mike Maignan', 'Jules Kound\u00e9'],
    },
    {
        company: 'OneTake AI',
        investors: ['Business Angels'],
    },
    {
        company: 'Energy&+ (subsidiary of Charwood Energy)',
        investors: ['Crowdfunding', 'MiiMOSA'],
    },
    {
        company: 'BiPER Therapeutics',
        investors: ['France 2030', 'Bpifrance', 'MEDIN Fund Management Company'],
    },
];

// AlgenScribe founder update (separate from investor updates)
const FOUNDER_UPDATES = [
    {
        company: 'AlgenScribe',
        founders: ['Fr\u00e9d\u00e9ric Zampatti'],
    },
];

// =============================================
// HELPERS
// =============================================

const investorCache = new Map();

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

async function upsertPerson(fullName) {
    const { data: existing } = await supabase
        .from('people')
        .select('id')
        .eq('full_name', fullName)
        .maybeSingle();

    if (existing) return existing.id;

    const { data, error } = await supabase
        .from('people')
        .insert({ full_name: fullName })
        .select('id')
        .single();

    if (error) {
        console.error(`    Person insert failed (${fullName}): ${error.message}`);
        return null;
    }
    return data.id;
}

// =============================================
// MAIN
// =============================================

async function updateInvestors() {
    console.log('=============================================');
    console.log('Updating Investors in Supabase');
    console.log('=============================================\n');

    let successCount = 0;
    let errorCount = 0;
    let notFoundCount = 0;

    for (const entry of INVESTOR_UPDATES) {
        const { company, investors } = entry;

        // Find ALL company records by name (handle duplicates)
        const { data: companies, error: companyError } = await supabase
            .from('companies')
            .select('id, name')
            .ilike('name', company);

        if (companyError) {
            console.error(`  ERROR looking up "${company}": ${companyError.message}`);
            errorCount++;
            continue;
        }

        if (!companies || companies.length === 0) {
            console.error(`  NOT FOUND: "${company}"`);
            notFoundCount++;
            continue;
        }

        let allOk = true;

        for (const comp of companies) {
            // Find all funding rounds for this company
            const { data: rounds, error: roundError } = await supabase
                .from('funding_rounds')
                .select('id')
                .eq('company_id', comp.id);

            if (roundError) {
                console.error(`  ERROR fetching rounds for "${comp.name}": ${roundError.message}`);
                allOk = false;
                continue;
            }

            if (!rounds || rounds.length === 0) {
                console.error(`  NO ROUNDS found for "${comp.name}" (${comp.id})`);
                allOk = false;
                continue;
            }

            // Delete existing investor links for all rounds
            for (const round of rounds) {
                const { error: delError } = await supabase
                    .from('funding_round_investors')
                    .delete()
                    .eq('funding_round_id', round.id);

                if (delError) {
                    console.error(`  ERROR deleting investors for round ${round.id}: ${delError.message}`);
                    allOk = false;
                }
            }

            // Upsert investors and link to all rounds
            for (const investorName of investors) {
                const investorId = await upsertInvestor(investorName);
                if (!investorId) {
                    allOk = false;
                    continue;
                }

                for (const round of rounds) {
                    const { error: linkError } = await supabase
                        .from('funding_round_investors')
                        .upsert({
                            funding_round_id: round.id,
                            investor_id: investorId,
                            is_lead: investorName === investors[0],
                        }, { onConflict: 'funding_round_id,investor_id' });

                    if (linkError) {
                        console.error(`  ERROR linking ${investorName} to round ${round.id}: ${linkError.message}`);
                        allOk = false;
                    }
                }
            }
        }

        if (!allOk) {
            errorCount++;
            console.error(`  PARTIAL/FAILED: ${company}`);
        } else {
            const suffix = companies.length > 1 ? ` (x${companies.length})` : '';
            console.log(`  \u2713 ${companies[0].name}${suffix}: ${investors.join(', ')}`);
            successCount++;
        }
    }

    // Handle founder updates
    console.log('\nUpdating Founders...');
    for (const entry of FOUNDER_UPDATES) {
        const { company, founders } = entry;

        const { data: companies, error: companyError } = await supabase
            .from('companies')
            .select('id, name')
            .ilike('name', company);

        if (companyError || !companies || companies.length === 0) {
            console.error(`  NOT FOUND or ERROR: "${company}"`);
            errorCount++;
            continue;
        }

        let allOk = true;

        for (const comp of companies) {
            // Delete existing founder links
            const { error: delError } = await supabase
                .from('company_people')
                .delete()
                .eq('company_id', comp.id)
                .eq('role', 'founder');

            if (delError) {
                console.error(`  ERROR deleting founders for "${comp.name}": ${delError.message}`);
                allOk = false;
                continue;
            }

            // Insert new founders
            for (const founderName of founders) {
                const personId = await upsertPerson(founderName);
                if (!personId) {
                    allOk = false;
                    continue;
                }

                const { error: linkError } = await supabase
                    .from('company_people')
                    .upsert({
                        company_id: comp.id,
                        person_id: personId,
                        role: 'founder',
                    }, { onConflict: 'company_id,person_id' });

                if (linkError) {
                    console.error(`  ERROR linking founder ${founderName}: ${linkError.message}`);
                    allOk = false;
                }
            }
        }

        if (!allOk) {
            errorCount++;
            console.error(`  PARTIAL/FAILED: ${company} founders`);
        } else {
            console.log(`  \u2713 ${companies[0].name} founders: ${founders.join(', ')}`);
            successCount++;
        }
    }

    console.log('\n=============================================');
    console.log('INVESTOR UPDATE COMPLETE');
    console.log(`  Successful: ${successCount}`);
    console.log(`  Not found:  ${notFoundCount}`);
    console.log(`  Errors:     ${errorCount}`);
    console.log('=============================================\n');

    if (errorCount > 0 || notFoundCount > 0) {
        process.exit(1);
    }
}

updateInvestors().catch(err => {
    console.error('Update failed:', err);
    process.exit(1);
});
