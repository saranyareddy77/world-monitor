-- WORLD MONITOR Database Schema
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/smwuphrychfpwhupvreh/sql/new

-- 1. Enable pgcrypto extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create vulnerabilities table
CREATE TABLE IF NOT EXISTS public.vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vulnerability_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('dynamic', 'static')),
    description TEXT,
    affected_component TEXT,
    affected_url TEXT,
    parameter TEXT,
    severity TEXT NOT NULL,
    confidence TEXT,
    cvss NUMERIC,
    cwe_id TEXT,
    wasc_id TEXT,
    owasp TEXT,
    alert_reference TEXT,
    steps_to_reproduce TEXT,
    proof_of_concept TEXT,
    business_impact TEXT,
    remediation TEXT,
    remediation_recommendations TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    source_document TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_assessment_vuln_num UNIQUE (assessment_type, vulnerability_number)
);

-- 3. Create vulnerability_evidence table
CREATE TABLE IF NOT EXISTS public.vulnerability_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vulnerability_id UUID NOT NULL REFERENCES public.vulnerabilities(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL DEFAULT 'poc_screenshot',
    image_path TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create vulnerability_reports table
CREATE TABLE IF NOT EXISTS public.vulnerability_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vulnerability_id UUID NOT NULL REFERENCES public.vulnerabilities(id) ON DELETE CASCADE UNIQUE,
    pdf_path TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_type ON public.vulnerabilities(assessment_type);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON public.vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_evidence_vuln_id ON public.vulnerability_evidence(vulnerability_id);
CREATE INDEX IF NOT EXISTS idx_reports_vuln_id ON public.vulnerability_reports(vulnerability_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vulnerability_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vulnerability_reports ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies: Allow public read-only access (for anon client)
DROP POLICY IF EXISTS "Allow public read on vulnerabilities" ON public.vulnerabilities;
CREATE POLICY "Allow public read on vulnerabilities" ON public.vulnerabilities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on vulnerability_evidence" ON public.vulnerability_evidence;
CREATE POLICY "Allow public read on vulnerability_evidence" ON public.vulnerability_evidence FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on vulnerability_reports" ON public.vulnerability_reports;
CREATE POLICY "Allow public read on vulnerability_reports" ON public.vulnerability_reports FOR SELECT USING (true);

-- 8. RLS Policies: Allow service_role complete access for admin, seeding, and report generation
DROP POLICY IF EXISTS "Allow service role all on vulnerabilities" ON public.vulnerabilities;
CREATE POLICY "Allow service role all on vulnerabilities" ON public.vulnerabilities FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Allow service role all on vulnerability_evidence" ON public.vulnerability_evidence;
CREATE POLICY "Allow service role all on vulnerability_evidence" ON public.vulnerability_evidence FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Allow service role all on vulnerability_reports" ON public.vulnerability_reports;
CREATE POLICY "Allow service role all on vulnerability_reports" ON public.vulnerability_reports FOR ALL TO service_role USING (true);
