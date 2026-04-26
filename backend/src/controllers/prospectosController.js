import pool from '../db/pool.js';

// ----------------------------------------------------------------
// GET /api/prospectos/kanban
// Devuelve 3 columnas con datos reales de los 3 schemas
// ----------------------------------------------------------------
export const getKanban = async (req, res) => {
  try {
    const [inactivosResult, negociacionResult, nuevosResult] = await Promise.all([

      // Columna 1: Clientes inactivos (sin compra en 45 días) — maestros schema
      pool.query(`
        SELECT
          t.razon_social     AS nombre,
          t.telefono,
          t.ciudad,
          t.email,
          c.ultima_compra,
          c.vendedor_asignado,
          c.total_facturado,
          'inactivo'         AS vista_etapa
        FROM maestros.clientes c
        JOIN maestros.terceros t ON t.id = c.tercero_id
        WHERE c.ultima_compra < NOW() - INTERVAL '45 days'
          AND c.activo = true
        ORDER BY c.ultima_compra ASC
        LIMIT 50
      `),

      // Columna 2: Cotizaciones recientes — crisolweb schema
      pool.query(`
        SELECT
          cc.cliente          AS nombre,
          cc.nro_cotizacion,
          cc.fecha_aprobacion,
          cc.valor_total,
          cc.vendedor,
          'negociacion'       AS vista_etapa
        FROM crisolweb.cotizaciones_clientes cc
        WHERE cc.fecha_aprobacion > NOW() - INTERVAL '30 days'
        ORDER BY cc.fecha_aprobacion DESC
        LIMIT 50
      `),

      // Columna 3: Nuevos prospectos — marketing schema (escritura propia)
      pool.query(`
        SELECT
          nombre,
          telefono,
          empresa,
          ciudad,
          temperatura,
          fuente,
          fecha_primer_contacto,
          fecha_ultima_interaccion,
          EXTRACT(EPOCH FROM (NOW() - fecha_ultima_interaccion)) / 86400 AS dias_sin_movimiento,
          'nuevo' AS vista_etapa
        FROM marketing.prospectos
        WHERE convertido = FALSE
        ORDER BY fecha_primer_contacto DESC
        LIMIT 50
      `)
    ]);

    res.json({
      success: true,
      data: {
        inactivos:   inactivosResult.rows,
        negociacion: negociacionResult.rows,
        nuevos:      nuevosResult.rows
      }
    });
  } catch (error) {
    console.error('[ProspectosController] Error en getKanban:', error.message);
    res.status(500).json({ success: false, error: 'Error al cargar el Kanban' });
  }
};

// ----------------------------------------------------------------
// POST /api/prospectos
// Carga manual desde el formulario del dashboard
// ----------------------------------------------------------------
export const createProspecto = async (req, res) => {
  const { nombre, telefono, email, empresa, ciudad, fuente = 'manual', producto_interes } = req.body;

  // Validación: teléfono es obligatorio
  if (!telefono) {
    return res.status(400).json({ success: false, error: 'El teléfono es obligatorio' });
  }

  try {
    // Verificar que no sea un cliente activo de maestros
    const clienteExiste = await pool.query(
      `SELECT 1 FROM maestros.terceros WHERE telefono = $1 LIMIT 1`,
      [telefono]
    );
    if (clienteExiste.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Este teléfono pertenece a un cliente existente. No se crea como prospecto.'
      });
    }

    // Verificar duplicado en marketing.prospectos
    const prospectoExiste = await pool.query(
      `SELECT id FROM marketing.prospectos WHERE telefono = $1 LIMIT 1`,
      [telefono]
    );
    if (prospectoExiste.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Ya existe un prospecto con ese teléfono.',
        id: prospectoExiste.rows[0].id
      });
    }

    // Insertar nuevo prospecto
    const result = await pool.query(
      `INSERT INTO marketing.prospectos
        (nombre, telefono, email, empresa, ciudad, fuente, producto_interes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nombre, telefono, email, empresa, ciudad, fuente, producto_interes]
    );

    // Registrar primera interacción
    await pool.query(
      `INSERT INTO marketing.interacciones_prospecto
        (prospecto_id, canal, tipo, nota, ejecutado_por)
       VALUES ($1, $2, 'primer_contacto', 'Prospecto creado manualmente', 'dashboard')`,
      [result.rows[0].id, fuente]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[ProspectosController] Error en createProspecto:', error.message);
    res.status(500).json({ success: false, error: 'Error al crear el prospecto' });
  }
};

// ----------------------------------------------------------------
// PATCH /api/prospectos/:id/etapa
// Cambia etapa y registra interacción (usado por n8n y Kanban)
// ----------------------------------------------------------------
export const updateEtapa = async (req, res) => {
  const { id } = req.params;
  const { etapa, nota, ejecutado_por = 'dashboard' } = req.body;

  const etapasValidas = ['nuevo', 'calificado', 'cotizado', 'negociando', 'convertido'];
  if (!etapa || !etapasValidas.includes(etapa)) {
    return res.status(400).json({
      success: false,
      error: `Etapa inválida. Debe ser: ${etapasValidas.join(' | ')}`
    });
  }

  try {
    const result = await pool.query(
      `UPDATE marketing.prospectos
       SET etapa = $1, fecha_ultima_interaccion = NOW()
       WHERE id = $2
       RETURNING *`,
      [etapa, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Prospecto no encontrado' });
    }

    // Registrar el cambio de etapa como interacción
    await pool.query(
      `INSERT INTO marketing.interacciones_prospecto
        (prospecto_id, canal, tipo, nota, ejecutado_por)
       VALUES ($1, 'dashboard', 'cambio_etapa', $2, $3)`,
      [id, nota || `Etapa actualizada a: ${etapa}`, ejecutado_por]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[ProspectosController] Error en updateEtapa:', error.message);
    res.status(500).json({ success: false, error: 'Error al actualizar etapa' });
  }
};
