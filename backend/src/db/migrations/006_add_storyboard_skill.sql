-- Migration 006 — Añadir Skill de Guion Gráfico (Storyboard)

INSERT INTO marketing.skills (
  clave, 
  nombre, 
  descripcion, 
  instrucciones, 
  activa, 
  orden, 
  label_tab, 
  titulo_panel
) VALUES (
  'guion_grafico',
  'Guion Gráfico (Storyboard)',
  'Desglose secuencial del video con duraciones, tipos de plano, estilo visual y acción.',
  $$Analiza el guion y crea un Guion Gráfico (Storyboard) secuencial y detallado. Divide el video en la cantidad exacta de escenas necesarias. Para CADA escena debes especificar estrictamente:
1. Escena # y Duración (en segundos).
2. Tipo de Plano y Movimiento de Cámara (Ej: Plano detalle, Dolly in).
3. Diseño Visual y Estilo (Paleta de colores, iluminación, utilería clave).
4. Acción Específica (Qué ocurre visualmente en pantalla).
5. Audio / Texto en pantalla vinculado a ese segundo.
Entrégalo en formato de lista clara o viñetas por escena.$$,
  TRUE,
  6,
  '🎞️ Storyboard',
  'Guion Gráfico Escena por Escena'
) ON CONFLICT (clave) DO NOTHING;
