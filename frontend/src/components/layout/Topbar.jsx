import { Bell, Plus } from 'lucide-react';

export default function Topbar({ title, subtitle }) {
  return (
    <header className="px-[36px] py-[22px] border-b border-border flex items-center justify-between bg-white shrink-0">
      <div className="topbar-left">
        <h1 className="font-bebas text-[2.6rem] tracking-[3px] leading-none text-text-main">
          {title}
        </h1>
        {subtitle && (
          <p className="font-jetbrains text-[0.63rem] text-muted mt-[4px] uppercase tracking-[2px]">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-[10px]">
        <button className="font-syne text-[0.82rem] font-bold px-[22px] py-[10px] rounded-[8px] transition-all duration-200 tracking-[0.3px] bg-transparent border-[1.5px] border-border text-text2 hover:border-magenta hover:text-magenta flex items-center gap-[6px]">
          <Bell size={14} /> Menciones
        </button>
        <button className="font-syne text-[0.82rem] font-bold px-[22px] py-[10px] rounded-[8px] transition-all duration-200 tracking-[0.3px] bg-magenta text-white shadow-[0_4px_16px_rgba(204,0,204,0.2)] hover:bg-magenta-bright hover:shadow-[0_6px_22px_rgba(204,0,204,0.2)] hover:-translate-y-[1px] flex items-center gap-[6px]">
          <Plus size={16} /> NUEVO CONTENIDO
        </button>
      </div>
    </header>
  );
}
