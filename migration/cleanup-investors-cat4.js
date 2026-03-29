/**
 * Category 4 Investor Cleanup Script
 *
 * Cleans up dirty investor records:
 *   - MERGE: dirty record linked to existing clean record → reassign all round links, delete dirty
 *   - RENAME: dirty record with no clean version → rename in-place
 *   - DELETE: pure junk/fragment records → remove links + delete
 *
 * Usage:
 *   export SUPABASE_SERVICE_KEY="your-service-role-key"
 *   node migration/cleanup-investors-cat4.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tlwqkglfyjydwsgjrclx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

// Each entry: { dirty: 'exact dirty name', clean: 'canonical name' }
// Script logic:
//   - If clean record exists → MERGE dirty into clean
//   - If clean record doesn't exist → RENAME dirty to clean
const OPERATIONS = [

    // ===================================================================
    // PERSONAL NAMES WITH AFFILIATIONS
    // "Name (Company/Role)" → "Name"
    // ===================================================================
    { dirty: 'Charles Gorintin (Alan', clean: 'Charles Gorintin' },
    { dirty: 'Christian Lainé (Rivadis Group)', clean: 'Christian Lainé' },
    { dirty: 'Christophe Chausson (Chausson Partners)', clean: 'Christophe Chausson' },
    { dirty: 'Damien Deleplanque (historic supporter)', clean: 'Damien Deleplanque' },
    { dirty: 'Daphné Parrot (ex-Fabernovel)', clean: 'Daphné Parrot' },
    { dirty: 'DMG Promotion (family office of Aurélien Tchouameni)', clean: 'DMG Promotion' },
    { dirty: 'Emmanuel Picot (Marco&Co family office)', clean: 'Emmanuel Picot' },
    { dirty: 'Eric Schmidt (former Google CEO)', clean: 'Eric Schmidt' },
    { dirty: 'Florian Douetteau (CEO of Dataiku)', clean: 'Florian Douetteau' },
    { dirty: 'Grégory Salinger (Co-CEO)', clean: 'Grégory Salinger' },
    { dirty: 'Ilkka Paananen (Illusian Founder Office)', clean: 'Ilkka Paananen' },
    { dirty: 'Jean-Baptiste Hironde (MWM)', clean: 'Jean-Baptiste Hironde' },
    // Long URL-appended version
    { dirty: 'Jean-Charles Samuelian (beside.com (https://www.beside.com/blog/beside-raises-32-million-to-turn-trillions-of-calls-and-texts-into-growth-for-everyday-businesses))', clean: 'Jean-Charles Samuelian' },
    { dirty: 'Jean-Charles Samuelian-Werve (Alan)', clean: 'Jean-Charles Samuelian-Werve' },
    { dirty: 'Jean-Louis Quéguiner (Gladia)', clean: 'Jean-Louis Quéguiner' },
    { dirty: 'Jules Koundé (FC Barcelona)', clean: 'Jules Koundé' },
    { dirty: 'Julien Chaumond (Hugging Face)', clean: 'Julien Chaumond' },
    { dirty: 'Mike Maignan (AC Milan)', clean: 'Mike Maignan' },
    { dirty: 'Nicolas Bacca (Ledger co-founder)', clean: 'Nicolas Bacca' },
    { dirty: 'Olivier Pomel (CEO & founder of Datadog)', clean: 'Olivier Pomel' },
    { dirty: 'Olivier Pomel (CEO of Datadog)', clean: 'Olivier Pomel' },
    { dirty: 'Ott Kaukver (CTO of Checkout.com', clean: 'Ott Kaukver' },
    { dirty: 'Saturnin Pugnet (Worldcoin)', clean: 'Saturnin Pugnet' },
    { dirty: 'Thierry Letartre (family office', clean: 'Thierry Letartre' },
    { dirty: 'Thomas Wolf (Hugging Face)', clean: 'Thomas Wolf' },

    // ===================================================================
    // CORPORATE NAMES WITH PARENT / FUND / AFFILIATION CONTEXT
    // "Name (context)" → "Name"
    // ===================================================================
    { dirty: '574 Invest (SNCF Group)', clean: '574 Invest' },
    { dirty: 'AFI Ventures (Ventech)', clean: 'AFI Ventures' },
    { dirty: 'Alsace Business Angels (ABA)', clean: 'Alsace Business Angels' },
    { dirty: 'Andreessen Horowitz (a16z)', clean: 'Andreessen Horowitz' },
    { dirty: 'Angelor (via For Good fund)', clean: 'Angelor' },
    { dirty: 'Arkéa Banque Entreprises et Institutionnels (ABEI)', clean: 'Arkéa Banque Entreprises et Institutionnels' },
    { dirty: 'Axeleo Capital (AXC)', clean: 'Axeleo Capital' },
    { dirty: 'Banque des Territoires (France 2030)', clean: 'Banque des Territoires' },
    { dirty: 'Big Idea Ventures (Global Food Innovation Fund II Accelerator)', clean: 'Big Idea Ventures' },
    { dirty: 'Breakthrough Energy Ventures Europe (BEV-E)', clean: 'Breakthrough Energy Ventures Europe' },
    { dirty: 'Capital Fund Management (CFM)', clean: 'Capital Fund Management' },
    { dirty: 'Caisse d\u2019\u00c9pargne Normandie Innovation (CEN Innovation)', clean: 'Caisse d\u2019\u00c9pargne Normandie Innovation' },
    { dirty: 'CIB Development (Colas Group)', clean: 'CIB Development' },
    { dirty: 'Crédit Agricole (innovation branch)', clean: 'Crédit Agricole' },
    { dirty: 'Deeptech Beta Lab (Saudi Arabia)', clean: 'Deeptech Beta Lab' },
    { dirty: 'Delmas Investissement et Participation (DIP)', clean: 'Delmas Investissement et Participation' },
    { dirty: 'Deutsche Telekom (T.Capital)', clean: 'Deutsche Telekom' },
    { dirty: 'EDF Group (Électricité de France)', clean: 'EDF Group' },
    { dirty: 'Exergon (Audacia)', clean: 'Exergon' },
    { dirty: 'FININDUS (ArcelorMittal & Région de Flandres)', clean: 'FININDUS' },
    { dirty: 'Finorpa Gestion (via Finorpa SCR)', clean: 'Finorpa Gestion' },
    { dirty: 'Fonds d\u2019Amor\u00e7age Industriel M\u00e9tropolitain (FAIM) Lyon\u2013Saint-\u00c9tienne', clean: 'Fonds d\u2019Amor\u00e7age Industriel M\u00e9tropolitain' },
    { dirty: 'Generali Impact Investment (INCO Ventures)', clean: 'Generali Impact Investment' },
    { dirty: 'Groupement des Concessionnaires Automobiles Peugeot (GCAP)', clean: 'Groupement des Concessionnaires Automobiles Peugeot' },
    { dirty: 'Heka (BrainTech vehicle of Newfund VC)', clean: 'Heka' },
    { dirty: '\u00cele-de-France Decarbonation Fund (managed by UI Investissement)', clean: '\u00cele-de-France Decarbonation Fund' },
    // Non-breaking hyphen variant → standard hyphen canonical
    { dirty: '\u00cele\u2011de\u2011France R\u00e9industrialisation (via Innovacom \u2013 Turenne Groupe)', clean: '\u00cele-de-France R\u00e9industrialisation' },
    { dirty: 'Illusian (Supercell founder)', clean: 'Illusian' },
    { dirty: 'INCO Ventures (via Abeille Impact Investing France & INCO Investissement', clean: 'INCO Ventures' },
    { dirty: 'Industrya (John Cockerill Group)', clean: 'Industrya' },
    { dirty: 'IRDI Capital Investissement (via IRDINOV3)', clean: 'IRDI Capital Investissement' },
    { dirty: 'IRD Invest (via Nord Création)', clean: 'IRD Invest' },
    { dirty: 'ISALT (la Caisse des dépôts)', clean: 'ISALT' },
    { dirty: 'Mirova (affiliated with Natixis Investment Managers)', clean: 'Mirova' },
    { dirty: 'Newfund (NAEH2 / NAEH Innopy)', clean: 'Newfund' },
    { dirty: 'Newfund Capital', clean: 'Newfund' },
    { dirty: 'Pyrénées Gascogne Développement (Crédit Agricole)', clean: 'Pyrénées Gascogne Développement' },
    { dirty: 'Racine² (managed by Serena and Makesense)', clean: 'Racine²' },
    { dirty: 'Région Sud Investissement (managed by Turenne Groupe)', clean: 'Région Sud Investissement' },
    { dirty: 'Région Sud Investissement (RSI)', clean: 'Région Sud Investissement' },

    // ===================================================================
    // CATEGORY 1 STRAGGLERS — "(lead)" / "(co-lead)" not yet stripped
    // ===================================================================
    { dirty: 'Andera Partners (lead', clean: 'Andera Partners' },
    { dirty: 'Banque des Territoires (lead', clean: 'Banque des Territoires' },
    { dirty: 'Elaia (lead)', clean: 'Elaia' },
    { dirty: 'Elaia Partners (existing)', clean: 'Elaia Partners' },
    { dirty: 'Kima Ventures (existing investor)', clean: 'Kima Ventures' },
    { dirty: 'Label Capital (existing investor)', clean: 'Label Capital' },
    { dirty: 'Mangrove Capital Partners (existing)', clean: 'Mangrove Capital Partners' },
    { dirty: 'MIG Capital (lead', clean: 'MIG Capital' },
    { dirty: 'Moonfire (lead)', clean: 'Moonfire' },
    { dirty: 'Moxxie Ventures (co-lead)', clean: 'Moxxie Ventures' },
    { dirty: 'Nickleby Capital (co-lead', clean: 'Nickleby Capital' },
    { dirty: 'Notion Capital (lead)', clean: 'Notion Capital' },
    { dirty: 'Octalfa (lead)', clean: 'Octalfa' },
    { dirty: 'OneRagtime (lead)', clean: 'OneRagtime' },
    { dirty: 'Paris Business Angels (lead)', clean: 'Paris Business Angels' },
    { dirty: 'Peak Capital (lead)', clean: 'Peak Capital' },
    { dirty: 'Pléiade Venture (lead)', clean: 'Pléiade Venture' },
    { dirty: 'Relyens Innovation Santé (lead', clean: 'Relyens Innovation Santé' },
    { dirty: 'Serena (lead', clean: 'Serena' },
    { dirty: 'Speedinvest (lead)', clean: 'Speedinvest' },
    { dirty: 'Speedinvest (new)', clean: 'Speedinvest' },
    { dirty: 'Supernova Invest (lead)', clean: 'Supernova Invest' },
    { dirty: 'Team for the Planet (lead)', clean: 'Team For The Planet' },
    { dirty: 'TomCat (lead)', clean: 'Tomcat' },
    { dirty: 'TOMCAT', clean: 'Tomcat' },
    { dirty: 'V-Bio Ventures (lead)', clean: 'V-Bio Ventures' },
    { dirty: 'Yeast (lead)', clean: 'Yeast' },

    // ===================================================================
    // SPI FUND VARIANTS
    // ===================================================================
    // First rename creates "SPI Fund"; second will merge into it
    { dirty: 'SPI Fund (Bpifrance', clean: 'SPI Fund' },
    { dirty: 'SPI Fund (Sociétés de Projets Industriels)', clean: 'SPI Fund' },

    // ===================================================================
    // FRAGMENT RECORDS MAPPING TO REAL INVESTORS
    // ===================================================================
    { dirty: 'backed by Crédit Mutuel Alliance Fédérale)', clean: 'Crédit Mutuel Alliance Fédérale' },
    { dirty: 'CPME 34)', clean: 'CPME 34' },
    { dirty: 'Fonds Révolution Environnementale et Solidaire (Crédit Mutuel Impact', clean: 'Fonds Révolution Environnementale et Solidaire' },
    { dirty: 'GO CAPITAL)', clean: 'GO Capital' },
    { dirty: 'Go Capital', clean: 'GO Capital' },
    { dirty: 'New Enterprise Associates (NEA', clean: 'New Enterprise Associates' },

    // ===================================================================
    // BLAST CLUB VARIANTS
    // ===================================================================
    { dirty: 'Blast', clean: 'Blast Club' },
    { dirty: 'Blast.club', clean: 'Blast Club' },
    { dirty: 'Blast.Club', clean: 'Blast Club' },

    // ===================================================================
    // SPELLING / FORMATTING VARIANTS
    // ===================================================================
    { dirty: 'Banque Populaire Auvergne Rhône Alpes', clean: 'Banque Populaire Auvergne-Rhône-Alpes' },
    { dirty: 'Fonds Régional Avenir Industrie Auvergne Rhône-Alpes', clean: 'Fonds Régional Avenir Industrie Auvergne-Rhône-Alpes' },
    { dirty: 'BPI France', clean: 'Bpifrance' },
    { dirty: 'Bpifrance\u200b', clean: 'Bpifrance' }, // zero-width space variant
    { dirty: '50Partners', clean: '50 Partners' },
];

// Records that are pure junk (sentence fragments with no real investor info)
// Their funding_round_investors links will be deleted first, then the record itself.
const DELETES = [
    'co-lead)',
    'lead)',
    'lead investor)',
    'existing)',
    'joining the board)',
    'avg. ticket $30K)',
    'advised by Turenne Santé)',
];

// ===================================================================
// HELPERS
// ===================================================================

async function lookupInvestor(name) {
    const { data, error } = await supabase
        .from('investors')
        .select('id, name')
        .eq('name', name)
        .maybeSingle();
    if (error) throw new Error(`Lookup failed for "${name}": ${error.message}`);
    return data; // null if not found
}

async function mergeInvestor(dirtyId, cleanId, dirtyName) {
    // Get all round links for the dirty investor
    const { data: dirtyLinks, error: linksError } = await supabase
        .from('funding_round_investors')
        .select('funding_round_id, is_lead')
        .eq('investor_id', dirtyId);
    if (linksError) throw new Error(`Failed to get links for "${dirtyName}": ${linksError.message}`);

    for (const link of dirtyLinks || []) {
        // Check if clean investor is already linked to this round
        const { data: existing } = await supabase
            .from('funding_round_investors')
            .select('funding_round_id')
            .eq('funding_round_id', link.funding_round_id)
            .eq('investor_id', cleanId)
            .maybeSingle();

        if (!existing) {
            const { error: insertError } = await supabase
                .from('funding_round_investors')
                .insert({
                    funding_round_id: link.funding_round_id,
                    investor_id: cleanId,
                    is_lead: link.is_lead,
                });
            if (insertError) throw new Error(`Failed to insert link for "${dirtyName}": ${insertError.message}`);
        }
        // If clean already linked to this round, dirty link is simply dropped
    }

    // Remove all dirty links
    const { error: deleteLinksError } = await supabase
        .from('funding_round_investors')
        .delete()
        .eq('investor_id', dirtyId);
    if (deleteLinksError) throw new Error(`Failed to delete links for "${dirtyName}": ${deleteLinksError.message}`);

    // Delete the dirty investor record
    const { error: deleteError } = await supabase
        .from('investors')
        .delete()
        .eq('id', dirtyId);
    if (deleteError) throw new Error(`Failed to delete investor "${dirtyName}": ${deleteError.message}`);
}

async function renameInvestor(investorId, newName) {
    const { error } = await supabase
        .from('investors')
        .update({ name: newName })
        .eq('id', investorId);
    if (error) throw new Error(`Failed to rename to "${newName}": ${error.message}`);
}

async function deleteInvestor(investorId, name) {
    const { error: linksError } = await supabase
        .from('funding_round_investors')
        .delete()
        .eq('investor_id', investorId);
    if (linksError) throw new Error(`Failed to delete links for "${name}": ${linksError.message}`);

    const { error } = await supabase
        .from('investors')
        .delete()
        .eq('id', investorId);
    if (error) throw new Error(`Failed to delete investor "${name}": ${error.message}`);
}

// ===================================================================
// MAIN
// ===================================================================

async function run() {
    console.log('==============================================');
    console.log('Category 4 Investor Cleanup');
    console.log('==============================================\n');

    let merged = 0, renamed = 0, deleted = 0, skipped = 0, errors = 0;

    console.log('--- Processing merge/rename operations ---\n');

    for (const op of OPERATIONS) {
        try {
            const dirtyRecord = await lookupInvestor(op.dirty);

            if (!dirtyRecord) {
                console.log(`  SKIP  (not found): "${op.dirty}"`);
                skipped++;
                continue;
            }

            const cleanRecord = await lookupInvestor(op.clean);

            if (!cleanRecord) {
                // No clean version exists — rename in-place
                await renameInvestor(dirtyRecord.id, op.clean);
                console.log(`  RENAMED: "${op.dirty}"\n           → "${op.clean}"`);
                renamed++;
            } else if (cleanRecord.id === dirtyRecord.id) {
                // Dirty and clean point to the same record (already clean)
                console.log(`  SKIP  (already clean): "${op.dirty}"`);
                skipped++;
            } else {
                // Clean version exists — merge dirty into clean
                await mergeInvestor(dirtyRecord.id, cleanRecord.id, op.dirty);
                console.log(`  MERGED: "${op.dirty}"\n          → "${op.clean}"`);
                merged++;
            }
        } catch (err) {
            console.error(`  ERROR processing "${op.dirty}": ${err.message}`);
            errors++;
        }
    }

    console.log('\n--- Deleting junk records ---\n');

    for (const name of DELETES) {
        try {
            const record = await lookupInvestor(name);
            if (!record) {
                console.log(`  SKIP  (not found): "${name}"`);
                skipped++;
                continue;
            }
            await deleteInvestor(record.id, name);
            console.log(`  DELETED: "${name}"`);
            deleted++;
        } catch (err) {
            console.error(`  ERROR deleting "${name}": ${err.message}`);
            errors++;
        }
    }

    console.log('\n==============================================');
    console.log('CLEANUP COMPLETE');
    console.log(`  Merged:  ${merged}`);
    console.log(`  Renamed: ${renamed}`);
    console.log(`  Deleted: ${deleted}`);
    console.log(`  Skipped: ${skipped} (not found or already clean)`);
    console.log(`  Errors:  ${errors}`);
    console.log('==============================================\n');

    if (errors > 0) process.exit(1);
}

run().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
});
