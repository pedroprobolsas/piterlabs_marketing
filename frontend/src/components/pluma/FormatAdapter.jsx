import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const FORMATOS = [
  { id: 'reels',    label: 'Reels',    emoji: '🎬' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { id: 'email',    label: 'Email',    emoji: '✉️' },
  { id: 'blog',     label: 'Blog',     emoji: '📝' },
];

export default function FormatAdapter({ guionBase, marcaConfig }) {
  const [activeTab, setActiveTab]   = useState('reels');
  const [formatos, setFormatos]     = useState({});
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);
  const [generated, setGenerated]   = useState(false);

  const adaptar = async () => {
    if (!guionBase || guionBase.length < 20) return;
    setLoading(true);
    setFormatos({});
    setGenerated(false);

    try {
      const res = await fetch('/api/claude/adaptar-formatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guion_base: guionBase,
          formatos: FORMATOS.map(f => f.id),
          marca_config: marcaConfig,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setFormatos(json.data);
        setGenerated(true);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const copyContent = () => {
    const content = formatos[activeTab];
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeContent = formatos[activeTab];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-[8px] mb-[12px]">
        <span className="font-bebas text-[1rem] tracking-[2px]">ADAPTAR A FORMATOS</span>
        <button
          onClick={adaptar}
          disabled={loading || !guionBase || guionBase.length < 20}
          className="ml-auto font-bebas text-[0.85rem] tracking-[1.5px] bg-violet text-white px-[16px] py-[7px] rounded-[8px] cursor-pointer hover:bg-violet/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'ADAPTANDO...' : '✦ ADAPTAR TODO'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border border-border rounded-[10px] overflow-hidden mb-[12px]">
        {FORMATOS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveTab(f.id)}
            className={`flex-1 flex items-center justify-center gap-[5px] py-[9px] font-jetbrains text-[0.65rem] transition-all cursor-pointer
              ${activeTab === f.id
                ? 'bg-magenta-soft text-magenta font-bold'
                : 'text-muted hover:text-text2 bg-white'}`}
          >
            <span>{f.emoji}</span>
            <span className="hidden sm:inline">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative bg-bg border border-border rounded-[10px] p-[14px_16px] min-h-[180px]">
        {loading && (
          <div className="flex items-center justify-center h-[120px] gap-[8px]">
            <div className="w-[6px] h-[6px] rounded-full bg-violet animate-blink"></div>
            <span className="font-jetbrains text-[0.7rem] text-muted">Adaptando para {FORMATOS.find(f => f.id === activeTab)?.label}...</span>
          </div>
        )}

        {!loading && !generated && (
          <div className="flex flex-col items-center justify-center h-[120px] text-center">
            <div className="font-jetbrains text-[0.68rem] text-muted">
              {guionBase && guionBase.length >= 20
                ? 'Haz clic en "Adaptar Todo" para generar versiones para cada canal'
                : 'Genera un guion primero para habilitar la adaptación de formatos'}
            </div>
          </div>
        )}

        {!loading && generated && (
          <>
            {activeContent ? (
              <pre className="font-jetbrains text-[0.75rem] text-text-main leading-relaxed whitespace-pre-wrap">
                {activeContent}
              </pre>
            ) : (
              <div className="font-jetbrains text-[0.68rem] text-muted text-center py-[40px]">
                Sin contenido para este formato
              </div>
            )}

            {activeContent && (
              <button
                onClick={copyContent}
                className="absolute top-[12px] right-[14px] flex items-center gap-[5px] font-jetbrains text-[0.6rem] text-muted border border-border rounded-[6px] px-[9px] py-[5px] hover:text-magenta hover:border-magenta transition-all cursor-pointer bg-white"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
