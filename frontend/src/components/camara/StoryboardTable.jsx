import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, User, Package, MapPin, Star } from 'lucide-react';

// ---------------------------------------------------------------
// Serializa el storyboard a texto plano para el botón "Copiar Todo"
// ---------------------------------------------------------------
function storyboardToText(data) {
  const { consultoria = '', keyframes = [], inventario = {} } = data;
  const kfText = keyframes.map(k =>
    `[${k.escena}]\n  Visual: ${k.visual}\n  Shot: ${k.shot_language}\n  Elementos: ${k.elementos_clave}\n  VO: ${k.audio_vo}`
  ).join('\n\n');
  return `CONSULTORÍA DE SEGMENTACIÓN\n${consultoria}\n\n━━━ KEYFRAMES ━━━\n${kfText}\n\n━━━ INVENTARIO DE ACTIVOS ━━━\n👤 Personajes: ${inventario.personajes || ''}\n📦 Productos: ${inventario.productos || ''}\n🏛️ Lugares: ${inventario.lugares || ''}\n🎯 Objetos: ${inventario.objetos || ''}`;
}

// ---------------------------------------------------------------
// Botón copiar atómico
// ---------------------------------------------------------------
function CopyBtn({ text, label = 'Copiar', small = false }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className={`flex items-center gap-[5px] font-jetbrains border border-border rounded-[6px] hover:text-magenta hover:border-magenta transition-all cursor-pointer bg-white shrink-0 ${small ? 'text-[0.55rem] px-[7px] py-[4px]' : 'text-[0.6rem] px-[9px] py-[5px]'} text-muted`}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copiado' : label}
    </button>
  );
}

// ---------------------------------------------------------------
// Fila expandible de un Keyframe
// ---------------------------------------------------------------
function KeyframeRow({ kf, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-border-soft hover:bg-magenta-soft/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Escena */}
        <td className="px-[12px] py-[10px] align-top min-w-[90px]">
          <span className="font-jetbrains text-[0.62rem] font-bold text-magenta whitespace-nowrap">
            {kf.escena || `${String(index + 1).padStart(2, '0')} —`}
          </span>
        </td>
        {/* Shot Language */}
        <td className="px-[12px] py-[10px] align-top min-w-[120px]">
          <span className="font-jetbrains text-[0.65rem] text-text2">{kf.shot_language}</span>
        </td>
        {/* Elementos Clave */}
        <td className="px-[12px] py-[10px] align-top">
          <span className="font-jetbrains text-[0.63rem] text-text-main leading-relaxed">{kf.elementos_clave}</span>
        </td>
        {/* Audio/VO */}
        <td className="px-[12px] py-[10px] align-top max-w-[180px]">
          <span className="font-jetbrains text-[0.63rem] text-text-main italic leading-relaxed">{kf.audio_vo}</span>
        </td>
        {/* Expand toggle */}
        <td className="px-[12px] py-[10px] align-top text-right">
          {expanded ? <ChevronUp size={13} className="text-muted" /> : <ChevronDown size={13} className="text-muted" />}
        </td>
      </tr>
      {/* Expanded: Visual Prompt completo */}
      {expanded && (
        <tr className="bg-bg-soft border-b border-border-soft">
          <td colSpan={5} className="px-[14px] py-[12px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="flex-1 min-w-0">
                <p className="font-jetbrains text-[0.57rem] text-muted uppercase tracking-[1.5px] mb-[6px]">
                  Prompt Maestro Seedance 2.0 (EN + ZH)
                </p>
                <pre className="font-jetbrains text-[0.65rem] text-text-main leading-relaxed whitespace-pre-wrap">
                  {kf.visual}
                </pre>
              </div>
              <CopyBtn text={kf.visual} small />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------
// Tarjeta de Inventario
// ---------------------------------------------------------------
function InventarioCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-border rounded-[10px] p-[14px]">
      <div className="flex items-center gap-[7px] mb-[8px]">
        <div className={`w-[26px] h-[26px] rounded-[7px] flex items-center justify-center ${color}`}>
          <Icon size={13} className="text-white" />
        </div>
        <span className="font-jetbrains text-[0.62rem] font-bold text-text2 uppercase tracking-[1px]">{label}</span>
      </div>
      <p className="font-jetbrains text-[0.68rem] text-text-main leading-relaxed">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------
// Componente principal StoryboardTable
// ---------------------------------------------------------------
export default function StoryboardTable({ data }) {
  if (!data || typeof data !== 'object') return null;

  const { consultoria = '', keyframes = [], inventario = {} } = data;

  const inventarioItems = [
    { icon: User,    label: 'Personajes',    value: inventario.personajes, color: 'bg-violet' },
    { icon: Package, label: 'Productos',     value: inventario.productos,  color: 'bg-magenta' },
    { icon: MapPin,  label: 'Lugares',       value: inventario.lugares,    color: 'bg-green' },
    { icon: Star,    label: 'Objetos (Props)', value: inventario.objetos,  color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-[18px]">

      {/* HEADER: Copiar todo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <span className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[1.5px]">
            {keyframes.length} keyframes generados
          </span>
        </div>
        <CopyBtn text={storyboardToText(data)} label="Copiar todo" />
      </div>

      {/* SECCIÓN 1: Consultoría de Segmentación */}
      <div className="bg-violet/5 border border-violet/20 rounded-[12px] p-[16px_18px]">
        <p className="font-jetbrains text-[0.57rem] text-violet uppercase tracking-[2px] font-bold mb-[8px]">
          ✦ Consultoría de Segmentación
        </p>
        <p className="font-jetbrains text-[0.7rem] text-text-main leading-[1.7]">
          {consultoria}
        </p>
      </div>

      {/* SECCIÓN 2: Tabla de Keyframes */}
      <div>
        <p className="font-jetbrains text-[0.57rem] text-muted uppercase tracking-[2px] font-bold mb-[10px]">
          Guion Gráfico de Fotogramas Clave
        </p>
        <div className="border border-border rounded-[12px] overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-soft border-b border-border">
                <th className="px-[12px] py-[9px] text-left font-jetbrains text-[0.57rem] text-muted uppercase tracking-[1.5px] whitespace-nowrap">Escena</th>
                <th className="px-[12px] py-[9px] text-left font-jetbrains text-[0.57rem] text-muted uppercase tracking-[1.5px] whitespace-nowrap">Shot Language</th>
                <th className="px-[12px] py-[9px] text-left font-jetbrains text-[0.57rem] text-muted uppercase tracking-[1.5px]">Elementos Clave</th>
                <th className="px-[12px] py-[9px] text-left font-jetbrains text-[0.57rem] text-muted uppercase tracking-[1.5px]">Audio / VO</th>
                <th className="px-[12px] py-[9px]" />
              </tr>
            </thead>
            <tbody>
              {keyframes.map((kf, i) => (
                <KeyframeRow key={i} kf={kf} index={i} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-jetbrains text-[0.57rem] text-muted mt-[6px]">
          ↓ Haz clic en una fila para expandir el Prompt Maestro Seedance 2.0 completo
        </p>
      </div>

      {/* SECCIÓN 3: Inventario de Activos */}
      <div>
        <p className="font-jetbrains text-[0.57rem] text-muted uppercase tracking-[2px] font-bold mb-[10px]">
          Inventario de Activos Requeridos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          {inventarioItems.map(item => (
            <InventarioCard key={item.label} {...item} />
          ))}
        </div>
      </div>

    </div>
  );
}
