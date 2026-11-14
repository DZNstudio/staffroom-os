import { useEffect, useState } from 'react';
import './SpeechBubble.css';

interface Props {
  text: string;
  color: string;
}

export default function SpeechBubble({ text, color }: Props) {
  const [displayed, setDisplayed] = useState('');

  // Typewriter effect
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);

  return (
    <div className="speech-bubble" style={{ '--bubble-color': color } as React.CSSProperties}>
      <div className="bubble-text">{displayed}<span className="cursor">▌</span></div>
      <div className="bubble-tail" />
    </div>
  );
}
