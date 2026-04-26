# PiterLabs — MASTER.md v2.0
> **Plataforma de Marketing Inteligente y Máquina de Contenido Agéntica**

```
Versión:        2.0
Fecha:          Abril 2026
Autor:          Pedro Sandoval — AI Builder & GM Probolsas S.A.S.
Piloto:         Probolsas S.A.S. — Cúcuta, Colombia
Dominio piloto: ippmarketing.probolsas.co
Plataforma:     Replicable en cualquier empresa con VPS propio
Scrum Master:   Claude (revisiones, verificaciones y aprobaciones con Pedro Sandoval)
```

---

## 0. VISIÓN Y PROPÓSITO

**PiterLabs** es una plataforma de marketing inteligente y producción de contenido agéntica, construida sobre infraestructura propia (VPS), diseñada para ser replicada por cualquier empresa. No es un SaaS. No depende de terceros. Es tuya.

### Lo que hace PiterLabs
- Convierte la estrategia de marca en contenido publicado de forma casi automática
- Gestiona campañas de pauta (Meta, Google Ads) desde un solo dashboard
- Clasifica y da seguimiento a clientes y prospectos con datos reales del ERP
- Aprende de cada pieza publicada para mejorar la siguiente
- Es operada en lenguaje natural por un agente autónomo (OpenClaw/PiterLabs Agent)

### Por qué es diferente
```
App tradicional:  Herramienta → Usuario opera → Resultado
PiterLabs:        Usuario da intención → IA planifica → Agente ejecuta → Sistema aprende
```

### Tres usos simultáneos
1. **Producción real** — Probolsas S.A.S. la usa en producción con datos y campañas reales
2. **Caso de éxito replicable** — cualquier empresa puede instalarla en su VPS siguiendo la documentación
3. **Posicionamiento** — Pedro Sandoval como referente en IA aplicada a marketing para CEOs

---

## 1. ARQUITECTURA GENERAL

### Dos grandes módulos

```
┌─────────────────────────────────────────────────────────────────┐
│  MÓDULO A — MÁQUINA DE CONTENIDO                                │
│  Los 5 Bloques creativos del pipeline de producción             │
│  Bloque 1 → 2 → 3 → 4 → 5 (estrategia hasta viralización)     │
├─────────────────────────────────────────────────────────────────┤
│  MÓDULO B — CENTRO DE OPERACIONES                               │
│  Gestión de campañas, clientes, prospectos y email marketing    │
│  Meta Ads · Google Ads · Clientes 360° · Prospectos · Email     │
└─────────────────────────────────────────────────────────────────┘
```

### Cómo se conectan
El contenido producido en el Módulo A se publica y distribuye desde el Módulo B.
Los datos de clientes y prospectos del Módulo B alimentan el Buyer Persona del Módulo A.
Los resultados de campañas del Módulo B retroalimentan la estrategia del Bloque 1 del Módulo A.

### Arquitectura de capas
```
┌──────────────────────────────────────────────┐
│  CAPA 1 — INTERFAZ                           │
│  React + Vite + TailwindCSS                  │
│  ippmarketing.probolsas.co                      │
├──────────────────────────────────────────────┤
│  CAPA 2 — API BACKEND                        │
│  Node.js + Express                           │
│  Endpoints por módulo y bloque               │
├──────────────────────────────────────────────┤
│  CAPA 3 — AUTOMATIZACIÓN                     │
│  n8n Workflows                               │
│  Conecta APIs, procesa datos, dispara agentes│
├──────────────────────────────────────────────┤
│  CAPA 4 — INTELIGENCIA                       │
│  OpenClaw (PiterLabs Agent) + Claude API     │
│  Genera, analiza, decide y aprende           │
├──────────────────────────────────────────────┤
│  CAPA 5 — DATOS                              │
│  PostgreSQL + Google Sheets + APIs externas  │
└──────────────────────────────────────────────┘
```

---

## 2. MÓDULO A — MÁQUINA DE CONTENIDO (5 BLOQUES)

### Navegación lateral — Los 5 bloques
```
🧠  Bloque 1 — CEREBRO        Inteligencia y estrategia de marca
✍️  Bloque 2 — PLUMA          Arquitectura narrativa (Scripting Engine)
🎬  Bloque 3 — CÁMARA         Producción visual dinámica (Visual Factory)
⚡  Bloque 4 — RAYO           Viralización e interacción (Impact Motor)
⚙️  Bloque 5 — ENGRANAJE      Distribución y conversión (Flywheel)
```

El usuario navega secuencialmente por los 5 bloques. No puede saltarse pasos críticos. El sistema guía el flujo de producción completo.

---

### BLOQUE 1 — CEREBRO (Inteligencia y Estrategia)

**Propósito:** alimentar la máquina con el alma de la marca. Todo lo que se produce en los bloques siguientes nace de la configuración de este bloque.

#### Widget: Brand Knowledge Base
Zona de drag-and-drop para cargar:
- PDFs (manuales de marca, catálogos, casos de éxito)
- Documentos Word (.docx) con guías de comunicación
- Links de sitio web o redes sociales para análisis automático
- Formulario manual estructurado para completar información de marca

La IA procesa todos los archivos cargados y construye un perfil de marca interno que alimenta todos los bloques siguientes.

