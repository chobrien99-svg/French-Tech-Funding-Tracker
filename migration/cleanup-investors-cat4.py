#!/usr/bin/env python3
"""
Category 4 Investor Cleanup Script

Cleans up dirty investor records:
  - MERGE: dirty record → existing clean record (reassign round links, delete dirty)
  - RENAME: dirty record with no clean version (rename in-place)
  - DELETE: pure junk/fragment records (remove links + delete)

Usage:
  export SUPABASE_SERVICE_KEY="your-service-role-key"
  python3 migration/cleanup-investors-cat4.py
"""

import json
import os
import sys
import urllib.request
import urllib.parse

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://tlwqkglfyjydwsgjrclx.supabase.co')
SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', '')

if not SERVICE_KEY:
    print('Error: SUPABASE_SERVICE_KEY environment variable is required.')
    sys.exit(1)

HEADERS = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
}


def api_request(method, path, body=None, prefer=None):
    url = f'{SUPABASE_URL}/rest/v1/{path}'
    headers = dict(HEADERS)
    if prefer:
        headers['Prefer'] = prefer
    data = json.dumps(body).encode('utf-8') if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            if content:
                return json.loads(content)
            return None
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        raise RuntimeError(f'HTTP {e.code} {method} {url}: {err_body}')


def lookup_investor(name):
    """Return investor dict {id, name} or None."""
    encoded = urllib.parse.quote(name, safe='')
    results = api_request('GET', f'investors?select=id,name&name=eq.{encoded}')
    if results:
        return results[0]
    return None


def get_round_links(investor_id):
    """Return list of {funding_round_id, is_lead, investment_amount_eur} for an investor."""
    results = api_request(
        'GET',
        f'funding_round_investors?select=funding_round_id,is_lead,investment_amount_eur&investor_id=eq.{investor_id}'
    )
    return results or []


def get_existing_link(funding_round_id, investor_id):
    """Return existing link row {is_lead, investment_amount_eur} or None."""
    results = api_request(
        'GET',
        f'funding_round_investors?select=is_lead,investment_amount_eur'
        f'&funding_round_id=eq.{funding_round_id}&investor_id=eq.{investor_id}'
    )
    return results[0] if results else None


def promote_lead(funding_round_id, investor_id):
    """Set is_lead=true on an existing link."""
    api_request(
        'PATCH',
        f'funding_round_investors?funding_round_id=eq.{funding_round_id}&investor_id=eq.{investor_id}',
        body={'is_lead': True},
        prefer='return=minimal',
    )


def insert_link(funding_round_id, investor_id, is_lead, investment_amount_eur=None):
    body = {'funding_round_id': funding_round_id, 'investor_id': investor_id, 'is_lead': is_lead}
    if investment_amount_eur is not None:
        body['investment_amount_eur'] = investment_amount_eur
    api_request('POST', 'funding_round_investors', body=body, prefer='return=minimal')


def delete_links_for_investor(investor_id):
    api_request('DELETE', f'funding_round_investors?investor_id=eq.{investor_id}',
                prefer='return=minimal')


def delete_investor_record(investor_id):
    api_request('DELETE', f'investors?id=eq.{investor_id}', prefer='return=minimal')


def rename_investor(investor_id, new_name):
    api_request('PATCH', f'investors?id=eq.{investor_id}',
                body={'name': new_name}, prefer='return=minimal')


def merge_investor(dirty_id, clean_id, dirty_name):
    """Reassign all round links from dirty to clean, then delete dirty."""
    links = get_round_links(dirty_id)
    for link in links:
        rid = link['funding_round_id']
        existing = get_existing_link(rid, clean_id)
        if existing is None:
            insert_link(rid, clean_id, link['is_lead'], link.get('investment_amount_eur'))
        else:
            # Clean link already present — promote to lead if dirty link was lead and clean isn't
            if link['is_lead'] and not existing['is_lead']:
                promote_lead(rid, clean_id)
    delete_links_for_investor(dirty_id)
    delete_investor_record(dirty_id)


def delete_investor(investor_id, name):
    """Delete links and investor record."""
    delete_links_for_investor(investor_id)
    delete_investor_record(investor_id)


