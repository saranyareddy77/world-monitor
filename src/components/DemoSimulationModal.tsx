import React, { useState, useEffect } from 'react';
import { Shield, Check, Sparkles } from 'lucide-react';
import type { Vulnerability } from '../types/vulnerability';

interface DemoSimulationModalProps {
  demoVuln: Vulnerability;
  onComplete: () => void;
}

export const DemoSimulationModal: React.FC<DemoSimulationModalProps> = ({
  demoVuln,
  onComplete,
}) => {
  const steps = [
    "Validating target authorization (demo.worldmonitor.example)...",
    `Identifying vulnerability (#${demoVuln.vulnerability_number}: ${demoVuln.title})...`,
    "Analyzing matched evidence & HTTP headers...",
    "Preparing controlled non-destructive PoC...",
    "Generating context-aware remediation & report..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', textAlign: 'center', padding: '36px 28px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--pink-light), var(--lavender))',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          border: '1px solid var(--pink-border)'
        }}>
          <Sparkles size={26} style={{ color: 'var(--pink-deep)' }} />
        </div>

        <div style={{
          display: 'inline-block',
          background: 'var(--sev-high-bg)',
          color: 'var(--sev-high)',
          border: '1px solid var(--sev-high-border)',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '12px'
        }}>
          DEMO DATA SIMULATION
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Running Automated Assessment
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Simulating target inspection using live Supabase dataset...
        </p>

        <div className="sim-steps-list">
          {steps.map((text, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`sim-step ${isDone ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
              >
                {isDone ? (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--purple-deep)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={12} />
                  </div>
                ) : isCurrent ? (
                  <div className="spinner" />
                ) : (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid var(--border-light)',
                  }} />
                )}
                <span style={{ fontSize: '0.82rem' }}>{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
