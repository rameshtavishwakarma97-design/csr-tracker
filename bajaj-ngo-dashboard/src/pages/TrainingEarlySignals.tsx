import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TRAINING_COMPLETION, EARLY_BUSINESS_ACTIVITY, EARLY_DIGITAL_ADOPTION, EARLY_FINANCIAL_ACCESS } from '../data/mockData';
import { ArrowRight } from '@phosphor-icons/react';

const EarlySignalRow = ({ label, value, sub }: { label: string; value: number; sub?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f3f8' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#1e2533' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#8f9cb4', marginTop: 2 }}>{sub}</div>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="progress-track" style={{ width: 60 }}>
        <div className="progress-fill progress-fill-ice" style={{ width: `${value}%` }} />
      </div>
      <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', minWidth: 40, textAlign: 'right' }}>{value}%</span>
    </div>
  </div>
);

export const TrainingEarlySignals: React.FC = () => {
  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-03 · Phase 2 — What Happened During Skilling</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Training & Early Signals
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 560 }}>
          Mid-program indicators from the M3 follow-up survey. Early directional signals — not final outcomes.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
          background: '#fff8e1', border: '1px solid #f59e0b', padding: '7px 14px', fontSize: 12, color: '#92400e'
        }}>
          <span style={{ fontWeight: 600 }}>Note:</span> Phase 2 data reflects M3 survey round. Full impact in Phase 3.
        </div>
      </div>

      {/* Training Completion Hero */}
      <div className="grid-wide-right" style={{ marginBottom: 24 }}>
        <div style={{ background: '#0c0f14', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 44px)' }}>
          <div className="label" style={{ color: '#6b7a93', marginBottom: 20 }}>Overall Training Completion</div>
          <div style={{ fontSize: 'clamp(3rem, 12vw, 6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 14 }}>
            {TRAINING_COMPLETION.overall}%
          </div>
          <div style={{ color: '#6b7a93', fontSize: 13 }}>of enrolled beneficiaries completed full training</div>
        </div>

        <div style={{ background: '#fff', padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 40px)' }}>
          <div className="label" style={{ marginBottom: 18 }}>Completion by NGO Partner</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={TRAINING_COMPLETION.byNGO} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="ngo" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93', fontFamily: 'Cabinet Grotesk' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93' }} domain={[0, 100]} />
              <Tooltip cursor={{ fill: '#f0f3f8' }} contentStyle={{ border: '1px solid #dde4ef', borderRadius: 0, boxShadow: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 12 }} formatter={(v: any) => [`${v}%`, 'Completion']} />
              <Bar dataKey="rate" fill="#0c0f14" radius={0}>
                {TRAINING_COMPLETION.byNGO.map((e, i) => (
                  <Cell key={i} fill={e.rate >= 85 ? '#0c0f14' : '#3d9fd9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            {[{ color: '#0c0f14', label: '≥85% On target' }, { color: '#3d9fd9', label: '<85% Needs review' }].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b7a93' }}>
                <span style={{ width: 10, height: 10, background: l.color, display: 'inline-block', flexShrink: 0 }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3">
        {/* Early Business Activity */}
        <div className="card slide-in slide-in-d1">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
            <div className="label" style={{ marginBottom: 2 }}>Early Business Activity</div>
            <div style={{ fontSize: 11, color: '#8f9cb4' }}>M0 → M3 change</div>
          </div>
          <div style={{ padding: '4px 20px 20px' }}>
            <EarlySignalRow label="Started new business" value={EARLY_BUSINESS_ACTIVITY.startedNewBusiness} sub="Of those with no business at M0" />
            <EarlySignalRow label="Existing business grew" value={EARLY_BUSINESS_ACTIVITY.existingGrowth} sub="Of those already operating" />
            <EarlySignalRow label="No change reported" value={EARLY_BUSINESS_ACTIVITY.noChange} />
          </div>
          <div style={{ padding: '12px 20px', background: '#f8f9fc', borderTop: '1px solid #dde4ef' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1a84c4', fontSize: 12, fontWeight: 600 }}>
              <ArrowRight size={11} />
              Leading indicator for Phase 3 outcomes
            </div>
          </div>
        </div>

        {/* Early Digital Adoption */}
        <div className="card slide-in slide-in-d2">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
            <div className="label" style={{ marginBottom: 2 }}>Early Digital Adoption</div>
            <div style={{ fontSize: 11, color: '#8f9cb4' }}>New adopters since M0</div>
          </div>
          <div style={{ padding: '4px 20px 20px' }}>
            <EarlySignalRow label="UPI Payments" value={EARLY_DIGITAL_ADOPTION.upiAdopters} sub="New users since enrollment" />
            <EarlySignalRow label="WhatsApp Business" value={EARLY_DIGITAL_ADOPTION.whatsappBusiness} sub="New users since enrollment" />
            <EarlySignalRow label="Bookkeeping App" value={EARLY_DIGITAL_ADOPTION.bookkeepingApp} sub="New users since enrollment" />
          </div>
          <div style={{ padding: '12px 20px', background: '#f8f9fc', borderTop: '1px solid #dde4ef' }}>
            <span style={{ fontSize: 12, color: '#6b7a93' }}>Smartphone cohort, supplemented by app signals</span>
          </div>
        </div>

        {/* Early Financial Access */}
        <div className="card slide-in slide-in-d3">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef' }}>
            <div className="label" style={{ marginBottom: 2 }}>Early Financial Access</div>
            <div style={{ fontSize: 11, color: '#8f9cb4' }}>New access since M0</div>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#dde4ef', marginBottom: 20 }}>
              <div style={{ background: '#fff', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 7vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#0c0f14', marginBottom: 6 }}>
                  {EARLY_FINANCIAL_ACCESS.newBankAccounts}%
                </div>
                <div className="label">New Bank Accounts</div>
              </div>
              <div style={{ background: '#f0f3f8', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 7vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#1a84c4', marginBottom: 6 }}>
                  {EARLY_FINANCIAL_ACCESS.firstFormalCredit}%
                </div>
                <div className="label">First Formal Credit</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#6b7a93', margin: 0, lineHeight: 1.7 }}>
              Did those who accessed credit at M3 see income growth at M6?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
