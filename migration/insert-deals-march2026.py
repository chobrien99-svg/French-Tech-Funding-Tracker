#!/usr/bin/env python3
"""
Insert new deals — March 2026.
Schema:
  companies:       name, description, website, hq_city_name, hq_country, status
  funding_rounds:  company_id, round_type, amount_eur (millions), announced_date,
                   announced_month, announced_year, notes, is_verified, source
  company_sectors: company_id, sector_id, is_primary
  investors:       name
  people:          full_name
  company_people:  company_id, person_id, role, is_current

Usage:
  export SUPABASE_SERVICE_KEY="..."
  python3 migration/insert-deals-march2026.py
"""

import json, os, sys, urllib.request, urllib.parse

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://tlwqkglfyjydwsgjrclx.supabase.co')
SERVICE_KEY  = os.environ.get('SUPABASE_SERVICE_KEY', '')

if not SERVICE_KEY:
    print('Error: SUPABASE_SERVICE_KEY required'); sys.exit(1)

HEADERS = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
}

def req(method, path, body=None, prefer=None):
    url = f'{SUPABASE_URL}/rest/v1/{path}'
    h = dict(HEADERS)
    if prefer: h['Prefer'] = prefer
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            c = resp.read(); return json.loads(c) if c else None
    except urllib.error.HTTPError as e:
        raise RuntimeError(f'HTTP {e.code} {method} /{path}: {e.read().decode()}')

def find_by_name(table, name_field, name):
    enc = urllib.parse.quote(name, safe='')
    rows = req('GET', f'{table}?select=id&{name_field}=eq.{enc}')
    return rows[0]['id'] if rows else None

def get_or_create_company(data):
    existing_id = find_by_name('companies', 'name', data['name'])
    if existing_id:
        return existing_id
    rows = req('POST', 'companies', body=data)
    return rows[0]['id']

def create_round(data):
    rows = req('POST', 'funding_rounds', body=data)
    return rows[0]['id']

def link_sector(company_id, sector_id, is_primary=False):
    req('POST', 'company_sectors',
        body={'company_id': company_id, 'sector_id': sector_id, 'is_primary': is_primary},
        prefer='resolution=ignore-duplicates,return=minimal')

def get_or_create_investor(name):
    existing_id = find_by_name('investors', 'name', name)
    if existing_id:
        return existing_id
    rows = req('POST', 'investors', body={'name': name})
    return rows[0]['id']

def link_investor(round_id, investor_id, is_lead=False):
    req('POST', 'funding_round_investors',
        body={'funding_round_id': round_id, 'investor_id': investor_id, 'is_lead': is_lead},
        prefer='resolution=ignore-duplicates,return=minimal')

def get_or_create_person(full_name):
    enc = urllib.parse.quote(full_name, safe='')
    rows = req('GET', f'people?select=id&full_name=eq.{enc}')
    if rows:
        return rows[0]['id']
    rows = req('POST', 'people', body={'full_name': full_name})
    return rows[0]['id']

def link_founder(company_id, person_id):
    req('POST', 'company_people',
        body={'company_id': company_id, 'person_id': person_id,
              'role': 'founder', 'is_current': True},
        prefer='resolution=ignore-duplicates,return=minimal')

# ── Sector ID map ─────────────────────────────────────────────────────────────
SECTORS = {
    'SpaceTech & Aerospace':    'c9460d00-f17f-49ba-8562-721d8ff30daf',
    'ClimateTech':              'bdef8de3-86df-4ec4-8b89-09f8383a3c7c',
    'DefenseTech':              '79a9b568-874e-4ef9-a161-47112af11a97',
    'DeepTech':                 '46c56169-b321-49b6-9aca-7087ce4ed8e6',
    'AI & Machine Learning':    '957f88d4-cef3-434f-9e97-d32430a0b3d1',
    'HealthTech':               '0cd71bc5-82ee-428b-904b-67b4e7e4293c',
    'FinTech':                  '4a3bb002-bae4-453b-9b37-db710032443a',
    'Web3':                     '84b033fb-d763-4c73-8923-1aac83823dd7',
    'FoodTech':                 '9cf882db-6892-4b7d-8bf2-e091ce425866',
    'E-Commerce & Retail':      'bd5b2291-c1ee-4c6a-94ce-854ac35c98d1',
    'SaaS & Enterprise':        '50d276bc-d0d5-4c1b-812d-8d2a1bbb2662',
    'CleanTech':                '7e361422-b8c7-4bf9-a790-d72d80a02e71',
    'Mobility & Transportation':'71f8d11b-5caf-4af1-86ef-6bfb9d81272c',
}

