import { Brain, PenTool, Video, Zap, RefreshCw, Send, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="w-full">
      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px] mb-[28px]">
        <div className="bg-white border border-border rounded-[14px] p-[22px_24px] relative overflow-hidden transition-all duration-200 hover:border-magenta/25 hover:shadow-[0_4px_20px_rgba(204,0,204,0.08)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-magenta after:rounded-b-[14px]">
          <div className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[1.5px] mb-[10px]">ROAS Global</div>
          <div className="font-bebas text-[3rem] leading-none mb-[6px] tracking-[1px] text-magenta">4.8x</div>
          <div className="font-jetbrains text-[0.68rem] text-green flex items-center gap-[4px]">
            <ArrowUp size={12} /> +12% vs mes anterior
          </div>
        </div>
        
        <div className="bg-white border border-border rounded-[14px] p-[22px_24px] relative overflow-hidden transition-all duration-200 hover:border-violet/25 hover:shadow-[0_4px_20px_rgba(107,33,168,0.08)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-violet after:rounded-b-[14px]">
          <div className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[1.5px] mb-[10px]">Costo x Prospecto</div>
          <div className="font-bebas text-[3rem] leading-none mb-[6px] tracking-[1px] text-violet">$0.85</div>
          <div className="font-jetbrains text-[0.68rem] text-green flex items-center gap-[4px]">
            <ArrowDown size={12} /> -$0.15 vs objetivo
          </div>
        </div>
        
        <div className="bg-white border border-border rounded-[14px] p-[22px_24px] relative overflow-hidden transition-all duration-200 hover:border-orange/25 hover:shadow-[0_4px_20px_rgba(217,119,6,0.08)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-orange after:rounded-b-[14px]">
          <div className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[1.5px] mb-[10px]">Hot Leads Activos</div>
          <div className="font-bebas text-[3rem] leading-none mb-[6px] tracking-[1px] text-orange">24</div>
          <div className="font-jetbrains text-[0.68rem] text-muted flex items-center gap-[4px]">
            Esperando seguimiento
          </div>
        </div>

        <div className="bg-white border border-border rounded-[14px] p-[22px_24px] relative overflow-hidden transition-all duration-200 hover:border-green/25 hover:shadow-[0_4px_20px_rgba(5,150,105,0.08)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-green after:rounded-b-[14px]">
          <div className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[1.5px] mb-[10px]">Score Autenticidad</div>
          <div className="font-bebas text-[3rem] leading-none mb-[6px] tracking-[1px] text-green">92/100</div>
          <div className="font-jetbrains text-[0.68rem] text-green flex items-center gap-[4px]">
            <ArrowUp size={12} /> Último video viral
          </div>
        </div>
      </div>

      {/* BLOQUES PIPELINE */}
      <div className="flex gap-[10px] mb-[24px]">
        {[{num: 'B.1', name: 'MI MARCA', sub: 'Estrategia', active: false, Icon: Brain },
          {num: 'B.2', name: 'CREAR GUION', sub: 'Narrativa', active: true, Icon: PenTool },
          {num: 'B.3', name: 'PRODUCIR VIDEO', sub: 'Producción', active: false, Icon: Video },
          {num: 'B.4', name: 'VIRALIZAR', sub: 'Impacto', active: false, Icon: Zap },
          {num: 'B.5', name: 'PUBLICAR Y MEDIR', sub: 'Conversión', active: false, Icon: RefreshCw }]
          .map((b, i) => (
          <div key={b.num} className={`flex-1 bg-white border-[1.5px] rounded-[12px] p-[16px_14px] text-center cursor-pointer transition-all duration-250 relative overflow-hidden 
            ${b.active ? 'border-magenta bg-magenta-soft shadow-[0_4px_20px_rgba(204,0,204,0.12)]' : 'border-border hover:border-magenta hover:shadow-[0_4px_16px_rgba(204,0,204,0.07)]'}
            ${i !== 4 ? `after:content-['›'] after:absolute after:right-[-6px] after:top-[50%] after:-translate-y-1/2 after:text-border after:text-[1.2rem] after:font-light after:z-10` : ''}`}>
             <b.Icon className="mx-auto mb-[7px]" size={24} color={b.active ? '#cc00cc' : '#3a3a4a'} />
             <span className="font-jetbrains text-[0.56rem] text-magenta mb-[5px] block uppercase tracking-[1px]">{b.num}</span>
             <span className="font-bebas text-[0.9rem] tracking-[1.5px] text-text-main block">{b.name}</span>
             <span className="font-jetbrains text-[0.57rem] text-muted block mt-[4px]">{b.sub}</span>
          </div>
        ))}
      </div>

      {/* AGENT COMMAND */}
      <div className="bg-white border-[1.5px] border-magenta rounded-[14px] p-[22px_26px] mb-[24px] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-magenta-bright before:via-magenta before:to-transparent">
        <div className="flex items-center gap-[12px] mb-[14px]">
          <div className="w-[10px] h-[10px] rounded-full bg-magenta animate-blink shrink-0"></div>
          <div className="font-bebas text-[1.2rem] tracking-[2px] text-magenta">OPENCLAW COMMAND</div>
          <div className="font-jetbrains text-[0.62rem] text-muted ml-auto">PiterLabs Agent v2.0</div>
        </div>
        
        <div className="flex gap-[10px]">
          <input type="text" placeholder="Instruye a Piter (ej: 'Dame el reporte semanal de Meta Ads')" className="flex-1 bg-bg border-[1.5px] border-border rounded-[8px] p-[12px_16px] text-text-main font-jetbrains text-[0.82rem] outline-none transition-colors duration-200 focus:border-magenta" />
          <button className="bg-magenta border-none rounded-[8px] px-[26px] py-[12px] text-white font-bebas text-[1.1rem] tracking-[2px] cursor-pointer transition-all shadow-[0_4px_14px_rgba(204,0,204,0.2)] hover:bg-magenta-bright hover:shadow-[0_6px_20px_rgba(204,0,204,0.2)] hover:-translate-y-[1px] flex items-center gap-[8px]">
            <Send size={18} /> EJECUTAR
          </button>
        </div>
        
        <div className="flex flex-wrap gap-[8px] mt-[12px]">
          {['Genera 3 versiones del hook para Empaques BIO', 'Cuántos prospectos llegaron esta semana', 'Pausa la campaña si CPC > $0.5'].map(tag => (
            <span key={tag} className="font-jetbrains text-[0.62rem] p-[5px_12px] bg-bg border border-border rounded-[20px] text-text2 cursor-pointer transition-colors hover:border-magenta hover:text-magenta hover:bg-magenta-soft">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
