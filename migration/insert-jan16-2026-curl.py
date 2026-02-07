#!/usr/bin/env python3
"""
Insert 16 deals from week ending January 16, 2026 into Supabase.
Uses curl via subprocess to avoid Node.js DNS resolution issues.

Usage:
    SUPABASE_SERVICE_KEY=your-key python3 insert-jan16-2026-curl.py
"""

import json
import os
import subprocess
import sys
import time

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://tlwqkglfyjydwsgjrclx.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not SUPABASE_KEY:
    print("Error: SUPABASE_SERVICE_KEY environment variable is required.")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Known sector IDs from existing Supabase data
# Note: Individual sector IDs will be created by update-sectors-db.js migration.
SECTOR_IDS = {
    "AI & Machine Learning": "957f88d4-cef3-434f-9e97-d32430a0b3d1",
    "HealthTech": "2dea7360-f624-422e-a622-3b1dbc52da02",
    "BioTech": "2dea7360-f624-422e-a622-3b1dbc52da02",
    "HealthTech & BioTech": "2dea7360-f624-422e-a622-3b1dbc52da02",
    "CleanTech": "fe555b51-b028-4b3f-b224-236f995e29de",
    "Energy": "fe555b51-b028-4b3f-b224-236f995e29de",
    "CleanTech & Energy": "fe555b51-b028-4b3f-b224-236f995e29de",
    "FinTech": "4a3bb002-bae4-453b-9b37-db710032443a",
    "AgriTech": "b68c35c3-f137-4411-a909-727287a218ce",
    "FoodTech": "b68c35c3-f137-4411-a909-727287a218ce",
    "AgriTech & FoodTech": "b68c35c3-f137-4411-a909-727287a218ce",
    "SpaceTech & Aerospace": "c9460d00-f17f-49ba-8562-721d8ff30daf",
    "E-commerce & Retail": "bd5b2291-c1ee-4c6a-94ce-854ac35c98d1",
    "Cybersecurity": "85d97fce-0fdc-4d77-8495-306739ee2718",
    "Gaming": "c0bf8c8f-e7ac-4501-9637-01137b9cbae4",
    "DeepTech": "c54d430a-bb85-4716-a9dc-5bd8c77c3890",
    "Hardware": "c54d430a-bb85-4716-a9dc-5bd8c77c3890",
    "DeepTech & Hardware": "c54d430a-bb85-4716-a9dc-5bd8c77c3890",
    "Web3": "d91b44f7-3a42-44a2-8a24-ad8145f2e637",
    "SaaS & Enterprise": "50d276bc-d0d5-4c1b-812d-8d2a1bbb2662",
    "PropTech & Real Estate": "a88ce2c8-7544-4d71-b774-6b82805b7070",
    "Mobility & Transportation": "71f8d11b-5caf-4af1-86ef-6bfb9d81272c",
    "Other": "d91b44f7-3a42-44a2-8a24-ad8145f2e637",
}