#### Selector de Arquetipo de Marca
12 arquetipos disponibles en interfaz visual:
El Héroe · El Sabio · El Cuidador · El Creador · El Explorador · El Rebelde · El Mago · El Inocente · El Bufón · El Amante · El Gobernante · El Forajido

**Lógica híbrida:**
1. El usuario elige el arquetipo que siente más cercano a su marca
2. La IA analiza el Brand Knowledge Base cargado
3. La IA valida o contradice: *"Basado en tu comunicación actual, tu marca se comporta más como El Sabio. ¿Confirmamos o ajustamos?"*
4. El usuario decide. La IA aprende.

#### Módulo Buyer Persona — "El Héroe de la Historia"
La IA construye automáticamente el buyer persona analizando:
- El sector y subsector de la empresa
- El Brand Knowledge Base cargado
- Datos históricos de clientes si se conecta PostgreSQL

Campos generados automáticamente (editables por el usuario):
- Miedos principales
- Deseos y aspiraciones
- Objeciones frecuentes de compra
- Lenguaje que usa
- Canales donde está presente
- Momento del día más receptivo

#### Diferenciador Agéntico — Análisis de Tendencias
El Bloque 1 no solo procesa información interna. También:
- Agrega noticias del sector en tiempo real
- Analiza sentimiento en redes sociales sobre temas relacionados
- Detecta tendencias emergentes antes que la competencia
- Elimina el sesgo de actualidad: la estrategia se basa en lo que está pasando hoy, no en suposiciones del mes pasado

---

### BLOQUE 2 — PLUMA (Scripting Engine)

**Propósito:** diseñar la narrativa del contenido. No es un editor de texto. Es una mesa de diseño de retención.

#### Reglas de Oro del Sistema (no negociables)
- Duración: entre 11 y 60 segundos
- Hook (gancho): primeros 3 segundos son innegociables — si no detiene el scroll, el video falla
- Flujo narrativo obligatorio: Gancho → Planteamiento → Clímax → Resolución

#### Selector de Plantilla Narrativa
El usuario elige entre 3 modelos de skill:

**Modelo 1 — Mini-Documental**
Estructura Replay no lineal (presente → pasado → presente)
Ideal para: casos de éxito, historia de marca, transformaciones
Técnica: alterna entre el presente del personaje y imágenes de archivo del pasado

**Modelo 2 — Micro-Novela**
Uso de elipsis narrativa con foco en clímax y giro final reflexivo
Ideal para: contenido emocional, situaciones cotidianas con moraleja, humor
Técnica: omite el proceso, muestra solo el antes y el después con giro inesperado

**Modelo 3 — Educativo de Impacto**
Estructura de dato sorprendente → explicación → aplicación práctica
Ideal para: contenido de valor, posicionamiento de autoridad, tutoriales
Técnica: abre con estadística o afirmación que rompe creencias

#### Canvas de Guion (Tabla Interactiva)
La IA genera el borrador completo. El usuario edita sobre él.

| Tiempo | Escena | Visual | Audio | Subtítulo |
|--------|--------|--------|-------|-----------|
| 0-3s (Hook) | Gancho | Sugerencia de plano | Voz en off / música | Frase de impacto |
| 4-15s | Planteamiento | Close-up recomendado | Continuación | Dato o contexto |
| 16-45s | Clímax | Cortes 0.5-1s | Punto álgido | Frase clave |
| 46-60s | Resolución | Plano final | CTA o reflexión | CTA visual |

#### Adaptación Multi-formato Automática
Un solo guion se adapta automáticamente a 4 formatos:
- **Video** (Reels/TikTok/Shorts) — guion con timing y sugerencias visuales
- **Post escrito** — adaptación para feed de Instagram/LinkedIn/Facebook
- **Email** — versión larga con subject line y estructura HTML
- **WhatsApp** — versión corta para envío directo por Evolution API

#### Validador de Retención
Evalúa el Hook en tiempo real mientras el usuario escribe o la IA genera:
- 🔴 Hook débil → reescritura automática con 3 alternativas propuestas
- 🟡 Hook aceptable → sugerencia de mejora opcional
- 🟢 Hook fuerte → aprobado para continuar al Bloque 3

El sistema analiza: longitud, impacto emocional, claridad, elemento de sorpresa y velocidad de lectura.

---

### BLOQUE 3 — CÁMARA (Visual Factory)

**Propósito:** producción visual dinámica. Pensar en 9:16 desde el primer momento.

#### Preview Interactivo 9:16
Ventana con forma de smartphone donde se visualiza el contenido en 3 capas progresivas:

**Capa 1 — Base (siempre visible)**
Storyboard de texto con timing. Mesa de diseño de retención visual.
Muestra cómo fluye la narrativa dentro del encuadre vertical.

**Capa 2 — Archivos del usuario**
El usuario sube sus fotos o clips de video.
El sistema los posiciona automáticamente en el encuadre 9:16.
Prioriza primeros planos (close-ups) para pantallas móviles.
En Mini-Documentales: alterna entre presente y archivos históricos según la estructura Replay.

**Capa 3 — Inteligencia aplicada (Skills activas)**
- Parallax/VFX aplicado a imágenes estáticas
- Subtítulos Zero-Click superpuestos
- Upscaling automático de resolución
- Corrección estética automática

#### Skills Técnicas — Panel de Interruptores

