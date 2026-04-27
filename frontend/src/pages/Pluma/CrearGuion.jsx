import { useState, useRef } from 'react';
import { PenTool, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import PlantillaSelector from '../../components/pluma/PlantillaSelector';
import HookValidator from '../../components/pluma/HookValidator';
import FormatAdapter from '../../components/pluma/FormatAdapter';

export default function CrearGuion() {
  const { marca } = useMarca();

  const [plantilla, setPlantilla] = useState('problema_solucion');
  const [tema, setTema]           = useState('');
  const [guion, setGuion]         = useState('');
  const [generando, setGenerando] = useState(false);
  const [copied, setCopied]       = useState(false);
  const [activeSection, setActiveSection] = useState('guion'); // 'guion' | 'formatos'
  const guionRef = useRef(null);

  const handleGenerarGuion = async () => {
    if (!tema.trim()) return;
    setGenerando(true);
    setGuion('');
    setActiveSection('guion');

    try {
      const res = await fetch('/api/claude/generar-guion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantilla,
          tema,
          marca_config: marca || {},
          buyer_persona: marca?.buyer_persona || null,
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
              setGuion(prev => prev + evt.text);
              setTimeout(() => guionRef.current?.scrollTo({ top: guionRef.current.scrollHeight, behavior: 'smooth' }), 20);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      setGuion(`Error: ${e.message}`);
    } finally {
      setGenerando(false);
    }
  };

  const copyGuion = () => {
    navigator.clipboard.writeText(guion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1200px]">

      {/* Header */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <PenTool size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">CREAR GUION</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Genera guiones de contenido con IA, valida tu hook y adapta a múltiples formatos.
          {marca?.nombre_marca && <span className="text-magenta ml-[6px]">Marca: {marca.nombre_marca}</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[20px]">

        {/* LEFT: Main canvas */}
        <div className="space-y-[18px]">

          {/* Plantilla selector */}
          <div className="bg-white border border-border rounded-[14px] p-[20px_22px]">
            <PlantillaSelector selected={plantilla} onChange={setPlantilla} />
          </div>

          {/* Tema + Generate */}
          <div className="bg-white border border-border rounded-[14px] p-[20px_22px]">
            <label className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[8px]">
              Tema del Contenido <span className="text-magenta">*</span>
            </label>
            <div className="flex gap-[10px]">
              <input
                value={tema}
                onChange={e => setTema(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerarGuion()}
                placeholder="Ej: Cómo elegir el empaque correcto para tu producto"
                className="input-base flex-1"
              />
              <button
                onClick={handleGenerarGuion}
                disabled={generando || !tema.trim()}
                className="flex items-center gap-[7px] bg-magenta text-white font-bebas text-[1rem] tracking-[1.5px] px-[20px] py-[10px] rounded-[9px] cursor-pointer hover:bg-magenta-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(204,0,204,0.2)] shrink-0"
              >
                {generando
                  ? <><RefreshCw size={15} className="animate-spin" /> GENERANDO</>
                  : <><Sparkles size={15} /> GENERAR</>}
              </button>
            </div>
          </div>

          {/* Guion Canvas */}
          <div className="bg-white border border-border rounded-[14px] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border-soft">
              {[
                { id: 'guion',    label: '📄 Guion' },
                { id: 'formatos', label: '📡 Adaptar Formatos' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-[20px] py-[12px] font-jetbrains text-[0.65rem] transition-all cursor-pointer border-b-[2px]
                    ${activeSection === tab.id
                      ? 'border-magenta text-magenta bg-magenta-soft'
                      : 'border-transparent text-muted hover:text-text2'}`}
                >
                  {tab.label}
                </button>
              ))}
              {guion && (
                <button
                  onClick={copyGuion}
                  className="ml-auto flex items-center gap-[5px] font-jetbrains text-[0.6rem] text-muted px-[14px] hover:text-magenta transition-colors cursor-pointer"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              )}
            </div>

            {activeSection === 'guion' && (
              <div
                ref={guionRef}
                className="p-[20px_22px] min-h-[260px] max-h-[560px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              >
                {guion ? (
                  <pre className="font-jetbrains text-[0.78rem] text-text-main leading-relaxed whitespace-pre-wrap">
                    {guion}
                    {generando && <span className="inline-block w-[8px] h-[4px] bg-magenta ml-[3px] animate-blink rounded-sm" />}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[180px] text-center gap-[8px]">
                    <PenTool size={28} className="text-border" />
                    <div className="font-jetbrains text-[0.68rem] text-muted">
                      Selecciona una plantilla, escribe el tema y haz clic en Generar
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'formatos' && (
              <div className="p-[16px_20px]">
                <FormatAdapter
                  guionBase={guion}
                  marcaConfig={marca || {}}
                />
              </div>
            )}
          </div>

        </div>

        {/* RIGHT: Hook Validator */}
        <div>
          <HookValidator
            tono_voz={marca?.tono_voz || 'cercano'}
            industria={marca?.industria || ''}
          />
        </div>

      </div>
    </div>
  );
}
