#!/usr/bin/env node
/**
 * Export companies without a SIREN number to CSV
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://tlwqkglfyjydwsgjrclx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd3FrZ2xmeWp5ZHdzZ2pyY2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI4OTkwMywiZXhwIjoyMDg0ODY1OTAzfQ.qZx-TCrrXn9vHpr7gQBsVtyMXNCdrBBIiLWJeG3FR6w';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function exportNoSiren() {
  console.log('Querying companies without SIREN numbers...');

  // Fetch all companies where siren is null or empty, with funding info
  const { data, error, count } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      website,
      hq_city_name,
      hq_country,
      founded_year,
      siren,
      siret,
      funding_rounds (
        round_type,
        amount_eur,
        announced_date
      )
    `, { count: 'exact' })
    .or('siren.is.null,siren.eq.')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error querying database:', error.message);
    process.exit(1);
  }

  console.log(`Found ${count} companies without a SIREN number.`);

  // Build CSV rows
  const csvRows = [];
  csvRows.push(['Company Name', 'Website', 'City', 'Country', 'Founded Year', 'Total Funding (EUR)', 'Latest Round Type', 'Latest Round Date'].join(','));

  for (const company of data) {
    const rounds = company.funding_rounds || [];
    // Sort rounds by date descending
    rounds.sort((a, b) => new Date(b.announced_date) - new Date(a.announced_date));

    const totalFunding = rounds.reduce((sum, r) => sum + (r.amount_eur || 0), 0);
    const latestRound = rounds[0];

    const row = [
      `"${(company.name || '').replace(/"/g, '""')}"`,
      `"${(company.website || '').replace(/"/g, '""')}"`,
      `"${(company.hq_city_name || '').replace(/"/g, '""')}"`,
      `"${(company.hq_country || '').replace(/"/g, '""')}"`,
      company.founded_year || '',
      totalFunding > 0 ? totalFunding : '',
      latestRound ? `"${(latestRound.round_type || '').replace(/"/g, '""')}"` : '',
      latestRound ? (latestRound.announced_date || '') : '',
    ];
    csvRows.push(row.join(','));
  }

  const csvContent = csvRows.join('\n');
  const outputPath = path.join(__dirname, '..', 'companies-no-siren.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  console.log(`\nExported to: ${outputPath}`);
  console.log(`Total companies without SIREN: ${data.length}`);

  // Also print a summary by country/city breakdown
  const cityCount = {};
  for (const c of data) {
    const key = c.hq_city_name || 'Unknown';
    cityCount[key] = (cityCount[key] || 0) + 1;
  }
  const topCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  console.log('\nTop cities (companies without SIREN):');
  for (const [city, cnt] of topCities) {
    console.log(`  ${city}: ${cnt}`);
  }
}

exportNoSiren().catch(console.error);
