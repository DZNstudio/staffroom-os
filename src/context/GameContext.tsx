import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from 'react';
import type { GameState, Agent, GamePhase, RoomView, WhiteboardEntry } from '../types';

// ─── Default agents ───────────────────────────────────────────────────────────

const T = 48; // tile size in px

export const STAFF_DESK_POSITIONS = [
  { x: 2 * T + 8, y: 2 * T + 4 },
  { x: 5 * T + 8, y: 2 * T + 4 },
  { x: 8 * T + 8, y: 2 * T + 4 },
  { x: 2 * T + 8, y: 4 * T + 4 },
  { x: 5 * T + 8, y: 4 * T + 4 },
];

export const BREAKOUT_SEAT_POSITIONS = [
  { x: 190, y: 90 },
  { x: 80,  y: 190 },
  { x: 300, y: 190 },
  { x: 135, y: 290 },
  { x: 245, y: 290 },
];

const DEFAULT_AGENTS: Agent[] = [
  { id: 'alpha',   name: 'Alpha',   role: 'Team Lead',   color: '#e74c3c', hatColor: '#c0392b', position: STAFF_DESK_POSITIONS[0], status: 'idle', speech: null, inBreakout: false, animOffset: 0   },
  { id: 'beta',    name: 'Beta',    role: 'Researcher',  color: '#3498db', hatColor: '#2980b9', position: STAFF_DESK_POSITIONS[1], status: 'idle', speech: null, inBreakout: false, animOffset: 200 },
  { id: 'gamma',   name: 'Gamma',   role: 'Developer',   color: '#2ecc71', hatColor: '#27ae60', position: STAFF_DESK_POSITIONS[2], status: 'idle', speech: null, inBreakout: false, animOffset: 400 },
  { id: 'delta',   name: 'Delta',   role: 'Designer',    color: '#9b59b6', hatColor: '#8e44ad', position: STAFF_DESK_POSITIONS[3], status: 'idle', speech: null, inBreakout: false, animOffset: 100 },
  { id: 'epsilon', name: 'Epsilon', role: 'Analyst',     color: '#f39c12', hatColor: '#d68910', position: STAFF_DESK_POSITIONS[4], status: 'idle', speech: null, inBreakout: false, animOffset: 300 },
];

// ─── State & reducer ──────────────────────────────────────────────────────────

const INITIAL_STATE: GameState = {
  phase: 'idle',
  currentView: 'staff',
  agents: DEFAULT_AGENTS,
  prompt: '',
  dialogLines: ['Welcome to StaffRoom!', 'Type a task below and hit Send.'],
  whiteboardEntries: [],
  fileTransfers: [],
  transitioning: false,
};

