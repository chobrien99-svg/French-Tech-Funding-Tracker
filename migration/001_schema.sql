-- =============================================
-- FRENCH TECH INTELLIGENCE PLATFORM
-- Supabase Database Schema
-- Version: 1.0
-- =============================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CORE ENTITY TABLES
-- =============================================

-- CITIES (for geographic analysis and normalization)
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region TEXT,
    country TEXT DEFAULT 'France',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(name, country)
);

-- SECTORS (normalized sector list)
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    parent_sector_id UUID REFERENCES sectors(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPANIES (central entity)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    hq_city_id UUID REFERENCES cities(id),
    hq_city_name TEXT, -- denormalized for convenience
    hq_country TEXT DEFAULT 'France',
    founded_year INTEGER,
    status TEXT DEFAULT 'active',
    logo_url TEXT,
    siren TEXT,
    siret TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PEOPLE (founders, executives, inventors)
CREATE TABLE IF NOT EXISTS people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    linkedin_url TEXT,
    twitter_url TEXT,
    email TEXT,
    bio TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVESTORS (VCs, angels, corporate, government)
CREATE TABLE IF NOT EXISTS investors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT,
    website TEXT,
    description TEXT,
    hq_city TEXT,
    hq_country TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(name)
);

-- =============================================
-- FUNDING TABLES
-- =============================================

-- FUNDING ROUNDS
CREATE TABLE IF NOT EXISTS funding_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    round_type TEXT,
    amount_eur DECIMAL(15, 2),
    announced_date DATE,
    announced_month TEXT,
    announced_year INTEGER DEFAULT 2025,
    valuation_eur DECIMAL(15, 2),
    news_url TEXT,
    press_release_url TEXT,
    notes TEXT,
    is_verified BOOLEAN DEFAULT false,
    source TEXT DEFAULT 'ftj',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- JUNCTION/RELATIONSHIP TABLES
-- =============================================

-- COMPANY <-> PEOPLE
CREATE TABLE IF NOT EXISTS company_people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'founder',
    is_current BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, person_id, role)
);

-- COMPANY <-> SECTORS
CREATE TABLE IF NOT EXISTS company_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, sector_id)
);

-- FUNDING ROUND <-> INVESTORS
CREATE TABLE IF NOT EXISTS funding_round_investors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funding_round_id UUID NOT NULL REFERENCES funding_rounds(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
    is_lead BOOLEAN DEFAULT false,
    investment_amount_eur DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(funding_round_id, investor_id)
);

-- =============================================
-- FUTURE TABLES (commented out for now)
-- =============================================

-- Patents table for INPI integration
-- CREATE TABLE IF NOT EXISTS patents (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     company_id UUID REFERENCES companies(id),
--     inpi_number TEXT,
--     title TEXT NOT NULL,
--     abstract TEXT,
--     filing_date DATE,
--     publication_date DATE,
--     status TEXT,
--     classification_codes TEXT[],
--     source TEXT DEFAULT 'inpi',
--     raw_data JSONB,
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS patent_inventors (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     patent_id UUID NOT NULL REFERENCES patents(id) ON DELETE CASCADE,
--     person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
--     is_primary BOOLEAN DEFAULT false,
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     UNIQUE(patent_id, person_id)
-- );

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_hq_city ON companies(hq_city_name);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_company ON funding_rounds(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_year ON funding_rounds(announced_year);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_type ON funding_rounds(round_type);
CREATE INDEX IF NOT EXISTS idx_company_people_company ON company_people(company_id);
CREATE INDEX IF NOT EXISTS idx_company_people_person ON company_people(person_id);
CREATE INDEX IF NOT EXISTS idx_company_sectors_company ON company_sectors(company_id);
CREATE INDEX IF NOT EXISTS idx_company_sectors_sector ON company_sectors(sector_id);
CREATE INDEX IF NOT EXISTS idx_people_name ON people(full_name);
CREATE INDEX IF NOT EXISTS idx_investors_name ON investors(name);

-- =============================================
-- ROW LEVEL SECURITY (for future paid tiers)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_round_investors ENABLE ROW LEVEL SECURITY;

-- For now, allow public read access (adjust for paid tiers later)
CREATE POLICY "Allow public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON people FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON investors FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sectors FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON funding_rounds FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON company_people FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON company_sectors FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON funding_round_investors FOR SELECT USING (true);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Comprehensive funding view with all related data
CREATE OR REPLACE VIEW v_funding_complete AS
SELECT
    c.id AS company_id,
    c.name AS company_name,
    c.description AS company_description,
    c.website AS company_website,
    c.hq_city_name,
    fr.id AS funding_round_id,
    fr.round_type,
    fr.amount_eur,
    fr.announced_month,
    fr.announced_year,
    fr.news_url,
    COALESCE(
        (SELECT json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug, 'color', s.color))
         FROM company_sectors cs
         JOIN sectors s ON cs.sector_id = s.id
         WHERE cs.company_id = c.id),
        '[]'::json
    ) AS sectors,
    COALESCE(
        (SELECT json_agg(json_build_object('id', p.id, 'name', p.full_name, 'linkedin', p.linkedin_url, 'role', cp.role))
         FROM company_people cp
         JOIN people p ON cp.person_id = p.id
         WHERE cp.company_id = c.id),
        '[]'::json
    ) AS founders,
    COALESCE(
        (SELECT json_agg(json_build_object('id', i.id, 'name', i.name, 'is_lead', fri.is_lead))
         FROM funding_round_investors fri
         JOIN investors i ON fri.investor_id = i.id
         WHERE fri.funding_round_id = fr.id),
        '[]'::json
    ) AS investors
FROM companies c
JOIN funding_rounds fr ON c.id = fr.company_id
ORDER BY fr.announced_year DESC, fr.announced_month DESC, fr.amount_eur DESC NULLS LAST;

-- Summary stats view
CREATE OR REPLACE VIEW v_funding_stats AS
SELECT
    COUNT(DISTINCT c.id) AS total_companies,
    COUNT(fr.id) AS total_rounds,
    SUM(fr.amount_eur) AS total_funding_eur,
    AVG(fr.amount_eur) AS avg_round_eur,
    COUNT(DISTINCT s.id) AS total_sectors,
    COUNT(DISTINCT c.hq_city_name) AS total_cities
FROM companies c
LEFT JOIN funding_rounds fr ON c.id = fr.company_id
LEFT JOIN company_sectors cs ON c.id = cs.company_id
LEFT JOIN sectors s ON cs.sector_id = s.id;
