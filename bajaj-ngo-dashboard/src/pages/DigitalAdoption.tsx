import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DIGITAL_ADOPTION } from '../data/mockData';
import { ArrowUpRight } from '@phosphor-icons/react';

const AdoptionMetric = ({ label, baseline, endline, change, color = '#0c0f14' }:
  { label: string; baseline: number; endline: number; change: number; color?: string }) => (
  <div className="card slide-in slide-in-d1" style={{ overflow: 'hidden' }}>
    <div style={{ background: color, padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 32px)' }}>
      <div className="label" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <div style={{ fontSize: 'clamp(2.8rem, 10vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>{endline}%</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#7bbde8', marginBottom: 4 }}>
          <ArrowUpRight size={12} weight="bold" />
          <span style={{ fontSize: 12, fontWeight: 600 }}>+{change}pp</span>
        </div>
      </div>
    </div>
    <div style={{ padding: '16px 20px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 10 }}>
        <span style={{ color: '#6b7a93' }}>At enrollment (M0)</span>
        <span style={{ fontWeight: 600 }}>{baseline}%</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#dde4ef' }}>
        <div style={{ background: '#f8f9fc', padding: '10px 14px', textAlign: 'center' }}>
          <div className="label" style={{ marginBottom: 3 }}>Baseline</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{baseline}%</div>
        </div>
        <div style={{ background: '#fff', padding: '10px 14px', textAlign: 'center', border: '1px solid #dde4ef' }}>
          <div className="label" style={{ marginBottom: 3 }}>Endline</div>
          <div style={{ fontWeight: 700, fontSize: 15, color }}>{endline}%</div>
        </div>
      </div>
    </div>
  </div>
);

export const DigitalAdoption: React.FC = () => {
  const d = DIGITAL_ADOPTION;
  const chartData = [
    { tool: 'UPI', baseline: d.upiPayments.baseline, endline: d.upiPayments.endline },
    { tool: 'WhatsApp Biz', baseline: d.whatsappBusiness.baseline, endline: d.whatsappBusiness.endline },
    { tool: 'Bookkeeping', baseline: d.bookkeepingApp.baseline, endline: d.bookkeepingApp.endline },
  ];

  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-07 · Phase 3 — Digital Adoption</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Digital Adoption
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 560 }}>
          Baseline vs endline comparison for digital tool adoption. A beneficiary transacting digitally has crossed a visibility threshold.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <AdoptionMetric label="UPI Payments" baseline={d.upiPayments.baseline} endline={d.upiPayments.endline} change={d.upiPayments.change} color="#0c0f14" />
        <AdoptionMetric label="WhatsApp Business" baseline={d.whatsappBusiness.baseline} endline={d.whatsappBusiness.endline} change={d.whatsappBusiness.change} color="#0f6aa5" />
        <AdoptionMetric label="Bookkeeping App" baseline={d.bookkeepingApp.baseline} endline={d.bookkeepingApp.endline} change={d.bookkeepingApp.change} color="#1a84c4" />
      </div>

      <div className="card slide-in slide-in-d2" style={{ padding: '22px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Baseline vs Endline — All Digital Tools</div>
            <div style={{ fontSize: 11, color: '#8f9cb4' }}>Percentage of beneficiaries using each tool</div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ bg: '#dde4ef', label: 'Baseline (M0)' }, { bg: '#0c0f14', label: 'Endline (M6)' }].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b7a93' }}>
                <span style={{ width: 12, height: 12, background: l.bg, display: 'inline-block', flexShrink: 0 }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }} barCategoryGap="35%">
            <XAxis dataKey="tool" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7a93', fontFamily: 'Cabinet Grotesk' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93' }} tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
            <Tooltip cursor={{ fill: '#f8f9fc' }} contentStyle={{ border: '1px solid #dde4ef', borderRadius: 0, boxShadow: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
            <Bar dataKey="baseline" fill="#dde4ef" radius={0} name="Baseline (M0)" />
            <Bar dataKey="endline" fill="#0c0f14" radius={0} name="Endline (M6)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
