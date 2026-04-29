import { useState, useEffect } from 'react';
import { Zap, Smile, Search, Scissors, RefreshCw, Copy, Check } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';

const AGENTES = [
  {
    id: 'humor',
    nombre: 'Agente de Humor',
    descripcion: 'Inyecta giros irónicos y remates al guion para aumentar retención.',
    icon: Smile,
    color: 'text-violet',
    bg: 'bg-violet/10',
    endpoint: '/api/claude/agente-humor'
  },
  {
    id: 'seo',
    nombre: 'Agente SEO Social',
    descripcion: 'Genera hashtags virales, mejor hora de publicación y tendencias.',
    icon: Search,
    color: 'text-green',
    bg: 'bg-green/10',
    endpoint: '/api/claude/agente-seo'
  },
  {
    id: 'reproposito',
    nombre: 'Agente de Repropósito',
    descripcion: 'Fragmenta el guion principal en 5 piezas de micro-contenido (Tweets, Threads, Shorts).',
    icon: Scissors,
    color: 'text-magenta',
    bg: 'bg-magenta-soft',
    endpoint: '/api/claude/agente-reproposito'
  }
];

export default function Viralizar() {
  const { marca } = useMarca();
  const [guion, setGuion] = useState('');
  
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [copied, setCopied] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('piterlabs_guion_reciente');
    if (saved) setGuion(saved);
  }, []);

  const handleRunAgent = async (agent) => {
    if (guion.trim().length < 20) return;
    
    setLoading(prev => ({ ...prev, [agent.id]: true }));
    try {
      const res = await fetch(agent.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guion, marca_config: marca || {} })
      });
      const json = await res.json();
      if (json.success) {
        setResults(prev => ({ ...prev, [agent.id]: json.data }));
      } else {
        setResults(prev => ({ ...prev, [agent.id]: `Error: ${json.error}` }));
      }
    } catch (err) {
      setResults(prev => ({ ...prev, [agent.id]: `Error: ${err.message}` }));
    } finally {
      setLoading(prev => ({ ...prev, [agent.id]: false }));
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="w-full max-w-[1200px]">
      <div className="mb-[24px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Zap size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">VIRALIZAR</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          App Store de Agentes. Usa estos agentes especializados para potenciar y fragmentar tu contenido.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[20px] items-start">
        
        {/* Left: Guion input */}
        <div className="bg-white border border-border rounded-[14px] p-[20px_22px]">
          <label className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[8px]">
            Guion Base <span className="text-magenta">*</span>
          </label>
          <p className="font-jetbrains text-[0.6rem] text-muted mb-[14px]">
            Pega aquí el guion que generaste en el paso anterior. Los agentes usarán este texto como base.
          </p>
          <textarea
            value={guion}
            onChange={e => setGuion(e.target.value)}
            placeholder="Pega aquí el guion..."
            className="input-base w-full min-h-[400px] font-jetbrains text-[0.75rem] leading-relaxed resize-y"
          />
        </div>

        {/* Right: Agents Store */}
        <div className="space-y-[16px]">
          {AGENTES.map(agent => {
            const Icon = agent.icon;
            const isLoad = loading[agent.id];
            const result = results[agent.id];
            const isCopied = copied[agent.id];

            return (
              <div key={agent.id} className="bg-white border border-border rounded-[14px] overflow-hidden">
                <div className="p-[16px_20px] border-b border-border-soft flex items-start justify-between gap-[16px]">
                  <div className="flex items-start gap-[12px]">
                    <div className={`w-[36px] h-[36px] rounded-[10px] ${agent.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={18} className={agent.color} />
                    </div>
                    <div>
                      <h3 className="font-jetbrains text-[0.75rem] font-bold text-text-main mb-[4px]">
                        {agent.nombre}
                      </h3>
                      <p className="font-jetbrains text-[0.6rem] text-muted leading-relaxed">
                        {agent.descripcion}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRunAgent(agent)}
                    disabled={isLoad || guion.trim().length < 20}
                    className="shrink-0 flex items-center gap-[6px] bg-bg-soft border border-border hover:border-magenta hover:text-magenta text-text2 font-jetbrains text-[0.6rem] px-[12px] py-[6px] rounded-[6px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoad ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
                    {isLoad ? 'PROCESANDO...' : 'EJECUTAR'}
                  </button>
                </div>
                
                {result && (
                  <div className="p-[16px_20px] bg-bg-soft relative">
                    <button
                      onClick={() => handleCopy(agent.id, result)}
                      className="absolute top-[12px] right-[20px] flex items-center gap-[4px] font-jetbrains text-[0.55rem] text-muted hover:text-magenta transition-colors bg-white border border-border rounded-[4px] px-[6px] py-[4px]"
                    >
                      {isCopied ? <Check size={10} /> : <Copy size={10} />}
                      {isCopied ? 'COPIADO' : 'COPIAR'}
                    </button>
                    <pre className="font-jetbrains text-[0.7rem] text-text-main leading-relaxed whitespace-pre-wrap mt-[6px]">
                      {result}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
