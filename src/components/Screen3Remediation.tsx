import React, { useState } from 'react';
import {
  Wrench,
  ArrowRight,
  ShieldCheck,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import type { Vulnerability } from '../types/vulnerability';

interface Screen3RemediationProps {
  vulnerability: Vulnerability;
  onProceedToFindings: () => void;
  onBackToPoC: () => void;
}

export const Screen3Remediation: React.FC<Screen3RemediationProps> = ({
  vulnerability,
  onProceedToFindings,
  onBackToPoC,
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Derive priority from severity
  const getPriorityInfo = () => {
    const s = vulnerability.severity.toLowerCase();
    if (s === 'critical' || s === 'high') {
      return {
        level: 'HIGH',
        color: 'var(--sev-high)',
        bgColor: 'var(--sev-high-bg)',
        borderColor: 'var(--sev-high-border)',
        action: 'Immediate action required — fix before production deployment.'
      };
    } else if (s === 'medium') {
      return {
        level: 'MEDIUM',
        color: 'var(--sev-medium)',
        bgColor: 'var(--sev-medium-bg)',
        borderColor: 'var(--sev-medium-border)',
        action: 'Schedule fix during current sprint development cycle.'
      };
    } else {
      return {
        level: 'LOW / INFORMATIONAL',
        color: 'var(--sev-low)',
        bgColor: 'var(--sev-low-bg)',
        borderColor: 'var(--sev-low-border)',
        action: 'Address during regular maintenance and architectural hardening.'
      };
    }
  };

  const priority = getPriorityInfo();
  const pdfUrl = vulnerability.pdf_url ||
    `https://smwuphrychfpwhupvreh.supabase.co/storage/v1/object/public/vulnerability-reports/${vulnerability.assessment_type}/${vulnerability.vulnerability_number}.pdf`;

  // Parse recommendations into structured cards if possible
  const recommendationLines = vulnerability.remediation_recommendations
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <div className="screen-container">
      {/* Screen Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="screen-title">How do we fix it?</h1>
        <p className="screen-subtitle" style={{ margin: 0 }}>
          Recommended remediation for <strong style={{ color: 'var(--text-primary)' }}>{vulnerability.title}</strong>
        </p>
      </div>

      {/* RECOMMENDED FIX CARD */}
      <div className="ws-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--pink-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--pink-deep)'
          }}>
            <Wrench size={18} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Recommended Fix
          </h3>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500 }}>
          {vulnerability.remediation}
        </p>
      </div>

      {/* FIX FLOW MINI-DIAGRAM */}
      <div className="fix-flow-container">
        <div className="flow-node">
          <div className="flow-node-icon">
            <Layers size={20} />
          </div>
          <span>User Input</span>
        </div>
        <div className="flow-connector">→</div>

        <div className="flow-node">
          <div className="flow-node-icon">
            <Lock size={20} />
          </div>
          <span>Validation</span>
        </div>
        <div className="flow-connector">→</div>

        <div className="flow-node">
          <div className="flow-node-icon">
            <ShieldCheck size={20} />
          </div>
          <span>Sanitization / Encoding</span>
        </div>
        <div className="flow-connector">→</div>

        <div className="flow-node">
          <div className="flow-node-icon" style={{ color: 'var(--purple-deep)', borderColor: 'var(--purple-soft)' }}>
            <Sparkles size={20} />
          </div>
          <span>Safe Rendering</span>
        </div>
      </div>

      {/* COMPACT RECOMMENDATIONS */}
      <h3 className="section-heading-sm" style={{ marginTop: '28px' }}>
        <ShieldCheck size={18} style={{ color: 'var(--purple-deep)' }} />
        <span>Remediation Action Items</span>
      </h3>

      <div className="rec-grid">
        {recommendationLines.map((rec, index) => (
          <div key={index} className="rec-card">
            <div className="rec-icon">
              <CheckCircle2 size={18} />
            </div>
            <div className="rec-content">
              <h4>Action Item {index + 1}</h4>
              <p>{rec}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PRIORITY BANNER */}
      <div className="priority-banner" style={{
        background: priority.bgColor,
        borderColor: priority.borderColor
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: priority.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Remediation Priority
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: priority.color }}>
            {priority.level}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Recommended Action
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {priority.action}
          </div>
        </div>
      </div>

      {/* REPORT DOWNLOAD SECTION */}
      <div className="report-card">
        <div className="report-info">
          <div className="report-icon-box">
            <FileText size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Security Assessment Report
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Individual verified PDF report containing full vulnerability details, safe PoC, evidence, and remediation.
            </p>
          </div>
        </div>

        <div className="report-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowPreviewModal(true)}
          >
            <Eye size={15} />
            <span>Preview Report</span>
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`WorldMonitor-Report-${vulnerability.assessment_type}-${vulnerability.vulnerability_number}.pdf`}
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <Download size={16} />
            <span>Download PDF Report</span>
          </a>
        </div>
      </div>

      {/* Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBackToPoC}
        >
          ← Back to Proof of Concept
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={onProceedToFindings}
        >
          <span>Show Remaining Vulnerabilities</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* PDF Preview Modal */}
      {showPreviewModal && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Report Preview: {vulnerability.title}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Supabase Storage Document: {vulnerability.assessment_type}/{vulnerability.vulnerability_number}.pdf
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  <ExternalLink size={13} />
                  <span>Open in New Tab</span>
                </a>
                <button className="modal-close" onClick={() => setShowPreviewModal(false)} style={{ position: 'static' }}>
                  ✕
                </button>
              </div>
            </div>

            <iframe
              src={`${pdfUrl}#toolbar=1`}
              title="PDF Report Preview"
              style={{
                width: '100%',
                flex: 1,
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                background: '#F9F8FA'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
