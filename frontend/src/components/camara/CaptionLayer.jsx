const STYLES = {
  viral: {
    wrapper: {
      position: 'absolute', bottom: '18%', left: 0, right: 0,
      display: 'flex', justifyContent: 'center', padding: '0 12px',
      pointerEvents: 'none', zIndex: 10,
    },
    text: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 'clamp(22px, 5cqw, 30px)',
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      textAlign: 'center',
      lineHeight: 1.1,
      WebkitTextStroke: '1.5px #000000',
      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))',
      wordBreak: 'break-word',
      whiteSpace: 'pre-line',
    },
  },
  documental: {
    wrapper: {
      position: 'absolute', bottom: '8%', left: 0, right: 0,
      display: 'flex', justifyContent: 'center', padding: '0 20px',
      pointerEvents: 'none', zIndex: 10,
    },
    text: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(13px, 3cqw, 16px)',
      color: 'rgba(255,255,255,0.92)',
      fontWeight: 400,
      textAlign: 'center',
      lineHeight: 1.5,
      letterSpacing: '0.5px',
      textShadow: '0 1px 8px rgba(0,0,0,0.6), 0 2px 20px rgba(0,0,0,0.4)',
      wordBreak: 'break-word',
      whiteSpace: 'pre-line',
    },
  },
  impacto: {
    wrapper: {
      position: 'absolute', top: '50%', left: 0, right: 0,
      transform: 'translateY(-50%)',
      display: 'flex', justifyContent: 'center', padding: '0 8px',
      pointerEvents: 'none', zIndex: 10,
    },
    text: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 'clamp(26px, 6cqw, 36px)',
      color: '#ffee00',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      textAlign: 'center',
      lineHeight: 1,
      background: 'rgba(0,0,0,0.55)',
      padding: '6px 14px',
      borderRadius: '4px',
      WebkitTextStroke: '0.5px rgba(204,0,204,0.6)',
      filter: 'drop-shadow(0 0 12px rgba(204,0,204,0.5))',
      wordBreak: 'break-word',
      whiteSpace: 'pre-line',
    },
  },
};

export default function CaptionLayer({ text, style = 'viral' }) {
  if (!text?.trim()) return null;
  const s = STYLES[style] || STYLES.viral;
  return (
    <div style={s.wrapper}>
      <span style={s.text}>{text}</span>
    </div>
  );
}
