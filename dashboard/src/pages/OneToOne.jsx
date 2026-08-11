import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import mockData from '../data/mock_data.json';
import './Pages.css';

export function OneToOne({ targetBeneficiaryId }) {
  const beneficiaries = mockData.beneficiaries;
  
  // Filter States
  const [districtFilter, setDistrictFilter] = useState('All');
  const [ngoFilter, setNgoFilter] = useState('All');
  const [archetypeFilter, setArchetypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hidePII, setHidePII] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filtered List
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      if (districtFilter !== 'All' && b.district !== districtFilter) return false;
      if (ngoFilter !== 'All' && b.ngo_partner !== ngoFilter) return false;
      if (archetypeFilter !== 'All' && !b.scenario_archetype.toLowerCase().includes(archetypeFilter.toLowerCase())) return false;
      
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchId = b.beneficiary_id.toLowerCase().includes(q);
        const matchName = b.name.toLowerCase().includes(q);
        const matchDist = b.district.toLowerCase().includes(q);
        const matchCity = b.city.toLowerCase().includes(q);
        const matchNgo = b.ngo_partner.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchDist && !matchCity && !matchNgo) return false;
      }
      return true;
    });
  }, [beneficiaries, districtFilter, ngoFilter, archetypeFilter, searchQuery]);

  // Selected Target
  const [targetId, setTargetId] = useState(targetBeneficiaryId || (filteredBeneficiaries[0] ? filteredBeneficiaries[0].beneficiary_id : beneficiaries[0].beneficiary_id));

  // Sync prop changes
  useEffect(() => {
    if (targetBeneficiaryId) {
      setTargetId(targetBeneficiaryId);
    }
  }, [targetBeneficiaryId]);

  // Auto-switch targetId when search or filters change so live search works instantly!
  useEffect(() => {
    if (filteredBeneficiaries.length > 0) {
      if (!filteredBeneficiaries.some(b => b.beneficiary_id === targetId)) {
        setTargetId(filteredBeneficiaries[0].beneficiary_id);
      }
    }
  }, [filteredBeneficiaries, targetId]);

  const currentIndex = filteredBeneficiaries.findIndex(b => b.beneficiary_id === targetId);
  const selected = beneficiaries.find(b => b.beneficiary_id === targetId) || filteredBeneficiaries[0] || beneficiaries[0];

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setTargetId(filteredBeneficiaries[currentIndex - 1].beneficiary_id);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredBeneficiaries.length - 1) {
      setTargetId(filteredBeneficiaries[currentIndex + 1].beneficiary_id);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDistrictFilter('All');
    setNgoFilter('All');
    setArchetypeFilter('All');
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Archetype Diagnostic Explanations
  const getDiagnosticStory = (arch, name) => {
    const displayName = hidePII ? selected.beneficiary_id : (selected.name || name);
    if (arch.includes('Meena')) {
      return `${displayName} shows +${selected.income_growth_pct}% income growth in field survey records, but zero SDK digital signals (Feature Phone). Full weight assigned via Tier 1 survey protocol under signal equity policy.`;
    }
    if (arch.includes('Renu')) {
      return `${displayName} exhibits high SDK digital payment notifications (+120%), but survey verification reveals income growth is flat (+${selected.income_growth_pct}%). Classified as False Positive.`;
    }
    if (arch.includes('Arjun')) {
      return `${displayName} experienced an income drop (${selected.income_growth_pct}%) due to municipal road construction blocking shopfront access. Business inactive; shock logged to prevent misattribution to training failure.`;
    }
    if (arch.includes('Rakesh')) {
      return `${displayName} exhibits circular transaction loops detected via SDK heuristics. Flagged for internal verification; survey records show modest organic growth (+${selected.income_growth_pct}%).`;
    }
    if (arch.includes('Suresh')) {
      return `${displayName} completed Bookkeeping + Credit modules. Shows strong multi-signal verified growth (+${selected.income_growth_pct}%) backed by formal MUDRA loan access and digital app usage.`;
    }
    if (arch.includes('Priya')) {
      return `${displayName} completed 80% of modules but faces capital constraints. Income is flat (+${selected.income_growth_pct}%). Enterprise remains active.`;
    }
    return `${displayName} completed training with verified multi-signal income growth of +${selected.income_growth_pct}%. Business operations are stable and active.`;
  };

  // Sparkline chart data
  const trajectoryData = [
    { round: 'Baseline', income: selected.baseline_income, fill: '#64748B' },
    { round: 'Month 3', income: selected.month3_income, fill: '#82ca9d' },
    { round: 'Month 6', income: selected.current_income, fill: 'var(--color-accent)' },
  ];

  // Timeline Event Stream
  const eventStream = [
    { date: '2026-01-10', title: 'Program Enrollment', desc: `Enrolled in ${selected.ngo_partner} Livelihood Cohort (${selected.cohort_id})`, icon: '📋' },
    { date: '2026-01-15', title: 'Baseline Survey Captured', desc: `Recorded initial monthly income: ₹${selected.baseline_income}`, icon: '📝' },
    { date: '2026-02-20', title: 'Training Module Progress', desc: `Completed modules: ${selected.completed_modules.length > 0 ? selected.completed_modules.join(', ') : 'In Progress'}`, icon: '🎓' },
    { date: '2026-03-30', title: 'Midline (Month 3) Checkpoint', desc: `Midline income recorded: ₹${selected.month3_income} (+${Math.round(((selected.month3_income - selected.baseline_income)/selected.baseline_income)*100)}%)`, icon: '📈' },
    { date: selected.phone_type === 'Smartphone' ? '2026-04-12' : '2026-04-20', title: selected.phone_type === 'Smartphone' ? 'SDK Digital Signal Logged' : 'Field Officer Check-in', desc: selected.phone_type === 'Smartphone' ? 'Financial SMS notification & app telemetry synced' : 'Field Officer completed in-person visit', icon: selected.phone_type === 'Smartphone' ? '📱' : '👤' },
    { date: '2026-06-15', title: 'Endline (Month 6) Survey Verified', desc: `Final income: ₹${selected.current_income} (Net Delta: +${selected.income_growth_pct}%)`, icon: '✅' },
  ];

  return (
    <div className="workspace-view">
      {/* TOAST */}
      {toastMessage && (
        <div className="annotation-callout" style={{ position: 'fixed', top: '64px', right: '32px', zIndex: 100, background: 'var(--bg-page)', border: '2px solid var(--color-accent)' }}>
          <strong>AUDIT SYSTEM:</strong> {toastMessage}
        </div>
      )}

      {/* HEADER WITH PII TOGGLE & QUICK ACTION BUTTONS */}
      <div className="view-header border-box flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="heading-font">1:1 BENEFICIARY INSPECTOR</h2>
          <div className="header-meta mt-1">MODE: INDIVIDUAL RECORD & GROUND-LEVEL DIAGNOSTICS</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="btn-outline" onClick={() => setHidePII(!hidePII)}>
            {hidePII ? 'SHOW PII / NAMES' : 'HIDE PII / ANONYMIZE'}
          </button>
          <button className="btn-outline text-error" style={{ borderColor: 'var(--status-overdue)' }} onClick={() => triggerToast(`FLAG LOGGED: ${selected.beneficiary_id} sent for secondary audit`)}>
            FLAG FOR AUDIT
          </button>
        </div>
      </div>

      {/* MULTI-FACET FILTER & SEARCH PANEL (SPACING FIXED) */}
      <div className="dense-filter-panel border-box" style={{ borderTop: 'none', padding: '20px' }}>
        <div className="filter-grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: 0, gap: '16px', marginBottom: '16px' }}>
          <div className="control-group">
            <label>SEARCH ID / NAME / CITY</label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                className="control-select"
                placeholder="Type ID, Name, City..."
                value={searchQuery}
                onChange={e => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  const q = val.toLowerCase().trim();
                  if (q) {
                    const match = beneficiaries.find(b => 
                      b.beneficiary_id.toLowerCase().includes(q) || 
                      b.name.toLowerCase().includes(q) ||
                      b.city.toLowerCase().includes(q)
                    );
                    if (match) setTargetId(match.beneficiary_id);
                  }
                }}
              />
              {searchQuery && (
                <button className="btn-outline" style={{ padding: '4px 8px' }} onClick={handleClearFilters}>✕</button>
              )}
            </div>
          </div>

          <div className="control-group">
            <label>DISTRICT</label>
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
            <label>ARCHETYPE</label>
            <select className="control-select" value={archetypeFilter} onChange={e => setArchetypeFilter(e.target.value)}>
              <option value="All">All Archetypes</option>
              <option value="Standard Positive">Standard Positive</option>
              <option value="Suresh">Suresh (High Synergy)</option>
              <option value="Meena">Meena (Invisible Improver)</option>
              <option value="Renu">Renu (False Positive)</option>
              <option value="Arjun">Arjun (Road Shock)</option>
              <option value="Priya">Priya (Non-converter)</option>
              <option value="Rakesh">Rakesh (Gaming Flag)</option>
            </select>
          </div>
        </div>

        {/* TARGET BENEFICIARY SELECTOR WITH PREV / NEXT */}
        <div className="flex items-center gap-4 pt-4 border-top" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex-1 control-group">
            <label>TARGET RECORD ({filteredBeneficiaries.length} MATCHES)</label>
            <select className="control-select" value={targetId} onChange={e => setTargetId(e.target.value)}>
              {filteredBeneficiaries.map(b => (
                <option key={b.beneficiary_id} value={b.beneficiary_id}>
                  {b.beneficiary_id} | {hidePII ? '*** ANONYMIZED ***' : b.name} - {b.city}, {b.district} ({b.ngo_partner})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button 
              className="btn-outline" 
              disabled={currentIndex <= 0} 
              onClick={handlePrev}
              style={{ opacity: currentIndex <= 0 ? 0.5 : 1, padding: '6px 12px' }}
            >
              ◀ PREV
            </button>
            <span className="data-font text-xs" style={{ minWidth: '70px', textAlign: 'center' }}>
              {filteredBeneficiaries.length > 0 ? currentIndex + 1 : 0} OF {filteredBeneficiaries.length}
            </span>
            <button 
              className="btn-outline" 
              disabled={currentIndex >= filteredBeneficiaries.length - 1} 
              onClick={handleNext}
              style={{ opacity: currentIndex >= filteredBeneficiaries.length - 1 ? 0.5 : 1, padding: '6px 12px' }}
            >
              NEXT ▶
            </button>
          </div>
        </div>
      </div>

      {/* DEMOGRAPHICS & IMPACT TRAJECTORY */}
      <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
        <div className="inspector-panel border-right" style={{ padding: '24px' }}>
          <h3 className="heading-font text-sm mb-4" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
            DEMOGRAPHICS & PROFILE
          </h3>
          <div className="space-y-3">
            <div className="data-row"><span>BENEFICIARY ID</span> <strong>{selected.beneficiary_id}</strong></div>
            <div className="data-row"><span>BENEFICIARY NAME</span> <strong>{hidePII ? '*** ANONYMIZED ***' : selected.name}</strong></div>
            <div className="data-row"><span>AGE / GENDER</span> <strong>{selected.age} / {selected.gender}</strong></div>
            <div className="data-row"><span>LOCATION</span> <strong>{selected.city}, {selected.district}</strong></div>
            <div className="data-row"><span>NGO PARTNER</span> <strong>{selected.ngo_partner} ({selected.training_center})</strong></div>
            <div className="data-row"><span>COHORT WAVE</span> <strong>{selected.wave} ({selected.cohort_id})</strong></div>
            <div className="data-row"><span>OCCUPATION</span> <strong>{selected.occupation_type}</strong></div>
            <div className="data-row"><span>PHONE TYPE</span> <strong>{selected.phone_type}</strong></div>
          </div>
        </div>
        
        <div className="inspector-panel" style={{ padding: '24px' }}>
          <h3 className="heading-font text-sm mb-4" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
            IMPACT DELTA & CAPABILITY
          </h3>
          <div className="space-y-3">
            <div className="data-row"><span>BASELINE INCOME</span> <strong>₹{selected.baseline_income}/mo</strong></div>
            <div className="data-row"><span>CURRENT INCOME (M6)</span> <strong>₹{selected.current_income}/mo</strong></div>
            <div className="data-row">
              <span>GROWTH ABSOLUTE</span> 
              <strong style={{ color: selected.income_growth_abs >= 0 ? 'var(--status-done)' : 'var(--status-overdue)' }}>
                {selected.income_growth_abs >= 0 ? '+' : ''}₹{selected.income_growth_abs}
              </strong>
            </div>
            <div className="data-row">
              <span>GROWTH %</span> 
              <strong style={{ color: selected.income_growth_pct >= 0 ? 'var(--status-done)' : 'var(--status-overdue)' }}>
                {selected.income_growth_pct >= 0 ? '+' : ''}{selected.income_growth_pct}%
              </strong>
            </div>
            <div className="data-row"><span>TRAINING COMPLETION</span> <strong>{selected.training_completion_pct}%</strong></div>
            <div className="data-row"><span>DATA CONFIDENCE TIER</span> <strong style={{ textTransform: 'uppercase' }}>{selected.data_confidence_tier}</strong></div>
          </div>
        </div>
      </div>

      {/* VISUAL INCOME TRAJECTORY SPARKLINE & CAPABILITY BADGES (SPACING FIXED) */}
      <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
        <div className="chart-wrapper border-right" style={{ height: '240px', padding: '24px' }}>
          <h3 className="heading-font text-xs mb-3">INCOME TRAJECTORY (M0 → M3 → M6)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="round" tick={{ fill: 'var(--text-primary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} />
              <Tooltip cursor={{ fill: 'var(--bg-highlight)' }} />
              <Bar dataKey="income" barSize={35}>
                {trajectoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 flex flex-column justify-between">
          <h3 className="heading-font text-xs mb-3">ADOPTED CAPABILITIES & BADGES</h3>
          <div className="grid col-1 gap-4 text-xs">
            <div className="flex justify-between items-center border-bottom pb-2" style={{ borderBottomStyle: 'dotted' }}>
              <span className="font-semibold text-primary">UPI PAYMENTS</span>
              <strong style={{ color: selected.has_upi_month6 ? 'var(--status-done)' : 'var(--text-secondary)' }}>
                {selected.has_upi_month6 ? 'Active' : 'Inactive'}
              </strong>
            </div>
            <div className="flex justify-between items-center border-bottom pb-2 mt-2" style={{ borderBottomStyle: 'dotted' }}>
              <span className="font-semibold text-primary">BANK ACCOUNT</span>
              <strong style={{ color: selected.has_bank_month6 ? 'var(--status-done)' : 'var(--text-secondary)' }}>
                {selected.has_bank_month6 ? 'Connected' : 'None'}
              </strong>
            </div>
            <div className="flex justify-between items-center border-bottom pb-2 mt-2" style={{ borderBottomStyle: 'dotted' }}>
              <span className="font-semibold text-primary">DIGITAL BOOKKEEPING</span>
              <strong style={{ color: selected.has_bookkeeping_month6 ? 'var(--status-done)' : 'var(--text-secondary)' }}>
                {selected.has_bookkeeping_month6 ? 'Khatabook' : 'Manual'}
              </strong>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-primary">FORMAL CREDIT</span>
              <strong style={{ color: selected.has_credit_month6 ? 'var(--status-done)' : 'var(--text-secondary)' }}>
                {selected.has_credit_month6 ? 'MUDRA' : 'None'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* QUALITATIVE DIAGNOSTIC STORY PANEL */}
      <div className="border-box p-6" style={{ borderTop: 'none', background: 'var(--bg-highlight)' }}>
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <span className="heading-font text-xs">SCENARIO ARCHETYPE:</span>
          <span className="status-pill completed">{selected.scenario_archetype}</span>
          <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>
            Enterprise Status: {selected.business_survival_flag ? 'Active Enterprise' : 'Enterprise Inactive'}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
          <strong>QUALITATIVE DIAGNOSTIC NOTE:</strong> {getDiagnosticStory(selected.scenario_archetype, selected.name)}
        </p>
      </div>

      {/* MULTI-SIGNAL TIMELINE EVENT STREAM */}
      <div className="data-table-container border-box" style={{ borderTop: 'none' }}>
        <div className="table-header p-4 border-bottom">
          <h3 className="heading-font text-sm">MULTI-SIGNAL TIMELINE EVENT STREAM</h3>
        </div>
        <div className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {eventStream.map((evt, idx) => (
            <div key={idx} className="flex gap-4 items-start border-bottom pb-3" style={{ borderBottom: '1px dotted var(--border-subtle)' }}>
              <div style={{ fontSize: '18px', width: '28px', textAlign: 'center' }}>{evt.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <strong className="heading-font text-xs">{evt.title}</strong>
                  <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>{evt.date}</span>
                </div>
                <div className="data-font text-xs mt-1" style={{ color: 'var(--text-primary)' }}>{evt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
