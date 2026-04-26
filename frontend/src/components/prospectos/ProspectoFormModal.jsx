import { useState } from 'react';
import { X, Send } from 'lucide-react';

const FUENTES = ['whatsapp', 'webchat', 'manual', 'meta', 'google'];

export default function ProspectoFormModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '',
    empresa: '', ciudad: '', fuente: 'manual', producto_interes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.telefono) {
      setError('El teléfono es obligatorio');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/prospectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Error al crear el prospecto');
        return;
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[16px] w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-[24px] pt-[22px] pb-[18px] border-b border-border relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-magenta-bright before:via-magenta before:to-transparent">
          <div>
            <div className="font-bebas text-[1.5rem] tracking-[2px] text-magenta leading-none">
              NUEVO PROSPECTO
            </div>
            <div className="font-jetbrains text-[0.62rem] text-muted mt-[2px] uppercase tracking-[1px]">
              Carga manual — se insertará en marketing.prospectos
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-text-main transition-colors p-[6px] rounded-[8px] hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-[24px] py-[20px] flex flex-col gap-[14px]">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            <Field label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan García" />
            <Field label="Teléfono *" name="telefono" value={form.telefono} onChange={handleChange} placeholder="3001234567" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="juan@empresa.com" />
            <Field label="Empresa" name="empresa" value={form.empresa} onChange={handleChange} placeholder="Distribuidora XYZ" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            <Field label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Bogotá" />
            <div className="flex flex-col gap-[5px]">
              <label className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[1px]">Fuente</label>
              <select
                name="fuente"
                value={form.fuente}
                onChange={handleChange}
                className="bg-bg border border-border rounded-[8px] px-[12px] py-[10px] font-jetbrains text-[0.82rem] text-text-main outline-none focus:border-magenta transition-colors"
              >
                {FUENTES.map(f => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <Field
            label="Producto de interés"
            name="producto_interes"
            value={form.producto_interes}
            onChange={handleChange}
            placeholder="Bolsas kraft, empaques biodegradables..."
          />

          {error && (
            <div className="font-jetbrains text-[0.72rem] text-red bg-red/5 border border-red/20 rounded-[8px] px-[12px] py-[8px]">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-[10px] pt-[4px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-syne text-[0.82rem] font-bold py-[11px] rounded-[8px] border border-border text-text2 hover:border-magenta hover:text-magenta transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-syne text-[0.82rem] font-bold py-[11px] rounded-[8px] bg-magenta text-white shadow-[0_4px_14px_rgba(204,0,204,0.2)] hover:bg-magenta-bright hover:-translate-y-[1px] transition-all duration-200 flex items-center justify-center gap-[6px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {loading ? 'Guardando...' : 'GUARDAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Campo de formulario reutilizable
function Field({ label, name, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="font-jetbrains text-[0.62rem] text-muted uppercase tracking-[1px]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-bg border border-border rounded-[8px] px-[12px] py-[10px] font-jetbrains text-[0.82rem] text-text-main outline-none focus:border-magenta transition-colors placeholder:text-muted"
      />
    </div>
  );
}
