# French Tech Funding - Database Migration

This migration tool converts the `funding-data.json` file into a normalized PostgreSQL database hosted on Supabase.

## Why Supabase?

The French Tech Journal is building a comprehensive intelligence platform that will eventually include:
- Funding rounds (current)
- Founder profiles
- Patent data (via INPI API)
- Company registrations
- News tracking
- And more...

Supabase provides:
- **PostgreSQL database** with proper relational structure
- **Built-in authentication** for paid subscriber tiers
- **Row Level Security** to control data access by subscription level
- **Auto-generated REST API** for the frontend
- **Real-time subscriptions** for live updates
- **Free tier** generous enough to start

---

## Quick Start with Supabase CLI (Recommended)

### 1. Install the Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux (via Homebrew)
brew install supabase/tap/supabase

# Or via npm (npx)
npx supabase --version
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link to Your Project

```bash
# From the project root directory
supabase link --project-ref tlwqkglfyjydwsgjrclx
```

You'll be prompted for your database password.

### 4. Push the Schema to Production

```bash
supabase db push
```

This will run all migrations in `supabase/migrations/` against your production database.

### 5. Run the Data Migration Script

After the schema is in place, populate the data:

```bash
cd migration
npm install
export SUPABASE_URL="https://tlwqkglfyjydwsgjrclx.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key"
npm run migrate
```

---

## Optional: Run Insert Scripts via GitHub Actions

If you prefer to run `insert-deals.js` from GitHub, use the workflow at
`.github/workflows/supabase-insert-deals.yml`. Set repository secrets:

- `SUPABASE_URL` (project URL, e.g. `https://tlwqkglfyjydwsgjrclx.supabase.co`)
- `SUPABASE_SERVICE_KEY` (service role key)

Then trigger **Actions → Supabase insert deals** and provide the script name
relative to `migration/` (default: `insert-deals.js`).

---

## Alternative: Manual SQL Setup

If you prefer not to use the CLI, see the manual setup instructions below.

---

## Database Schema

The schema creates the following tables:

### Core Entities
| Table | Purpose |
|-------|---------|
| `companies` | Startup/company profiles |
| `people` | Founders, executives, inventors |
| `investors` | VCs, angels, corporate investors |
| `sectors` | Industry categories |
| `cities` | Geographic locations |

### Funding Data
| Table | Purpose |
|-------|---------|
| `funding_rounds` | Individual funding events |

### Relationships
| Table | Purpose |
|-------|---------|
| `company_people` | Links founders to companies |
| `company_sectors` | Links sectors to companies |
| `funding_round_investors` | Links investors to funding rounds |

### Views
| View | Purpose |
|------|---------|
| `v_funding_complete` | Full funding data with related entities |
| `v_funding_stats` | Aggregate statistics |

## Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose a name (e.g., "french-tech-journal")
4. Set a secure database password
5. Select a region (eu-west-1 for France)
6. Wait for the project to be created (~2 minutes)

### Step 2: Run the Schema SQL

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `001_schema.sql`
4. Paste into the SQL editor
5. Click **Run**

You should see all tables created successfully.

### Step 3: Get Your API Keys

1. Go to **Project Settings** > **API**
2. Copy the **Project URL** (e.g., `https://abc123.supabase.co`)
3. Copy the **service_role key** (NOT the anon key)
   - The service role key bypasses Row Level Security, which is needed for migration

### Step 4: Configure Environment

```bash
cd migration

# Copy the example env file
cp .env.example .env

# Edit .env with your Supabase credentials
nano .env
```

Or set environment variables directly:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key"
```

### Step 5: Install Dependencies

```bash
cd migration
npm install
```

### Step 6: Run the Migration

```bash
npm run migrate
```

You should see output like:

```
=============================================
French Tech Funding - JSON to Supabase Migration
=============================================

Loaded 687 companies from JSON

[1/687] Processing: CyGO Entrepreneurs
[2/687] Processing: AYDO
...
[687/687] Processing: Some Company

=============================================
MIGRATION COMPLETE
=============================================
Companies:      687
Funding Rounds: 687
Sectors:        14
Investors:      523
People:         891
Cities:         45
Errors:         0
=============================================

Migration completed successfully!
```

### Step 7: Verify the Data

In Supabase, go to **Table Editor** and check:
- `companies` table has your data
- `funding_rounds` has amount and round type
- `people` has parsed founder names and LinkedIn URLs
- `investors` has unique investor list

You can also run queries in the SQL Editor:

```sql
-- Total funding by sector
SELECT s.name, SUM(fr.amount_eur) as total
FROM sectors s
JOIN company_sectors cs ON s.id = cs.sector_id
JOIN companies c ON cs.company_id = c.id
JOIN funding_rounds fr ON c.id = fr.company_id
GROUP BY s.id
ORDER BY total DESC;

-- Top investors by deal count
SELECT i.name, COUNT(*) as deals
FROM investors i
JOIN funding_round_investors fri ON i.id = fri.investor_id
GROUP BY i.id
ORDER BY deals DESC
LIMIT 20;
```

## Data Parsing Notes

### Founders
The migration script parses founder strings like:
- `"John Smith (https://linkedin.com/in/johnsmith)"` → name + LinkedIn
- `"John Smith, Jane Doe"` → two founders, no LinkedIn
- `"John Smith"` → single founder

### Investors
Comma-separated investor lists are split into individual records:
- `"BNP Paribas, Bpifrance, Kima Ventures"` → 3 investor records

### Sectors
The sectors array is normalized into a separate table with:
- Unique names
- URL-friendly slugs
- Color codes for UI display

## Extending the Schema

### Adding Patent Data (Future)

When you integrate INPI, uncomment the patent tables in `001_schema.sql`:

```sql
CREATE TABLE patents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    inpi_number TEXT,
    title TEXT NOT NULL,
    ...
);

CREATE TABLE patent_inventors (
    patent_id UUID REFERENCES patents(id),
    person_id UUID REFERENCES people(id),
    ...
);
```

This links patents to both companies and individual inventors (who may already exist in the `people` table as founders).

### Adding Subscription Tiers (Future)

The `user_profiles` table (currently commented out) will extend Supabase Auth:

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    subscription_tier TEXT DEFAULT 'free',
    stripe_customer_id TEXT,
    ...
);
```

Then update Row Level Security policies:

```sql
-- Only show full data to paid users
CREATE POLICY "Paid users see all" ON funding_rounds
FOR SELECT USING (
    auth.jwt() ->> 'subscription_tier' IN ('pro', 'enterprise')
);

-- Free users see limited data
CREATE POLICY "Free users see summary" ON funding_rounds
FOR SELECT USING (
    auth.jwt() ->> 'subscription_tier' = 'free'
    AND amount_eur IS NULL  -- Hide exact amounts
);
```

## Troubleshooting

### "Permission denied" errors
Make sure you're using the **service_role** key, not the **anon** key.

### Duplicate key errors
The migration uses `UPSERT` for most entities, so re-running should be safe. If you need a clean start:

```sql
TRUNCATE companies, people, investors, sectors, cities,
         funding_rounds, company_people, company_sectors,
         funding_round_investors CASCADE;
```

### Rate limiting
Supabase has generous rate limits, but if you hit them, add a small delay:

```javascript
// In migrate.js, add after each company:
await new Promise(resolve => setTimeout(resolve, 50));
```

## Next Steps

After migration, you'll need to:

1. **Update the frontend** to fetch from Supabase API instead of JSON
2. **Set up authentication** for subscriber access
3. **Configure RLS policies** for different subscription tiers
4. **Build an admin dashboard** for adding new funding rounds

See the main project README for frontend integration instructions.
