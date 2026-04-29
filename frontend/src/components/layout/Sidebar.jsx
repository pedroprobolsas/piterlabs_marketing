import { NavLink } from 'react-router-dom';
import { Sparkles, Brain, Target, PenTool, Video, Zap, RefreshCw, LayoutDashboard, Users, UserPlus, Mail, Settings, Wand2, Lock } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <aside className={`
      fixed top-0 left-0 h-[100dvh] w-[252px] z-50
      bg-white border-r border-border
      flex flex-col shrink-0
      transition-transform duration-300 ease-in-out
      before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px]
      before:bg-gradient-to-r before:from-magenta-bright before:via-magenta before:to-transparent
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* LOGO */}
      <div className="px-[22px] pt-[28px] pb-[20px] border-b border-border-soft">
        <div className="flex items-center gap-[10px] mb-[12px]">
          <div className="w-[36px] h-[36px] bg-magenta rounded-[9px] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(204,0,204,0.2)]">
            <Sparkles size={16} />
          </div>
          <div className="font-bebas text-[1.7rem] tracking-[3px] text-text-main">
            PITER<span>LABS</span>
          </div>
        </div>
        <div className="flex items-center gap-[7px] bg-magenta-soft border border-magenta/15 rounded-[6px] px-[11px] py-[7px] font-jetbrains text-[0.62rem] text-magenta font-medium">
          <div className="w-[6px] h-[6px] rounded-full bg-magenta animate-blink"></div>
          PROBOLSAS S.A.S.
        </div>
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto py-[14px] scrollbar-hide">
        <div className="font-jetbrains text-[0.58rem] text-muted uppercase tracking-[2.5px] px-[22px] py-[14px] pb-[7px]">
          Módulo A — Máquina
        </div>
        
        <NavLink to="/cerebro" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <Brain size={16} className="min-w-[20px]" />
          <span>Mi Marca</span>
        </NavLink>
        <NavLink to="/ideas" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <Target size={16} className="min-w-[20px]" />
          <span>Estratega</span>
        </NavLink>
        <NavLink to="/pluma" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <PenTool size={16} className="min-w-[20px]" />
          <span>Crear Guion</span>
        </NavLink>
        <NavLink to="/camara" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <Video size={16} className="min-w-[20px]" />
          <span>Producir Video</span>
        </NavLink>
        <NavLink to="/rayo" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <Zap size={16} className="min-w-[20px]" />
          <span>Viralizar</span>
        </NavLink>
        <div className="flex items-center gap-[11px] px-[22px] py-[10px] text-[0.9rem] font-semibold text-muted/40 cursor-default select-none">
          <RefreshCw size={16} className="min-w-[20px]" />
          <span>Publicar y Medir</span>
          <span className="ml-auto font-jetbrains text-[0.5rem] px-[6px] py-[1px] rounded-[4px] bg-surface border border-border text-muted/50 uppercase tracking-[1px]">Pronto</span>
        </div>

        <hr className="border-t border-border-soft my-[8px] mx-0" />

        <div className="font-jetbrains text-[0.58rem] text-muted uppercase tracking-[2.5px] px-[22px] py-[14px] pb-[7px]">
          Módulo B — Operaciones
        </div>

        <NavLink to="/" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <LayoutDashboard size={16} className="min-w-[20px]" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/clientes" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <Users size={16} className="min-w-[20px]" />
          <span>Mis Clientes</span>
        </NavLink>
        <NavLink to="/prospectos" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <UserPlus size={16} className="min-w-[20px]" />
          <span>Prospectos</span>
          <div className="ml-auto font-jetbrains text-[0.58rem] px-[8px] py-[2px] rounded-[10px] bg-magenta-soft text-magenta border border-magenta/20 font-medium">12</div>
        </NavLink>
        <div className="flex items-center gap-[11px] px-[22px] py-[10px] text-[0.9rem] font-semibold text-muted/40 cursor-default select-none">
          <Mail size={16} className="min-w-[20px]" />
          <span>Email Mkt</span>
          <span className="ml-auto font-jetbrains text-[0.5rem] px-[6px] py-[1px] rounded-[4px] bg-surface border border-border text-muted/50 uppercase tracking-[1px]">Pronto</span>
        </div>
        
        <hr className="border-t border-border-soft my-[8px] mx-0" />
        
        <NavLink to="/settings" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <Settings size={16} className="min-w-[20px]" />
          <span>Ajustes</span>
        </NavLink>
        <NavLink to="/skills" className={({isActive}) => `flex items-center gap-[11px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 text-[0.9rem] font-semibold ${isActive ? 'text-magenta bg-magenta-soft font-bold relative before:content-[""] before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:bg-magenta before:rounded-r-[3px]' : 'text-text2 hover:text-magenta hover:bg-magenta-soft'}`}>
          <Wand2 size={16} className="min-w-[20px]" />
          <span>Skills</span>
        </NavLink>
      </div>

      {/* AGENT BAR */}
      <div className="px-[20px] py-[16px] border-t border-border-soft flex items-center gap-[10px] bg-magenta-soft">
        <div className="w-[34px] h-[34px] bg-magenta rounded-[9px] flex items-center justify-center text-[0.95rem] shrink-0 shadow-[0_3px_10px_rgba(204,0,204,0.2)] text-white">
          <Sparkles fill="white" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[0.82rem] font-bold text-text-main">PiterLabs Agent</div>
          <div className="font-jetbrains text-[0.6rem] text-magenta mt-[2px] uppercase">En Linea</div>
        </div>
      </div>
    </aside>
  );
}
