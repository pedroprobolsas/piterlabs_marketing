export default function BuyerPersonaCard({ persona, loading, onGenerate }) {
  if (loading) {
    return (
      <div className="bg-white border border-border rounded-[14px] p-[24px] flex items-center justify-center gap-[10px] min-h-[160px]">
        <div className="w-[8px] h-[8px] rounded-full bg-magenta animate-blink"></div>
        <span className="font-jetbrains text-[0.75rem] text-magenta">Generando buyer persona...</span>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="bg-white border-[1.5px] border-dashed border-border rounded-[14px] p-[24px] text-center">
        <div className="font-bebas text-[1.4rem] tracking-[2px] text-muted mb-[6px]">SIN BUYER PERSONA</div>
        <div className="font-jetbrains text-[0.7rem] text-muted mb-[16px]">
          Completa el formulario de marca y genera tu cliente ideal con IA
        </div>
        <button
          onClick={onGenerate}
          className="bg-magenta text-white font-bebas text-[0.9rem] tracking-[1.5px] px-[20px] py-[9px] rounded-[8px] cursor-pointer hover:bg-magenta-bright transition-colors shadow-[0_4px_14px_rgba(204,0,204,0.2)]"
        >
          ✦ GENERAR CON IA
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-[14px] overflow-hidden">
      {/* Header */}
      <div className="bg-magenta-soft border-b border-magenta/15 px-[20px] py-[14px] flex items-center justify-between">
        <div>
          <div className="font-bebas text-[1.3rem] tracking-[2px] text-magenta">{persona.nombre}</div>
          <div className="font-jetbrains text-[0.65rem] text-text2">{persona.ocupacion} · {persona.ciudad}</div>
        </div>
        <button
          onClick={onGenerate}
          className="font-jetbrains text-[0.6rem] text-magenta border border-magenta/30 rounded-[6px] px-[10px] py-[5px] hover:bg-magenta hover:text-white transition-all cursor-pointer"
        >
          Regenerar
        </button>
      </div>

      {/* Body */}
      <div className="p-[16px_20px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
        <Field label="💸 Ingreso mensual" value={persona.ingreso_mensual} />
        <Field label="📡 Canal favorito"  value={persona.canal_favorito} />
        <Field label="😣 Dolor principal" value={persona.dolor_principal} fullWidth />
        <Field label="🎯 Aspiración"      value={persona.aspiracion}     fullWidth />
        <Field label="🚧 Objeción típica" value={persona.objecion_tipica} fullWidth />
        <Field label="🔍 Cómo llega"      value={persona.como_llega}      fullWidth />
      </div>

      {/* Frase */}
      {persona.frase_tipica && (
        <div className="mx-[20px] mb-[16px] bg-bg border-l-[3px] border-magenta pl-[14px] pr-[12px] py-[10px] rounded-r-[8px]">
          <div className="font-jetbrains text-[0.58rem] text-muted uppercase tracking-[1px] mb-[4px]">Dice en voz alta</div>
          <div className="font-syne text-[0.82rem] text-text-main italic">"{persona.frase_tipica}"</div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, fullWidth }) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <div className="font-jetbrains text-[0.6rem] text-muted mb-[3px]">{label}</div>
      <div className="font-syne text-[0.8rem] text-text-main">{value || '—'}</div>
    </div>
  );
}
