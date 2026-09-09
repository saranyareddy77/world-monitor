import React, { useState, useEffect, useRef } from 'react';
import { Code, Globe, Search, ChevronDown, Check, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import type { Vulnerability, AssessmentType } from '../types/vulnerability';

interface Screen1SetupProps {
  vulnerabilities: Vulnerability[];
  loading: boolean;
  selectedType: AssessmentType;
  onSelectType: (type: AssessmentType) => void;
  selectedVuln: Vulnerability | null;
  onSelectVuln: (vuln: Vulnerability) => void;
  target: string;
  onTargetChange: (target: string) => void;
  onAnalyze: () => void;
  onStartDemo: () => void;
}

export const Screen1Setup: React.FC<Screen1SetupProps> = ({
  vulnerabilities,
  loading,
  selectedType,
  onSelectType,
  selectedVuln,
  onSelectVuln,
  target,
  onTargetChange,
  onAnalyze,
  onStartDemo,
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter vulnerabilities by selected type and search term
  const filteredVulns = vulnerabilities.filter(v => {
    const matchesType = v.assessment_type === selectedType;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.cwe_id && v.cwe_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (v.owasp && v.owasp.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const canProceed = Boolean(selectedVuln && target.trim() && isAuthorized);

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-info';
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-header-center">
        <h1 className="screen-title">What would you like to assess?</h1>
        <p className="screen-subtitle">
          Select an assessment method and identify the vulnerability you want to investigate.
        </p>
      </div>

      <div className="ws-card">
        {/* STEP 1 - Assessment Type */}
        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label className="form-label">
            <span>Step 1 — Assessment Type</span>
            <span className="required-dot">*</span>
          </label>
          <div className="assessment-type-grid">
            {/* Static Assessment Card */}
            <div
              className={`assessment-card ${selectedType === 'static' ? 'selected' : ''}`}
              onClick={() => {
                onSelectType('static');
                if (!target.includes('github.com')) {
                  onTargetChange('https://github.com/worldmonitor/worldmonitor');
                }
              }}
            >
              <div className="assessment-card-icon">
                <Code size={24} />
              </div>
              <div className="assessment-card-content">
                <h3>Static Assessment</h3>
                <p>Analyze source code, dependencies, and repository configuration.</p>
              </div>
            </div>

            {/* Dynamic Assessment Card */}
            <div
              className={`assessment-card ${selectedType === 'dynamic' ? 'selected' : ''}`}
              onClick={() => {
                onSelectType('dynamic');
                if (!target.startsWith('https://www.worldmonitor.app')) {
                  onTargetChange('https://www.worldmonitor.app');
                }
              }}
            >
              <div className="assessment-card-icon">
                <Globe size={24} />
              </div>
              <div className="assessment-card-content">
                <h3>Dynamic Assessment</h3>
                <p>Analyze the behavior, HTTP headers, and security controls of a running application.</p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2 - Vulnerability Selection */}
        <div className="form-section">
          <div className="form-group" ref={dropdownRef} style={{ position: 'relative' }}>
            <label className="form-label">
              <span>Step 2 — Vulnerability Name</span>
              <span className="required-dot">*</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                ({filteredVulns.length} loaded from Supabase)
              </span>
            </label>
            <div
              className="input-wrapper"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer' }}
            >
              <Search size={18} className="input-icon" />
              <input
                type="text"
                className="ws-input"
                placeholder={loading ? "Loading vulnerabilities from Supabase..." : "Search or select a vulnerability..."}
                value={dropdownOpen ? searchQuery : (selectedVuln ? `#${selectedVuln.vulnerability_number} - ${selectedVuln.title}` : '')}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
              />
              <ChevronDown
                size={18}
                style={{
                  position: 'absolute',
                  right: '14px',
                  color: 'var(--text-secondary)',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                {filteredVulns.length === 0 ? (
                  <div style={{ padding: '14px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No vulnerabilities found for this filter.
                  </div>
                ) : (
                  filteredVulns.map((v) => {
                    const isSelected = selectedVuln?.vulnerability_number === v.vulnerability_number &&
                                       selectedVuln?.assessment_type === v.assessment_type;
                    return (
                      <div
                        key={`${v.assessment_type}-${v.vulnerability_number}`}
                        className={`dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          onSelectVuln(v);
                          setDropdownOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            #{v.vulnerability_number}. {v.title}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                            {v.cwe_id || 'CWE'} · {v.affected_component}
                          </span>
                        </div>
                        <span className={`badge ${getSeverityBadgeClass(v.severity)}`}>
                          {v.severity.toUpperCase()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* STEP 3 - Target Input */}
          <div className="form-group">
            <label className="form-label">
              <span>Step 3 — Target {selectedType === 'static' ? 'Repository' : 'Application URL'}</span>
              <span className="required-dot">*</span>
            </label>
            <div className="input-wrapper">
              {selectedType === 'static' ? (
                <Code size={18} className="input-icon" />
              ) : (
                <Globe size={18} className="input-icon" />
              )}
              <input
                type="text"
                className="ws-input"
                placeholder={selectedType === 'static' ? 'https://github.com/organization/repository' : 'https://example.com'}
                value={target}
                onChange={(e) => onTargetChange(e.target.value)}
              />
            </div>
          </div>

          {/* Authorization Checkbox */}
          <div className="auth-box">
            <input
              type="checkbox"
              id="auth-confirm"
              className="auth-checkbox"
              checked={isAuthorized}
              onChange={(e) => setIsAuthorized(e.target.checked)}
            />
            <label htmlFor="auth-confirm" className="auth-text" style={{ cursor: 'pointer' }}>
              <h4>I confirm that I am authorized to assess this target.</h4>
              <p>World Monitor is intended only for authorized security testing and controlled validation.</p>
            </label>
          </div>

          {/* Buttons */}
          <div className="action-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={onStartDemo}
              title="Launch instant demo walkthrough using real dynamic vulnerability data"
            >
              <Sparkles size={15} style={{ color: 'var(--pink-deep)' }} />
              <span>Try Demo Assessment</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              disabled={!canProceed}
              onClick={onAnalyze}
            >
              <span>Analyze Vulnerability</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
