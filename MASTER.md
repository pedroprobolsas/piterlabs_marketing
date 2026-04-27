# PITERLABS MARKETING — MASTER BACKLOG

> Registro de funcionalidades aprobadas pendientes de sprint.
> Estado: PENDIENTE | EN SPRINT | ENTREGADO

---

## SPRINT 4 — PENDIENTE DE INICIO

### B.2 — Crear Guion · Skills de Guion Personalizables
**Estado:** PENDIENTE APROBADO  
**Módulo:** `/pluma` — Crear Guion  
**Descripción:**  
Agregar sección "Estilo Cinematográfico" en la pantalla de Crear Guion con opciones de prompt avanzado que modifican el contexto enviado a Claude:

- **Tipo de cinematografía** (selector visual):
  - Documental
  - Publicidad emocional
  - Estilo Netflix
  - Viral UGC
- **Ritmo de edición** (selector): Lento · Medio · Rápido
- **Referencias visuales** (campo libre): el usuario describe referencias (ej: "estilo Apple, cortes secos, música minimalista")

Estas opciones se inyectan en el prompt de `generar-guion` para que Claude produzca guiones con instrucciones de dirección más específicas y cinematográficas.

---

### B.4 — Viralizar · App Store de Agentes
**Estado:** PENDIENTE APROBADO  
**Módulo:** `/rayo` — Viralizar (actualmente "Próximamente")  
**Descripción:**  
Pantalla de gestión de agentes con tarjetas on/off. Cada agente procesa el guion generado en B.2 y retorna una versión modificada o datos complementarios:

| Agente | Función | Endpoint Claude |
|---|---|---|
| **Agente de Humor** | Inyecta giros irónicos y remates al guion | `POST /api/claude/agente-humor` |
| **Agente SEO Social** | Genera hashtags relevantes + mejor hora de publicación + análisis de tendencias del tema | `POST /api/claude/agente-seo` |
| **Agente de Repropósito** | Fragmenta el guion en 5 piezas de micro-contenido (stories, carruseles, clips) | `POST /api/claude/agente-reproposito` |

UI: tarjetas con toggle on/off, descripción del agente, botón "Ejecutar" que toma el guion activo de B.2 y retorna el resultado en un panel expandible.

---

## BACKLOG GENERAL — SIN SPRINT ASIGNADO

- KB de Marca (carry-over Sprint 3): UI para subir PDFs/URLs, extracción de texto, almacenamiento en `kb_fuentes` JSONB, inyección en prompts Claude
- Dashboard KPIs reales: conectar las 4 métricas hardcodeadas con queries reales a BD
- B.3 Producir Video (`/camara`): pantalla de producción
- B.5 Publicar y Medir (`/engranaje`): métricas y publicación
- Email Marketing (`/email`): módulo de campañas
- SSL: verificar emisión del certificado Let's Encrypt en VPS
