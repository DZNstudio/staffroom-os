import { useState } from 'react';
import { useGame } from '../context/GameContext';
import './AddAgentModal.css';

const PRESET_COLORS = [
  { color: '#e74c3c', hat: '#c0392b', label: 'Red'    },
  { color: '#3498db', hat: '#2980b9', label: 'Blue'   },
  { color: '#2ecc71', hat: '#27ae60', label: 'Green'  },
  { color: '#9b59b6', hat: '#8e44ad', label: 'Purple' },
  { color: '#f39c12', hat: '#d68910', label: 'Orange' },
  { color: '#1abc9c', hat: '#17a589', label: 'Teal'   },
  { color: '#e67e22', hat: '#ca6f1e', label: 'Amber'  },
  { color: '#e91e63', hat: '#c2185b', label: 'Pink'   },
];

const PRESET_ROLES = ['Researcher', 'Developer', 'Designer', 'Analyst', 'Writer', 'Strategist', 'QA Tester', 'PM'];

interface Props {
  onClose: () => void;
}

export default function AddAgentModal({ onClose }: Props) {
  const { dispatch, state } = useGame();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Researcher');
  const [colorIdx, setColorIdx] = useState(0);

  const handleAdd = () => {
    if (!name.trim()) return;
    const { color, hat } = PRESET_COLORS[colorIdx];
    dispatch({ type: 'ADD_AGENT', payload: { name: name.trim(), role, color, hatColor: hat } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">+ NEW AGENT</div>

        <div className="modal-field">
          <label>NAME</label>
          <input
            className="modal-input"
            placeholder="e.g. Zeta"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
            maxLength={12}
          />
        </div>

        <div className="modal-field">
          <label>ROLE</label>
          <div className="role-pills">
            {PRESET_ROLES.map(r => (
              <button
                key={r}
                className={`role-pill ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-field">
          <label>COLOR</label>
          <div className="color-swatches">
            {PRESET_COLORS.map((c, i) => (
              <button
                key={i}
                className={`swatch ${colorIdx === i ? 'selected' : ''}`}
                style={{ background: c.color }}
                onClick={() => setColorIdx(i)}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="modal-preview">
          <svg width="48" height="60" viewBox="0 0 8 10" style={{ imageRendering: 'pixelated' }}>
            <rect x="2" y="0" width="4" height="1" fill={PRESET_COLORS[colorIdx].hat} />
            <rect x="1" y="1" width="6" height="1" fill={PRESET_COLORS[colorIdx].hat} />
            <rect x="1" y="1" width="6" height="4" fill="#f0c08a" />
            <rect x="2" y="2.5" width="1.2" height="1.2" fill="#1a1030" />
            <rect x="4.8" y="2.5" width="1.2" height="1.2" fill="#1a1030" />
            <rect x="2.8" y="4.2" width="2.4" height="0.6" rx="0.3" fill="#c0392b" />
            <rect x="1.5" y="5" width="5" height="3" fill={PRESET_COLORS[colorIdx].color} />
            <rect x="3" y="5" width="2" height="1" fill="#f0f0e8" />
            <rect x="0.2" y="5" width="1.3" height="2.5" rx="0.4" fill="#f0c08a" />
            <rect x="6.5" y="5" width="1.3" height="2.5" rx="0.4" fill="#f0c08a" />
            <rect x="1.5" y="8" width="2" height="2" rx="0.3" fill="#2c3e50" />
            <rect x="4.5" y="8" width="2" height="2" rx="0.3" fill="#2c3e50" />
          </svg>
          <div className="preview-name" style={{ color: PRESET_COLORS[colorIdx].color }}>
            {name || '???'}
          </div>
          <div className="preview-role">{role}</div>
        </div>

        <div className="modal-agent-count">
          {state.agents.length}/8 agents
        </div>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>CANCEL</button>
          <button
            className="modal-confirm"
            onClick={handleAdd}
            disabled={!name.trim() || state.agents.length >= 8}
          >
            ADD AGENT
          </button>
        </div>
      </div>
    </div>
  );
}
