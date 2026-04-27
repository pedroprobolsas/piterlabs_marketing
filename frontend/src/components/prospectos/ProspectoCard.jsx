// Temperatura badge: 🔥 caliente | ✦ nuevo | ❄ frío
const TEMP_CONFIG = {
  caliente: { icon: '🔥', label: 'Caliente', cls: 'bg-orange/10 text-orange border-orange/30' },
  nuevo:    { icon: '✦',  label: 'Nuevo',    cls: 'bg-magenta-soft text-magenta border-magenta/20' },
  frio:     { icon: '❄',  label: 'Frío',     cls: 'bg-blue-50 text-blue-400 border-blue-200' },
};

// Fuente badge
const FUENTE_CONFIG = {
  whatsapp: { label: 'WA',     cls: 'bg-green/10 text-green border-green/30' },
  webchat:  { label: 'Web',    cls: 'bg-violet/10 text-violet border-violet/30' },
  manual:   { label: 'Manual', cls: 'bg-muted/10 text-muted border-border' },
  meta:     { label: 'Meta',   cls: 'bg-blue-50 text-blue-500 border-blue-200' },
  google:   { label: 'Google', cls: 'bg-red/10 text-red border-red/30' },
};

// Días sin movimiento → color semáforo
function diasColor(dias) {
  if (!dias) return 'text-muted';
  if (dias < 2)  return 'text-green';
  if (dias < 7)  return 'text-orange';
  return 'text-red';
}

export default function ProspectoCard({ prospecto, tipo }) {
  const temp   = TEMP_CONFIG[prospecto.temperatura] || TEMP_CONFIG.nuevo;
  const fuente = FUENTE_CONFIG[prospecto.fuente]     || FUENTE_CONFIG.manual;
  const dias   = prospecto.dias_sin_movimiento ? Math.floor(prospecto.dias_sin_movimiento) : null;

  // Campos según tipo de columna
  const nombre   = prospecto.nombre   || prospecto.razon_social || '—';
  const empresa  = prospecto.empresa  || '';
  const ciudad   = prospecto.ciudad   || '—';
  const metaDato = tipo === 'inactivos'
    ? { label: 'Última compra', value: prospecto.ultima_compra
          ? new Date(prospecto.ultima_compra).toLocaleDateString('es-CO') : '—' }
    : tipo === 'negociacion'
    ? { label: 'Cotización', value: prospecto.nro_cotizacion
          ? `${prospecto.nro_cotizacion}${prospecto.fecha_cotizacion ? ' · ' + new Date(prospecto.fecha_cotizacion).toLocaleDateString('es-CO') : ''}` : '—' }
    : null;

  return (
    <div className="bg-white border border-border rounded-[10px] p-[14px_16px] hover:border-magenta/30 hover:shadow-[0_4px_14px_rgba(204,0,204,0.07)] transition-all duration-200 cursor-pointer group">

      {/* Header: nombre + temperatura */}
      <div className="flex items-start justify-between gap-[8px] mb-[8px]">
        <div className="flex-1 min-w-0">
          <div className="font-syne font-bold text-[0.88rem] text-text-main leading-tight truncate group-hover:text-magenta transition-colors">
            {nombre}
          </div>
          {empresa && (
            <div className="font-jetbrains text-[0.62rem] text-muted mt-[2px] truncate">
              {empresa}
            </div>
          )}
        </div>
        {/* Solo muestra temperatura en columna Nuevos */}
        {tipo === 'nuevos' && (
          <span className={`font-jetbrains text-[0.58rem] px-[7px] py-[2px] rounded-full border shrink-0 ${temp.cls}`}>
            {temp.icon} {temp.label}
          </span>
        )}
      </div>

      {/* Ciudad */}
      <div className="font-jetbrains text-[0.65rem] text-text2 mb-[10px] flex items-center gap-[4px]">
        <span className="text-muted">📍</span> {ciudad}
      </div>

      {/* Meta dato según columna */}
      {metaDato && (
        <div className="font-jetbrains text-[0.62rem] text-muted mb-[10px]">
          <span className="text-text2 font-medium">{metaDato.label}:</span> {metaDato.value}
        </div>
      )}

      {/* Footer: fuente / vendedor + días sin movimiento / valor */}
      <div className="flex items-center justify-between gap-[8px] mt-[4px]">
        {tipo === 'negociacion' ? (
          <span className="font-jetbrains text-[0.6rem] text-muted truncate max-w-[110px]">
            {prospecto.vendedor || '—'}
          </span>
        ) : (
          <span className={`font-jetbrains text-[0.58rem] px-[7px] py-[2px] rounded-full border ${fuente.cls}`}>
            {fuente.label}
          </span>
        )}
        {tipo === 'nuevos' && dias !== null && (
          <span className={`font-jetbrains text-[0.6rem] font-bold ${diasColor(dias)}`}>
            {dias === 0 ? 'Hoy' : `${dias}d sin movimiento`}
          </span>
        )}
        {tipo === 'negociacion' && prospecto.valor_total && (
          <span className="font-jetbrains text-[0.6rem] text-violet font-bold">
            ${Number(prospecto.valor_total).toLocaleString('es-CO')}
          </span>
        )}
        {tipo === 'inactivos' && prospecto.vendedor_asignado && (
          <span className="font-jetbrains text-[0.6rem] text-muted truncate max-w-[80px]">
            {prospecto.vendedor_asignado}
          </span>
        )}
      </div>
    </div>
  );
}
