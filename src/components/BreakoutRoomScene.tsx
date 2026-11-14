import AgentSprite from './AgentSprite';
import Whiteboard from './Whiteboard';
import { useGame } from '../context/GameContext';
import './StaffRoomScene.css';
import './BreakoutRoomScene.css';

export default function BreakoutRoomScene() {
  const { state } = useGame();
  const breakoutAgents = state.agents.filter(a => a.inBreakout);

  return (
    <div className="breakout-scene">
      {/* Left: Room with table and agents */}
      <div className="br-room">
        {/* Room label */}
        <div className="br-room-label">BREAKOUT ROOM</div>

        {/* Floor tiles */}
        <div className="br-floor">
          {Array.from({ length: 8 * 7 }).map((_, i) => {
            const rx = i % 8;
            const ry = Math.floor(i / 8);
            return (
              <div
                key={i}
                className={`br-tile ${(rx + ry) % 2 === 0 ? 'even' : 'odd'}`}
              />
            );
          })}
        </div>

        {/* Walls */}
        <div className="br-wall top" />
        <div className="br-wall left" />
        <div className="br-wall right" />
        <div className="br-wall bottom" />

        {/* Door */}
        <div className="br-door">
          <svg width="36" height="44" viewBox="0 0 9 11" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="0" width="9" height="11" fill="#8b5a2b" />
            <rect x="0.5" y="0.5" width="8" height="10" fill="#a06030" />
            <rect x="1" y="1" width="4" height="3" fill="#87ceeb" opacity="0.7" rx="0.3" />
            <circle cx="7.5" cy="5.5" r="0.7" fill="#d4af37" />
            <text x="4.5" y="9" textAnchor="middle" fontSize="2.5" fill="#d4af37" fontFamily="monospace">▲</text>
          </svg>
          <span className="br-door-label">TO STAFF ROOM</span>
        </div>

        {/* Conference table */}
        <div className="conference-table">
          <svg width="160" height="110" viewBox="0 0 40 27" style={{ imageRendering: 'pixelated' }}>
            {/* Table shadow */}
            <ellipse cx="20" cy="25" rx="18" ry="2.5" fill="rgba(0,0,0,0.25)" />
            {/* Table body */}
            <rect x="2" y="5" width="36" height="18" rx="3" fill="#7a5a1a" />
            {/* Table top face */}
            <rect x="2" y="4" width="36" height="5" rx="2" fill="#9a7a2a" />
            {/* Table surface */}
            <rect x="3" y="4" width="34" height="16" rx="2" fill="#8b6920" />
            {/* Wood grain */}
            <rect x="4" y="6"  width="32" height="0.5" fill="#9a7820" opacity="0.5" />
            <rect x="4" y="9"  width="32" height="0.5" fill="#9a7820" opacity="0.5" />
            <rect x="4" y="12" width="32" height="0.5" fill="#9a7820" opacity="0.5" />
            <rect x="4" y="15" width="32" height="0.5" fill="#9a7820" opacity="0.5" />
            {/* Items on table */}
            <rect x="10" y="8" width="5" height="4" fill="#f0f0e0" rx="0.5" opacity="0.9" />
            <rect x="10.5" y="8.5" width="3" height="0.4" fill="#ccc" opacity="0.6" />
            <rect x="10.5" y="9.2" width="4" height="0.4" fill="#ccc" opacity="0.6" />
            <rect x="10.5" y="9.9" width="2.5" height="0.4" fill="#ccc" opacity="0.6" />
            {/* Laptop */}
            <rect x="22" y="7" width="7" height="5" fill="#1a1a2e" rx="0.5" />
            <rect x="22.5" y="7.5" width="6" height="4" fill="#0d2040" rx="0.3" />
            <rect x="23" y="8" width="5" height="3" fill="#1e3a5f" rx="0.2" />
            <rect x="23.3" y="8.3" width="1.5" height="0.6" fill="#4a90d9" opacity="0.7" />
            {/* Coffee cups */}
            <rect x="7" y="13" width="2" height="2.5" fill="#8b4513" rx="0.3" />
            <rect x="7" y="13" width="2" height="0.8" fill="#d4762a" rx="0.3" />
            <rect x="30" y="13" width="2" height="2.5" fill="#8b4513" rx="0.3" />
            <rect x="30" y="13" width="2" height="0.8" fill="#d4762a" rx="0.3" />
          </svg>
        </div>

        {/* Chairs around table */}
        {[
          { x: 140, y: 80,  rotate: 0   },
          { x: 60,  y: 140, rotate: 90  },
          { x: 280, y: 140, rotate: -90 },
          { x: 100, y: 210, rotate: 180 },
          { x: 220, y: 210, rotate: 180 },
        ].map((c, i) => (
          <div
            key={i}
            className="chair"
            style={{ left: c.x, top: c.y, transform: `rotate(${c.rotate}deg)` }}
          />
        ))}

        {/* Agents */}
        {breakoutAgents.map(agent => (
          <AgentSprite key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Right: Whiteboard */}
      <div className="br-whiteboard-panel">
        <Whiteboard entries={state.whiteboardEntries} />

        {/* File transfer animation */}
        {breakoutAgents.some(a => a.status === 'working') && (
          <div className="file-exchange">
            <div className="fe-label">📁 Sharing files…</div>
            <div className="fe-files">
              {['research.md', 'impl.ts', 'design.fig'].map((f, i) => (
                <div key={f} className="fe-file" style={{ animationDelay: `${i * 0.4}s` }}>
                  <span className="fe-icon">📄</span>
                  <span className="fe-name">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
