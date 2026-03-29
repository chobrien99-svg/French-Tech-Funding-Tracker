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

def link_investor(round_id, investor_id, is_lead=False):
    req('POST', 'funding_round_investors',
        body={'funding_round_id': round_id, 'investor_id': investor_id, 'is_lead': is_lead},
        prefer='resolution=ignore-duplicates,return=minimal')

# ── Company → investor list ──────────────────────────────────────────────────
UPDATES = [
    ('Waat',                ['RAISE Impact', 'DWS Group', 'Bpifrance']),
    ('Vibe',                ['QuantumLight', 'Elaia', 'Singular']),
    ('Lattice Medical',     ['Captech Santé', 'Bpifrance', 'Blast Club', 'TIDJEE',
                              'EIC Fund', 'FIRA Nord Est', 'France 2030']),
    ('Dracula Technologies', ['France 2030', 'European Innovation Council (EIC) Fund',
                               'MGI Digital Technology Group', 'Banque des Territoires']),
    ('La Fourche',          ['Bpifrance', 'Astanor']),
    ('Zadient Technologies', ['European Innovation Council Fund (EIC Fund)',
                               'Crédit Mutuel Impact']),
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
                for i, (inv_name, inv_id) in enumerate(investor_ids):
                    link_investor(rnd['id'], inv_id, is_lead=(i == 0))

            suffix = f' (×{len(rounds)} rounds)' if len(rounds) > 1 else ''
            print(f'  ✓ {comp["name"]}{suffix}: {", ".join(investors)}')
            ok += 1

        except Exception as e:
            print(f'  ERROR {company_name}: {e}'); err += 1

    print(f'\n  Done — {ok} updated, {err} errors\n')
    if err: sys.exit(1)

if __name__ == '__main__':
    main()
