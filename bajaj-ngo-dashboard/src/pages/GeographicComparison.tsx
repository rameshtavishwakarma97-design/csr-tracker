import React, { useState } from 'react';
import { GEO_COMPARISON } from '../data/mockData';

type Metric = 'incomeChange' | 'businessEntry' | 'survival' | 'digitalAdoption' | 'creditAccess';

const METRICS: { key: Metric; label: string; short: string }[] = [
  { key: 'incomeChange',    label: 'Income Change %',    short: 'Income' },
  { key: 'businessEntry',  label: 'Business Entry %',   short: 'Business' },
  { key: 'survival',       label: 'Business Survival %',short: 'Survival' },
  { key: 'digitalAdoption',label: 'Digital Adoption %', short: 'Digital' },
  { key: 'creditAccess',   label: 'Credit Access %',    short: 'Credit' },
];

const getCellColor = (value: number, min: number, max: number) => {
  const pct = (value - min) / (max - min);
  if (pct > 0.7) return { bg: '#0c0f14', text: '#fff' };
  if (pct > 0.4) return { bg: '#e0f0fa', text: '#0a4f7c' };
  return { bg: '#f8f9fc', text: '#4a5568' };
};

export const GeographicComparison: React.FC = () => {
  const [highlighted, setHighlighted] = useState<Metric | null>(null);

  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-10 · Phase 3 — Geographic Comparison</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Geographic Comparison
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 600 }}>
          All Phase 3 metrics across districts. Tap a column header to highlight it. Darker = stronger performance.
        </p>
      </div>

      {/* Metric selector pills — mobile friendly */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {METRICS.map(m => (
          <button
            key={m.key}
            onClick={() => setHighlighted(highlighted === m.key ? null : m.key)}
            style={{
              padding: '6px 14px', fontSize: 12, fontWeight: 600, fontFamily: 'Cabinet Grotesk',
              background: highlighted === m.key ? '#0c0f14' : '#f8f9fc',
              color: highlighted === m.key ? '#fff' : '#4a5568',
              border: highlighted === m.key ? '1px solid #0c0f14' : '1px solid #dde4ef',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {m.short}
          </button>
        ))}
        {highlighted && (
          <button
            onClick={() => setHighlighted(null)}
            style={{ padding: '6px 14px', fontSize: 12, color: '#8f9cb4', background: 'none', border: '1px solid #dde4ef', cursor: 'pointer', fontFamily: 'Cabinet Grotesk' }}
          >
            Clear ×
          </button>
        )}
      </div>

      {/* Table — horizontal scroll */}
      <div className="card slide-in slide-in-d1" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#0c0f14' }}>
                <th style={{ color: '#4a5568', background: '#0c0f14' }}>District</th>
                <th style={{ color: '#4a5568', background: '#0c0f14' }}>State</th>
                <th style={{ color: '#4a5568', background: '#0c0f14' }}>Enrolled</th>
                {METRICS.map(m => (
                  <th
                    key={m.key}
                    style={{ background: highlighted === m.key ? 'rgba(26,132,196,0.15)' : '#0c0f14', color: highlighted === m.key ? '#3d9fd9' : '#4a5568', cursor: 'pointer', transition: 'background 0.2s', userSelect: 'none' }}
                    onClick={() => setHighlighted(highlighted === m.key ? null : m.key)}
                  >
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GEO_COMPARISON.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{row.district}</td>
                  <td style={{ color: '#6b7a93' }}>{row.state}</td>
                  <td style={{ fontWeight: 600 }}>{row.enrolled.toLocaleString()}</td>
                  {METRICS.map(m => {
                    const val = row[m.key];
                    const allVals = GEO_COMPARISON.map(r => r[m.key]);
                    const { bg, text } = getCellColor(val, Math.min(...allVals), Math.max(...allVals));
                    return (
                      <td key={m.key} style={{ background: highlighted === m.key ? bg : '#fff', transition: 'background 0.3s', fontWeight: 700, fontSize: 15, color: highlighted === m.key ? text : '#0c0f14' }}>
                        {val}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-split">
        <div className="card slide-in slide-in-d2" style={{ padding: '22px 24px' }}>
          <div className="label" style={{ marginBottom: 10 }}>How to Investigate</div>
          <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.8, margin: 0 }}>
            Tap any metric pill or column header to highlight it across all districts. Dark cells = stronger performance. The comparison surfaces the right questions — it doesn't provide answers.
          </p>
          <div className="divider" style={{ margin: '16px 0' }} />
          <p style={{ fontSize: 12, color: '#6b7a93', margin: 0 }}>
            Geographic variation should always be read alongside the NGO operating in that geography.
          </p>
        </div>
        <div className="card slide-in slide-in-d3" style={{ padding: '22px 24px' }}>
          <div className="label" style={{ marginBottom: 14 }}>Notable Pattern — Aurangabad</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
            <div>
              <div className="label" style={{ marginBottom: 5 }}>Business Survival</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#b45309', letterSpacing: '-0.03em' }}>67%</div>
              <div style={{ fontSize: 11, color: '#8f9cb4', marginTop: 2 }}>Lowest</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 5 }}>Income Change</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>19%</div>
              <div style={{ fontSize: 11, color: '#8f9cb4', marginTop: 2 }}>Below average</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#6b7a93', lineHeight: 1.7 }}>
            Market access disruption (road construction, months 4–5) explains the dip. External shock — not training failure.
          </div>
        </div>
      </div>
    </div>
  );
};
