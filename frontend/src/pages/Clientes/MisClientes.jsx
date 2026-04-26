import { Filter, Download, User } from 'lucide-react';

export default function MisClientes() {
  const dummyClientes = [
    { id: 1, nombre: 'Distribuidora XYZ', ciudad: 'Bogotá', asesor: 'Piter', totalCompras: '$12,500,000', ultimCompra: 'Hace 2 días', score: 95, state: 'hot' },
    { id: 2, nombre: 'Empaques del Norte', ciudad: 'Medellín', asesor: 'Carlos Gómez', totalCompras: '$4,200,000', ultimCompra: 'Hace 15 días', score: 68, state: 'new' },
    { id: 3, nombre: 'Panadería San José', ciudad: 'Cali', asesor: 'Piter', totalCompras: '$850,000', ultimCompra: 'Hace 45 días', score: 32, state: 'cold' }
  ];

  return (
    <div className="w-full">
      <div className="bg-white border rounded-[14px] border-border p-[24px]">
        <div className="flex justify-between items-center mb-[20px]">
          <div>
            <h2 className="font-bebas text-[1.35rem] tracking-[2px] text-text-main">Directorio de Clientes</h2>
            <p className="font-jetbrains text-[0.6rem] text-muted uppercase tracking-[1.5px] mt-[3px]">Lectura en tiempo real PostgreSQL</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-bg border border-border px-[14px] py-[8px] rounded-[6px] font-syne text-[0.75rem] font-bold text-text2 hover:border-magenta hover:text-magenta transition-all">
              <Filter size={14} /> Filtros
            </button>
            <button className="flex items-center gap-2 bg-magenta text-white px-[14px] py-[8px] rounded-[6px] font-syne text-[0.75rem] font-bold shadow-[0_4px_10px_rgba(204,0,204,0.2)] hover:bg-magenta-bright hover:-translate-y-[1px] transition-all">
              <Download size={14} /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Listado */}
        <div className="flex flex-col gap-[9px]">
          {dummyClientes.map(c => (
            <div key={c.id} className="flex items-center gap-[12px] p-[11px_13px] bg-bg border border-border-soft rounded-[9px] hover:bg-magenta-soft hover:border-magenta/20 transition-all cursor-pointer">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-magenta flex items-center justify-center text-[0.72rem] font-extrabold text-white shrink-0">
                <User size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.82rem] font-bold text-text-main">{c.nombre}</div>
                <div className="font-jetbrains text-[0.6rem] text-muted mt-[2px] uppercase">
                  {c.ciudad} • {c.asesor}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bebas text-[1rem] tracking-[1px] text-text-main">{c.totalCompras}</div>
                <div className="font-jetbrains text-[0.55rem] text-muted mt-[1px]">{c.ultimCompra}</div>
              </div>
              <div className={`font-jetbrains text-[0.58rem] px-[9px] py-[3px] rounded-[20px] font-semibold shrink-0 ml-[12px]
                ${c.state === 'hot' ? 'bg-orange/10 text-orange border border-orange/20' : ''}
                ${c.state === 'new' ? 'bg-magenta-soft text-magenta border border-magenta/20' : ''}
                ${c.state === 'cold' ? 'bg-muted/10 text-muted border border-border' : ''}
              `}>
                SCORE: {c.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
