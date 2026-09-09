import { createClient } from '@supabase/supabase-js';
import type { Vulnerability } from '../types/vulnerability';
import fallbackDataset from '../data/vulnerabilities.json';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://smwuphrychfpwhupvreh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtd3VwaHJ5Y2hmcHdodXB2cmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NzMwMDQsImV4cCI6MjEwNDQ0OTAwNH0.mxiXnYBpUCAHdfaXaB5SZ9SOCYqoPysjhxigw6vlb9s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch all vulnerabilities from Supabase, filtered optionally by assessment type.
 * Automatically falls back to authoritative dataset if Supabase tables are pending schema creation.
 */
export async function fetchVulnerabilities(type?: 'dynamic' | 'static'): Promise<Vulnerability[]> {
  try {
    let query = supabase
      .from('vulnerabilities')
      .select(`
        *,
        evidence:vulnerability_evidence(*),
        reports:vulnerability_reports(*)
      `)
      .order('vulnerability_number', { ascending: true });

    if (type) {
      query = query.eq('assessment_type', type);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      // Format Supabase joined data to match Vulnerability interface
      return data.map((item: any) => {
        const report = Array.isArray(item.reports) && item.reports.length > 0 ? item.reports[0] : item.reports;
        return {
          ...item,
          pdf_url: report?.pdf_url || `https://smwuphrychfpwhupvreh.supabase.co/storage/v1/object/public/vulnerability-reports/${item.assessment_type}/${item.vulnerability_number}.pdf`,
          evidence: Array.isArray(item.evidence) ? item.evidence.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)) : []
        };
      });
    }
  } catch (err) {
    console.warn('[WORLD MONITOR] Supabase query notice, using local verified dataset:', err);
  }

  // Fallback to verified local dataset with live Supabase Storage URLs
  let results = fallbackDataset as Vulnerability[];
  if (type) {
    results = results.filter(v => v.assessment_type === type);
  }
  return results.sort((a, b) => a.vulnerability_number - b.vulnerability_number);
}

/**
 * Search vulnerabilities in Supabase with partial matching, filtered strictly by assessment_type.
 * Searches title, CWE, affected component, and description.
 * Falls back cleanly to authoritative dataset if Supabase network is unavailable.
 */
export async function searchVulnerabilities(
  queryText: string,
  assessmentType: 'dynamic' | 'static'
): Promise<Vulnerability[]> {
  const clean = queryText.trim();
  if (!clean) return [];

  // Normalize common search variations like "cwe 79" -> "cwe-79"
  const normalizedClean = clean.replace(/cwe\s+/i, 'cwe-');
  const numVal = parseInt(clean.replace('#', ''), 10);
  const isNumeric = !isNaN(numVal);

  try {
    let query = supabase
      .from('vulnerabilities')
      .select(`
        *,
        evidence:vulnerability_evidence(*),
        reports:vulnerability_reports(*)
      `)
      .eq('assessment_type', assessmentType);

    // Build or clause for Supabase
    const filterClauses = [
      `title.ilike.%${clean}%`,
      `cwe_id.ilike.%${clean}%`,
      `cwe_id.ilike.%${normalizedClean}%`,
      `affected_component.ilike.%${clean}%`,
      `description.ilike.%${clean}%`
    ];
    if (isNumeric) {
      filterClauses.push(`vulnerability_number.eq.${numVal}`);
    }

    query = query.or(filterClauses.join(',')).order('vulnerability_number', { ascending: true });

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((item: any) => {
        const report = Array.isArray(item.reports) && item.reports.length > 0 ? item.reports[0] : item.reports;
        return {
          ...item,
          pdf_url: report?.pdf_url || `https://smwuphrychfpwhupvreh.supabase.co/storage/v1/object/public/vulnerability-reports/${item.assessment_type}/${item.vulnerability_number}.pdf`,
          evidence: Array.isArray(item.evidence) ? item.evidence.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)) : []
        };
      });
    }
  } catch (err) {
    console.warn('[WORLD MONITOR] Supabase search notice, falling back to local dataset:', err);
  }

  // Fallback to local verified dataset
  const q = clean.toLowerCase();
  const qNorm = normalizedClean.toLowerCase();

  const matched = (fallbackDataset as Vulnerability[]).filter(v => {
    if (v.assessment_type !== assessmentType) return false;
    const titleMatch = v.title.toLowerCase().includes(q);
    const cweMatch = v.cwe_id ? (v.cwe_id.toLowerCase().includes(q) || v.cwe_id.toLowerCase().includes(qNorm)) : false;
    const owaspMatch = v.owasp ? v.owasp.toLowerCase().includes(q) : false;
    const compMatch = v.affected_component ? v.affected_component.toLowerCase().includes(q) : false;
    const descMatch = v.description ? v.description.toLowerCase().includes(q) : false;
    const numMatch = isNumeric && v.vulnerability_number === numVal;
    return titleMatch || cweMatch || owaspMatch || compMatch || descMatch || numMatch;
  });

  return matched.sort((a, b) => a.vulnerability_number - b.vulnerability_number);
}

/**
 * Fetch a single vulnerability by assessment type and vulnerability number
 */
export async function fetchVulnerability(type: 'dynamic' | 'static', number: number): Promise<Vulnerability | null> {
  try {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .select(`
        *,
        evidence:vulnerability_evidence(*),
        reports:vulnerability_reports(*)
      `)
      .eq('assessment_type', type)
      .eq('vulnerability_number', number)
      .maybeSingle();

    if (!error && data) {
      const report = Array.isArray(data.reports) && data.reports.length > 0 ? data.reports[0] : data.reports;
      return {
        ...data,
        pdf_url: report?.pdf_url || `https://smwuphrychfpwhupvreh.supabase.co/storage/v1/object/public/vulnerability-reports/${data.assessment_type}/${data.vulnerability_number}.pdf`,
        evidence: Array.isArray(data.evidence) ? data.evidence.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)) : []
      };
    }
  } catch (err) {
    console.warn('[WORLD MONITOR] Single query notice:', err);
  }

  // Fallback
  const found = (fallbackDataset as Vulnerability[]).find(
    v => v.assessment_type === type && v.vulnerability_number === number
  );
  return found || null;
}
