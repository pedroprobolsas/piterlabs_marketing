import { useState, useEffect, useRef } from 'react';
import { Video, Package, UploadCloud, X, RefreshCw, FileText, Smartphone } from 'lucide-react';
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

  // SECCIÓN 3: PREVIEW CAPTION
  const [previewCaption, setPreviewCaption] = useState('ESCRIBE UN TEXTO\nPARA PROBAR EL VISUAL');

  return (
    <div className="w-full max-w-[1200px] space-y-[40px]">

      {/* Header */}
      <div>
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Video size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">PRODUCIR VIDEO</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Genera tus componentes de producción de forma atómica e independiente.
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

      {/* SECCIÓN 3 — PREVIEW */}
      <section>
        <div className="flex items-center justify-between mb-[16px]">
          <div className="flex items-center gap-[8px]">
            <span className="font-jetbrains text-[0.65rem] bg-text-main text-white px-[8px] py-[2px] rounded-sm font-bold tracking-[1px]">3</span>
            <h3 className="font-bebas text-[1.3rem] tracking-[1.5px] text-text-main">PREVIEW VIRAL</h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-[30px] items-start bg-white border border-border p-[30px] rounded-[14px]">
          {/* Mockup 9:16 */}
          <div className="relative w-[280px] h-[500px] bg-black rounded-[24px] shadow-2xl overflow-hidden shrink-0 border-[6px] border-text-main mx-auto md:mx-0">
            {/* Background */}
            {imagenBase64 ? (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-linear hover:scale-110"
                style={{ backgroundImage: `url(${imagenBase64})`, opacity: 0.8 }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
                <Smartphone size={32} className="text-zinc-700 mb-[10px]" />
                <span className="font-jetbrains text-[0.6rem] text-zinc-600">SIN IMAGEN DE PRODUCTO</span>
              </div>
            )}
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Zero-Click Captions Overlay */}
            <CaptionLayer text={previewCaption} style="viral" />
          </div>

          {/* Preview Controls */}
          <div className="flex-1 space-y-[16px] w-full">
            <p className="font-jetbrains text-[0.7rem] text-muted">
              Usa este simulador para probar cómo se verán los hooks (Zero-Click Captions) sobre tu producto antes de grabarlo.
            </p>
            <div>
              <label className="font-jetbrains text-[0.65rem] text-text2 font-bold mb-[6px] block uppercase tracking-[1px]">Texto del Hook</label>
              <textarea
                value={previewCaption}
                onChange={e => setPreviewCaption(e.target.value)}
                className="input-base w-full min-h-[100px] resize-y font-jetbrains text-[0.75rem] text-center"
                placeholder="Escribe un hook impactante..."
              />
            </div>
            <p className="font-jetbrains text-[0.6rem] text-violet mt-[10px]">
              Tip: Copia el mejor hook generado por tus skills y pégalo aquí para visualizar el impacto final.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
