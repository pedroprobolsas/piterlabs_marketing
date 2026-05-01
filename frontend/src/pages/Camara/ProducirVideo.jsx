import { useState, useEffect, useRef } from 'react';
import { Video, Package, UploadCloud, X, RefreshCw, FileText, Smartphone, ImagePlus, Download, AlertTriangle } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import SkillCard from '../../components/camara/SkillCard';
import CaptionLayer from '../../components/camara/CaptionLayer';

// Tarjeta premium que muestra la imagen del producto detectado con sus atributos
function ProductoHeroCard({ imageBase64, adn, onCambiar }) {
  const badgeStyles = {
    forma:        'bg-magenta/10 border-magenta/25 text-magenta',
    material:     'bg-violet/10 border-violet/25 text-violet',
    funcionalidad:'bg-emerald-500/10 border-emerald-500/25 text-emerald-700',
  };

  return (
    <div className="bg-white border border-border rounded-[14px] overflow-hidden shadow-sm h-full flex flex-col">
      {/* Imagen del producto */}
      <div className="relative w-full h-[160px] bg-[#f7f7fa] overflow-hidden shrink-0">
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
      <div className="p-[14px_16px] border-t border-border-soft flex-1 bg-white">
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
          Estos atributos se usarán en todas las generaciones para garantizar fidelidad técnica.
        </p>
      </div>
    </div>
  );
}

