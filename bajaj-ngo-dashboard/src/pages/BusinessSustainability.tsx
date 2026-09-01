import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SUSTAINABILITY } from '../data/mockData';
import { Warning } from '@phosphor-icons/react';

export const BusinessSustainability: React.FC = () => {
  const s = SUSTAINABILITY;
  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-06 · Phase 3 — Business Sustainability</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Business Sustainability
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 560 }}>
          Of those running a business at M3, how many are still operating at M6? The honest durability test.
        </p>
      </div>

      {/* Hero */}
      <div className="grid-wide-right" style={{ marginBottom: 24 }}>
        <div style={{ background: '#0c0f14', padding: 'clamp(28px, 6vw, 52px) clamp(20px, 5vw, 52px)' }}>
          <div className="label" style={{ color: '#6b7a93', marginBottom: 18 }}>6-Month Business Survival Rate</div>
          <div style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {s.survivalRate6M}%
          </div>
          <div style={{ marginTop: 22, fontSize: 13, color: '#6b7a93', lineHeight: 1.7 }}>
            Of businesses active at M3, 78% were still operating at M6.
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #dde4ef', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 44px)' }}>
          <div className="label" style={{ marginBottom: 20 }}>Survival Rate by Occupation</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={s.byOccupation} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <XAxis dataKey="occupation" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93', fontFamily: 'Cabinet Grotesk' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93' }} domain={[50, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip cursor={{ fill: '#f0f3f8' }} contentStyle={{ border: '1px solid #dde4ef', borderRadius: 0, boxShadow: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 12 }} formatter={(v: any) => [`${v}%`, 'Survival Rate']} />
              <Bar dataKey="rate" radius={0}>
                {s.byOccupation.map((e, i) => (
                  <Cell key={i} fill={e.rate >= 80 ? '#0c0f14' : e.rate >= 70 ? '#3d9fd9' : '#b45309'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            {[{ color: '#0c0f14', label: '≥80%' }, { color: '#3d9fd9', label: '70–79%' }, { color: '#b45309', label: '<70% investigate' }].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b7a93' }}>
                <span style={{ width: 10, height: 10, background: l.color, display: 'inline-block', flexShrink: 0 }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-split">
        <div className="card slide-in slide-in-d1" style={{ padding: '22px 24px' }}>
          <div className="label" style={{ marginBottom: 16 }}>Reading This Metric</div>
          <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.8, margin: 0 }}>
            A program that helps 200 people start businesses but 150 close within six months has not produced lasting impact.
            Business survival at six months is the most honest measure of whether entrepreneurship outcomes are genuine.
          </p>
          <div className="divider" style={{ margin: '18px 0' }} />
          <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.8, margin: 0 }}>
            Broken down by occupation, it tells Bajaj Finserv which kinds of businesses are proving most viable — which may inform curriculum design for future cohorts.
          </p>
        </div>
        <div className="card slide-in slide-in-d2">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #dde4ef' }}>
            <div className="label">Lowest Survival: Vegetable Vendors</div>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px', background: '#fff8e1', border: '1px solid #f59e0b', marginBottom: 18 }}>
              <Warning size={14} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 3 }}>Aurangabad Context</div>
                <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                  Road construction during months 4–5 disrupted market access. External shock — not a training failure.
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div className="label" style={{ marginBottom: 6 }}>Survival Rate</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#b45309' }}>71%</div>
              </div>
              <div>
                <div className="label" style={{ marginBottom: 6 }}>Gap vs Best</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>−16pp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
