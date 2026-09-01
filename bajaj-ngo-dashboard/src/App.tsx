import React, { useState, useEffect } from 'react';
import {
  ChartBar, Users, Broadcast, CurrencyInr, Storefront,
  ShieldCheck, DeviceMobile, Bank, ArrowsLeftRight, Globe,
  Buildings, ChartLine, Funnel, X, List
} from '@phosphor-icons/react';

import { ProgramOverview } from './pages/ProgramOverview';
import { BaselineProfile } from './pages/BaselineProfile';
import { TrainingEarlySignals } from './pages/TrainingEarlySignals';
import { IncomeChange } from './pages/IncomeChange';
import { Entrepreneurship } from './pages/Entrepreneurship';
import { BusinessSustainability } from './pages/BusinessSustainability';
import { DigitalAdoption } from './pages/DigitalAdoption';
import { FinancialAccess } from './pages/FinancialAccess';
import { PrePostSummary } from './pages/PrePostSummary';
import { GeographicComparison } from './pages/GeographicComparison';
import { NGOPerformance } from './pages/NGOPerformance';
import { TrainingVsOutcome } from './pages/TrainingVsOutcome';

type ScreenId =
  | 'overview' | 'baseline' | 'training'
  | 'income' | 'entrepreneurship' | 'sustainability'
  | 'digital' | 'financial' | 'prepost'
  | 'geographic' | 'ngo' | 'training-outcome';

interface NavItem {
  id: ScreenId;
  label: string;
  short: string; // short label for bottom nav on mobile
  icon: React.ElementType;
  phase: 1 | 2 | 3 | 0;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',         label: 'Program Overview',         short: 'Overview',    icon: ChartBar,        phase: 0 },
  { id: 'baseline',         label: 'Baseline Profile',         short: 'Baseline',    icon: Users,           phase: 1 },
  { id: 'training',         label: 'Training & Early Signals', short: 'Training',    icon: Broadcast,       phase: 2 },
  { id: 'income',           label: 'Income Change',            short: 'Income',      icon: CurrencyInr,     phase: 3 },
  { id: 'entrepreneurship', label: 'Entrepreneurship',         short: 'Entrepren.',  icon: Storefront,      phase: 3 },
  { id: 'sustainability',   label: 'Business Sustainability',  short: 'Survival',    icon: ShieldCheck,     phase: 3 },
  { id: 'digital',          label: 'Digital Adoption',         short: 'Digital',     icon: DeviceMobile,    phase: 3 },
  { id: 'financial',        label: 'Financial Access',         short: 'Finance',     icon: Bank,            phase: 3 },
  { id: 'prepost',          label: 'Pre / Post Summary',       short: 'Summary',     icon: ArrowsLeftRight, phase: 3 },
  { id: 'geographic',       label: 'Geographic Comparison',    short: 'Geo',         icon: Globe,           phase: 3 },
  { id: 'ngo',              label: 'NGO Performance',          short: 'NGOs',        icon: Buildings,       phase: 3 },
  { id: 'training-outcome', label: 'Training vs Outcome',      short: 'vs Outcome',  icon: ChartLine,       phase: 3 },
];

const PHASE_LABELS: Record<number, string> = {
  0: 'All Phases',
  1: 'Phase 1 — Who Is In the Program',
  2: 'Phase 2 — During Skilling',
  3: 'Phase 3 — What Changed',
};

const PHASE_COLORS: Record<number, string> = { 0: '#4a5568', 1: '#6b7a93', 2: '#1a84c4', 3: '#0c0f14' };

const GEO_FILTERS    = ['All Geographies', 'Maharashtra', 'Madhya Pradesh'];
const NGO_FILTERS    = ['All Partners', 'Pratham Foundation', 'Smile Foundation', 'Magic Bus', 'Goonj'];

