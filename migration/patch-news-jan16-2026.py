#!/usr/bin/env python3
"""Patch news/notes onto 16 Jan 16, 2026 funding rounds in Supabase."""

import subprocess, json, time, sys, os

SKEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not SKEY:
    print("Error: SUPABASE_SERVICE_KEY required")
    sys.exit(1)

BASE = "https://tlwqkglfyjydwsgjrclx.supabase.co/rest/v1"

# Funding round ID -> news text
NEWS = {
    "47c2b138-fe1b-47cd-94a0-c4b694226c76": "Harmattan AI raised a $200M Series B led by Dassault Aviation as part of a strategic partnership to integrate controlled, sovereign AI into next-generation combat aviation systems. The funding will support global scaling, expansion into new operational domains, and industrial-scale manufacturing of AI-enabled ISR, electronic warfare, and autonomous defense platforms, with applications across Rafale F5 and future UCAS programs. | Les Echos, Reuters",
    "65c6128f-14fb-452b-bb13-005ea3dca95f": "FineHeart secured \u20ac83M in combined private and public funding to accelerate the clinical and industrial development of its FlowMaker\u00ae device and to help structure the European Active Implantable Medical Devices (AIMD) sector. The \u20ac35M Series C first closing secures \u20ac48M in non-dilutive grants from the IPCEI Tech4Cure program, positioning FineHeart as a cornerstone of Europe\u2019s healthcare-sovereignty strategy in advanced implantable cardiology devices. | Les Echos",
    "291cf707-48ae-49f6-8491-a23872ec8423": "Founded just 18 months ago, SunLib raised \u20ac25 million in a round fully subscribed by regional investment fund Epop\u00e9e Gestion, while retaining founder control. The funding follows a \u20ac3.2 million seed round in 2024 from business angels that helped validate the model with ~500 customers. SunLib plans to equip 4,000\u20136,000 additional clients in 2026 and targets 100,000 subscribers representing 1.5 GW of installed capacity by 2030, leveraging bank financing from Bpifrance, Cepac, and Soci\u00e9t\u00e9 G\u00e9n\u00e9rale. | Les Echos",
    "31e8b128-5667-4784-b622-01cf04052401": "Enodia will advance its lead program toward preclinical candidate selection, with ambitions across inflammatory, autoimmune, and viral diseases. | Endpoint News",
    "32a53a46-3efb-46f2-9b5d-4edc91e9a9da": "The Series A will fund MYCOPHYTO\u2019s international expansion (Spain, Morocco, Benelux, C\u00f4te d\u2019Ivoire), the scaling of production through its first manufacturing plant\u2014integrating sustainable technologies under France 2030\u2014and the broader deployment of its mycorrhizal solutions across key segments including market gardening, viticulture, green spaces, and aromatic and medicinal plants. | Bpifrance",
    "67e963b6-3c2e-44cf-8a05-1642e38eed4d": "Equitable Earth secured \u20ac5 million in a seed-extension round to scale its certification capacity amid surging demand for nature-based CO\u2082 removal credits. The funding will support team expansion, particularly within certification, to maintain rapid turnaround times and reliability. EE will also develop new methodologies to certify additional project types, including mangrove and multi-strata agroforestry initiatives, strengthening its role as a key market gateway for transparent, high-integrity carbon removal projects. | PR",
    "ba1cbe26-ba27-405e-9e71-d702be935ecc": "Kepplair Evolution has successfully closed a \u20ac3M ORA round (November 2025) alongside a \u20ac2M pre-Series A, including Groupe AVICO, France\u2019s leading aviation broker. The funding supports final design and EASA certification of the KEPPLAIR 72, with first deliveries targeted before the 2027 wildfire season. The project has received strong institutional backing, including a letter of interest from France\u2019s Civil Security authority and official support from national firefighter federations, positioning Kepplair as a strategic player in Europe\u2019s sovereign firefighting and civil protection capabilities. | Aerospace Valley",
    "cd026777-c2f4-4bf1-8855-65b6b2451232": "Cementic is preparing to launch clinical trials in French dental clinics, with a U.S. market entry targeted within six months. | Maddyness",
    "70b14ced-4223-4531-8536-93b1ca31af0e": "Revox raised a $3M pre-seed round led by Seedcamp to scale its voice AI infrastructure platform. Initially focused on the U.S. market, the company targets trust-sensitive, high-impact use cases such as debt collection, lead qualification, and hiring pre-screening. The founding team brings deep agent-building experience from Dust and PLUME (YC), having developed Revox after encountering persistent failures in existing voice AI stacks during prior consulting work. | Seedcamp, Frenchweb",
    "c41c757a-fc39-4737-84ee-ccd4bfc6f970": "Sweetech will use the funding to support pilot production, customer acquisition, and R&D as it scales its sustainable rare sugar platform.",
    "69863b18-a582-499f-8a9d-5460264099a2": "Viti-Tunnel closed a \u20ac2M funding round to accelerate commercial rollout in new French wine regions and expand internationally (Europe, U.S., Australia). The capital will also support diversification beyond viticulture into arboriculture, market gardening, red fruits, and agrivoltaics. After two years of industrial scaling and a 40% reduction in production costs, the company has already deployed over 7 km of installations at prestigious estates, including Petrus, Ch\u00e2teau Lafite Rothschild, and Cognac Hennessy. | Journal des Enterprises",
    "805ae9ca-db14-4f6a-aaa0-408f97b6ca33": "Nearly profitable on its home market, Campsider raised \u20ac1.5M to fund its European expansion, targeting Germany and Italy. With \u20ac10M in GMV in 2025 and a network of 600 partner stores (60% outside France), the company plans to reach \u20ac17M in revenue by the end of 2026 and \u20ac24M by 2027, aiming to become the leading European platform for second-hand technical sports equipment. | Groupe Ecomedia, Maddyness",
    "58aa7691-d8dc-4cc0-a817-273586e111a0": "Gamevestor has secured AMF approval and ORIAS registration, enabling it to operate across the EU for investments and internationally for donations. The funding will support a pan-European rollout and a public launch scheduled for early 2026, alongside marketing initiatives and selective team expansion.",
    "1aad26dd-1dfb-4920-8241-bfd36213ec42": "Following its appearance on Qui veut \u00eatre mon associ\u00e9 ? (M6) on January 8, Smartphone iD secured \u20ac200K in funding. The startup is already profitable, generated \u20ac1.7M in revenue in 2024, and is targeting \u20ac5M by 2026. The funds will support international expansion and continued development of its mobile biometric verification technology. | Maddyness",
    "08bda53b-71dd-4f54-a053-f376821df21c": "Holcim has taken a minority stake in BW Ideol and entered into a strategic partnership to supply innovative low-carbon concrete materials for floating offshore wind foundations. The collaboration will support two fabrication lines in Southern France and Northeast Scotland and aligns with Holcim\u2019s NextGen Growth 2030 strategy. BW Ideol also holds equity stakes in two large floating wind projects\u2014960 MW in Northeast Scotland and 270 MW off the southern coast of France\u2014highlighting the industrial scale and maturity of its technology. | PR",
    "d3ab8bcb-327a-453a-bab6-6e35ad1060be": "Abbelight closed a Series B round led by AVANT BIO to accelerate imaging innovation and scale commercial adoption beyond academic research into biopharma, biotech, and CROs. The funding will support international commercial expansion, product development, and continued support of its 100+ installed customer base, reinforcing Abbelight\u2019s position as a key enabling technology provider in life sciences research and drug discovery.",
}


