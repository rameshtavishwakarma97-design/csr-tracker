import React from 'react';
import { PRE_POST_SUMMARY } from '../data/mockData';
import { ArrowRight } from '@phosphor-icons/react';

const formatValue = (v: number | null, unit: string) => {
  if (v === null) return '—';
  if (unit === '₹') return `₹${v.toLocaleString()}`;
  return `${v}%`;
};

const getChange = (baseline: number | null, endline: number, unit: string) => {
  if (baseline === null) return null;
  if (unit === '₹') {
    const diff = endline - baseline;
    const pct = ((diff / baseline) * 100).toFixed(0);
    return { raw: `+₹${diff.toLocaleString()}`, pct: `+${pct}%` };
  }
  const pp = endline - baseline;
  return { raw: `+${pp}pp`, pct: null };
};

export const PrePostSummary: React.FC = () => {
  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-09 · Phase 3 — Pre/Post Summary</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Pre / Post Summary
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 600 }}>
          The board-level view. Before and after, across every dimension that matters, in plain language.
        </p>
      </div>

      {/* Main table — horizontal scroll on mobile */}
      <div className="card slide-in slide-in-d1" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div className="table-scroll">
          <div style={{ minWidth: 560 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 0, background: '#0c0f14' }}>
              {[
                { label: 'Metric', accent: false },
                { label: 'At Enrollment (M0)', accent: false },
                { label: 'Now (M6)', accent: false },
                { label: 'Change', accent: true },
              ].map((h, i) => (
                <div key={i} style={{ padding: '14px 20px', borderLeft: i > 0 ? '1px solid #2c3547' : 'none' }}>
                  <div className="label" style={{ color: h.accent ? '#3d9fd9' : '#4a5568' }}>{h.label}</div>
                </div>
              ))}
            </div>

            {PRE_POST_SUMMARY.map((row, i) => {
              const change = getChange(row.baseline, row.endline, row.unit);
              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
                  gap: 0,
                  background: row.highlight ? '#f8f9fc' : '#fff',
                  borderBottom: i < PRE_POST_SUMMARY.length - 1 ? '1px solid #f0f3f8' : 'none',
                }}>
                  <div style={{ padding: '20px 20px', borderLeft: row.highlight ? '3px solid #1a84c4' : '3px solid transparent' }}>
                    <div style={{ fontSize: 13, fontWeight: row.highlight ? 700 : 500, color: '#0c0f14' }}>{row.metric}</div>
                  </div>
                  <div style={{ padding: '20px 20px', borderLeft: '1px solid #f0f3f8' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#8f9cb4' }}>
                      {row.baseline !== null ? formatValue(row.baseline, row.unit) : <span style={{ fontSize: 12, color: '#b8c3d5' }}>N/A</span>}
                    </div>
                  </div>
                  <div style={{ padding: '20px 20px', borderLeft: '1px solid #f0f3f8', background: row.highlight ? 'rgba(26,132,196,0.04)' : 'transparent' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#0c0f14' }}>
                      {formatValue(row.endline, row.unit)}
                    </div>
                  </div>
                  <div style={{ padding: '20px 20px', borderLeft: '1px solid #f0f3f8' }}>
                    {change ? (
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#1a7a4a', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <ArrowRight size={12} weight="bold" style={{ transform: 'rotate(-45deg)', color: '#1a7a4a' }} />
                          {change.raw}
                        </div>
                        {change.pct && <div style={{ fontSize: 11, color: '#1a7a4a', marginTop: 2, fontWeight: 600 }}>{change.pct}</div>}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#8f9cb4' }}>Endline only</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid-split">
        <div className="card slide-in slide-in-d2" style={{ padding: '22px 24px', background: '#0c0f14' }}>
          <div className="label" style={{ color: '#4a5568', marginBottom: 10 }}>How to Read This Table</div>
          <p style={{ fontSize: 13, color: '#6b7a93', lineHeight: 1.8, margin: 0 }}>
            Every figure is observed change among program participants — M0 baseline compared with M6 endline survey data.
            Methodology documentation is available separately.
          </p>
        </div>
        <div className="card slide-in slide-in-d3" style={{ padding: '22px 24px' }}>
          <div className="label" style={{ marginBottom: 14 }}>Data Confidence</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Survey Completion (M6)', value: '92%' },
              { label: 'Sample Size (n)', value: '42,850' },
              { label: 'Min. Beneficiaries / Segment', value: '≥20 met' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#4a5568' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: '#1a7a4a' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
