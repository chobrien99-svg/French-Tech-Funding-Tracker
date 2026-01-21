#!/usr/bin/env node

/**
 * Migration script: Convert sector (string) to sectors (array)
 * This script updates funding-data.json to support multiple sectors per company
 */

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'funding-data.json');

console.log('Reading funding-data.json...');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log(`Found ${data.length} companies`);

let migrated = 0;
let skipped = 0;

// Transform each company entry
data.forEach((company, index) => {
  // If company has old 'sector' field (string), convert to 'sectors' array
  if (company.sector && typeof company.sector === 'string') {
    company.sectors = [company.sector];
    delete company.sector;
    migrated++;
  }
  // If already has 'sectors' array, skip
  else if (Array.isArray(company.sectors)) {
    skipped++;
  }
  // If has neither, add empty sectors array
  else {
    company.sectors = [];
  }
});

console.log(`Migrated: ${migrated} companies`);
console.log(`Already using sectors array: ${skipped} companies`);

// Write back to file with pretty formatting
console.log('Writing updated data...');
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');

console.log('✓ Migration complete!');