# ── Deals ─────────────────────────────────────────────────────────────────────
# amount_eur = millions of EUR (e.g., 8.2 = €8.2M)

DEALS = [
    {
        'company': {
            'name': 'Hynaero',
            'hq_city_name': 'Bordeaux',
            'hq_country': 'France',
            'website': 'https://hynaero.com/',
            'status': 'active',
            'description': (
                'Hynaero is a French aerospace startup developing next-generation '
                'amphibious water bomber aircraft designed specifically for wildfire '
                'suppression. Its flagship program, the Fregate-F100, aims to deliver '
                'a high-capacity, purpose-built aerial firefighting platform with '
                'enhanced operational performance, safety, and mission systems.'
            ),
        },
        'sectors': ['SpaceTech & Aerospace', 'ClimateTech', 'DefenseTech', 'DeepTech'],
        'rounds': [{
            'round_type': 'Series A',
            'amount_eur': 117,
            'announced_date': '2026-03-22',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://hynaero.com/wp-content/uploads/2026/03/Communique-de-Presse-Press-Release-Hynaero-Seed-A-Series-fundraising-22032026.pdf',
            'notes': (
                'Hynaero raised \u20ac117M in a combined Seed and Series A round led '
                'by Bpifrance with participation from R\u00e9gion Sud to advance its '
                'Fregate-F100 amphibious firefighting aircraft.'
            ),
            'investors': ['Bpifrance', 'R\u00e9gion Sud'],
        }],
        'founders': ['David Pincet'],
    },
    {
        'company': {
            'name': 'Leviathan Dynamics',
            'hq_city_name': 'La Courneuve',
            'hq_country': 'France',
            'website': 'https://leviathan-dynamics.com/fr/',
            'status': 'active',
            'description': (
                'Leviathan Dynamics is a French deeptech startup developing '
                'decarbonized cooling and industrial water treatment solutions based '
                'on a patented vacuum compressor technology. Its products include '
                'Turbevap, a low-temperature evaporative concentrator for industrial '
                'wastewater recycling, and Golgoth, a next-generation cooling and '
                'heating system that replaces fluorinated gases with water.'
            ),
        },
        'sectors': ['ClimateTech', 'DeepTech'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 8.2,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.banquedesterritoires.fr/leviathan-dynamics-leve-82-meu-et-ouvre-sa-premiere-usine-la-courneuve-pour-produire-du-froid-sans',
            'notes': (
                'Leviathan Dynamics raised \u20ac8.2M to scale its decarbonized '
                'cooling and water treatment technologies and opened its first factory '
                'in La Courneuve.'
            ),
            'investors': ['Keenest', 'Banque des Territoires', 'daphni',
                          'Team For The Planet'],
        }],
        'founders': ['Naoufel Menadi'],
    },
    {
        'company': {
            'name': 'EGIDE',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://www.egide-tech.com/',
            'status': 'active',
            'description': (
                'EGIDE is a French defence technology startup developing '
                'next-generation, cost-efficient defence systems to counter the '
                'growing threat of low-cost drones and strike munitions. The company '
                'is building electrically propelled interceptors and Mystique, a '
                'hardware-agnostic AI-driven software platform for multi-domain '
                'defence operations across air, ground, and maritime domains.'
            ),
        },
        'sectors': ['DefenseTech', 'DeepTech', 'AI & Machine Learning'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 8,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.egide-tech.com/post/egide-raises-8m-seed-round-led-by-expeditions-eurazeo-and-heartcore-capital-to-develop-next-gener',
            'notes': (
                'EGIDE raised \u20ac8M in a seed round co-led by Expeditions, Eurazeo, '
                'and Heartcore Capital to develop affordable, scalable defence systems.'
            ),
            'investors': ['Expeditions', 'Eurazeo', 'Heartcore Capital',
                          'Galion.exe', 'Kima Ventures'],
        }],
        'founders': ['Simon Calonne', 'Florian Audigier'],
    },
    {
        'company': {
            'name': 'DiappyMed',
            'hq_city_name': 'Montpellier',
            'hq_country': 'France',
            'website': 'https://diappymed.com/en/',
            'status': 'active',
            'description': (
                'DiappyMed is a French medtech startup developing digital solutions '
                'to personalise diabetes treatment. Its flagship product, EkiYou, is '
                'a digital therapeutic app that calculates personalised insulin doses '
                'based on meals, physical activity, and blood glucose levels, acting '
                'as a "pocket diabetologist" for patients.'
            ),
        },
        'sectors': ['HealthTech', 'AI & Machine Learning'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 5,
            'announced_date': '2026-03-23',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.maddyness.com/2026/03/23/diappymed-prend-son-envol-avec-ventech-et-sanofi-pour-mieux-traiter-le-diabete/',
            'notes': (
                'DiappyMed raised \u20ac5M in a seed round led by Ventech and AFI '
                'Ventures, with a strategic partnership secured with Sanofi.'
            ),
            'investors': ['Ventech', 'AFI Ventures', 'Sofilaro',
                          'IRDI Capital Investissement'],
        }],
        'founders': ['Omar Diouri', 'Coralie Lefevre', 'Youssef Raqui'],
    },
    {
        'company': {
            'name': 'Bitstack',  # already exists — round added only
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://www.bitstack-app.com/',
            'status': 'active',
            'description': (
                'Bitstack is a French fintech app enabling users to save and invest '
                'in Bitcoin through automated mechanisms such as rounding up everyday '
                'purchases, targeting mainstream adoption of digital assets across Europe.'
            ),
        },
        'sectors': ['FinTech', 'Web3'],
        'rounds': [{
            'round_type': 'Series A',
            'amount_eur': 3.9,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://finyear.com/bitstack-leve-45-millions-de-dollars-aupres-de-8-000-investisseurs-particuliers-un-record-europeen-de-crowdequity',
            'notes': (
                'Bitstack raised $4.5M (\u20ac3.9M) through a Crowdcube crowdequity '
                'campaign attracting 8,000+ retail investors, a European record.'
            ),
            'investors': ['Crowdcube'],
        }],
        'founders': ['Alexandre Roubaud', 'Kabir Sethi'],
    },
    {
        'company': {
            'name': 'Drinkee',
            'hq_city_name': '\u00c9wry',
            'hq_country': 'France',
            'website': 'https://www.drinkee.io/fr',
            'status': 'active',
            'description': (
                'Drinkee is a French startup developing connected self-service '
                'beverage solutions for large-scale events and venues, enabling '
                'autonomous service to reduce queues, minimize waste, and improve '
                'operational efficiency for event organizers.'
            ),
        },
        'sectors': ['FoodTech', 'E-Commerce & Retail'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 3.4,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.franceangels.org/article/drinkee-leve-des-fonds-aupres-de-business-angels/',
            'notes': (
                'Drinkee raised \u20ac3.4M from France Angels networks and institutional '
                'investors to scale its self-service beverage solution across Europe.'
            ),
            'investors': ['Provence Angels', 'Arts et M\u00e9tiers Business Angels',
                          'Force Business Angels', 'TRAIL Capital',
                          'Epsilon Value', 'RP & Partners'],
        }],
        'founders': ['Hippolyte Taliercio', 'L\u00e9o Siara', 'Adrien Germain'],
    },
    {
        'company': {
            'name': 'Piston',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://pistonhq.app/',
            'status': 'active',
            'description': (
                'Piston is building an "Agentic ERP" for mid-market companies in '
                'physical industries, leveraging AI to enable rapid deployment and '
                'autonomous execution across quoting, order management, inventory, '
                'and logistics operations.'
            ),
        },
        'sectors': ['AI & Machine Learning', 'SaaS & Enterprise'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 3,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.linkedin.com/posts/pistonhq_we-just-raised-3m-seed-led-by-daphni-to-activity-7442848021702303744-hQa8',
            'notes': (
                'Piston raised \u20ac3M in a seed round led by daphni to develop '
                'the first AI-native "Agentic ERP" for mid-market physical industries.'
            ),
            'investors': ['daphni', 'Drysdale Ventures', 'OVNI Capital',
                          'Motier Ventures', 'Kima Ventures', 'Arthur Waller',
                          'Alexandre Ducoeur Martins', 'Cedric Sellin',
                          'Flavien Kulawik', 'Eric Fourrier'],
        }],
        'founders': ['Eric Lacaille', 'Florian Bachelot'],
    },
    {
        'company': {
            'name': 'K-Motors',
            'hq_city_name': 'Peynier',
            'hq_country': 'France',
            'website': 'https://www.kmotors.tech/en/',
            'status': 'active',
            'description': (
                'K-Motors is a French DeepTech company developing high-power '
                'electronic switching systems for electric mobility. Its core '
                'innovation, the PowerSwitcher, replaces multiple traditional '
                'components to improve battery protection, reliability, and energy '
                'efficiency in electric vehicles.'
            ),
        },
        'sectors': ['DeepTech', 'CleanTech', 'Mobility & Transportation'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 3,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://presse.bpifrance.fr/bpifrance-via-son-fonds-bpifrance-amorcage-industriel-kyocera-ventures-region-sud-investissement-lcl-societe-generale-et-cepac-accompagnent-k-motors-dans-sa-nouvelle-etape-de-croissance/',
            'notes': (
                'K-Motors raised \u20ac5M total (\u20ac3M equity + \u20ac2M debt) to '
                'scale its PowerSwitcher technology for electric vehicles, with backing '
                'from Bpifrance, Kyocera Ventures, and regional partners.'
            ),
            'investors': ['Bpifrance', 'Kyocera Ventures', 'R\u00e9gion Sud Investissement',
                          'LCL', 'Soci\u00e9t\u00e9 G\u00e9n\u00e9rale', 'CEPAC'],
        }],
        'founders': ['Nelson Lukes'],
    },
    {
        'company': {
            'name': 'Nabu',
            'hq_city_name': 'Strasbourg',
            'hq_country': 'France',
            'website': 'https://www.nabu.io/',
            'status': 'active',
            'description': (
                'Nabu is a French startup developing an AI-powered platform to '
                'automate customs declarations and streamline cross-border trade '
                'operations, transforming shipping documents into ready-to-submit '
                'customs filings.'
            ),
        },
        'sectors': ['AI & Machine Learning', 'SaaS & Enterprise'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 3,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.linkedin.com/posts/nabu-io_nabu-l%C3%A8ve-3-millions-deuros-nous-construisons-activity-7443326836056645633-TH_h',
            'notes': (
                'Nabu raised \u20ac3M led by Getlink, which acquired a 24.9% stake, '
                'to automate customs processes and expand across Europe.'
            ),
            'investors': ['Getlink', 'Maersk Growth', 'InvestorX',
                          'Team Ignite Ventures', 'Techstars'],
        }],
        'founders': ['Arnaud Doly'],
    },
    {
        'company': {
            'name': 'MindDay',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'http://mindday.com/',
            'status': 'active',
            'description': (
                'MindDay is a French mental health app built on cognitive behavioural '
                'therapy (CBT) principles, offering 60+ guided programs and 300+ '
                'interactive sessions. Operating via a B2B2C model, it integrates into '
                'insurance and employer ecosystems to deliver preventive mental health '
                'services at scale.'
            ),
        },
        'sectors': ['HealthTech'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 2,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.frenchweb.fr/mindday-leve-2-millions-deuros-et-sappuie-sur-les-mutuelles-pour-structurer-sa-croissance/460933',
            'notes': (
                'MindDay raised \u20ac2M to accelerate its shift toward distribution '
                'via insurers and mutuals, with access to nearly 10M insured users '
                'through the Santéclair ecosystem.'
            ),
            'investors': ['Impactivist', 'INCO', 'Mutuelles Impact', 'XAnge'],
        }],
        'founders': ['Boris Pourreau'],
    },
    # ── Batch 2 ─────────────────────────────────────────────────────────────
    {
        'company': {
            'name': 'Standing Ovation',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://standing-ovation.co/',
            'status': 'active',
            'description': (
                'Standing Ovation is a French foodtech startup producing animal-free dairy proteins '
                'using precision fermentation. Its core innovation enables the production of casein—the '
                'key protein in milk—without livestock, allowing manufacturers to recreate dairy products '
                'such as cheese, yogurt, and cream with identical functional properties while significantly '
                'reducing environmental impact. The company operates a B2B model, supplying food, nutrition, '
                'and future health/cosmetics players with sustainable protein ingredients.'
            ),
        },
        'sectors': ['FoodTech', 'ClimateTech', 'BioTech'],
        'rounds': [{
            'round_type': 'Series B',
            'amount_eur': 25,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.lesechos.fr/start-up/ecosysteme/on-va-ouvrir-la-voie-avec-standing-ovation-la-foodtech-reprend-des-couleurs-2224029',
            'notes': (
                'Standing Ovation raised \u20ac30M in a Series B round, including \u20ac25M in equity, '
                'to scale the industrial production and commercialization of its precision-fermented casein.'
            ),
            'investors': ['Danone Ventures', 'Cr\u00e9dit Mutuel', 'Angelor', 'Bel Group',
                          'Bpifrance', 'Astanor', 'Seventure Partners', 'Good Startup', 'Big Idea Ventures'],
        }],
        'founders': ['Romain Chayot', 'Yvan Chardonnens'],
    },
    {
        'company': {
            'name': 'SCorp-io',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://www.scorp-io.com/',
            'status': 'active',
            'description': (
                'SCorp-io is a French startup developing an intelligent building management system (BMS/GTB) '
                'for mid-sized tertiary buildings. Its solution combines plug-and-play hardware with AI-driven '
                'software to connect, model, and optimize existing building equipment.'
            ),
        },
        'sectors': ['ClimateTech', 'PropTech', 'AI & Machine Learning', 'SaaS & Enterprise'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 5,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.frenchweb.fr/scorp-io-leve-5-millions-deuros-pour-industrialiser-la-decarbonation-des-batiments-intermediaires/461083',
            'notes': (
                'SCorp-io raised \u20ac5M to accelerate deployment of its AI-powered BMS targeting '
                'mid-sized commercial buildings. Deployed across 250+ sites, enabling 20\u201340% energy savings.'
            ),
            'investors': ['\u00cele-de-France D\u00e9carbonation Fund'],
        }],
        'founders': ['Jean-Romain Bardet', 'C\u00e9dric Godefroy', 'Bastien Robinot'],
    },
    {
        'company': {
            'name': 'AI6 Technologies',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://ai6technologies.fr/',
            'status': 'active',
            'description': (
                'AI6 Technologies is a French assurtech startup developing AI- and big-data-powered solutions '
                'for risk prevention and claims management in the insurance sector.'
            ),
        },
        'sectors': ['AI & Machine Learning', 'ClimateTech', 'SaaS & Enterprise'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 4,
            'announced_date': '2026-03-30',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://tribune-assurance.optionfinance.fr/depeches/d/2026-03-30-generali-france-et-socadif-entrent-au-capital-dai6-technologies.html',
            'notes': (
                'AI6 Technologies raised nearly \u20ac4M from Generali France and SOCADIF Capital '
                'Investissement to develop AI-based insurance tools for climate risk prevention and claims automation.'
            ),
            'investors': ['Generali France', 'SOCADIF Capital Investissement'],
        }],
        'founders': ['Alain Tabatabai', 'S\u00e9bastien Drouyer'],
    },
    {
        'company': {
            'name': 'Kestra',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://kestra.io/',
            'status': 'active',
            'description': (
                'Kestra is an open-source orchestration platform enabling enterprises to coordinate data '
                'pipelines, AI workflows, infrastructure automation, and business processes within a unified '
                'control plane across cloud, on-premises, and AI systems.'
            ),
        },
        'sectors': ['AI & Machine Learning', 'SaaS & Enterprise'],
        'rounds': [{
            'round_type': 'Series A',
            'amount_eur': 23,
            'announced_date': '2026-03-31',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://tech.eu/2026/03/31/kestra-raises-25m-series-a-to-build-the-enterprise-orchestration-standard/',
            'notes': (
                'Kestra raised $25M (\u20ac23M) in a Series A led by RTP Global to accelerate its enterprise '
                'orchestration platform. Over 30,000 organizations use its open-source solution.'
            ),
            'investors': ['RTP Global', 'Alven', 'ISAI', 'Axeleo'],
        }],
        'founders': ['Emmanuel Darras', 'Ludovic Dehon'],
    },
    {
        'company': {
            'name': 'Loamics',
            'hq_city_name': 'Boulogne-Billancourt',
            'hq_country': 'France',
            'website': 'http://loamics.com/',
            'status': 'active',
            'description': (
                'Loamics is the healthcare data subsidiary of Energisme, focused on leveraging data analytics '
                'to support healthcare systems and improve decision-making across medical, operational, and '
                'research use cases.'
            ),
        },
        'sectors': ['HealthTech', 'MedTech', 'SaaS & Enterprise'],
        'rounds': [{
            'round_type': 'Growth',
            'amount_eur': 3,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://webdisclosure.com/article/energisme-epa-alnrg-5-million-investment-for-energismes-healthcare-subsidiary-GOgfVjYqnfz',
            'notes': (
                'Energisme secured \u20ac5M for Loamics from Vatel Capital: \u20ac3M equity + \u20ac2M '
                'convertible bonds. Loamics generated its first revenues in 2025 via the P4DP consortium.'
            ),
            'investors': ['Vatel Capital'],
        }],
        'founders': [],
    },
    {
        'company': {
            'name': 'Lifebloom',
            'hq_country': 'France',
            'website': 'https://www.lifebloom.eu/',
            'status': 'active',
            'description': (
                'Lifebloom is a French medtech startup developing an integrated exoskeleton-based therapy '
                'to restore autonomous walking for patients with mobility impairments, combining a '
                'chair-exoskeleton device, gait analysis, and a digital care platform.'
            ),
        },
        'sectors': ['HealthTech', 'MedTech', 'Robotics'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 6,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.mind.eu.com/health/article/lifebloom-leve-8-me-pour-deployer-sa-therapie-basee-sur-un-fauteuil-exosquelette/',
            'notes': (
                'Lifebloom raised \u20ac8M total (\u20ac6M equity + \u20ac2M France 2030) to industrialize '
                'its exoskeleton therapy. Targets 30 hospitals and 1,000 patients regaining autonomous walking by 2028.'
            ),
            'investors': ['Business Angels', 'France 2030'],
        }],
        'founders': ['Damien Roche'],
    },
    {
        'company': {
            'name': 'Fairglow',
            'hq_city_name': 'Paris',
            'hq_country': 'France',
            'website': 'https://www.fairglow.io/',
            'status': 'active',
            'description': (
                'Fairglow is a French sustainability data platform for the beauty and health industries, '
                'enabling companies to measure, report, and reduce product-level environmental impacts through '
                'LCA, carbon accounting, and AI-powered eco-design tools.'
            ),
        },
        'sectors': ['ClimateTech', 'SaaS & Enterprise'],
        'rounds': [{
            'round_type': 'Seed',
            'amount_eur': 3,
            'announced_date': '2026-03-01',
            'announced_month': '3',
            'announced_year': 2026,
            'is_verified': True,
            'source': 'ftj',
            'news_url': 'https://www.esgtoday.com/fairglow-raises-e3-million-to-decarbonize-beauty-supply-chain/',
            'notes': (
                'Fairglow raised \u20ac3M in a seed round co-led by Ternel and SWEN Capital Partners '
                'to scale its sustainability platform for cosmetics and health, serving 50+ industry players.'
            ),
            'investors': ['Ternel', 'SWEN Capital Partners', 'Kima Ventures'],
        }],
        'founders': ['Quentin Carayon', 'Evan Peters'],
    },
]

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print('==============================================')
    print('Inserting Deals — March 2026')
    print('==============================================\n')

    ok = err = 0

    for deal in DEALS:
        name = deal['company']['name']
        try:
            # 1. Get or create company
            company_id = get_or_create_company(deal['company'])

            # 2. Link sectors (skip if already linked)
            for i, sector_name in enumerate(deal.get('sectors', [])):
                sid = SECTORS.get(sector_name)
                if sid:
                    link_sector(company_id, sid, is_primary=(i == 0))

            # 3. Create funding round(s)
            for rnd in deal['rounds']:
                round_body = {k: v for k, v in rnd.items() if k != 'investors'}
                round_body['company_id'] = company_id
                round_id = create_round(round_body)
                for i, inv_name in enumerate(rnd['investors']):
                    inv_id = get_or_create_investor(inv_name)
                    link_investor(round_id, inv_id, is_lead=(i == 0))

            # 4. Link founders
            for founder in deal.get('founders', []):
                pid = get_or_create_person(founder)
                link_founder(company_id, pid)

            inv_list = ', '.join(deal['rounds'][0]['investors'])
            print(f'  \u2713 {name}: {inv_list}')
            ok += 1

        except Exception as e:
            print(f'  ERROR {name}: {e}')
            err += 1

    print(f'\n  Done \u2014 {ok} inserted, {err} errors\n')
    if err:
        sys.exit(1)

if __name__ == '__main__':
    main()
