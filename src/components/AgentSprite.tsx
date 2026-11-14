import { useEffect, useRef, useState } from 'react';
import type { Agent } from '../types';
import SpeechBubble from './SpeechBubble';
import './AgentSprite.css';

interface Props {
  agent: Agent;
  scale?: number;
}

export default function AgentSprite({ agent, scale = 1 }: Props) {
  const [walkFrame, setWalkFrame] = useState(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (agent.status === 'walking') {
      frameRef.current = setInterval(() => setWalkFrame(f => (f + 1) % 4), 150);
    } else {
      if (frameRef.current) clearInterval(frameRef.current);
      setWalkFrame(0);
    }
    return () => { if (frameRef.current) clearInterval(frameRef.current); };
  }, [agent.status]);

  const px = agent.position.x;
  const py = agent.position.y;

  // Leg positions for walk cycle
  const leftLegY  = (walkFrame === 1 || walkFrame === 3) ? 7 : 6;
  const rightLegY = (walkFrame === 0 || walkFrame === 2) ? 7 : 6;

  const spriteW = 8 * scale;
  const spriteH = 10 * scale;

  return (
    <div
      className={`agent-wrapper agent-${agent.status}`}
      style={{ left: px, top: py, '--anim-offset': `${agent.animOffset}ms` } as React.CSSProperties}
    >
      {/* Thinking dots */}
      {agent.status === 'thinking' && (
        <div className="think-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      )}

      {/* Main sprite */}
      <svg
        width={spriteW * 6}
        height={spriteH * 6}
        viewBox={`0 0 ${spriteW} ${spriteH}`}
        style={{ imageRendering: 'pixelated', display: 'block' }}
      >
        {/* Shadow */}
        <ellipse cx={spriteW / 2} cy={spriteH - 0.3} rx={2.5} ry={0.6} fill="rgba(0,0,0,0.25)" />

        {/* Hat/hair */}
        <rect x="2" y="0" width="4" height="1" fill={agent.hatColor} />
        <rect x="1" y="1" width="6" height="1" fill={agent.hatColor} />

        {/* Head */}
        <rect x="1" y="1" width="6" height="4" fill="#f0c08a" />

        {/* Eyes */}
        <rect x="2" y="2.5" width="1.2" height="1.2" fill="#1a1030" />
        <rect x="4.8" y="2.5" width="1.2" height="1.2" fill="#1a1030" />
        {/* Eye shine */}
        <rect x="2.2" y="2.5" width="0.5" height="0.5" fill="white" />
        <rect x="5"   y="2.5" width="0.5" height="0.5" fill="white" />

        {/* Mouth */}
        {agent.status === 'talking' || agent.status === 'thinking'
          ? <rect x="3" y="4.2" width="2" height="0.8" rx="0.3" fill="#c0392b" />
          : <rect x="2.8" y="4.2" width="2.4" height="0.6" rx="0.3" fill="#c0392b" />
        }

        {/* Body / shirt */}
        <rect x="1.5" y="5" width="5" height="3" fill={agent.color} />

        {/* Collar */}
        <rect x="3" y="5" width="2" height="1" fill="#f0f0e8" />

        {/* Arms */}
        <rect x="0.2" y="5" width="1.3" height="2.5" rx="0.4" fill="#f0c08a" />
        <rect x="6.5" y="5" width="1.3" height="2.5" rx="0.4" fill="#f0c08a" />

        {/* Legs */}
        <rect x="1.5" y={leftLegY}  width="2" height="3" rx="0.3" fill="#2c3e50" />
        <rect x="4.5" y={rightLegY} width="2" height="3" rx="0.3" fill="#2c3e50" />

        {/* Shoes */}
        <rect x="1.2" y={leftLegY + 2.2}  width="2.6" height="0.8" rx="0.3" fill="#1a1030" />
        <rect x="4.2" y={rightLegY + 2.2} width="2.6" height="0.8" rx="0.3" fill="#1a1030" />
      </svg>

      {/* Name tag */}
      <div className="agent-tag" style={{ borderColor: agent.color }}>
        <span style={{ color: agent.color }}>{agent.name}</span>
        <span className="agent-role">{agent.role}</span>
      </div>

      {/* Speech bubble */}
      {agent.speech && <SpeechBubble text={agent.speech} color={agent.color} />}
    </div>
  );
}
