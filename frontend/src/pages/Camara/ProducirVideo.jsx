import { useState } from 'react';
import { Video } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import MediaUpload from '../../components/camara/MediaUpload';
import BriefPanel from '../../components/camara/BriefPanel';

export default function ProducirVideo() {
  const { marca } = useMarca();
  const [media, setMedia] = useState(null);

  const handleMediaChange = (newMedia) => {
    setMedia(newMedia);
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
          Sube el producto (opcional) y genera el Brief de Producción completo basado en las Skills activas.
        </p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-[20px] items-start">
        
        {/* Col 1: Upload */}
        <div className="space-y-[16px]">
          <div className="bg-white border border-border rounded-[14px] p-[20px]">
            <h3 className="font-jetbrains text-[0.75rem] font-bold tracking-[1px] mb-[10px]">IMAGEN DE REFERENCIA</h3>
            <p className="font-jetbrains text-[0.65rem] text-muted mb-[15px]">
              Sube una foto del producto o entorno para que Claude (Vision) la analice y adapte los prompts visuales.
            </p>
            <MediaUpload media={media} onMediaChange={handleMediaChange} />
          </div>
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
