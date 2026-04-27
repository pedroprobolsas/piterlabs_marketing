const ARQUETIPOS = [
  { id: 'heroe',      label: 'El Héroe',      emoji: '⚔️', desc: 'Supera obstáculos y logra hazañas' },
  { id: 'sabio',      label: 'El Sabio',      emoji: '🦉', desc: 'Guía con conocimiento y verdad' },
  { id: 'explorador', label: 'El Explorador', emoji: '🧭', desc: 'Descubre y abraza lo nuevo' },
  { id: 'inocente',   label: 'El Inocente',   emoji: '☀️', desc: 'Optimismo y pureza de intención' },
  { id: 'gobernante', label: 'El Gobernante', emoji: '👑', desc: 'Liderazgo, orden y control' },
  { id: 'creador',    label: 'El Creador',    emoji: '🎨', desc: 'Innovación y expresión artística' },
  { id: 'cuidador',   label: 'El Cuidador',   emoji: '🤝', desc: 'Protege y nutre a los demás' },
  { id: 'mago',       label: 'El Mago',       emoji: '✨', desc: 'Transforma y hace lo imposible' },
  { id: 'rebelde',    label: 'El Rebelde',    emoji: '⚡', desc: 'Rompe reglas y desafía el statu quo' },
  { id: 'amante',     label: 'El Amante',     emoji: '❤️', desc: 'Pasión, conexión y placer' },
  { id: 'bufon',      label: 'El Bufón',      emoji: '🎭', desc: 'Humor, ligereza y alegría' },
  { id: 'forajido',   label: 'El Forajido',   emoji: '🔥', desc: 'Auténtico, sin disculpas' },
];

export default function ArquetipoSelector({ selected = [], onChange, max = 3 }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(a => a !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-[10px]">
        <label className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold">
          Arquetipos de Marca
        </label>
        <span className="font-jetbrains text-[0.62rem] text-muted">
          {selected.length}/{max} seleccionados
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[8px]">
        {ARQUETIPOS.map(a => {
          const isSelected = selected.includes(a.id);
          const isDisabled = !isSelected && selected.length >= max;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              disabled={isDisabled}
              className={`
                text-left p-[10px_12px] rounded-[10px] border-[1.5px] transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'border-magenta bg-magenta-soft shadow-[0_2px_10px_rgba(204,0,204,0.1)]'
                  : isDisabled
                  ? 'border-border bg-bg opacity-40 cursor-not-allowed'
                  : 'border-border bg-white hover:border-magenta/40 hover:bg-magenta-soft/50'}
              `}
            >
              <div className="text-[1.1rem] mb-[4px]">{a.emoji}</div>
              <div className={`font-syne font-bold text-[0.75rem] ${isSelected ? 'text-magenta' : 'text-text-main'}`}>
                {a.label}
              </div>
              <div className="font-jetbrains text-[0.57rem] text-muted mt-[2px] leading-tight">
                {a.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
