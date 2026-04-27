import { useState } from 'react';
import { FileDown } from 'lucide-react';

// Convierte markdown básico a HTML limpio para el PDF
function mdToHtml(text) {
  if (!text) return '';
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^---+$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul]|<hr)(.+)$/gm, (_, line) => line ? line : '')
    .replace(/\n/g, '<br>');
}

const ARQUETIPOS_LABELS = {
  heroe: 'El Héroe', sabio: 'El Sabio', explorador: 'El Explorador',
  inocente: 'El Inocente', gobernante: 'El Gobernante', creador: 'El Creador',
  cuidador: 'El Cuidador', mago: 'El Mago', rebelde: 'El Rebelde',
  amante: 'El Amante', bufon: 'El Bufón', forajido: 'El Forajido',
};

export default function ExportPDF({ marca, analysis }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!analysis) return;
    setLoading(true);

    try {
      // Importación dinámica para evitar que aumente el bundle inicial
      const html2pdf = (await import('html2pdf.js')).default;

      const arquetiposStr = (marca?.arquetipos || [])
        .map(a => ARQUETIPOS_LABELS[a] || a)
        .join(' · ') || 'No definidos';

      const html = `
        <div style="font-family: 'Arial', sans-serif; color: #0a0a14; padding: 0; margin: 0;">

          <!-- Encabezado -->
          <div style="background: #cc00cc; padding: 32px 40px 24px; margin-bottom: 0;">
            <div style="color: rgba(255,255,255,0.7); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px;">
              PITERLABS · DIAGNÓSTICO DE MARCA
            </div>
            <div style="color: white; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px;">
              ${marca?.nombre_marca || 'MARCA'}
            </div>
            <div style="color: rgba(255,255,255,0.8); font-size: 12px;">
              ${marca?.industria || ''} · Generado el ${new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' })}
            </div>
          </div>

          <!-- Ficha de Identidad -->
          <div style="background: #f7f7fa; padding: 20px 40px; border-bottom: 1px solid #e2e2ea;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                  <div style="font-size: 9px; color: #8888a0; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">Tono de Voz</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0a0a14; text-transform: capitalize;">${marca?.tono_voz || '—'}</div>
                </td>
                <td style="width: 50%; vertical-align: top;">
                  <div style="font-size: 9px; color: #8888a0; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">Arquetipos</div>
                  <div style="font-size: 13px; font-weight: 700; color: #cc00cc;">${arquetiposStr}</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Propuesta de valor -->
          ${marca?.propuesta_valor ? `
          <div style="padding: 20px 40px; border-bottom: 1px solid #e2e2ea;">
            <div style="font-size: 9px; color: #8888a0; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Propuesta de Valor</div>
            <div style="font-size: 14px; color: #0a0a14; line-height: 1.6; border-left: 3px solid #cc00cc; padding-left: 14px;">
              ${marca.propuesta_valor}
            </div>
          </div>` : ''}

          <!-- Análisis estratégico -->
          <div style="padding: 24px 40px 40px;">
            <div style="font-size: 9px; color: #8888a0; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">Análisis Estratégico · IA</div>
            <div style="font-size: 12px; color: #0a0a14; line-height: 1.8;">
              <p>${mdToHtml(analysis)}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f7f7fa; border-top: 1px solid #e2e2ea; padding: 12px 40px; display: flex; justify-content: space-between;">
            <div style="font-size: 9px; color: #8888a0;">Generado por PiterLabs · ippmarketing.probolsas.co</div>
            <div style="font-size: 9px; color: #cc00cc; font-weight: 700;">CONFIDENCIAL</div>
          </div>
        </div>
      `;

      const opt = {
        margin:      0,
        filename:    `piterlabs-marca-${(marca?.nombre_marca || 'marca').toLowerCase().replace(/\s+/g,'-')}.pdf`,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      const element = document.createElement('div');
      element.innerHTML = html;
      document.body.appendChild(element);

      await html2pdf().set(opt).from(element).save();

      document.body.removeChild(element);
    } catch (e) {
      console.error('[ExportPDF]', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading || !analysis}
      title={!analysis ? 'Genera el análisis estratégico primero' : 'Exportar análisis como PDF'}
      className="flex items-center gap-[7px] font-bebas text-[0.85rem] tracking-[1.5px] bg-violet text-white px-[16px] py-[8px] rounded-[8px] cursor-pointer hover:bg-violet/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_3px_10px_rgba(107,33,168,0.15)]"
    >
      <FileDown size={14} />
      {loading ? 'GENERANDO...' : 'EXPORTAR PDF'}
    </button>
  );
}
