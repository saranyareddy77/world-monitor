#!/usr/bin/env python3
"""
scripts/generate_reports.py
Generates 25 individual professional PDF reports using ReportLab:
- 15 Dynamic Vulnerability Reports (dynamic/0.pdf to dynamic/14.pdf) with embedded PoC screenshots
- 10 Static Vulnerability Reports (static/1.pdf to static/10.pdf) with textual source analysis (NO images)
Outputs to: storage_assets/vulnerability-reports/{dynamic,static}/{num}.pdf
"""

import os
import json
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

DATASET_PATH = "data/vulnerabilities.json"
EVIDENCE_DIR = "storage_assets/vulnerability-evidence/dynamic"
OUTPUT_DIR = "storage_assets/vulnerability-reports"

# Authoritative PoC screenshot mapping for Dynamic vulnerabilities
DYNAMIC_IMAGE_MAPPING = {
    0: ["0/poc-1.png", "0/poc-2.png", "0/poc-3.png"],
    1: ["1/poc-1.png"],
    2: ["2/poc-1.png"],
    3: ["3/poc-1.png"],
    4: ["4/poc-1.png"],
    5: ["5/poc-1.png"],
    6: ["6/poc-1.png"],
    7: ["7/poc-1.png"],
    8: ["8/poc-1.png"],
    9: ["9/poc-1.png"],
    10: ["10/poc-1.png"],
    11: ["11/poc-1.png"],
    12: ["12/poc-1.png"],
    13: ["13/poc-1.png"],
    14: ["14/poc-1.png"],
}

# Pastel Palette
COLOR_BG_LIGHT = colors.HexColor("#FFF8FA")
COLOR_PRIMARY_PINK = colors.HexColor("#F3B6C8")
COLOR_ACCENT_PINK = colors.HexColor("#E27A9B")
COLOR_LAVENDER = colors.HexColor("#E9DDFB")
COLOR_SOFT_PURPLE = colors.HexColor("#9F85D8")
COLOR_DARK_TEXT = colors.HexColor("#292735")
COLOR_SECONDARY_TEXT = colors.HexColor("#645F73")
COLOR_BORDER = colors.HexColor("#E8D8E0")
COLOR_CARD_BG = colors.HexColor("#FAF5F8")