export default function ProducirVideo() {
  const { marca } = useMarca();
  const fileInputRef = useRef(null);

  // SECCIÓN 1: GUION
  const [guion, setGuion] = useState(() => {
    return localStorage.getItem('piterlabs_guion_activo')
      || localStorage.getItem('piterlabs_guion_reciente')
      || '';
  });
  const [autoLoaded, setAutoLoaded] = useState(
    () => !!localStorage.getItem('piterlabs_guion_activo')
  );

  const handleGuionChange = (e) => {
    setGuion(e.target.value);
    if (autoLoaded) {
      setAutoLoaded(false);
      localStorage.removeItem('piterlabs_guion_activo');
    }
  };

  useEffect(() => {
    localStorage.setItem('piterlabs_guion_reciente', guion);
  }, [guion]);

  // SECCIÓN 1: IMAGEN Y VISION
  const [imagenBase64, setImagenBase64] = useState(() => localStorage.getItem('estratega_imagen') || null);
  const [adn, setAdn] = useState(() => {
    const saved = localStorage.getItem('estratega_adn');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    } catch (err) {
      console.error('Error analizando producto:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuitarImagen = () => {
    setImagenBase64(null);
    setAdn(null);
    localStorage.removeItem('estratega_imagen');
    localStorage.removeItem('estratega_adn');
  };

  // SECCIÓN 2: SKILLS
  const [skills, setSkills] = useState([]);
  
  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const EXCLUDED = ['estratega_interactivo', 'guion_grafico'];
          const activeSkills = json.data
            .filter(s => s.activa && !EXCLUDED.includes(s.clave))
            .sort((a, b) => a.orden - b.orden);
          setSkills(activeSkills);
        }
      })
      .catch(err => console.error('Error fetching skills:', err));
  }, []);

  // SECCIÓN 3: MINIATURA
  const [miniaturaLoading, setMiniaturaLoading] = useState(false);
  const [miniaturaData, setMiniaturaData] = useState(null);
  const [miniaturaError, setMiniaturaError] = useState(null);

  const handleGenerarMiniaturas = async () => {
    if (!guion || guion.trim().length < 20) {
      setMiniaturaError('Se requiere un guion base válido (mín. 20 caracteres) en la sección TU MATERIAL.');
      return;
    }
    setMiniaturaLoading(true);
    setMiniaturaError(null);
    setMiniaturaData(null);

    try {
      const res = await fetch('/api/openai/generar-miniatura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guion,
          atributos_producto: adn,
          marca_config: marca
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setMiniaturaData(json.data);
      if (json.data.errores?.length > 0) {
         setMiniaturaError(json.data.errores.join(' | '));
      }
    } catch (e) {
      setMiniaturaError(e.message);
    } finally {
      setMiniaturaLoading(false);
    }
  };

  const handleDescargar = (base64Url, format) => {
    const a = document.createElement('a');
    a.href = base64Url;
    a.download = `miniatura_${format}_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="w-full max-w-[1200px] space-y-[40px]">

      {/* Header */}
      <div>
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Video size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">PRODUCIR VIDEO</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Genera tus componentes de producción y la miniatura real con IA.
        </p>
      </div>

      {/* SECCIÓN 1 — TU MATERIAL */}
      <section>
        <div className="flex items-center gap-[8px] mb-[16px]">
          <span className="font-jetbrains text-[0.65rem] bg-text-main text-white px-[8px] py-[2px] rounded-sm font-bold tracking-[1px]">1</span>
          <h3 className="font-bebas text-[1.3rem] tracking-[1.5px] text-text-main">TU MATERIAL</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
          {/* GUION */}
          <div className="bg-white border border-border rounded-[14px] p-[18px_20px] shadow-sm flex flex-col">
            <label className="font-jetbrains text-[0.68rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[8px] flex items-center gap-[6px]">
              <FileText size={14} className="text-magenta" />
              Guion Base
            </label>
            <textarea
              value={guion}
              onChange={handleGuionChange}
              placeholder="Pega aquí el guion generado..."
              className="input-base resize-none text-[0.72rem] leading-relaxed flex-1 min-h-[160px]"
            />
            {autoLoaded && (
              <div className="flex items-center gap-[5px] mt-[8px]">
                <span className="inline-flex items-center gap-[5px] font-jetbrains text-[0.6rem] text-violet bg-violet/10 border border-violet/25 rounded-full px-[9px] py-[3px]">
                  ✨ Guion cargado desde Creación de Guion
                </span>
              </div>
            )}
          </div>

          {/* VISION */}
          <div className="h-full">
            {imagenBase64 && adn ? (
              <ProductoHeroCard
                imageBase64={imagenBase64}
                adn={adn}
                onCambiar={handleQuitarImagen}
              />
            ) : (
              <div className="bg-white border border-border rounded-[14px] p-[20px] shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-[8px] mb-[4px]">
                  <Package size={14} className="text-magenta" />
                  <h3 className="font-jetbrains text-[0.75rem] font-bold tracking-[1px]">PROTAGONISTA (Opcional)</h3>
                </div>
                <p className="font-jetbrains text-[0.65rem] text-muted mb-[15px]">
                  Sube la imagen del producto para que Vision garantice fidelidad visual.
                </p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-magenta/50 rounded-[12px] p-[30px_20px] flex-1 flex flex-col items-center justify-center gap-[8px] cursor-pointer transition-all hover:bg-bg-soft"
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
        </div>
      </section>

      {/* SECCIÓN 2 — GENERA TU CONTENIDO */}
      <section>
        <div className="flex items-center gap-[8px] mb-[16px]">
          <span className="font-jetbrains text-[0.65rem] bg-text-main text-white px-[8px] py-[2px] rounded-sm font-bold tracking-[1px]">2</span>
          <h3 className="font-bebas text-[1.3rem] tracking-[1.5px] text-text-main">GENERA TU CONTENIDO</h3>
        </div>

        {skills.length === 0 ? (
          <div className="font-jetbrains text-[0.7rem] text-muted p-[20px] bg-bg-soft rounded-[10px] text-center border border-border">
            Cargando habilidades... (Asegúrate de tener skills activas en Ajustes)
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {skills.map(skill => (
              <SkillCard
                key={skill.clave}
                skill={skill}
                guion={guion}
                atributosProducto={adn}
                marcaConfig={marca}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN 3 — MINIATURA */}
      <section>
        <div className="flex items-center justify-between mb-[16px]">
          <div className="flex items-center gap-[8px]">
            <span className="font-jetbrains text-[0.65rem] bg-text-main text-white px-[8px] py-[2px] rounded-sm font-bold tracking-[1px]">3</span>
            <h3 className="font-bebas text-[1.3rem] tracking-[1.5px] text-text-main">MINIATURA (IMAGEN REAL)</h3>
          </div>
          {!miniaturaLoading && (
            <button
              onClick={handleGenerarMiniaturas}
              className="flex items-center gap-[6px] bg-magenta text-white font-jetbrains text-[0.65rem] font-bold px-[14px] py-[8px] rounded-[8px] cursor-pointer hover:bg-magenta-bright transition-all shadow-md"
            >
              <ImagePlus size={14} />
              {miniaturaData || miniaturaError ? 'REINTENTAR' : 'GENERAR MINIATURAS'}
            </button>
          )}
        </div>

        <div className="bg-white border border-border p-[20px] rounded-[14px] shadow-sm">
          {miniaturaLoading && (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[15px]">
              <RefreshCw size={32} className="text-magenta animate-spin" />
              <p className="font-jetbrains text-[0.7rem] text-muted text-center leading-relaxed">
                <strong className="text-text-main block mb-[4px]">Paso 1: Claude está diseñando el prompt visual perfecto...</strong>
                Paso 2: OpenAI (DALL-E 3) generará dos imágenes reales en alta resolución.
              </p>
            </div>
          )}

          {miniaturaError && !miniaturaLoading && (
            <div className="flex flex-col items-center justify-center py-[40px] gap-[10px] bg-red/5 border border-red/20 rounded-[10px]">
              <AlertTriangle size={24} className="text-red" />
              <p className="font-jetbrains text-[0.65rem] text-red">{miniaturaError}</p>
            </div>
          )}

          {miniaturaData && !miniaturaLoading && (
            <div className="space-y-[20px]">
              <div className="bg-bg-soft border border-border-soft p-[12px] rounded-[8px]">
                <p className="font-jetbrains text-[0.55rem] text-muted uppercase tracking-[1px] mb-[4px] font-bold">Prompt usado (Claude)</p>
                <p className="font-jetbrains text-[0.65rem] text-text-main italic">{miniaturaData.prompt_usado}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                {/* 16:9 */}
                <div className="flex flex-col items-center gap-[12px]">
                  <h4 className="font-jetbrains text-[0.7rem] font-bold text-text-main tracking-[1px]">FORMATO 16:9 (YouTube / LinkedIn)</h4>
                  {miniaturaData.imagen_16_9 ? (
                    <>
                      <div className="w-full aspect-video bg-black rounded-[12px] overflow-hidden shadow-md border border-border">
                        <img src={miniaturaData.imagen_16_9} alt="Miniatura 16:9" className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => handleDescargar(miniaturaData.imagen_16_9, '16x9')}
                        className="flex items-center gap-[6px] bg-white border border-border text-text-main hover:text-magenta hover:border-magenta/50 font-jetbrains text-[0.65rem] font-bold px-[16px] py-[8px] rounded-[8px] cursor-pointer transition-all w-full justify-center"
                      >
                        <Download size={14} /> DESCARGAR 16:9
                      </button>
                    </>
                  ) : (
                    <div className="w-full aspect-video bg-bg-soft rounded-[12px] flex items-center justify-center border border-border-soft">
                      <span className="font-jetbrains text-[0.6rem] text-muted">Error al generar esta versión</span>
                    </div>
                  )}
                </div>

                {/* 9:16 */}
                <div className="flex flex-col items-center gap-[12px]">
                  <h4 className="font-jetbrains text-[0.7rem] font-bold text-text-main tracking-[1px]">FORMATO 9:16 (TikTok / Reels)</h4>
                  {miniaturaData.imagen_9_16 ? (
                    <>
                      <div className="h-[400px] aspect-[9/16] bg-black rounded-[12px] overflow-hidden shadow-md border border-border">
                        <img src={miniaturaData.imagen_9_16} alt="Miniatura 9:16" className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => handleDescargar(miniaturaData.imagen_9_16, '9x16')}
                        className="flex items-center gap-[6px] bg-white border border-border text-text-main hover:text-magenta hover:border-magenta/50 font-jetbrains text-[0.65rem] font-bold px-[16px] py-[8px] rounded-[8px] cursor-pointer transition-all w-[225px] justify-center"
                      >
                        <Download size={14} /> DESCARGAR 9:16
                      </button>
                    </>
                  ) : (
                    <div className="h-[400px] aspect-[9/16] bg-bg-soft rounded-[12px] flex items-center justify-center border border-border-soft">
                      <span className="font-jetbrains text-[0.6rem] text-muted">Error al generar esta versión</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
