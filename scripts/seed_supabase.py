#!/usr/bin/env python3
"""
scripts/seed_supabase.py
Idempotent seeding script for Supabase:
1. Uploads 17 dynamic PoC screenshots to Supabase Storage bucket 'vulnerability-evidence'
2. Uploads 25 individual vulnerability PDF reports to Supabase Storage bucket 'vulnerability-reports'
3. Upserts all 25 vulnerabilities to 'vulnerabilities' table
4. Inserts evidence records into 'vulnerability_evidence' table
5. Inserts report records into 'vulnerability_reports' table
"""

import os
import json
import requests

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "https://smwuphrychfpwhupvreh.supabase.co")
SERVICE_KEY = os.environ.get(
    "SUPABASE_SERVICE_ROLE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtd3VwaHJ5Y2hmcHdodXB2cmVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg3MzAwNCwiZXhwIjoyMTA0NDQ5MDA0fQ.CpjPQXXsOqj-QGqF40FmrqicwmQ76jbFv42EP6YrWwo"
)

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}"
}

EVIDENCE_BUCKET = "vulnerability-evidence"
REPORTS_BUCKET = "vulnerability-reports"
DATASET_PATH = "data/vulnerabilities.json"

DYNAMIC_IMAGE_MAPPING = {
    0: [
        ("0/poc-1.png", "PoC 1.1: Content-Security-Policy Alert & Header Inspection in ZAP", 1),
        ("0/poc-2.png", "PoC 1.2: Response Header Inspection in OWASP ZAP (Missing Fallback)", 2),
        ("0/poc-3.png", "PoC 1.3: Frame-ancestors Header Directive Verification in Browser DevTools", 3)
    ],
    1: [("1/poc-1.png", "PoC 2: Broad Wildcard Directives (https:, wss:) in Content-Security-Policy", 1)],
    2: [("2/poc-1.png", "PoC 3: script-src unsafe-inline Policy Weakness Captured in OWASP ZAP", 1)],
    3: [("3/poc-1.png", "PoC 4: style-src unsafe-inline Directive Allowing Injected Styles", 1)],
    4: [("4/poc-1.png", "PoC 5: Missing Content-Security-Policy Header on HTTP 404 Response", 1)],
    5: [("5/poc-1.png", "PoC 6: Access-Control-Allow-Origin: * Wildcard CORS Configuration", 1)],
    6: [("6/poc-1.png", "PoC 7: Script Tag Lacking Subresource Integrity (SRI) Hash", 1)],
    7: [("7/poc-1.png", "PoC 8: Cross-Domain JavaScript Source File Inclusion from External CDN", 1)],
    8: [("8/poc-1.png", "PoC 9: Missing Strict-Transport-Security (HSTS) Header in ZAP", 1)],
    9: [("9/poc-1.png", "PoC 10: Unix Timestamp Disclosure Flagged in API Response / Markdown", 1)],
    10: [("10/poc-1.png", "PoC 11: Suspicious HTML Development Comments Disclosing Analytics Setup", 1)],
    11: [("11/poc-1.png", "PoC 12: Modern Web Application (SPA) Client-Side DOM Framework Detection", 1)],
    12: [("12/poc-1.png", "PoC 13: Permissive Cache-Control Directives on Authenticated Dashboard", 1)],
    13: [("13/poc-1.png", "PoC 14: Retrieved from Shared Cache with Age Header Detection", 1)],
    14: [("14/poc-1.png", "PoC 15: User Agent Fuzzer Testing Yielding HTTP 403 WAF Filter Response", 1)],
}

def ensure_bucket(bucket_name):
    url = f"{SUPABASE_URL}/storage/v1/bucket"
    r = requests.post(url, headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "Content-Type": "application/json"}, json={"id": bucket_name, "name": bucket_name, "public": True})
    if r.status_code in (200, 201):
        print(f"[Storage] Created public bucket: {bucket_name}")
    elif r.status_code == 400 and "already exists" in r.text.lower():
        print(f"[Storage] Bucket already exists: {bucket_name}")
    else:
        print(f"[Storage] Bucket check {bucket_name}: {r.status_code}")

def upload_file_to_storage(bucket, storage_path, local_path, content_type):
    with open(local_path, "rb") as f:
        file_bytes = f.read()

    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{storage_path}"
    upload_headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": content_type,
        "x-upsert": "true"
    }
    r = requests.post(url, headers=upload_headers, data=file_bytes)
    if r.status_code in (200, 201):
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{storage_path}"
        return public_url
    else:
        # Try PUT if POST failed
        r_put = requests.put(url, headers=upload_headers, data=file_bytes)
        if r_put.status_code in (200, 201):
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{storage_path}"
            return public_url
        raise RuntimeError(f"Failed to upload {storage_path} to {bucket}: {r.status_code} {r.text}")

