import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import ProspectoFormModal from './ProspectoFormModal';

const COLUMNS = [
  {
    key:         'inactivos',
    title:       'CLIENTES INACTIVOS',
    accentColor: '#d97706',  // orange — riesgo de fuga
    tipo:        'inactivos',
    showAdd:     false,
  },
  {
    key:         'negociacion',
    title:       'EN NEGOCIACIÓN',
    accentColor: '#6b21a8',  // violet — cotizaciones activas
    tipo:        'negociacion',
    showAdd:     false,
  },
  {
    key:         'nuevos',
    title:       'NUEVOS PROSPECTOS',
    accentColor: '#cc00cc',  // magenta — ingresos orgánicos
    tipo:        'nuevos',
    showAdd:     true,
  },
];

export default function KanbanBoard() {
  const [data, setData]       = useState({ inactivos: [], negociacion: [], nuevos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchKanban = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/prospectos/kanban');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Error desconocido');
      setData(json.data);
      setLastFetch(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => { fetchKanban(); }, [fetchKanban]);

  // Polling cada 30 segundos para reflejar cambios de n8n
  useEffect(() => {
    const interval = setInterval(fetchKanban, 30_000);
    return () => clearInterval(interval);
  }, [fetchKanban]);

  const totalRegistros = data.inactivos.length + data.negociacion.length + data.nuevos.length;

  return (
    <div className="flex flex-col h-full">

      {/* Board toolbar */}
      <div className="flex items-center justify-between mb-[16px] shrink-0">
        <div className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[2px]">
          {loading ? 'Cargando...' : `${totalRegistros} registros activos`}
          {lastFetch && !loading && (
            <span className="ml-[10px] normal-case">
              · actualizado {lastFetch.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <button
          onClick={fetchKanban}
          disabled={loading}
          className="flex items-center gap-[6px] font-jetbrains text-[0.65rem] text-muted hover:text-magenta transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refrescar
        </button>
      </div>

      {/* Error global (solo si todas las columnas fallan) */}
      {error && !loading && (
        <div className="bg-red/5 border border-red/20 rounded-[10px] px-[16px] py-[12px] mb-[16px] font-jetbrains text-[0.72rem] text-red">
          ⚠️ Error al conectar con el backend: {error}
        </div>
      )}

      {/* Kanban columns — scroll horizontal en móvil, flex row en desktop */}
      <div className="flex gap-[14px] overflow-x-auto pb-[8px] flex-1 min-h-0 snap-x snap-mandatory md:snap-none">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.key}
            title={col.title}
            accentColor={col.accentColor}
            data={data[col.key]}
            loading={loading}
            error={error}
            tipo={col.tipo}
            onAddClick={col.showAdd ? () => setShowModal(true) : undefined}
          />
        ))}
      </div>

      {/* Modal formulario nuevo prospecto */}
      {showModal && (
        <ProspectoFormModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchKanban}
        />
      )}
    </div>
  );
}
