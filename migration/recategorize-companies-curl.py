#!/usr/bin/env python3
"""
Recategorize companies in Supabase database.
Uses curl via subprocess to avoid Node.js DNS resolution issues.

Usage:
    SUPABASE_SERVICE_KEY=your-key python3 recategorize-companies-curl.py
"""

import json
import os
import subprocess
import sys
import time
from urllib.parse import quote

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://tlwqkglfyjydwsgjrclx.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not SUPABASE_KEY:
    print("Error: SUPABASE_SERVICE_KEY environment variable is required.")
    sys.exit(1)

# Companies to recategorize: (company_name, [sector1, sector2, ...])
RECATEGORIZATIONS = [
    ("Accro", ["FoodTech"]),
    ("La Fourche", ["FoodTech"]),
    ("Nutropyy", ["FoodTech"]),
    ("Le Drive tout nu", ["FoodTech"]),
    ("Agreenculture", ["AgriTech", "Mobility & Transportation"]),
    ("Kapsera", ["AgriTech", "BioTech"]),
    ("Green Spot Technologies", ["AgriTech"]),
    ("Les Nouvelles Fermes", ["AgriTech"]),
    ("ReSoil", ["AgriTech"]),
    ("Fungu'it", ["FoodTech"]),
    ("Eclaircie", ["Energy", "AgriTech"]),
    ("Elmut", ["FoodTech"]),
    ("Praysbee", ["AgriTech"]),
    ("Viti-Tunnel", ["AgriTech"]),
    ("SeaWeed Concept", ["FoodTech", "BioTech"]),
    ("Jay & Joy", ["FoodTech"]),
    ("CGREEN", ["CleanTech", "AgriTech"]),
    ("Néosylva", ["CleanTech", "AgriTech"]),
    ("Yacon & Co", ["FoodTech"]),
    ("Beyond Green", ["FoodTech", "AgriTech"]),
    ("Vegetal Food", ["FoodTech"]),
    ("NeoEarth", ["AgriTech", "BioTech"]),
    ("Agri Lab Leverage", ["AgriTech"]),
    ("VoilaChef", ["FoodTech"]),
    ("Beans", ["FoodTech"]),
    ("AuraLIP", ["FoodTech"]),
    ("Versant", ["AgriTech", "SpaceTech & Aerospace"]),
    ("Terroe", ["AgriTech", "FoodTech"]),
    ("DareWin Evolution", ["FoodTech"]),
    ("Kuantom", ["FoodTech"]),
    ("Cherico", ["FoodTech"]),
    ("Aberyne", ["FoodTech"]),
    ("Neo Earth", ["AgriTech", "BioTech"]),
    ("Amatera", ["AgriTech"]),
    ("Intact", ["AgriTech"]),
    ("NeoFarm", ["AgriTech"]),
    ("nextProtein", ["AgriTech"]),
    ("MYCOPHYTO", ["AgriTech", "BioTech"]),
    ("Equitable Earth", ["AgriTech", "CleanTech"]),
    ("ReGeneration", ["AgriTech"]),
    ("Lisaqua", ["AgriTech", "CleanTech"]),
    ("Nutropy", ["FoodTech", "BioTech"]),
    ("Adcytherix", ["BioTech"]),
    ("Nabla", ["HealthTech", "AI & Machine Learning"]),
    ("Gradium", ["HealthTech", "AI & Machine Learning"]),
    ("Lattice Medical", ["HealthTech", "Hardware"]),
    ("Step Pharma", ["BioTech"]),
    ("FineHeart", ["HealthTech", "Hardware"]),
    ("SiPearl", ["Hardware", "AI & Machine Learning"]),
    ("Coave Therapeutics", ["BioTech"]),
    ("TreeFrog Therapeutics", ["BioTech"]),
    ("EG 427", ["BioTech"]),
    ("Robeauté", ["HealthTech", "Hardware", "AI & Machine Learning"]),
    ("SCAP Hologram", ["HealthTech", "Hardware"]),
    ("Enodia Therapeutics", ["BioTech", "AI & Machine Learning"]),
    ("SeqOne", ["BioTech", "AI & Machine Learning"]),
    ("Axoltis Pharma", ["BioTech"]),
    ("ErVimmune", ["BioTech"]),
    ("Via Sana", ["HealthTech"]),
    ("Solence", ["HealthTech", "AI & Machine Learning"]),
    ("Tafalgie Therapeutics", ["BioTech"]),
    ("One Biosciences", ["BioTech"]),
    ("RDS", ["HealthTech"]),
    ("MaaT Pharma", ["BioTech"]),
    ("SuperBranche", ["BioTech"]),
    ("Innerskin", ["HealthTech"]),
    ("Elkedonia", ["BioTech"]),
    ("StemInov", ["BioTech"]),
    ("Osivax", ["BioTech"]),
    ("ROFIM", ["HealthTech"]),
    ("SafeHeal", ["HealthTech", "Hardware"]),
    ("Ray Studios", ["HealthTech"]),
    ("EVerZom", ["BioTech"]),
    ("Okeiro", ["BioTech"]),
    ("Adocia", ["BioTech"]),
    ("Reev", ["HealthTech", "Hardware", "AI & Machine Learning"]),
    ("Enterome", ["BioTech"]),
    ("Circle Safe", ["HealthTech"]),
    ("Dillico", ["BioTech", "AI & Machine Learning"]),
    ("Lucis", ["HealthTech", "AI & Machine Learning"]),
    ("Dianosic", ["BioTech"]),
    ("Ciloa", ["BioTech"]),
    ("Hemerion Therapeutics", ["BioTech"]),
    ("ArcaScience", ["HealthTech", "AI & Machine Learning"]),
    ("Faks", ["HealthTech"]),
    ("ENYO Pharma", ["BioTech"]),
    ("Kyron.bio", ["BioTech"]),
    ("Juisci", ["HealthTech", "AI & Machine Learning"]),
    ("GeodAlsics", ["HealthTech", "AI & Machine Learning"]),
    ("Vocca", ["HealthTech", "AI & Machine Learning"]),
    ("Veragrow", ["AgriTech"]),
    ("Sirius NeoSight", ["HealthTech", "AI & Machine Learning"]),
    ("Alkion BioInnovations", ["BioTech"]),
    ("Febus Optics", ["Hardware"]),
    ("Activ'Inside", ["BioTech"]),
    ("Fizimed", ["HealthTech"]),
    ("Plasana Medical", ["HealthTech", "Hardware"]),
    ("AdEchoTech", ["HealthTech"]),
    ("Cementic", ["BioTech"]),
    ("Kimialys", ["BioTech", "Hardware"]),
    ("Allergen Alert", ["HealthTech", "Hardware"]),
    ("Byome Labs", ["BioTech", "Hardware"]),
    ("Hopia", ["HealthTech", "AI & Machine Learning"]),
    ("Brink Therapeutics", ["BioTech"]),
    ("Laclaree Vision", ["HealthTech"]),
    ("LaFraise", ["HealthTech", "AI & Machine Learning"]),
    ("Moodwork", ["HealthTech", "AI & Machine Learning"]),
    ("Sounduct", ["HealthTech", "Hardware"]),
    ("Chenevia", ["BioTech"]),
    ("Hocoia", ["HealthTech"]),
    ("Ventuno Biotech", ["BioTech"]),
    ("Ensweet", ["HealthTech"]),
    ("Sonomind", ["HealthTech", "Hardware"]),
    ("Parallel", ["HealthTech", "AI & Machine Learning"]),
    ("Exeliom Biosciences", ["BioTech"]),
    ("Oria Bioscience", ["BioTech"]),
    ("Circular", ["HealthTech"]),
    ("Lyv Healthcare", ["HealthTech"]),
    ("Vipali", ["HealthTech"]),
    ("OWLO", ["BioTech", "AI & Machine Learning"]),
    ("Sweetech", ["BioTech"]),
    ("STEPS ORTHO", ["HealthTech"]),
    ("Alterdiag", ["BioTech"]),
    ("SeaBeLife", ["BioTech"]),
    ("Celest Science", ["HealthTech"]),
    ("Annette", ["HealthTech"]),
    ("MyFit Solutions", ["HealthTech", "AI & Machine Learning"]),
    ("Greenphage", ["BioTech"]),
    ("Ordalie", ["HealthTech", "AI & Machine Learning"]),
    ("MSInsight", ["BioTech", "AI & Machine Learning"]),
    ("MovaLife", ["HealthTech", "Hardware"]),
    ("VitaDX", ["HealthTech", "AI & Machine Learning"]),
    ("Skyld AI", ["AI & Machine Learning"]),
    ("Zenior", ["HealthTech", "AI & Machine Learning"]),
    ("E-Sensia", ["HealthTech", "AI & Machine Learning"]),
    ("bYoRNA", ["BioTech"]),
    ("Goud", ["HealthTech"]),
    ("KLODIOS", ["HealthTech", "AI & Machine Learning"]),
    ("H'ability", ["HealthTech"]),
    ("Yomi Pharma", ["BioTech"]),
    ("Clikodoc", ["HealthTech"]),
    ("Elefantia", ["AI & Machine Learning"]),
    ("BiPER Therapeutics", ["BioTech"]),
    ("AberActives", ["BioTech"]),
    ("Inside Therapeutics", ["BioTech"]),
    ("Cellura", ["BioTech"]),
    ("Novem", ["BioTech"]),
    ("Naali", ["HealthTech"]),
    ("VBTech", ["HealthTech", "AI & Machine Learning"]),
    ("Vulgaroo", ["HealthTech", "AI & Machine Learning"]),
    ("AlgenScribe", ["BioTech"]),
    ("Beez Biotech", ["BioTech", "Hardware"]),
    ("Manitty", ["HealthTech", "AI & Machine Learning"]),
    ("Plantibodies", ["BioTech"]),
    ("TheraPPI Bioscience", ["BioTech"]),
    ("MB Therapeutics", ["BioTech"]),
    ("Carthera", ["HealthTech", "Hardware"]),
    ("SOFTWAY MEDICAL", ["HealthTech"]),
    ("PulseSight Therapeutics", ["BioTech"]),
    ("Elum Energy", ["CleanTech", "Energy"]),
    ("Leanspace", ["SpaceTech & Aerospace"]),
    ("Melvan", ["Energy", "FinTech"]),
    ("Maki", ["SaaS & Enterprise"]),
]


