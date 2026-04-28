import { useState } from 'react';
import { Video } from 'lucide-react';
import SmartphoneFrame from '../../components/camara/SmartphoneFrame';
import MediaUpload from '../../components/camara/MediaUpload';
import SkillsPanel from '../../components/camara/SkillsPanel';

export default function ProducirVideo() {
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
    // Parallax only works on images — turn it off if video uploaded
    if (newMedia?.type === 'video') {
      setSkills(prev => ({ ...prev, parallax: false }));
    }
  };

  return (
    <div className="w-full max-w-[1100px]">

      {/* Header */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <Video size={20} className="text-magenta" />
          <h2 className="font-bebas text-[1.8rem] tracking-[3px] text-text-main">PRODUCIR VIDEO</h2>
        </div>
        <p className="font-jetbrains text-[0.7rem] text-muted">
          Sube tu media, activa skills de producción y previsualiza en formato 9:16 para Stories y Reels.
        </p>
      </div>

      {/* Grid: frame + controls */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[24px] items-start">

        {/* LEFT: Smartphone preview */}
        <div className="flex justify-center">
          <div className="w-full max-w-[320px]">
            <SmartphoneFrame
              media={media}
              captionsEnabled={skills.captions}
              captionText={captionConfig.text}
              captionStyle={captionConfig.style}
              parallaxEnabled={skills.parallax}
            />
          </div>
        </div>

        {/* RIGHT: Controls */}
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

      </div>
    </div>
  );
}