type Action =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SET_VIEW'; payload: RoomView }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'UPDATE_AGENT'; payload: Partial<Agent> & { id: string } }
  | { type: 'ADD_DIALOG'; payload: string }
  | { type: 'CLEAR_DIALOG' }
  | { type: 'ADD_WHITEBOARD'; payload: WhiteboardEntry }
  | { type: 'CLEAR_WHITEBOARD' }
  | { type: 'ADD_AGENT'; payload: { name: string; role: string; color: string; hatColor: string } }
  | { type: 'REMOVE_AGENT'; payload: string }
  | { type: 'RENAME_AGENT'; payload: { id: string; name: string; role: string } };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_PROMPT':      return { ...state, prompt: action.payload };
    case 'SET_PHASE':       return { ...state, phase: action.payload };
    case 'SET_VIEW':        return { ...state, currentView: action.payload };
    case 'SET_TRANSITIONING': return { ...state, transitioning: action.payload };
    case 'UPDATE_AGENT':
      return { ...state, agents: state.agents.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a) };
    case 'ADD_DIALOG':
      return { ...state, dialogLines: [...state.dialogLines.slice(-6), action.payload] };
    case 'CLEAR_DIALOG':
      return { ...state, dialogLines: [] };
    case 'ADD_WHITEBOARD':
      return { ...state, whiteboardEntries: [...state.whiteboardEntries, action.payload] };
    case 'CLEAR_WHITEBOARD':
      return { ...state, whiteboardEntries: [] };
    case 'ADD_AGENT': {
      const idx = state.agents.length % STAFF_DESK_POSITIONS.length;
      const pos = STAFF_DESK_POSITIONS[idx] ?? { x: 3 * T, y: 6 * T };
      const id = `agent_${Date.now()}`;
      const newAgent: Agent = {
        id, name: action.payload.name, role: action.payload.role,
        color: action.payload.color, hatColor: action.payload.hatColor,
        position: { ...pos }, status: 'idle', speech: null,
        inBreakout: false, animOffset: Math.random() * 600,
      };
      return { ...state, agents: [...state.agents, newAgent] };
    }
    case 'REMOVE_AGENT':
      return { ...state, agents: state.agents.filter(a => a.id !== action.payload) };
    case 'RENAME_AGENT':
      return { ...state, agents: state.agents.map(a => a.id === action.payload.id ? { ...a, name: action.payload.name, role: action.payload.role } : a) };
    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  submitPrompt: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const submitPrompt = useCallback(() => {
    const prompt = stateRef.current.prompt.trim();
    if (!prompt || stateRef.current.phase !== 'idle') return;

    dispatch({ type: 'SET_PHASE', payload: 'dispatching' });
    dispatch({ type: 'CLEAR_WHITEBOARD' });
    dispatch({ type: 'CLEAR_DIALOG' });
    dispatch({ type: 'ADD_DIALOG', payload: `📋 Task: "${prompt.slice(0, 45)}${prompt.length > 45 ? '…' : ''}"` });

    runWorkflow(prompt, dispatch, stateRef);
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, submitPrompt }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

// ─── Workflow orchestration ───────────────────────────────────────────────────

function runWorkflow(
  prompt: string,
  dispatch: React.Dispatch<Action>,
  stateRef: React.MutableRefObject<GameState>
) {
  const agents = stateRef.current.agents;
  const dispatched = agents.slice(0, Math.min(3, agents.length)).map(a => a.id);

  const DOOR_X = 3 * T;
  const DOOR_Y = 8 * T - 10;

  // T=0: Team lead reacts
  dispatch({ type: 'UPDATE_AGENT', payload: { id: dispatched[0], status: 'thinking', speech: 'New task incoming!' } });

  at(400, () => {
    dispatched.slice(1).forEach((id, i) => {
      dispatch({ type: 'UPDATE_AGENT', payload: { id, status: 'thinking', speech: ['On it! 🔍', 'Ready! ⚙️', 'Let\'s go! 🎨'][i] } });
    });
  });

  // T=1.5s: Walk to door
  at(1500, () => {
    dispatch({ type: 'ADD_DIALOG', payload: '🚶 Agents heading to breakout room...' });
    dispatch({ type: 'SET_PHASE', payload: 'walking_out' });
    dispatched.forEach((id, i) => {
      dispatch({ type: 'UPDATE_AGENT', payload: {
        id, status: 'walking', speech: null,
        position: { x: DOOR_X + (i - 1) * 20, y: DOOR_Y },
      }});
    });
  });

  // T=3.2s: Transition to breakout
  at(3200, () => {
    dispatch({ type: 'SET_TRANSITIONING', payload: true });
  });

  at(3700, () => {
    dispatch({ type: 'SET_VIEW', payload: 'breakout' });
    dispatch({ type: 'SET_PHASE', payload: 'in_breakout' });
    dispatch({ type: 'SET_TRANSITIONING', payload: false });

    dispatched.forEach((id, i) => {
      const seat = BREAKOUT_SEAT_POSITIONS[i];
      dispatch({ type: 'UPDATE_AGENT', payload: {
        id, inBreakout: true, status: 'walking',
        position: { x: seat.x, y: 10 },
      }});
      at(100 + i * 50, () => {
        dispatch({ type: 'UPDATE_AGENT', payload: { id, position: seat } });
      });
    });
  });

  // T=5s+: Collaboration sequence
  const msgs = buildMessages(prompt, dispatched, agents);
  msgs.forEach((msg, i) => {
    at(5000 + i * 2200, () => {
      dispatch({ type: 'UPDATE_AGENT', payload: { id: msg.agentId, status: 'talking', speech: msg.text } });
      if (msg.whiteboard) {
        dispatch({ type: 'ADD_WHITEBOARD', payload: { ...msg.whiteboard, delay: i * 0.1 } });
      }
      at(1800, () => {
        dispatch({ type: 'UPDATE_AGENT', payload: { id: msg.agentId, speech: null, status: 'working' } });
      });
    });
  });

  const doneAt = 5000 + msgs.length * 2200 + 800;

  // Walking back
  at(doneAt, () => {
    dispatch({ type: 'SET_PHASE', payload: 'walking_back' });
    dispatch({ type: 'ADD_DIALOG', payload: '✅ Work complete! Returning...' });
    dispatched.forEach((id) => {
      dispatch({ type: 'UPDATE_AGENT', payload: { id, status: 'walking', speech: null, position: { x: 190, y: 10 } } });
    });
  });

  at(doneAt + 1200, () => {
    dispatch({ type: 'SET_TRANSITIONING', payload: true });
  });

  at(doneAt + 1700, () => {
    dispatch({ type: 'SET_VIEW', payload: 'staff' });
    dispatch({ type: 'SET_TRANSITIONING', payload: false });
    dispatched.forEach((id, i) => {
      const home = stateRef.current.agents.find(a => a.id === id);
      const homePos = home ? STAFF_DESK_POSITIONS[i] : STAFF_DESK_POSITIONS[0];
      dispatch({ type: 'UPDATE_AGENT', payload: {
        id, inBreakout: false, status: 'walking',
        position: { x: DOOR_X, y: DOOR_Y },
      }});
      at(200 + i * 80, () => {
        dispatch({ type: 'UPDATE_AGENT', payload: { id, position: homePos } });
      });
    });
  });

  // Reporting
  at(doneAt + 3500, () => {
    dispatch({ type: 'SET_PHASE', payload: 'reporting' });
    dispatch({ type: 'UPDATE_AGENT', payload: { id: dispatched[0], status: 'talking', speech: '✓ Task complete!' } });
    dispatch({ type: 'ADD_DIALOG', payload: '🎉 Agents completed the task!' });
    dispatch({ type: 'ADD_DIALOG', payload: '📋 Check the whiteboard for results.' });
  });

  at(doneAt + 6000, () => {
    dispatch({ type: 'SET_PHASE', payload: 'idle' });
    dispatched.forEach(id => {
      dispatch({ type: 'UPDATE_AGENT', payload: { id, status: 'idle', speech: null } });
    });
    dispatch({ type: 'SET_PROMPT', payload: '' });
    dispatch({ type: 'ADD_DIALOG', payload: '💬 Ready for next task.' });
  });
}

function at(ms: number, fn: () => void) {
  setTimeout(fn, ms);
}

function buildMessages(
  prompt: string,
  agentIds: string[],
  agents: Agent[]
): Array<{ agentId: string; text: string; whiteboard?: { text: string; x: number; y: number; color: string } }> {
  const short = prompt.length > 30 ? prompt.slice(0, 30) + '…' : prompt;
  const lead = agentIds[0];
  const researcher = agentIds[1] ?? agentIds[0];
  const dev = agentIds[2] ?? agentIds[0];

  const getColor = (id: string) => agents.find(a => a.id === id)?.color ?? '#fff';

  return [
    { agentId: lead,       text: `Let's tackle: ${short}`,     whiteboard: { text: `📋 ${short}`, x: 12, y: 22, color: getColor(lead) } },
    { agentId: researcher, text: 'Researching now… 🔍',         whiteboard: { text: '🔍 Research phase', x: 12, y: 52, color: getColor(researcher) } },
    { agentId: dev,        text: 'Building the solution ⚙️',   whiteboard: { text: '⚙️ Implementation', x: 12, y: 82, color: getColor(dev) } },
    { agentId: lead,       text: 'Document as you go 📝',       whiteboard: { text: '📝 Docs & notes', x: 12, y: 112, color: getColor(lead) } },
    { agentId: researcher, text: 'Found 3 key insights! 💡',    whiteboard: { text: '💡 Insights ×3', x: 12, y: 142, color: getColor(researcher) } },
    { agentId: dev,        text: 'Tests passing ✅',             whiteboard: { text: '✅ Tests pass', x: 12, y: 172, color: getColor(dev) } },
    { agentId: lead,       text: 'Excellent work, team! 🎯',    whiteboard: { text: '🎯 DONE!', x: 12, y: 202, color: getColor(lead) } },
  ];
}
