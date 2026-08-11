import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ErrorBar } from 'recharts';
import mockData from '../data/mock_data.json';
import { calculateStats } from '../utils/stats';
import './Pages.css';

export function CrossSection() {
  const beneficiaries = mockData.beneficiaries;

  // Comparison Mode: 'dimension' (Multi-Entity) or 'custom' (1:1 Group A vs Group B)
  const [compareMode, setCompareMode] = useState('dimension'); // 'dimension' | 'custom'
  const [breakdownDimension, setBreakdownDimension] = useState('ngo_partner'); // 'ngo_partner' | 'district' | 'occupation_type' | 'gender' | 'wave'
  const [metricKey, setMetricKey] = useState('income_growth_pct');

  // Filter state for Custom 1:1 Mode
  const [filterA, setFilterA] = useState({ district: 'All', ngo: 'Pratham', gender: 'All', wave: 'Wave 1' });
  const [filterB, setFilterB] = useState({ district: 'All', ngo: 'SEWA', gender: 'All', wave: 'Wave 1' });

  // Filter state for Multi-Dimension Mode
  const [globalWaveFilter, setGlobalWaveFilter] = useState('Wave 1');

  // Format Labels
  const metricLabel = useMemo(() => {
    switch (metricKey) {
      case 'income_growth_pct': return 'Income Growth %';
      case 'current_income': return 'Current Month 6 Income (₹)';
      case 'baseline_income': return 'Baseline Income (₹)';
      case 'training_completion_pct': return 'Training Completion %';
      default: return 'Income Growth %';
    }
  }, [metricKey]);

  const unit = metricKey.includes('income') && !metricKey.includes('pct') ? '₹' : '%';

  // --- MODE 1: MULTI-ENTITY BREAKDOWN DATA ---
  const multiDimensionData = useMemo(() => {
    const subset = beneficiaries.filter(b => globalWaveFilter === 'All' || b.wave === globalWaveFilter);
    const groups = {};

    subset.forEach(b => {
      const key = b[breakdownDimension] || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(b[metricKey] || 0);
    });

    const colors = ['#3B82F6', '#FF5722', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    
    return Object.keys(groups).map((key, idx) => {
      const arr = groups[key];
      const n = arr.length;
      const mean = n ? arr.reduce((a, b) => a + b, 0) / n : 0;
      const variance = n > 1 ? arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1) : 0;
      const sd = Math.sqrt(variance);
      const se = n ? sd / Math.sqrt(n) : 0;
      const error = se * 1.96; // 95% CI

      return {
        name: key,
        mean: parseFloat(mean.toFixed(1)),
        n,
        sd: parseFloat(sd.toFixed(1)),
        se: parseFloat(se.toFixed(1)),
        error: parseFloat(error.toFixed(1)),
        color: colors[idx % colors.length]
      };
    }).sort((a, b) => b.mean - a.mean);
  }, [beneficiaries, breakdownDimension, metricKey, globalWaveFilter]);

  // --- MODE 2: CUSTOM 1:1 GROUP A VS B DATA ---
  const getFilteredData = (filters) => {
    return beneficiaries.filter(b => {
      if (filters.district !== 'All' && b.district !== filters.district) return false;
      if (filters.ngo !== 'All' && b.ngo_partner !== filters.ngo) return false;
      if (filters.gender !== 'All' && b.gender !== filters.gender) return false;
      if (filters.wave !== 'All' && b.wave !== filters.wave) return false;
      return true;
    });
  };

  const groupA = useMemo(() => getFilteredData(filterA), [filterA, beneficiaries]);
  const groupB = useMemo(() => getFilteredData(filterB), [filterB, beneficiaries]);

  const valuesA = groupA.map(b => b[metricKey] || 0);
  const valuesB = groupB.map(b => b[metricKey] || 0);

  const statsResult = useMemo(() => calculateStats(valuesA, valuesB), [valuesA, valuesB]);

  const customChartData = [
    { 
      name: 'Group A', 
      value: statsResult.valid ? statsResult.meanA : 0, 
      error: statsResult.valid ? statsResult.seA * 1.96 : 0, 
      color: 'var(--color-compare-a)' 
    },
    { 
      name: 'Group B', 
      value: statsResult.valid ? statsResult.meanB : 0, 
      error: statsResult.valid ? statsResult.seB * 1.96 : 0, 
      color: 'var(--color-compare-b)' 
    }
  ];

  const uniqueDistricts = ['All', ...new Set(beneficiaries.map(b => b.district))];
  const uniqueNGOs = ['All', ...new Set(beneficiaries.map(b => b.ngo_partner))];
  const uniqueGenders = ['All', 'Male', 'Female'];
  const uniqueWaves = ['All', 'Wave 1', 'Wave 2'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', padding: '8px', fontSize: '12px' }}>
          <p><strong>{data.name}</strong></p>
          <p>Mean: {unit === '₹' ? '₹' : ''}{data.mean !== undefined ? data.mean : data.value}{unit === '%' ? '%' : ''}</p>
          {data.n && <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Sample (n) = {data.n}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="workspace-view">
      {/* HEADER & COMPARISON MODE SWITCHER */}
      <div className="view-header border-box flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="heading-font">CROSS-SECTION COMPARE</h2>
          <div className="header-meta">MODE: MULTI-DIMENSIONAL & 1:1 COMPARATIVE WORKBENCH</div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className={`btn-outline ${compareMode === 'dimension' ? 'bg-active' : ''}`}
            onClick={() => setCompareMode('dimension')}
            style={{ fontWeight: compareMode === 'dimension' ? 700 : 400 }}
          >
            MULTI-ENTITY BREAKDOWN
          </button>
          <button 
            className={`btn-outline ${compareMode === 'custom' ? 'bg-active' : ''}`}
            onClick={() => setCompareMode('custom')}
            style={{ fontWeight: compareMode === 'custom' ? 700 : 400 }}
          >
            CUSTOM 1:1 DEEP DIVE
          </button>
        </div>
      </div>

      {/* METRIC & DIMENSION TOOLBAR */}
      <div className="dense-filter-panel border-box" style={{ borderTop: 'none', padding: '16px 24px', background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="heading-font text-xs">METRIC:</span>
            <select 
              className="control-select" 
              value={metricKey} 
              onChange={e => setMetricKey(e.target.value)}
              style={{ width: '240px', fontWeight: 600 }}
            >
              <option value="income_growth_pct">Net Income Growth %</option>
              <option value="current_income">Current Month 6 Income (₹)</option>
              <option value="baseline_income">Baseline Income (₹)</option>
              <option value="training_completion_pct">Training Completion %</option>
            </select>
          </div>

          {compareMode === 'dimension' ? (
            <div className="flex items-center gap-4">
              <span className="heading-font text-xs">BREAKDOWN BY:</span>
              <select 
                className="control-select" 
                value={breakdownDimension} 
                onChange={e => setBreakdownDimension(e.target.value)}
                style={{ width: '200px', fontWeight: 600 }}
              >
                <option value="ngo_partner">NGO Partner (All 4)</option>
                <option value="district">District (All 4)</option>
                <option value="occupation_type">Occupation Type</option>
                <option value="gender">Gender (Female vs Male)</option>
                <option value="wave">Cohort Wave (Trained vs Control)</option>
              </select>

              <select 
                className="control-select" 
                value={globalWaveFilter} 
                onChange={e => setGlobalWaveFilter(e.target.value)}
                style={{ width: '140px' }}
              >
                <option value="Wave 1">Wave 1 Only</option>
                <option value="Wave 2">Wave 2 Only</option>
                <option value="All">All Waves</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button className="btn-outline" onClick={() => {
                setFilterA({ district: 'Pune', ngo: 'All', gender: 'All', wave: 'Wave 1' });
                setFilterB({ district: 'Aurangabad', ngo: 'All', gender: 'All', wave: 'Wave 1' });
              }}>Pune vs Aurangabad</button>
              <button className="btn-outline" onClick={() => {
                setFilterA({ district: 'All', ngo: 'Pratham', gender: 'All', wave: 'Wave 1' });
                setFilterB({ district: 'All', ngo: 'SEWA', gender: 'All', wave: 'Wave 1' });
              }}>Pratham vs SEWA</button>
            </div>
          )}
        </div>
      </div>

      {/* MODE 1: MULTI-ENTITY BREAKDOWN */}
      {compareMode === 'dimension' && (
        <>
          <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
            {/* MULTI BAR CHART WITH ERROR BARS */}
            <div className="chart-wrapper border-right" style={{ height: '380px', padding: '24px' }}>
              <h3 className="heading-font text-sm mb-4">
                {breakdownDimension.replace('_', ' ').toUpperCase()} SIDE-BY-SIDE BREAKDOWN ({metricLabel})
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={multiDimensionData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" axisLine={{ stroke: 'var(--border-default)' }} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-highlight)' }} />
                  <Bar dataKey="mean" barSize={55}>
                    {multiDimensionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <ErrorBar dataKey="error" width={6} strokeWidth={2} stroke="var(--text-primary)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* RANKING & VARIANCE SUMMARY TABLE */}
            <div className="p-6 flex flex-column justify-between" style={{ background: 'var(--bg-highlight)' }}>
              <div>
                <h3 className="heading-font text-sm mb-4" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
                  ENTITY PERFORMANCE RANKING
                </h3>
                <div className="space-y-3 text-xs data-font">
                  {multiDimensionData.map((item, rank) => (
                    <div key={item.name} className="flex justify-between items-center border-bottom pb-2" style={{ borderBottomStyle: 'dotted' }}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: item.color }}>#{rank + 1} {item.name}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>(n={item.n})</span>
                      </div>
                      <div>
                        <strong>{unit === '₹' ? '₹' : ''}{item.mean}{unit === '%' ? '%' : ''}</strong>
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '8px', fontSize: '10px' }}>±{item.error}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-box mt-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                <strong className="heading-font text-xs block mb-1">VARIANCE INSIGHT</strong>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                  Top performing entity <strong>#{1} {multiDimensionData[0]?.name}</strong> leads by <strong>+{(multiDimensionData[0]?.mean - (multiDimensionData[multiDimensionData.length - 1]?.mean || 0)).toFixed(1)}{unit}</strong> over <strong>#{multiDimensionData.length} {multiDimensionData[multiDimensionData.length - 1]?.name}</strong>.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODE 2: CUSTOM 1:1 DEEP DIVE (PROPER ALIGNMENT FIX) */}
      {compareMode === 'custom' && (
        <>
          <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
            {/* GROUP A FILTERS */}
            <div className="dense-filter-panel border-right" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div className="filter-panel-header flex justify-between items-center" style={{ color: 'var(--color-compare-a)' }}>
                <span>GROUP A DEFINITION</span>
                <span>n = {groupA.length}</span>
              </div>
              <div className="filter-grid" style={{ padding: '16px' }}>
                <div className="control-group">
                  <label>DISTRICT</label>
                  <select className="control-select" value={filterA.district} onChange={e => setFilterA({...filterA, district: e.target.value})}>
                    {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="control-group">
                  <label>NGO PARTNER</label>
                  <select className="control-select" value={filterA.ngo} onChange={e => setFilterA({...filterA, ngo: e.target.value})}>
                    {uniqueNGOs.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="control-group">
                  <label>GENDER</label>
                  <select className="control-select" value={filterA.gender} onChange={e => setFilterA({...filterA, gender: e.target.value})}>
                    {uniqueGenders.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="control-group">
                  <label>COHORT WAVE</label>
                  <select className="control-select" value={filterA.wave} onChange={e => setFilterA({...filterA, wave: e.target.value})}>
                    {uniqueWaves.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* GROUP B FILTERS */}
            <div className="dense-filter-panel" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div className="filter-panel-header flex justify-between items-center" style={{ color: 'var(--color-compare-b)' }}>
                <span>GROUP B DEFINITION</span>
                <span>n = {groupB.length}</span>
              </div>
              <div className="filter-grid" style={{ padding: '16px' }}>
                <div className="control-group">
                  <label>DISTRICT</label>
                  <select className="control-select" value={filterB.district} onChange={e => setFilterB({...filterB, district: e.target.value})}>
                    {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="control-group">
                  <label>NGO PARTNER</label>
                  <select className="control-select" value={filterB.ngo} onChange={e => setFilterB({...filterB, ngo: e.target.value})}>
                    {uniqueNGOs.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="control-group">
                  <label>GENDER</label>
                  <select className="control-select" value={filterB.gender} onChange={e => setFilterB({...filterB, gender: e.target.value})}>
                    {uniqueGenders.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="control-group">
                  <label>COHORT WAVE</label>
                  <select className="control-select" value={filterB.wave} onChange={e => setFilterB({...filterB, wave: e.target.value})}>
                    {uniqueWaves.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
            <div className="metric-panel border-right" style={{ color: 'var(--color-compare-a)' }}>
              <div className="metric-label" style={{ color: 'var(--color-compare-a)' }}>GROUP A MEAN ({metricLabel.toUpperCase()})</div>
              <div className="metric-value">
                {unit === '₹' ? '₹' : ''}{statsResult.valid ? statsResult.meanA.toFixed(1) : 0}{unit === '%' ? '%' : ''}
              </div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                n = {groupA.length} | SD = {statsResult.valid ? statsResult.sdA.toFixed(1) : 0} | SE = {statsResult.valid ? statsResult.seA.toFixed(1) : 0}
              </div>
            </div>
            <div className="metric-panel" style={{ color: 'var(--color-compare-b)' }}>
              <div className="metric-label" style={{ color: 'var(--color-compare-b)' }}>GROUP B MEAN ({metricLabel.toUpperCase()})</div>
              <div className="metric-value">
                {unit === '₹' ? '₹' : ''}{statsResult.valid ? statsResult.meanB.toFixed(1) : 0}{unit === '%' ? '%' : ''}
              </div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                n = {groupB.length} | SD = {statsResult.valid ? statsResult.sdB.toFixed(1) : 0} | SE = {statsResult.valid ? statsResult.seB.toFixed(1) : 0}
              </div>
            </div>
          </div>

          {/* PRISTINE ALIGNED 2-COLUMN LAYOUT */}
          <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
            <div className="chart-wrapper border-right" style={{ height: '360px', padding: '24px' }}>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={customChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" axisLine={{ stroke: 'var(--border-default)' }} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-data)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-data)' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-highlight)' }} />
                  <Bar dataKey="value" barSize={70}>
                    {customChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <ErrorBar dataKey="error" width={6} strokeWidth={2} stroke="var(--text-primary)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between items-center text-xs mt-2 data-font" style={{ color: 'var(--text-secondary)', borderTop: '1px dotted var(--border-subtle)', paddingTop: '8px' }}>
                <span>■ Group A: {filterA.ngo} ({filterA.district}, {filterA.gender})</span>
                <span>■ Group B: {filterB.ngo} ({filterB.district}, {filterB.gender})</span>
              </div>
            </div>

            {/* PRISTINE CLEANED ECONOMETRIC PANEL (NO OVERLAPPING BOXES!) */}
            <div className="p-6 flex flex-column justify-between" style={{ background: 'var(--bg-highlight)' }}>
              <div>
                <h3 className="heading-font text-sm mb-3" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
                  WELCH'S T-TEST RESULTS
                </h3>
                {statsResult.valid ? (
                  <div className="data-font text-xs space-y-2">
                    <div className="data-row">
                      <span>Absolute Delta (Δ):</span>
                      <strong>{unit === '₹' ? '₹' : ''}{Math.abs(statsResult.meanA - statsResult.meanB).toFixed(2)}{unit === '%' ? '%' : ''}</strong>
                    </div>
                    <div className="data-row"><span>t-statistic:</span> <strong>{statsResult.tScore.toFixed(3)}</strong></div>
                    <div className="data-row"><span>Degrees of Freedom (df):</span> <strong>{statsResult.df.toFixed(1)}</strong></div>
                    <div className="data-row"><span>Effect Size (Cohen's d):</span> <strong>{statsResult.cohensD.toFixed(3)} ({Math.abs(statsResult.cohensD) > 0.5 ? 'Medium/Large' : 'Small'})</strong></div>
                    <div className="data-row">
                      <span>95% CI of Difference:</span>
                      <strong>[{statsResult.ciLower.toFixed(1)}, {statsResult.ciUpper.toFixed(1)}]</strong>
                    </div>
                    <div className="data-row" style={{ marginTop: '8px', paddingTop: '4px', borderTop: '1px solid var(--border-default)' }}>
                      <span>p-value:</span>
                      <strong style={{ color: statsResult.pValue < 0.05 ? 'var(--status-done)' : 'var(--status-overdue)' }}>
                        {statsResult.pValue < 0.001 ? '< 0.001' : statsResult.pValue.toFixed(4)}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className="text-error text-xs">Insufficient data. Both groups must have n ≥ 2.</div>
                )}
              </div>

              <div className="p-4 border-box mt-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                <strong className="heading-font text-xs block mb-1">STATISTICAL CONCLUSION (α = 0.05)</strong>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                  {statsResult.valid && statsResult.pValue < 0.05 
                    ? "Statistically significant difference detected (p < 0.05). Reject the null hypothesis." 
                    : "Difference is NOT statistically significant. Cannot reject null hypothesis of equal means."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
