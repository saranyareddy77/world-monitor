import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Filter,
  Eye,
  ExternalLink,
  Code,
  Globe,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  Download,
  Info
} from 'lucide-react';
import type { Vulnerability, AssessmentType } from '../types/vulnerability';

interface Screen4FindingsProps {
  vulnerabilities: Vulnerability[];
  currentSelectedVuln: Vulnerability;
  onSelectForAssessment: (vuln: Vulnerability) => void;
  onBackToRemediation: () => void;
  onRestartWorkflow: () => void;
}

export const Screen4Findings: React.FC<Screen4FindingsProps> = ({
  vulnerabilities,
  currentSelectedVuln,
  onSelectForAssessment,
  onBackToRemediation,
  onRestartWorkflow,
}) => {
  const [filterType, setFilterType] = useState<AssessmentType | 'all'>('all');
  const [detailModalVuln, setDetailModalVuln] = useState<Vulnerability | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'poc' | 'remediation'>('overview');

  const filteredVulns = vulnerabilities.filter(v => {
    if (filterType === 'all') return true;
    return v.assessment_type === filterType;
  });

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-info';
    }
  };

  const getSeverityAccentClass = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical': return 'accent-critical';
      case 'high': return 'accent-high';
      case 'medium': return 'accent-medium';
      case 'low': return 'accent-low';
      default: return 'accent-info';
    }
  };

  const handleCopyPoC = (pocText: string) => {
    navigator.clipboard.writeText(pocText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="screen-container">
      {/* Screen Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="screen-title">Other Vulnerabilities</h1>
        <p className="screen-subtitle" style={{ margin: 0 }}>
          Additional security findings identified during this assessment.
        </p>
      </div>

      {/* Summary and Filter Bar */}
      <div className="findings-count-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={18} style={{ color: 'var(--pink-deep)' }} />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {filteredVulns.length} vulnerabilities found in database
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn-outline ${filterType === 'all' ? 'btn-primary' : ''}`}
            onClick={() => setFilterType('all')}
            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
          >
            All ({vulnerabilities.length})
          </button>
          <button
            type="button"
            className={`btn-outline ${filterType === 'dynamic' ? 'btn-primary' : ''}`}
            onClick={() => setFilterType('dynamic')}
            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
          >
            Dynamic (15)
          </button>
          <button
            type="button"
            className={`btn-outline ${filterType === 'static' ? 'btn-primary' : ''}`}
            onClick={() => setFilterType('static')}
            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
          >
            Static (10)
          </button>
        </div>
      </div>

      {/* Vulnerability Cards Responsive Grid */}
      <div className="findings-grid">
        {filteredVulns.map((vuln) => {
          const isCurrentlyActive =
            vuln.vulnerability_number === currentSelectedVuln.vulnerability_number &&
            vuln.assessment_type === currentSelectedVuln.assessment_type;

          return (
            <div
              key={`${vuln.assessment_type}-${vuln.vulnerability_number}`}
              className="vuln-card"
              style={{
                border: isCurrentlyActive ? '2px solid var(--pink-primary)' : undefined,
                background: isCurrentlyActive ? '#FFF9FB' : undefined,
              }}
            >
              <div className={`vuln-card-accent ${getSeverityAccentClass(vuln.severity)}`} />

              <div>
                <div className="vuln-card-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {vuln.assessment_type === 'static' ? <Code size={13} /> : <Globe size={13} />}
                    <span>#{vuln.vulnerability_number} · {vuln.assessment_type.toUpperCase()}</span>
                  </div>

                  <span className={`badge ${getSeverityBadgeClass(vuln.severity)}`}>
                    {vuln.severity.toUpperCase()}
                  </span>
                </div>

                <h3 className="vuln-card-title">
                  {vuln.title}
                </h3>

                <div className="vuln-card-meta">
                  {vuln.cvss !== null && vuln.cvss !== undefined && (
                    <span className="badge badge-neutral">CVSS {vuln.cvss.toFixed(1)}</span>
                  )}
                  {vuln.cwe_id && (
                    <span className="badge badge-neutral">{vuln.cwe_id}</span>
                  )}
                  {vuln.owasp && (
                    <span className="badge badge-neutral">OWASP {vuln.owasp}</span>
                  )}
                </div>
              </div>

              <div>
                <div className="vuln-card-footer">
                  <div className="component-tag" title={vuln.affected_component}>
                    {vuln.affected_component}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--sev-low)', fontWeight: 600 }}>
                      ● Open
                    </span>

                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: '5px 12px', fontSize: '0.74rem' }}
                      onClick={() => {
                        setDetailModalVuln(vuln);
                        setActiveModalTab('overview');
                      }}
                    >
                      View Finding →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBackToRemediation}
        >
          ← Back to Remediation
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={onRestartWorkflow}
        >
          <span>Start New Assessment</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* FINDING DETAIL MODAL / DRAWER */}
      {detailModalVuln && (
        <div className="modal-overlay" onClick={() => setDetailModalVuln(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '860px' }}>
            <button className="modal-close" onClick={() => setDetailModalVuln(null)}>✕</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className={`badge ${getSeverityBadgeClass(detailModalVuln.severity)}`}>
                {detailModalVuln.severity.toUpperCase()}
              </span>
              <span className="badge badge-neutral">
                {detailModalVuln.assessment_type.toUpperCase()} #{detailModalVuln.vulnerability_number}
              </span>
              {detailModalVuln.cvss !== null && detailModalVuln.cvss !== undefined && (
                <span className="badge badge-neutral">CVSS {detailModalVuln.cvss.toFixed(1)}</span>
              )}
              {detailModalVuln.cwe_id && (
                <span className="badge badge-neutral">{detailModalVuln.cwe_id}</span>
              )}
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
              {detailModalVuln.title}
            </h2>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                className={`btn-outline ${activeModalTab === 'overview' ? 'btn-primary' : ''}`}
                onClick={() => setActiveModalTab('overview')}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                Overview
              </button>
              <button
                type="button"
                className={`btn-outline ${activeModalTab === 'poc' ? 'btn-primary' : ''}`}
                onClick={() => setActiveModalTab('poc')}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                Safe PoC & Evidence
              </button>
              <button
                type="button"
                className={`btn-outline ${activeModalTab === 'remediation' ? 'btn-primary' : ''}`}
                onClick={() => setActiveModalTab('remediation')}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                Remediation
              </button>
            </div>

            {/* Tab: Overview */}
            {activeModalTab === 'overview' && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {detailModalVuln.description}
                </p>

                <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Affected Component:</strong> {detailModalVuln.affected_component}</div>
                  {detailModalVuln.affected_url && <div><strong>URL:</strong> <code>{detailModalVuln.affected_url}</code></div>}
                  {detailModalVuln.parameter && <div><strong>Parameter:</strong> <code>{detailModalVuln.parameter}</code></div>}
                  {detailModalVuln.alert_reference && <div><strong>Alert Reference:</strong> {detailModalVuln.alert_reference}</div>}
                </div>

                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Business & Security Impact
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {detailModalVuln.business_impact}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Safe PoC */}
            {activeModalTab === 'poc' && (
              <div>
                <div className="code-card" style={{ marginTop: 0 }}>
                  <div className="code-card-header">
                    <span>CONTROLLED POC DEMONSTRATION</span>
                    <button
                      type="button"
                      className="btn-copy"
                      onClick={() => handleCopyPoC(detailModalVuln.proof_of_concept)}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {detailModalVuln.proof_of_concept}
                  </pre>
                </div>

                {/* Evidence screenshots for dynamic, message for static */}
                {detailModalVuln.assessment_type === 'dynamic' && (detailModalVuln.evidence || []).length > 0 ? (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
                      PoC Screenshot Evidence ({detailModalVuln.evidence?.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {detailModalVuln.evidence?.map((ev, i) => (
                        <div key={i} className="poc-image-container">
                          <img src={ev.image_url} alt={ev.caption || 'PoC Evidence'} />
                          <div className="poc-caption">{ev.caption}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : detailModalVuln.assessment_type === 'static' ? (
                  <div style={{
                    marginTop: '16px',
                    padding: '14px',
                    background: 'var(--bg-card-subtle)',
                    border: '1px dashed var(--purple-soft)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong>Evidence Type: Textual / Static Source Analysis</strong>
                    <p style={{ marginTop: '4px', fontSize: '0.78rem' }}>
                      Static analysis findings do not produce dynamic runtime screenshots. Validation is conducted directly via source code inspection and static control flow auditing.
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Tab: Remediation */}
            {activeModalTab === 'remediation' && (
              <div>
                <div style={{ background: 'var(--bg-card-highlight)', border: '1px solid var(--pink-border)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pink-deep)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Recommended Fix
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {detailModalVuln.remediation}
                  </div>
                </div>

                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
                  Detailed Recommendations
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {detailModalVuln.remediation_recommendations}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <a
                href={detailModalVuln.pdf_url || `https://smwuphrychfpwhupvreh.supabase.co/storage/v1/object/public/vulnerability-reports/${detailModalVuln.assessment_type}/${detailModalVuln.vulnerability_number}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ textDecoration: 'none' }}
              >
                <Download size={14} />
                <span>Download Individual PDF</span>
              </a>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  onSelectForAssessment(detailModalVuln);
                  setDetailModalVuln(null);
                }}
              >
                <span>Make Primary Assessment →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
