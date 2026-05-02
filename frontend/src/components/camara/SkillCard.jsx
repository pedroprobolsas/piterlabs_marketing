import { useState, useRef, useEffect } from 'react';
import { Play, Copy, Check, RefreshCw, HelpCircle } from 'lucide-react';

export default function SkillCard({ skill, guion, atributosProducto, marcaConfig }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const resultRef = useRef(null);

  // Auto-scroll as result streams
  useEffect(() => {
    if (loading && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result, loading]);

  const handleGenerar = async () => {
    if (!guion || guion.trim().length < 20) {
      setError('Se requiere un guion base válido (mín. 20 caracteres) en la sección TU MATERIAL.');
      return;
    }
    setLoading(true);
    setResult('');
    setError('');

    try {
      const res = await fetch('/api/claude/generar-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guion,
          atributos_producto: atributosProducto,
          marca_config: marcaConfig,
          instrucciones_skill: skill.instrucciones
        }),
      });

      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.type === 'text') {
              setResult(prev => prev + evt.text);
            } else if (evt.type === 'error') {
              setError(evt.error);
            }
          } catch { /* ignore parse errors for incomplete chunks */ }
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopiar = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="skill-card bg-white flex flex-col shadow-sm relative">
      <div className="p-[14px_16px] border-b border-border-soft flex items-center gap-[8px] rounded-t-[12px]">
        <div className="flex-1 min-w-0">
          <h3 className="font-jetbrains text-[0.75rem] font-bold uppercase tracking-[0.5px] text-text-main">{skill.nombre}</h3>
          {skill.descripcion && <p className="font-jetbrains text-[0.69rem] text-muted truncate mt-[1px]">{skill.descripcion}</p>}
        </div>
        {skill.descripcion && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowTip(v => !v)}
              className="w-[18px] h-[18px] flex items-center justify-center rounded-full text-muted hover:text-magenta hover:bg-magenta/10 transition-all cursor-pointer"
            >
              <HelpCircle size={14} />
            </button>
            {showTip && (
              <div className="absolute right-0 top-[22px] z-50 w-[260px] bg-white border border-border rounded-[10px] shadow-lg p-[12px]">
                <p className="font-jetbrains text-[0.65rem] text-text-main leading-relaxed">{skill.descripcion}</p>
              </div>
            )}
          </div>
        )}
        {!loading && !result && (
          <button
            onClick={handleGenerar}
            className="shrink-0 flex items-center gap-[6px] bg-magenta text-white font-jetbrains text-[0.65rem] font-bold px-[12px] py-[6px] rounded-[7px] cursor-pointer hover:bg-magenta-bright transition-all shadow-[0_2px_8px_rgba(204,0,204,0.2)]"
          >
            <Play size={12} fill="currentColor" />
            GENERAR
          </button>
        )}
        {loading && (
          <div className="flex items-center gap-[6px] text-magenta font-jetbrains text-[0.65rem] font-bold px-[14px] py-[8px]">
            <RefreshCw size={12} className="animate-spin" />
            GENERANDO...
          </div>
        )}
        {!loading && result && (
          <div className="flex gap-[8px]">
            <button
              onClick={handleGenerar}
              className="flex items-center gap-[5px] font-jetbrains text-[0.6rem] text-muted border border-border rounded-[6px] px-[9px] py-[5px] hover:text-text-main transition-all cursor-pointer bg-white"
            >
              <RefreshCw size={11} />
              Regenerar
            </button>
            <button
              onClick={handleCopiar}
              className="flex items-center gap-[5px] font-jetbrains text-[0.6rem] text-magenta border border-magenta/20 rounded-[6px] px-[9px] py-[5px] hover:bg-magenta-soft transition-all cursor-pointer bg-white"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        )}
      </div>

      {(result || error || loading) && (
        <div 
          ref={resultRef}
          className="p-[20px] bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent max-h-[400px]"
        >
          {error && (
            <div className="font-jetbrains text-[0.65rem] text-red bg-red/5 border border-red/20 rounded-[8px] px-[12px] py-[8px] mb-[10px]">
              Error: {error}
            </div>
          )}
          {result && (
            <pre className="font-jetbrains text-[0.72rem] text-text-main leading-relaxed whitespace-pre-wrap">
              {result}
              {loading && <span className="inline-block w-[6px] h-[12px] bg-magenta ml-[4px] animate-pulse align-middle" />}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
