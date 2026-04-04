#!/usr/bin/env python3
"""
Batch investor update script.
For each company: clears existing investor links and sets them to the specified list.
Usage:
  export SUPABASE_SERVICE_KEY="..."
  python3 migration/update-investors-batch.py
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
            c = resp.read()
            return json.loads(c) if c else None
    except urllib.error.HTTPError as e:
        raise RuntimeError(f'HTTP {e.code} {method} /{path}: {e.read().decode()}')

def find_company(name):
    enc = urllib.parse.quote(name, safe='')
    rows = req('GET', f'companies?select=id,name&name=ilike.{enc}')
    return rows[0] if rows else None

def get_rounds(company_id):
    return req('GET', f'funding_rounds?select=id&company_id=eq.{company_id}') or []

def get_round_investor_amounts(round_id):
    """Return {investor_id: investment_amount_eur} for existing links (None values excluded)."""
    rows = req('GET', f'funding_round_investors?select=investor_id,investment_amount_eur&funding_round_id=eq.{round_id}') or []
    return {r['investor_id']: r['investment_amount_eur'] for r in rows if r['investment_amount_eur'] is not None}

def clear_round_investors(round_id):
    req('DELETE', f'funding_round_investors?funding_round_id=eq.{round_id}', prefer='return=minimal')

def upsert_investor(name):
    enc = urllib.parse.quote(name, safe='')
    rows = req('GET', f'investors?select=id&name=eq.{enc}')
    if rows:
        return rows[0]['id']
    # Not found — create it
    try:
        rows = req('POST', 'investors', body={'name': name})
        return rows[0]['id']
    except RuntimeError as e:
        if '23505' in str(e) or '409' in str(e):
            # Race condition — fetch again
            rows = req('GET', f'investors?select=id&name=eq.{enc}')
            return rows[0]['id'] if rows else None
        raise

def link_investor(round_id, investor_id, is_lead=False, investment_amount_eur=None):
    body = {'funding_round_id': round_id, 'investor_id': investor_id, 'is_lead': is_lead}
    if investment_amount_eur is not None:
        body['investment_amount_eur'] = investment_amount_eur
    req('POST', 'funding_round_investors', body=body,
        prefer='resolution=ignore-duplicates,return=minimal')

# ── Company → investor list ──────────────────────────────────────────────────
UPDATES = [
    ('SCAP Hologram',       ['eCential Robotics', 'Stéphane Lavallée', 'Delphine Henry',
                              'Haventure', 'Bpifrance', 'BNP Paribas', 'Surosh',
                              'MinMaxMedical', "Caisse d'Épargne Rhône-Alpes Auvergne"]),
    ('Stellaria',           ['Schneider Electric', 'CEA Investissement', 'Orano',
                              'Supernova Invest', 'Technip Energies', 'Audacia',
                              'France 2030']),
    ('AFYREN',              ['Bpifrance']),
    ('RockFi',              ['Félix Blossier', 'Varsity', 'Arthur Waller',
                              'Business Angels', 'Partech', 'Mark Ransford']),
    ('KEEY AEROGEL',        ['NCI', 'Bpifrance', 'Wind Capital', 'Capital Grand Est']),
    ('Axoltis Pharma',      ['Simba Santé 2', 'Business Angels', 'Capital Cell',
                              'Fonds Régional Avenir Industrie Auvergne-Rhône-Alpes',
                              'FaDièse 3', 'Le Cercle de Chiron', 'Norfoalk',
                              'FIDAT Ventures', 'Cenitz']),
    ('Lexip (formerly Pixminds)', ['Undisclosed']),
    ('Spiko',               ['Harsh Sinh', 'Index Ventures', 'Business Angels',
                              'Nik Storonsky']),
    ('Tafalgie Therapeutics', ['Bpifrance', 'European Innovation Council (EIC)']),
    ('NcodiN',              ['Elaia', 'Maverick Silicon', 'MIG Capital',
                              'Verve Ventures', 'OVNI', 'PhotonVentures', 'Earlybird']),
    ('Equitable Earth',     ['AENU', 'noa', 'Localglobe']),
    ('RDS',                 ['MACSF', 'SPI Fund', 'Critical Path Ventures',
                              'Capital Grand Est']),
    ('Seyna',               ['Elaia', 'White Star Capital', '115k']),
    ('EVerZom',             ['European Innovation Council (EIC) Fund', 'Sorbonne Venture',
                              'Paris Business Angels', 'Aloe Private Equity',
                              'Capital Grand Est', 'Capital Cell']),
    ('StemInov',            ['Angels Santé', 'Business Angels', 'Alsace Business Angels',
                              'Codexial', 'Finovam Gestion et ILP', 'France 2030',
                              'Bpifrance']),
    ('Qovery',              ['Sebastian Pahl', 'Ott Kaukver', 'Irregular Expressions',
                              'IRIS', 'Speedinvest', 'Crane Venture Partners',
                              'Business Angels', 'Olivier Pomel', 'Alexis Le-Quoc',
                              'Techstars']),
    ('Goodvest',            ['AG2R La Mondiale', 'Serena', 'Ring Capital',
                              'Polytechnique Ventures', 'Globivest']),
    ('Ambos Energy',        ['Bpifrance', 'France 2030', 'Eurazeo', 'Ecotechnologies 2']),
    ('ROFIM',               ['Crédit Agricole Alpes Provence', 'Buenavista Equity Partners',
                              'Orange Ventures', 'Banque des Territoires',
                              'Région Sud Investissement', 'Buena Vista Capital']),
    ('Fairmat',             ['Infinity Recycling']),
    ('TiHive',              ['EIC Fund', 'Wind Capital', 'Karista']),
    ('Groupe Akacia',       ['LCL Dijon', 'Elevation Capital Partners', 'BNP Paribas',
                              "Caisse d'Epargne Bourgogne Franche-Comté",
                              'Crédit Agricole Champagne-Bourgogne']),
    ('Tsuga',               ['General Catalyst', 'Singular', 'Business Angels',
                              'Charles Gorintin', 'Jonathan Benhamou',
                              'Olivier Bonnet', 'Philippe Corrot']),
    ('Nutropy',             ['Zero Carbon Capital', 'Novax', 'Big Pi Ventures', 'Wyngate',
                              'Bpifrance', 'PVS Investments', 'Desai Ventures',
                              'Deeptech Beta Lab']),
    ('HiQuTe Diamond',      ['iXcore', 'TF Participations', 'Socadif',
                              'Île-de-France Reindustrialization Fund',
                              'The French Tech Seed', 'Bpifrance', 'France 2030']),
    ('Dillico',             ['GP Compas', 'Deeperly',
                              'Fonds Régional Avenir Industrie Auvergne-Rhône-Alpes',
                              'Deepbright One', 'Angelor', 'The French Tech Seed',
                              'France 2030', 'Bpifrance']),
    ('ELWAVE',              ['BlueInvest Readiness Assistance']),
    ('Ciloa',               ['France 2030', 'Bpifrance']),
    ('Primaa',              ['SWEN Capital Partners', 'Super Capital', "MH Innov'",
                              'Elaia']),
    # Batch 6
    ('Cementic',               ['Blast Club', 'Business Angels']),
    ('Igonogo',                ['Family Offices']),
    ('Dialog',                 ['Galion.exe', 'Kima Ventures', 'Weaving Group', 'Business Angels', 'Hexa']),
    ('Reekom',                 ['Kimpa', 'Business Angels', 'Alpha Star', 'Super Capital']),
    ('Green Spot Technologies',['Business Angels', 'EIC Accelerator', 'Team For The Planet']),
    ('Volta Software',         ['Robin Capital', 'Emblem', 'Pascal Houillon', 'Founders Future', 'RTP Global', 'Business Angels']),
    ('Playse',                 ['Sowefund', 'Seventure Partners', 'Business Angels']),
    ('hummingbirds',           ['British International Investment', 'Sowefund', 'Proparco']),
    ('Wilgo',                  ['Kima Ventures', 'Amaury Sepulchre', 'Epsilon Venture Partners',
                                 'Thibaud Hug de Larauze', 'daphni', 'Better Angle', 'Founders Future',
                                 'Nathalie Balla', 'Sequoia', 'Simon Dawlat', 'Business Angels']),
    ('Lemrock',                ['Frédéric Halley', 'Emmanuelle Brizay', 'Antoine Lizée',
                                 'Gary Anssens', 'Michaël Benabou', 'Galion.exe', 'Business Angels']),
]

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print('==============================================')
    print('Batch Investor Update')
    print('==============================================\n')
    ok = err = 0

    for company_name, investors in UPDATES:
        try:
            comp = find_company(company_name)
            if not comp:
                print(f'  NOT FOUND: "{company_name}"'); err += 1; continue

            rounds = get_rounds(comp['id'])
            if not rounds:
                print(f'  NO ROUNDS: "{company_name}"'); err += 1; continue

            # Snapshot per-round amounts before clearing, keyed by investor_id
            round_amounts = {rnd['id']: get_round_investor_amounts(rnd['id']) for rnd in rounds}

            # Clear all existing investor links across all rounds
            for rnd in rounds:
                clear_round_investors(rnd['id'])

            # Upsert each investor and link to every round
            investor_ids = []
            for inv_name in investors:
                inv_id = upsert_investor(inv_name)
                if not inv_id:
                    raise RuntimeError(f'Could not upsert investor "{inv_name}"')
                investor_ids.append((inv_name, inv_id))

            for rnd in rounds:
                amounts = round_amounts[rnd['id']]
                for i, (inv_name, inv_id) in enumerate(investor_ids):
                    link_investor(rnd['id'], inv_id, is_lead=(i == 0),
                                  investment_amount_eur=amounts.get(inv_id))

            suffix = f' (×{len(rounds)} rounds)' if len(rounds) > 1 else ''
            print(f'  ✓ {comp["name"]}{suffix}: {", ".join(investors)}')
            ok += 1

        except Exception as e:
            print(f'  ERROR {company_name}: {e}'); err += 1

    print(f'\n  Done — {ok} updated, {err} errors\n')
    if err: sys.exit(1)

if __name__ == '__main__':
    main()
