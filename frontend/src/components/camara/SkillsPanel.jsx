import { Captions, Layers, ToggleLeft, ToggleRight } from 'lucide-react';

const SKILLS = [
  {
    id: 'captions',
    icon: Captions,
    label: 'Zero-Click Captions',
    description: 'Superpone texto con 3 estilos cinematográficos',
    color: 'text-magenta',
    accent: 'border-magenta/20 bg-magenta-soft',
  },
  {
    id: 'parallax',
    icon: Layers,
    label: 'Parallax VFX',
    description: 'Efecto de profundidad sobre imágenes estáticas',
    color: 'text-violet',
    accent: 'border-violet/20 bg-violet/5',
    onlyImage: true,
  },
];

const CAPTION_STYLES = [
  { id: 'viral',      label: 'Viral TikTok',          desc: 'Bold · Uppercase · Stroke' },
  { id: 'documental', label: 'Elegante Documental',   desc: 'Serif · Sutil · Centrado' },
  { id: 'impacto',    label: 'Impacto Rápido',        desc: 'Condensado · Fondo · Amarillo' },
];

export default function SkillsPanel({ skills, onToggle, captionConfig, onCaptionChange, mediaType }) {
  return (
    <div className="bg-white border border-border rounded-[14px] p-[20px_22px] space-y-[14px]">
      <label className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold block">
        Skills
      </label>

      {SKILLS.map((skill) => {
        const Icon = skill.icon;
        const active = skills[skill.id];
        const disabled = skill.onlyImage && mediaType !== 'image';

        return (
          <div
            key={skill.id}
            className={`border rounded-[12px] p-[14px_16px] transition-all
              ${active && !disabled ? skill.accent : 'border-border bg-bg-soft'}
              ${disabled ? 'opacity-40' : ''}`}
          >
            {/* Toggle header */}
            <div className="flex items-center justify-between gap-[10px]">
              <div className="flex items-center gap-[8px]">
                <Icon size={15} className={active && !disabled ? skill.color : 'text-muted'} />
                <div>
                  <div className="font-jetbrains text-[0.7rem] text-text-main font-bold">{skill.label}</div>
                  <div className="font-jetbrains text-[0.6rem] text-muted">{skill.description}</div>
                </div>
              </div>
              <button
                onClick={() => !disabled && onToggle(skill.id)}
                disabled={disabled}
                className="cursor-pointer shrink-0"
                title={disabled ? 'Solo disponible con imágenes' : (active ? 'Desactivar' : 'Activar')}
              >
                {active && !disabled
                  ? <ToggleRight size={24} className={skill.color} />
                  : <ToggleLeft size={24} className="text-muted" />}
              </button>
            </div>

            {/* Caption sub-panel */}
            {skill.id === 'captions' && active && !disabled && (
              <div className="mt-[14px] space-y-[10px]">

                {/* Style selector */}
                <div className="grid grid-cols-3 gap-[6px]">
                  {CAPTION_STYLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => onCaptionChange({ style: s.id })}
                      className={`rounded-[8px] p-[8px_6px] border text-center transition-all cursor-pointer
                        ${captionConfig.style === s.id
                          ? 'border-magenta bg-magenta text-white'
                          : 'border-border bg-white text-text2 hover:border-magenta/40'}`}
                    >
                      <div className="font-jetbrains text-[0.58rem] font-bold leading-tight">{s.label}</div>
                      <div className={`font-jetbrains text-[0.52rem] mt-[2px] ${captionConfig.style === s.id ? 'text-white/70' : 'text-muted'}`}>{s.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Text input */}
                <textarea
                  value={captionConfig.text}
                  onChange={e => onCaptionChange({ text: e.target.value })}
                  placeholder="Escribe el caption aquí…"
                  rows={2}
                  className="input-base resize-none text-[0.72rem]"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
