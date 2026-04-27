import { useState, useRef } from 'react';
import { Zap } from 'lucide-react';

const NIVEL_CONFIG = {
  débil:   { color: 'text-red',    bg: 'bg-red/10    border-red/30',    bar: 'bg-red' },
  regular: { color: 'text-orange', bg: 'bg-orange/10 border-orange/30', bar: 'bg-orange' },
  fuerte:  { color: 'text-green',  bg: 'bg-green/10  border-green/30',  bar: 'bg-green' },
  viral:   { color: 'text-magenta',bg: 'bg-magenta-soft border-magenta/30', bar: 'bg-magenta' },
};

export default function HookValidator({ tono_voz, industria }) {
  const [hook, setHook]         = useState('');
  const [resultado, setRes]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const debounceRef             = useRef(null);

  const validar = async (texto) => {
    if (!texto || texto.length < 8) { setRes(null); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/claude/validar-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hook: texto, tono_voz, industria }),
      });
      const json = await res.json();
      if (json.success && json.data) setRes(json.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setHook(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => validar(val), 900);
  };

  const nivel = resultado ? (NIVEL_CONFIG[resultado.nivel] || NIVEL_CONFIG.regular) : null;

  return (
    <div className="bg-white border border-border rounded-[14px] overflow-hidden">
      <div className="flex items-center gap-[8px] px-[20px] py-[14px] border-b border-border-soft">
        <Zap size={15} className="text-magenta" />
        <span className="font-bebas text-[1rem] tracking-[2px]">VALIDADOR DE HOOK</span>
        <span className="font-jetbrains text-[0.58rem] text-muted ml-auto">Análisis en tiempo real</span>
      </div>

      <div className="p-[16px_20px]">
        <textarea
          value={hook}
          onChange={handleChange}
          placeholder="Escribe tu hook aquí... (ej: 'El 80% de los negocios fallan porque no conocen este error')"
          rows={3}
          className="input-base resize-none mb-[12px]"
        />

        {loading && (
          <div className="flex items-center gap-[8px] text-muted font-jetbrains text-[0.68rem]">
            <div className="w-[6px] h-[6px] rounded-full bg-magenta animate-blink"></div>
            Analizando...
          </div>
        )}

        {resultado && !loading && (
          <div className="space-y-[12px]">
            {/* Score bar */}
            <div className={`flex items-center justify-between p-[10px_14px] rounded-[10px] border ${nivel.bg}`}>
              <div>
                <div className={`font-bebas text-[1.8rem] leading-none ${nivel.color}`}>
                  {resultado.puntuacion}
                  <span className="text-[1rem]">/100</span>
                </div>
                <div className={`font-jetbrains text-[0.6rem] uppercase ${nivel.color}`}>{resultado.nivel}</div>
              </div>
              <div className="w-[100px]">
                <div className="bg-border rounded-full h-[6px] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${nivel.bar}`}
                    style={{ width: `${resultado.puntuacion}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Fortalezas / Debilidades */}
            <div className="grid grid-cols-2 gap-[8px]">
              {resultado.fortalezas?.length > 0 && (
                <div>
                  <div className="font-jetbrains text-[0.6rem] text-green uppercase tracking-[1px] mb-[5px] font-bold">Fortalezas</div>
                  {resultado.fortalezas.map((f, i) => (
                    <div key={i} className="font-jetbrains text-[0.65rem] text-text2 mb-[3px]">✓ {f}</div>
                  ))}
                </div>
              )}
              {resultado.debilidades?.length > 0 && (
                <div>
                  <div className="font-jetbrains text-[0.6rem] text-orange uppercase tracking-[1px] mb-[5px] font-bold">Mejorar</div>
                  {resultado.debilidades.map((d, i) => (
                    <div key={i} className="font-jetbrains text-[0.65rem] text-text2 mb-[3px]">⚠ {d}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Consejo */}
            {resultado.consejo && (
              <div className="bg-bg border-l-[3px] border-violet pl-[12px] py-[8px] pr-[10px] rounded-r-[8px]">
                <div className="font-jetbrains text-[0.65rem] text-text2">{resultado.consejo}</div>
              </div>
            )}

            {/* Variantes */}
            {resultado.variantes?.length > 0 && (
              <div>
                <div className="font-jetbrains text-[0.6rem] text-muted uppercase tracking-[1px] mb-[6px] font-bold">Variantes sugeridas</div>
                {resultado.variantes.map((v, i) => (
                  <div
                    key={i}
                    onClick={() => setHook(v)}
                    className="font-jetbrains text-[0.68rem] text-text-main p-[8px_12px] bg-bg border border-border rounded-[8px] mb-[5px] cursor-pointer hover:border-magenta hover:bg-magenta-soft transition-all"
                  >
                    {v}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
