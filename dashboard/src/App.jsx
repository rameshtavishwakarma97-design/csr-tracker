import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FieldOps } from './pages/FieldOps';
import { OneToOne } from './pages/OneToOne';
import { Overview } from './pages/Overview';
import { Ledger } from './pages/Ledger';
import { Evidence } from './pages/Evidence';
import { CrossSection } from './pages/CrossSection';
import { Equity } from './pages/Equity';
import { Operations } from './pages/Operations';
import { Methodology } from './pages/Methodology';
import './App.css';

export function App() {
  const [activeView, setActiveView] = useState('lab-ledger');
  const [inspectedBeneficiaryId, setInspectedBeneficiaryId] = useState(null);

  const handleInspectBeneficiary = (id) => {
    setInspectedBeneficiaryId(id);
    setActiveView('field-inspector');
  };

  const handleNavigateView = (viewId) => {
    setActiveView(viewId);
  };

  const renderContent = () => {
    switch (activeView) {
      // Workspace 1: Field Operations
      case 'field-surveys':
        return <FieldOps onInspectBeneficiary={handleInspectBeneficiary} />;
      case 'field-inspector':
        return <OneToOne targetBeneficiaryId={inspectedBeneficiaryId} />;

      // Workspace 2: Analytical Lab
      case 'lab-overview':
        return <Overview onNavigateView={handleNavigateView} />;
      case 'lab-ledger':
        return <Ledger onInspectBeneficiary={handleInspectBeneficiary} />;
      case 'lab-evidence':
        return <Evidence />;
      case 'lab-cross-section':
        return <CrossSection />;
      case 'lab-equity':
        return <Equity />;
      case 'lab-operations':
        return <Operations />;
      case 'lab-methodology':
        return <Methodology />;

      default:
        return <Overview onNavigateView={handleNavigateView} />;
    }
  };

  const getBreadcrumb = () => {
    switch (activeView) {
      case 'field-surveys': return 'FIELD OPERATIONS / SURVEY COMMAND CENTER';
      case 'field-inspector': return 'FIELD OPERATIONS / 1:1 BENEFICIARY INSPECTOR';
      case 'lab-overview': return 'ANALYTICAL LAB / EXECUTIVE IMPACT OVERVIEW';
      case 'lab-ledger': return 'ANALYTICAL LAB / MICRO-DATA LONGITUDINAL LEDGER';
      case 'lab-evidence': return 'ANALYTICAL LAB / STATISTICAL & REGRESSION EVIDENCE';
      case 'lab-cross-section': return 'ANALYTICAL LAB / CROSS-SECTIONAL WELCH\'S T-TEST';
      case 'lab-equity': return 'ANALYTICAL LAB / INTERSECTIONAL EQUITY & SIGNAL AUDIT';
      case 'lab-operations': return 'ANALYTICAL LAB / NGO PERFORMANCE & ANOVA';
      case 'lab-methodology': return 'ANALYTICAL LAB / METHODOLOGY & SECTION 135 AUDIT';
      default: return 'ANALYTICAL LAB / EXECUTIVE IMPACT OVERVIEW';
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="main-workspace">
        <header className="workspace-header border-box">
          <div className="breadcrumb-path data-font">{getBreadcrumb()}</div>
          <div className="system-status data-font">SECURE DATA PIPELINE ACTIVE</div>
        </header>
        <main className="workspace-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
