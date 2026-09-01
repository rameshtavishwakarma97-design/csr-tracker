import React, { useState } from 'react';
import { NGO_PERFORMANCE } from '../data/mockData';

export const NGOPerformance: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-11 · Phase 3 — NGO Performance</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          NGO Partner Performance
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 600 }}>
          Outcome metrics per partner. Tap any card to expand full detail. Context required before comparing raw numbers.
        </p>
      </div>

      {/* NGO Cards */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {NGO_PERFORMANCE.map((ngo, i) => {
          const incomeChange = Math.round(((ngo.endlineIncome - ngo.baselineIncome) / ngo.baselineIncome) * 100);
          const isSelected = selected === i;
          return (
            <div
              key={i}
              className="card"
              style={{ cursor: 'pointer', border: isSelected ? '1px solid #1a84c4' : '1px solid #dde4ef', transition: 'all 0.2s' }}
              onClick={() => setSelected(isSelected ? null : i)}
            >
              {/* Header */}
              <div style={{
                padding: '16px 20px', background: isSelected ? '#0c0f14' : '#fff',
                borderBottom: '1px solid #dde4ef', transition: 'background 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? '#fff' : '#0c0f14' }}>{ngo.ngo}</div>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '3px 8px', background: isSelected ? 'rgba(255,255,255,0.08)' : '#f0f3f8',
                  color: isSelected ? '#6b7a93' : '#4a5568'
                }}>
                  {ngo.enrolled.toLocaleString()}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, background: '#dde4ef' }}>
                <div style={{ background: '#fff', padding: '16px 16px' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Survey</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: ngo.completion >= 90 ? '#1a7a4a' : '#b45309' }}>{ngo.completion}%</div>
                </div>
                <div style={{ background: '#f8f9fc', padding: '16px 16px' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Income</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#1a84c4' }}>+{incomeChange}%</div>
                </div>
                <div style={{ background: '#fff', padding: '16px 16px' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Business</div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{ngo.businessEntry}%</div>
                </div>
              </div>

              {/* Expanded detail */}
              {isSelected && (
                <div style={{ padding: '16px 20px', background: '#f8f9fc', borderTop: '1px solid #dde4ef' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                    {[
                      { label: 'Baseline Income', val: `₹${ngo.baselineIncome.toLocaleString()}`, sub: '' },
                      { label: 'Endline Income', val: `₹${ngo.endlineIncome.toLocaleString()}`, color: '#1a7a4a' },
                      { label: 'Business Survival', val: `${ngo.survival}%`, sub: '' },
                      { label: 'Digital Adoption', val: `${ngo.digitalAdoption}%`, sub: '' },
                    ].map((item, j) => (
                      <div key={j}>
                        <div className="label" style={{ marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: (item as any).color || '#0c0f14' }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full comparison table */}
      <div className="card slide-in slide-in-d3">
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="label">Full Metric Comparison</div>
          <span style={{ fontSize: 12, color: '#6b7a93' }}>Tap a card to expand details</span>
        </div>
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Enrolled</th>
                <th>Survey</th>
                <th>Baseline Income</th>
                <th>Endline Income</th>
                <th>Business Entry</th>
                <th>Survival</th>
                <th>Digital</th>
              </tr>
            </thead>
            <tbody>
              {NGO_PERFORMANCE.map((ngo, i) => {
                return (
                  <tr key={i} style={{ cursor: 'pointer', background: selected === i ? '#f0f3f8' : 'transparent' }}
                    onClick={() => setSelected(selected === i ? null : i)}>
                    <td style={{ fontWeight: 600 }}>{ngo.ngo}</td>
                    <td>{ngo.enrolled.toLocaleString()}</td>
                    <td><span style={{ fontWeight: 700, color: ngo.completion >= 90 ? '#1a7a4a' : '#b45309' }}>{ngo.completion}%</span></td>
                    <td style={{ color: '#6b7a93' }}>₹{ngo.baselineIncome.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{ngo.endlineIncome.toLocaleString()}</td>
                    <td style={{ fontWeight: 700 }}>{ngo.businessEntry}%</td>
                    <td>{ngo.survival}%</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{ngo.digitalAdoption}%</span>
                        <div className="progress-track" style={{ width: 40, flexShrink: 0 }}>
                          <div className="progress-fill progress-fill-ice" style={{ width: `${ngo.digitalAdoption}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', background: '#f8f9fc', borderTop: '1px solid #dde4ef' }}>
          <span style={{ fontSize: 12, color: '#6b7a93' }}>
            Outcome numbers must be read alongside baseline profile. An NGO starting from a lower baseline achieving strong growth outperforms what raw numbers suggest.
          </span>
        </div>
      </div>
    </div>
  );
};
