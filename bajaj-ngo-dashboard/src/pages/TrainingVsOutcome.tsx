import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TIER_DATA = [
  { tier: 'High Quality', ngos: 11 },
  { tier: 'The Rushers', ngos: 4 },
  { tier: 'Struggling', ngos: 2 },
];

export const TrainingVsOutcome: React.FC = () => {
  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-12 · Phase 3 — Training vs Outcome</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Does Training Predict Outcome?
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 600 }}>
          Relationship between M3 completion rates and M6 business survival. Do the NGOs that finish training actually create lasting businesses?
        </p>
      </div>

      <div className="grid-hero-side" style={{ marginBottom: 20 }}>
        {/* The thesis box */}
        <div style={{ background: '#0c0f14', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 40px)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="label" style={{ color: '#6b7a93', marginBottom: 24 }}>The Central Question</div>
          <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
            If an NGO pushes to hit 100% training completion by rushing the curriculum, does it harm long-term business survival?
          </p>
          <div className="divider" style={{ borderTopColor: '#2c3547', margin: '24px 0' }} />
          <p style={{ fontSize: 13, color: '#8f9cb4', margin: 0, lineHeight: 1.6 }}>
            Plotting M3 training completion against M6 business survival reveals three distinct clusters of partner behavior.
          </p>
        </div>

        {/* The clusters */}
        <div style={{ background: '#fff', padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 36px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ width: 14, height: 14, background: '#1a7a4a', marginBottom: 12 }} />
            <div className="label" style={{ marginBottom: 6 }}>Tier 1: High Quality</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>11 NGOs</div>
            <p style={{ fontSize: 12, color: '#6b7a93', lineHeight: 1.6, margin: 0 }}>High completion, high survival. The ideal operating model.</p>
          </div>
          <div>
            <div style={{ width: 14, height: 14, background: '#b45309', marginBottom: 12 }} />
            <div className="label" style={{ marginBottom: 6 }}>Tier 2: The Rushers</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>4 NGOs</div>
            <p style={{ fontSize: 12, color: '#6b7a93', lineHeight: 1.6, margin: 0 }}>95%+ completion, but &lt;70% survival. Optimize for speed over quality.</p>
          </div>
          <div>
            <div style={{ width: 14, height: 14, background: '#8f9cb4', marginBottom: 12 }} />
            <div className="label" style={{ marginBottom: 6 }}>Tier 3: Struggling</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>2 NGOs</div>
            <p style={{ fontSize: 12, color: '#6b7a93', lineHeight: 1.6, margin: 0 }}>Low completion, low survival. Require immediate intervention.</p>
          </div>
        </div>
      </div>

      <div className="card slide-in slide-in-d1" style={{ marginBottom: 20 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="label">NGO Distribution by Tier</div>
          <span style={{ fontSize: 12, color: '#6b7a93' }}>Based on M3 → M6 correlation</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={TIER_DATA} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7a93', fontFamily: 'Cabinet Grotesk' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93' }} />
            <Tooltip cursor={{ fill: '#f0f3f8' }} contentStyle={{ border: '1px solid #dde4ef', borderRadius: 0, boxShadow: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 12 }} />
            <Bar dataKey="ngos" radius={0}>
              {TIER_DATA.map((e, i) => (
                <Cell key={i} fill={e.tier === 'High Quality' ? '#1a7a4a' : e.tier === 'The Rushers' ? '#b45309' : '#8f9cb4'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-split">
        <div className="card slide-in slide-in-d2" style={{ padding: '22px 24px', background: '#0c0f14' }}>
          <div className="label" style={{ color: '#6b7a93', marginBottom: 12 }}>Strategic Recommendation</div>
          <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
            Re-weight partner scorecards away from training speed.
          </h3>
          <p style={{ color: '#8f9cb4', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            "The Rushers" are hitting their M3 KPIs by pushing beneficiaries through the curriculum too fast. Consequently, those beneficiaries lack the fundamentals to sustain their businesses, failing at M6. Bajaj Finserv should reduce the incentive on early completion.
          </p>
        </div>
        <div className="card slide-in slide-in-d3" style={{ padding: '22px 24px' }}>
          <div className="label" style={{ marginBottom: 16 }}>Action Items</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 18, height: 18, background: '#1a84c4', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>1</div>
              <span style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>Audit the 4 "Rusher" NGOs. Assess if trainers are skipping the financial literacy module.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 18, height: 18, background: '#1a84c4', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>2</div>
              <span style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>Introduce a mandatory quality check before marking a cohort "complete" at M3.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 18, height: 18, background: '#1a84c4', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>3</div>
              <span style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>Pair the 2 "Struggling" NGOs with Tier 1 partners for capacity building.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
