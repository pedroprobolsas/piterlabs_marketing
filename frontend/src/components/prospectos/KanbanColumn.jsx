import ProspectoCard from './ProspectoCard';

// Skeleton loader para estado de carga
function CardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-[10px] p-[14px_16px] animate-pulse">
      <div className="h-[14px] bg-surface rounded w-3/4 mb-[8px]" />
      <div className="h-[10px] bg-surface rounded w-1/2 mb-[10px]" />
      <div className="h-[10px] bg-surface rounded w-2/3" />
    </div>
  );
}

export default function KanbanColumn({ title, accentColor, data, loading, error, tipo, onAddClick }) {
  const count = data?.length ?? 0;

  return (
    <div className="flex flex-col min-w-[280px] md:min-w-0 md:flex-1 bg-surface rounded-[12px] p-[14px_12px] h-full max-h-[calc(100vh-220px)]">

      {/* Column Header */}
      <div className="flex items-center justify-between mb-[14px] shrink-0">
        <div className="flex items-center gap-[8px]">
          <div className="w-[3px] h-[18px] rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="font-bebas text-[1.1rem] tracking-[1.5px] text-text-main leading-none">
            {title}
          </span>
          <span
            className="font-jetbrains text-[0.6rem] px-[7px] py-[2px] rounded-full font-bold"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            {count}
          </span>
        </div>
        {/* Botón + solo en columna Nuevos */}
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="w-[26px] h-[26px] rounded-full bg-white border border-border text-muted hover:border-magenta hover:text-magenta hover:bg-magenta-soft transition-all duration-200 flex items-center justify-center text-[1rem] leading-none font-light"
            title="Agregar prospecto"
          >
            +
          </button>
        )}
      </div>

      {/* Cards scroll area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-[8px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-[2px]">

        {/* Loading state */}
        {loading && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-[24px]">
            <div className="text-[1.5rem] mb-[6px]">⚠️</div>
            <p className="font-jetbrains text-[0.68rem] text-red">Error al cargar</p>
            <p className="font-jetbrains text-[0.6rem] text-muted mt-[2px]">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && count === 0 && (
          <div className="text-center py-[24px]">
            <div className="text-[1.5rem] mb-[6px]">✦</div>
            <p className="font-jetbrains text-[0.68rem] text-muted">Sin registros</p>
          </div>
        )}

        {/* Data */}
        {!loading && !error && data?.map((item, i) => (
          <ProspectoCard
            key={item.id || item.nro_cotizacion || `${tipo}-${i}`}
            prospecto={item}
            tipo={tipo}
          />
        ))}
      </div>
    </div>
  );
}
