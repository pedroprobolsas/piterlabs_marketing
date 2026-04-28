import { useRef, useState, useEffect, useCallback } from 'react';
import CaptionLayer from './CaptionLayer';

export default function SmartphoneFrame({ media, captionsEnabled, captionText, captionStyle, parallaxEnabled }) {
  const containerRef = useRef(null);
  const [offset, setOffset]       = useState({ x: 0, y: 0 });
  const [cssAnim, setCssAnim]     = useState(false);
  const isImage = media?.type === 'image';
  const parallaxActive = parallaxEnabled && isImage;

  // ── Desktop: mousemove ────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (!parallaxActive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    setOffset({ x: dx * 8, y: dy * 8 });
  }, [parallaxActive]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  // ── Mobile: deviceorientation → fallback CSS animation ───────────────────
  useEffect(() => {
    if (!parallaxActive) {
      setOffset({ x: 0, y: 0 });
      setCssAnim(false);
      return;
    }

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (!isMobile) return;

    if (!('DeviceOrientationEvent' in window)) {
      setCssAnim(true);
      return;
    }

    setCssAnim(false);
    const handler = (e) => {
      const gamma = Math.max(-45, Math.min(45, e.gamma ?? 0));
      const beta  = Math.max(-45, Math.min(45, (e.beta  ?? 45) - 45));
      setOffset({ x: (gamma / 45) * 8, y: (beta / 45) * 8 });
    };

    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, [parallaxActive]);

  const mediaStyle = parallaxActive && !cssAnim
    ? { transform: `translate(${offset.x}px, ${offset.y}px) scale(1.06)`, transition: 'transform 0.1s linear' }
    : {};

  return (
    <div className="flex flex-col items-center gap-[16px]">

      {/* Phone frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          maxWidth: '300px',
          aspectRatio: '9 / 16',
          background: '#0a0a14',
          borderRadius: '36px',
          border: '3px solid #1e1e2e',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          containerType: 'size',
        }}
      >
        {/* Camera notch */}
        <div style={{
          position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
          width: '60px', height: '8px', background: '#0a0a14',
          borderRadius: '4px', zIndex: 20,
          boxShadow: '0 0 0 1.5px rgba(255,255,255,0.08)',
        }} />

        {/* Media layer */}
        {media ? (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt="preview"
                className={parallaxActive && cssAnim ? 'parallax-float' : ''}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  ...mediaStyle,
                }}
              />
            ) : (
              <video
                src={media.url}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'rgba(255,255,255,0.12)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' }}>
              9 : 16
            </div>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.08)', fontSize: '9px' }}>
              Sube un archivo
            </div>
          </div>
        )}

        {/* Captions overlay */}
        {captionsEnabled && (
          <CaptionLayer text={captionText} style={captionStyle} />
        )}

        {/* Parallax badge */}
        {parallaxActive && (
          <div style={{
            position: 'absolute', top: '26px', right: '12px', zIndex: 15,
            background: 'rgba(107,33,168,0.8)', backdropFilter: 'blur(6px)',
            borderRadius: '20px', padding: '2px 8px',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '9px',
            letterSpacing: '1.5px', color: 'white',
          }}>
            VFX
          </div>
        )}
      </div>

      {/* Dimensions label */}
      <div className="font-jetbrains text-[0.58rem] text-muted tracking-[1.5px]">
        PREVIEW 9:16 · {media ? (media.type === 'video' ? 'VIDEO' : 'IMAGEN') : 'SIN ARCHIVO'}
      </div>
    </div>
  );
}
