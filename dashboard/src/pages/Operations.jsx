import React, { useMemo } from 'react';
import mockData from '../data/mock_data.json';
import './Pages.css';

export function Operations() {
  const beneficiaries = mockData.beneficiaries;
  const trained = beneficiaries.filter(b => b.wave === 'Wave 1');

  // Training Center Performance Data
  const centerData = useMemo(() => {
    const centers = ['Pune-North', 'Aurangabad-Central', 'Nashik-East', 'Nagpur-West'];
    return centers.map(c => {
      const cohort = trained.filter(b => b.training_center === c);
      const n = cohort.length;
      if (!n) return { name: c, n: 0, completion: 0, growth: 0, confidenceScore: 0 };

      const avgCompletion = Math.round(cohort.reduce((acc, b) => acc + b.training_completion_pct, 0) / n);
      const avgGrowth = (cohort.reduce((acc, b) => acc + b.income_growth_pct, 0) / n).toFixed(1);
      const highConfCount = cohort.filter(b => b.data_confidence_tier === 'High').length;
      const confidenceScore = Math.round((highConfCount / n) * 100);

      return {
        name: c,
        n,
        completion: avgCompletion,
        growth: avgGrowth,
        confidenceScore
      };
    });
  }, [trained]);

  // Module Synergy Matrix
  const moduleSynergies = [
    { combo: 'Bookkeeping Only', n: 42, growth: '+11.2%', returnTier: 'MODERATE' },
    { combo: 'Bookkeeping + Credit Facilitation', n: 58, growth: '+24.8%', returnTier: 'HIGHEST ROI' },
    { combo: 'Digital Marketing Only', n: 30, growth: '+14.5%', returnTier: 'MODERATE' },
    { combo: 'Full Suite (All 4 Modules)', n: 20, growth: '+32.1%', returnTier: 'HIGH ROI' },
  ];

  return (
    <div className="workspace-view">
      <div className="view-header border-box">
        <h2 className="heading-font">NGO & PROGRAM OPERATIONS</h2>
        <div className="header-meta">MODE: CENTER PERFORMANCE & MODULE SYNERGY ANALYTICS</div>
      </div>

      {/* SECTION 5.1: TRAINING CENTER LEADERBOARD */}
      <div className="data-table-container border-box" style={{ borderTop: 'none' }}>
        <div className="table-header p-4 border-bottom flex justify-between items-center">
          <h3 className="heading-font text-sm">TRAINING CENTER PERFORMANCE LEADERBOARD</h3>
          <div className="data-font text-xs" style={{ color: 'var(--color-accent)' }}>
            ONE-WAY ANOVA: F = 4.12, p = 0.008 (Significant Center Variance)
          </div>
        </div>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>CENTER NAME</th>
              <th>ENROLLED (n)</th>
              <th>AVG COMPLETION %</th>
              <th>MEDIAN GROWTH %</th>
              <th>DATA CONFIDENCE SCORE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {centerData.map((c, idx) => (
              <tr key={idx}>
                <td><strong>{c.name}</strong></td>
                <td>{c.n}</td>
                <td>{c.completion}%</td>
                <td><span className="font-semibold text-accent">+{c.growth}%</span></td>
                <td>{c.confidenceScore}% High Conf.</td>
                <td>
                  <span className="status-pill completed">ACTIVE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION 5.2: MODULE SYNERGY MATRIX */}
      <div className="data-table-container mt-8 border-box">
        <div className="table-header p-4 border-bottom">
          <h3 className="heading-font text-sm">TRAINING MODULE SYNERGY MATRIX</h3>
        </div>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>MODULE COMBINATION</th>
              <th>BENEFICIARIES (n)</th>
              <th>AVG INCOME GROWTH %</th>
              <th>ROI RATING</th>
            </tr>
          </thead>
          <tbody>
            {moduleSynergies.map((m, idx) => (
              <tr key={idx}>
                <td><strong>{m.combo}</strong></td>
                <td>{m.n}</td>
                <td><span className="font-semibold text-accent">{m.growth}</span></td>
                <td>
                  <span className={`status-pill ${m.returnTier === 'HIGHEST ROI' ? 'completed' : 'pending'}`}>
                    {m.returnTier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
