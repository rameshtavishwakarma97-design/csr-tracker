import React, { useState, useMemo } from 'react';
import mockData from '../data/mock_data.json';
import './Pages.css';

export function FieldOps({ onInspectBeneficiary }) {
  const beneficiaries = mockData.beneficiaries;
  
  // State
  const [selectedWave, setSelectedWave] = useState('Wave 1');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, Completed, Pending, Overdue
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  const PAGE_SIZE = 10;

  // Field Officer Assignee Lookup table for realism
  const officerNames = ['Officer Ramesh (Pune)', 'Officer Priya (Nashik)', 'Officer Suresh (Aurangabad)', 'Officer Vikas (Nagpur)'];
  const getOfficer = (district) => {
    if (district === 'Pune') return 'Officer Ramesh';
    if (district === 'Nashik') return 'Officer Priya';
    if (district === 'Aurangabad') return 'Officer Suresh';
    return 'Officer Vikas';
  };

  // Cohort Stats
  const cohortBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => b.wave === selectedWave);
  }, [beneficiaries, selectedWave]);

  const stats = useMemo(() => {
    const total = cohortBeneficiaries.length;
    const completed = cohortBeneficiaries.filter(b => b.survey_status === 'Completed').length;
    const pending = cohortBeneficiaries.filter(b => b.survey_status === 'Pending').length;
    const overdue = cohortBeneficiaries.filter(b => b.survey_status === 'Overdue').length;
    return { total, completed, pending, overdue };
  }, [cohortBeneficiaries]);

  // Filtered Roster
  const filteredList = useMemo(() => {
    return cohortBeneficiaries.filter(b => {
      // Status Filter
      if (statusFilter !== 'ALL' && b.survey_status !== statusFilter) return false;
      
      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesId = b.beneficiary_id.toLowerCase().includes(q);
        const matchesNgo = b.ngo_partner.toLowerCase().includes(q);
        const matchesDist = b.district.toLowerCase().includes(q);
        const matchesCity = b.city.toLowerCase().includes(q);
        if (!matchesId && !matchesNgo && !matchesDist && !matchesCity) return false;
      }

      return true;
    });
  }, [cohortBeneficiaries, statusFilter, searchQuery]);

  // Paginated List
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredList.slice(start, start + PAGE_SIZE);
  }, [filteredList, currentPage]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePing = (b) => {
    const officer = getOfficer(b.district);
    triggerToast(`Alert dispatched to ${officer} for ${b.beneficiary_id}`);
  };

  return (
    <div className="workspace-view">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="annotation-callout" style={{ position: 'fixed', top: '64px', right: '32px', zIndex: 100, background: 'var(--bg-page)', border: '2px solid var(--color-accent)', color: 'var(--text-primary)' }}>
          <strong>System Notification:</strong> {toastMessage}
        </div>
      )}

      {/* HEADER WITH COHORT SELECTOR */}
      <div className="view-header border-box flex justify-between items-center">
        <div>
          <h2 className="heading-font">SURVEY COMMAND CENTER</h2>
          <div className="header-meta mt-1">OPERATIONAL ROSTER & FIELD OFFICER DISPATCH</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs data-font" style={{ color: 'var(--text-secondary)' }}>COHORT WAVE:</label>
          <select 
            className="control-select" 
            value={selectedWave} 
            onChange={e => { setSelectedWave(e.target.value); setCurrentPage(1); }}
            style={{ width: '160px' }}
          >
            <option value="Wave 1">Wave 1 (Trained)</option>
            <option value="Wave 2">Wave 2 (Control)</option>
          </select>
        </div>
      </div>

      {/* METRIC PANELS */}
      <div className="grid col-2 gap-0 border-box" style={{ borderTop: 'none' }}>
        <div className="metric-panel border-right">
          <div className="metric-label">TOTAL ASSIGNED BENCHMARK</div>
          <div className="metric-value">{stats.total}</div>
        </div>
        <div className="metric-panel">
          <div className="metric-label">COMPLETION RATE</div>
          <div className="metric-value text-accent">{stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%</div>
        </div>
      </div>

      {/* INTERACTIVE PROGRESS BAR CARDS */}
      <div className="progress-container border-box" style={{ borderTop: 'none', padding: '24px' }}>
        <div className="progress-labels flex justify-between mb-2">
          <button 
            className="btn-link" 
            onClick={() => { setStatusFilter('Completed'); setCurrentPage(1); }}
            style={{ color: statusFilter === 'Completed' ? 'var(--status-done)' : 'var(--text-primary)', fontWeight: statusFilter === 'Completed' ? 700 : 400 }}
          >
            ● {stats.completed} COMPLETED
          </button>
          <button 
            className="btn-link" 
            onClick={() => { setStatusFilter('Pending'); setCurrentPage(1); }}
            style={{ color: statusFilter === 'Pending' ? 'var(--status-pending)' : 'var(--text-primary)', fontWeight: statusFilter === 'Pending' ? 700 : 400 }}
          >
            ● {stats.pending} PENDING
          </button>
          <button 
            className="btn-link" 
            onClick={() => { setStatusFilter('Overdue'); setCurrentPage(1); }}
            style={{ color: statusFilter === 'Overdue' ? 'var(--status-overdue)' : 'var(--text-primary)', fontWeight: statusFilter === 'Overdue' ? 700 : 400 }}
          >
            ● {stats.overdue} OVERDUE
          </button>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill bg-done" 
            style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%`, cursor: 'pointer' }} 
            onClick={() => { setStatusFilter('Completed'); setCurrentPage(1); }}
            title="Filter by Completed"
          />
          <div 
            className="progress-fill bg-pending" 
            style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%`, cursor: 'pointer' }} 
            onClick={() => { setStatusFilter('Pending'); setCurrentPage(1); }}
            title="Filter by Pending"
          />
          <div 
            className="progress-fill bg-overdue" 
            style={{ width: `${stats.total ? (stats.overdue / stats.total) * 100 : 0}%`, cursor: 'pointer' }} 
            onClick={() => { setStatusFilter('Overdue'); setCurrentPage(1); }}
            title="Filter by Overdue"
          />
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="data-table-container mt-8 border-box">
        <div className="table-header flex justify-between items-center p-4 border-bottom flex-wrap gap-4" style={{ background: 'var(--bg-highlight)' }}>
          <div className="flex items-center gap-2">
            <span className="heading-font text-xs">STATUS FILTER:</span>
            {['ALL', 'Completed', 'Pending', 'Overdue'].map(f => (
              <button
                key={f}
                className={`btn-outline ${statusFilter === f ? 'bg-active' : ''}`}
                onClick={() => { setStatusFilter(f); setCurrentPage(1); }}
                style={{ 
                  borderColor: statusFilter === f ? 'var(--border-default)' : 'var(--border-subtle)',
                  fontWeight: statusFilter === f ? 700 : 400,
                  fontSize: '11px',
                  padding: '4px 8px'
                }}
              >
                {f.toUpperCase()} {f === 'ALL' ? `(${stats.total})` : f === 'Completed' ? `(${stats.completed})` : f === 'Pending' ? `(${stats.pending})` : `(${stats.overdue})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              className="control-select"
              placeholder="Search ID, NGO, District..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ width: '220px', padding: '4px 8px' }}
            />
          </div>
        </div>

        {/* ROSTER TABLE */}
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>BENEFICIARY ID</th>
              <th>NGO PARTNER</th>
              <th>DISTRICT / CITY</th>
              <th>ASSIGNED OFFICER</th>
              <th>PHONE TYPE</th>
              <th>SURVEY STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map(b => (
                <tr key={b.beneficiary_id}>
                  <td><strong>{b.beneficiary_id}</strong></td>
                  <td>{b.ngo_partner}</td>
                  <td>{b.district} ({b.city})</td>
                  <td><span className="data-font text-xs">{getOfficer(b.district)}</span></td>
                  <td>{b.phone_type}</td>
                  <td>
                    <span className={`status-pill ${b.survey_status.toLowerCase()}`}>
                      {b.survey_status}
                    </span>
                  </td>
                  <td>
                    {b.survey_status === 'Completed' ? (
                      <button 
                        className="btn-outline" 
                        style={{ fontSize: '10px', padding: '2px 6px', color: 'var(--color-accent)' }}
                        onClick={() => onInspectBeneficiary && onInspectBeneficiary(b.beneficiary_id)}
                      >
                        Inspect
                      </button>
                    ) : (
                      <button 
                        className="btn-link" 
                        style={{ color: b.survey_status === 'Overdue' ? 'var(--status-overdue)' : 'var(--status-pending)' }}
                        onClick={() => handlePing(b)}
                      >
                        Ping Officer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No matching beneficiary records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
        <div className="table-footer p-4 border-top flex justify-between items-center" style={{ borderTop: '1px solid var(--border-default)', fontSize: '12px' }}>
          <span className="data-font text-xs" style={{ color: 'var(--text-secondary)' }}>
            Showing {filteredList.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0} - {Math.min(currentPage * PAGE_SIZE, filteredList.length)} of {filteredList.length} records
          </span>
          <div className="flex items-center gap-2">
            <button 
              className="btn-outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              ◀ PREV
            </button>
            <span className="data-font text-xs">PAGE {currentPage} OF {totalPages}</span>
            <button 
              className="btn-outline" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              NEXT ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
