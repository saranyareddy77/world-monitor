import React from 'react';
import { Globe, Check, Shield } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxStepUnlocked: number;
  isDemoMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  maxStepUnlocked,
  isDemoMode
}) => {
  const steps = [
    { num: 1, title: 'Assessment Type' },
    { num: 2, title: 'Target' },
    { num: 3, title: 'Vulnerability' },
    { num: 4, title: 'Validation' },
    { num: 5, title: 'Remediation' },
    { num: 6, title: 'Report' },
  ];

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-logo" onClick={() => onSelectStep(1)} title="WORLD MONITOR">
          <div className="brand-icon-wrapper">
            <Globe size={18} style={{ color: 'var(--pink-deep)' }} />
          </div>
          <div className="brand-title">
            <span>WORLD</span>
            <span className="brand-monitor">MONITOR</span>
            {isDemoMode && (
              <span className="brand-badge" style={{ background: '#FFF0F4', color: '#E25B7F', borderColor: '#F8CAD8' }}>
                DEMO DATA
              </span>
            )}
          </div>
        </div>

        {/* 6-Step Indicator Workflow */}
        <nav className="step-nav" aria-label="Assessment steps">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            const isUnlocked = s.num <= maxStepUnlocked;

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => isUnlocked && onSelectStep(s.num)}
                  disabled={!isUnlocked}
                  title={`Step 0${s.num}: ${s.title}`}
                >
                  {isCompleted ? (
                    <Check size={13} style={{ color: 'var(--purple-deep)' }} />
                  ) : (
                    <span className="step-num">0{s.num}</span>
                  )}
                  <span>{s.title}</span>
                </button>
                {idx < steps.length - 1 && <span className="step-divider">→</span>}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
