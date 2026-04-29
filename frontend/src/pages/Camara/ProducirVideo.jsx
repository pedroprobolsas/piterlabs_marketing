import { useState, useEffect, useRef } from 'react';
import { Video, Package, UploadCloud, X, RefreshCw } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import MediaUpload from '../../components/camara/MediaUpload';
import BriefPanel from '../../components/camara/BriefPanel';

// Tarjeta premium que muestra la imagen del producto detectado con sus atributos
function ProductoHeroCard({ imageBase64, adn, onCambiar }) {
  const badgeStyles = {
    forma:        'bg-magenta/10 border-magenta/25 text-magenta',
    material:     'bg-violet/10 border-violet/25 text-violet',
    funcionalidad:'bg-emerald-500/10 border-emerald-500/25 text-emerald-700',
  };

  return (
    <div className="bg-white border border-border rounded-[14px] overflow-hidden shadow-sm">
      {/* Imagen del producto */}
      <div className="relative w-full h-[200px] bg-[#f7f7fa] overflow-hidden">
        <img
          src={imageBase64}
          alt="Producto detectado"
          className="w-full h-full object-contain p-[12px]"
        />
        {/* Badge de IA detectado */}
        <div className="absolute top-[10px] left-[10px] bg-magenta text-white font-jetbrains text-[0.55rem] font-bold px-[8px] py-[4px] rounded-full shadow-md tracking-[1px]">
          ✦ VISION IA
        </div>
        {/* Botón cambiar */}
        <button
          onClick={onCambiar}
          className="absolute top-[10px] right-[10px] bg-white border border-border rounded-full w-[28px] h-[28px] flex items-center justify-center shadow-sm hover:border-magenta/50 hover:text-magenta transition-all cursor-pointer"
          title="Cambiar imagen"
        >
          <X size={12} />
        </button>
      </div>

      {/* Atributos detectados */}
      <div className="p-[14px_16px] border-t border-border-soft">
        <p className="font-jetbrains text-[0.58rem] text-muted uppercase tracking-[1.5px] mb-[10px]">
          Atributos Detectados por Vision
        </p>
        <div className="flex flex-wrap gap-[6px]">
          {adn?.forma && (
            <div className={`border px-[10px] py-[4px] rounded-full font-jetbrains text-[0.62rem] font-bold ${badgeStyles.forma}`}>
              📦 {adn.forma}
            </div>
          )}
          {adn?.material && (
            <div className={`border px-[10px] py-[4px] rounded-full font-jetbrains text-[0.62rem] font-bold ${badgeStyles.material}`}>
              ✨ {adn.material}
            </div>
          )}
          {adn?.funcionalidad && (
            <div className={`border px-[10px] py-[4px] rounded-full font-jetbrains text-[0.62rem] font-bold ${badgeStyles.funcionalidad}`}>
              ⚡ {adn.funcionalidad}
            </div>
          )}
        </div>
        <p className="font-jetbrains text-[0.58rem] text-muted mt-[10px] leading-relaxed">
          El Storyboard usará estos atributos para garantizar fidelidad visual al producto real.
        </p>
      </div>
    </div>
  );
}

export default function ProducirVideo() {
  const { marca } = useMarca();
  const fileInputRef = useRef(null);

  // Recuperar imagen y ADN del Estratega desde localStorage
  const [imagenBase64, setImagenBase64] = useState(() => localStorage.getItem('estratega_imagen') || null);
  const [adn, setAdn] = useState(() => {
    const saved = localStorage.getItem('estratega_adn');
    return saved ? JSON.parse(saved) : null;
  });
  const [media, setMedia] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Convertir la imagen base64 guardada en un objeto File para BriefPanel
  useEffect(() => {
    if (imagenBase64 && !media) {
      fetch(imagenBase64)
        .then(r => r.blob())
        .then(blob => {
          const file = new File([blob], 'producto_referencia.jpg', { type: blob.type });
          setMedia({ url: imagenBase64, type: 'image', name: file.name, file });
        })
        .catch(() => {});
    }
  }, [imagenBase64]);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleNuevaImagen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const b64 = await fileToBase64(file);
      localStorage.setItem('estratega_imagen', b64);
      setImagenBase64(b64);
      const res = await fetch('/api/claude/analizar-producto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen_base64: b64 }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem('estratega_adn', JSON.stringify(json.data));
        setAdn(json.data);
      }
      const fileObj = new File([await fetch(b64).then(r => r.blob())], file.name, { type: file.type });
      setMedia({ url: b64, type: 'image', name: file.name, file: fileObj });
    } catch (err) {
      console.error('Error analizando producto:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuitarImagen = () => {
    setImagenBase64(null);
    setAdn(null);
    setMedia(null);
    localStorage.removeItem('estratega_imagen');
    localStorage.removeItem('estratega_adn');
  };

  return (
    <div className="w-full max-w-[1400px]">

      {/* Header */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Video size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">PRODUCIR VIDEO</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Frame, skills y preview mix — el Storyboard es fiel al producto detectado.
        </p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-[20px] items-start">

        {/* Col 1: Producto Hero o Upload */}
        <div className="space-y-[16px]">
          {imagenBase64 && adn ? (
            // ✅ Imagen ya detectada — mostrar tarjeta premium
            <ProductoHeroCard
              imageBase64={imagenBase64}
              adn={adn}
              onCambiar={handleQuitarImagen}
            />
          ) : (
            // ⬆️ Sin imagen — mostrar zona de carga
            <div className="bg-white border border-border rounded-[14px] p-[20px]">
              <div className="flex items-center gap-[8px] mb-[4px]">
                <Package size={14} className="text-magenta" />
                <h3 className="font-jetbrains text-[0.75rem] font-bold tracking-[1px]">PROTAGONISTA DEL VIDEO</h3>
              </div>
              <p className="font-jetbrains text-[0.65rem] text-muted mb-[15px]">
                Sube la imagen del producto para que Vision garantice fidelidad en el Storyboard.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-magenta/50 rounded-[12px] p-[30px_20px] flex flex-col items-center gap-[8px] cursor-pointer transition-all hover:bg-bg-soft"
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-[8px]">
                    <RefreshCw size={22} className="text-magenta animate-spin" />
                    <span className="font-jetbrains text-[0.65rem] text-magenta">Analizando producto...</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={22} className="text-muted" />
                    <div className="font-jetbrains text-[0.68rem] text-muted text-center leading-relaxed">
                      Arrastra una foto del producto<br />
                      <span className="text-magenta">o haz clic para seleccionar</span>
                    </div>
                    <div className="font-jetbrains text-[0.58rem] text-muted/60">JPG, PNG</div>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleNuevaImagen} />
            </div>
          )}
        </div>

        {/* Col 2: Brief de Producción */}
        <BriefPanel
          marca={marca}
          mediaFile={media?.type === 'image' ? media.file : null}
        />

      </div>
    </div>
  );
}