**Skill: Zero-Click Captions**
Genera subtítulos gráficos animados automáticamente desde el texto del Scripting Engine.
- Sincronización automática con el timing del guion
- Estilo configurable: "Viral TikTok" / "Elegante Documental" / "Impacto Rápido"
- Animación palabra por palabra (estilo TikTok)
- Posicionamiento inteligente: no cubre rostros ni elementos importantes
- Resalta frases clave en tamaño y color diferente

**Skill: VFX/AI Maps (Parallax)**
Convierte imágenes estáticas en secuencias dinámicas con efecto de profundidad.
- Fundamental desde Sprint 1 (no es un plus, es core del sistema)
- Reduce tiempo de postproducción de 5 días a 2
- Activa mapa de profundidad automático sobre la imagen subida
- Resultado: imagen con movimiento cinematográfico sin necesidad de video

**Skill: Upscaling**
Mejora automática de resolución para garantizar calidad en todas las pantallas.

#### Ritmo de Edición
El sistema sugiere cortes cada 0.5 a 1 segundo en las escenas de clímax.
Ritmo adaptado por modelo narrativo:
- Mini-Documental: cortes más lentos en momentos emocionales
- Micro-Novela: cortes rápidos para generar tensión antes del giro
- Educativo: ritmo constante con pausa en el dato clave

---

### BLOQUE 4 — RAYO (Impact Motor)

**Propósito:** viralización e interacción. El App Store interno de agentes de la máquina.

#### Modelo de Gestión — 3 Niveles

**Nivel Administrador — App Store**
El administrador configura qué agentes están disponibles en la biblioteca global.
Puede añadir nuevos agentes sin modificar el código base (arquitectura de skills).
Ejemplo: añadir "Agente de Narrativa de Suspenso" o "Agente de Casos de Éxito".

**Nivel Usuario — Interruptores por Proyecto**
El usuario activa o desactiva cada agente por proyecto específico.
Ejemplo: Agente de Humor activado para micro-novela, desactivado para documental institucional.

**Nivel IA — Sugerencia Agéntica**
La IA analiza el guion generado y sugiere proactivamente qué agentes activar.
Ejemplo: detecta términos de tendencia → sugiere activar Agente SEO Social.
Ciertos agentes (Parallax, Zero-Click) se configuran para ejecutarse automáticamente tras aprobación inicial.

#### Agentes Disponibles

**Agente de Humor**
Analiza el guion y sugiere giros irónicos para humanizar el contenido.
Aplica métricas de autenticidad: detecta si el tono es demasiado corporativo.
Filtro anti-corporativo: penaliza lenguaje excesivamente pulido o formal.

**Agente de Validación — Semáforo de Autenticidad**
Evalúa saturación emocional (humor, sorpresa, empatía) antes de producir.
Score de Autenticidad: mide si el contenido se siente "relatable" o "institucional".
🔴 Demasiado corporativo → sugiere reescritura con tono más humano
🟡 Aceptable → propone ajustes menores
🟢 Auténtico → aprobado para producción

**Agente SEO Social — 4 Niveles de Profundidad**

| Nivel | Función |
|-------|---------|
| Básico | Hashtags y keywords de alto valor por plataforma |
| Estratégico | Mejor hora de publicación por plataforma + análisis de sentimiento |
| Narrativo | FAQs de la audiencia + tendencias emergentes del sector |
| Analítico | Reporte de impacto proyectado + narrativas de performance comprensibles |

Proceso interno del agente:
1. Analiza el guion en busca de términos clave
2. Consulta tendencias en tiempo real de TikTok, Instagram, LinkedIn
3. Identifica FAQs que la audiencia está haciendo hoy
4. Genera metadatos optimizados por plataforma
5. Proyecta alcance estimado antes de publicar

**Agente de Repropósito**
Convierte 1 pieza larga en 5 piezas de micro-contenido.

Proceso:
1. Usuario activa la skill y sube el video o audio largo
2. La IA identifica unidades semánticas independientes (Regla del Mensaje Único)
3. Fragmenta respetando la estructura Gancho → Planteamiento → Clímax → Resolución en cada pieza
4. Genera automáticamente: Shorts, Reels, TikToks, carruseles de 5-10 láminas, hilos de texto
5. Todas las piezas pasan al Bloque 5 para programación y distribución

---

### BLOQUE 5 — ENGRANAJE (Flywheel de Distribución y Conversión)

**Propósito:** publicar, distribuir, medir y aprender. El ciclo nunca termina — cada publicación mejora la siguiente.

#### Canales Soportados
Configurables por empresa al instalar la plataforma:
- Instagram (Reels + Feed + Stories)
- Facebook (Reels + Feed)
- TikTok
- YouTube Shorts
- LinkedIn (Video + Carrusel + Texto)
- Twitter/X

#### Flujo de Publicación
```
IA analiza historial de engagement por plataforma
→ Propone fecha y hora óptima por canal
→ Usuario revisa y aprueba en calendario visual
→ Sistema publica automáticamente en todos los canales aprobados
→ Monitoreo de primeras 2 horas post-publicación
→ Alerta si performance cae bajo umbral esperado
```

#### Calendario Visual
Vista mensual con:
- Piezas programadas por canal con código de color
- Estado: borrador / aprobado / publicado / en análisis
- Indicador de carga semanal (evita saturación de la audiencia)
- Propuesta automática de OpenClaw para completar semanas vacías

