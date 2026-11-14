export type AgentStatus = 'idle' | 'walking' | 'working' | 'thinking' | 'talking';
export type GamePhase =
  | 'idle'
  | 'dispatching'
  | 'walking_out'
  | 'in_breakout'
  | 'collaborating'
  | 'walking_back'
  | 'reporting';
export type RoomView = 'staff' | 'breakout';

export interface Position {
  x: number;
  y: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  hatColor: string;
  position: Position;
  status: AgentStatus;
  speech: string | null;
  inBreakout: boolean;
  animOffset: number;
}

export interface WhiteboardEntry {
  text: string;
  x: number;
  y: number;
  color: string;
  delay: number;
}

export interface FileTransfer {
  fromId: string;
  toId: string;
  label: string;
  id: string;
}

export interface GameState {
  phase: GamePhase;
  currentView: RoomView;
  agents: Agent[];
  prompt: string;
  dialogLines: string[];
  whiteboardEntries: WhiteboardEntry[];
  fileTransfers: FileTransfer[];
  transitioning: boolean;
}