def api_call(method, table, data=None, query_params="", retries=3):
    """Make a Supabase REST API call via curl with retries."""
    url = f"{SUPABASE_URL}/rest/v1/{table}{query_params}"
    cmd = ["curl", "-s", "-w", "\n__HTTP_STATUS:%{http_code}__"]

    if method == "POST":
        cmd += ["-X", "POST"]
        cmd += ["-H", "Prefer: return=representation,resolution=merge-duplicates"]
    elif method == "GET":
        pass
    elif method == "DELETE":
        cmd += ["-X", "DELETE"]
        cmd += ["-H", "Prefer: return=representation"]

    cmd += [
        "-H", f"apikey: {SUPABASE_KEY}",
        "-H", f"Authorization: Bearer {SUPABASE_KEY}",
        "-H", "Content-Type: application/json",
    ]

    if data is not None:
        cmd += ["-d", json.dumps(data)]

    cmd.append(url)

    for attempt in range(retries):
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        output = result.stdout.strip()

        status = 0
        body = output
        if "__HTTP_STATUS:" in output:
            parts = output.rsplit("__HTTP_STATUS:", 1)
            body = parts[0].strip()
            status = int(parts[1].replace("__", ""))

        if 200 <= status < 300:
            if body:
                return json.loads(body), status
            return None, status

        if status == 503 or status == 0:
            wait = 2 ** (attempt + 1)
            print(f"    Retry {attempt+1}/{retries} after {wait}s (status={status})")
            time.sleep(wait)
            continue

        print(f"    API error {status}: {body}")
        return None, status

    print(f"    Failed after {retries} retries")
    return None, 0


