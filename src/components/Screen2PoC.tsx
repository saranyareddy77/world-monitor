import React, { useState } from 'react';
import { Shield, Copy, Check, ExternalLink, Image as ImageIcon, ArrowRight, AlertTriangle, FileCode, CheckCircle, Info } from 'lucide-react';
import type { Vulnerability } from '../types/vulnerability';

interface Screen2PoCProps {
  vulnerability: Vulnerability;
  target: string;
  onProceedToRemediation: () => void;
  onBackToSetup: () => void;
}

export const Screen2PoC: React.FC<Screen2PoCProps> = ({
  vulnerability,
  target,
  onProceedToRemediation,
  onBackToSetup,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const handleCopyPoC = () => {
    navigator.clipboard.writeText(vulnerability.proof_of_concept);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-info';
    }
  };

  // Derive Impact Levels based on CVSS / Severity
  const getImpactValues = () => {
    const s = vulnerability.severity.toLowerCase();
    if (s === 'critical' || s === 'high') {
      return { conf: 'High', integ: 'Medium', avail: 'Low', confColor: 'var(--sev-high)', integColor: 'var(--sev-medium)', availColor: 'var(--sev-low)' };
    } else if (s === 'medium') {
      return { conf: 'Medium', integ: 'Medium', avail: 'Low', confColor: 'var(--sev-medium)', integColor: 'var(--sev-medium)', availColor: 'var(--sev-low)' };
    } else {
      return { conf: 'Low', integ: 'Low', avail: 'Low', confColor: 'var(--sev-low)', integColor: 'var(--sev-low)', availColor: 'var(--sev-low)' };
    }
  };

  const impacts = getImpactValues();
  const evidenceList = vulnerability.evidence || [];
  const isDynamic = vulnerability.assessment_type === 'dynamic';

  return (
    <div className="screen-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Assessment Type</span>
        <span>/</span>
        <span>Target</span>
        <span>/</span>
        <a href="#vulnerability" onClick={(e) => { e.preventDefault(); onBackToSetup(); }}>
          Vulnerability Search
        </a>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Proof of Concept</span>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="screen-title">Proof of Concept</h1>
        <p className="screen-subtitle" style={{ margin: 0 }}>
          Controlled validation of the selected vulnerability
        </p>
      </div>

      {/* Vulnerability Header Card */}
      <div className="vuln-header-card">
        <div className="vuln-header-top">
          <div className="vuln-header-title">
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pink-deep)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Vulnerability #{vulnerability.vulnerability_number} · {vulnerability.assessment_type.toUpperCase()}
            </div>
            <h2>{vulnerability.title}</h2>
          </div>
        </div>

        <div className="vuln-badges">
          <span className={`badge ${getSeverityBadgeClass(vulnerability.severity)}`}>
            <Shield size={12} />
            {vulnerability.severity.toUpperCase()}
          </span>
          {vulnerability.cvss !== null && vulnerability.cvss !== undefined && (
            <span className="badge badge-neutral">
              CVSS {vulnerability.cvss.toFixed(1)}
            </span>
          )}
          {vulnerability.cwe_id && (
            <span className="badge badge-neutral">
              {vulnerability.cwe_id}
            </span>
          )}
          {vulnerability.owasp && (
            <span className="badge badge-neutral">
              OWASP {vulnerability.owasp}
            </span>
          )}
          <span className="badge badge-neutral">
            Target: {target}
          </span>
          <span className="badge badge-neutral">
            Assessment: {vulnerability.assessment_type.charAt(0).toUpperCase() + vulnerability.assessment_type.slice(1)}
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="two-column-layout">
        {/* LEFT - FINDING */}
        <div className="column-card">
          <h3 className="section-heading-sm">
            <Info size={18} style={{ color: 'var(--pink-deep)' }} />
            <span>What was found?</span>
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
            {vulnerability.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.82rem' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Affected Component:</strong>{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{vulnerability.affected_component}</span>
            </div>
            {vulnerability.affected_url && (
              <div style={{ fontSize: '0.82rem' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Affected URL:</strong>{' '}
                <code style={{ fontSize: '0.78rem', background: 'var(--bg-card-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                  {vulnerability.affected_url}
                </code>
              </div>
            )}
            {vulnerability.parameter && (
              <div style={{ fontSize: '0.82rem' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Parameter / Header:</strong>{' '}
                <code style={{ fontSize: '0.78rem', background: 'var(--bg-card-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                  {vulnerability.parameter}
                </code>
              </div>
            )}
          </div>

          {/* Finding Evidence Flow */}
          <div className="evidence-flow-box">
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pink-deep)', marginBottom: '8px' }}>
              Evidence Chain
            </div>
            <div className="flow-step">
              <span style={{ fontWeight: 600 }}>1. Inbound Request</span> → Controlled parameter / URI access
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span style={{ fontWeight: 600 }}>2. Response Evaluation</span> → Inspected headers & body payload
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span style={{ fontWeight: 600 }}>3. Anomaly Flagged</span> → Policy absence or misconfiguration confirmed
            </div>
          </div>
        </div>

        {/* RIGHT - SAFE POC */}
        <div className="column-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 className="section-heading-sm" style={{ margin: 0 }}>
              <FileCode size={18} style={{ color: 'var(--purple-deep)' }} />
              <span>Controlled Proof of Concept</span>
            </h3>

            <div style={{ display: 'flex', gap: '8px' }}>
              {isDynamic && evidenceList.length > 0 && (
                <button
                  type="button"
                  className="btn-outline"
                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                  onClick={() => setShowEvidenceModal(true)}
                >
                  <ImageIcon size={13} />
                  <span>View Evidence ({evidenceList.length})</span>
                </button>
              )}
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Non-destructive proof-of-concept verification demonstrating the observed vs expected application state:
          </p>

          <div className="code-card">
            <div className="code-card-header">
              <span>CONTROLLED POC DEMONSTRATION</span>
              <button
                type="button"
                className="btn-copy"
                onClick={handleCopyPoC}
                title="Copy safe PoC to clipboard"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {vulnerability.proof_of_concept}
            </pre>
          </div>

          {/* Dynamic Screenshot Preview */}
          {isDynamic && evidenceList.length > 0 ? (
            <div className="poc-image-container" style={{ marginTop: '14px' }}>
              <img
                src={evidenceList[activeImageIdx]?.image_url}
                alt={evidenceList[activeImageIdx]?.caption || 'PoC Screenshot'}
                onClick={() => setShowEvidenceModal(true)}
                title="Click to expand screenshot evidence"
              />
              <div className="poc-caption">
                {evidenceList[activeImageIdx]?.caption || `PoC Evidence ${activeImageIdx + 1}`}
                {evidenceList.length > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                    {evidenceList.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setActiveImageIdx(idx); }}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          border: 'none',
                          background: activeImageIdx === idx ? 'var(--pink-deep)' : '#D0C8D2',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : !isDynamic ? (
            <div style={{
              marginTop: '14px',
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
      </div>

      {/* PART 6 - POTENTIAL IMPACT */}
      <div className="impact-section">
        <h3 className="section-heading-sm">
          <AlertTriangle size={18} style={{ color: 'var(--pink-deep)' }} />
          <span>Potential Impact</span>
        </h3>

        <div className="impact-grid">
          <div className="impact-item">
            <div className="impact-label">Confidentiality</div>
            <div className="impact-value" style={{ color: impacts.confColor }}>
              {impacts.conf}
            </div>
          </div>
          <div className="impact-item">
            <div className="impact-label">Integrity</div>
            <div className="impact-value" style={{ color: impacts.integColor }}>
              {impacts.integ}
            </div>
          </div>
          <div className="impact-item">
            <div className="impact-label">Availability</div>
            <div className="impact-value" style={{ color: impacts.availColor }}>
              {impacts.avail}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {vulnerability.business_impact}
        </p>
      </div>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBackToSetup}
        >
          ← Back to Vulnerability Search
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={onProceedToRemediation}
        >
          <span>How do we fix it?</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Evidence Fullscreen Modal */}
      {showEvidenceModal && evidenceList.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowEvidenceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
            <button className="modal-close" onClick={() => setShowEvidenceModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Proof of Concept Evidence Screenshot ({activeImageIdx + 1} of {evidenceList.length})
            </h3>
            <img
              src={evidenceList[activeImageIdx]?.image_url}
              alt="Full Evidence"
              style={{ width: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', background: '#F8F6F9' }}
            />
            <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              {evidenceList[activeImageIdx]?.caption}
            </p>
            {evidenceList.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
                {evidenceList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn-outline ${activeImageIdx === idx ? 'btn-primary' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    Image {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
