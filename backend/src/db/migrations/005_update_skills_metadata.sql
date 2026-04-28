-- Migration 005 — Metadatos dinámicos para Skills
-- Permite que la UI se genere sola basándose en la BD

ALTER TABLE marketing.skills ADD COLUMN IF NOT EXISTS label_tab     VARCHAR(50);
ALTER TABLE marketing.skills ADD COLUMN IF NOT EXISTS titulo_panel  VARCHAR(200);

-- Actualizar las 5 skills existentes con sus metadatos actuales de la UI
UPDATE marketing.skills SET
  label_tab    = '📸 Foto',
  titulo_panel = 'Foto Publicitaria — GPT Image 2',
  descripcion  = 'Pega este prompt en ChatGPT Plus (GPT Image 2) junto con la foto de tu producto. Genera una pieza publicitaria profesional lista para Instagram o Facebook.'
WHERE clave = 'foto_publicitaria';

UPDATE marketing.skills SET
  label_tab    = '🎠 Carrusel',
  titulo_panel = 'Carrusel Educativo — Instagram / LinkedIn',
  descripcion  = 'Usa esta estructura en Canva o con GPT Image 2. Cada slide tiene el texto y el prompt de imagen correspondiente. Ideal para Instagram y LinkedIn.'
WHERE clave = 'carrusel';

UPDATE marketing.skills SET
  label_tab    = '🎬 Video',
  titulo_panel = 'Video Cinematográfico — Seedance / Kling',
  descripcion  = 'Pega este prompt en Seedance 2.0 (via Artlist) o Kling. Incluye versión en inglés y chino nativo para mejor resultado. Genera video cinematográfico de 15-60 segundos.'
WHERE clave = 'video_cinematografico';

UPDATE marketing.skills SET
  label_tab    = '📱 Stories',
  titulo_panel = 'Stories Secuenciales 9:16',
  descripcion  = 'Pega cada prompt por separado en ChatGPT Plus (GPT Image 2). Genera 3 stories verticales 9:16 con coherencia visual entre ellas para Instagram o TikTok.'
WHERE clave = 'stories';

UPDATE marketing.skills SET
  label_tab    = '🎙️ Narración',
  titulo_panel = 'Narración Viral — ElevenLabs / CapCut',
  descripcion  = 'Copia el estilo que prefieras y pégalo en ElevenLabs o en el generador de voz de CapCut. Script limpio listo para usar — sin editar.'
WHERE clave = 'narracion';
