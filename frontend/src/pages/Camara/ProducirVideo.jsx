import { useState } from 'react';
import { Video } from 'lucide-react';
import { useMarca } from '../../hooks/useMarca';
import SmartphoneFrame from '../../components/camara/SmartphoneFrame';
import MediaUpload from '../../components/camara/MediaUpload';
import SkillsPanel from '../../components/camara/SkillsPanel';
import BriefPanel from '../../components/camara/BriefPanel';

export default function ProducirVideo() {
  const { marca } = useMarca();

  const [media, setMedia]   = useState(null);
  const [skills, setSkills] = useState({ captions: false, parallax: false });
  const [captionConfig, setCaptionConfig] = useState({ text: '', style: 'viral' });

  const toggleSkill = (id) => {
    setSkills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCaptionChange = (patch) => {
    setCaptionConfig(prev => ({ ...prev, ...patch }));
  };

  const handleMediaChange = (newMedia) => {
    setMedia(newMedia);
    if (newMedia?.type === 'video') {
      setSkills(prev => ({ ...prev, parallax: false }));
    }
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
          Preview 9:16 con captions y parallax. Genera el Brief de Producción completo con Claude.
        </p>
      </div>

      {/* 3-column grid on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_320px_1fr] gap-[20px] items-start">

        {/* Col 1: Smartphone frame */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-[260px]">
            <SmartphoneFrame
              media={media}
              captionsEnabled={skills.captions}
              captionText={captionConfig.text}
              captionStyle={captionConfig.style}
              parallaxEnabled={skills.parallax}
            />
          </div>
        </div>

        {/* Col 2: Upload + Skills */}
        <div className="space-y-[16px]">
          <MediaUpload media={media} onMediaChange={handleMediaChange} />
          <SkillsPanel
            skills={skills}
            onToggle={toggleSkill}
            captionConfig={captionConfig}
            onCaptionChange={handleCaptionChange}
            mediaType={media?.type || null}
          />
        </div>

        {/* Col 3: Brief de Producción */}
        <BriefPanel
          marca={marca}
          mediaFile={media?.type === 'image' ? media.file : null}
        />

      </div>
    </div>
  );
}