def seed_all():
    print("=== Starting WORLD MONITOR Supabase Seeding ===")
    ensure_bucket(EVIDENCE_BUCKET)
    ensure_bucket(REPORTS_BUCKET)

    # 1. Upload Evidence Screenshots
    print("\n--- 1. Uploading Dynamic PoC Screenshots (17 images) ---")
    evidence_urls = {} # (vuln_num, rel_path) -> public_url
    for vuln_num, items in DYNAMIC_IMAGE_MAPPING.items():
        for rel_path, caption, order in items:
            local_path = os.path.join("storage_assets/vulnerability-evidence/dynamic", rel_path)
            storage_path = f"dynamic/{rel_path}"
            pub_url = upload_file_to_storage(EVIDENCE_BUCKET, storage_path, local_path, "image/png")
            evidence_urls[(vuln_num, rel_path)] = {
                "url": pub_url,
                "storage_path": storage_path,
                "caption": caption,
                "display_order": order
            }
            print(f"  Uploaded PoC: {storage_path} -> {pub_url}")

    # 2. Upload PDF Reports (25 reports)
    print("\n--- 2. Uploading 25 Individual Vulnerability PDF Reports ---")
    report_urls = {} # (assessment_type, vuln_num) -> public_url
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        vulns = json.load(f)

    for v in vulns:
        v_type = v["assessment_type"]
        v_num = v["vulnerability_number"]
        storage_path = f"{v_type}/{v_num}.pdf"
        local_path = os.path.join("storage_assets/vulnerability-reports", v_type, f"{v_num}.pdf")
        pub_url = upload_file_to_storage(REPORTS_BUCKET, storage_path, local_path, "application/pdf")
        report_urls[(v_type, v_num)] = {
            "url": pub_url,
            "storage_path": storage_path
        }
        print(f"  Uploaded Report: {storage_path} -> {pub_url}")

    # 3. Check if database tables exist in Supabase
    print("\n--- 3. Checking Supabase Database Tables ---")
    check_url = f"{SUPABASE_URL}/rest/v1/vulnerabilities?select=id&limit=1"
    r_check = requests.get(check_url, headers=HEADERS)

    if r_check.status_code == 200:
        print("[Database] 'vulnerabilities' table is active! Seeding records...")
        # Upsert vulnerabilities
        upsert_headers = {
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        }
        upsert_url = f"{SUPABASE_URL}/rest/v1/vulnerabilities"
        r_up = requests.post(upsert_url, headers=upsert_headers, json=vulns)
        if r_up.status_code in (200, 201):
            print(f"[Database] Successfully upserted {len(vulns)} vulnerabilities!")
        else:
            print(f"[Database] Upsert returned: {r_up.status_code} {r_up.text}")

        # Fetch IDs
        fetch_r = requests.get(f"{SUPABASE_URL}/rest/v1/vulnerabilities?select=id,assessment_type,vulnerability_number", headers=HEADERS)
        vuln_db_map = {}
        if fetch_r.status_code == 200:
            for row in fetch_r.json():
                vuln_db_map[(row["assessment_type"], row["vulnerability_number"])] = row["id"]

        # Insert Evidence
        evidence_rows = []
        for (v_num, rel_path), meta in evidence_urls.items():
            vuln_id = vuln_db_map.get(("dynamic", v_num))
            if vuln_id:
                evidence_rows.append({
                    "vulnerability_id": vuln_id,
                    "evidence_type": "poc_screenshot",
                    "image_path": meta["storage_path"],
                    "image_url": meta["url"],
                    "caption": meta["caption"],
                    "display_order": meta["display_order"]
                })
        if evidence_rows:
            requests.delete(f"{SUPABASE_URL}/rest/v1/vulnerability_evidence?id=neq.00000000-0000-0000-0000-000000000000", headers=HEADERS)
            r_ev = requests.post(f"{SUPABASE_URL}/rest/v1/vulnerability_evidence", headers=HEADERS, json=evidence_rows)
            print(f"[Database] Inserted {len(evidence_rows)} evidence records (status: {r_ev.status_code})")

        # Insert Reports
        report_rows = []
        for (v_type, v_num), meta in report_urls.items():
            vuln_id = vuln_db_map.get((v_type, v_num))
            if vuln_id:
                report_rows.append({
                    "vulnerability_id": vuln_id,
                    "pdf_path": meta["storage_path"],
                    "pdf_url": meta["url"]
                })
        if report_rows:
            requests.delete(f"{SUPABASE_URL}/rest/v1/vulnerability_reports?id=neq.00000000-0000-0000-0000-000000000000", headers=HEADERS)
            r_rep = requests.post(f"{SUPABASE_URL}/rest/v1/vulnerability_reports", headers=HEADERS, json=report_rows)
            print(f"[Database] Inserted {len(report_rows)} report records (status: {r_rep.status_code})")

    else:
        print("[Database Note] 'vulnerabilities' table not found yet via REST API.")
        print("Please run 'supabase/schema.sql' in your Supabase SQL Editor:")
        print(f"URL: {SUPABASE_URL.replace('.supabase.co', '')}/sql/new or https://supabase.com/dashboard/project/smwuphrychfpwhupvreh/sql/new")
        print("Once executed, re-run this script: python scripts/seed_supabase.py")

    # Also save a compiled local client-fallback bundle with all public URLs attached
    client_bundle = []
    for v in vulns:
        v_copy = dict(v)
        v_type = v["assessment_type"]
        v_num = v["vulnerability_number"]
        rep_meta = report_urls.get((v_type, v_num))
        if rep_meta:
            v_copy["pdf_url"] = rep_meta["url"]
            v_copy["pdf_path"] = rep_meta["storage_path"]
        
        v_copy["evidence"] = []
        if v_type == "dynamic":
            for (vn, rp), emeta in evidence_urls.items():
                if vn == v_num:
                    v_copy["evidence"].append({
                        "image_url": emeta["url"],
                        "image_path": emeta["storage_path"],
                        "caption": emeta["caption"],
                        "display_order": emeta["display_order"]
                    })
            v_copy["evidence"].sort(key=lambda x: x["display_order"])
        client_bundle.append(v_copy)

    with open("data/client_vulnerabilities_bundle.json", "w", encoding="utf-8") as f:
        json.dump(client_bundle, f, indent=2)
    print(f"\n[OK] Generated data/client_vulnerabilities_bundle.json with live Supabase Storage URLs!")

if __name__ == "__main__":
    seed_all()