def main():
    print("=" * 55)
    print("Recategorizing Companies in Supabase Database")
    print("=" * 55)
    print()

    # Step 1: Fetch all sectors
    print("Step 1: Fetching sectors...")
    data, status = api_call("GET", "sectors", query_params="?select=id,name&order=name")
    if not data:
        print("  FAILED to fetch sectors")
        sys.exit(1)

    sector_map = {s["name"]: s["id"] for s in data}
    print(f"  Found {len(sector_map)} sectors")

    # Verify all needed sectors exist
    needed = set()
    for _, sectors in RECATEGORIZATIONS:
        needed.update(sectors)

    missing = needed - set(sector_map.keys())
    if missing:
        print(f"  WARNING: Missing sectors: {missing}")
        print("  These will need to be created first.")
        sys.exit(1)

    # Step 2: Process each company
    print("\nStep 2: Recategorizing companies...")
    success = 0
    not_found = 0
    errors = 0

    for company_name, new_sectors in RECATEGORIZATIONS:
        # Look up company by name (case-insensitive)
        data, status = api_call(
            "GET", "companies",
            query_params=f"?name=ilike.{quote(company_name)}&select=id,name"
        )

        if not data or len(data) == 0:
            print(f"  NOT FOUND: \"{company_name}\"")
            not_found += 1
            continue

        company_id = data[0]["id"]
        actual_name = data[0]["name"]

        # Delete existing sector associations
        _, del_status = api_call(
            "DELETE", "company_sectors",
            query_params=f"?company_id=eq.{company_id}"
        )

        if del_status < 200 or del_status >= 300:
            print(f"  ERROR deleting sectors for \"{actual_name}\"")
            errors += 1
            continue

        # Insert new sector associations
        records = []
        for i, sector_name in enumerate(new_sectors):
            sector_id = sector_map.get(sector_name)
            if not sector_id:
                print(f"  ERROR: sector \"{sector_name}\" not found")
                continue
            records.append({
                "company_id": company_id,
                "sector_id": sector_id,
                "is_primary": i == 0,
            })

        if records:
            _, ins_status = api_call("POST", "company_sectors", records)
            if ins_status < 200 or ins_status >= 300:
                print(f"  ERROR inserting sectors for \"{actual_name}\"")
                errors += 1
                continue

        sector_str = ", ".join(new_sectors)
        print(f"  OK: {actual_name} -> {sector_str}")
        success += 1

    print()
    print("=" * 55)
    print("RECATEGORIZATION COMPLETE")
    print(f"  Successful: {success}")
    print(f"  Not found:  {not_found}")
    print(f"  Errors:     {errors}")
    print("=" * 55)

    sys.exit(1 if errors > 0 or not_found > 0 else 0)


if __name__ == "__main__":
    main()
