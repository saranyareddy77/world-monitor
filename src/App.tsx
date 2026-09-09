import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Step1AssessmentType } from './components/Step1AssessmentType';
import { Step2Target } from './components/Step2Target';
import { Step3VulnerabilitySearch } from './components/Step3VulnerabilitySearch';
import { Screen2PoC } from './components/Screen2PoC';
import { Screen3Remediation } from './components/Screen3Remediation';
import { Screen4Findings } from './components/Screen4Findings';
import { DemoSimulationModal } from './components/DemoSimulationModal';
import { fetchVulnerabilities } from './lib/supabase';
import type { Vulnerability, AssessmentType } from './types/vulnerability';

export const App: React.FC = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepUnlocked, setMaxStepUnlocked] = useState<number>(1);

  // Workflow Selection State
  const [selectedType, setSelectedType] = useState<AssessmentType>('dynamic');
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [target, setTarget] = useState<string>('https://www.worldmonitor.app');

  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isSimulatingDemo, setIsSimulatingDemo] = useState<boolean>(false);

  // Load real dataset on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchVulnerabilities();
        setVulnerabilities(data);

        // Pre-select the first dynamic vulnerability (Dynamic 0) as initial candidate
        const defaultDyn = data.find(v => v.assessment_type === 'dynamic' && v.vulnerability_number === 0);
        if (defaultDyn) {
          setSelectedVuln(defaultDyn);
        } else if (data.length > 0) {
          setSelectedVuln(data[0]);
        }
      } catch (err) {
        console.error('[WORLD MONITOR] Failed to load vulnerabilities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Step 1: Selection handler
  const handleSelectType = (type: AssessmentType) => {
    setSelectedType(type);
    if (type === 'dynamic') {
      if (!target || target.includes('github.com')) {
        setTarget('https://www.worldmonitor.app');
      }
    } else {
      if (!target || !target.includes('github.com')) {
        setTarget('https://github.com/worldmonitor/worldmonitor');
      }
    }

    // Default candidate for chosen type
    const match = vulnerabilities.find(v => v.assessment_type === type);
    if (match && (!selectedVuln || selectedVuln.assessment_type !== type)) {
      setSelectedVuln(match);
    }
  };

  const handleContinueToTarget = () => {
    setCurrentStep(2);
    setMaxStepUnlocked(prev => Math.max(prev, 2));
  };

  // Step 2: Target handler
  const handleContinueToSearch = () => {
    setCurrentStep(3);
    setMaxStepUnlocked(prev => Math.max(prev, 3));
  };

  // Step 3: Vulnerability search continue handler
  const handleContinueToPoC = () => {
    if (!selectedVuln) return;
    setIsDemoMode(false);
    setCurrentStep(4);
    setMaxStepUnlocked(prev => Math.max(prev, 4));
  };

  // Demo Assessment Trigger
  const handleStartDemo = () => {
    const demoCandidate = vulnerabilities.find(v => v.assessment_type === 'dynamic' && v.vulnerability_number === 0) || vulnerabilities[0];
    if (demoCandidate) {
      setSelectedType('dynamic');
      setSelectedVuln(demoCandidate);
      setTarget('demo.worldmonitor.example');
      setIsDemoMode(true);
      setIsSimulatingDemo(true);
    }
  };

  // Demo Simulation Finished
  const handleDemoSimulationComplete = () => {
    setIsSimulatingDemo(false);
    setCurrentStep(4);
    setMaxStepUnlocked(prev => Math.max(prev, 4));
  };

  // Navigation handlers
  const handleGoToStep = (step: number) => {
    if (step <= maxStepUnlocked) {
      setCurrentStep(step);
    }
  };

  const handleProceedToRemediation = () => {
    setCurrentStep(5);
    setMaxStepUnlocked(prev => Math.max(prev, 5));
  };

  const handleProceedToFindings = () => {
    setCurrentStep(6);
    setMaxStepUnlocked(prev => Math.max(prev, 6));
  };

  const handleSelectForAssessment = (vuln: Vulnerability) => {
    setSelectedVuln(vuln);
    setSelectedType(vuln.assessment_type);
    setCurrentStep(4);
    setMaxStepUnlocked(prev => Math.max(prev, 4));
  };

  const handleRestartWorkflow = () => {
    setCurrentStep(1);
    setIsDemoMode(false);
  };

  return (
    <div className="app-container">
      {/* Header with 6-step progress indicator */}
      <Header
        currentStep={currentStep}
        onSelectStep={handleGoToStep}
        maxStepUnlocked={maxStepUnlocked}
        isDemoMode={isDemoMode}
      />

      <main className="main-content">
        {/* Step 1: Assessment Type Selection */}
        {currentStep === 1 && (
          <Step1AssessmentType
            selectedType={selectedType}
            onSelectType={handleSelectType}
            onContinue={handleContinueToTarget}
          />
        )}

        {/* Step 2: Target Entry */}
        {currentStep === 2 && (
          <Step2Target
            assessmentType={selectedType}
            target={target}
            onTargetChange={setTarget}
            onContinue={handleContinueToSearch}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Step 3: Vulnerability Search */}
        {currentStep === 3 && (
          <Step3VulnerabilitySearch
            assessmentType={selectedType}
            selectedVuln={selectedVuln}
            onSelectVuln={setSelectedVuln}
            onContinue={handleContinueToPoC}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: Proof of Concept / Controlled Validation */}
        {currentStep === 4 && selectedVuln && (
          <Screen2PoC
            vulnerability={selectedVuln}
            target={target}
            onProceedToRemediation={handleProceedToRemediation}
            onBackToSetup={() => setCurrentStep(3)}
          />
        )}

        {/* Step 5: Remediation & Individual PDF Report */}
        {currentStep === 5 && selectedVuln && (
          <Screen3Remediation
            vulnerability={selectedVuln}
            onProceedToFindings={handleProceedToFindings}
            onBackToPoC={() => setCurrentStep(4)}
          />
        )}

        {/* Step 6: Remaining Vulnerabilities / Full Findings */}
        {currentStep === 6 && selectedVuln && (
          <Screen4Findings
            vulnerabilities={vulnerabilities}
            currentSelectedVuln={selectedVuln}
            onSelectForAssessment={handleSelectForAssessment}
            onBackToRemediation={() => setCurrentStep(5)}
            onRestartWorkflow={handleRestartWorkflow}
          />
        )}
      </main>

      {/* Demo Simulation Modal */}
      {isSimulatingDemo && selectedVuln && (
        <DemoSimulationModal
          demoVuln={selectedVuln}
          onComplete={handleDemoSimulationComplete}
        />
      )}
    </div>
  );
};