#### Ciclo de Aprendizaje — Retroalimentación al Bloque 1
Después de publicar, el sistema no solo muestra métricas. Aprende y actúa:

| Acción | Qué hace el sistema |
|--------|---------------------|
| Medición | Rastrea views, retención por segundo, CTR, comentarios, shares |
| Análisis | Identifica en qué segundo exacto la audiencia abandona el video |
| Aprendizaje | Extrae disparadores emocionales que funcionaron |
| Ajuste | Mejora automáticamente la estructura de próximos guiones en Bloque 2 |
| Predicción | Anticipa tendencias y ajusta hora/plataforma para próxima pieza |
| Reporte | Genera narrativa comprensible del performance (no solo números) |

**Retroalimentación específica al Bloque 1:**
- Si el arquetipo no está resonando → sugiere ajuste en Brand Knowledge Base
- Si el buyer persona está equivocado → propone revisión basada en comentarios reales
- Si cierto tipo de hook funciona mejor → lo prioriza en plantillas del Bloque 2

#### Agente de Repropósito (integración con Bloque 4)
Las 5 piezas generadas en el Bloque 4 llegan aquí con metadatos optimizados.
El Flywheel las programa estratégicamente para maximizar alcance omnicanal.
No publica todas el mismo día — distribuye en la semana según análisis de audiencia.

---

## 3. MÓDULO B — CENTRO DE OPERACIONES

### Gestión de Campañas de Pauta

#### Meta Campaigns Manager
**Conexión:** Meta Ads API (System User Token)
**Prerequisito:** verificación de negocio en Meta Business Manager

Funcionalidades:
- Vista de campañas activas con CTR, ROAS y costo por lead en tiempo real
- Alertas automáticas cuando ROAS cae bajo umbral definido
- Creación de audiencias lookalike desde base de clientes PostgreSQL
- A/B testing de copys con análisis de ganador automático
- OpenClaw puede crear, pausar y optimizar campañas por instrucción en lenguaje natural

#### Google Ads Center
**Conexión:** Google Ads API

Funcionalidades:
- Dashboard de keywords con Quality Score y posición promedio
- Negativas automáticas basadas en análisis de términos de búsqueda
- Presupuesto dinámico: ajuste automático por día y hora
- Reportes semanales automáticos enviados por WhatsApp
- Integración con Google Sheets para historial de conversiones

---

### Clientes 360°

**Fuentes de datos (lectura directa desde PostgreSQL):**
- Tabla `clientes` — base completa con historial de compras
- Tabla `cotizaciones` — cron diario desde Crisolweb
- Tabla `facturas` — ventas confirmadas
- Tabla `prospectos` — nueva, ver sección de base de datos

**Funcionalidades:**
- Filtros combinables: ciudad, asesor, producto, activo/inactivo, rango de compra, frecuencia
- Score de calor: compra reciente + volumen + frecuencia (calculado en backend)
- Detección automática de clientes en riesgo (sin compra en 45 días)
- Exportar segmento → lanzar campaña Meta o email directamente
- Vista Kanban por etapa de relación comercial
- Clientes nuevos aparecen automáticamente al registrar primera compra

**Regla de política comercial aplicable a instancia Probolsas (Punto 3.9):**
Clientes sin gestión comprobable por 3 meses → transferencia automática al asesor PITER.
Configurable por empresa en la instalación.

---

### Módulo de Prospectos

**Definición:** prospecto = persona o empresa que contactó y nunca ha comprado.
Se determina cruzando el teléfono normalizado contra la tabla `clientes` en PostgreSQL.

**Canales de entrada:**
1. WhatsApp vía Evolution API → Chatwoot → Piter
2. Web chat del sitio → Chatwoot
3. Carga manual por asesores → formulario en dashboard

**Pipeline de 5 etapas:**
```
NUEVO → CALIFICADO → COTIZADO → NEGOCIANDO → CONVERTIDO
```

| Etapa | Definición | Trigger automático |
|-------|------------|-------------------|
| Nuevo | Primer contacto sin más interacción | Piter saluda y califica |
| Calificado | Respondió, producto y ciudad capturados | Asignar asesor si supera umbral |
| Cotizado | Cotización emitida en ERP vinculada | Seguimiento automático 48h |
| Negociando | Asesor activo, respuesta a cotización | Alerta si +5 días sin movimiento |
| Convertido | Primera factura emitida | Mover a Clientes 360° + bienvenida |

---

### Email Marketing

**Proveedor:** Resend
**Dominio sender:** `marketing@[dominio-empresa]`
**Plan inicial:** gratuito (3,000 emails/mes) → escala a $20/mes (50,000 emails/mes)

**Funcionalidades:**
- Plantillas HTML generadas por Claude API según campaña y segmento
- Secuencias automáticas: bienvenida, reactivación, upsell
- Historial completo por cliente: qué recibió, cuándo, si abrió
- A/B testing de asuntos con selección automática del ganador
- Prospectos fríos (+30 días) entran automáticamente a nurturing mensual

---

## 4. BASE DE DATOS

### Tablas existentes (solo lectura)
| Tabla | Contenido | Origen |
|-------|-----------|--------|
| `clientes` | Base de clientes con historial | ERP → PostgreSQL |
| `cotizaciones` | Cotizaciones con teléfono del cliente | ERP → PostgreSQL (cron diario) |
| `facturas` | Ventas confirmadas | ERP → PostgreSQL |

