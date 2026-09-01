import React from 'react';
import { ENTREPRENEURSHIP } from '../data/mockData';
import { ArrowRight, Storefront, ArrowUpRight } from '@phosphor-icons/react';

export const Entrepreneurship: React.FC = () => {
  const e = ENTREPRENEURSHIP;
  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-05 · Phase 3 — Entrepreneurship</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Entrepreneurship Entry & Growth
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 560 }}>
          Business entry, growth, and employment transition compared against M0 baseline.
        </p>
      </div>

      {/* Business Entry Hero */}
      <div className="grid-split" style={{ marginBottom: 20 }}>
        <div style={{ background: '#f8f9fc', border: '1px solid #dde4ef', padding: 'clamp(28px, 6vw, 48px) clamp(20px, 5vw, 52px)' }}>
          <div className="label" style={{ marginBottom: 16 }}>Business Running — At Enrollment (M0)</div>
          <div style={{ fontSize: 'clamp(3rem, 12vw, 6rem)', fontWeight: 900, color: '#8f9cb4', letterSpacing: '-0.04em', lineHeight: 1 }}>{e.businessEntryRate.baseline}%</div>
          <div style={{ marginTop: 18, fontSize: 13, color: '#8f9cb4' }}>of beneficiaries had a business at baseline</div>
        </div>
        <div style={{ background: '#0c0f14', padding: 'clamp(28px, 6vw, 48px) clamp(20px, 5vw, 52px)', position: 'relative', overflow: 'hidden' }}>
          <div className="label" style={{ marginBottom: 16, color: '#6b7a93' }}>Business Running — Endline (M6)</div>
          <div style={{ fontSize: 'clamp(3rem, 12vw, 6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{e.businessEntryRate.endline}%</div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 7, color: '#3d9fd9', flexWrap: 'wrap' }}>
            <ArrowUpRight size={14} weight="bold" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>+{e.businessEntryRate.endline - e.businessEntryRate.baseline}pp · {e.businessEntryRate.new_entrants.toLocaleString()} new entrepreneurs</span>
          </div>
          <Storefront size={80} weight="thin" style={{ position: 'absolute', right: 20, bottom: 16, opacity: 0.05, color: '#fff' }} />
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        {/* New Business Entry */}
        <div className="card slide-in slide-in-d1" style={{ padding: '22px 22px' }}>
          <div className="label" style={{ marginBottom: 16 }}>New Business Entry</div>
          <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 10, color: '#1a7a4a' }}>
            {e.businessEntryRate.new_entrants.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: '#4a5568', marginBottom: 16, lineHeight: 1.6 }}>
            beneficiaries who had no business at M0 are now running one at M6
          </div>
          <div className="progress-track" style={{ marginBottom: 10 }}>
            <div className="progress-fill" style={{ width: '79%', background: '#1a7a4a' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7a93' }}>
            <span>M0: 61%</span><span style={{ fontWeight: 600, color: '#1a7a4a' }}>M6: 79%</span>
          </div>
        </div>

        {/* Existing Growth */}
        <div className="card slide-in slide-in-d2" style={{ padding: '22px 22px' }}>
          <div className="label" style={{ marginBottom: 16 }}>Existing Business Growth</div>
          <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 10, color: '#1a84c4' }}>
            {e.growthRate.pct}%
          </div>
          <div style={{ fontSize: 13, color: '#4a5568', marginBottom: 16, lineHeight: 1.6 }}>
            of those with a business at M0 report growth or expansion at M6
          </div>
          <div className="progress-track" style={{ marginBottom: 10 }}>
            <div className="progress-fill progress-fill-ice" style={{ width: `${e.growthRate.pct}%` }} />
          </div>
          <div style={{ fontSize: 12, color: '#6b7a93' }}>n = {e.growthRate.count.toLocaleString()}</div>
        </div>

        {/* Wage to Self-Employment */}
        <div className="card slide-in slide-in-d3" style={{ padding: '22px 22px' }}>
          <div className="label" style={{ marginBottom: 16 }}>Wage → Self-Employment</div>
          <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 10 }}>
            {e.wageToSelfEmploy.pct}%
          </div>
          <div style={{ fontSize: 13, color: '#4a5568', marginBottom: 16, lineHeight: 1.6 }}>
            transitioned from wage work to self-employment between M0 and M6
          </div>
          <div className="progress-track" style={{ marginBottom: 10 }}>
            <div className="progress-fill" style={{ width: `${e.wageToSelfEmploy.pct}%`, background: '#0c0f14' }} />
          </div>
          <div style={{ fontSize: 12, color: '#6b7a93' }}>n = {e.wageToSelfEmploy.count.toLocaleString()}</div>
        </div>
      </div>

      {/* Funnel — horizontal scroll on mobile */}
      <div className="card slide-in slide-in-d4">
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
          <div className="label">Entrepreneurship Journey Funnel</div>
        </div>
        <div style={{ padding: '20px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 560 }}>
            {[
              { label: 'Enrolled', value: '42,850', pct: 100, dark: true },
              { label: 'Completed Training', value: '35,994', pct: 84 },
              { label: 'Business Active at M3', value: '28,400', pct: 66 },
              { label: 'Business Active at M6', value: '33,852', pct: 79 },
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <div style={{
                  flex: 1,
                  background: step.dark ? '#0c0f14' : '#f8f9fc',
                  border: '1px solid #dde4ef',
                  padding: '20px 16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: step.dark ? '#6b7a93' : '#8f9cb4', marginBottom: 8 }}>{step.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', color: step.dark ? '#fff' : '#0c0f14' }}>{step.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a84c4', marginTop: 4 }}>{step.pct}%</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8c3d5', flexShrink: 0 }}>
                    <ArrowRight size={12} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