# ======================================================================
# OPERATIONS LIST
# Each entry: (dirty_name, clean_name)
# Script logic: if clean exists → MERGE; else → RENAME
# ======================================================================

OPERATIONS = [

    # ---- Personal names with affiliations ----
    ('Charles Gorintin (Alan', 'Charles Gorintin'),
    ('Christian Lainé (Rivadis Group)', 'Christian Lainé'),
    ('Christophe Chausson (Chausson Partners)', 'Christophe Chausson'),
    ('Damien Deleplanque (historic supporter)', 'Damien Deleplanque'),
    ('Daphné Parrot (ex-Fabernovel)', 'Daphné Parrot'),
    ('DMG Promotion (family office of Aurélien Tchouameni)', 'DMG Promotion'),
    ('Emmanuel Picot (Marco&Co family office)', 'Emmanuel Picot'),
    ('Eric Schmidt (former Google CEO)', 'Eric Schmidt'),
    ('Florian Douetteau (CEO of Dataiku)', 'Florian Douetteau'),
    ('Grégory Salinger (Co-CEO)', 'Grégory Salinger'),
    ('Ilkka Paananen (Illusian Founder Office)', 'Ilkka Paananen'),
    ('Jean-Baptiste Hironde (MWM)', 'Jean-Baptiste Hironde'),
    ('Jean-Charles Samuelian (beside.com (https://www.beside.com/blog/beside-raises-32-million-to-turn-trillions-of-calls-and-texts-into-growth-for-everyday-businesses))', 'Jean-Charles Samuelian'),
    ('Jean-Charles Samuelian-Werve (Alan)', 'Jean-Charles Samuelian-Werve'),
    ('Jean-Louis Quéguiner (Gladia)', 'Jean-Louis Quéguiner'),
    ('Jules Koundé (FC Barcelona)', 'Jules Koundé'),
    ('Julien Chaumond (Hugging Face)', 'Julien Chaumond'),
    ('Mike Maignan (AC Milan)', 'Mike Maignan'),
    ('Nicolas Bacca (Ledger co-founder)', 'Nicolas Bacca'),
    ('Olivier Pomel (CEO & founder of Datadog)', 'Olivier Pomel'),
    ('Olivier Pomel (CEO of Datadog)', 'Olivier Pomel'),
    ('Ott Kaukver (CTO of Checkout.com', 'Ott Kaukver'),
    ('Saturnin Pugnet (Worldcoin)', 'Saturnin Pugnet'),
    ('Thierry Letartre (family office', 'Thierry Letartre'),
    ('Thomas Wolf (Hugging Face)', 'Thomas Wolf'),

    # ---- Corporate names with parent/fund/affiliation context ----
    ('574 Invest (SNCF Group)', '574 Invest'),
    ('AFI Ventures (Ventech)', 'AFI Ventures'),
    ('Alsace Business Angels (ABA)', 'Alsace Business Angels'),
    ('Andreessen Horowitz (a16z)', 'Andreessen Horowitz'),
    ('Angelor (via For Good fund)', 'Angelor'),
    ('Arkéa Banque Entreprises et Institutionnels (ABEI)', 'Arkéa Banque Entreprises et Institutionnels'),
    ('Axeleo Capital (AXC)', 'Axeleo Capital'),
    ('Banque des Territoires (France 2030)', 'Banque des Territoires'),
    ('Big Idea Ventures (Global Food Innovation Fund II Accelerator)', 'Big Idea Ventures'),
    ('Breakthrough Energy Ventures Europe (BEV-E)', 'Breakthrough Energy Ventures Europe'),
    ('Capital Fund Management (CFM)', 'Capital Fund Management'),
    ('Caisse d\u2019\u00c9pargne Normandie Innovation (CEN Innovation)', 'Caisse d\u2019\u00c9pargne Normandie Innovation'),
    ('CIB Development (Colas Group)', 'CIB Development'),
    ('Crédit Agricole (innovation branch)', 'Crédit Agricole'),
    ('Deeptech Beta Lab (Saudi Arabia)', 'Deeptech Beta Lab'),
    ('Delmas Investissement et Participation (DIP)', 'Delmas Investissement et Participation'),
    ('Deutsche Telekom (T.Capital)', 'Deutsche Telekom'),
    ('EDF Group (Électricité de France)', 'EDF Group'),
    ('Exergon (Audacia)', 'Exergon'),
    ('FININDUS (ArcelorMittal & Région de Flandres)', 'FININDUS'),
    ('Finorpa Gestion (via Finorpa SCR)', 'Finorpa Gestion'),
    ('Fonds d\u2019Amor\u00e7age Industriel M\u00e9tropolitain (FAIM) Lyon\u2013Saint-\u00c9tienne',
     'Fonds d\u2019Amor\u00e7age Industriel M\u00e9tropolitain'),
    ('Generali Impact Investment (INCO Ventures)', 'Generali Impact Investment'),
    ('Groupement des Concessionnaires Automobiles Peugeot (GCAP)',
     'Groupement des Concessionnaires Automobiles Peugeot'),
    ('Heka (BrainTech vehicle of Newfund VC)', 'Heka'),
    ('\u00cele-de-France Decarbonation Fund (managed by UI Investissement)',
     '\u00cele-de-France Decarbonation Fund'),
    # Non-breaking hyphen (U+2011) variant → standard hyphen canonical
    ('\u00cele\u2011de\u2011France R\u00e9industrialisation (via Innovacom \u2013 Turenne Groupe)',
     '\u00cele-de-France R\u00e9industrialisation'),
    ('Illusian (Supercell founder)', 'Illusian'),
    ('INCO Ventures (via Abeille Impact Investing France & INCO Investissement', 'INCO Ventures'),
    ('Industrya (John Cockerill Group)', 'Industrya'),
    ('IRDI Capital Investissement (via IRDINOV3)', 'IRDI Capital Investissement'),
    ('IRD Invest (via Nord Création)', 'IRD Invest'),
    ('ISALT (la Caisse des dépôts)', 'ISALT'),
    ('Mirova (affiliated with Natixis Investment Managers)', 'Mirova'),
    ('Newfund (NAEH2 / NAEH Innopy)', 'Newfund'),
    ('Newfund Capital', 'Newfund'),
    ('Pyrénées Gascogne Développement (Crédit Agricole)', 'Pyrénées Gascogne Développement'),
    ('Racine² (managed by Serena and Makesense)', 'Racine²'),
    ('Région Sud Investissement (managed by Turenne Groupe)', 'Région Sud Investissement'),
    ('Région Sud Investissement (RSI)', 'Région Sud Investissement'),

    # ---- Category 1 stragglers — (lead)/(co-lead) not yet stripped ----
    ('Andera Partners (lead', 'Andera Partners'),
    ('Banque des Territoires (lead', 'Banque des Territoires'),
    ('Elaia (lead)', 'Elaia'),
    ('Elaia Partners (existing)', 'Elaia Partners'),
    ('Kima Ventures (existing investor)', 'Kima Ventures'),
    ('Label Capital (existing investor)', 'Label Capital'),
    ('Mangrove Capital Partners (existing)', 'Mangrove Capital Partners'),
    ('MIG Capital (lead', 'MIG Capital'),
    ('Moonfire (lead)', 'Moonfire'),
    ('Moxxie Ventures (co-lead)', 'Moxxie Ventures'),
    ('Nickleby Capital (co-lead', 'Nickleby Capital'),
    ('Notion Capital (lead)', 'Notion Capital'),
    ('Octalfa (lead)', 'Octalfa'),
    ('OneRagtime (lead)', 'OneRagtime'),
    ('Paris Business Angels (lead)', 'Paris Business Angels'),
    ('Peak Capital (lead)', 'Peak Capital'),
    ('Pléiade Venture (lead)', 'Pléiade Venture'),
    ('Relyens Innovation Santé (lead', 'Relyens Innovation Santé'),
    ('Serena (lead', 'Serena'),
    ('Speedinvest (lead)', 'Speedinvest'),
    ('Speedinvest (new)', 'Speedinvest'),
    ('Supernova Invest (lead)', 'Supernova Invest'),
    ('Team for the Planet (lead)', 'Team For The Planet'),
    ('TomCat (lead)', 'Tomcat'),
    ('TOMCAT', 'Tomcat'),
    ('V-Bio Ventures (lead)', 'V-Bio Ventures'),
    ('Yeast (lead)', 'Yeast'),

    # ---- SPI Fund variants ----
    ('SPI Fund (Bpifrance', 'SPI Fund'),
    ('SPI Fund (Sociétés de Projets Industriels)', 'SPI Fund'),

    # ---- Fragments mapping to real investors ----
    ('backed by Crédit Mutuel Alliance Fédérale)', 'Crédit Mutuel Alliance Fédérale'),
    ('CPME 34)', 'CPME 34'),
    ('Fonds Révolution Environnementale et Solidaire (Crédit Mutuel Impact',
     'Fonds Révolution Environnementale et Solidaire'),
    ('GO CAPITAL)', 'GO Capital'),
    ('Go Capital', 'GO Capital'),
    ('New Enterprise Associates (NEA', 'New Enterprise Associates'),

    # ---- Blast Club variants ----
    ('Blast', 'Blast Club'),
    ('Blast.club', 'Blast Club'),
    ('Blast.Club', 'Blast Club'),

    # ---- Spelling / formatting variants ----
    ('Banque Populaire Auvergne Rhône Alpes', 'Banque Populaire Auvergne-Rhône-Alpes'),
    ('Fonds Régional Avenir Industrie Auvergne Rhône-Alpes',
     'Fonds Régional Avenir Industrie Auvergne-Rhône-Alpes'),
    ('BPI France', 'Bpifrance'),
    ('Bpifrance\u200b', 'Bpifrance'),   # zero-width space suffix
    ('50Partners', '50 Partners'),
]

