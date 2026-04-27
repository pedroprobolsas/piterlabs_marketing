import { useState } from 'react';
import { FileDown } from 'lucide-react';

async function exportPersonaPDF(persona) {
  const html2pdf = (await import('html2pdf.js')).default;

  const row = (label, value) => value ? `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f5;width:38%;vertical-align:top;">
        <span style="font-size:10px;color:#8888a0;text-transform:uppercase;letter-spacing:1.2px;">${label}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f5;vertical-align:top;">
        <span style="font-size:12px;color:#0a0a14;line-height:1.6;">${value}</span>
      </td>
    </tr>` : '';

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0a0a14;margin:0;padding:0;">

      <!-- Encabezado -->
      <div style="background:#cc00cc;padding:28px 36px 20px;">
        <div style="color:rgba(255,255,255,0.7);font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">
          PITERLABS · BUYER PERSONA
        </div>
        <div style="color:white;font-size:26px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;">
          ${persona.nombre || 'BUYER PERSONA'}
        </div>
        <div style="color:rgba(255,255,255,0.85);font-size:12px;">
          ${[persona.ocupacion, persona.ciudad].filter(Boolean).join(' · ')}
        </div>
      </div>

      <!-- Tabla de campos -->
      <table style="width:100%;border-collapse:collapse;margin-top:0;">
        ${row('Ingreso mensual',  persona.ingreso_mensual)}
        ${row('Canal favorito',   persona.canal_favorito)}
        ${row('Dolor principal',  persona.dolor_principal)}
        ${row('Aspiración',       persona.aspiracion)}
        ${row('Objeción típica',  persona.objecion_tipica)}
        ${row('Cómo llega',       persona.como_llega)}
      </table>

      <!-- Frase en voz alta -->
      ${persona.frase_tipica ? `
      <div style="margin:20px 24px;padding:14px 18px;background:#f7f7fa;border-left:3px solid #cc00cc;border-radius:0 8px 8px 0;">
        <div style="font-size:9px;color:#8888a0;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">
          Dice en voz alta
        </div>
        <div style="font-size:13px;color:#0a0a14;font-style:italic;line-height:1.6;">
          "${persona.frase_tipica}"
        </div>
      </div>` : ''}

      <!-- Footer -->
      <div style="background:#f7f7fa;border-top:1px solid #e2e2ea;padding:10px 36px;margin-top:20px;display:flex;justify-content:space-between;">
        <span style="font-size:9px;color:#8888a0;">Generado por PiterLabs · ippmarketing.probolsas.co</span>
        <span style="font-size:9px;color:#cc00cc;font-weight:700;">CONFIDENCIAL</span>
      </div>

    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);

  await html2pdf().set({
    margin:      0,
    filename:    `buyer-persona-${(persona.nombre || 'cliente').toLowerCase().replace(/\s+/g, '-')}.pdf`,
    image:       { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(element).save();

  document.body.removeChild(element);
}

export default function BuyerPersonaCard({ persona, loading, onGenerate }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try { await exportPersonaPDF(persona); }
    catch (e) { console.error('[BuyerPersonaCard][exportPDF]', e.message); }
    finally { setExporting(false); }
  };

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-[14px] p-[24px] flex items-center justify-center gap-[10px] min-h-[160px]">
        <div className="w-[8px] h-[8px] rounded-full bg-magenta animate-blink"></div>
        <span className="font-jetbrains text-[0.75rem] text-magenta">Generando buyer persona...</span>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="bg-white border-[1.5px] border-dashed border-border rounded-[14px] p-[24px] text-center">
        <div className="font-bebas text-[1.4rem] tracking-[2px] text-muted mb-[6px]">SIN BUYER PERSONA</div>
        <div className="font-jetbrains text-[0.7rem] text-muted mb-[16px]">
          Completa el formulario de marca y genera tu cliente ideal con IA
        </div>
        <button
          onClick={onGenerate}
          className="bg-magenta text-white font-bebas text-[0.9rem] tracking-[1.5px] px-[20px] py-[9px] rounded-[8px] cursor-pointer hover:bg-magenta-bright transition-colors shadow-[0_4px_14px_rgba(204,0,204,0.2)]"
        >
          ✦ GENERAR CON IA
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-[14px] overflow-hidden">
      {/* Header */}
      <div className="bg-magenta-soft border-b border-magenta/15 px-[20px] py-[14px] flex items-center justify-between gap-[8px]">
        <div className="min-w-0">
          <div className="font-bebas text-[1.3rem] tracking-[2px] text-magenta truncate">{persona.nombre}</div>
          <div className="font-jetbrains text-[0.65rem] text-text2 truncate">{persona.ocupacion} · {persona.ciudad}</div>
        </div>
        <div className="flex items-center gap-[6px] shrink-0">
          <button
            onClick={handleExport}
            disabled={exporting}
            title="Exportar buyer persona como PDF"
            className="flex items-center gap-[5px] font-jetbrains text-[0.58rem] text-violet border border-violet/30 rounded-[6px] px-[9px] py-[5px] hover:bg-violet hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown size={11} />
            {exporting ? 'PDF...' : 'PDF'}
          </button>
          <button
            onClick={onGenerate}
            className="font-jetbrains text-[0.6rem] text-magenta border border-magenta/30 rounded-[6px] px-[10px] py-[5px] hover:bg-magenta hover:text-white transition-all cursor-pointer"
          >
            Regenerar
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-[16px_20px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
        <Field label="💸 Ingreso mensual" value={persona.ingreso_mensual} />
        <Field label="📡 Canal favorito"  value={persona.canal_favorito} />
        <Field label="😣 Dolor principal" value={persona.dolor_principal} fullWidth />
        <Field label="🎯 Aspiración"      value={persona.aspiracion}     fullWidth />
        <Field label="🚧 Objeción típica" value={persona.objecion_tipica} fullWidth />
        <Field label="🔍 Cómo llega"      value={persona.como_llega}      fullWidth />
      </div>

      {/* Frase */}
      {persona.frase_tipica && (
        <div className="mx-[20px] mb-[16px] bg-bg border-l-[3px] border-magenta pl-[14px] pr-[12px] py-[10px] rounded-r-[8px]">
          <div className="font-jetbrains text-[0.58rem] text-muted uppercase tracking-[1px] mb-[4px]">Dice en voz alta</div>
          <div className="font-syne text-[0.82rem] text-text-main italic">"{persona.frase_tipica}"</div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, fullWidth }) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <div className="font-jetbrains text-[0.6rem] text-muted mb-[3px]">{label}</div>
      <div className="font-syne text-[0.8rem] text-text-main">{value || '—'}</div>
    </div>
  );
}
