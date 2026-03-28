# Session Handoff Document

## Supabase Credentials

- **Project URL:** `https://tlwqkglfyjydwsgjrclx.supabase.co`
- **Service Role Key (full access):**
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd3FrZ2xmeWp5ZHdzZ2pyY2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI4OTkwMywiZXhwIjoyMDg0ODY1OTAzfQ.qZx-TCrrXn9vHpr7gQBsVtyMXNCdrBBIiLWJeG3FR6w`

## Database Schema (Key Tables)

### `companies`
- `id` (uuid), `name` (text, unique), `sector`, `hq_city`, `hq_country`, `website`, `description`, `logo_url`, `created_at`, `updated_at`

### `funding_rounds`
- `id` (uuid), `company_id` (uuid → companies), `round_type`, `amount`, `currency`, `announced_date`, `description`, `created_at`, `updated_at`

### `investors`
- `id` (uuid), `name` (text, unique), `type`, `website`, `description`, `hq_city`, `hq_country`, `logo_url`, `created_at`, `updated_at`

### `funding_round_investors` (join table)
- `funding_round_id` (uuid → funding_rounds), `investor_id` (uuid → investors), `is_lead` (bool)

## Common API Patterns

```bash
SERVICE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd3FrZ2xmeWp5ZHdzZ2pyY2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI4OTkwMywiZXhwIjoyMDg0ODY1OTAzfQ.qZx-TCrrXn9vHpr7gQBsVtyMXNCdrBBIiLWJeG3FR6w"
URL="https://tlwqkglfyjydwsgjrclx.supabase.co"

# Lookup a company
curl -s "$URL/rest/v1/companies?select=id,name&name=ilike.*CompanyName*" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE"

# Lookup an investor
curl -s "$URL/rest/v1/investors?select=id,name&name=ilike.*InvestorName*" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE"

# Get funding rounds for a company
curl -s "$URL/rest/v1/funding_rounds?select=id,company_id&company_id=eq.COMPANY_ID" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE"

# Get investors for a round
curl -s "$URL/rest/v1/funding_round_investors?select=funding_round_id,investor_id,investors(name)&funding_round_id=eq.ROUND_ID" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE"

# Create a new company
curl -s -X POST "$URL/rest/v1/companies" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"name":"Company Name","sector":"SectorName","hq_city":"Paris","hq_country":"France"}'

# Create a new funding round
curl -s -X POST "$URL/rest/v1/funding_rounds" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"company_id":"COMPANY_ID","round_type":"Seed","amount":500000,"currency":"EUR","announced_date":"2025-01-15"}'

# Create a new investor
curl -s -X POST "$URL/rest/v1/investors" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"name":"Investor Name"}'

# Link investor to round
curl -s -X POST "$URL/rest/v1/funding_round_investors" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" \
  -H "Content-Type: application/json" -H "Prefer: return=minimal" \
  -d '{"funding_round_id":"ROUND_ID","investor_id":"INVESTOR_ID","is_lead":false}'

# Rename an investor
curl -s -X PATCH "$URL/rest/v1/investors?id=eq.INVESTOR_ID" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" \
  -H "Content-Type: application/json" -H "Prefer: return=minimal" \
  -d '{"name":"Clean Name"}'

# Delete investor from round
curl -s -X DELETE "$URL/rest/v1/funding_round_investors?funding_round_id=eq.ROUND_ID&investor_id=eq.INVESTOR_ID" \
  -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" -H "Prefer: return=minimal"
```

## Key Investor IDs (frequently used)

| Investor | ID |
|---|---|
| Business Angels | `b9f28d16-f41d-43ab-bbf9-e1a1274e23b9` |
| Bpifrance | `e447093c-5d3c-4202-8088-4efdff80cdd8` |
| Kima Ventures | `8423e1e0-4808-4ef1-8b2d-d4d38e481e53` |
| 50 Partners | `eadd09e2-4af3-43a3-b168-ca4e1a1f65a2` |
| Crédit Agricole | `9a70c446-4a39-46fd-9b44-c85a4f368ec8` |
| Newfund | `fa959589-b60b-4225-8a3a-7b5163efafc0` |
| Galion.exe | `4abdd299-bc2c-4b46-a60e-547bfbf5d8c3` |
| Daphni | `bb5a7ae3-8dfa-4ff5-b164-a5b3d5f1882f` |
| Speedinvest | `7dd28d2d-f352-489e-aeb8-2d5ecce1a6f4` |
| Olivier Pomel | `7ccb463f-bee8-47fa-8991-44e6ab8640c7` |
| Entrepreneurs First | `00efe72c-bd8d-4e25-afa6-cbaac9d41c70` |
| Alven | `bcb57891-a957-49bd-b52e-6e12135080d4` |
| EQT Ventures | `2c3eff8e-182a-4baf-8ac6-0de821472938` |

## Git Branch

- **Active branch:** `claude/update-company-sectors-yXNCw`
- **Remote:** `origin`
- **Push command:** `git push -u origin claude/update-company-sectors-yXNCw`

## What We've Been Doing

Cleaning up investor records in the database by:
1. **Renaming** dirty investor names (removing parenthetical bios, "(lead)", "(co-lead)", suffixes like "(AXC)", etc.)
2. **Swapping** dirty investor records in rounds for existing clean ones (avoids duplicates)
3. **Splitting** combined investor records (e.g. "RAISE Impact; with debt financing from Société Générale" → two separate investors)
4. **Deleting** stray sentence fragments attached as investor records
5. **Adding** new deals directly to the database via REST API

## Workflow for Updating Investors

Given a list like `CompanyName: Investor1, Investor2, Investor3`:

1. Look up company ID by name
2. Look up funding round ID by company ID
3. Get current investors for the round
4. Compare current vs expected — identify renames, swaps, deletes, adds
5. Check if clean investor names already exist (to avoid unique constraint violations)
6. Execute changes via PATCH (rename), DELETE+POST (swap), DELETE (remove), POST (add)

## Workflow for Adding a New Deal

1. Check if company exists → create if not
2. Create funding round linked to company
3. For each investor: check if exists → create if not
4. Link each investor to the round via `funding_round_investors`