### Tablas nuevas a crear

#### `prospectos`
```sql
CREATE TABLE prospectos (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre                    VARCHAR(200),
  telefono                  VARCHAR(20) NOT NULL,
  email                     VARCHAR(200),
  empresa                   VARCHAR(200),
  ciudad                    VARCHAR(100),
  fuente                    VARCHAR(30),
  -- 'whatsapp' | 'webchat' | 'manual' | 'meta' | 'google'
  producto_interes          VARCHAR(200),
  asesor_asignado           VARCHAR(100),
  etapa                     VARCHAR(30) DEFAULT 'nuevo',
  -- 'nuevo' | 'calificado' | 'cotizado' | 'negociando' | 'convertido'
  temperatura               VARCHAR(20) DEFAULT 'nuevo',
  -- 'nuevo' | 'caliente' | 'frio'
  score                     INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  fecha_primer_contacto     TIMESTAMP DEFAULT NOW(),
  fecha_ultima_interaccion  TIMESTAMP DEFAULT NOW(),
  fecha_proximo_seguimiento TIMESTAMP,
  cotizacion_id             VARCHAR(50),
  notas_openclaw            TEXT,
  convertido                BOOLEAN DEFAULT FALSE,
  created_at                TIMESTAMP DEFAULT NOW(),
  updated_at                TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prospectos_telefono ON prospectos(telefono);
CREATE INDEX idx_prospectos_etapa ON prospectos(etapa);
CREATE INDEX idx_prospectos_temperatura ON prospectos(temperatura);
CREATE INDEX idx_prospectos_seguimiento ON prospectos(fecha_proximo_seguimiento);
```

#### `interacciones_prospecto`
```sql
CREATE TABLE interacciones_prospecto (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospecto_id   UUID REFERENCES prospectos(id) ON DELETE CASCADE,
  fecha          TIMESTAMP DEFAULT NOW(),
  canal          VARCHAR(30),
  tipo           VARCHAR(20),
  nota           TEXT,
  ejecutado_por  VARCHAR(100)
);
```

#### `brand_profiles` (multi-empresa)
```sql
CREATE TABLE brand_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_nombre   VARCHAR(200) NOT NULL,
  sector           VARCHAR(100),
  arquetipo        VARCHAR(50),
  buyer_persona    JSONB,
  voz_marca        TEXT,
  colores          JSONB,
  canales_activos  JSONB,
  knowledge_base   JSONB,
  -- rutas de archivos cargados
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);
```

#### `proyectos_contenido`
```sql
CREATE TABLE proyectos_contenido (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id  UUID REFERENCES brand_profiles(id),
  titulo            VARCHAR(300),
  modelo_narrativo  VARCHAR(50),
  -- 'mini-documental' | 'micro-novela' | 'educativo'
  estado            VARCHAR(30) DEFAULT 'borrador',
  -- 'borrador' | 'scripting' | 'produccion' | 'aprobado' | 'publicado'
  guion_canvas      JSONB,
  formatos_salida   JSONB,
  -- video, post, email, whatsapp
  skills_activas    JSONB,
  metricas          JSONB,
  -- datos post-publicación
  fecha_publicacion TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW()
);
```

#### `campanas_email`
```sql
CREATE TABLE campanas_email (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          VARCHAR(200),
  segmento        VARCHAR(100),
  asunto          VARCHAR(300),
  html_contenido  TEXT,
  estado          VARCHAR(30) DEFAULT 'borrador',
  total_enviados  INTEGER DEFAULT 0,
  total_abiertos  INTEGER DEFAULT 0,
  total_clicks    INTEGER DEFAULT 0,
  resend_id       VARCHAR(100),
  fecha_envio     TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  aprobada_por    VARCHAR(100)
);
```

#### `copys_banco`
```sql
CREATE TABLE copys_banco (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id UUID REFERENCES brand_profiles(id),
  linea_producto   VARCHAR(100),
  canal            VARCHAR(50),
  tipo             VARCHAR(50),
  contenido        TEXT,
  aprobado         BOOLEAN DEFAULT FALSE,
  performance_ctr  DECIMAL(5,2),
  created_at       TIMESTAMP DEFAULT NOW()
);
```

---

## 5. WORKFLOWS N8N

### Workflow 1 — El Portero
**Trigger:** webhook Evolution API — nuevo mensaje WhatsApp
**Frecuencia:** tiempo real

```
Nuevo mensaje WA llega
→ n8n captura: teléfono, nombre, mensaje
→ Consulta PostgreSQL: ¿teléfono en tabla clientes?
→ SÍ → Piter responde como cliente con historial completo
→ NO → INSERT en tabla prospectos (etapa='nuevo', fuente='whatsapp')
      → Registrar en interacciones_prospecto
      → Etiquetar conversación Chatwoot como PROSPECTO
      → Piter inicia secuencia de calificación
```

### Workflow 2 — El Revisor de Cotizaciones
**Trigger:** cron diario 23:30 (después del sync del ERP)
**Frecuencia:** una vez al día

```
n8n cron 23:30
→ SELECT cotizaciones nuevas de hoy con teléfono
→ Para cada cotización:
   → Buscar teléfono en tabla prospectos
   → SI existe → UPDATE etapa='cotizado', cotizacion_id, fecha_proximo_seguimiento=NOW()+48h
               → INSERT interacción 'Cotización emitida'
   → SI no existe en prospectos ni clientes → crear prospecto en etapa 'cotizado'
```

