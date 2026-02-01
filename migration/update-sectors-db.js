/**
 * Database Migration: Update Combined Sectors to Individual Sectors
 *
 * This script updates the Supabase database to:
 * 1. Create new individual sector records
 * 2. Update company_sectors to use the new individual sectors
 * 3. Clean up old combined sector records
 *
 * Usage:
 *   export SUPABASE_URL="https://tlwqkglfyjydwsgjrclx.supabase.co"
 *   export SUPABASE_SERVICE_KEY="your-service-role-key"
 *   node update-sectors-db.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tlwqkglfyjydwsgjrclx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
    console.error('Usage: SUPABASE_SERVICE_KEY=your-key node update-sectors-db.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Mapping of combined sectors to their individual components
const SECTOR_MAPPING = {
    'AgriTech & FoodTech': ['AgriTech', 'FoodTech'],
    'FoodTech & AgriTech': ['AgriTech', 'FoodTech'],
    'CleanTech & Energy': ['CleanTech', 'Energy'],
    'HealthTech & BioTech': ['HealthTech', 'BioTech'],
    'DeepTech & Hardware': ['DeepTech', 'Hardware'],
    'BioTech & Pharma': ['BioTech']
};

// Colors for new sectors
const SECTOR_COLORS = {
    'AgriTech': '#16a34a',
    'FoodTech': '#22c55e',
    'CleanTech': '#84cc16',
    'Energy': '#facc15',
    'HealthTech': '#10b981',
    'BioTech': '#10b981',
    'DeepTech': '#a855f7',
    'Hardware': '#6366f1',
    'Web3': '#fb923c'
};

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[&]/g, '-and-')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function updateSectorsInDatabase() {
    console.log('=============================================');
    console.log('Updating Sectors in Supabase Database');
    console.log('=============================================\n');

    // Step 1: Create new individual sectors if they don't exist
    console.log('Step 1: Creating individual sectors...');
    const newSectors = ['AgriTech', 'FoodTech', 'CleanTech', 'Energy', 'HealthTech', 'BioTech', 'DeepTech', 'Hardware', 'Web3'];
    const sectorIdMap = {};

    for (const sectorName of newSectors) {
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
        } else {
            console.log(`  ✓ Sector "${sectorName}" ready (ID: ${data.id})`);
            sectorIdMap[sectorName] = data.id;
        }
    }

    // Step 2: Get all combined sectors from database
    console.log('\nStep 2: Finding combined sectors...');
    const combinedSectorNames = Object.keys(SECTOR_MAPPING);
    const { data: combinedSectors, error: fetchError } = await supabase
        .from('sectors')
        .select('id, name')
        .in('name', combinedSectorNames);

    if (fetchError) {
        console.error('Error fetching combined sectors:', fetchError.message);
        return;
    }

    console.log(`  Found ${combinedSectors?.length || 0} combined sectors to update`);

    // Step 3: For each combined sector, update company_sectors
    console.log('\nStep 3: Updating company-sector associations...');
    let updatedCount = 0;

    for (const combinedSector of combinedSectors || []) {
        const newSectorNames = SECTOR_MAPPING[combinedSector.name];
        if (!newSectorNames) continue;

        console.log(`\n  Processing "${combinedSector.name}"...`);

        // Get all company_sectors entries for this combined sector
        const { data: companySectors, error: csError } = await supabase
            .from('company_sectors')
            .select('id, company_id, is_primary')
            .eq('sector_id', combinedSector.id);

        if (csError) {
            console.error(`    Error fetching company_sectors:`, csError.message);
            continue;
        }

        console.log(`    Found ${companySectors?.length || 0} companies with this sector`);

        // For each company, add the new individual sectors
        for (const cs of companySectors || []) {
            for (const newSectorName of newSectorNames) {
                const newSectorId = sectorIdMap[newSectorName];
                if (!newSectorId) {
                    console.error(`    Sector ID not found for "${newSectorName}"`);
                    continue;
                }

                // Insert new sector association (ignore if already exists)
                const { error: insertError } = await supabase
                    .from('company_sectors')
                    .upsert({
                        company_id: cs.company_id,
                        sector_id: newSectorId,
                        is_primary: cs.is_primary && newSectorName === newSectorNames[0]
                    }, { onConflict: 'company_id,sector_id' });

                if (insertError && !insertError.message.includes('duplicate')) {
                    console.error(`    Error inserting sector for company:`, insertError.message);
                }
            }

            // Delete the old combined sector association
            const { error: deleteError } = await supabase
                .from('company_sectors')
                .delete()
                .eq('id', cs.id);

            if (deleteError) {
                console.error(`    Error deleting old association:`, deleteError.message);
            } else {
                updatedCount++;
            }
        }
    }

    // Step 4: Delete combined sector records (optional - they may still be referenced)
    console.log('\nStep 4: Cleaning up combined sector records...');
    for (const combinedSector of combinedSectors || []) {
        // Check if any companies still reference this sector
        const { data: remaining } = await supabase
            .from('company_sectors')
            .select('id')
            .eq('sector_id', combinedSector.id)
            .limit(1);

        if (!remaining || remaining.length === 0) {
            const { error: deleteError } = await supabase
                .from('sectors')
                .delete()
                .eq('id', combinedSector.id);

            if (deleteError) {
                console.log(`  Could not delete "${combinedSector.name}": ${deleteError.message}`);
            } else {
                console.log(`  ✓ Deleted "${combinedSector.name}"`);
            }
        } else {
            console.log(`  Keeping "${combinedSector.name}" (still referenced)`);
        }
    }

    console.log('\n=============================================');
    console.log('MIGRATION COMPLETE');
    console.log(`Companies updated: ${updatedCount}`);
    console.log('=============================================\n');
}

updateSectorsInDatabase().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