def xml_escape(text):
    if text is None:
        return ""
    return html.escape(str(text))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Top header line
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.75)
        self.line(40, 755, 572, 755)

        self.setFont("Helvetica", 8)
        self.setFillColor(COLOR_SECONDARY_TEXT)
        self.drawString(40, 760, "WORLD MONITOR — Security Vulnerability Assessment Report")

        # Bottom footer line
        self.line(40, 45, 572, 45)
        self.drawString(40, 32, "CONFIDENTIAL — FOR AUTHORIZED SECURITY PERSONNEL ONLY")
        self.drawRightString(572, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf_report(vuln, output_pdf_path):
    os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=COLOR_DARK_TEXT,
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=COLOR_SECONDARY_TEXT,
        spaceAfter=15
    )
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=COLOR_ACCENT_PINK,
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyMain',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=COLOR_DARK_TEXT,
        spaceAfter=6
    )
    code_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#2C2638"),
        backColor=colors.HexColor("#F5EFF4"),
        borderPadding=6,
        spaceAfter=8
    )
    caption_style = ParagraphStyle(
        'ImgCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=COLOR_SECONDARY_TEXT,
        alignment=1, # Center
        spaceAfter=10
    )

    story = []

    # Title & Branding
    assessment_type_label = vuln["assessment_type"].capitalize()
    vuln_id_str = f"WS-{vuln['assessment_type'][:3].upper()}-{vuln['vulnerability_number']:02d}"
    
    story.append(Paragraph(f"<b>WORLD MONITOR</b> · Security Assessment Report", subtitle_style))
    story.append(Paragraph(f"{xml_escape(vuln['title'])}", title_style))
    story.append(Paragraph(f"Assessment Identifier: <b>{vuln_id_str}</b>  |  Assessment Type: <b>{assessment_type_label}</b>  |  Date: <b>September 08, 2026</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_PRIMARY_PINK, spaceBefore=2, spaceAfter=10))

    # Meta Overview Table
    cvss_str = str(vuln.get('cvss')) if vuln.get('cvss') is not None else "N/A"
    cwe_str = xml_escape(vuln.get('cwe_id') or "N/A")
    wasc_str = xml_escape(vuln.get('wasc_id') or "N/A")
    owasp_str = xml_escape(vuln.get('owasp') or "N/A")
    conf_str = xml_escape(vuln.get('confidence') or "N/A")

    sev_color = colors.HexColor("#E25B7F") if vuln['severity'].upper() in ['CRITICAL', 'HIGH'] else colors.HexColor("#E28F34") if vuln['severity'].upper() == 'MEDIUM' else colors.HexColor("#4C9E7D")

    meta_data = [
        [
            Paragraph(f"<b>Severity:</b> <font color='{sev_color.hexval()}'>{xml_escape(vuln['severity'].upper())}</font>", body_style),
            Paragraph(f"<b>CVSS:</b> {cvss_str}", body_style),
            Paragraph(f"<b>CWE:</b> {cwe_str}", body_style)
        ],
        [
            Paragraph(f"<b>OWASP:</b> {owasp_str}", body_style),
            Paragraph(f"<b>WASC ID:</b> {wasc_str}", body_style),
            Paragraph(f"<b>Confidence:</b> {conf_str}", body_style)
        ],
        [
            Paragraph(f"<b>Target / Component:</b> {xml_escape(vuln.get('affected_component') or 'N/A')}", body_style),
            Paragraph(f"<b>Affected URL:</b> {xml_escape(vuln.get('affected_url') or 'N/A')}", body_style),
            Paragraph(f"<b>Parameter:</b> {xml_escape(vuln.get('parameter') or 'N/A')}", body_style)
        ]
    ]

    t = Table(meta_data, colWidths=[175, 175, 182])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CARD_BG),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # Description
    story.append(Paragraph("1. Description", h1_style))
    story.append(Paragraph(xml_escape(vuln['description']), body_style))

    # Steps to Reproduce
    story.append(Paragraph("2. Steps to Reproduce", h1_style))
    steps_escaped = "<br/>".join([xml_escape(line) for line in vuln['steps_to_reproduce'].split("\n")])
    story.append(Paragraph(steps_escaped, body_style))

    # Safe Proof of Concept
    story.append(Paragraph("3. Controlled Proof of Concept", h1_style))
    poc_escaped = "<br/>".join([xml_escape(line).replace(" ", "&nbsp;") for line in vuln['proof_of_concept'].split("\n")])
    story.append(Paragraph(f"<font face='Courier'>{poc_escaped}</font>", code_style))

    # Business Impact Assessment
    story.append(Paragraph("4. Business & Security Impact", h1_style))
    story.append(Paragraph(xml_escape(vuln['business_impact']), body_style))

    # Remediation
    story.append(Paragraph("5. Remediation Recommendations", h1_style))
    story.append(Paragraph(f"<b>Primary Fix:</b> {xml_escape(vuln['remediation'])}", body_style))
    story.append(Spacer(1, 4))
    remed_escaped = "<br/>".join([xml_escape(line) for line in vuln['remediation_recommendations'].split("\n")])
    story.append(Paragraph(remed_escaped, body_style))

    # Evidence Section
    story.append(Paragraph("6. Evidence & Validation", h1_style))

    if vuln["assessment_type"] == "dynamic":
        vuln_num = vuln["vulnerability_number"]
        img_names = DYNAMIC_IMAGE_MAPPING.get(vuln_num, [])
        if img_names:
            for i, rel_img in enumerate(img_names):
                img_path = os.path.join(EVIDENCE_DIR, rel_img)
                if os.path.exists(img_path):
                    # Keep image and caption together
                    img_elem = Image(img_path, width=500, height=260)
                    cap_text = f"Figure {i+1}: Matched Proof-of-Concept Screenshot for Vulnerability #{vuln_num} ({rel_img})"
                    story.append(KeepTogether([
                        Spacer(1, 6),
                        img_elem,
                        Spacer(1, 3),
                        Paragraph(cap_text, caption_style)
                    ]))
        else:
            story.append(Paragraph("<i>No dynamic screenshots attached.</i>", body_style))
    else:
        # Static vulnerability explicitly receives NO screenshot
        static_note = (
            "<b>Evidence Type: Textual / Static Source Analysis</b><br/>"
            "This finding was identified through static analysis of repository source code and configuration files. "
            "Per assessment requirements, no simulated runtime screenshots or dynamic PoC captures are applicable. "
            "Verification must be performed via source code review and static analysis tool verification."
        )
        story.append(Paragraph(static_note, code_style))

    # Authorization statement
    story.append(Spacer(1, 10))
    auth_statement = (
        "<b>Authorization & Safety Compliance:</b> This security assessment was conducted strictly under "
        "authorized parameters in accordance with ethical hacking standards. All validations and safe proof-of-concept "
        "tests were non-destructive. No persistent modifications or sensitive data exfiltration occurred."
    )
    story.append(Paragraph(auth_statement, ParagraphStyle('Auth', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.5, leading=10, textColor=COLOR_SECONDARY_TEXT)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"  [PDF OK] Generated: {output_pdf_path}")

def generate_all_reports():
    print("Loading vulnerabilities dataset...")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        vulns = json.load(f)

    generated_count = 0
    for v in vulns:
        v_type = v["assessment_type"]
        v_num = v["vulnerability_number"]
        pdf_path = os.path.join(OUTPUT_DIR, v_type, f"{v_num}.pdf")
        build_pdf_report(v, pdf_path)
        generated_count += 1

    print(f"\nSuccessfully generated all {generated_count} individual PDF vulnerability reports!")
    assert generated_count == 25, f"Expected 25 reports, got {generated_count}"

if __name__ == "__main__":
    generate_all_reports()