### Workflow 3 — El Seguidor
**Trigger:** cron diario 08:00
**Frecuencia:** una vez al día

```
n8n cron 08:00
→ SELECT prospectos WHERE convertido = FALSE

→ CASO 1: etapa='nuevo' Y sin movimiento +24h
   → Piter envía mensaje de seguimiento
   → UPDATE fecha_proximo_seguimiento = NOW()+24h

→ CASO 2: etapa='cotizado' Y fecha_proximo_seguimiento < NOW()
   → Piter envía seguimiento + alerta al asesor en Chatwoot
   → UPDATE fecha_proximo_seguimiento = NOW()+48h

→ CASO 3: etapa='negociando' Y sin movimiento +5 días
   → Alerta WhatsApp al GM con resumen del prospecto
   → UPDATE temperatura = 'frio'

→ CASO 4: sin interacción +30 días Y etapa != 'convertido'
   → Entrar a nurturing email mensual vía Resend
   → UPDATE temperatura = 'frio'
   → INSERT interacción 'Ingresó a nurturing mensual'
```

### Workflow 4 — Publicación de Contenido
**Trigger:** aprobación del usuario en el Bloque 5
**Frecuencia:** según calendario programado

```
Usuario aprueba publicación en calendario
→ n8n recibe señal con: plataformas, fecha/hora, contenido, metadatos SEO
→ Publica en cada canal aprobado vía sus APIs
→ Registra publicación en tabla proyectos_contenido
→ Inicia monitoreo: consulta métricas cada 2h durante primeras 24h
→ Registra datos de retención y engagement
→ Envía datos al Bloque 1 para ciclo de aprendizaje
```

---

## 6. PITERLABS AGENT (OpenClaw)

### Skill: `piterlabs-agent`

**Descripción:**
PiterLabs Agent es el agente central que orquesta todos los módulos de la plataforma. Opera en lenguaje natural vía Telegram o WhatsApp. Puede ejecutar el pipeline completo de producción de contenido, gestionar campañas de pauta, analizar prospectos y generar reportes — todo desde una instrucción de texto.

### Comandos de referencia
```
// Contenido
"Crea un mini-documental sobre nuestro caso de éxito con [cliente]"
"Genera 3 versiones del hook para el video de [producto]"
"Repropósito el podcast de esta semana en 5 piezas para redes"
"Analiza qué contenido tuvo mejor retención este mes"

// Campañas
"Dame el reporte semanal de Meta Ads"
"Pausa la campaña de Google si el CPC sube de [umbral]"
"Crea audiencia lookalike basada en clientes activos de [ciudad]"

// Prospectos y clientes
"Cuántos prospectos nuevos llegaron esta semana"
"Activa seguimiento para cotizados sin respuesta hace más de 48h"
"Cuántos clientes están en riesgo de fuga este mes"

// Reportes
"Genera reporte ejecutivo de marketing para presentar a CEO"
"Qué contenido debo producir esta semana según las tendencias"
```

### Reglas de operación
1. Proponer antes de ejecutar acciones de alto impacto (presupuesto, envíos masivos, publicaciones)
2. Actuar autónomamente en: seguimientos, generación de contenido, reportes, análisis
3. Reportes automáticos cada lunes 8AM al GM vía WhatsApp
4. Escalar solo cuando el riesgo económico o reputacional lo amerita
5. Siempre registrar en PostgreSQL cada acción ejecutada

---

## 7. SPRINTS DE CONSTRUCCIÓN

### Sprint 1 — Interfaz base + Clientes 360° (PRIMER ENTREGABLE)
**Objetivo:** `marketing.probolsas.co` funcionando con datos reales

Tareas:
- [x] Scaffold React + Vite + TailwindCSS
- [x] Backend Node.js + Express + conexión PostgreSQL
- [x] Docker Swarm service + Traefik + subdominio
- [x] CI/CD GitHub Actions
- [x] Layout del dashboard: navegación de 5 bloques (Módulo A) + módulos operativos (Módulo B)
- [x] Módulo Clientes 360° con filtros, score de calor y detección de riesgo

**Criterio de Done:** dashboard visible en producción con datos reales de clientes

---

### Sprint 2 — Módulo de Prospectos + Workflows 1, 2 y 3
Tareas:
- Crear tablas `prospectos` e `interacciones_prospecto`
- Vista Kanban de pipeline en dashboard
- Formulario de carga manual
- Workflows n8n 1, 2 y 3
- Integración Chatwoot: etiquetado automático

**Criterio de Done:** prospecto llega por WA → aparece clasificado en dashboard en <60 segundos

---

### Sprint 3 — Bloque 1 (Cerebro) + Bloque 2 (Scripting Engine)
Tareas:
- Crear tabla `brand_profiles` y `proyectos_contenido`
- UI del Bloque 1: drag-and-drop Brand Knowledge Base, selector de arquetipo, módulo buyer persona
- Procesamiento de archivos con Claude API
- UI del Bloque 2: selector de plantilla, canvas interactivo, validador de retención
- Generación de guion multi-formato (video + post + email + WhatsApp)
- Skill `piterlabs-agent` v1 para comandos de scripting

**Criterio de Done:** usuario carga su marca y obtiene guion completo en 4 formatos

---

