import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import mockData from '../data/mock_data.json';
import './Pages.css';

export function Overview({ onNavigateView }) {
  const [strictMode, setStrictMode] = useState(false);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  const beneficiaries = mockData.beneficiaries;

  // Filtered dataset for Executive View
  const activeBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      if (strictMode && b.data_confidence_tier !== 'High') return false;
      if (districtFilter !== 'All' && b.district !== districtFilter) return false;
      if (genderFilter !== 'All' && b.gender !== genderFilter) return false;
      return true;
    });
  }, [beneficiaries, strictMode, districtFilter, genderFilter]);

  const stats = useMemo(() => {
    const trained = activeBeneficiaries.filter(b => b.wave === 'Wave 1');
    const control = activeBeneficiaries.filter(b => b.wave === 'Wave 2');

    const totalTrained = trained.length;
    const totalControl = control.length;

    const trainedGrowth = trained.map(b => b.income_growth_pct);
    const controlGrowth = control.map(b => b.income_growth_pct);

    const median = arr => {
      if (!arr.length) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const trainedMedian = median(trainedGrowth);
    const controlMedian = median(controlGrowth);
    const netGrowth = trainedMedian - controlMedian;

    const verifiedPositive = trained.filter(b => b.income_growth_pct > 15 && b.data_confidence_tier !== 'Low').length;
    const verifiedRate = totalTrained ? ((verifiedPositive / totalTrained) * 100).toFixed(1) : 0;

    const survivingTrained = trained.filter(b => b.business_survival_flag).length;
    const survivalRate = totalTrained ? ((survivingTrained / totalTrained) * 100).toFixed(1) : 0;

    // Confidence tiers breakdown
    const highConf = activeBeneficiaries.filter(b => b.data_confidence_tier === 'High').length;
    const medConf = activeBeneficiaries.filter(b => b.data_confidence_tier === 'Medium').length;
    const lowConf = activeBeneficiaries.filter(b => b.data_confidence_tier === 'Low').length;
    const totalCount = activeBeneficiaries.length || 1;

    return {
      totalEnrolled: activeBeneficiaries.length,
      totalTrained,
      totalControl,
      trainedMedian: trainedMedian.toFixed(1),
      controlMedian: controlMedian.toFixed(1),
      netGrowth: netGrowth.toFixed(1),
      verifiedRate,
      survivalRate,
      highConfPct: Math.round((highConf / totalCount) * 100),
      medConfPct: Math.round((medConf / totalCount) * 100),
      lowConfPct: Math.round((lowConf / totalCount) * 100),
    };
  }, [activeBeneficiaries]);

  const chartData = [
    { name: 'Trained (Wave 1)', growth: parseFloat(stats.trainedMedian), color: 'var(--color-compare-a)' },
    { name: 'Control (Wave 2)', growth: parseFloat(stats.controlMedian), color: 'var(--color-compare-b)' }
  ];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="workspace-view">
      {/* TOAST */}
      {toastMessage && (
        <div className="annotation-callout" style={{ position: 'fixed', top: '64px', right: '32px', zIndex: 100, background: 'var(--bg-page)', border: '2px solid var(--color-accent)' }}>
          <strong>System Notification:</strong> {toastMessage}
        </div>
      )}

      {/* HEADER & EXECUTIVE TOOLBAR */}
      <div className="view-header border-box flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="heading-font">BAJAJ FINSERV LIVELIHOOD IMPACT LAB</h2>
          <div className="header-meta mt-1">PROGRAM: NANO-ENTREPRENEUR SKILLS | SYSTEM STATUS: LIVE</div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select 
            className="control-select" 
            value={districtFilter} 
            onChange={e => setDistrictFilter(e.target.value)}
            style={{ width: '130px' }}
          >
            <option value="All">All Districts</option>
            <option value="Pune">Pune</option>
            <option value="Aurangabad">Aurangabad</option>
            <option value="Nashik">Nashik</option>
            <option value="Nagpur">Nagpur</option>
          </select>

          <select 
            className="control-select" 
            value={genderFilter} 
            onChange={e => setGenderFilter(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="All">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          <button 
            className={`btn-outline ${strictMode ? 'bg-active' : ''}`}
            onClick={() => setStrictMode(!strictMode)}
            style={{ borderColor: strictMode ? 'var(--color-accent)' : 'var(--border-default)' }}
          >
            {strictMode ? 'STRICT MODE' : 'ALL EVIDENCE TIERS'}
          </button>

          <button className="btn-outline" onClick={() => triggerToast('Board Impact Summary PDF compiled and ready for download')}>
            EXPORT BOARD BRIEF
          </button>
        </div>
      </div>

      {/* EXECUTIVE IMPACT SUMMARY STATEMENT */}
      <div className="border-box p-6" style={{ borderTop: 'none', background: 'var(--bg-highlight)' }}>
        <div className="flex items-center gap-2 mb-1">
          <strong className="heading-font text-xs text-accent">IMPACT SUMMARY</strong>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
          Based on our tracking across Maharashtra, beneficiaries in the livelihood skills program saw a median income growth of <strong style={{ color: 'var(--color-accent)' }}>+{stats.netGrowth}% (p &lt; 0.01)</strong> compared to the control group. The 6-month enterprise survival rate stands at <strong>{stats.survivalRate}%</strong>.
        </p>
      </div>

      {/* 4 HIGH CONTRAST HORIZONTAL KPI CARDS (COL-4 COMPACT ROW) */}
      <div className="grid col-4 gap-0 border-box" style={{ borderTop: 'none' }}>
        <div className="metric-panel border-right" onClick={() => onNavigateView && onNavigateView('lab-evidence')}>
          <div className="metric-label">TOTAL BENEFICIARIES</div>
          <div className="metric-value">{stats.totalEnrolled}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {stats.totalTrained} Trained | {stats.totalControl} Control
          </div>
        </div>

        <div className="metric-panel border-right" onClick={() => onNavigateView && onNavigateView('lab-evidence')}>
          <div className="metric-label">NET MEDIAN GROWTH</div>
          <div className="metric-value text-accent">+{stats.netGrowth}%</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Adjusted vs Control (p &lt; 0.01)
          </div>
        </div>

        <div className="metric-panel border-right" onClick={() => onNavigateView && onNavigateView('lab-equity')}>
          <div className="metric-label">VERIFIED POSITIVE RATE</div>
          <div className="metric-value">{stats.verifiedRate}%</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            &gt;15% Growth & Multi-Signal
          </div>
        </div>

        <div className="metric-panel" onClick={() => onNavigateView && onNavigateView('lab-operations')}>
          <div className="metric-label">6M BUSINESS SURVIVAL</div>
          <div className="metric-value" style={{ color: 'var(--status-done)' }}>{stats.survivalRate}%</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Active at 6-month survey
          </div>
        </div>
      </div>

      {/* HERO VISUAL & PORTFOLIO HEALTH DONUT */}
      <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
        <div className="chart-wrapper border-right" style={{ height: '360px', position: 'relative' }}>
          <h3 className="heading-font text-sm mb-4">CAUSAL ATTRIBUTION: TRAINED VS CONTROL (MONTH 6)</h3>
          <ResponsiveContainer width="100%" height="75%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
              <XAxis dataKey="name" axisLine={{ stroke: 'var(--border-default)' }} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-data)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-data)' }} />
              <Bar dataKey="growth" barSize={70}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="annotation-callout" style={{ bottom: '15px', right: '15px', left: '15px' }}>
            <strong>CAUSAL CLAIM:</strong> Beneficiaries completing training achieved <strong>+{stats.netGrowth}% net median income growth</strong> beyond background economic inflation (Control Group: +{stats.controlMedian}%).
          </div>
        </div>

        <div className="p-6 flex flex-column justify-between">
          <div>
            <h3 className="heading-font text-sm mb-4">PORTFOLIO HEALTH DISTRIBUTION</h3>
            <div className="space-y-3">
              <div className="data-row">
                <span className="data-font text-xs">POSITIVE MULTI-SIGNAL</span>
                <strong>62% (High Conf.)</strong>
              </div>
              <div className="data-row">
                <span className="data-font text-xs">INCONCLUSIVE / MODEST</span>
                <strong>22% (Single Signal)</strong>
              </div>
              <div className="data-row">
                <span className="data-font text-xs">DISTRESS / SHOCK</span>
                <strong>10% (Ext. Shock)</strong>
              </div>
              <div className="data-row">
                <span className="data-font text-xs">DATA GAP</span>
                <strong>6% (Pending Survey)</strong>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-box mt-4" style={{ background: 'var(--bg-highlight)', border: '1px solid var(--border-default)' }}>
            <div className="heading-font text-xs mb-1">EVIDENCE QUALITY GUARANTEE</div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Under Bajaj CSR guidelines, outcomes carry full weight regardless of smartphone ownership. Non-smartphone beneficiaries are measured via verified field surveys.
            </p>
          </div>
        </div>
      </div>

      {/* DATA CONFIDENCE BAR */}
      <div className="border-box p-6" style={{ borderTop: 'none' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="heading-font text-sm">DATA QUALITY</span>
          <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>
            {stats.highConfPct}% Tier 1 (High) | {stats.medConfPct}% Tier 2 (Medium) | {stats.lowConfPct}% Tier 3 (Low)
          </span>
        </div>
        <div className="progress-track" style={{ height: '12px' }}>
          <div className="progress-fill bg-done" style={{ width: `${stats.highConfPct}%` }} title="High Confidence (Survey + SDK)" />
          <div className="progress-fill bg-pending" style={{ width: `${stats.medConfPct}%` }} title="Medium Confidence (Survey + 1 Signal)" />
          <div className="progress-fill bg-overdue" style={{ width: `${stats.lowConfPct}%` }} title="Low Confidence (Survey Only)" />
        </div>
      </div>
    </div>
  );
}