// ─── Breakpoint hook ─────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const isMobile = useIsMobile();
  const [activeId,     setActiveId]     = useState<ScreenId>('overview');
  const [geo,          setGeo]          = useState('All Geographies');
  const [ngo,          setNgo]          = useState('All Partners');
  const [sidebarOpen,  setSidebarOpen]  = useState(!isMobile); // closed by default on mobile

  // Close sidebar when entering mobile, open when leaving
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close sidebar on nav click on mobile
  const handleNavClick = (id: ScreenId) => {
    setActiveId(id);
    if (isMobile) setSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activeId) {
      case 'overview':         return <ProgramOverview />;
      case 'baseline':         return <BaselineProfile />;
      case 'training':         return <TrainingEarlySignals />;
      case 'income':           return <IncomeChange />;
      case 'entrepreneurship': return <Entrepreneurship />;
      case 'sustainability':   return <BusinessSustainability />;
      case 'digital':          return <DigitalAdoption />;
      case 'financial':        return <FinancialAccess />;
      case 'prepost':          return <PrePostSummary />;
      case 'geographic':       return <GeographicComparison />;
      case 'ngo':              return <NGOPerformance />;
      case 'training-outcome': return <TrainingVsOutcome />;
      default:                 return <ProgramOverview />;
    }
  };

  const grouped: Record<number, NavItem[]> = { 0: [], 1: [], 2: [], 3: [] };
  NAV_ITEMS.forEach(item => grouped[item.phase].push(item));

  const activeItem = NAV_ITEMS.find(n => n.id === activeId);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* ── Mobile overlay backdrop ────────────────────────────────────────── */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? 248 : 0,
        minWidth: sidebarOpen ? 248 : 0,
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #dde4ef',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 20,
      }}>
        {/* Logotype */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #dde4ef', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: '#0c0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, background: '#1a84c4' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.01em', color: '#0c0f14', lineHeight: 1.1 }}>Bajaj Finserv</div>
              <div style={{ fontSize: 10, fontWeight: 500, color: '#6b7a93', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Impact Intelligence</div>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6b7a93' }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {([0, 1, 2, 3] as const).map(phase => (
            <div key={phase}>
              {phase > 0 && (
                <div style={{ padding: '16px 20px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: PHASE_COLORS[phase], flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f9cb4' }}>
                    {PHASE_LABELS[phase]}
                  </span>
                </div>
              )}
              {grouped[phase].map(item => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <div key={item.id} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => handleNavClick(item.id)}>
                    <Icon size={15} weight={isActive ? 'fill' : 'regular'} style={{ flexShrink: 0, color: isActive ? '#1a84c4' : '#8f9cb4' }} />
                    <span style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  </div>
                );
              })}
              {phase < 3 && <div className="divider" style={{ margin: '8px 20px' }} />}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #dde4ef', flexShrink: 0 }}>
          <div className="label" style={{ marginBottom: 3 }}>Data as of</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0c0f14' }}>Q3 2024 · Sep 01</div>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top Bar */}
        <header style={{
          height: 52,
          borderBottom: '1px solid #dde4ef',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}>
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: '1px solid #dde4ef', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            aria-label="Toggle sidebar"
          >
            <List size={16} style={{ color: '#4a5568' }} />
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 11, color: '#8f9cb4', flexShrink: 0 }} className="desktop-only">
              Impact Intelligence
            </span>
            <span style={{ color: '#dde4ef', flexShrink: 0 }} className="desktop-only">/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0c0f14', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeItem?.label}
            </span>
          </div>

          {/* Filters — hidden on smallest screens, visible from sm */}
          <div className="desktop-only" style={{ gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <Funnel size={11} style={{ color: '#8f9cb4' }} />
            <select
              value={geo}
              onChange={e => setGeo(e.target.value)}
              style={selectStyle}
            >
              {GEO_FILTERS.map(f => <option key={f}>{f}</option>)}
            </select>
            <select
              value={ngo}
              onChange={e => setNgo(e.target.value)}
              style={selectStyle}
            >
              {NGO_FILTERS.map(f => <option key={f}>{f}</option>)}
            </select>
            {(geo !== 'All Geographies' || ngo !== 'All Partners') && (
              <button
                onClick={() => { setGeo('All Geographies'); setNgo('All Partners'); }}
                style={{ background: 'none', border: '1px solid #dde4ef', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7a93', fontFamily: 'Cabinet Grotesk' }}
              >
                <X size={9} /> Clear
              </button>
            )}
          </div>
        </header>

        {/* Mobile filter strip — only shown on mobile when filters are active */}
        {isMobile && (
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #dde4ef', background: '#fff', display: 'flex', gap: 8, overflowX: 'auto' }}>
            <select value={geo} onChange={e => setGeo(e.target.value)} style={{ ...selectStyle, fontSize: 11 }}>
              {GEO_FILTERS.map(f => <option key={f}>{f}</option>)}
            </select>
            <select value={ngo} onChange={e => setNgo(e.target.value)} style={{ ...selectStyle, fontSize: 11 }}>
              {NGO_FILTERS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        )}

        {/* Active filters banner */}
        {(geo !== 'All Geographies' || ngo !== 'All Partners') && (
          <div style={{
            display: 'flex', gap: 8, padding: '8px 16px',
            background: 'rgba(26,132,196,0.06)', borderBottom: '1px solid rgba(26,132,196,0.15)',
            alignItems: 'center', flexWrap: 'wrap',
          }}>
            <Funnel size={11} style={{ color: '#1a84c4', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#0a4f7c', fontWeight: 500 }}>Filtered:</span>
            {geo !== 'All Geographies' && (
              <span style={{ fontSize: 11, background: '#0c0f14', color: '#fff', padding: '2px 8px', fontWeight: 600 }}>{geo}</span>
            )}
            {ngo !== 'All Partners' && (
              <span style={{ fontSize: 11, background: '#1a84c4', color: '#fff', padding: '2px 8px', fontWeight: 600 }}>{ngo}</span>
            )}
          </div>
        )}

        {/* Page Content */}
        <main className="page-content" style={{ maxWidth: 1400, width: '100%', margin: '0 auto', flex: 1 }}>
          {renderPage()}
        </main>

        {/* Bottom Quick-Nav */}
        <div style={{
          borderTop: '1px solid #dde4ef',
          background: '#fff',
          display: 'flex',
          overflowX: 'auto',
          flexShrink: 0,
          position: isMobile ? 'sticky' : 'static',
          bottom: 0,
          zIndex: 9,
        }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  padding: isMobile ? '8px 14px' : '8px 16px',
                  background: 'none',
                  border: 'none',
                  borderTop: isActive ? '2px solid #1a84c4' : '2px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? '#0c0f14' : '#8f9cb4',
                  fontFamily: 'Cabinet Grotesk',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s, border-color 0.15s',
                  flexShrink: 0,
                }}
              >
                <Icon size={isMobile ? 16 : 13} weight={isActive ? 'fill' : 'regular'} style={{ color: isActive ? '#1a84c4' : '#b8c3d5' }} />
                <span style={{ fontSize: isMobile ? 9 : 10, letterSpacing: '0.04em' }}>
                  {isMobile ? item.short : item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, color: '#0c0f14',
  background: '#f8f9fc', border: '1px solid #dde4ef',
  padding: '5px 28px 5px 10px', appearance: 'none',
  fontFamily: 'Cabinet Grotesk', cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7a93'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
};

export default App;
