import React from 'react';
import mockData from '../data/mock_data.json';
import './Pages.css';

export function Methodology() {
  const stats = mockData.statistics;

  const testInventory = [
    {
      test: 'Paired Student\'s t-test',
      appliedTo: 'Trained Group Baseline vs Month 6 Income',
      nullHypothesis: 'Mean income did not change post-training',
      result: `t = ${stats.paired_t_test.t_statistic}, df = ${stats.paired_t_test.df}, p < 0.0001`,
      effectSize: `Cohen's d = ${stats.paired_t_test.cohens_d}`
    },
    {
      test: 'Independent Welch\'s t-test',
      appliedTo: 'Trained (Wave 1) vs Control (Wave 2) Net Growth',
      nullHypothesis: 'No difference in growth between trained & control',
      result: `t = ${stats.independent_t_test.t_statistic}, df = ${stats.independent_t_test.df}, p < 0.0001`,
      effectSize: `DiD Median Estimate = +₹${stats.independent_t_test.did_estimate_median}`
    },
    {
      test: 'Chi-Square Test (χ²)',
      appliedTo: 'Digital Capability Adoption Proportions (UPI, Bank)',
      nullHypothesis: 'Proportion using digital tools did not change',
      result: 'χ² = 34.2, p < 0.001',
      effectSize: 'Statistically Significant'
    },
    {
      test: 'One-Way ANOVA (F-test)',
      appliedTo: 'Income Growth Variance Across Training Centers',
      nullHypothesis: 'All training centers yield equal outcomes',
      result: 'F = 4.12, df = 3, p = 0.008',
      effectSize: 'Significant Center Variation'
    },
    {
      test: 'Spearman Correlation (r)',
      appliedTo: 'Training Module Completion % vs Income Growth %',
      nullHypothesis: 'Completion rate has no correlation with growth',
      result: 'r = 0.48, p < 0.001',
      effectSize: 'Moderate Positive Correlation'
    }
  ];

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "csr_tracker_audit_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="workspace-view">
      <div className="view-header border-box flex justify-between items-center">
        <div>
          <h2 className="heading-font">METHODOLOGY & CSR AUDIT</h2>
          <div className="header-meta">MODE: SECTION 135 STATUTORY COMPLIANCE & TEST INVENTORY</div>
        </div>
        <button className="btn-outline" onClick={handleExportJSON}>
          📥 EXPORT FULL AUDIT DATA (JSON)
        </button>
      </div>

      {/* SECTION 6.1: SECTION 135 DISCLAIMER */}
      <div className="border-box p-6" style={{ borderTop: 'none', background: 'var(--bg-highlight)' }}>
        <h3 className="heading-font text-sm mb-2">SECTION 135 CSR COMPLIANCE POSITIONING STATEMENT</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
          This platform provides continuous monitoring evidence to support independent third-party impact assessments under <strong>Companies Act Section 135 (Form CSR-2)</strong>. The wave-based Difference-in-Differences (DiD) framework isolates training-attributable gains from background economic trends. Non-smartphone beneficiaries are measured via structured field surveys to guarantee 100% signal equity.
        </p>
      </div>

      {/* SECTION 6.2: MASTER STATISTICAL TEST INVENTORY TABLE */}
      <div className="data-table-container mt-8 border-box">
        <div className="table-header p-4 border-bottom">
          <h3 className="heading-font text-sm">MASTER STATISTICAL TEST INVENTORY</h3>
        </div>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>STATISTICAL TEST</th>
              <th>APPLIED TO</th>
              <th>NULL HYPOTHESIS</th>
              <th>RESULT & P-VALUE</th>
              <th>EFFECT SIZE / METRIC</th>
            </tr>
          </thead>
          <tbody>
            {testInventory.map((item, idx) => (
              <tr key={idx}>
                <td><strong>{item.test}</strong></td>
                <td>{item.appliedTo}</td>
                <td>{item.nullHypothesis}</td>
                <td><span className="font-semibold text-accent">{item.result}</span></td>
                <td>{item.effectSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
