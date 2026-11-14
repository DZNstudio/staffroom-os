import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import StaffRoomScene from './components/StaffRoomScene';
import BreakoutRoomScene from './components/BreakoutRoomScene';
import DialogBox from './components/DialogBox';
import './App.css';

// ─── OS Shell tabs ────────────────────────────────────────────────────────────
const ALL_TABS = [
  { id: 'staffroom', label: '🏢 Staff Room' },
  { id: 'files',     label: '📁 Files' },
  { id: 'settings',  label: '⚙ Settings' },
];

function AppInner() {
  const [activeTab, setActiveTab] = useState('staffroom');
  const { state } = useGame();

  return (
    <div className="os-shell">
      {/* Title bar */}
      <div className="os-titlebar">
        <div className="os-traffic">
          <div className="os-btn red"   />
          <div className="os-btn yellow" />
          <div className="os-btn green"  />
        </div>
        <div className="os-title">StaffRoom OS  <span className="os-version">v0.1</span></div>
        <div className="os-clock">
          <Clock />
        </div>
      </div>

      {/* Tab bar */}
      <div className="os-tabbar">
        {ALL_TABS.map(tab => (
          <button
            key={tab.id}
            className={`os-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'staffroom' && state.phase !== 'idle' && (
              <span className="tab-badge">●</span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="os-content">
        {activeTab === 'staffroom' && <StaffRoomTab />}
        {activeTab === 'files'     && <PlaceholderTab title="Files" icon="📁" desc="File system coming soon." />}
        {activeTab === 'settings'  && <PlaceholderTab title="Settings" icon="⚙" desc="System settings coming soon." />}
      </div>

      {/* Status bar */}
      <div className="os-statusbar">
        <span className="sb-item">
          <span className="sb-dot" style={{ background: state.phase === 'idle' ? '#2ecc71' : '#f39c12' }} />
          {state.phase === 'idle' ? 'System Ready' : 'Task Running'}
        </span>
        <span className="sb-item">{state.agents.length} Agents</span>
        <span className="sb-item">StaffRoom OS</span>
      </div>
    </div>
  );
}

// ─── Staff Room tab ───────────────────────────────────────────────────────────
function StaffRoomTab() {
  const { state } = useGame();
  const isBreakout = state.currentView === 'breakout';

  return (
    <div className="staffroom-tab">
      {/* Room view with transition */}
      <div className={`room-viewport ${state.transitioning ? 'fading' : ''}`}>
        {/* Scanline overlay */}
        <div className="scanlines" />

        {/* Room content */}
        <div className="room-wrapper">
          {isBreakout
            ? <BreakoutRoomScene />
            : <StaffRoomScene />
          }
        </div>

        {/* Transition overlay */}
        {state.transitioning && <div className="transition-overlay" />}
      </div>

      {/* Dialog / prompt */}
      <DialogBox />
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
function PlaceholderTab({ title, icon, desc }: { title: string; icon: string; desc: string }) {
  return (
    <div className="placeholder-tab">
      <div className="ph-icon">{icon}</div>
      <div className="ph-title">{title}</div>
      <div className="ph-desc">{desc}</div>
    </div>
  );
}

// ─── Clock ────────────────────────────────────────────────────────────────────

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="clock">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

// ─── Root with provider ───────────────────────────────────────────────────────
export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
