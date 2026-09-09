import React from 'react';
import { AppWindow, FileCode, Shield, ArrowRight } from 'lucide-react';
import type { AssessmentType } from '../types/vulnerability';

interface Step1AssessmentTypeProps {
  selectedType: AssessmentType;
  onSelectType: (type: AssessmentType) => void;
  onContinue: () => void;
}

export const Step1AssessmentType: React.FC<Step1AssessmentTypeProps> = ({
  selectedType,
  onSelectType,
  onContinue,
}) => {
  const handleSelect = (type: AssessmentType) => {
    onSelectType(type);
    onContinue();
  };

  return (
    <div className="screen-container">
      <div className="screen-header-center">
        <h1 className="screen-title">What would you like to assess?</h1>
        <p className="screen-subtitle">
          Choose an assessment type to begin your security assessment.
        </p>
      </div>

      <div className="selection-page-wrapper">
        <div className="stacked-cards">
          {/* Dynamic Assessment Card */}
          <div
            className={`assessment-card primary-card stacked-card ${selectedType === 'dynamic' ? 'selected' : ''}`}
            onClick={() => handleSelect('dynamic')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('dynamic'); }}
          >
            <div className="assessment-card-icon">
              <div className="tiny-icon-compound">
                <AppWindow size={24} />
                <Shield size={11} className="icon-badge-indicator" />
              </div>
            </div>
            <div className="assessment-card-content">
              <h3>Dynamic Assessment</h3>
              <p>Assess the security behavior of a running web application.</p>
            </div>
            <div className="card-arrow-action">
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Clean subtle OR divider */}
          <div className="card-divider-or">
            <span>OR</span>
          </div>

          {/* Static Assessment Card */}
          <div
            className={`assessment-card primary-card stacked-card ${selectedType === 'static' ? 'selected' : ''}`}
            onClick={() => handleSelect('static')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('static'); }}
          >
            <div className="assessment-card-icon">
              <div className="tiny-icon-compound">
                <FileCode size={24} />
                <Shield size={11} className="icon-badge-indicator" />
              </div>
            </div>
            <div className="assessment-card-content">
              <h3>Static Assessment</h3>
              <p>Analyze source code or a repository for security vulnerabilities.</p>
            </div>
            <div className="card-arrow-action">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
