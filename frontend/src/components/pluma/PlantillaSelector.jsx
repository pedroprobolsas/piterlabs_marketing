const PLANTILLAS = [
  {
    id: 'problema_solucion',
    nombre: 'PAS',
    titulo: 'Problema → Solución',
    desc: 'Presenta el dolor del cliente, lo intensifica y ofrece tu solución como la salida lógica.',
    estructura: ['Problema', 'Agitación', 'Solución'],
    emoji: '🎯',
  },
  {
    id: 'antes_despues',
    nombre: 'ANTES / DESPUÉS',
    titulo: 'Transformación',
    desc: 'Muestra el contraste entre el estado actual y el estado deseado que tu marca hace posible.',
    estructura: ['Antes', 'Después', 'Puente'],
    emoji: '🔄',
  },
  {
    id: 'storytelling',
    nombre: 'HISTORIA',
    titulo: 'Storytelling',
    desc: 'Narrativa emocional con personaje, conflicto y resolución. La más memorable de las tres.',
    estructura: ['Personaje', 'Conflicto', 'Resolución'],
    emoji: '📖',
  },
];

export default function PlantillaSelector({ selected, onChange }) {
  return (
    <div>
      <div className="font-jetbrains text-[0.65rem] text-muted uppercase tracking-[2px] mb-[12px] font-bold">
        Plantilla Narrativa
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
        {PLANTILLAS.map(p => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={`text-left p-[14px_16px] rounded-[12px] border-[1.5px] transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'border-magenta bg-magenta-soft shadow-[0_4px_14px_rgba(204,0,204,0.1)]'
                  : 'border-border bg-white hover:border-magenta/40 hover:bg-magenta-soft/40'}`}
            >
              <div className="text-[1.4rem] mb-[6px]">{p.emoji}</div>
              <div className={`font-jetbrains text-[0.58rem] uppercase tracking-[1px] mb-[2px] ${isSelected ? 'text-magenta' : 'text-muted'}`}>
                {p.nombre}
              </div>
              <div className={`font-syne font-bold text-[0.85rem] mb-[6px] ${isSelected ? 'text-magenta' : 'text-text-main'}`}>
                {p.titulo}
              </div>
              <div className="font-jetbrains text-[0.62rem] text-muted mb-[10px] leading-tight">
                {p.desc}
              </div>
              <div className="flex gap-[5px] flex-wrap">
                {p.estructura.map((e, i) => (
                  <span
                    key={i}
                    className={`font-jetbrains text-[0.55rem] px-[7px] py-[2px] rounded-full border
                      ${isSelected ? 'bg-white border-magenta/30 text-magenta' : 'bg-bg border-border text-muted'}`}
                  >
                    {i + 1}. {e}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