### Sprint 4 — Bloque 3 (Visual Factory)
Tareas:
- Preview interactivo 9:16 en el dashboard
- Carga de archivos del usuario (fotos/video)
- Skill Zero-Click Captions con 3 estilos
- Skill Parallax/VFX sobre imágenes estáticas
- Skill Upscaling automático
- Panel de interruptores de skills

**Criterio de Done:** usuario sube foto → preview muestra imagen con Parallax y subtítulos animados

---

### Sprint 5 — Bloque 4 (Impact Motor) + Email Marketing
Tareas:
- App Store interno de agentes
- Agente de Humor + Agente de Validación (semáforo de autenticidad)
- Agente SEO Social (4 niveles)
- Agente de Repropósito (1 video → 5 piezas)
- Configurar Resend + tabla `campanas_email`
- Módulo email en dashboard: crear, segmentar, aprobar, enviar

**Criterio de Done:** video repropósito en 5 piezas + primer envío email desde `marketing@probolsas.co`

---

### Sprint 6 — Bloque 5 (Flywheel) + Meta Ads + Google Ads
Tareas:
- Calendario visual de publicaciones
- Publicación automática multi-canal (6 plataformas)
- Monitoreo de métricas post-publicación
- Ciclo de retroalimentación al Bloque 1
- Meta Ads API conectada al dashboard
- Google Ads API conectada al dashboard
- Alertas automáticas de performance

**Criterio de Done:** pieza publicada desde el dashboard → métricas visibles → sistema ajusta estrategia

---

### Sprint 7 — PiterLabs Agent completo + Tutorial de Replicación
Tareas:
- Skill `piterlabs-agent` v2 con acceso a todos los módulos
- Reportes automáticos lunes 8AM vía WhatsApp
- Documentación de instalación paso a paso (README replicable)
- Video tutorial de configuración inicial (PedroStudio)
- Caso de éxito documentado: Probolsas como piloto

**Criterio de Done:** OpenClaw ejecuta pipeline completo por instrucción de Telegram + tutorial publicado

---

## 8. CONFIGURACIÓN MULTI-EMPRESA

### Variables de configuración por empresa
Al instalar PiterLabs, cada empresa configura:

```env
# Identidad
EMPRESA_NOMBRE=
EMPRESA_DOMINIO=
EMPRESA_SECTOR=

# Infraestructura
DATABASE_URL=
N8N_WEBHOOK_URL=
TRAEFIK_DOMAIN=

# IA
ANTHROPIC_API_KEY=

# Email
RESEND_API_KEY=
RESEND_SENDER_EMAIL=

# WhatsApp (opcional)
EVOLUTION_API_URL=
EVOLUTION_API_KEY=

# CRM (opcional)
CHATWOOT_API_TOKEN=
CHATWOOT_ACCOUNT_ID=

# Pauta (opcional — activar según plan)
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=

# Canales de publicación (activar los que apliquen)
INSTAGRAM_ACCESS_TOKEN=
TIKTOK_ACCESS_TOKEN=
LINKEDIN_ACCESS_TOKEN=
YOUTUBE_API_KEY=
TWITTER_API_KEY=
```

### Módulos opcionales vs obligatorios
| Módulo | Obligatorio | Opcional |
|--------|-------------|----------|
| Bloque 1 — Cerebro | ✅ | |
| Bloque 2 — Scripting | ✅ | |
| Bloque 3 — Visual Factory | ✅ | |
| Bloque 4 — Impact Motor | ✅ | |
| Bloque 5 — Flywheel | ✅ | |
| Clientes 360° | | ✅ requiere ERP/PostgreSQL |
| Prospectos | | ✅ requiere WhatsApp/Chatwoot |
| Meta Ads | | ✅ requiere cuenta verificada |
| Google Ads | | ✅ requiere cuenta activa |
| Email Marketing | | ✅ requiere Resend |

---

## 9. DESIGN SYSTEM — PITERLABS

### Identidad visual aprobada
- **Estética:** blanco limpio con magenta como protagonista. Profesional, elegante, tecnológico sin ser oscuro.
- **Tipografía display:** `Bebas Neue` — títulos grandes, letras espaciadas, impacto visual
- **Tipografía UI:** `Syne` — navegación, botones, etiquetas
- **Tipografía técnica:** `JetBrains Mono` — datos, métricas, código, timestamps
- **Idioma:** Español — mercado latinoamericano

### Paleta de colores
```css
--bg:             #f7f7fa   /* Fondo general */
--white:          #ffffff   /* Superficies: sidebar, panels, cards */
--surface:        #f0f0f5   /* Fondos secundarios */
--border:         #e2e2ea   /* Bordes normales */
--border-soft:    #ececf3   /* Bordes suaves */
--magenta:        #cc00cc   /* Color principal — acento dominante */
--magenta-bright: #e600e6   /* Hover y estados activos */
--magenta-soft:   rgba(204,0,204,0.07)  /* Fondos activos */
--magenta-glow:   rgba(204,0,204,0.20)  /* Sombras */
--text:           #0a0a14   /* Texto principal */
--text2:          #3a3a4a   /* Texto secundario */
--muted:          #8888a0   /* Placeholders, labels */
--violet:         #6b21a8   /* Acento secundario */
--green:          #059669   /* Positivo, aprobado */
--orange:         #d97706   /* Alerta, caliente */
--red:            #dc2626   /* Error, crítico */
```

