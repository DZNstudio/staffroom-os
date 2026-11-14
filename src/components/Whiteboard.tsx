import { useEffect, useState } from 'react';
import type { WhiteboardEntry } from '../types';
import './Whiteboard.css';

interface Props {
  entries: WhiteboardEntry[];
}

interface AnimatedEntry extends WhiteboardEntry {
  visible: boolean;
}

export default function Whiteboard({ entries }: Props) {
  const [animated, setAnimated] = useState<AnimatedEntry[]>([]);

  useEffect(() => {
    setAnimated(entries.map((e, i) => ({
      ...e,
      visible: false,
      delay: i * 0.15,
    })));
    // Stagger visibility
    entries.forEach((_, i) => {
      setTimeout(() => {
        setAnimated(prev => prev.map((a, j) => j === i ? { ...a, visible: true } : a));
      }, i * 200 + 100);
    });
  }, [entries]);

  return (
    <div className="whiteboard">
      <div className="wb-header">
        <span className="wb-title">WHITEBOARD</span>
        <div className="wb-tray">
          <div className="wb-marker" style={{ background: '#e74c3c' }} />
          <div className="wb-marker" style={{ background: '#3498db' }} />
          <div className="wb-marker" style={{ background: '#2ecc71' }} />
        </div>
      </div>
      <div className="wb-surface">
        {animated.map((entry, i) => (
          <div
            key={i}
            className={`wb-entry ${entry.visible ? 'visible' : ''}`}
            style={{
              top: entry.y,
              left: entry.x,
              color: entry.color,
              transitionDelay: `${entry.delay}s`,
            }}
          >
            {entry.text}
          </div>
        ))}
        {entries.length === 0 && (
          <div className="wb-empty">Waiting for agents…</div>
        )}
        {/* Grid lines on board */}
        <div className="wb-lines" />
      </div>
    </div>
  );
}
