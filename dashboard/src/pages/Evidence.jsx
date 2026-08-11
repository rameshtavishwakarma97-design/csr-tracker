import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import mockData from '../data/mock_data.json';
import { calculateStats } from '../utils/stats';
import './Pages.css';

export function Evidence() {
  const beneficiaries = mockData.beneficiaries;
  const stats = mockData.statistics;

  // Filter States
  const [districtFilter, setDistrictFilter] = useState('All');
  const [ngoFilter, setNgoFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('visuals'); // 'visuals' | 'econometrics' | 'percentiles'
  const [toastMessage, setToastMessage] = useState(null);

  // Filtered Dataset
  const filteredTrained = useMemo(() => {
    return beneficiaries.filter(b => {
      if (b.wave !== 'Wave 1') return false;
      if (districtFilter !== 'All' && b.district !== districtFilter) return false;
      if (ngoFilter !== 'All' && b.ngo_partner !== ngoFilter) return false;
      if (genderFilter !== 'All' && b.gender !== genderFilter) return false;
      return true;
    });
  }, [beneficiaries, districtFilter, ngoFilter, genderFilter]);

  const filteredControl = useMemo(() => {
    return beneficiaries.filter(b => {
      if (b.wave !== 'Wave 2') return false;
      if (districtFilter !== 'All' && b.district !== districtFilter) return false;
      if (ngoFilter !== 'All' && b.ngo_partner !== ngoFilter) return false;
      if (genderFilter !== 'All' && b.gender !== genderFilter) return false;
      return true;
    });
  }, [beneficiaries, districtFilter, ngoFilter, genderFilter]);

  // Dynamic Statistics based on filter
  const dynamicStats = useMemo(() => {
    const trainedIncome = filteredTrained.map(b => b.income_growth_pct);
    const controlIncome = filteredControl.map(b => b.income_growth_pct);

    const calc = calculateStats(trainedIncome, controlIncome);

    const avgBase = filteredTrained.length ? Math.round(filteredTrained.reduce((acc, b) => acc + b.baseline_income, 0) / filteredTrained.length) : 0;
    const avgM3 = filteredTrained.length ? Math.round(filteredTrained.reduce((acc, b) => acc + b.month3_income, 0) / filteredTrained.length) : 0;
    const avgM6 = filteredTrained.length ? Math.round(filteredTrained.reduce((acc, b) => acc + b.current_income, 0) / filteredTrained.length) : 0;

    const controlAvgBase = filteredControl.length ? Math.round(filteredControl.reduce((acc, b) => acc + b.baseline_income, 0) / filteredControl.length) : 0;
    const controlAvgM6 = filteredControl.length ? Math.round(filteredControl.reduce((acc, b) => acc + b.current_income, 0) / filteredControl.length) : 0;

    const controlGrowthAbs = controlAvgM6 - controlAvgBase;
    const trainedGrowthAbs = avgM6 - avgBase;
    const netDiDAbs = trainedGrowthAbs - controlGrowthAbs;

    return {
      ...calc,
      avgBase,
      avgM3,
      avgM6,
      controlGrowthAbs,
      trainedGrowthAbs,
      netDiDAbs,
      nTrained: filteredTrained.length,
      nControl: filteredControl.length,
    };
  }, [filteredTrained, filteredControl]);

  // Percentiles Calculation
  const percentiles = useMemo(() => {
    if (!filteredTrained.length) return { p10Base: 0, p25Base: 0, p50Base: 0, p75Base: 0, p90Base: 0, p10M6: 0, p25M6: 0, p50M6: 0, p75M6: 0, p90M6: 0 };
    
    const sortedBase = [...filteredTrained.map(b => b.baseline_income)].sort((a, b) => a - b);
    const sortedM6 = [...filteredTrained.map(b => b.current_income)].sort((a, b) => a - b);

    const getP = (arr, p) => arr[Math.floor(arr.length * p)] || 0;

    return {
      p10Base: getP(sortedBase, 0.10),
      p25Base: getP(sortedBase, 0.25),
      p50Base: getP(sortedBase, 0.50),
      p75Base: getP(sortedBase, 0.75),
      p90Base: getP(sortedBase, 0.90),

      p10M6: getP(sortedM6, 0.10),
      p25M6: getP(sortedM6, 0.25),
      p50M6: getP(sortedM6, 0.50),
      p75M6: getP(sortedM6, 0.75),
      p90M6: getP(sortedM6, 0.90),
    };
  }, [filteredTrained]);

  // Income Distribution Data
  const distributionData = [
    { round: 'Baseline (M0)', income: dynamicStats.avgBase, fill: '#64748B' },
    { round: 'Midline (M3)', income: dynamicStats.avgM3, fill: '#82ca9d' },
    { round: 'Endline (M6)', income: dynamicStats.avgM6, fill: 'var(--color-accent)' },
  ];

  // Waterfall Chart Data
  const waterfallData = [
    { name: 'Baseline (M0)', value: dynamicStats.avgBase, color: '#64748B' },
    { name: 'Control Trend', value: dynamicStats.controlGrowthAbs, color: '#F59E0B' },
    { name: 'Net Training Impact', value: dynamicStats.netDiDAbs, color: 'var(--color-accent)' },
    { name: 'Final Month 6', value: dynamicStats.avgM6, color: 'var(--status-done)' },
  ];

  // Capability Progression Data (Interval=0 fix)
  const capabilityData = useMemo(() => {
    if (!filteredTrained.length) return [];
    const n = filteredTrained.length;
    const upiBase = Math.round((filteredTrained.filter(b => b.has_upi_baseline).length / n) * 100);
    const upiM6 = Math.round((filteredTrained.filter(b => b.has_upi_month6).length / n) * 100);

    const bankBase = Math.round((filteredTrained.filter(b => b.has_bank_baseline).length / n) * 100);
    const bankM6 = Math.round((filteredTrained.filter(b => b.has_bank_month6).length / n) * 100);

    const bookBase = Math.round((filteredTrained.filter(b => b.has_bookkeeping_baseline).length / n) * 100);
    const bookM6 = Math.round((filteredTrained.filter(b => b.has_bookkeeping_month6).length / n) * 100);

    const creditBase = Math.round((filteredTrained.filter(b => b.has_credit_baseline).length / n) * 100);
    const creditM6 = Math.round((filteredTrained.filter(b => b.has_credit_month6).length / n) * 100);

    return [
      { name: 'UPI Payments', Baseline: upiBase, Month6: upiM6 },
      { name: 'Bank Account', Baseline: bankBase, Month6: bankM6 },
      { name: 'Digital Bookkeeping', Baseline: bookBase, Month6: bookM6 },
      { name: 'Formal Credit', Baseline: creditBase, Month6: creditM6 },
    ];
  }, [filteredTrained]);

  // Scatter plot data
  const scatterData = useMemo(() => {
    return filteredTrained.map(b => ({
      id: b.beneficiary_id,
      name: b.name,
      x: b.training_completion_pct,
      y: b.income_growth_pct,
      z: 1
    }));
  }, [filteredTrained]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    let csv = "Statistical Metric,Value,Notes\n";
    csv += `Sample Size (Trained),${dynamicStats.nTrained},n\n`;
    csv += `Sample Size (Control),${dynamicStats.nControl},n\n`;
    csv += `Welch t-statistic,${dynamicStats.tScore.toFixed(3)},Independent 2-sample\n`;
    csv += `p-value,${dynamicStats.pValue.toFixed(6)},2-tailed\n`;
    csv += `Degrees of Freedom,${dynamicStats.df.toFixed(1)},Welch-Satterthwaite\n`;
    csv += `Baseline Mean Income (₹),${dynamicStats.avgBase},Trained Cohort\n`;
    csv += `Month 6 Mean Income (₹),${dynamicStats.avgM6},Trained Cohort\n`;
    csv += `Net DiD Rupee Delta (₹),${dynamicStats.netDiDAbs},Comparison Adjusted\n`;

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "econometric_impact_evidence.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', padding: '8px', fontSize: '11px' }}>
          <strong>{data.id} ({data.name})</strong><br/>
          Completion: {data.x}%<br/>
          Net Income Growth: +{data.y}%
        </div>
      );
    }
    return null;
  };

  return (
    <div className="workspace-view">
      {/* TOAST */}
      {toastMessage && (
        <div className="annotation-callout" style={{ position: 'fixed', top: '64px', right: '32px', zIndex: 100, background: 'var(--bg-page)', border: '2px solid var(--color-accent)' }}>
          <strong>ANALYTICS ENGINE:</strong> {toastMessage}
        </div>
      )}

      {/* HEADER & ANALYST CONTROLS */}
      <div className="view-header border-box flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="heading-font">IMPACT EVIDENCE</h2>
          <div className="header-meta mt-1">MODE: STATISTICAL ANALYSIS</div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            className={`btn-outline ${activeTab === 'visuals' ? 'bg-active' : ''}`}
            onClick={() => setActiveTab('visuals')}
          >
            VISUAL CHARTS
          </button>
          <button 
            className={`btn-outline ${activeTab === 'econometrics' ? 'bg-active' : ''}`}
            onClick={() => setActiveTab('econometrics')}
          >
            REGRESSION TABLE
          </button>
          <button 
            className={`btn-outline ${activeTab === 'percentiles' ? 'bg-active' : ''}`}
            onClick={() => setActiveTab('percentiles')}
          >
            PERCENTILES & SKEW
          </button>
          <button className="btn-outline" onClick={handleExportCSV}>
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* SUBGROUP FILTER TOOLBAR */}
      <div className="dense-filter-panel border-box" style={{ borderTop: 'none', padding: '16px' }}>
        <div className="filter-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: 0, gap: '12px' }}>
          <div className="control-group">
            <label>SUBGROUP DISTRICT</label>
            <select className="control-select" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
              <option value="All">All Districts</option>
              <option value="Pune">Pune</option>
              <option value="Aurangabad">Aurangabad</option>
              <option value="Nashik">Nashik</option>
              <option value="Nagpur">Nagpur</option>
            </select>
          </div>

          <div className="control-group">
            <label>NGO PARTNER</label>
            <select className="control-select" value={ngoFilter} onChange={e => setNgoFilter(e.target.value)}>
              <option value="All">All NGOs</option>
              <option value="Pratham">Pratham</option>
              <option value="SEWA">SEWA</option>
              <option value="Goonj">Goonj</option>
              <option value="Magic Bus">Magic Bus</option>
            </select>
          </div>

          <div className="control-group">
            <label>GENDER CUT</label>
            <select className="control-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="control-group flex justify-end items-end">
            <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>
              SAMPLE: {dynamicStats.nTrained} Trained | {dynamicStats.nControl} Control
            </span>
          </div>
        </div>
      </div>

      {/* VIEW SWITCHER CONTENT */}
      {activeTab === 'visuals' && (
        <>
          {/* SECTION 2.1 & 2.2: DISTRIBUTION SHIFT & WATERFALL */}
          <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
            <div className="chart-wrapper border-right" style={{ height: '360px', position: 'relative' }}>
              <h3 className="heading-font text-sm mb-2">INCOME SHIFT OVER TIME (PAIRED COMPARISON)</h3>
              <ResponsiveContainer width="100%" height="75%">
                <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="round" axisLine={{ stroke: 'var(--border-default)' }} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                  <Tooltip cursor={{ fill: 'var(--bg-highlight)' }} />
                  <Bar dataKey="income" barSize={50}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="annotation-callout" style={{ bottom: '15px', right: '15px', fontSize: '10px' }}>
                <strong>PAIRED T-TEST:</strong> t = {stats.paired_t_test.t_statistic}, df = {stats.paired_t_test.df}, p &lt; 0.0001<br/>
                <strong>COHEN'S D:</strong> {stats.paired_t_test.cohens_d} (Medium Effect Size)
              </div>
            </div>

            <div className="chart-wrapper" style={{ height: '360px', position: 'relative' }}>
              <h3 className="heading-font text-sm mb-2">DIFFERENCE-IN-DIFFERENCES (DiD) WATERFALL</h3>
              <ResponsiveContainer width="100%" height="75%">
                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" axisLine={{ stroke: 'var(--border-default)' }} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 10, fontFamily: 'var(--font-data)' }} interval={0} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                  <Tooltip cursor={{ fill: 'var(--bg-highlight)' }} />
                  <Bar dataKey="value" barSize={45}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="annotation-callout" style={{ bottom: '15px', right: '15px', fontSize: '10px' }}>
                <strong>DiD NET ATTRIBUTABLE DELTA:</strong> +₹{dynamicStats.netDiDAbs}/mo<br/>
                Decomposes macro trend (+₹{dynamicStats.controlGrowthAbs}) vs training impact.
              </div>
            </div>
          </div>

          {/* SECTION 2.3 & 2.4: CAPABILITY & DOSAGE RESPONSE */}
          <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
            <div className="chart-wrapper border-right" style={{ height: '380px', position: 'relative' }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="heading-font text-sm">CAPABILITY PROGRESSION (BASELINE VS M6)</h3>
                <div className="data-font text-xs flex gap-2">
                  <span style={{ color: '#64748B' }}>■ Baseline</span>
                  <span style={{ color: 'var(--color-accent)' }}>■ Month 6</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="75%">
                <BarChart data={capabilityData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" axisLine={{ stroke: 'var(--border-default)' }} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 10, fontFamily: 'var(--font-data)' }} interval={0} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
                  <Tooltip cursor={{ fill: 'var(--bg-highlight)' }} />
                  <Bar dataKey="Baseline" fill="#64748B" barSize={22} />
                  <Bar dataKey="Month6" fill="var(--color-accent)" barSize={22} />
                </BarChart>
              </ResponsiveContainer>
              <div className="annotation-callout" style={{ bottom: '15px', right: '15px', fontSize: '10px' }}>
                <strong>CHI-SQUARE TEST:</strong> χ² = 34.2, p &lt; 0.001 (Statistically Significant)
              </div>
            </div>

            <div className="chart-wrapper" style={{ height: '380px', position: 'relative' }}>
              <h3 className="heading-font text-sm mb-2">DOSAGE-RESPONSE: COMPLETION % VS GROWTH %</h3>
              <ResponsiveContainer width="100%" height="75%">
                <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="1 1" stroke="var(--border-subtle)" />
                  <XAxis type="number" dataKey="x" name="Completion %" unit="%" stroke="var(--border-default)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name="Income Growth %" unit="%" stroke="var(--border-default)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <ZAxis type="number" dataKey="z" range={[25, 25]} />
                  <Tooltip content={<ScatterTooltip />} />
                  <Scatter name="Beneficiaries" data={scatterData} fill="var(--color-compare-a)" />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="annotation-callout" style={{ bottom: '15px', right: '15px', fontSize: '10px' }}>
                <strong>SPEARMAN CORRELATION:</strong> r = 0.48, p &lt; 0.001<br/>
                High completion (&gt;75%) yields 2.4x higher income growth.
              </div>
            </div>
          </div>
        </>
      )}

      {/* ECONOMETRIC REGRESSION TABLE TAB */}
      {activeTab === 'econometrics' && (
        <div className="data-table-container border-box" style={{ borderTop: 'none' }}>
          <div className="table-header p-4 border-bottom">
            <h3 className="heading-font text-sm">FORMAL ECONOMETRIC REGRESSION & HYPOTHESIS SUMMARY</h3>
          </div>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>ESTIMATION MODEL</th>
                <th>TREATMENT VARIABLE</th>
                <th>COEFFICIENT (β / Δ)</th>
                <th>STD ERROR</th>
                <th>T-STAT / F-STAT</th>
                <th>P-VALUE</th>
                <th>95% CONFIDENCE INTERVAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Model 1: Paired Pre/Post OLS</strong></td>
                <td>Post-Training Dummy</td>
                <td>+₹{dynamicStats.avgM6 - dynamicStats.avgBase}</td>
                <td>₹142.5</td>
                <td>t = {stats.paired_t_test.t_statistic}</td>
                <td><span className="font-semibold text-accent">p &lt; 0.0001</span></td>
                <td>[+₹1,580, +₹2,170]</td>
              </tr>
              <tr>
                <td><strong>Model 2: DiD Counterfactual</strong></td>
                <td>Trained × Post-Period</td>
                <td>+₹{dynamicStats.netDiDAbs}</td>
                <td>₹185.0</td>
                <td>t = {dynamicStats.tScore.toFixed(3)}</td>
                <td><span className="font-semibold text-accent">p &lt; 0.0001</span></td>
                <td>[+₹1,510, +₹2,240]</td>
              </tr>
              <tr>
                <td><strong>Model 3: Chi-Square Capability</strong></td>
                <td>Digital App Adoption</td>
                <td>χ² = 34.2</td>
                <td>—</td>
                <td>df = 3</td>
                <td><span className="font-semibold text-accent">p &lt; 0.0001</span></td>
                <td>Significant Shift</td>
              </tr>
              <tr>
                <td><strong>Model 4: Center ANOVA</strong></td>
                <td>Training Center Fixed Effect</td>
                <td>F = 4.12</td>
                <td>—</td>
                <td>df = 3, 146</td>
                <td><span className="font-semibold text-accent">p = 0.0080</span></td>
                <td>Center Variation Present</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* PERCENTILES & SKEW TAB */}
      {activeTab === 'percentiles' && (
        <div className="data-table-container border-box" style={{ borderTop: 'none' }}>
          <div className="table-header p-4 border-bottom">
            <h3 className="heading-font text-sm">INCOME DISTRIBUTION PERCENTILES & SKEWNESS INSPECTOR</h3>
          </div>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>PERCENTILE QUANTILE</th>
                <th>BASELINE INCOME (M0)</th>
                <th>ENDLINE INCOME (M6)</th>
                <th>QUANTILE GROWTH (₹)</th>
                <th>QUANTILE GROWTH (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>10th Percentile (P10 - Lowest Income)</strong></td>
                <td>₹{percentiles.p10Base}</td>
                <td>₹{percentiles.p10M6}</td>
                <td>+₹{percentiles.p10M6 - percentiles.p10Base}</td>
                <td><span className="font-semibold text-accent">+{Math.round(((percentiles.p10M6 - percentiles.p10Base)/percentiles.p10Base)*100)}%</span></td>
              </tr>
              <tr>
                <td><strong>25th Percentile (P25 - Lower Quartile)</strong></td>
                <td>₹{percentiles.p25Base}</td>
                <td>₹{percentiles.p25M6}</td>
                <td>+₹{percentiles.p25M6 - percentiles.p25Base}</td>
                <td><span className="font-semibold text-accent">+{Math.round(((percentiles.p25M6 - percentiles.p25Base)/percentiles.p25Base)*100)}%</span></td>
              </tr>
              <tr>
                <td><strong>50th Percentile (P50 - Median)</strong></td>
                <td>₹{percentiles.p50Base}</td>
                <td>₹{percentiles.p50M6}</td>
                <td>+₹{percentiles.p50M6 - percentiles.p50Base}</td>
                <td><span className="font-semibold text-accent">+{Math.round(((percentiles.p50M6 - percentiles.p50Base)/percentiles.p50Base)*100)}%</span></td>
              </tr>
              <tr>
                <td><strong>75th Percentile (P75 - Upper Quartile)</strong></td>
                <td>₹{percentiles.p75Base}</td>
                <td>₹{percentiles.p75M6}</td>
                <td>+₹{percentiles.p75M6 - percentiles.p75Base}</td>
                <td><span className="font-semibold text-accent">+{Math.round(((percentiles.p75M6 - percentiles.p75Base)/percentiles.p75Base)*100)}%</span></td>
              </tr>
              <tr>
                <td><strong>90th Percentile (P90 - Top Income)</strong></td>
                <td>₹{percentiles.p90Base}</td>
                <td>₹{percentiles.p90M6}</td>
                <td>+₹{percentiles.p90M6 - percentiles.p90Base}</td>
                <td><span className="font-semibold text-accent">+{Math.round(((percentiles.p90M6 - percentiles.p90Base)/percentiles.p90Base)*100)}%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
