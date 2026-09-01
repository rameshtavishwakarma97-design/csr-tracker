import React from 'react';
import { Buildings, MapPin, Users, ArrowUpRight, Warning, CheckCircle } from '@phosphor-icons/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PROGRAM_STATS, COHORT_BREAKDOWN, NGO_PARTNERS } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #dde4ef', padding: '10px 14px', fontFamily: 'Cabinet Grotesk', fontSize: 12 }}>
        <p className="label" style={{ marginBottom: 4 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600, margin: 0 }}>{p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProgramOverview: React.FC = () => {
  return (
    <div className="slide-in">
      {/* Header */}
      <div className="page-header">
        <div className="label" style={{ marginBottom: 10, color: '#1a84c4' }}>F-01 · Program Overview</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>
          Program Overview
        </h1>
        <p style={{ color: '#6b7a93', marginTop: 10, fontSize: 14, maxWidth: 500 }}>
          Aggregate view across all NGO partners, geographies, and active cohorts.
        </p>
      </div>

      {/* Hero Row — responsive */}
      <div className="grid-hero-main" style={{ marginBottom: 20 }}>
        {/* Total beneficiaries — dark hero */}
        <div style={{ background: '#0c0f14', padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 48px)', position: 'relative', overflow: 'hidden' }}>
          <div className="label" style={{ color: '#6b7a93', marginBottom: 16 }}>Total Beneficiaries Enrolled</div>
          <div className="metric-hero" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
            {PROGRAM_STATS.totalBeneficiaries.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color: '#3d9fd9' }}>
            <ArrowUpRight size={13} weight="bold" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>+{PROGRAM_STATS.qoqGrowth}% vs last quarter</span>
          </div>
          <Users size={72} weight="thin" style={{ position: 'absolute', right: 24, bottom: 16, opacity: 0.06, color: '#fff' }} />
        </div>

        {/* Active NGOs */}
        <div style={{ background: '#fff', padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 36px)' }}>
          <div className="label" style={{ marginBottom: 12 }}>Active NGO Partners</div>
          <div className="metric-large" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: 8 }}>{PROGRAM_STATS.activeNGOs}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Buildings size={14} style={{ color: '#6b7a93' }} />
            <span style={{ fontSize: 12, color: '#6b7a93' }}>Across 2 states</span>
          </div>
        </div>

        {/* Districts */}
        <div style={{ background: '#fff', padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 36px)', borderTop: '1px solid #dde4ef' }}>
          <div className="label" style={{ marginBottom: 12 }}>Districts Covered</div>
          <div className="metric-large" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: 8 }}>{PROGRAM_STATS.districtsCovered}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} style={{ color: '#6b7a93' }} />
            <span style={{ fontSize: 12, color: '#6b7a93' }}>Maharashtra + MP</span>
          </div>
        </div>
      </div>

      {/* Second Row — 3 col responsive */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Survey Completion */}
        <div className="card slide-in slide-in-d1" style={{ padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 32px)' }}>
          <div className="label" style={{ marginBottom: 16 }}>Endline Survey Completion</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
            <div className="metric-mid" style={{ color: PROGRAM_STATS.surveyCompletion >= 90 ? '#1a7a4a' : '#b45309', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
              {PROGRAM_STATS.surveyCompletion}%
            </div>
            <span style={{ fontSize: 12, color: '#6b7a93', marginBottom: 3 }}>of active cohorts</span>
          </div>
          <div className="progress-track" style={{ marginBottom: 16 }}>
            <div className="progress-fill" style={{ width: `${PROGRAM_STATS.surveyCompletion}%`, background: '#1a7a4a' }} />
          </div>
          <div className="divider" style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={13} style={{ color: '#1a7a4a' }} />
                <span style={{ color: '#4a5568' }}>On Track</span>
              </span>
              <span style={{ fontWeight: 600 }}>{PROGRAM_STATS.onTrackPartners} Partners</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Warning size={13} style={{ color: '#b45309' }} />
                <span style={{ color: '#b45309', fontWeight: 500 }}>Survey Overdue</span>
              </span>
              <span style={{ fontWeight: 600, color: '#b45309' }}>{PROGRAM_STATS.overduePartners} Partners</span>
            </div>
          </div>
        </div>

        {/* Cohort Phase Breakdown */}
        <div className="card slide-in slide-in-d2" style={{ padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 32px)' }}>
          <div className="label" style={{ marginBottom: 20 }}>Cohort Phase Distribution</div>
          {COHORT_BREAKDOWN.map((c, i) => (
            <div key={i} style={{ marginBottom: i < COHORT_BREAKDOWN.length - 1 ? 18 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0c0f14' }}>{c.phase}</span>
                  <span style={{ fontSize: 11, color: '#6b7a93', marginLeft: 6 }}>{c.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{c.count.toLocaleString()}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(c.count / PROGRAM_STATS.totalBeneficiaries) * 100}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Enrollment by State */}
        <div className="card slide-in slide-in-d3" style={{ padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 32px)' }}>
          <div className="label" style={{ marginBottom: 20 }}>Enrollment by State</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={[
              { state: 'Maharashtra', value: 29750 },
              { state: 'Madhya Pradesh', value: 13100 },
            ]} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="state" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7a93', fontFamily: 'Cabinet Grotesk' }} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={0} fill="#0c0f14">
                <Cell fill="#0c0f14" />
                <Cell fill="#3d9fd9" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="divider" style={{ margin: '14px 0 10px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7a93' }}>
            <span>MH: 69.4%</span>
            <span>MP: 30.6%</span>
          </div>
        </div>
      </div>

      {/* NGO Partner Table — horizontal scroll on mobile */}
      <div className="card slide-in slide-in-d4">
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #dde4ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="label">Partner NGO Performance Log</div>
          <span style={{ fontSize: 12, color: '#6b7a93' }}>{NGO_PARTNERS.length} Partners</span>
        </div>
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Partner NGO</th>
                <th>State</th>
                <th>Enrolled</th>
                <th>Survey Completion</th>
                <th>Phase</th>
                <th>Income Change</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {NGO_PARTNERS.map((p, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ color: '#6b7a93' }}>{p.state}</td>
                  <td style={{ fontWeight: 600 }}>{p.enrolled.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{p.completion}%</span>
                      <div style={{ flex: 1, maxWidth: 50 }}>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${p.completion}%`, background: p.completion >= 90 ? '#1a7a4a' : '#b45309' }} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="phase-pill" style={{
                      background: p.phase === 3 ? '#0c0f14' : p.phase === 2 ? '#e0f0fa' : '#f0f3f8',
                      color: p.phase === 3 ? '#fff' : p.phase === 2 ? '#0a4f7c' : '#4a5568',
                    }}>
                      Phase {p.phase}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#1a7a4a' }}>+{p.incomeChange}%</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <span className="badge-dot" style={{ background: p.surveyStatus === 'on-track' ? '#1a7a4a' : '#b45309' }} />
                      <span style={{ color: p.surveyStatus === 'on-track' ? '#1a7a4a' : '#b45309', fontWeight: 500 }}>
                        {p.surveyStatus === 'on-track' ? 'On Track' : 'Overdue'}
                      </span>
                    </span>
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
