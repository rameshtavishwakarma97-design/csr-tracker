import React from 'react';
import clsx from 'clsx';
import './Sidebar.css';

export function Sidebar({ activeView, setActiveView }) {
  const execNav = [
    { id: 'lab-overview', label: 'Executive Impact Overview' },
    { id: 'lab-operations', label: 'NGO Performance & ANOVA' },
  ];

  const fieldNav = [
    { id: 'field-surveys', label: 'Survey Command Center' },
    { id: 'field-inspector', label: '1:1 Beneficiary Inspector' },
  ];

  const labNav = [
    { id: 'lab-ledger', label: 'Micro-Data Longitudinal Ledger' },
    { id: 'lab-evidence', label: 'Statistical Evidence' },
    { id: 'lab-cross-section', label: 'Cross-Sectional T-Test' },
    { id: 'lab-equity', label: 'Intersectional Equity' },
  ];

  const complianceNav = [
    { id: 'lab-methodology', label: 'Methodology & Sec 135' },
  ];

  return (
    <div className="sidebar border-box">
      <div className="sidebar-header border-box">
        <h1 className="heading-font text-accent">CSR_TRACKER</h1>
        <div className="version-tag">V2.0.1</div>
      </div>
      
      <div className="sidebar-content">
        <div className="nav-section">
          <div className="nav-section-title">
            <span>01</span>
            <span>EXECUTIVE DASHBOARDS</span>
          </div>
          <div className="nav-section-desc">High-level insights & performance</div>
          <nav className="nav-menu">
            {execNav.map(item => (
              <button
                key={item.id}
                className={clsx('nav-item', { active: activeView === item.id })}
                onClick={() => setActiveView(item.id)}
              >
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="nav-section mt-6">
          <div className="nav-section-title">
            <span>02</span>
            <span>FIELD OPERATIONS</span>
          </div>
          <div className="nav-section-desc">Ground-level tracking</div>
          <nav className="nav-menu">
            {fieldNav.map(item => (
              <button
                key={item.id}
                className={clsx('nav-item', { active: activeView === item.id })}
                onClick={() => setActiveView(item.id)}
              >
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="nav-section mt-6">
          <div className="nav-section-title">
            <span>03</span>
            <span>RESEARCH & LAB</span>
          </div>
          <div className="nav-section-desc">Deep-dive data tools</div>
          <nav className="nav-menu">
            {labNav.map(item => (
              <button
                key={item.id}
                className={clsx('nav-item', { active: activeView === item.id })}
                onClick={() => setActiveView(item.id)}
              >
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="nav-section mt-6">
          <div className="nav-section-title">
            <span>04</span>
            <span>COMPLIANCE</span>
          </div>
          <div className="nav-section-desc">Governance and methodology</div>
          <nav className="nav-menu">
            {complianceNav.map(item => (
              <button
                key={item.id}
                className={clsx('nav-item', { active: activeView === item.id })}
                onClick={() => setActiveView(item.id)}
              >
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
