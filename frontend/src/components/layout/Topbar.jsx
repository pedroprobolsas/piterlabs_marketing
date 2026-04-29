import { Bell, Plus, Menu } from 'lucide-react';

// Claves de sesión que se limpian al iniciar nuevo contenido
const SESSION_KEYS = [
  'piterlabs_guion_reciente',
  'piterlabs_guion_tema',
  'piterlabs_ideas_recientes',
  'estratega_messages',
  'estratega_fichaId',
  'estratega_adn',
  'estratega_imagen',
];

export default function Topbar({ title, subtitle, toggleSidebar, onNuevoContenido }) {

  const handleNuevoContenido = () => {
    SESSION_KEYS.forEach(key => localStorage.removeItem(key));
    if (onNuevoContenido) onNuevoContenido();
    // Reload para reflejar el estado limpio en cualquier página
    window.location.reload();
  };

  return (
    <header className="px-[16px] md:px-[36px] py-[16px] md:py-[22px] border-b border-border flex items-center justify-between bg-white shrink-0">
      <div className="flex items-center gap-[12px] md:gap-[0]">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-text-main hover:text-magenta transition-colors bg-surface rounded-md"
        >
          <Menu size={20} />
        </button>
        <div className="topbar-left">
          <h1 className="font-bebas text-[1.8rem] md:text-[2.6rem] tracking-[2px] md:tracking-[3px] leading-none text-text-main">
            {title}
          </h1>
        {subtitle && (
          <p className="font-jetbrains text-[0.63rem] text-muted mt-[4px] uppercase tracking-[2px]">
            {subtitle}
          </p>
        )}
      </div>
      </div>
      
      <div className="flex items-center gap-[6px] md:gap-[10px]">
        <button className="font-syne text-[0.82rem] font-bold px-[12px] md:px-[22px] py-[8px] md:py-[10px] rounded-[8px] transition-all duration-200 tracking-[0.3px] bg-transparent border-[1.5px] border-border text-text2 hover:border-magenta hover:text-magenta flex items-center gap-[6px]">
          <Bell size={14} /> <span className="hidden md:inline">Menciones</span>
        </button>
        <button
          onClick={handleNuevoContenido}
          className="font-syne text-[0.82rem] font-bold px-[12px] md:px-[22px] py-[8px] md:py-[10px] rounded-[8px] transition-all duration-200 tracking-[0.3px] bg-magenta text-white shadow-[0_4px_16px_rgba(204,0,204,0.2)] hover:bg-magenta-bright hover:shadow-[0_6px_22px_rgba(204,0,204,0.2)] hover:-translate-y-[1px] flex items-center gap-[6px] cursor-pointer"
        >
          <Plus size={16} /> <span className="hidden md:inline">NUEVO CONTENIDO</span>
        </button>
      </div>
    </header>
  );
}