# Pure junk records — delete entirely (links + investor record)
DELETES = [
    'co-lead)',
    'lead)',
    'lead investor)',
    'existing)',
    'joining the board)',
    'avg. ticket $30K)',
    'advised by Turenne Santé)',
]


def main():
    print('==============================================')
    print('Category 4 Investor Cleanup')
    print('==============================================\n')

    merged = renamed = deleted = skipped = errors = 0

    print('--- Processing merge/rename operations ---\n')

    for dirty_name, clean_name in OPERATIONS:
        try:
            dirty_rec = lookup_investor(dirty_name)

            if not dirty_rec:
                print(f'  SKIP  (not found): "{dirty_name}"')
                skipped += 1
                continue

            clean_rec = lookup_investor(clean_name)

            if not clean_rec:
                # No clean version exists — rename in-place
                rename_investor(dirty_rec['id'], clean_name)
                print(f'  RENAMED: "{dirty_name}"\n           → "{clean_name}"')
                renamed += 1
            elif clean_rec['id'] == dirty_rec['id']:
                print(f'  SKIP  (already clean): "{dirty_name}"')
                skipped += 1
            else:
                # Merge dirty into clean
                merge_investor(dirty_rec['id'], clean_rec['id'], dirty_name)
                print(f'  MERGED: "{dirty_name}"\n          → "{clean_name}"')
                merged += 1

        except Exception as e:
            print(f'  ERROR processing "{dirty_name}": {e}')
            errors += 1

    print('\n--- Deleting junk records ---\n')

    for name in DELETES:
        try:
            rec = lookup_investor(name)
            if not rec:
                print(f'  SKIP  (not found): "{name}"')
                skipped += 1
                continue
            delete_investor(rec['id'], name)
            print(f'  DELETED: "{name}"')
            deleted += 1
        except Exception as e:
            print(f'  ERROR deleting "{name}": {e}')
            errors += 1

    print('\n==============================================')
    print('CLEANUP COMPLETE')
    print(f'  Merged:  {merged}')
    print(f'  Renamed: {renamed}')
    print(f'  Deleted: {deleted}')
    print(f'  Skipped: {skipped} (not found or already clean)')
    print(f'  Errors:  {errors}')
    print('==============================================\n')

    if errors > 0:
        sys.exit(1)


if __name__ == '__main__':
    main()
