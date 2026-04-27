import { useState } from 'react';
import { FileDown } from 'lucide-react';

const PLANTILLA_LABELS = {
  problema_solucion: 'PAS — Problema · Agitación · Solución',
  antes_despues:     'Transformación — Antes · Después · Puente',
  storytelling:      'Storytelling — Historia de Transformación',
};

export default function ExportGuionPDF({ guion, tema, plantilla, marcaNombre }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!guion) return;
    setLoading(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      // Convierte el texto del guion en líneas con formato visual
      const lineas = guion.split('\n').map(line => {
        if (!line.trim()) return '<div style="height:8px"></div>';
        if (line.startsWith('###')) return `<h3 style="font-size:12px;color:#cc00cc;margin:14px 0 4px;letter-spacing:1px;text-transform:uppercase;">${line.replace(/^###\s*/, '')}</h3>`;
        if (line.startsWith('##'))  return `<h2 style="font-size:14px;color:#0a0a14;font-weight:900;margin:16px 0 5px;">${line.replace(/^##\s*/, '')}</h2>`;
        if (line.startsWith('#'))   return `<h1 style="font-size:16px;color:#0a0a14;font-weight:900;margin:18px 0 6px;">${line.replace(/^#\s*/, '')}</h1>`;
        if (line.startsWith('⏱') || line.startsWith('🎙') || line.startsWith('🎬')) {
          return `<div style="font-size:11px;color:#3a3a4a;margin:4px 0;padding-left:4px;">${line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')}</div>`;
        }
        if (line.startsWith('>')) {
          return `<div style="font-size:11px;color:#0a0a14;background:#f7f7fa;border-left:2px solid #cc00cc;padding:6px 10px;margin:4px 0;border-radius:0 4px 4px 0;font-style:italic;">${line.replace(/^>\s*/, '')}</div>`;
        }
        if (line.startsWith('---')) return '<hr style="border:none;border-top:1px solid #e2e2ea;margin:10px 0;">';
        return `<div style="font-size:11px;color:#3a3a4a;line-height:1.7;margin:2px 0;">${line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')}</div>`;
      }).join('');

      const html = `
        <div style="font-family:Arial,sans-serif;color:#0a0a14;margin:0;padding:0;">

          <!-- Encabezado -->
          <div style="background:#cc00cc;padding:28px 36px 20px;">
            <div style="color:rgba(255,255,255,0.7);font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">
              PITERLABS · GUION DE CONTENIDO
            </div>
            <div style="color:white;font-size:22px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;line-height:1.2;">
              ${tema || 'GUION'}
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;">
              ${marcaNombre ? `<span style="background:rgba(255,255,255,0.2);color:white;font-size:9px;padding:3px 10px;border-radius:20px;letter-spacing:1px;">${marcaNombre}</span>` : ''}
              <span style="background:rgba(255,255,255,0.2);color:white;font-size:9px;padding:3px 10px;border-radius:20px;letter-spacing:1px;">${PLANTILLA_LABELS[plantilla] || plantilla}</span>
              <span style="background:rgba(255,255,255,0.2);color:white;font-size:9px;padding:3px 10px;border-radius:20px;letter-spacing:1px;">${new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' })}</span>
            </div>
          </div>

          <!-- Contenido del guion -->
          <div style="padding:24px 36px 36px;">
            ${lineas}
          </div>

          <!-- Footer -->
          <div style="background:#f7f7fa;border-top:1px solid #e2e2ea;padding:10px 36px;display:flex;justify-content:space-between;">
            <span style="font-size:9px;color:#8888a0;">Generado por PiterLabs · ippmarketing.probolsas.co</span>
            <span style="font-size:9px;color:#cc00cc;font-weight:700;">CONFIDENCIAL</span>
          </div>

        </div>
      `;

      const element = document.createElement('div');
      element.innerHTML = html;
      document.body.appendChild(element);

      const filename = `guion-${(tema || 'contenido').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}.pdf`;

      await html2pdf().set({
        margin:      0,
        filename,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(element).save();

      document.body.removeChild(element);
    } catch (e) {
      console.error('[ExportGuionPDF]', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading || !guion}
      title={!guion ? 'Genera un guion primero' : 'Exportar guion como PDF'}
      className="flex items-center gap-[7px] font-bebas text-[0.85rem] tracking-[1.5px] bg-violet text-white px-[16px] py-[8px] rounded-[8px] cursor-pointer hover:bg-violet/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_3px_10px_rgba(107,33,168,0.15)]"
    >
      <FileDown size={14} />
      {loading ? 'GENERANDO...' : 'EXPORTAR PDF'}
    </button>
  );
}
