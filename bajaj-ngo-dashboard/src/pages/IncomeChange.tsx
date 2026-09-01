import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { INCOME_TRAJECTORY, INCOME_CHANGE_DISTRIBUTION, INCOME_BY_OCCUPATION } from '../data/mockData';
import { TrendUp } from '@phosphor-icons/react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #dde4ef', padding: '10px 14px', fontFamily: 'Cabinet Grotesk', fontSize: 12 }}>
      <p style={{ margin: '0 0 4px', color: '#6b7a93', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: '#0c0f14', fontWeight: 700, margin: 0 }}>₹{p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export const IncomeChange: React.FC = () => {
  const incomeChange = ((6900 - 5400) / 5400 * 100).toFixed(0);
  return (
    <div className="slide-in">
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-04 · Phase 3 — Income Change</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
          Income Change
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 560 }}>
          Observed change in median monthly income from M0 baseline to M6 endline. All figures in Indian Rupees.
        </p>
      </div>

      {/* Hero comparison */}
      <div className="grid-hero-3" style={{ marginBottom: 20 }}>
        <div style={{ background: '#f8f9fc', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 44px)' }}>
          <div className="label" style={{ marginBottom: 14 }}>Median Income — M0 Baseline</div>
          <div style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontWeight: 900, color: '#8f9cb4', letterSpacing: '-0.04em', lineHeight: 1 }}>₹5,400</div>
          <div style={{ fontSize: 12, color: '#8f9cb4', marginTop: 14 }}>Per month at enrollment</div>
        </div>
        <div style={{ background: '#0c0f14', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 44px)' }}>
          <div className="label" style={{ marginBottom: 14, color: '#6b7a93' }}>Median Income — M6 Endline</div>
          <div style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>₹6,900</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, color: '#3d9fd9' }}>
            <TrendUp size={14} weight="bold" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>+{incomeChange}% observed change</span>
          </div>
        </div>
        <div style={{ background: '#0f6aa5', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 44px)' }}>
          <div className="label" style={{ marginBottom: 14, color: 'rgba(255,255,255,0.55)' }}>Net Increase</div>
          <div style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>+₹1,500</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 14 }}>Median monthly income gain</div>
        </div>
      </div>

      <div className="grid-split" style={{ marginBottom: 20 }}>
        {/* Income Trajectory */}
        <div className="card slide-in slide-in-d1" style={{ padding: '22px 22px' }}>
          <div className="label" style={{ marginBottom: 6 }}>Income Trajectory — M0, M3, M6</div>
          <div style={{ fontSize: 11, color: '#8f9cb4', marginBottom: 16 }}>Smartphone cohort — continuous tracking</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={INCOME_TRAJECTORY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#f0f3f8" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93', fontFamily: 'Cabinet Grotesk' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7a93' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} domain={[4800, 7500]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="median" stroke="#0c0f14" strokeWidth={2.5} dot={{ fill: '#0c0f14', r: 5, strokeWidth: 0 }} activeDot={{ r: 7, fill: '#1a84c4' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution */}
        <div className="card slide-in slide-in-d2" style={{ padding: '22px 22px' }}>
          <div className="label" style={{ marginBottom: 18 }}>Income Change Distribution</div>
          {INCOME_CHANGE_DISTRIBUTION.map((d, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#4a5568' }}>{d.range}</span>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{d.pct}%</span>
                  <span style={{ fontSize: 11, color: '#8f9cb4', marginLeft: 5 }}>{d.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${d.pct}%`, background: i === 0 ? '#b91c1c' : i === 1 ? '#8f9cb4' : i === 2 ? '#3d9fd9' : i === 3 ? '#1a84c4' : '#0a4f7c' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Occupation — scrollable table */}
      <div className="card slide-in slide-in-d3">
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="label">Income Change by Occupation</div>
          <span style={{ fontSize: 12, color: '#6b7a93' }}>M0 → M6</span>
        </div>
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 540 }}>
            <thead>
              <tr>
                <th>Occupation</th>
                <th>Baseline (M0)</th>
                <th>Endline (M6)</th>
                <th>Change</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              {INCOME_BY_OCCUPATION.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{row.occupation}</td>
                  <td style={{ color: '#6b7a93' }}>₹{row.baseline.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>₹{row.endline.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: '#1a7a4a' }}>+{row.change}%</td>
                  <td style={{ width: 120 }}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${row.change * 2}%`, background: '#0c0f14' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
