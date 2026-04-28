import { useState, useRef } from 'react';
import { Lightbulb, Sparkles, RefreshCw, PenTool } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';

export default function Ideacion() {
  const { marca } = useMarca();

  const [objetivo, setObjetivo] = useState('Generar leads y autoridad');
  const [canal, setCanal] = useState('Instagram Reels / TikTok');
  const [etapaCliente, setEtapaCliente] = useState('Descubrimiento (TOFU)');
  const [tono, setTono] = useState('Directo');
  const [cantidad, setCantidad] = useState(10);
  
  const [ideas, setIdeas] = useState('');
  const [generando, setGenerando] = useState(false);
  const ideasRef = useRef(null);

  const handleGenerarIdeas = async () => {
    setGenerando(true);
    setIdeas('');

    try {
      const res = await fetch('/api/claude/generar-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objetivo,
          canal,
          etapa_cliente: etapaCliente,
          tono_ideas: tono,
          cantidad,
          marca_config: marca || {},
        }),
      });

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
              setIdeas(prev => prev + evt.text);
              setTimeout(() => ideasRef.current?.scrollTo({ top: ideasRef.current.scrollHeight, behavior: 'smooth' }), 20);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      setIdeas(`Error: ${e.message}`);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px]">
      {/* Header */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Lightbulb size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">MÁQUINA DE IDEAS</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Genera temas de contenido estratégicos basados en el dolor y deseo de tu audiencia.
          {marca?.nombre_marca && <span className="text-magenta ml-[6px]">Marca: {marca.nombre_marca}</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-[20px]">
        {/* LEFT: Controles */}
        <div className="space-y-[16px]">
          <div className="bg-white border border-border rounded-[14px] p-[20px_22px]">
            <h3 className="font-jetbrains text-[0.75rem] text-text-main uppercase tracking-[1.5px] font-bold mb-[16px] flex items-center gap-[8px]">
              <Sparkles size={14} className="text-magenta" /> Parámetros Estratégicos
            </h3>
            
            <div className="space-y-[14px]">
              <div>
                <label className="font-jetbrains text-[0.65rem] text-text2 uppercase tracking-[1px] font-bold block mb-[6px]">Objetivo del Contenido</label>
                <input value={objetivo} onChange={e => setObjetivo(e.target.value)} className="input-base w-full" placeholder="Ej: Generar leads" />
              </div>
              
              <div>
                <label className="font-jetbrains text-[0.65rem] text-text2 uppercase tracking-[1px] font-bold block mb-[6px]">Canal Principal</label>
                <select value={canal} onChange={e => setCanal(e.target.value)} className="input-base w-full">
                  <option value="Instagram Reels / TikTok">Instagram Reels / TikTok (Retención)</option>
                  <option value="LinkedIn">LinkedIn (Autoridad)</option>
                  <option value="YouTube">YouTube (Profundidad)</option>
                  <option value="Email Marketing">Email Marketing (Conversión)</option>
                </select>
              </div>

              <div>
                <label className="font-jetbrains text-[0.65rem] text-text2 uppercase tracking-[1px] font-bold block mb-[6px]">Etapa del Cliente</label>
                <select value={etapaCliente} onChange={e => setEtapaCliente(e.target.value)} className="input-base w-full">
                  <option value="TOFU (Descubrimiento)">TOFU (Descubrimiento y Atracción)</option>
                  <option value="MOFU (Consideración)">MOFU (Consideración y Confianza)</option>
                  <option value="BOFU (Decisión)">BOFU (Decisión y Conversión)</option>
                </select>
              </div>

              <div>
                <label className="font-jetbrains text-[0.65rem] text-text2 uppercase tracking-[1px] font-bold block mb-[6px]">Tono Narrativo</label>
                <select value={tono} onChange={e => setTono(e.target.value)} className="input-base w-full">
                  <option value="Directo">Directo</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Premium">Premium</option>
                  <option value="Educativo">Educativo</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Cercano">Cercano</option>
                  <option value="Emocional">Emocional</option>
                  <option value="Gracioso">Gracioso</option>
                  <option value="Irónico">Irónico</option>
                  <option value="Provocador">Provocador</option>
                </select>
              </div>

              <div>
                <label className="font-jetbrains text-[0.65rem] text-text2 uppercase tracking-[1px] font-bold block mb-[6px]">Cantidad de Temas</label>
                <input type="number" min="5" max="20" value={cantidad} onChange={e => setCantidad(e.target.value)} className="input-base w-full" />
              </div>

              <button
                onClick={handleGenerarIdeas}
                disabled={generando}
                className="w-full mt-[10px] flex justify-center items-center gap-[7px] bg-magenta text-white font-bebas text-[1.1rem] tracking-[1.5px] px-[20px] py-[12px] rounded-[9px] cursor-pointer hover:bg-magenta-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(204,0,204,0.2)]"
              >
                {generando
                  ? <><RefreshCw size={16} className="animate-spin" /> PROCESANDO MATRIZ...</>
                  : <><Lightbulb size={16} /> GENERAR MÁQUINA DE IDEAS</>}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="bg-white border border-border rounded-[14px] flex flex-col h-[600px]">
          <div className="flex items-center justify-between px-[22px] py-[14px] border-b border-border-soft rounded-t-[14px]">
            <div className="flex items-center gap-[8px]">
              <Lightbulb size={15} className="text-magenta" />
              <span className="font-bebas text-[1.1rem] tracking-[2px] text-text-main">IDEAS GENERADAS</span>
            </div>
            {ideas && !generando && (
              <button onClick={() => {
                localStorage.setItem('piterlabs_ideas_recientes', ideas);
              }} className="font-jetbrains text-[0.6rem] text-muted border border-border rounded-[6px] px-[9px] py-[5px] hover:text-magenta transition-all cursor-pointer bg-white flex items-center gap-[5px]">
                <PenTool size={11} /> Llevar al Guion
              </button>
            )}
          </div>
          
          <div ref={ideasRef} className="flex-1 overflow-y-auto p-[22px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {ideas ? (
              <div className="prose prose-sm max-w-none font-jetbrains text-[0.8rem] text-text-main leading-relaxed">
                {/* Renderizamos markdown básico preservando saltos de línea */}
                <pre className="font-jetbrains text-[0.78rem] whitespace-pre-wrap">{ideas}</pre>
                {generando && <span className="inline-block w-[8px] h-[4px] bg-magenta ml-[3px] animate-blink rounded-sm" />}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-[12px] opacity-50">
                <Lightbulb size={40} className="text-border" />
                <div className="font-jetbrains text-[0.75rem] text-muted max-w-[250px]">
                  Configura tus parámetros y presiona Generar para obtener una matriz estratégica de temas.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