DEALS = [
    {
        "company": "Harmattan AI",
        "description": "Defense technology company developing vertically integrated autonomous systems, including AI-enabled ISR and strike UAVs, layered air-defense solutions, drone interception, electronic warfare platforms, and C2 systems. Harmattan AI focuses on sovereign, controlled autonomy deployed at scale for NATO and allied forces.",
        "website": "https://www.harmattan.ai",
        "hq": "Paris",
        "round": "Series B",
        "amount": 181.82,
        "investors": ["Dassault Aviation"],
        "founders": ["Mouad M'Ghari", "Martin de Gourcuff", "Edouard Rosset"],
        "sectors": ["AI & Machine Learning", "SpaceTech & Aerospace"],
    },
    {
        "company": "FineHeart",
        "description": "FineHeart is a clinical-stage medical technology company developing next-generation Active Implantable Medical Devices (AIMDs) for advanced heart failure. Its flagship product, FlowMaker\u00ae, is the world's first fully implantable cardiac output accelerator, designed to work in synergy with natural heart contractions while minimizing energy consumption and infection risk.",
        "website": None,
        "hq": "Bordeaux",
        "round": "Series C",
        "amount": 35,
        "investors": ["Groupe Pasteur Mutualit\u00e9", "Groupe Etchart", "European Innovation Council", "EIB Fund", "FH Founders", "Lurra", "IRDI Capital Investment", "Groupe Doliam", "NACO", "Aquiti Gestion", "Galia Gestion", "Broadview Ventures", "M Capital", "UI Investment", "Verve Capital"],
        "founders": ["Arnaud Mascarell", "Dr. St\u00e9phane Garrigue", "Dr. Philippe Ritter"],
        "sectors": ["HealthTech", "BioTech"],
    },
    {
        "company": "SunLib",
        "description": "SunLib is a French solar autoconsumption startup offering residential photovoltaic installations through a subscription model, removing upfront investment and credit constraints. The company installs and owns solar panels, allowing households to access clean energy for a monthly fee while accelerating the adoption of distributed solar in France.",
        "website": None,
        "hq": "Aix-en-Provence",
        "round": "Series A",
        "amount": 25,
        "investors": ["Epop\u00e9e Gestion"],
        "founders": ["Arnaud Langlois"],
        "sectors": ["CleanTech", "Energy", "FinTech"],
    },
    {
        "company": "Enodia Therapeutics",
        "description": "Develops small-molecule drugs that trigger the degradation of disease-causing proteins as they are being synthesized, using a platform combining proteomics and machine learning.",
        "website": None,
        "hq": "Paris",
        "round": "Seed",
        "amount": 20.7,
        "investors": ["Elaia", "Pfizer Ventures", "Bpifrance", "Sambrinvest", "MACSF", "Investsud", "Argobio", "Institut Pasteur", "Wallonie Entreprendre"],
        "founders": ["Caroline Demangel", "Yves Ribeill"],
        "sectors": ["AI & Machine Learning", "HealthTech", "BioTech"],
    },
    {
        "company": "MYCOPHYTO",
        "description": "MYCOPHYTO is a French pioneer in mycorrhizal biostimulants and soil regeneration, developing nature-inspired solutions that improve crop resilience, water retention, and yields. Leveraging a proprietary R&D platform, protected biobank, and AI-driven formulation adapted to local soil and climate conditions, the company supports farmers' transition to agroecology while addressing climate-driven stress such as drought.",
        "website": None,
        "hq": "Grasse",
        "round": "Series A",
        "amount": 16,
        "investors": ["Innovacom", "BNP Paribas", "Bpifrance", "CDG Invest", "Noshaq", "RSI", "Cr\u00e9dit Agricole"],
        "founders": ["Justine Lipuma"],
        "sectors": ["AgriTech", "FoodTech", "CleanTech", "Energy"],
    },
    {
        "company": "Equitable Earth",
        "description": "Builds a certification platform for nature-based carbon projects focused on transparency, community impact, and ecological integrity. Certification standard specializing in nature-based carbon removal projects, particularly afforestation, reforestation, and revegetation (ARR). Leveraging advanced remote sensing, data science, and expert-led methodologies, ERS offers one of the fastest certification processes in the market\u2014up to four times quicker than comparable standards\u2014serving project developers and end buyers across more than 20 countries.",
        "website": None,
        "hq": "Paris",
        "round": "Growth",
        "amount": 12.6,
        "investors": ["US family office", "AENU", "noa", "Localglobe"],
        "founders": ["Priscille Raynaud", "Thibault Sorret"],
        "sectors": ["AgriTech", "FoodTech"],
    },
    {
        "company": "Kepplair Evolution",
        "description": "Kepplair Evolution develops a multi-role firefighting aircraft by converting the ATR 72 into a next-generation water bomber, the KEPPLAIR 72 \"Forest Keeper\". By leveraging an existing aircraft platform, the company cuts time-to-market to three years and significantly reduces development and operating costs. The aircraft is designed for aerial firefighting as well as cargo transport and medical evacuation, addressing the rapidly growing risk of wildfires driven by climate change and the critical shortage of modern firefighting fleets in Europe and globally.",
        "website": None,
        "hq": "Toulouse",
        "round": "Seed",
        "amount": 5,
        "investors": ["Groupe AVICO", "ORA"],
        "founders": ["David Joubert"],
        "sectors": ["SpaceTech & Aerospace"],
    },
    {
        "company": "Cementic",
        "description": "Develops a nanomaterial for root canal fillings that eliminates 99.99% of lingering bacteria, aiming to reduce post-treatment infections and antibiotic use.",
        "website": None,
        "hq": "Paris",
        "round": "Seed",
        "amount": 4,
        "investors": ["Blast", "Business Angels", "dental professionals"],
        "founders": ["Samir Raddi"],
        "sectors": ["HealthTech", "BioTech"],
    },
    {
        "company": "Revox",
        "description": "Revox builds a developer-first API that enables reliable, production-grade outbound AI calling at scale. Its platform addresses critical infrastructure challenges that have hindered voice agents in real-world deployments, including voicemail detection, IVR navigation, call drops, latency, and edge-case orchestration. Revox combines low-latency voice models, resilient call orchestration, and self-improving agents with humans-in-the-loop to unlock high-trust, real-world voice AI use cases.",
        "website": None,
        "hq": "Paris",
        "round": "Pre-Seed",
        "amount": 2.73,
        "investors": ["Seedcamp", "Weekend Fund", "Drysdale", "Purple", "OPRTRS CLUB", "Firedrop", "Kima Ventures", "Tiny VC", "Business Angels", "Stanislas Polu", "Gabriel Hubert", "Alex Yazdi"],
        "founders": ["Aric Lasry", "Jean-Baptiste de La Fage"],
        "sectors": ["AI & Machine Learning"],
    },
    {
        "company": "Sweetech",
        "description": "Develops a fermentation-based process to produce rare sugars used in pharmaceuticals, cosmetics, and nutraceuticals, offering a green alternative to synthetic sugar chemistry.",
        "website": None,
        "hq": "Toulouse",
        "round": "Seed",
        "amount": 2.25,
        "investors": ["Iron Hands Capital", "Bpifrance"],
        "founders": ["Julien Durand", "Yannick Malbert"],
        "sectors": ["HealthTech", "BioTech"],
    },
    {
        "company": "Viti-Tunnel",
        "description": "Viti-Tunnel develops a retractable physical protection system for row crops, designed to shield vineyards and other agricultural productions from climatic hazards while reducing reliance on chemical inputs. Industrialized and cost-optimized, the solution secures yields, preserves farm value, and supports resilient, pesticide-free farming systems.",
        "website": None,
        "hq": "Le Haillan",
        "round": "Seed",
        "amount": 2,
        "investors": ["Parnass", "Cr\u00e9dit Agricole Aquitaine Expansion", "Sowefund", "Demea Invest"],
        "founders": ["Patrick Delmarre"],
        "sectors": ["AgriTech", "FoodTech", "CleanTech", "Energy"],
    },
    {
        "company": "Campsider",
        "description": "Campsider is a curated marketplace for second-hand technical sports equipment, often described as the \"Back Market of used bikes and skis.\" The platform digitalizes professional sports retailers' second-hand inventories and manages the full value chain\u2014product qualification, pricing, logistics, delivery, and expert advice\u2014positioning itself as a trusted intermediary for high-performance and safety-critical gear.",
        "website": None,
        "hq": "Lyon",
        "round": "Seed",
        "amount": 1.5,
        "investors": ["Founders Future", "50Partners Impact", "Sowefund"],
        "founders": ["Thomas Gounot", "Arthur Rocle"],
        "sectors": ["E-commerce & Retail"],
    },
    {
        "company": "Gamevestor",
        "description": "Gamevestor is a regulated crowdinvesting platform dedicated to video game projects. It enables individuals to invest in game development through a secure, transparent, and milestone-based funding model, while allowing studios to retain their creative and strategic independence. All projects are vetted by an independent committee of gaming and finance experts, with staged fund releases and full risk disclosure.",
        "website": None,
        "hq": "Annecy",
        "round": "Seed",
        "amount": 0.55,
        "investors": ["ForsVC", "LeanSquare", "Noshaq", "Ben Fiquet", "Business Angels", "Bpifrance", "R\u00e9gion Auvergne\u2013Rh\u00f4ne-Alpes", "Initiative Grand Annecy"],
        "founders": ["Ivan Marchand", "Arthur Van Clap"],
        "sectors": ["Gaming", "FinTech"],
    },
    {
        "company": "Smartphone iD",
        "description": "French startup reinventing identity photo and remote identity verification using a proprietary AI-based biometric technology combined with human verification. Smartphone iD aims to become the standard for secure remote identification, replacing physical photo booths in a \u20ac5B legacy market. The solution is compliant with ISO 30107 standards, integrates \"liveness detection\" patents, and is already deployed in more than 190 countries.",
        "website": None,
        "hq": "Paris",
        "round": "Seed",
        "amount": 0.2,
        "investors": ["QVEMA", "Kelly Massol", "Anthony Bourbon"],
        "founders": ["\u00c9mile Menetrey"],
        "sectors": ["Cybersecurity", "AI & Machine Learning"],
    },
    {
        "company": "BW Ideol",
        "description": "BW Ideol is a pioneer in floating offshore wind foundation technology, with over 15 years of experience in the design, engineering, and fabrication of concrete floating foundations. The company develops scalable, cost-competitive solutions to unlock deep-water wind resources and accelerate the global energy transition.",
        "website": None,
        "hq": "La Ciotat",
        "round": "Growth",
        "amount": None,
        "investors": ["Holcim"],
        "founders": ["Paul de la Gu\u00e9rivi\u00e8re", "Pierre Coulombeau"],
        "sectors": ["CleanTech", "Energy"],
    },
    {
        "company": "Abbelight",
        "description": "Abbelight is a pioneer in super-resolution microscopy, delivering end-to-end nanoscopy (SMLM) solutions that combine advanced chemistry, optics, and data analysis. Its platforms enable researchers to visualize, quantify, and interpret complex intracellular mechanisms at the nanoscale, supporting applications ranging from fundamental research to drug discovery and single-cell phenotyping.",
        "website": None,
        "hq": "Paris",
        "round": "Series B",
        "amount": None,
        "investors": ["AVANT BIO"],
        "founders": ["Jean-Baptiste Marie", "Nicolas Bourg"],
        "sectors": ["HealthTech", "BioTech"],
    },
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

        # Parse HTTP status
        status = 0
        body = output
        if "__HTTP_STATUS:" in output:
            parts = output.rsplit("__HTTP_STATUS:", 1)
            body = parts[0].strip()
            status = int(parts[1].replace("__", ""))

        if status >= 200 and status < 300:
            if body:
                return json.loads(body), status
            return None, status

        if status == 503 or status == 0:
            wait = 2 ** (attempt + 1)
            print(f"    Retry {attempt+1}/{retries} after {wait}s (status={status})")
            time.sleep(wait)
            continue

        # Non-retryable error
        print(f"    API error {status}: {body}")
        return None, status

    print(f"    Failed after {retries} retries")
    return None, 0


def get_or_create_city(name):
    """Look up existing city first, create only if not found."""
    from urllib.parse import quote
    data, status = api_call("GET", "cities",
        query_params=f"?name=eq.{quote(name)}&country=eq.France&select=id&limit=1")
    if data and isinstance(data, list) and len(data) > 0:
        return data[0]["id"]
    data, status = api_call("POST", "cities", {"name": name, "country": "France"})
    if data and isinstance(data, list) and len(data) > 0:
        return data[0]["id"]
    return None


def get_or_create_investor(name):
    """Look up existing investor first, create only if not found."""
    from urllib.parse import quote
    data, status = api_call("GET", "investors",
        query_params=f"?name=eq.{quote(name)}&select=id&limit=1")
    if data and isinstance(data, list) and len(data) > 0:
        return data[0]["id"]
    data, status = api_call("POST", "investors", {"name": name})
    if data and isinstance(data, list) and len(data) > 0:
        return data[0]["id"]
    return None


def get_or_create_person(full_name):
    """Look up existing person first, create only if not found."""
    from urllib.parse import quote
    data, status = api_call("GET", "people",
        query_params=f"?full_name=eq.{quote(full_name)}&select=id&limit=1")
    if data and isinstance(data, list) and len(data) > 0:
        return data[0]["id"]
    data, status = api_call("POST", "people", {"full_name": full_name})
    if data and isinstance(data, list) and len(data) > 0:
        return data[0]["id"]
    return None


def insert_deal(deal, index):
    total = len(DEALS)
    tag = f"[{index+1}/{total}]"
    print(f"{tag} Processing: {deal['company']}")

    # 1. City
    city_id = get_or_create_city(deal["hq"])
    if not city_id:
        print(f"  Failed to upsert city {deal['hq']}")

    # 2. Company
    company_payload = {
        "name": deal["company"],
        "description": deal["description"],
        "website": deal["website"],
        "hq_city_id": city_id,
        "hq_city_name": deal["hq"],
    }
    data, status = api_call("POST", "companies", company_payload)
    if not data or not isinstance(data, list) or len(data) == 0:
        print(f"  FAILED to insert company")
        return False
    company_id = data[0]["id"]

    # 3. Funding round
    round_payload = {
        "company_id": company_id,
        "round_type": deal["round"],
        "amount_eur": deal["amount"],
        "announced_month": "January",
        "announced_year": 2026,
        "source": "ftj",
    }
    data, status = api_call("POST", "funding_rounds", round_payload)
    if not data or not isinstance(data, list) or len(data) == 0:
        print(f"  FAILED to insert funding round")
        return False
    funding_round_id = data[0]["id"]

    # 4. Link sectors
    for i, sector_name in enumerate(deal["sectors"]):
        sector_id = SECTOR_IDS.get(sector_name)
        if not sector_id:
            print(f"  Unknown sector: {sector_name}")
            continue
        api_call("POST", "company_sectors", {
            "company_id": company_id,
            "sector_id": sector_id,
            "is_primary": i == 0,
        })

    # 5. Founders
    for founder_name in deal["founders"]:
        person_id = get_or_create_person(founder_name)
        if person_id:
            api_call("POST", "company_people", {
                "company_id": company_id,
                "person_id": person_id,
                "role": "founder",
            })

    # 6. Investors
    for i, inv_name in enumerate(deal["investors"]):
        investor_id = get_or_create_investor(inv_name)
        if investor_id:
            api_call("POST", "funding_round_investors", {
                "funding_round_id": funding_round_id,
                "investor_id": investor_id,
                "is_lead": i == 0,
            })

    print(f"  OK: {deal['company']}")
    return True


def main():
    print("=" * 50)
    print("Inserting 16 deals - Week ending Jan 16, 2026")
    print("=" * 50)
    print()

    success = 0
    failed = 0

    for i, deal in enumerate(DEALS):
        try:
            ok = insert_deal(deal, i)
            if ok:
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  Unexpected error: {e}")
            failed += 1

    print()
    print("=" * 50)
    print("INSERTION COMPLETE")
    print(f"  Success: {success}")
    print(f"  Failed:  {failed}")
    print("=" * 50)

    sys.exit(1 if failed > 0 else 0)


if __name__ == "__main__":
    main()
