import React from 'react';
import { FINANCIAL_ACCESS } from '../data/mockData';
import { ArrowUpRight } from '@phosphor-icons/react';

export const FinancialAccess: React.FC = () => {
  const f = FINANCIAL_ACCESS;
  const items = [
    { label: 'Bank Account', data: f.bankAccount },
    { label: 'Formal Credit', data: f.formalCredit },
    { label: 'Regular Savings', data: f.savingsBehaviour },
  ];

  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-08 · Phase 3 — Financial Access</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Credit & Financial Access
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 560 }}>
          Baseline vs endline across three financial access dimensions. Long-term enablers that will continue serving beneficiaries after the program ends.
        </p>
      </div>

      {/* Hero Grid */}
      <div className="grid-hero-3" style={{ marginBottom: 24 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: i === 0 ? '#0c0f14' : '#fff', padding: 'clamp(24px, 5vw, 40px) clamp(18px, 4vw, 40px)' }}>
            <div className="label" style={{ color: i === 0 ? '#6b7a93' : '#8f9cb4', marginBottom: 14 }}>{item.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 18 }}>
              <div style={{ fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: i === 0 ? '#fff' : '#0c0f14', lineHeight: 1 }}>
                {item.data.endline}%
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a84c4', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <ArrowUpRight size={11} />+{item.data.change}pp
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div className="label" style={{ color: i === 0 ? '#4a5568' : '#8f9cb4', marginBottom: 3 }}>Baseline</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: i === 0 ? '#6b7a93' : '#8f9cb4' }}>{item.data.baseline}%</div>
              </div>
              <div style={{ width: 1, background: i === 0 ? '#2c3547' : '#dde4ef' }} />
              <div>
                <div className="label" style={{ color: i === 0 ? '#4a5568' : '#8f9cb4', marginBottom: 3 }}>Net change</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a84c4' }}>+{item.data.change}pp</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Table — horizontal scroll */}
      <div className="card slide-in slide-in-d1" style={{ marginBottom: 20 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
          <div className="label">Detailed Comparison — M0 to M6</div>
        </div>
        <div className="table-scroll">
          <div style={{ minWidth: 480 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 80px', gap: 0, background: '#0c0f14' }}>
              {['Metric', 'Baseline (M0)', 'Endline (M6)', 'Change'].map((h, i) => (
                <div key={i} style={{ padding: '13px 20px', borderLeft: i > 0 ? '1px solid #2c3547' : 'none' }}>
                  <div className="label" style={{ color: i === 3 ? '#3d9fd9' : '#4a5568' }}>{h}</div>
                </div>
              ))}
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 80px', gap: 0, borderBottom: i < items.length - 1 ? '1px solid #f0f3f8' : 'none', background: '#fff' }}>
                <div style={{ padding: '18px 20px', fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                <div style={{ padding: '18px 20px', borderLeft: '1px solid #f0f3f8', fontSize: 20, fontWeight: 700, color: '#8f9cb4' }}>{item.data.baseline}%</div>
                <div style={{ padding: '18px 20px', borderLeft: '1px solid #f0f3f8', fontSize: 20, fontWeight: 800 }}>{item.data.endline}%</div>
                <div style={{ padding: '18px 16px', borderLeft: '1px solid #f0f3f8', background: '#0c0f14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={10} style={{ color: '#3d9fd9', marginBottom: 2 }} />
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>+{item.data.change}pp</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 20px', background: '#f8f9fc', borderTop: '1px solid #dde4ef' }}>
          <span style={{ fontSize: 12, color: '#6b7a93' }}>Data source: M0 and M6 endline surveys. pp = percentage points.</span>
        </div>
      </div>
    </div>
  );
};
