import { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import AddAgentModal from './AddAgentModal';
import './DialogBox.css';

export default function DialogBox() {
  const { state, dispatch, submitPrompt } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const isIdle = state.phase === 'idle';

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.dialogLines]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitPrompt();
  };

  return (
    <>
      <div className="dialog-box">
        {/* Phase indicator */}
        <div className="dialog-phase">
          <span className={`phase-dot phase-${state.phase}`} />
          <span className="phase-label">{PHASE_LABELS[state.phase]}</span>
          <div className="phase-agents">
            {state.agents.map(a => (
              <span
                key={a.id}
                className={`agent-pip ${a.status}`}
                style={{ background: a.color }}
                title={`${a.name}, ${a.status}`}
              />
            ))}
          </div>
        </div>

        {/* Dialog log */}
        <div className="dialog-log" ref={logRef}>
          {state.dialogLines.map((line, i) => (
            <div key={i} className="dialog-line">
              <span className="dl-arrow">▶</span>
              {line}
            </div>
          ))}
        </div>

        {/* Prompt input */}
        <div className={`dialog-input-row ${!isIdle ? 'locked' : ''}`}>
          <span className="di-prompt">{isIdle ? '>' : '⏳'}</span>
          <input
            ref={inputRef}
            className="di-input"
            type="text"
            placeholder={isIdle ? 'Assign a task to your agents…' : 'Agents are working…'}
            value={state.prompt}
            disabled={!isIdle}
            onChange={e => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
            onKeyDown={handleKey}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="di-send"
            onClick={submitPrompt}
            disabled={!isIdle || !state.prompt.trim()}
          >
            SEND
          </button>
          <button
            className="di-add"
            onClick={() => setShowAddAgent(true)}
            title="Add Agent"
          >
            + AGENT
          </button>
        </div>
      </div>

      {showAddAgent && <AddAgentModal onClose={() => setShowAddAgent(false)} />}
    </>
  );
}

const PHASE_LABELS: Record<string, string> = {
  idle:          '● READY',
  dispatching:   '◎ DISPATCHING',
  walking_out:   '→ HEADING OUT',
  in_breakout:   '⚑ IN BREAKOUT',
  collaborating: '⚙ COLLABORATING',
  walking_back:  '← RETURNING',
  reporting:     '✓ REPORTING',
};
