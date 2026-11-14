import AgentSprite from './AgentSprite';
import { useGame } from '../context/GameContext';
import './StaffRoomScene.css';

// 12 × 9 tile map  (0=floor, 1=wall, 2=desk, 3=terminal, 4=door)
const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,2,0,0,2,0,0,2,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,2,0,0,2,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,3,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,4,1,1,1,1,4,1,1,1],
];

const TILE = 48;

const TILE_COLORS: Record<number, string> = {
  0: 'floor',
  1: 'wall',
  2: 'desk',
  3: 'terminal',
  4: 'door',
};

const WALL_DECORATIONS = [
  { x: 1, y: 0, label: '📌 STAFF NOTICE BOARD' },
  { x: 6, y: 0, label: '🗓 SCHEDULE' },
  { x: 9, y: 0, label: '📊 METRICS' },
];

export default function StaffRoomScene() {
  const { state } = useGame();
  const staffAgents = state.agents.filter(a => !a.inBreakout);

  return (
    <div
      className="room-scene staff-room"
      style={{ width: MAP[0].length * TILE, height: MAP.length * TILE }}
    >
      {/* Tile grid */}
      {MAP.map((row, ry) =>
        row.map((tile, rx) => (
          <div
            key={`${rx}-${ry}`}
            className={`tile tile-${TILE_COLORS[tile]} ${(rx + ry) % 2 === 0 ? 'even' : 'odd'}`}
            style={{ left: rx * TILE, top: ry * TILE, width: TILE, height: TILE }}
          >
            {tile === 2 && <DeskGraphic />}
            {tile === 3 && <TerminalGraphic />}
            {tile === 4 && <DoorGraphic />}
          </div>
        ))
      )}

      {/* Wall decorations */}
      {WALL_DECORATIONS.map((d, i) => (
        <div
          key={i}
          className="wall-deco"
          style={{ left: d.x * TILE + 2, top: 2, width: TILE * 2 - 4 }}
        >
          {d.label}
        </div>
      ))}

      {/* Room label */}
      <div className="room-label">STAFF ROOM</div>

      {/* Door labels */}
      <div className="door-label" style={{ left: 3 * TILE - 8, top: 8 * TILE + 2 }}>BREAKOUT A</div>
      <div className="door-label" style={{ left: 8 * TILE - 12, top: 8 * TILE + 2 }}>BREAKOUT B</div>

      {/* Agents */}
      {staffAgents.map(agent => (
        <AgentSprite key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

function DeskGraphic() {
  return (
    <svg width="48" height="48" viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', position: 'absolute', inset: 0 }}>
      {/* Desk surface */}
      <rect x="1" y="3" width="10" height="7" fill="#8b6914" rx="0.5" />
      <rect x="1" y="3" width="10" height="1.5" fill="#a07820" rx="0.5" />
      {/* Monitor */}
      <rect x="3" y="0.5" width="6" height="4" fill="#1a1a2e" rx="0.5" />
      <rect x="3.5" y="1" width="5" height="3" fill="#162040" rx="0.3" />
      {/* Screen glow */}
      <rect x="4" y="1.3" width="4" height="2.2" fill="#1e3a5f" rx="0.2" />
      <rect x="4.3" y="1.5" width="1.5" height="0.8" fill="#4a90d9" opacity="0.6" rx="0.2" />
      {/* Stand */}
      <rect x="5.5" y="4.5" width="1" height="1" fill="#555" />
      {/* Keyboard */}
      <rect x="3" y="8" width="6" height="1.5" fill="#2a2a3e" rx="0.3" />
      <rect x="3.3" y="8.3" width="0.8" height="0.5" fill="#3a3a5e" rx="0.1" />
      <rect x="4.3" y="8.3" width="0.8" height="0.5" fill="#3a3a5e" rx="0.1" />
      <rect x="5.3" y="8.3" width="0.8" height="0.5" fill="#3a3a5e" rx="0.1" />
      <rect x="6.3" y="8.3" width="0.8" height="0.5" fill="#3a3a5e" rx="0.1" />
      <rect x="7.3" y="8.3" width="0.8" height="0.5" fill="#3a3a5e" rx="0.1" />
      {/* Mouse */}
      <ellipse cx="9.5" cy="8.8" rx="0.6" ry="0.8" fill="#2a2a3e" />
      {/* Papers */}
      <rect x="1.5" y="5" width="1.5" height="2" fill="#f0f0e0" opacity="0.8" />
      <rect x="2" y="5.3" width="0.8" height="0.2" fill="#ccc" opacity="0.5" />
      <rect x="2" y="5.6" width="0.8" height="0.2" fill="#ccc" opacity="0.5" />
    </svg>
  );
}

function TerminalGraphic() {
  return (
    <svg width="48" height="48" viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', position: 'absolute', inset: 0 }}>
      {/* Main terminal body */}
      <rect x="1" y="1" width="10" height="8" fill="#1a1a2e" rx="1" />
      <rect x="1.5" y="1.5" width="9" height="7" fill="#0d0d1a" rx="0.5" />
      {/* Screen */}
      <rect x="2" y="2" width="8" height="5" fill="#0a1628" rx="0.3" />
      {/* Text lines */}
      <rect x="2.3" y="2.5" width="4" height="0.4" fill="#4a90d9" opacity="0.8" />
      <rect x="2.3" y="3.2" width="3" height="0.4" fill="#2ecc71" opacity="0.8" />
      <rect x="2.3" y="3.9" width="5" height="0.4" fill="#4a90d9" opacity="0.6" />
      <rect x="2.3" y="4.6" width="2" height="0.4" fill="#f39c12" opacity="0.8" />
      {/* Cursor blink */}
      <rect x="4.5" y="4.6" width="0.4" height="0.4" fill="#4a90d9" />
      {/* Base */}
      <rect x="4" y="9" width="4" height="1" fill="#2a2a4e" rx="0.3" />
      <rect x="3" y="9.8" width="6" height="1.5" fill="#2a2a4e" rx="0.3" />
      {/* Buttons */}
      <circle cx="2.5" cy="1.7" r="0.3" fill="#e74c3c" />
      <circle cx="3.5" cy="1.7" r="0.3" fill="#f39c12" />
      <circle cx="4.5" cy="1.7" r="0.3" fill="#2ecc71" />
    </svg>
  );
}

function DoorGraphic() {
  return (
    <svg width="48" height="48" viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', position: 'absolute', inset: 0 }}>
      {/* Door frame */}
      <rect x="1" y="0" width="10" height="12" fill="#6b3f1a" />
      {/* Door panel */}
      <rect x="2" y="0.5" width="8" height="11" fill="#8b5a2b" />
      {/* Door shine */}
      <rect x="2.5" y="1" width="3" height="10" fill="#a06030" opacity="0.3" />
      {/* Door window */}
      <rect x="3.5" y="2" width="5" height="3" fill="#87ceeb" opacity="0.7" rx="0.3" />
      <rect x="3.5" y="2" width="2.4" height="3" fill="#a8dff0" opacity="0.3" rx="0.3" />
      {/* Knob */}
      <circle cx="9" cy="6" r="0.7" fill="#d4af37" />
      <circle cx="9" cy="6" r="0.4" fill="#f0c040" />
      {/* Arrow indicator */}
      <text x="6" y="9.5" textAnchor="middle" fontSize="2.5" fill="#d4af37" fontFamily="monospace">▼</text>
    </svg>
  );
}
