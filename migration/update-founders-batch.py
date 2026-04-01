#!/usr/bin/env python3
"""
Batch founder update script.
For each company: replaces all founder entries with the specified list.

Usage:
  export SUPABASE_SERVICE_KEY="..."
  python3 migration/update-founders-batch.py
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

def find_company(name):
    enc = urllib.parse.quote(name, safe='')
    rows = req('GET', f'companies?select=id,name&name=ilike.{enc}')
    return rows[0] if rows else None

def get_or_create_person(full_name):
    enc = urllib.parse.quote(full_name, safe='')
    rows = req('GET', f'people?select=id&full_name=eq.{enc}')
    if rows: return rows[0]['id']
    rows = req('POST', 'people', body={'full_name': full_name})
    return rows[0]['id']

def clear_founders(company_id):
    req('DELETE', f'company_people?company_id=eq.{company_id}&role=eq.founder',
        prefer='return=minimal')

def link_founder(company_id, person_id):
    req('POST', 'company_people',
        body={'company_id': company_id, 'person_id': person_id,
              'role': 'founder', 'is_current': True},
        prefer='return=minimal')

# ── Company → founder list ───────────────────────────────────────────────────
UPDATES = [
    ('Adcytherix',    ['Carsten Dehning', 'Xavier Preville', 'Jack Elands']),
    ('Upway',         ['Stéphane Ficaja', 'Toussaint Wattinne']),
    ('Vibe',          ['Franck Tetzlaff', 'Arthur Querou']),
    ('Pelico',        ['Tarik Benabdallah', 'Mamoun Alaoui']),
    ('Onepark',       ['David Vanden Born']),
    ('Step Pharma',   ['Alain Fischer', 'Sylvain Latour']),
    ('Maki',          ['Maxime Legardez', 'Paul-Louis Caylar', 'Benjamin Chino']),
    ('Spiko',         ['Antoine Michon', 'Paul\u2011Adrien Hyppolite']),
    ('Formance',      ['Anne-Sybille Pradelles', 'Clément Salaün']),
    ('nextProtein',   ['Mohamed Gastli', 'Syrine Chaalala']),
    ('Axoltis Pharma',['Yann Godfrin']),
    ('Epsor',         ['Julien Niquet', 'Benjamin Pedrini']),
    ('Memority',      ['Gilles Castéran', 'Francis Grégoire']),
]

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print('==============================================')
    print('Batch Founder Update')
    print('==============================================\n')
    ok = err = 0

    for company_name, founders in UPDATES:
        try:
            comp = find_company(company_name)
            if not comp:
                print(f'  NOT FOUND: "{company_name}"'); err += 1; continue
            clear_founders(comp['id'])
            for name in founders:
                pid = get_or_create_person(name)
                link_founder(comp['id'], pid)
            print(f'  ✓ {comp["name"]}: {", ".join(founders)}')
            ok += 1
        except Exception as e:
            print(f'  ERROR {company_name}: {e}'); err += 1

    print(f'\n  Done — {ok} updated, {err} errors\n')
    if err: sys.exit(1)

if __name__ == '__main__':
    main()
