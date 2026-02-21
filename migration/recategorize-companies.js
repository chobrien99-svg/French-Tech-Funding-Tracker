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
    { company: 'Intact', sectors: ['AgriTech'] },
    { company: 'NeoFarm', sectors: ['AgriTech'] },
    { company: 'nextProtein', sectors: ['AgriTech'] },
    { company: 'MYCOPHYTO', sectors: ['AgriTech', 'BioTech'] },
    { company: 'Equitable Earth', sectors: ['AgriTech', 'CleanTech'] },
    { company: 'ReGeneration', sectors: ['AgriTech'] },
    { company: 'Lisaqua', sectors: ['AgriTech', 'CleanTech'] },
    { company: 'Nutropy', sectors: ['FoodTech', 'BioTech'] },
    { company: 'Adcytherix', sectors: ['BioTech'] },
    { company: 'Nabla', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Gradium', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Lattice Medical', sectors: ['HealthTech', 'Hardware'] },
    { company: 'Step Pharma', sectors: ['BioTech'] },
    { company: 'FineHeart', sectors: ['HealthTech', 'Hardware'] },
    { company: 'SiPearl', sectors: ['Hardware', 'AI & Machine Learning'] },
    { company: 'Coave Therapeutics', sectors: ['BioTech'] },
    { company: 'TreeFrog Therapeutics', sectors: ['BioTech'] },
    { company: 'EG 427', sectors: ['BioTech'] },
    { company: 'Robeauté', sectors: ['HealthTech', 'Hardware', 'AI & Machine Learning'] },
    { company: 'SCAP Hologram', sectors: ['HealthTech', 'Hardware'] },
    { company: 'Enodia Therapeutics', sectors: ['BioTech', 'AI & Machine Learning'] },
    { company: 'SeqOne', sectors: ['BioTech', 'AI & Machine Learning'] },
    { company: 'Axoltis Pharma', sectors: ['BioTech'] },
    { company: 'ErVimmune', sectors: ['BioTech'] },
    { company: 'Via Sana', sectors: ['HealthTech'] },
    { company: 'Solence', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Tafalgie Therapeutics', sectors: ['BioTech'] },
    { company: 'One Biosciences', sectors: ['BioTech'] },
    { company: 'RDS', sectors: ['HealthTech'] },
    { company: 'MaaT Pharma', sectors: ['BioTech'] },
    { company: 'SuperBranche', sectors: ['BioTech'] },
    { company: 'Innerskin', sectors: ['HealthTech'] },
    { company: 'Elkedonia', sectors: ['BioTech'] },
    { company: 'StemInov', sectors: ['BioTech'] },
    { company: 'Osivax', sectors: ['BioTech'] },
    { company: 'ROFIM', sectors: ['HealthTech'] },
    { company: 'SafeHeal', sectors: ['HealthTech', 'Hardware'] },
    { company: 'Ray Studios', sectors: ['HealthTech'] },
    { company: 'EVerZom', sectors: ['BioTech'] },
    { company: 'Okeiro', sectors: ['BioTech'] },
    { company: 'Adocia', sectors: ['BioTech'] },
    { company: 'Reev', sectors: ['HealthTech', 'Hardware', 'AI & Machine Learning'] },
    { company: 'Enterome', sectors: ['BioTech'] },
    { company: 'Circle Safe', sectors: ['HealthTech', 'Hardware'] },
    { company: 'Dillico', sectors: ['BioTech', 'AI & Machine Learning'] },
    { company: 'Lucis', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Dianosic', sectors: ['BioTech'] },
    { company: 'Ciloa', sectors: ['BioTech'] },
    { company: 'Hemerion Therapeutics', sectors: ['BioTech'] },
    { company: 'ArcaScience', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Faks', sectors: ['HealthTech'] },
    { company: 'ENYO Pharma', sectors: ['BioTech'] },
    { company: 'Kyron.bio', sectors: ['BioTech'] },
    { company: 'Juisci', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'GeodAlsics', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Vocca', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Veragrow', sectors: ['AgriTech'] },
    { company: 'Sirius NeoSight', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Alkion BioInnovations', sectors: ['BioTech'] },
    { company: 'Febus Optics', sectors: ['Hardware'] },
    { company: "Activ\u2019Inside", sectors: ['HealthTech', 'FoodTech'] },
    { company: 'Fizimed', sectors: ['HealthTech'] },
    { company: 'Plasana Medical', sectors: ['HealthTech', 'Hardware'] },
    { company: 'AdEchoTech', sectors: ['HealthTech'] },
    { company: 'Cementic', sectors: ['BioTech'] },
    { company: 'Kimialys', sectors: ['BioTech', 'Hardware'] },
    { company: 'Allergen Alert', sectors: ['HealthTech', 'Hardware'] },
    { company: 'Byome Labs', sectors: ['BioTech', 'Hardware'] },
    { company: 'Hopia', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Brink Therapeutics', sectors: ['BioTech'] },
    { company: 'Laclaree Vision', sectors: ['HealthTech'] },
    { company: 'LaFraise', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Moodwork', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Sounduct', sectors: ['HealthTech', 'Hardware'] },
    { company: 'Chenevia', sectors: ['BioTech'] },
    { company: 'Hocoia', sectors: ['HealthTech'] },
    { company: 'Ventuno Biotech', sectors: ['BioTech'] },
    { company: 'Ensweet', sectors: ['HealthTech'] },
    { company: 'Sonomind', sectors: ['HealthTech', 'Hardware'] },
    { company: 'Parallel', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Exeliom Biosciences', sectors: ['BioTech'] },
    { company: 'Oria Bioscience', sectors: ['BioTech'] },
    { company: 'Circular', sectors: ['HealthTech'] },
    { company: 'Lyv Healthcare', sectors: ['HealthTech'] },
    { company: 'Vipali', sectors: ['HealthTech'] },
    { company: 'OWLO', sectors: ['BioTech', 'AI & Machine Learning'] },
    { company: 'Sweetech', sectors: ['BioTech'] },
    { company: 'STEPS ORTHO', sectors: ['HealthTech'] },
    { company: 'Alterdiag', sectors: ['BioTech'] },
    { company: 'SeaBeLife', sectors: ['BioTech'] },
    { company: 'Celest Science', sectors: ['HealthTech'] },
    { company: 'Annette', sectors: ['HealthTech'] },
    { company: 'MyFit Solutions', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Greenphage', sectors: ['BioTech'] },
    { company: 'Ordalie', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'MSInsight', sectors: ['BioTech', 'AI & Machine Learning'] },
    { company: 'MovaLife', sectors: ['HealthTech', 'Hardware'] },
    { company: 'VitaDX', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Skyld AI', sectors: ['AI & Machine Learning'] },
    { company: 'Zenior', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'E-Sensia', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'bYoRNA', sectors: ['BioTech'] },
    { company: 'Goud', sectors: ['HealthTech'] },
    { company: 'KLODIOS', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: "H\u2019ability", sectors: ['HealthTech', 'Hardware'] },
    { company: 'Yomi Pharma', sectors: ['BioTech'] },
    { company: 'Clikodoc', sectors: ['HealthTech'] },
    { company: 'Elefantia', sectors: ['AI & Machine Learning'] },
    { company: 'BiPER Therapeutics', sectors: ['BioTech'] },
    { company: 'AberActives', sectors: ['BioTech'] },
    { company: 'Inside Therapeutics', sectors: ['BioTech'] },
    { company: 'Cellura (formerly SoftCell Therapeutics)', sectors: ['BioTech', 'Hardware'] },
    { company: 'Novem', sectors: ['BioTech'] },
    { company: 'Naali', sectors: ['HealthTech'] },
    { company: 'VBTech', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Vulgaroo', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'AlgenScribe', sectors: ['BioTech'] },
    { company: 'Beez Biotech', sectors: ['BioTech', 'Hardware'] },
    { company: 'Manitty', sectors: ['HealthTech', 'AI & Machine Learning'] },
    { company: 'Plantibodies', sectors: ['BioTech'] },
    { company: 'TheraPPI Bioscience', sectors: ['BioTech'] },
    { company: 'MB Therapeutics', sectors: ['BioTech'] },
    { company: 'Carthera', sectors: ['HealthTech', 'Hardware'] },
    { company: 'SOFTWAY MEDICAL', sectors: ['HealthTech'] },
    { company: 'PulseSight Therapeutics', sectors: ['BioTech'] },
    { company: 'Elum Energy', sectors: ['CleanTech', 'Energy'] },
    { company: 'Leanspace', sectors: ['SpaceTech & Aerospace'] },
    { company: 'Melvan', sectors: ['Energy', 'FinTech'] },
    { company: 'Maki', sectors: ['SaaS & Enterprise'] },
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
    'AI & Machine Learning': '#8b5cf6',
    'HealthTech': '#10b981',
    'Hardware': '#6366f1',
    'Robotics': '#e11d48',
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
            console.warn(`  NOTE: ${companies.length} matches for "${company}" - updating all`);
        }

        // Update ALL matching companies (handles duplicates)
        let allOk = true;
        for (const comp of companies) {
            const companyId = comp.id;

            // Delete existing sector associations
            const { error: deleteError } = await supabase
                .from('company_sectors')
                .delete()
                .eq('company_id', companyId);

            if (deleteError) {
                console.error(`  ERROR deleting sectors for "${comp.name}" (${companyId}):`, deleteError.message);
                allOk = false;
                continue;
            }

            // Insert new sector associations
            const newAssociations = sectors.map((sectorName, index) => ({
                company_id: companyId,
                sector_id: sectorIdMap[sectorName],
                is_primary: index === 0,
            }));

            const { error: insertError } = await supabase
                .from('company_sectors')
                .insert(newAssociations);

            if (insertError) {
                console.error(`  ERROR inserting sectors for "${comp.name}" (${companyId}):`, insertError.message);
                allOk = false;
            }
        }

        if (!allOk) {
            errorCount++;
            continue;
        }

        console.log(`  ✓ ${companies[0].name}${companies.length > 1 ? ` (x${companies.length})` : ''}: ${sectors.join(', ')}`);
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