def api_patch(round_id, notes, retries=4):
    for attempt in range(retries):
        r = subprocess.run(
            ["curl", "-s", "-w", "\n__HTTP:%{http_code}__",
             "-X", "PATCH",
             f"{BASE}/funding_rounds?id=eq.{round_id}",
             "-H", f"apikey: {SKEY}",
             "-H", f"Authorization: Bearer {SKEY}",
             "-H", "Content-Type: application/json",
             "-H", "Prefer: return=minimal",
             "-d", json.dumps({"notes": notes})],
            capture_output=True, text=True, timeout=15
        )
        out = r.stdout.strip()
        status = 0
        if "__HTTP:" in out:
            parts = out.rsplit("__HTTP:", 1)
            status = int(parts[1].replace("__", ""))
        if 200 <= status < 300:
            return True
        time.sleep(2 ** (attempt + 1))
    return False


print("Patching news/notes onto 16 funding rounds...")
success = 0
for round_id, notes in NEWS.items():
    ok = api_patch(round_id, notes)
    status = "OK" if ok else "FAIL"
    # Find company name for display
    company = next((k for k, v in {
        "Harmattan AI": "47c2b138-fe1b-47cd-94a0-c4b694226c76",
        "FineHeart": "65c6128f-14fb-452b-bb13-005ea3dca95f",
        "SunLib": "291cf707-48ae-49f6-8491-a23872ec8423",
        "Enodia Therapeutics": "31e8b128-5667-4784-b622-01cf04052401",
        "MYCOPHYTO": "32a53a46-3efb-46f2-9b5d-4edc91e9a9da",
        "Equitable Earth": "67e963b6-3c2e-44cf-8a05-1642e38eed4d",
        "Kepplair Evolution": "ba1cbe26-ba27-405e-9e71-d702be935ecc",
        "Cementic": "cd026777-c2f4-4bf1-8855-65b6b2451232",
        "Revox": "70b14ced-4223-4531-8536-93b1ca31af0e",
        "Sweetech": "c41c757a-fc39-4737-84ee-ccd4bfc6f970",
        "Viti-Tunnel": "69863b18-a582-499f-8a9d-5460264099a2",
        "Campsider": "805ae9ca-db14-4f6a-aaa0-408f97b6ca33",
        "Gamevestor": "58aa7691-d8dc-4cc0-a817-273586e111a0",
        "Smartphone iD": "1aad26dd-1dfb-4920-8241-bfd36213ec42",
        "BW Ideol": "08bda53b-71dd-4f54-a053-f376821df21c",
        "Abbelight": "d3ab8bcb-327a-453a-bab6-6e35ad1060be",
    }.items() if v == round_id), round_id)
    print(f"  {status}: {company}")
    if ok:
        success += 1

print(f"\nDone: {success}/16 patched")
sys.exit(0 if success == 16 else 1)
