import React, { useEffect, useRef } from 'react';

export default function HeroBanner() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let nodes = [];
    const N = 80;
    const MAX_DIST = 120;
    
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = window.innerWidth >= 768 ? 340 : 220;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Initialize nodes
    for (let i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1.5 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        bright: Math.random() > 0.85
      });
    }
    
    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      
      ctx.clearRect(0, 0, W, H);
      
      // Move nodes
      for (let i = 0; i < N; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > W) node.vx *= -1;
        if (node.y < 0 || node.y > H) node.vy *= -1;
        
        // Ensure they don't get stuck outside bounds on resize down
        if (node.x < 0) node.x = 0;
        if (node.x > W) node.x = W;
        if (node.y < 0) node.y = 0;
        if (node.y > H) node.y = H;
        
        node.pulse += node.pulseSpeed;
      }
      
      // Draw lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const alpha = 1 - dist / MAX_DIST;
            ctx.strokeStyle = `rgba(200, 0, 200, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      for (let i = 0; i < N; i++) {
        const node = nodes[i];
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        
        if (node.bright) {
          const glow = Math.sin(node.pulse) * 0.5 + 0.5; // 0 to 1
          ctx.fillStyle = `rgba(200, 0, 200, ${0.5 + glow * 0.5})`;
          ctx.shadowBlur = 10 * glow;
          ctx.shadowColor = 'rgba(255, 0, 255, 0.8)';
        } else {
          ctx.fillStyle = 'rgba(200, 0, 200, 0.8)';
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset for next drawing
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full rounded-[14px] overflow-hidden mb-[28px] bg-[#0a0010] min-h-[220px] md:min-h-[340px]">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row justify-between items-center px-[24px] py-[30px] md:pl-[40px] md:pr-[32px] md:py-[40px] min-h-[220px] md:min-h-[340px] gap-[24px] md:gap-[0]">
        
        {/* Left Column */}
        <div className="flex flex-col text-center md:text-left md:w-1/2">
          <div className="font-jetbrains text-[0.7rem] text-muted mb-[10px] md:mb-[12px] uppercase tracking-[2px]">
            // PITERLABS PRESENTA
          </div>
          <h2 className="font-bebas text-[2.2rem] md:text-[3.5rem] text-white leading-[1.1] mb-[10px] md:mb-[12px] tracking-[1px]">
            MÁQUINA DE CREACIÓN DE <br className="hidden md:block"/>
            <span style={{ color: '#ff00ff' }}>CONTENIDO INTELIGENTE</span>
          </h2>
          <p className="font-syne text-[0.8rem] md:text-[0.9rem] text-muted tracking-[0.5px]">
            Estrategia · Guion · Producción · Viralización · Distribución
          </p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[12px] w-full md:w-auto md:min-w-[280px]">
          {/* Card 1 */}
          <div 
            className="flex items-center p-[14px_18px] md:p-[16px_20px] rounded-[10px] backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,0,255,0.12)', border: '1px solid rgba(255,0,255,0.3)' }}
          >
            <div className="w-[8px] h-[8px] rounded-full bg-green mr-[12px] animate-pulse shadow-[0_0_8px_rgba(0,255,0,0.6)]"></div>
            <span className="font-jetbrains text-[0.75rem] md:text-[0.8rem] text-white tracking-[1px]">PiterLabs Agent — Escuchando</span>
          </div>
          
          {/* Card 2 */}
          <div 
            className="flex items-center justify-between p-[14px_18px] md:p-[16px_20px] rounded-[10px] backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,0,255,0.12)', border: '1px solid rgba(255,0,255,0.3)' }}
          >
            <span className="font-jetbrains text-[0.75rem] md:text-[0.8rem] text-white tracking-[1px]">PIEZAS ESTE MES</span>
            <span className="font-bebas text-[1.6rem] md:text-[1.8rem] leading-none" style={{ color: '#ff00ff' }}>23</span>
          </div>
        </div>
      </div>
    </div>
  );
}
