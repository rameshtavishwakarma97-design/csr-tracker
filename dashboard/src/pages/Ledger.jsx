import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import mockData from '../data/mock_data.json';
import { calculateStats } from '../utils/stats';
import './Pages.css';

export function Ledger({ onInspectBeneficiary }) {
  const beneficiaries = mockData.beneficiaries;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [ngoFilter, setNgoFilter] = useState('All');
  const [waveFilter, setWaveFilter] = useState('Wave 1');
  const [roundFilter, setRoundFilter] = useState('All');
  const [sortBy, setSortBy] = useState('growth_desc');
  
  // Selected Card for Expanded Drawer
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Field Officer Lookup
  const getOfficer = (district) => {
    if (district === 'Pune') return 'Officer Ramesh';
    if (district === 'Nashik') return 'Officer Priya';
    if (district === 'Aurangabad') return 'Officer Suresh';
    return 'Officer Vikas';
  };

  // Cohort Mean Growth Benchmark
  const cohortMeanGrowth = useMemo(() => {
    const subset = beneficiaries.filter(b => b.wave === 'Wave 1');
    if (!subset.length) return 0;
    return subset.reduce((acc, b) => acc + b.income_growth_pct, 0) / subset.length;
  }, [beneficiaries]);

  // Filtered dataset
  const filteredList = useMemo(() => {
    return beneficiaries.filter(b => {
      if (waveFilter !== 'All' && b.wave !== waveFilter) return false;
      if (districtFilter !== 'All' && b.district !== districtFilter) return false;
      if (ngoFilter !== 'All' && b.ngo_partner !== ngoFilter) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const mId = b.beneficiary_id.toLowerCase().includes(q);
        const mName = b.name.toLowerCase().includes(q);
        const mDist = b.district.toLowerCase().includes(q);
        const mCity = b.city.toLowerCase().includes(q);
        const mNgo = b.ngo_partner.toLowerCase().includes(q);
        if (!mId && !mName && !mDist && !mCity && !mNgo) return false;
      }
      return true;
    });
  }, [beneficiaries, waveFilter, districtFilter, ngoFilter, searchQuery]);

  // Sorted Dataset
  const sortedList = useMemo(() => {
    const list = [...filteredList];
    list.sort((a, b) => {
      if (sortBy === 'growth_desc') return b.income_growth_pct - a.income_growth_pct;
      if (sortBy === 'growth_asc') return a.income_growth_pct - b.income_growth_pct;
      if (sortBy === 'income_desc') return b.current_income - a.current_income;
      if (sortBy === 'baseline_desc') return b.baseline_income - a.baseline_income;
      return 0;
    });
    return list;
  }, [filteredList, sortBy]);

  // Live T-Test & P-Value for Filtered Subset
  const activeSubsetStats = useMemo(() => {
    if (sortedList.length < 2) return { valid: false, avgGrowth: '0.0', meanBaseline: 0, meanEndline: 0, tScore: '0.000', df: '0.0', pValue: '1.000', isSignificant: false };
    
    const baselineIncomes = sortedList.map(b => b.baseline_income);
    const endlineIncomes = sortedList.map(b => b.current_income);

    const stats = calculateStats(endlineIncomes, baselineIncomes);
    const avgGrowth = (sortedList.reduce((acc, b) => acc + b.income_growth_pct, 0) / sortedList.length).toFixed(1);

    return {
      valid: true,
      avgGrowth,
      meanBaseline: Math.round(stats.meanB),
      meanEndline: Math.round(stats.meanA),
      tScore: stats.tScore.toFixed(3),
      df: stats.df.toFixed(1),
      pValue: stats.pValue < 0.0001 ? '< 0.0001' : stats.pValue.toFixed(4),
      isSignificant: stats.pValue < 0.05
    };
  }, [sortedList]);

  // Individual Z-Score and Percentile Rank
  const getIndividualStats = (b) => {
    if (!b || !sortedList.length) return { zScore: '0.00', pRank: 50, meanDev: '0.0' };
    const growths = sortedList.map(x => x.income_growth_pct);
    const mean = growths.reduce((a, c) => a + c, 0) / growths.length;
    const variance = growths.reduce((a, c) => a + Math.pow(c - mean, 2), 0) / (growths.length || 1);
    const sd = Math.sqrt(variance) || 1;

    const zScore = (b.income_growth_pct - mean) / sd;
    const lowerCount = growths.filter(x => x < b.income_growth_pct).length;
    const pRank = Math.round((lowerCount / growths.length) * 100);

    return {
      zScore: zScore.toFixed(2),
      pRank,
      meanDev: (b.income_growth_pct - mean).toFixed(1)
    };
  };

  const handleExportCSV = () => {
    let csv = "ID,Name,Wave,District,City,NGO,Baseline M0 (₹),Midline M3 (₹),Endline M6 (₹),Net Delta (₹),Growth %,Completion %,UPI M6,Bank M6,Bookkeeping M6,Credit M6,Survival Status,Confidence Tier,Archetype\n";
    sortedList.forEach(b => {
      csv += `"${b.beneficiary_id}","${b.name}","${b.wave}","${b.district}","${b.city}","${b.ngo_partner}",${b.baseline_income},${b.month3_income},${b.current_income},${b.income_growth_abs},${b.income_growth_pct}%,${b.training_completion_pct}%,${b.has_upi_month6 ? 'Active' : 'Inactive'},${b.has_bank_month6 ? 'Connected' : 'None'},${b.has_bookkeeping_month6 ? 'Khatabook' : 'Manual'},${b.has_credit_month6 ? 'MUDRA' : 'None'},${b.business_survival_flag ? 'Active' : 'Inactive'},${b.data_confidence_tier},"${b.scenario_archetype}"\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "microdata_longitudinal_ledger.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="workspace-view">
      {/* HEADER */}
      <div className="view-header border-box flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="heading-font">MICRO-DATA LONGITUDINAL LEDGER</h2>
          <div className="header-meta mt-1">MODE: INDIVIDUAL MULTI-WAVE MICRO-DATA & LIVE PAIRED T-TEST WORKBENCH</div>
        </div>

        <button className="btn-outline" onClick={handleExportCSV}>
          📥 EXPORT MICRO-DATA (CSV)
        </button>
      </div>

      {/* LIVE STATISTICAL T-TEST SUMMARY BAR FOR ACTIVE FILTERED VIEW */}
      <div className="grid col-4 gap-0 border-box" style={{ borderTop: 'none' }}>
        <div className="metric-panel border-right">
          <div className="metric-label">SUBSET SAMPLE SIZE (n)</div>
          <div className="metric-value">{sortedList.length}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Out of {beneficiaries.length} Total Enrolled</div>
        </div>

        <div className="metric-panel border-right">
          <div className="metric-label">SUBSET MEAN DELTA (X̄)</div>
          <div className="metric-value text-accent">+{activeSubsetStats.avgGrowth}%</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>M0 ₹{activeSubsetStats.meanBaseline} → M6 ₹{activeSubsetStats.meanEndline}</div>
        </div>

        <div className="metric-panel border-right">
          <div className="metric-label">PAIRED t-STATISTIC (df)</div>
          <div className="metric-value">{activeSubsetStats.tScore}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Degrees of Freedom df = {activeSubsetStats.df}</div>
        </div>

        <div className="metric-panel">
          <div className="metric-label">TWO-TAILED p-VALUE</div>
          <div className="metric-value" style={{ color: activeSubsetStats.isSignificant ? 'var(--status-done)' : 'var(--status-overdue)' }}>
            {activeSubsetStats.pValue}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {activeSubsetStats.isSignificant ? 'Significant (α = 0.05)' : 'Not Significant'}
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER TOOLBAR */}
      <div className="dense-filter-panel border-box" style={{ borderTop: 'none', padding: '20px 24px' }}>
        <div className="grid col-4 gap-16 mb-4" style={{ gap: '20px' }}>
          <div className="control-group">
            <label style={{ fontSize: '11px', fontWeight: 600 }}>MANUAL SEARCH</label>
            <input
              type="text"
              className="control-select"
              placeholder="Search Name, ID, District, City..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px' }}
            />
          </div>

          <div className="control-group">
            <label style={{ fontSize: '11px', fontWeight: 600 }}>LONGITUDINAL ROUND</label>
            <select className="control-select" value={roundFilter} onChange={e => setRoundFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="All">All Rounds (M0 → M6)</option>
              <option value="Baseline">Baseline Assessment (M0)</option>
              <option value="Month 3">Midline Survey (M3)</option>
              <option value="Month 6">Endline Verification (M6)</option>
            </select>
          </div>

          <div className="control-group">
            <label style={{ fontSize: '11px', fontWeight: 600 }}>GEOGRAPHIC DISTRICT</label>
            <select className="control-select" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="All">All Districts</option>
              <option value="Pune">Pune</option>
              <option value="Aurangabad">Aurangabad</option>
              <option value="Nashik">Nashik</option>
              <option value="Nagpur">Nagpur</option>
            </select>
          </div>

          <div className="control-group">
            <label style={{ fontSize: '11px', fontWeight: 600 }}>IMPLEMENTING NGO</label>
            <select className="control-select" value={ngoFilter} onChange={e => setNgoFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="All">All Implementing NGOs</option>
              <option value="Pratham">Pratham</option>
              <option value="SEWA">SEWA</option>
              <option value="Goonj">Goonj</option>
              <option value="Magic Bus">Magic Bus</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-top" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>
            FILTERED RECORDS: <strong style={{ color: 'var(--text-primary)' }}>{sortedList.length}</strong> | Paired t-Test: <strong>t = {activeSubsetStats.tScore}, df = {activeSubsetStats.df}, p = {activeSubsetStats.pValue}</strong>
          </span>

          <div className="flex items-center gap-2">
            <label className="text-xs data-font" style={{ color: 'var(--text-secondary)' }}>SORT CARDS BY:</label>
            <select className="control-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: '220px', padding: '4px 8px' }}>
              <option value="growth_desc">Growth % (High → Low)</option>
              <option value="growth_asc">Growth % (Low → High)</option>
              <option value="income_desc">Month 6 Income</option>
              <option value="baseline_desc">Baseline Income</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRISTINE BENEFICIARY CARDS GRID */}
      <div className="border-box p-6" style={{ borderTop: 'none', background: 'var(--bg-page)' }}>
        <div className="grid col-3 gap-16" style={{ gap: '24px' }}>
          {sortedList.map(b => {
            const indStats = getIndividualStats(b);
            return (
              <div 
                key={b.beneficiary_id} 
                className="border-box"
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-default)',
                  boxShadow: '3px 3px 0 var(--border-subtle)',
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  padding: '20px',
                  minHeight: '340px'
                }}
                onClick={() => setSelectedRecord(b)}
              >
                <div>
                  {/* TILE HEADER: ID ON LINE 1, NAME ON LINE 2 (NO OVERLAP!) */}
                  <div className="border-bottom pb-3 mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="heading-font text-xs" style={{ color: 'var(--color-accent)', letterSpacing: '0.05em' }}>
                        {b.beneficiary_id}
                      </span>
                      <span className={`status-pill ${b.data_confidence_tier === 'High' ? 'completed' : b.data_confidence_tier === 'Medium' ? 'pending' : 'overdue'}`}>
                        {b.data_confidence_tier} CONF.
                      </span>
                    </div>
                    <strong className="data-font text-base block" style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700 }}>
                      {b.name}
                    </strong>
                  </div>

                  {/* LOCATION & NGO */}
                  <div className="text-xs data-font mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {b.ngo_partner} • {b.city}, {b.district} • {b.wave}
                  </div>

                  {/* MONTH-ON-MONTH INCOME COMPARISON */}
                  <div className="p-3 border-box mb-3" style={{ background: 'var(--bg-highlight)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex justify-between items-center text-xs mb-1 data-font">
                      <span>Baseline (M0): <strong>₹{b.baseline_income}</strong></span>
                      <span>Endline (M6): <strong>₹{b.current_income}</strong></span>
                    </div>
                    <div className="progress-track" style={{ height: '6px', marginTop: '6px' }}>
                      <div className="progress-fill bg-done" style={{ width: `${Math.min(100, (b.current_income / 15000) * 100)}%` }} />
                    </div>
                  </div>

                  {/* GROWTH HIGHLIGHT & STATISTICAL PERCENTILE (STACKED CLEANLY, NO COLLISION!) */}
                  <div className="mb-3 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="heading-font text-sm" style={{ color: b.income_growth_pct >= 0 ? 'var(--status-done)' : 'var(--status-overdue)', fontWeight: 700 }}>
                        {b.income_growth_pct >= 0 ? '+' : ''}{b.income_growth_pct}% (+₹{b.income_growth_abs}/mo)
                      </span>
                      <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {b.training_completion_pct}% Modules
                      </span>
                    </div>

                    <div className="data-font text-xs flex justify-between" style={{ color: 'var(--color-accent)', paddingTop: '2px' }}>
                      <span>Cohort Rank: <strong>Top {100 - indStats.pRank}%ile</strong></span>
                      <span>Z-Score: <strong>Z = {indStats.zScore}σ</strong></span>
                    </div>
                  </div>

                  {/* CAPABILITY BADGES */}
                  <div className="flex gap-1 flex-wrap text-xs mb-4">
                    {b.has_upi_month6 && <span className="status-pill completed" style={{ fontSize: '9px', padding: '2px 6px' }}>UPI</span>}
                    {b.has_bank_month6 && <span className="status-pill completed" style={{ fontSize: '9px', padding: '2px 6px' }}>BANK</span>}
                    {b.has_bookkeeping_month6 && <span className="status-pill completed" style={{ fontSize: '9px', padding: '2px 6px' }}>KHATABOOK</span>}
                    {b.has_credit_month6 && <span className="status-pill completed" style={{ fontSize: '9px', padding: '2px 6px' }}>CREDIT</span>}
                  </div>
                </div>

                {/* CLEAN FULL-WIDTH BUTTON AT BOTTOM OF CARD */}
                <button 
                  className="btn-outline" 
                  style={{ 
                    width: '100%', 
                    fontSize: '11px', 
                    textAlign: 'center', 
                    borderColor: 'var(--color-accent)', 
                    color: 'var(--color-accent)',
                    padding: '8px 12px',
                    fontWeight: 700,
                    marginTop: '8px'
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedRecord(b); }}
                >
                  🔍 INSPECT RECORD & t-TEST STATS
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPANDED MODULAR DRAWER */}
      {selectedRecord && (() => {
        const indStats = getIndividualStats(selectedRecord);
        return (
          <div 
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.6)', zIndex: 200, 
              display: 'flex', justifyContent: 'center', items: 'center', padding: '24px' 
            }}
            onClick={() => setSelectedRecord(null)}
          >
            <div 
              className="border-box p-6" 
              style={{ 
                background: 'var(--bg-page)', width: '920px', maxHeight: '90vh', overflowY: 'auto', 
                border: '2px solid var(--border-default)', boxShadow: '8px 8px 0 var(--border-default)' 
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* DRAWER HEADER */}
              <div className="flex justify-between items-center border-bottom pb-4 mb-4">
                <div>
                  <h2 className="heading-font text-lg">{selectedRecord.beneficiary_id} | {selectedRecord.name}</h2>
                  <div className="header-meta">{selectedRecord.ngo_partner} ({selectedRecord.training_center}) • {selectedRecord.district} ({selectedRecord.city}) • Officer: {getOfficer(selectedRecord.district)}</div>
                </div>
                <button className="btn-outline" onClick={() => setSelectedRecord(null)}>✕ CLOSE DRAWER</button>
              </div>

              {/* INDIVIDUAL STATISTICAL CONTRIBUTION SUMMARY CARD */}
              <div className="border-box p-4 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-accent)' }}>
                <div className="flex justify-between items-center mb-2">
                  <strong className="heading-font text-xs text-accent">INDIVIDUAL STATISTICAL CONTRIBUTION & SIGNIFICANCE</strong>
                  <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>Relative to Active Filtered Cohort (n={sortedList.length})</span>
                </div>
                <div className="grid col-4 gap-16 text-xs text-center" style={{ gap: '12px' }}>
                  <div className="p-2 border-box" style={{ background: 'var(--bg-highlight)' }}>
                    <span>INDIVIDUAL GROWTH</span>
                    <strong className="block text-sm text-accent mt-1">+{selectedRecord.income_growth_pct}%</strong>
                  </div>
                  <div className="p-2 border-box" style={{ background: 'var(--bg-highlight)' }}>
                    <span>PERCENTILE RANK</span>
                    <strong className="block text-sm mt-1">{indStats.pRank}th %ile</strong>
                  </div>
                  <div className="p-2 border-box" style={{ background: 'var(--bg-highlight)' }}>
                    <span>INDIVIDUAL Z-SCORE</span>
                    <strong className="block text-sm mt-1">{indStats.zScore} σ</strong>
                  </div>
                  <div className="p-2 border-box" style={{ background: 'var(--bg-highlight)' }}>
                    <span>DEVIATION FROM MEAN</span>
                    <strong className="block text-sm mt-1" style={{ color: indStats.meanDev >= 0 ? 'var(--status-done)' : 'var(--status-overdue)' }}>
                      {indStats.meanDev >= 0 ? '+' : ''}{indStats.meanDev}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* MONTH-ON-MONTH COMPARISON CARDS */}
              <div className="grid col-3 gap-16 mb-6" style={{ gap: '16px' }}>
                <div className="p-4 border-box text-center" style={{ background: 'var(--bg-highlight)' }}>
                  <div className="metric-label">BASELINE M0 (JAN 2026)</div>
                  <div className="metric-value text-sm mt-1">₹{selectedRecord.baseline_income}/mo</div>
                  <span className="text-xs data-font" style={{ color: 'var(--text-secondary)' }}>Pre-Training Assessment</span>
                </div>

                <div className="p-4 border-box text-center" style={{ background: 'var(--bg-highlight)' }}>
                  <div className="metric-label">MIDLINE M3 (MAR 2026)</div>
                  <div className="metric-value text-sm mt-1">₹{selectedRecord.month3_income}/mo</div>
                  <span className="text-xs data-font" style={{ color: 'var(--text-secondary)' }}>+{Math.round(((selectedRecord.month3_income - selectedRecord.baseline_income)/selectedRecord.baseline_income)*100)}% Growth</span>
                </div>

                <div className="p-4 border-box text-center" style={{ background: 'var(--bg-highlight)' }}>
                  <div className="metric-label">ENDLINE M6 (JUN 2026)</div>
                  <div className="metric-value text-sm text-accent mt-1">₹{selectedRecord.current_income}/mo</div>
                  <span className="text-xs data-font" style={{ color: 'var(--status-done)' }}>+{selectedRecord.income_growth_pct}% Net Growth</span>
                </div>
              </div>

              {/* MONTH-ON-MONTH VISUAL TRAJECTORY */}
              <div className="border-box p-4 mb-6">
                <h3 className="heading-font text-xs mb-2">LONGITUDINAL INCOME TRAJECTORY (M0 → M3 → M6)</h3>
                <div style={{ height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { month: 'Baseline (M0)', income: selectedRecord.baseline_income },
                      { month: 'Midline (M3)', income: selectedRecord.month3_income },
                      { month: 'Endline (M6)', income: selectedRecord.current_income },
                    ]}>
                      <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                      <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                      <Tooltip cursor={{ fill: 'var(--bg-highlight)' }} />
                      <Bar dataKey="income" fill="var(--color-accent)" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DEMOGRAPHICS & COMPLETE CAPABILITIES */}
              <div className="grid col-2 gap-0 border-box mb-6">
                <div className="p-4 border-right">
                  <h3 className="heading-font text-xs mb-3 border-bottom pb-1">FULL PROFILE & DEMOGRAPHICS</h3>
                  <div className="space-y-2 text-xs">
                    <div className="data-row"><span>AGE / GENDER</span> <strong>{selectedRecord.age} / {selectedRecord.gender}</strong></div>
                    <div className="data-row"><span>OCCUPATION</span> <strong>{selectedRecord.occupation_type}</strong></div>
                    <div className="data-row"><span>PHONE TYPE</span> <strong>{selectedRecord.phone_type}</strong></div>
                    <div className="data-row"><span>COHORT WAVE</span> <strong>{selectedRecord.wave} ({selectedRecord.cohort_id})</strong></div>
                    <div className="data-row"><span>CONFIDENCE TIER</span> <strong>{selectedRecord.data_confidence_tier}</strong></div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="heading-font text-xs mb-3 border-bottom pb-1">CAPABILITIES & ADOPTION MATRIX</h3>
                  <div className="space-y-2 text-xs">
                    <div className="data-row"><span>UPI PAYMENTS</span> <strong>{selectedRecord.has_upi_month6 ? 'Active' : 'Inactive'}</strong></div>
                    <div className="data-row"><span>BANK ACCOUNT</span> <strong>{selectedRecord.has_bank_month6 ? 'Connected' : 'None'}</strong></div>
                    <div className="data-row"><span>DIGITAL BOOKKEEPING</span> <strong>{selectedRecord.has_bookkeeping_month6 ? 'Khatabook' : 'Manual'}</strong></div>
                    <div className="data-row"><span>FORMAL CREDIT</span> <strong>{selectedRecord.has_credit_month6 ? 'MUDRA Loan' : 'None'}</strong></div>
                    <div className="data-row"><span>MODULES COMPLETED</span> <strong>{selectedRecord.completed_modules.length > 0 ? selectedRecord.completed_modules.join(', ') : 'None'}</strong></div>
                  </div>
                </div>
              </div>

              {/* QUALITATIVE DIAGNOSTIC STORY */}
              <div className="border-box p-4 mb-6" style={{ background: 'var(--bg-highlight)' }}>
                <strong className="heading-font text-xs block mb-1">FIELD DIAGNOSTIC: {selectedRecord.scenario_archetype}</strong>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                  Enterprise Status: {selectedRecord.business_survival_flag ? 'Active Enterprise' : 'Enterprise Inactive'}. Tracked under standard verification protocol.
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button 
                  className="btn-outline" 
                  onClick={() => {
                    onInspectBeneficiary && onInspectBeneficiary(selectedRecord.beneficiary_id);
                    setSelectedRecord(null);
                  }}
                  style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                >
                  🔗 OPEN IN 1:1 INSPECTOR PAGE
                </button>
                <button className="btn-outline" onClick={() => setSelectedRecord(null)}>CLOSE</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
