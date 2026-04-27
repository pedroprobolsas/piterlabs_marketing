import { useState, useEffect, useRef } from 'react';
import { Save, Sparkles, Brain, RefreshCw } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import ArquetipoSelector from '../../components/cerebro/ArquetipoSelector';
import BuyerPersonaCard from '../../components/cerebro/BuyerPersonaCard';

const TONOS = [
  { value: 'inspiracional', label: 'Inspiracional', desc: 'Motiva y eleva' },
  { value: 'educativo',     label: 'Educativo',     desc: 'Enseña y guía' },
  { value: 'confrontador',  label: 'Confrontador',  desc: 'Desafía y sacude' },
  { value: 'cercano',       label: 'Cercano',       desc: 'Conecta y empatiza' },
];

export default function MiMarca() {
  const { marca, loading, saving, saveMarca } = useMarca();

  const [form, setForm] = useState({
    nombre_marca:    '',
    industria:       '',
    propuesta_valor: '',
    tono_voz:        'cercano',
    arquetipos:      [],
  });

  const [saveMsg, setSaveMsg]       = useState('');
  const [analysis, setAnalysis]     = useState('');
  const [analyzing, setAnalyzing]   = useState(false);
  const [persona, setPersona]       = useState(null);
  const [genPersona, setGenPersona] = useState(false);
  const analysisRef = useRef(null);

  // Pre-fill form when DB data loads
  useEffect(() => {
    if (marca) {
      setForm({
        nombre_marca:    marca.nombre_marca    || '',
        industria:       marca.industria       || '',
        propuesta_valor: marca.propuesta_valor || '',
        tono_voz:        marca.tono_voz        || 'cercano',
        arquetipos:      marca.arquetipos      || [],
      });
      if (marca.buyer_persona && Object.keys(marca.buyer_persona).length) {
        setPersona(marca.buyer_persona);
      }
    }
  }, [marca]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveMarca({ ...form, buyer_persona: persona || {} });
      setSaveMsg('Guardado');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('Error al guardar');
    }
  };

  const handleAnalizar = async () => {
    if (!form.nombre_marca || !form.industria) return;
    setAnalyzing(true);
    setAnalysis('');

    try {
      const res = await fetch('/api/claude/analizar-marca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
              setAnalysis(prev => prev + evt.text);
              setTimeout(() => analysisRef.current?.scrollTo({ top: analysisRef.current.scrollHeight, behavior: 'smooth' }), 20);
            }
          } catch { /* ignore parse errors on partial chunks */ }
        }
      }
    } catch (e) {
      setAnalysis(`Error: ${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerarPersona = async () => {
    if (!form.nombre_marca || !form.industria) return;
    setGenPersona(true);
    setPersona(null);

    try {
      const res = await fetch('/api/claude/buyer-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPersona(json.data);
        // Auto-save buyer persona to DB
        await saveMarca({ ...form, buyer_persona: json.data });
      }
    } catch (e) {
      console.error('[MiMarca][generarPersona]', e.message);
    } finally {
      setGenPersona(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px] gap-[10px]">
        <div className="w-[8px] h-[8px] rounded-full bg-magenta animate-blink"></div>
        <span className="font-jetbrains text-[0.75rem] text-muted">Cargando configuración de marca...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px]">

      {/* Header */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Brain size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">CONFIGURACIÓN DE MARCA</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Define la identidad de tu marca. Esta información alimenta todos los módulos de IA del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-[20px]">

        {/* LEFT: Form */}
        <div className="space-y-[20px]">

          {/* Brand basics card */}
          <form onSubmit={handleSave} className="bg-white border border-border rounded-[14px] p-[22px_24px]">
            <div className="font-jetbrains text-[0.65rem] text-muted uppercase tracking-[2px] mb-[18px] font-bold">
              Identidad de Marca
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[14px]">
              <FormField label="Nombre de Marca" required>
                <input
                  value={form.nombre_marca}
                  onChange={e => handleChange('nombre_marca', e.target.value)}
                  placeholder="Ej: Probolsas S.A.S."
                  className="input-base"
                />
              </FormField>
              <FormField label="Industria" required>
                <input
                  value={form.industria}
                  onChange={e => handleChange('industria', e.target.value)}
                  placeholder="Ej: Empaques industriales"
                  className="input-base"
                />
              </FormField>
            </div>

            <FormField label="Propuesta de Valor" className="mb-[14px]">
              <textarea
                value={form.propuesta_valor}
                onChange={e => handleChange('propuesta_valor', e.target.value)}
                placeholder="¿Por qué un cliente elige tu marca sobre la competencia? (1-2 oraciones)"
                rows={3}
                className="input-base resize-none"
              />
            </FormField>

            {/* Tono de voz */}
            <div className="mb-[18px]">
              <label className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[10px]">
                Tono de Voz
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px]">
                {TONOS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleChange('tono_voz', t.value)}
                    className={`p-[10px_12px] rounded-[10px] border-[1.5px] text-left transition-all duration-150 cursor-pointer
                      ${form.tono_voz === t.value
                        ? 'border-magenta bg-magenta-soft'
                        : 'border-border bg-white hover:border-magenta/40'}`}
                  >
                    <div className={`font-syne font-bold text-[0.78rem] mb-[2px] ${form.tono_voz === t.value ? 'text-magenta' : 'text-text-main'}`}>
                      {t.label}
                    </div>
                    <div className="font-jetbrains text-[0.58rem] text-muted">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <div className="flex items-center gap-[12px]">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-[8px] bg-magenta text-white font-bebas text-[1rem] tracking-[1.5px] px-[22px] py-[10px] rounded-[9px] cursor-pointer hover:bg-magenta-bright transition-all shadow-[0_4px_14px_rgba(204,0,204,0.2)] disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? 'GUARDANDO...' : 'GUARDAR MARCA'}
              </button>
              {saveMsg && (
                <span className={`font-jetbrains text-[0.68rem] ${saveMsg.startsWith('Error') ? 'text-red' : 'text-green'}`}>
                  {saveMsg}
                </span>
              )}
            </div>
          </form>

          {/* Arquetipos */}
          <div className="bg-white border border-border rounded-[14px] p-[22px_24px]">
            <ArquetipoSelector
              selected={form.arquetipos}
              onChange={vals => handleChange('arquetipos', vals)}
            />
          </div>

          {/* Claude Analysis Panel */}
          <div className="bg-white border border-border rounded-[14px] overflow-hidden">
            <div className="flex items-center justify-between px-[22px] py-[16px] border-b border-border-soft">
              <div className="flex items-center gap-[8px]">
                <Sparkles size={16} className="text-magenta" />
                <span className="font-bebas text-[1.1rem] tracking-[2px] text-text-main">ANÁLISIS ESTRATÉGICO</span>
              </div>
              <button
                onClick={handleAnalizar}
                disabled={analyzing || !form.nombre_marca || !form.industria}
                className="flex items-center gap-[7px] font-bebas text-[0.85rem] tracking-[1.5px] bg-magenta text-white px-[16px] py-[8px] rounded-[8px] cursor-pointer hover:bg-magenta-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_3px_10px_rgba(204,0,204,0.15)]"
              >
                {analyzing ? <><RefreshCw size={14} className="animate-spin" /> ANALIZANDO...</> : <><Sparkles size={14} /> ANALIZAR MARCA</>}
              </button>
            </div>

            <div
              ref={analysisRef}
              className="p-[20px_22px] min-h-[120px] max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            >
              {analysis ? (
                <div className="font-jetbrains text-[0.78rem] text-text-main leading-relaxed whitespace-pre-wrap">
                  {analysis}
                  {analyzing && <span className="inline-block w-[8px] h-[4px] bg-magenta ml-[3px] animate-blink rounded-sm" />}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[100px] text-center">
                  <div className="font-jetbrains text-[0.68rem] text-muted">
                    {form.nombre_marca && form.industria
                      ? 'Haz clic en "Analizar Marca" para obtener un diagnóstico estratégico con IA'
                      : 'Completa nombre de marca e industria para habilitar el análisis'}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT: Buyer Persona */}
        <div>
          <div className="font-jetbrains text-[0.65rem] text-muted uppercase tracking-[2px] mb-[12px] font-bold">
            Buyer Persona
          </div>
          <BuyerPersonaCard
            persona={persona}
            loading={genPersona}
            onGenerate={handleGenerarPersona}
          />
          {persona && (
            <p className="font-jetbrains text-[0.6rem] text-muted mt-[8px] text-center">
              Guardado automáticamente en tu perfil de marca
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

function FormField({ label, required, className = '', children }) {
  return (
    <div className={className}>
      <label className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[6px]">
        {label}{required && <span className="text-magenta ml-[3px]">*</span>}
      </label>
      {children}
    </div>
  );
}