### Nomenclatura de navegación aprobada

**Máquina de Contenido — 5 pasos:**
| Ícono | Nombre en UI | Bloque técnico |
|-------|-------------|----------------|
| 🧠 | Mi Marca | Bloque 1 — Cerebro |
| ✍️ | Crear Guion | Bloque 2 — Scripting Engine |
| 🎬 | Producir Video | Bloque 3 — Visual Factory |
| ⚡ | Viralizar | Bloque 4 — Impact Motor |
| ⚙️ | Publicar y Medir | Bloque 5 — Flywheel |

**Centro de Operaciones:**
| Ícono | Nombre en UI | Módulo técnico |
|-------|-------------|----------------|
| 👥 | Mis Clientes | Clientes 360° |
| 🎯 | Oportunidades | Prospectos |
| 📘 | Pauta Facebook e Instagram | Meta Ads |
| 🔴 | Pauta Google | Google Ads |
| ✉️ | Correos y Campañas | Email Marketing |
| 📅 | Mi Calendario | Calendario Editorial |

### Hero Banner (componente fijo)
Gradiente magenta → violeta oscuro con:
- Título: **"MÁQUINA DE CREACIÓN DE CONTENIDO INTELIGENTE"**
- Subtítulo: "Estrategia · Guion · Producción · Viralización · Distribución"
- Panel derecho: estado PiterLabs Agent + métrica piezas del mes

### Layout general
```
SIDEBAR 252px (blanco, línea magenta top 3px)
  └── Logo · Empresa activa · Nav · Agent footer

TOPBAR (blanco, borde bottom)
  └── Título página + botones acción

CONTENT (fondo #f7f7fa, scroll vertical)
  └── Hero Banner magenta
  └── KPIs (4 columnas)
  └── Pipeline 5 pasos
  └── Comando del Agente
  └── Grid 2 col (Oportunidades + Contenido activo)
  └── Monitor de Impacto (3 columnas)
```

### Acceso
- **Un solo rol:** GM — Pedro Sandoval
- Sin multiusuario en versión inicial

---

## 10. DEPLOY EN VPS

### Docker Stack
```yaml
services:
  piterlabs-frontend:
    image: piterlabs/frontend:latest
    networks:
      - probolsas
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.piterlabs.rule=Host(`marketing.probolsas.co`)"
        - "traefik.http.routers.piterlabs.tls.certresolver=le"
        - "traefik.http.services.piterlabs.loadbalancer.server.port=80"

  piterlabs-api:
    image: piterlabs/api:latest
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - META_ACCESS_TOKEN=${META_ACCESS_TOKEN}
      - GOOGLE_ADS_DEVELOPER_TOKEN=${GOOGLE_ADS_DEVELOPER_TOKEN}
    networks:
      - probolsas
      - internal

networks:
  probolsas:
    external: true
  internal:
    driver: overlay
```

**Nota Antigravity:** red de overlay es `probolsas`, no `proxy`. Traefik usa la red `probolsas`. No incluir red `internal-db` — no existe. No duplicar clave `external: true`.

---

## 10. SCRUM Y APROBACIONES

### Proceso de trabajo
- **Scrum Master:** Claude
- **Product Owner:** Pedro Sandoval (GM Probolsas / Builder PiterLabs)
- **Ejecutores:** Antigravity (construcción) + OpenClaw (operación)

### Flujo por sprint
```
1. Claude presenta tareas del sprint con detalle técnico
2. Pedro aprueba o ajusta
3. Antigravity construye
4. Claude revisa entregable contra criterios de Done
5. Pedro hace prueba de usuario final
6. Aprobación → siguiente sprint
```

---

## 11. DECISIONES TOMADAS

- [x] Nombre de la plataforma: **PiterLabs**
- [x] Dominio piloto: `marketing.probolsas.co`
- [x] Plataforma replicable: VPS propio, no SaaS
- [x] Probolsas como instancia piloto y caso de éxito
- [x] Stack frontend: React + Vite + TailwindCSS
- [x] Backend: Node.js + Express
- [x] Proveedor email: Resend
- [x] Red Docker Swarm: `probolsas` (no `proxy`)
- [x] Agente central: OpenClaw como PiterLabs Agent
- [x] Canales de distribución: IG, FB, TikTok, YouTube Shorts, LinkedIn, Twitter/X
- [x] VFX/Parallax: fundamental desde Sprint 1, no opcional
- [x] Gestión de agentes: 3 niveles (admin / usuario / IA proactiva)
- [x] Publicación: IA propone hora → usuario aprueba → sistema ejecuta
- [x] Post-publicación: retroalimenta Bloque 1 + reporte narrativo + ajuste automático

## 12. PENDIENTES DE DECISIÓN

- [ ] Verificación Meta Business Manager (prerequisito Sprint 6)
- [ ] ¿Los asesores tienen acceso al dashboard o solo el GM?
- [ ] Sender de email: ¿nombre de empresa o nombre del asesor?
- [ ] Umbral exacto de escalación de prospecto a asesor humano
- [ ] ¿PiterLabs tendrá repositorio público en GitHub para replicación?
- [ ] ¿Tutorial en formato video (PedroStudio) o documento escrito o ambos?

---

*Documento generado en sesión de planeación estratégica con Pedro Sandoval*
*PiterLabs — Marketing del futuro, operando hoy*
