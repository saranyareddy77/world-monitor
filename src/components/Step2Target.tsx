import React, { useState } from 'react';
import { Globe, Code, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import type { AssessmentType } from '../types/vulnerability';

interface Step2TargetProps {
  assessmentType: AssessmentType;
  target: string;
  onTargetChange: (target: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step2Target: React.FC<Step2TargetProps> = ({
  assessmentType,
  target,
  onTargetChange,
  onContinue,
  onBack,
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>('');

  const isDynamic = assessmentType === 'dynamic';

  const validateTarget = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setValidationError(isDynamic ? 'Please enter an application URL.' : 'Please enter a repository URL.');
      return false;
    }

    if (isDynamic) {
      // Must be valid HTTP or HTTPS URL
      try {
        const url = new URL(trimmed);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          setValidationError('Please enter a valid URL starting with http:// or https://');
          return false;
        }
      } catch {
        setValidationError('Please enter a valid URL (e.g., https://example.com or http://localhost:3000)');
        return false;
      }
    } else {
      // Static: repository URL or git URL
      const isGithubOrRepo = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(trimmed) ||
                             trimmed.startsWith('git@') ||
                             trimmed.includes('github.com') ||
                             trimmed.includes('gitlab.com');
      if (!isGithubOrRepo || trimmed.length < 8) {
        setValidationError('Please enter a valid repository URL (e.g., https://github.com/organization/repository)');
        return false;
      }
    }

    if (!isAuthorized) {
      setValidationError('You must confirm authorization before proceeding.');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTarget(target)) {
      onContinue();
    }
  };

  const handleInputChange = (val: string) => {
    onTargetChange(val);
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-header-center">
        <h1 className="screen-title">
          {isDynamic ? 'Enter the application to assess' : 'Enter the source code repository'}
        </h1>
        <p className="screen-subtitle">
          {isDynamic
            ? 'Enter the URL of the authorized web application you want to assess.'
            : 'Enter the source code or repository you want to assess.'}
        </p>
      </div>

      <div className="ws-card target-step-card">
        <form onSubmit={handleContinue} className="form-section">
          <div className="form-group">
            <label className="form-label" htmlFor="target-input">
              <span>{isDynamic ? 'Application URL' : 'GitHub / Source Code URL'}</span>
              <span className="required-dot">*</span>
            </label>

            <div className="input-wrapper">
              {isDynamic ? (
                <Globe size={18} className="input-icon" />
              ) : (
                <Code size={18} className="input-icon" />
              )}
              <input
                id="target-input"
                type="text"
                className={`ws-input ${validationError ? 'input-error' : ''}`}
                placeholder={isDynamic ? 'https://example.com' : 'https://github.com/organization/repository'}
                value={target}
                onChange={(e) => handleInputChange(e.target.value)}
                autoFocus
              />
            </div>

            <div className="input-helper-text">
              {isDynamic ? (
                <span>Example: <code className="subtle-code">https://worldmonitor.example</code> or <code className="subtle-code">http://localhost:3000</code></span>
              ) : (
                <span>Example: <code className="subtle-code">https://github.com/organization/repository</code></span>
              )}
            </div>

            {validationError && (
              <div className="form-validation-error">
                <AlertCircle size={14} />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Authorization Checkbox */}
          <div className="auth-box">
            <input
              type="checkbox"
              id="auth-confirm"
              className="auth-checkbox"
              checked={isAuthorized}
              onChange={(e) => {
                setIsAuthorized(e.target.checked);
                if (e.target.checked && validationError.includes('authorization')) {
                  setValidationError('');
                }
              }}
            />
            <label htmlFor="auth-confirm" className="auth-text" style={{ cursor: 'pointer' }}>
              <h4>I confirm that I am authorized to assess this target.</h4>
              <p>World Monitor is intended only for authorized security testing.</p>
            </label>
          </div>

          {/* Action Row */}
          <div className="action-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              <span>← Back to Assessment Type</span>
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={!target.trim() || !isAuthorized}
            >
              <span>Continue →</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
