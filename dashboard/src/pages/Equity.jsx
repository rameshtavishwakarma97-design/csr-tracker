import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import mockData from '../data/mock_data.json';
import './Pages.css';

export function Equity() {
  const beneficiaries = mockData.beneficiaries;

  // Filters
  const [districtFilter, setDistrictFilter] = useState('All');
  const [ngoFilter, setNgoFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Filtered Trained Cohort
  const activeTrained = useMemo(() => {
    return beneficiaries.filter(b => {
      if (b.wave !== 'Wave 1') return false;
      if (districtFilter !== 'All' && b.district !== districtFilter) return false;
      if (ngoFilter !== 'All' && b.ngo_partner !== ngoFilter) return false;
      return true;
    });
  }, [beneficiaries, districtFilter, ngoFilter]);

  // True 2D Intersectional Heatmap Rows
  const heatmapRows = useMemo(() => {
    const cuts = [
      { label: 'Female (All)', filter: b => b.gender === 'Female' },
      { label: 'Female × Home-based', filter: b => b.gender === 'Female' && b.occupation_type === 'Home-based' },
      { label: 'Female × Trader', filter: b => b.gender === 'Female' && b.occupation_type === 'Trader' },
      { label: 'Female × Service', filter: b => b.gender === 'Female' && b.occupation_type === 'Service' },
      { label: 'Male (All)', filter: b => b.gender === 'Male' },
      { label: 'Male × Trader', filter: b => b.gender === 'Male' && b.occupation_type === 'Trader' },
      { label: 'Male × Service', filter: b => b.gender === 'Male' && b.occupation_type === 'Service' },
      { label: 'Non-Smartphone Cohort', filter: b => b.phone_type !== 'Smartphone' },
    ];

    return cuts.map(c => {
      const cohort = activeTrained.filter(c.filter);
      const total = cohort.length;
      if (!total) return { label: c.label, growth: 0, digital: 0, credit: 0, survival: 0, count: 0 };

      const avgGrowth = (cohort.reduce((acc, b) => acc + b.income_growth_pct, 0) / total).toFixed(1);
      const digitalPct = Math.round((cohort.filter(b => b.has_upi_month6 || b.has_bookkeeping_month6).length / total) * 100);
      const creditPct = Math.round((cohort.filter(b => b.has_credit_month6).length / total) * 100);
      const survivalPct = Math.round((cohort.filter(b => b.business_survival_flag).length / total) * 100);

      return {
        label: c.label,
        growth: parseFloat(avgGrowth),
        digital: digitalPct,
        credit: creditPct,
        survival: survivalPct,
        count: total
      };
    });
  }, [activeTrained]);

  // Dynamic Gender Gap Calculation
  const genderComparison = useMemo(() => {
    const females = activeTrained.filter(b => b.gender === 'Female');
    const males = activeTrained.filter(b => b.gender === 'Male');

    const fN = females.length || 1;
    const mN = males.length || 1;

    const fGrowth = (females.reduce((a, b) => a + b.income_growth_pct, 0) / fN).toFixed(1);
    const mGrowth = (males.reduce((a, b) => a + b.income_growth_pct, 0) / mN).toFixed(1);

    const fDigital = Math.round((females.filter(b => b.has_upi_month6 || b.has_bookkeeping_month6).length / fN) * 100);
    const mDigital = Math.round((males.filter(b => b.has_upi_month6 || b.has_bookkeeping_month6).length / mN) * 100);

    const fCredit = Math.round((females.filter(b => b.has_credit_month6).length / fN) * 100);
    const mCredit = Math.round((males.filter(b => b.has_credit_month6).length / mN) * 100);

    const fSurvival = Math.round((females.filter(b => b.business_survival_flag).length / fN) * 100);
    const mSurvival = Math.round((males.filter(b => b.business_survival_flag).length / mN) * 100);

    return {
      fGrowth, mGrowth,
      fDigital, mDigital,
      fCredit, mCredit,
      fSurvival, mSurvival,
      fN, mN,
      digitalDelta: fDigital - mDigital,
      creditGap: mCredit - fCredit
    };
  }, [activeTrained]);

  const genderChartData = [
    { metric: 'Median Growth %', Female: parseFloat(genderComparison.fGrowth), Male: parseFloat(genderComparison.mGrowth) },
    { metric: 'Digital Adoption %', Female: genderComparison.fDigital, Male: genderComparison.mDigital },
    { metric: 'Credit Access %', Female: genderComparison.fCredit, Male: genderComparison.mCredit },
    { metric: '6M Survival %', Female: genderComparison.fSurvival, Male: genderComparison.mSurvival },
  ];

  // Helper for Heatmap Color Shading
  const getGrowthBg = (val) => {
    if (val >= 28) return 'rgba(16, 185, 129, 0.25)'; // Deep Emerald
    if (val >= 24) return 'rgba(16, 185, 129, 0.15)'; // Light Emerald
    return 'rgba(245, 158, 11, 0.15)'; // Amber
  };

  const getPctBg = (val) => {
    if (val >= 80) return 'rgba(59, 130, 246, 0.25)'; // Deep Blue
    if (val >= 60) return 'rgba(59, 130, 246, 0.15)'; // Light Blue
    return 'rgba(239, 68, 68, 0.15)'; // Soft Red
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    let csv = "Demographic Intersectional Cut,Sample (n),Median Growth %,Digital Adoption %,Credit Access %,6M Survival %\n";
    heatmapRows.forEach(r => {
      csv += `"${r.label}",${r.count},+${r.growth}%,${r.digital}%,${r.credit}%,${r.survival}%\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "demographic_equity_heatmap.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="workspace-view">
      {/* TOAST */}
      {toastMessage && (
        <div className="annotation-callout" style={{ position: 'fixed', top: '64px', right: '32px', zIndex: 100, background: 'var(--bg-page)', border: '2px solid var(--color-accent)' }}>
          <strong>System Notification:</strong> {toastMessage}
        </div>
      )}

      {/* HEADER & CONTROLS */}
      <div className="view-header border-box flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="heading-font">DEMOGRAPHICS & EQUITY</h2>
          <div className="header-meta mt-1">INTERSECTIONAL SEGMENTATION</div>
        </div>

        <button className="btn-outline" onClick={handleExportCSV}>
          EXPORT EQUITY DATA (CSV)
        </button>
      </div>

      {/* SUBGROUP FILTER TOOLBAR */}
      <div className="dense-filter-panel border-box" style={{ borderTop: 'none', padding: '16px' }}>
        <div className="filter-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', padding: 0, gap: '16px' }}>
          <div className="control-group">
            <label>FILTER DISTRICT</label>
            <select className="control-select" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
              <option value="All">All Districts</option>
              <option value="Pune">Pune</option>
              <option value="Aurangabad">Aurangabad</option>
              <option value="Nashik">Nashik</option>
              <option value="Nagpur">Nagpur</option>
            </select>
          </div>

          <div className="control-group">
            <label>FILTER NGO PARTNER</label>
            <select className="control-select" value={ngoFilter} onChange={e => setNgoFilter(e.target.value)}>
              <option value="All">All NGOs</option>
              <option value="Pratham">Pratham</option>
              <option value="SEWA">SEWA</option>
              <option value="Goonj">Goonj</option>
              <option value="Magic Bus">Magic Bus</option>
            </select>
          </div>

          <div className="control-group flex justify-end items-end">
            <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>
              ACTIVE SAMPLE: {activeTrained.length} Trained Beneficiaries
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4.1: INTERSECTIONAL HEATMAP MATRIX WITH REAL HEAT SHADING */}
      <div className="data-table-container border-box" style={{ borderTop: 'none' }}>
        <div className="table-header p-4 border-bottom flex justify-between items-center">
          <h3 className="heading-font text-sm">INTERSECTIONAL OUTCOME MATRIX (COLOR HEAT SHADED)</h3>
          <div className="flex items-center gap-3 text-xs data-font" style={{ color: 'var(--text-secondary)' }}>
            <span>HEAT MAP LEGEND:</span>
            <span style={{ background: 'rgba(16, 185, 129, 0.25)', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}>High Growth</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.25)', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}>High Adoption</span>
            <span style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}>Low Credit Access</span>
          </div>
        </div>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>INTERSECTIONAL DEMOGRAPHIC CUT</th>
              <th>SAMPLE (n)</th>
              <th>MEDIAN GROWTH %</th>
              <th>DIGITAL ADOPTION %</th>
              <th>CREDIT ACCESS %</th>
              <th>6M SURVIVAL %</th>
            </tr>
          </thead>
          <tbody>
            {heatmapRows.map((row, idx) => (
              <tr key={idx}>
                <td><strong>{row.label}</strong></td>
                <td>{row.count}</td>
                <td style={{ backgroundColor: getGrowthBg(row.growth), fontWeight: 700 }}>
                  +{row.growth}%
                </td>
                <td style={{ backgroundColor: getPctBg(row.digital) }}>
                  {row.digital}%
                </td>
                <td style={{ backgroundColor: getPctBg(row.credit) }}>
                  {row.credit}%
                </td>
                <td style={{ backgroundColor: getGrowthBg(row.survival / 3) }}>
                  <span style={{ color: 'var(--status-done)', fontWeight: 600 }}>{row.survival}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECTION 4.2 & 4.3: GENDER DEEP DIVE WITH LIVE CHART & SIGNAL EQUITY */}
      <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
        <div className="p-6 border-right">
          <h3 className="heading-font text-sm mb-4">GENDER EQUITY DEEP DIVE (FEMALE VS MALE)</h3>
          
          {/* GROUPED BAR CHART */}
          <div style={{ height: '220px', marginBottom: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="metric" tick={{ fill: 'var(--text-primary)', fontSize: 10, fontFamily: 'var(--font-data)' }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-data)' }} />
                <Tooltip cursor={{ fill: 'var(--bg-highlight)' }} />
                <Legend />
                <Bar dataKey="Female" fill="#EC4899" barSize={18} />
                <Bar dataKey="Male" fill="#3B82F6" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 border-box" style={{ background: 'var(--bg-highlight)', border: '1px solid var(--border-default)' }}>
            <div className="heading-font text-xs mb-1">DYNAMIC INSIGHT: GENDER STRUCTURAL GAP</div>
            <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
              Female beneficiaries (n={genderComparison.fN}) demonstrate <strong>{genderComparison.fDigital}% digital tool adoption</strong> ({genderComparison.digitalDelta >= 0 ? `+${genderComparison.digitalDelta}%` : `${genderComparison.digitalDelta}%`} vs males), but access formal credit at <strong>{genderComparison.fCredit}%</strong> (a <strong>{genderComparison.creditGap}% gap</strong> behind males). Credit facilitation modules require female-targeted bank intervention.
            </p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="heading-font text-sm mb-4">DIGITAL SIGNAL EQUITY GUARANTEE</h3>
          <div className="space-y-3 text-xs">
            <div className="data-row">
              <span>SMARTPHONE SDK COHORT (n = {activeTrained.filter(b => b.phone_type === 'Smartphone').length})</span>
              <strong>+{(activeTrained.filter(b => b.phone_type === 'Smartphone').reduce((a,b)=>a+b.income_growth_pct,0)/(activeTrained.filter(b => b.phone_type === 'Smartphone').length||1)).toFixed(1)}% Growth</strong>
            </div>
            <div className="data-row">
              <span>NON-SMARTPHONE SURVEY COHORT (n = {activeTrained.filter(b => b.phone_type !== 'Smartphone').length})</span>
              <strong>+{(activeTrained.filter(b => b.phone_type !== 'Smartphone').reduce((a,b)=>a+b.income_growth_pct,0)/(activeTrained.filter(b => b.phone_type !== 'Smartphone').length||1)).toFixed(1)}% Growth</strong>
            </div>
            <div className="p-4 border-box mt-6" style={{ background: 'var(--bg-highlight)', border: '1px solid var(--border-default)' }}>
              <strong className="heading-font text-xs block mb-1">EQUITY POLICY AUDIT STATEMENT</strong>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Non-smartphone beneficiaries (Feature phone / No phone) represent <strong>45% of total enrolled participants</strong>. Under Bajaj Finserv CSR guidelines, their survey outcomes carry <strong>100% equal weight</strong> in all headline impact metrics and are never excluded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
