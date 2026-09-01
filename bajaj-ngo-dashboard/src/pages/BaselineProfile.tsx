import React from 'react';
import {
  OCCUPATION_BREAKDOWN, GENDER_SPLIT, INCOME_RANGE_BASELINE,
  BUSINESS_STATUS_BASELINE, FINANCIAL_ACCESS_BASELINE, TECH_ACCESS
} from '../data/mockData';

const BarMetric = ({ label, pct, count, color = '#0c0f14' }: { label: string; pct: number; count: number; color?: string }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, alignItems: 'flex-end' }}>
      <span style={{ fontSize: 13, color: '#1e2533' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>{pct}%</span>
        <span style={{ fontSize: 11, color: '#6b7a93', marginLeft: 5 }}>{count.toLocaleString()}</span>
      </div>
    </div>
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  </div>
);

const CompareMetric = ({ metric, value, label }: { metric: string; value: number; label: string }) => (
  <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0f3f8' }}>
    <div className="label" style={{ marginBottom: 8 }}>{metric}</div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{value}%</span>
      <span style={{ fontSize: 12, color: '#6b7a93', marginBottom: 2 }}>{label}</span>
    </div>
    <div className="progress-track" style={{ marginTop: 10 }}>
      <div className="progress-fill progress-fill-ice" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export const BaselineProfile: React.FC = () => {
  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-02 · Phase 1 — Who Is In The Program</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Baseline Profile
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 560 }}>
          Profile of all enrolled beneficiaries at M0 — the foundation against which all Phase 3 outcomes are measured.
        </p>
      </div>

      {/* Occupation + right col */}
      <div className="grid-wide-left" style={{ marginBottom: 20 }}>
        <div className="card slide-in slide-in-d1">
          <div style={{ padding: '20px 22px 0' }}>
            <div className="label" style={{ marginBottom: 16 }}>Occupation at Enrollment</div>
            {OCCUPATION_BREAKDOWN.map((o, i) => (
              <BarMetric key={i} label={o.occupation} pct={o.pct} count={o.count}
                color={i === 0 ? '#0c0f14' : i === 1 ? '#1a84c4' : '#8f9cb4'} />
            ))}
          </div>
          <div style={{ padding: '14px 22px', background: '#f8f9fc', borderTop: '1px solid #dde4ef' }}>
            <span style={{ fontSize: 12, color: '#6b7a93' }}>n = 42,850 beneficiaries · M0 Baseline Survey</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Gender */}
          <div className="card slide-in slide-in-d2" style={{ padding: '20px 22px' }}>
            <div className="label" style={{ marginBottom: 16 }}>Gender Split</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#dde4ef' }}>
              <div style={{ background: '#0c0f14', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>{GENDER_SPLIT.female}%</div>
                <div className="label" style={{ color: '#6b7a93' }}>Female</div>
              </div>
              <div style={{ background: '#fff', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>{GENDER_SPLIT.male}%</div>
                <div className="label">Male</div>
              </div>
            </div>
          </div>

          {/* Income Range */}
          <div className="card slide-in slide-in-d3" style={{ padding: '20px 22px' }}>
            <div className="label" style={{ marginBottom: 16 }}>Income Range at Enrollment</div>
            {INCOME_RANGE_BASELINE.map((r, i) => (
              <BarMetric key={i} label={r.range} pct={r.pct} count={r.count} color={i === 0 ? '#0c0f14' : '#3d9fd9'} />
            ))}
            <div className="divider" style={{ margin: '12px 0 10px' }} />
            <p style={{ fontSize: 12, color: '#6b7a93', margin: 0 }}>76% earn below ₹10,000/month at baseline</p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-3">
        {/* Business Status */}
        <div className="card slide-in slide-in-d2">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
            <div className="label">Business Status at Enrollment</div>
          </div>
          {BUSINESS_STATUS_BASELINE.map((b, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: i < BUSINESS_STATUS_BASELINE.length - 1 ? '1px solid #f0f3f8' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <span style={{ fontSize: 13 }}>{b.status}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{b.pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${b.pct}%`, background: i === 0 ? '#0c0f14' : '#b8c3d5' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Financial Access */}
        <div className="card slide-in slide-in-d3">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
            <div className="label">Financial Access at Enrollment</div>
          </div>
          <CompareMetric metric="Bank Account" value={FINANCIAL_ACCESS_BASELINE.bankAccount} label="had bank account" />
          <CompareMetric metric="Formal Credit" value={FINANCIAL_ACCESS_BASELINE.formalCredit} label="had any formal credit" />
          <CompareMetric metric="Digital Payments" value={FINANCIAL_ACCESS_BASELINE.digitalPayments} label="using digital payments" />
        </div>

        {/* Tech Access */}
        <div className="card slide-in slide-in-d4">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
            <div className="label">Technology Access</div>
          </div>
          {[
            { label: 'Smartphone Owners', value: TECH_ACCESS.smartphone, color: '#0c0f14' },
            { label: 'App Downloaded', value: TECH_ACCESS.appDownloaded, color: '#1a84c4' },
            { label: 'Survey Only (No App)', value: TECH_ACCESS.surveyOnly, color: '#b8c3d5' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px 20px', borderBottom: i < 2 ? '1px solid #f0f3f8' : 'none' }}>
              <div className="label" style={{ marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', color: item.color, marginBottom: 10 }}>{item.value}%</div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${item.value}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
