#!/usr/bin/env python3
"""
scripts/extract_evidence.py
Extracts the 17 dynamic PoC screenshots from the authoritative PDF with the exact mapping:
Dynamic 0  -> 1.1, 1.2, 1.3 (3 images)
Dynamic 1  -> PoC 2 (1 image)
Dynamic 2  -> PoC 3 (1 image)
...
Dynamic 14 -> PoC 15 (1 image)
Total: 17 screenshots
Static findings: 0 screenshots
"""

import os
import pymupdf

SOURCE_PDF = "c:/Users/Harshavardini/Downloads/WorldMonitor_Combined_Dynamic_and_Static_Security_Assessment_CORRECTED.pdf"
OUTPUT_DIR = "storage_assets/vulnerability-evidence/dynamic"

# (Page number in combined PDF, [(relative path, caption, display_order)])
MAPPING = [
    (3, [
        ("0/poc-1.png", "PoC 1.1: Content-Security-Policy Alert & Header Inspection in ZAP", 1),
        ("0/poc-2.png", "PoC 1.2: Response Header Inspection in OWASP ZAP (Missing Fallback)", 2)
    ]),
    (4, [
        ("0/poc-3.png", "PoC 1.3: Frame-ancestors Header Directive Verification in Browser DevTools", 3)
    ]),
    (5, [
        ("1/poc-1.png", "PoC 2: Broad Wildcard Directives (https:, wss:) in Content-Security-Policy", 1)
    ]),
    (7, [
        ("2/poc-1.png", "PoC 3: script-src unsafe-inline Policy Weakness Captured in OWASP ZAP", 1)
    ]),
    (9, [
        ("3/poc-1.png", "PoC 4: style-src unsafe-inline Directive Allowing Injected Styles", 1)
    ]),
    (11, [
        ("4/poc-1.png", "PoC 5: Missing Content-Security-Policy Header on HTTP 404 Response", 1)
    ]),
    (13, [
        ("5/poc-1.png", "PoC 6: Access-Control-Allow-Origin: * Wildcard CORS Configuration", 1)
    ]),
    (15, [
        ("6/poc-1.png", "PoC 7: Script Tag Lacking Subresource Integrity (SRI) Hash", 1)
    ]),
    (17, [
        ("7/poc-1.png", "PoC 8: Cross-Domain JavaScript Source File Inclusion from External CDN", 1)
    ]),
    (19, [
        ("8/poc-1.png", "PoC 9: Missing Strict-Transport-Security (HSTS) Header in ZAP", 1)
    ]),
    (21, [
        ("9/poc-1.png", "PoC 10: Unix Timestamp Disclosure Flagged in API Response / Markdown", 1)
    ]),
    (23, [
        ("10/poc-1.png", "PoC 11: Suspicious HTML Development Comments Disclosing Analytics Setup", 1)
    ]),
    (25, [
        ("11/poc-1.png", "PoC 12: Modern Web Application (SPA) Client-Side DOM Framework Detection", 1)
    ]),
    (27, [
        ("12/poc-1.png", "PoC 13: Permissive Cache-Control Directives on Authenticated Dashboard", 1)
    ]),
    (29, [
        ("13/poc-1.png", "PoC 14: Retrieved from Shared Cache with Age Header Detection", 1)
    ]),
    (31, [
        ("14/poc-1.png", "PoC 15: User Agent Fuzzer Testing Yielding HTTP 403 WAF Filter Response", 1)
    ]),
]

def extract_all():
    print(f"Opening {SOURCE_PDF}...")
    doc = pymupdf.open(SOURCE_PDF)
    extracted_count = 0
    manifest = []

    for page_num, targets in MAPPING:
        page = doc[page_num - 1]
        img_list = page.get_images()
        if len(img_list) < len(targets):
            raise ValueError(f"Page {page_num} has {len(img_list)} images, expected at least {len(targets)}")

        for idx, (rel_path, caption, order) in enumerate(targets):
            xref = img_list[idx][0]
            base_img = doc.extract_image(xref)
            img_bytes = base_img["image"]

            full_path = os.path.join(OUTPUT_DIR, rel_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, "wb") as f:
                f.write(img_bytes)

            extracted_count += 1
            vuln_num = int(rel_path.split("/")[0])
            manifest.append({
                "vulnerability_number": vuln_num,
                "file_path": rel_path,
                "caption": caption,
                "display_order": order,
                "size_bytes": len(img_bytes)
            })
            print(f"  [OK] Dynamic {vuln_num} -> {rel_path} ({len(img_bytes)} bytes): {caption}")

    print(f"\nSuccessfully extracted {extracted_count} dynamic PoC screenshots into {OUTPUT_DIR}.")
    return manifest

if __name__ == "__main__":
    extract_all()
