import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, FileText, RefreshCw } from 'lucide-react';

const NAR_STYLES = [
  { id: 'netflix',   label: 'Documental Netflix' },
  { id: 'tiktok',    label: 'Hook Viral TikTok' },
  { id: 'emocional', label: 'Storytelling Emocional' },
];

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload  = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Error leyendo imagen'));
});

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-[5px] font-jetbrains text-[0.6rem] text-muted border border-border rounded-[6px] px-[9px] py-[5px] hover:text-magenta hover:border-magenta transition-all cursor-pointer bg-white shrink-0"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

export default function BriefPanel({ marca, mediaFile }) {
  const [guion, setGuion]     = useState(() => {
    return localStorage.getItem('piterlabs_guion_reciente') || '';
  });
  const [loading, setLoading]   = useState(false);
  const [brief, setBrief]       = useState(null);
  const [error, setError]       = useState('');
  const [skills, setSkills]     = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [activeNar, setActiveNar] = useState('netflix');

  // Cargar skills activas para construir la interfaz
  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const active = json.data.filter(s => s.activa);
          setSkills(active);
          if (active.length > 0) setActiveTab(active[0].clave);
        }
      })
      .catch(err => console.error('[BriefPanel] Error fetching skills:', err.message));
  }, []);

  // Guardar cambios del textarea en localStorage
  useEffect(() => {
    localStorage.setItem('piterlabs_guion_reciente', guion);
  }, [guion]);

  const handleGenerar = async () => {
    if (guion.trim().length < 20) {
      setError('El guion debe tener al menos 20 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    setBrief(null);

    try {
      let imagen_base64 = null;
      if (mediaFile && mediaFile.type.startsWith('image/')) {
        imagen_base64 = await fileToBase64(mediaFile);
      }

      const res = await fetch('/api/claude/generar-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guion, marca: marca || {}, imagen_base64 }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || 'Error generando el brief');
        return;
      }

      if (json.data) {
        setBrief(json.data);
      } else {
        setError('Claude no devolvió un JSON válido. Intenta de nuevo.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getTabContent = () => {
    if (!brief) return '';
    if (activeTab === 'narracion') {
      return typeof brief.narracion === 'object'
        ? (brief.narracion[activeNar] || '')
        : (brief.narracion || '');
    }
    return brief[activeTab] || '';
  };

  const activeSkill = skills.find(s => s.clave === activeTab);

  return (
    <div className="bg-white border border-border rounded-[14px] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-[22px] py-[14px] border-b border-border-soft">
        <div className="flex items-center gap-[8px]">
          <FileText size={15} className="text-magenta" />
          <span className="font-bebas text-[1.1rem] tracking-[2px] text-text-main">BRIEF DE PRODUCCIÓN</span>
          <span className="font-jetbrains text-[0.55rem] text-muted bg-surface border border-border rounded-full px-[8px] py-[2px]">
            {skills.length} SKILLS
          </span>
        </div>
        {brief && (
          <span className="font-jetbrains text-[0.58rem] text-green bg-green/10 border border-green/20 rounded-full px-[8px] py-[2px]">
            Generado
          </span>
        )}
      </div>

      <div className="p-[18px_22px] space-y-[14px]">

        {/* Guion textarea */}
        <div>
          <label className="font-jetbrains text-[0.68rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[8px]">
            Guion del Bloque 2 <span className="text-magenta">*</span>
          </label>
          <textarea
            value={guion}
            onChange={e => setGuion(e.target.value)}
            placeholder="Pega aquí el guion generado en Crear Guion…"
            rows={7}
            className="input-base resize-none text-[0.72rem] leading-relaxed"
          />
          {mediaFile?.type.startsWith('image/') && (
            <p className="font-jetbrains text-[0.6rem] text-violet mt-[5px]">
              ✦ Imagen del producto incluida — Claude usará Vision para analizarla
            </p>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerar}
          disabled={loading || guion.trim().length < 20 || skills.length === 0}
          className="w-full flex items-center justify-center gap-[8px] bg-magenta text-white font-bebas text-[1.1rem] tracking-[2px] px-[20px] py-[12px] rounded-[10px] cursor-pointer hover:bg-magenta-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(204,0,204,0.2)]"
        >
          {loading
            ? <><RefreshCw size={15} className="animate-spin" /> GENERANDO BRIEF...</>
            : <><Sparkles size={15} /> GENERAR BRIEF</>}
        </button>

        {error && (
          <p className="font-jetbrains text-[0.65rem] text-red bg-red/5 border border-red/20 rounded-[8px] px-[12px] py-[8px]">
            {error}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-[8px] pt-[4px]">
            <div className="font-jetbrains text-[0.62rem] text-muted text-center">
              Claude está analizando el guion y generando los {skills.length} briefs…
            </div>
            {[80, 60, 90, 70, 75].slice(0, skills.length).map((w, i) => (
              <div key={i} className="h-[8px] bg-border rounded-full animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}

        {/* Results */}
        {brief && !loading && (
          <div className="border border-border rounded-[12px] overflow-hidden">

            {/* Main tabs */}
            <div className="flex border-b border-border-soft overflow-x-auto scrollbar-thin">
              {skills.map(tab => (
                <button
                  key={tab.clave}
                  onClick={() => setActiveTab(tab.clave)}
                  className={`px-[14px] py-[10px] font-jetbrains text-[0.62rem] whitespace-nowrap transition-all cursor-pointer border-b-[2px] shrink-0
                    ${activeTab === tab.clave
                      ? 'border-magenta text-magenta bg-magenta-soft'
                      : 'border-transparent text-muted hover:text-text2'}`}
                >
                  {tab.label_tab || tab.nombre}
                </button>
              ))}
            </div>

            {/* Tab title + copy */}
            <div className="flex items-start justify-between px-[14px] py-[10px] border-b border-border-soft bg-bg-soft gap-[8px]">
              <div className="flex flex-col gap-[3px] min-w-0">
                <span className="font-jetbrains text-[0.62rem] text-text2 font-bold">
                  {activeSkill?.titulo_panel || activeSkill?.nombre}
                </span>
                <span className="font-jetbrains text-[0.58rem] text-muted leading-snug">
                  {activeSkill?.descripcion}
                </span>
              </div>
              <CopyButton text={getTabContent()} />
            </div>

            {/* Narración sub-tabs */}
            {activeTab === 'narracion' && typeof brief.narracion === 'object' && (
              <div className="flex border-b border-border-soft bg-white px-[14px] gap-[4px] pt-[8px]">
                {NAR_STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveNar(s.id)}
                    className={`px-[10px] py-[5px] rounded-t-[6px] font-jetbrains text-[0.58rem] cursor-pointer border transition-all
                      ${activeNar === s.id
                        ? 'border-magenta border-b-white text-magenta bg-white -mb-px'
                        : 'border-transparent text-muted hover:text-text2'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="p-[14px] max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <pre className="font-jetbrains text-[0.72rem] text-text-main leading-relaxed whitespace-pre-wrap">
                {getTabContent() || <span className="text-muted italic">Sin contenido para este skill</span>}
              </pre>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
