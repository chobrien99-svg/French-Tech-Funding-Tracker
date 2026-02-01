/**
 * Script to update combined sector categories to individual sectors
 *
 * This script transforms:
 * - "AgriTech & FoodTech" or "FoodTech & AgriTech" → ["AgriTech", "FoodTech"]
 * - "CleanTech & Energy" → ["CleanTech", "Energy"]
 * - "HealthTech & BioTech" → ["HealthTech", "BioTech"]
 * - "DeepTech & Hardware" → ["DeepTech", "Hardware"]
 *
 * Usage: node update-sectors.js
 */

const fs = require('fs');
const path = require('path');

// Mapping of combined sectors to their individual components
const SECTOR_MAPPING = {
    'AgriTech & FoodTech': ['AgriTech', 'FoodTech'],
    'FoodTech & AgriTech': ['AgriTech', 'FoodTech'],
    'CleanTech & Energy': ['CleanTech', 'Energy'],
    'HealthTech & BioTech': ['HealthTech', 'BioTech'],
    'DeepTech & Hardware': ['DeepTech', 'Hardware'],
    'BioTech & Pharma': ['BioTech']  // Simplify to just BioTech
};

function updateSectors() {
    const jsonPath = path.join(__dirname, '..', 'funding-data.json');

    if (!fs.existsSync(jsonPath)) {
        console.error(`Error: Could not find ${jsonPath}`);
        process.exit(1);
    }

    console.log('Reading funding-data.json...');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const companies = JSON.parse(rawData);

    console.log(`Loaded ${companies.length} companies`);

    let updatedCount = 0;
    const sectorChanges = {};

    // Process each company
    for (const company of companies) {
        if (!company.sectors || !Array.isArray(company.sectors)) {
            continue;
        }

        const newSectors = [];
        let changed = false;

        for (const sector of company.sectors) {
            if (SECTOR_MAPPING[sector]) {
                // Replace combined sector with individual sectors
                const individualSectors = SECTOR_MAPPING[sector];
                for (const s of individualSectors) {
                    if (!newSectors.includes(s)) {
                        newSectors.push(s);
                    }
                }
                changed = true;

                // Track changes for reporting
                if (!sectorChanges[sector]) {
                    sectorChanges[sector] = 0;
                }
                sectorChanges[sector]++;
            } else {
                // Keep the sector as-is
                if (!newSectors.includes(sector)) {
                    newSectors.push(sector);
                }
            }
        }

        if (changed) {
            company.sectors = newSectors;
            updatedCount++;
        }
    }

    // Write updated data back
    console.log('\nWriting updated data...');
    fs.writeFileSync(jsonPath, JSON.stringify(companies, null, 2));

    // Print summary
    console.log('\n=== Update Summary ===');
    console.log(`Companies updated: ${updatedCount}`);
    console.log('\nSector transformations:');
    for (const [sector, count] of Object.entries(sectorChanges)) {
        const newSectors = SECTOR_MAPPING[sector].join(', ');
        console.log(`  "${sector}" → [${newSectors}]: ${count} occurrences`);
    }
    console.log('\nDone!');
}

updateSectors();
