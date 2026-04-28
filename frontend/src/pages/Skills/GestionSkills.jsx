import { useState, useEffect } from 'react';
import { Wand2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Save, RefreshCw, CheckCircle } from 'lucide-react';

const ORDEN_LABELS = ['01', '02', '03', '04', '05'];

function SkillCard({ skill, onSave }) {
  const [expanded, setExpanded]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [form, setForm] = useState({
    nombre:        skill.nombre,
    descripcion:   skill.descripcion || '',
    instrucciones: skill.instrucciones,
    activa:        skill.activa,
  });

  // Sync form if parent skill changes (e.g. after toggle save)
  useEffect(() => {
    setForm({
      nombre:        skill.nombre,
      descripcion:   skill.descripcion || '',
      instrucciones: skill.instrucciones,
      activa:        skill.activa,
    });
  }, [skill]);

  const handleToggle = async () => {
    const newActiva = !form.activa;
    setForm(prev => ({ ...prev, activa: newActiva }));
    await save({ ...form, activa: newActiva });
  };

  const save = async (data) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/skills/${skill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        onSave(json.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error('[GestionSkills]', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = () => save(form);

  const accentColor = form.activa ? 'border-magenta/20' : 'border-border';
  const badgeBg     = form.activa ? 'bg-magenta text-white' : 'bg-surface text-muted';

  return (
    <div className={`bg-white border rounded-[14px] overflow-hidden transition-all ${accentColor}`}>

      {/* Card header */}
      <div className="flex items-center gap-[14px] p-[18px_20px]">

        {/* Order badge */}
        <div className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center font-bebas text-[1rem] tracking-[1px] shrink-0 transition-all ${badgeBg}`}>
          {ORDEN_LABELS[(skill.orden - 1)] ?? '??'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-jetbrains text-[0.78rem] font-bold text-text-main truncate">{form.nombre}</div>
          <div className="font-jetbrains text-[0.62rem] text-muted truncate mt-[2px]">{form.descripcion || 'Sin descripción'}</div>
          <div className="font-jetbrains text-[0.55rem] text-muted/60 mt-[2px] font-mono">{skill.clave}</div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-[10px] shrink-0">
          {saved && (
            <span className="flex items-center gap-[4px] font-jetbrains text-[0.58rem] text-green">
              <CheckCircle size={11} /> Guardado
            </span>
          )}

          {/* Active toggle */}
          <button
            onClick={handleToggle}
            disabled={saving}
            title={form.activa ? 'Desactivar skill' : 'Activar skill'}
            className="cursor-pointer disabled:opacity-50"
          >
            {form.activa
              ? <ToggleRight size={26} className="text-magenta" />
              : <ToggleLeft  size={26} className="text-muted" />}
          </button>

          {/* Expand editor */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-[5px] font-jetbrains text-[0.62rem] text-muted border border-border rounded-[7px] px-[10px] py-[5px] hover:text-magenta hover:border-magenta transition-all cursor-pointer"
          >
            {expanded ? <><ChevronUp size={12} /> Cerrar</> : <><ChevronDown size={12} /> Editar</>}
          </button>
        </div>
      </div>

      {/* Inline editor */}
      {expanded && (
        <div className="border-t border-border-soft p-[18px_20px] space-y-[12px] bg-bg">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
            <div>
              <label className="font-jetbrains text-[0.62rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[6px]">Nombre</label>
              <input
                value={form.nombre}
                onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="input-base text-[0.75rem]"
              />
            </div>
            <div>
              <label className="font-jetbrains text-[0.62rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[6px]">Descripción corta</label>
              <input
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                className="input-base text-[0.75rem]"
                placeholder="Visible en el panel de Skills"
              />
            </div>
          </div>

          <div>
            <label className="font-jetbrains text-[0.62rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[6px]">
              Instrucciones para Claude
              <span className="ml-[8px] font-normal text-muted normal-case tracking-normal">— se inyectan directamente en el prompt de Generar Brief</span>
            </label>
            <textarea
              value={form.instrucciones}
              onChange={e => setForm(p => ({ ...p, instrucciones: e.target.value }))}
              rows={8}
              className="input-base resize-y text-[0.72rem] leading-relaxed font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="flex items-center gap-[7px] bg-magenta text-white font-bebas text-[0.9rem] tracking-[1.5px] px-[18px] py-[9px] rounded-[9px] cursor-pointer hover:bg-magenta-bright transition-all disabled:opacity-50 shadow-[0_3px_10px_rgba(204,0,204,0.2)]"
            >
              {saving
                ? <><RefreshCw size={13} className="animate-spin" /> GUARDANDO</>
                : <><Save size={13} /> GUARDAR CAMBIOS</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GestionSkills() {
  const [skills, setSkills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(json => {
        if (json.success) setSkills(json.data);
        else setError(json.error);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updated) => {
    setSkills(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const activeCount = skills.filter(s => s.activa).length;

  return (
    <div className="w-full max-w-[860px]">

      {/* Header */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Wand2 size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">GESTIÓN DE SKILLS</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Las instrucciones de cada skill se inyectan en el prompt de Claude al generar un Brief de Producción en{' '}
          <span className="text-magenta">Producir Video</span>.
          Desactiva una skill para excluirla del Brief.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && skills.length > 0 && (
        <div className="flex items-center gap-[16px] mb-[20px] bg-white border border-border rounded-[12px] p-[14px_20px]">
          <div className="font-jetbrains text-[0.68rem] text-muted">
            <span className="text-text-main font-bold text-[0.9rem]">{activeCount}</span>
            {' '}de{' '}
            <span className="text-text-main font-bold text-[0.9rem]">{skills.length}</span>
            {' '}skills activas
          </div>
          <div className="flex gap-[4px]">
            {skills.map(s => (
              <div
                key={s.id}
                title={s.nombre}
                className={`w-[8px] h-[8px] rounded-full transition-all ${s.activa ? 'bg-magenta' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="space-y-[10px]">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-[76px] bg-white border border-border rounded-[14px] animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="font-jetbrains text-[0.7rem] text-red bg-red/5 border border-red/20 rounded-[10px] p-[14px_18px]">
          {error}
        </div>
      )}

      {/* Skills list */}
      {!loading && !error && (
        <div className="space-y-[10px]">
          {skills.map(skill => (
            <SkillCard key={skill.id} skill={skill} onSave={handleSave} />
          ))}
        </div>
      )}

    </div>
  );
}
