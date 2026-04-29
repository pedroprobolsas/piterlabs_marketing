import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PenTool, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import PlantillaSelector from '../../components/pluma/PlantillaSelector';
import HookValidator from '../../components/pluma/HookValidator';
import FormatAdapter from '../../components/pluma/FormatAdapter';
import ExportGuionPDF from '../../components/pluma/ExportGuionPDF';

export default function CrearGuion() {
  const { marca } = useMarca();

  const [plantilla, setPlantilla] = useState('problema_solucion');
  const [tema, setTema]           = useState(() => localStorage.getItem('piterlabs_guion_tema') || '');
  
  // Advanced options (Estilo Cinematográfico)
  const [tipoCinematografia, setTipoCinematografia] = useState('Documental');
  const [ritmoEdicion, setRitmoEdicion]             = useState('Medio');
  const [referenciasVisuales, setReferenciasVisuales] = useState('');

  // Recuperar guion anterior al navegar de vuelta (persiste hasta "Nuevo Contenido")
  const [guion, setGuion]         = useState(() => localStorage.getItem('piterlabs_guion_reciente') || '');
  const [generando, setGenerando] = useState(false);
  const [copied, setCopied]       = useState(false);
  const [activeSection, setActiveSection] = useState(() => 
    localStorage.getItem('piterlabs_guion_reciente') ? 'guion' : 'guion'
  );
  const guionRef = useRef(null);

  const [searchParams] = useSearchParams();
  const fichaId = searchParams.get('ficha_id');

  // Cargar idea reciente de la Máquina de Ideas si existe
  useEffect(() => {
    const recentIdea = localStorage.getItem('piterlabs_ideas_recientes');
    if (recentIdea) {
      setTema(recentIdea);
      // Lo borramos para que no aparezca siempre
      localStorage.removeItem('piterlabs_ideas_recientes');
    }
  }, []);

  // Cargar ficha estratégica desde DB
  useEffect(() => {
    if (fichaId) {
      fetch(`/api/claude/fichas/${fichaId}`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.data) {
            const conv = d.data.conversacion;
            const lastMsg = conv[conv.length - 1];
            if (lastMsg) {
              setTema(lastMsg.content.replace('[FICHA_COMPLETADA]', ''));
            }
          }
        })
        .catch(err => console.error('Error cargando ficha:', err));
    }
  }, [fichaId]);

  // Guardar en localStorage cuando se termina de generar
  useEffect(() => {
    if (!generando && guion) {
      localStorage.setItem('piterlabs_guion_reciente', guion);
    }
  }, [guion, generando]);

  // Persistir el tema para que sobreviva la navegación
  useEffect(() => {
    if (tema) localStorage.setItem('piterlabs_guion_tema', tema);
  }, [tema]);

  // Persistir estilo cinematográfico elegido para uso en /camara
  useEffect(() => {
    localStorage.setItem('piterlabs_estilo_cinematografico', tipoCinematografia);
  }, [tipoCinematografia]);

  // Limpiar toda la sesión actual (llamado desde botón "+ Nuevo Contenido")
  const handleNuevoContenido = () => {
    localStorage.removeItem('piterlabs_guion_reciente');
    localStorage.removeItem('piterlabs_guion_tema');
    localStorage.removeItem('piterlabs_ideas_recientes');
    setGuion('');
    setTema('');
  };

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
          tipo_cinematografia: tipoCinematografia,
          ritmo_edicion: ritmoEdicion,
          referencias_visuales: referenciasVisuales,
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
              Tema del Contenido o Contexto Estratégico <span className="text-magenta">*</span>
            </label>
            <div className="flex flex-col gap-[10px]">
              <textarea
                value={tema}
                onChange={e => setTema(e.target.value)}
                placeholder="Ej: Cómo elegir el empaque correcto para tu producto. (Puedes pegar aquí el resultado completo del Estratega)"
                className="input-base w-full min-h-[120px] resize-y font-jetbrains text-[0.8rem]"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleGenerarGuion}
                  disabled={generando || !tema.trim()}
                  className="flex items-center gap-[7px] bg-magenta text-white font-bebas text-[1rem] tracking-[1.5px] px-[20px] py-[10px] rounded-[9px] cursor-pointer hover:bg-magenta-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(204,0,204,0.2)]"
                >
                {generando
                  ? <><RefreshCw size={15} className="animate-spin" /> GENERANDO</>
                  : <><Sparkles size={15} /> GENERAR</>}
                </button>
              </div>
            </div>
          </div>

          {/* Advanced options: Estilo Cinematográfico */}
          <div className="bg-white border border-border rounded-[14px] p-[20px_22px]">
            <h3 className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[14px]">
              Estilo Cinematográfico <span className="text-muted lowercase tracking-normal font-normal ml-[5px]">(Opcional)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[16px]">
              <div>
                <label className="font-jetbrains text-[0.65rem] text-muted mb-[6px] block">Tipo de Cinematografía</label>
                <div className="flex gap-[6px] flex-wrap">
                  {['Documental', 'Publicidad emocional', 'Estilo Netflix', 'Viral UGC'].map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => setTipoCinematografia(tipo)}
                      className={`font-jetbrains text-[0.62rem] px-[10px] py-[6px] rounded-[6px] border transition-all cursor-pointer ${
                        tipoCinematografia === tipo ? 'border-magenta bg-magenta-soft text-magenta' : 'border-border text-muted hover:border-text2 hover:text-text2'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="font-jetbrains text-[0.65rem] text-muted mb-[6px] block">Ritmo de Edición</label>
                <div className="flex gap-[6px]">
                  {['Lento', 'Medio', 'Rápido'].map(ritmo => (
                    <button
                      key={ritmo}
                      onClick={() => setRitmoEdicion(ritmo)}
                      className={`font-jetbrains text-[0.62rem] px-[12px] py-[6px] rounded-[6px] border transition-all cursor-pointer ${
                        ritmoEdicion === ritmo ? 'border-violet bg-violet/10 text-violet' : 'border-border text-muted hover:border-text2 hover:text-text2'
                      }`}
                    >
                      {ritmo}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="font-jetbrains text-[0.65rem] text-muted mb-[6px] block">Referencias Visuales</label>
              <input
                type="text"
                value={referenciasVisuales}
                onChange={e => setReferenciasVisuales(e.target.value)}
                placeholder="Ej: estilo Apple, cortes secos, música minimalista..."
                className="input-base w-full font-jetbrains text-[0.75rem]"
              />
            </div>
          </div>

          {/* Guion Canvas */}
          <div className="bg-white border border-border rounded-[14px]">

            {/* Header — igual que Mi Marca análisis */}
            <div className="flex items-center justify-between px-[22px] py-[14px] border-b border-border-soft gap-[10px] flex-wrap rounded-t-[14px] overflow-hidden">
              <div className="flex items-center gap-[8px]">
                <PenTool size={15} className="text-magenta" />
                <span className="font-bebas text-[1.1rem] tracking-[2px] text-text-main">GUION GENERADO</span>
                {guion && !generando && (
                  <span className="font-jetbrains text-[0.58rem] text-green bg-green/10 border border-green/20 rounded-full px-[8px] py-[2px]">
                    Listo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-[8px]">
                <ExportGuionPDF
                  guion={guion}
                  tema={tema}
                  plantilla={plantilla}
                  marcaNombre={marca?.nombre_marca || ''}
                />
                {guion && (
                  <button
                    onClick={copyGuion}
                    className="flex items-center gap-[5px] font-jetbrains text-[0.6rem] text-muted border border-border rounded-[6px] px-[9px] py-[5px] hover:text-magenta hover:border-magenta transition-all cursor-pointer bg-white"
                  >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border-soft">
              {[
                { id: 'guion',    label: '📄 Guion' },
                { id: 'formatos', label: '📡 Adaptar Formatos' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-[20px] py-[11px] font-jetbrains text-[0.65rem] transition-all cursor-pointer border-b-[2px]
                    ${activeSection === tab.id
                      ? 'border-magenta text-magenta bg-magenta-soft'
                      : 'border-transparent text-muted hover:text-text2'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Canvas content — sin overflow-hidden en el padre para no recortar el scroll */}
            {activeSection === 'guion' && (
              <div
                ref={guionRef}
                className="overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
                style={{ minHeight: '260px', maxHeight: '640px' }}
              >
                {guion ? (
                  <pre className="font-jetbrains text-[0.78rem] text-text-main leading-relaxed whitespace-pre-wrap p-[20px_22px_32px]">
                    {guion}
                    {generando && <span className="inline-block w-[8px] h-[4px] bg-magenta ml-[3px] animate-blink rounded-sm" />}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[220px] text-center gap-[8px]">
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
