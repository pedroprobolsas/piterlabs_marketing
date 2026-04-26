import KanbanBoard from '../../components/prospectos/KanbanBoard';

export default function Prospectos() {
  return (
    <div className="flex flex-col h-full">

      {/* Page header */}
      <div className="flex items-center justify-between mb-[24px] shrink-0">
        <div>
          <div className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[2px] mb-[4px]">
            // PITERLABS — MÓDULO B
          </div>
          <h1 className="font-bebas text-[2.2rem] md:text-[2.8rem] tracking-[2px] leading-none text-text-main">
            PROSPECTOS &amp; <span className="text-magenta">OPORTUNIDADES</span>
          </h1>
          <p className="font-syne text-[0.82rem] text-muted mt-[4px]">
            Clientes en riesgo · Cotizaciones activas · Nuevos contactos
          </p>
        </div>

        {/* Leyenda de columnas */}
        <div className="hidden md:flex flex-col gap-[6px] items-end shrink-0">
          <div className="flex items-center gap-[6px] font-jetbrains text-[0.6rem] text-muted">
            <span className="w-[8px] h-[8px] rounded-full bg-orange shrink-0" />
            Clientes sin compra en +45 días
          </div>
          <div className="flex items-center gap-[6px] font-jetbrains text-[0.6rem] text-muted">
            <span className="w-[8px] h-[8px] rounded-full bg-violet shrink-0" />
            Cotizaciones últimos 30 días
          </div>
          <div className="flex items-center gap-[6px] font-jetbrains text-[0.6rem] text-muted">
            <span className="w-[8px] h-[8px] rounded-full bg-magenta shrink-0" />
            Prospectos de WhatsApp / manual
          </div>
        </div>
      </div>

      {/* Kanban — ocupa todo el espacio restante */}
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  );
}
