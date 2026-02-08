/**
 * Recategorize Companies in Supabase Database
 *
 * This script updates the sector associations for specific companies.
 * It removes existing sector associations and replaces them with the
 * specified new sectors.
 *
 * Usage:
 *   export SUPABASE_URL="https://tlwqkglfyjydwsgjrclx.supabase.co"
 *   export SUPABASE_SERVICE_KEY="your-service-role-key"
 *   node recategorize-companies.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tlwqkglfyjydwsgjrclx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
    console.error('Usage: SUPABASE_SERVICE_KEY=your-key node recategorize-companies.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Companies to recategorize: { companyName: [sector1, sector2, ...] }
const RECATEGORIZATIONS = [
    { company: 'Accro', sectors: ['FoodTech'] },
    { company: 'La Fourche', sectors: ['FoodTech'] },
    { company: 'Nutropyy', sectors: ['FoodTech'] },
    { company: 'Le Drive tout nu', sectors: ['FoodTech'] },
    { company: 'Agreenculture', sectors: ['AgriTech', 'Mobility & Transportation'] },
    { company: 'Kapsera', sectors: ['AgriTech', 'BioTech'] },
    { company: 'Green Spot Technologies', sectors: ['AgriTech'] },
    { company: 'Les Nouvelles Fermes', sectors: ['AgriTech'] },
    { company: 'ReSoil', sectors: ['AgriTech'] },
    { company: "Fungu'it", sectors: ['FoodTech'] },
    { company: 'Eclaircie', sectors: ['Energy', 'AgriTech'] },
    { company: 'Elmut', sectors: ['FoodTech'] },
    { company: 'Praysbee', sectors: ['AgriTech'] },
    { company: 'Viti-Tunnel', sectors: ['AgriTech'] },
    { company: 'SeaWeed Concept', sectors: ['FoodTech', 'BioTech'] },
    { company: 'Jay & Joy', sectors: ['FoodTech'] },
    { company: 'CGREEN', sectors: ['CleanTech', 'AgriTech'] },
    { company: 'Néosylva', sectors: ['CleanTech', 'AgriTech'] },
    { company: 'Yacon & Co', sectors: ['FoodTech'] },
    { company: 'Beyond Green', sectors: ['FoodTech', 'AgriTech'] },
    { company: 'Vegetal Food', sectors: ['FoodTech'] },
    { company: 'NeoEarth', sectors: ['AgriTech', 'BioTech'] },
    { company: 'Agri Lab Leverage', sectors: ['AgriTech'] },
    { company: 'VoilaChef', sectors: ['FoodTech'] },
    { company: 'Beans', sectors: ['FoodTech'] },
    { company: 'AuraLIP', sectors: ['FoodTech'] },
    { company: 'Versant', sectors: ['AgriTech', 'SpaceTech & Aerospace'] },
    { company: 'Terroe', sectors: ['AgriTech', 'FoodTech'] },
    { company: 'DareWin Evolution', sectors: ['FoodTech'] },
    { company: 'Kuantom', sectors: ['FoodTech'] },
    { company: 'Cherico', sectors: ['FoodTech'] },
    { company: 'Aberyne', sectors: ['FoodTech'] },
    { company: 'Neo Earth', sectors: ['AgriTech', 'BioTech'] },
    { company: 'Amatera', sectors: ['AgriTech'] },
];

// Sector colors for any sectors that might need to be created
const SECTOR_COLORS = {
    'AgriTech': '#16a34a',
    'FoodTech': '#22c55e',
    'CleanTech': '#84cc16',
    'Energy': '#facc15',
    'BioTech': '#10b981',
    'Mobility & Transportation': '#3b82f6',
    'SpaceTech & Aerospace': '#1e3a8a',
};

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[&]/g, '-and-')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function recategorizeCompanies() {
    console.log('=============================================');
    console.log('Recategorizing Companies in Supabase');
    console.log('=============================================\n');

    // Step 1: Build a map of sector name -> sector ID
    console.log('Step 1: Fetching existing sectors...');
    const { data: existingSectors, error: sectorError } = await supabase
        .from('sectors')
        .select('id, name');

    if (sectorError) {
        console.error('Error fetching sectors:', sectorError.message);
        process.exit(1);
    }

    const sectorIdMap = {};
    for (const s of existingSectors) {
        sectorIdMap[s.name] = s.id;
    }
    console.log(`  Found ${existingSectors.length} sectors in database.`);

    // Ensure all needed sectors exist
    const neededSectors = new Set();
    for (const entry of RECATEGORIZATIONS) {
        for (const s of entry.sectors) {
            neededSectors.add(s);
        }
    }

    for (const sectorName of neededSectors) {
        if (!sectorIdMap[sectorName]) {
            console.log(`  Creating missing sector: "${sectorName}"...`);
            const { data, error } = await supabase
                .from('sectors')
                .upsert({
                    name: sectorName,
                    slug: slugify(sectorName),
                    color: SECTOR_COLORS[sectorName] || '#64748b'
                }, { onConflict: 'name' })
                .select('id, name')
                .single();

            if (error) {
                console.error(`  Error creating sector "${sectorName}":`, error.message);
                process.exit(1);
            }
            sectorIdMap[sectorName] = data.id;
            console.log(`  Created sector "${sectorName}" (ID: ${data.id})`);
        }
    }

    // Step 2: Process each company
    console.log('\nStep 2: Recategorizing companies...');
    let successCount = 0;
    let errorCount = 0;
    let notFoundCount = 0;

    for (const entry of RECATEGORIZATIONS) {
        const { company, sectors } = entry;

        // Find the company by name
        const { data: companies, error: companyError } = await supabase
            .from('companies')
            .select('id, name')
            .ilike('name', company);

        if (companyError) {
            console.error(`  ERROR looking up "${company}":`, companyError.message);
            errorCount++;
            continue;
        }

        if (!companies || companies.length === 0) {
            console.error(`  NOT FOUND: "${company}" - skipping`);
            notFoundCount++;
            continue;
        }

        if (companies.length > 1) {
            console.warn(`  WARNING: Multiple matches for "${company}" - using first match: "${companies[0].name}"`);
        }

        const companyId = companies[0].id;
        const companyName = companies[0].name;

        // Delete existing sector associations
        const { error: deleteError } = await supabase
            .from('company_sectors')
            .delete()
            .eq('company_id', companyId);

        if (deleteError) {
            console.error(`  ERROR deleting sectors for "${companyName}":`, deleteError.message);
            errorCount++;
            continue;
        }

        // Insert new sector associations
        const newAssociations = sectors.map((sectorName, index) => ({
            company_id: companyId,
            sector_id: sectorIdMap[sectorName],
            is_primary: index === 0, // First sector is primary
        }));

        const { error: insertError } = await supabase
            .from('company_sectors')
            .insert(newAssociations);

        if (insertError) {
            console.error(`  ERROR inserting sectors for "${companyName}":`, insertError.message);
            errorCount++;
            continue;
        }

        console.log(`  ✓ ${companyName}: ${sectors.join(', ')}`);
        successCount++;
    }

    // Summary
    console.log('\n=============================================');
    console.log('RECATEGORIZATION COMPLETE');
    console.log(`  Successful: ${successCount}`);
    console.log(`  Not found:  ${notFoundCount}`);
    console.log(`  Errors:     ${errorCount}`);
    console.log('=============================================\n');

    if (errorCount > 0 || notFoundCount > 0) {
        process.exit(1);
    }
}

recategorizeCompanies().catch(err => {
    console.error('Recategorization failed:', err);
    process.exit(1);
});
