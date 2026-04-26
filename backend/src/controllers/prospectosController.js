import pool from '../db/pool.js';

// Helper: query aislada — si falla retorna [] y loguea en UNA sola línea
async function safeQuery(label, sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    console.log(`[OK][${label}] ${result.rows.length} filas`);
    return { rows: result.rows, error: null };
  } catch (err) {
    // Todo en UNA línea para que grep lo capture completo
    console.error(`[ERR][${label}] ${err.message} | code=${err.code} | detail=${err.detail || '-'}`);
    return { rows: [], error: err.message };
  }
}

// ---------------------------------------------------------------
// GET /api/prospectos/debug
// Diagnóstico de conexión DB y acceso a schemas
// ---------------------------------------------------------------
export const debugDB = async (req, res) => {
  const checks = {};

  // Test 1: conexión básica
  try {
    const r = await pool.query('SELECT current_user, current_database(), version()');
    checks.conexion = { ok: true, user: r.rows[0].current_user, db: r.rows[0].current_database };
  } catch (e) {
    checks.conexion = { ok: false, error: e.message };
  }

  // Test 2: schema marketing
  try {
    const r = await pool.query('SELECT COUNT(*) FROM marketing.prospectos');
    checks.marketing = { ok: true, count: r.rows[0].count };
  } catch (e) {
    checks.marketing = { ok: false, error: e.message };
  }

  // Test 3: schema maestros
  try {
    await pool.query('SELECT 1 FROM maestros.clientes LIMIT 1');
    checks.maestros = { ok: true };
  } catch (e) {
    checks.maestros = { ok: false, error: e.message };
  }

  // Test 4: schema crisolweb
  try {
    await pool.query('SELECT 1 FROM crisolweb.cotizaciones_clientes LIMIT 1');
    checks.crisolweb = { ok: true };
  } catch (e) {
    checks.crisolweb = { ok: false, error: e.message };
  }

  console.log('[DEBUG]', JSON.stringify(checks));
  res.json({ checks });
};

export const getKanban = async (req, res) => {
  const [inactivosRes, negociacionRes, nuevosRes] = await Promise.all([

    safeQuery('inactivos', `
      SELECT
        t.razon_social      AS nombre,
        t.telefono,
        t.ciudad,
        t.email,
        c.ultima_compra,
        c.vendedor_asignado,
        c.total_facturado,
        'inactivo'          AS vista_etapa
      FROM maestros.clientes c
      JOIN maestros.terceros t ON t.id = c.tercero_id
      WHERE c.ultima_compra < NOW() - INTERVAL '45 days'
        AND c.activo = true
      ORDER BY c.ultima_compra ASC
      LIMIT 50
    `),

    safeQuery('negociacion', `
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

    safeQuery('nuevos', `
      SELECT
        id,
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

  // Log de diagnóstico al arrancar (visible en docker service logs)
  const hayErrores = [inactivosRes, negociacionRes, nuevosRes].some(r => r.error);
  if (hayErrores) {
    console.error('[ProspectosController][getKanban] Algunas queries fallaron:');
    if (inactivosRes.error)   console.error('  · inactivos:', inactivosRes.error);
    if (negociacionRes.error) console.error('  · negociacion:', negociacionRes.error);
    if (nuevosRes.error)      console.error('  · nuevos:', nuevosRes.error);
  }

  // Siempre responde 200 — el frontend muestra columnas vacías con el error
  res.json({
    success: true,
    data: {
      inactivos:   inactivosRes.rows,
      negociacion: negociacionRes.rows,
      nuevos:      nuevosRes.rows,
    },
    // Errores por columna para diagnóstico en el frontend
    errors: {
      inactivos:   inactivosRes.error,
      negociacion: negociacionRes.error,
      nuevos:      nuevosRes.error,
    }
  });
};

// ---------------------------------------------------------------
// POST /api/prospectos
// Carga manual desde el formulario del dashboard
// ---------------------------------------------------------------
export const createProspecto = async (req, res) => {
  const { nombre, telefono, email, empresa, ciudad, fuente = 'manual', producto_interes } = req.body;

  if (!telefono) {
    return res.status(400).json({ success: false, error: 'El teléfono es obligatorio' });
  }

  try {
    // Verificar que no sea cliente activo en maestros
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

    const result = await pool.query(
      `INSERT INTO marketing.prospectos
        (nombre, telefono, email, empresa, ciudad, fuente, producto_interes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nombre, telefono, email, empresa, ciudad, fuente, producto_interes]
    );

    await pool.query(
      `INSERT INTO marketing.interacciones_prospecto
        (prospecto_id, canal, tipo, nota, ejecutado_por)
       VALUES ($1, $2, 'primer_contacto', 'Prospecto creado manualmente', 'dashboard')`,
      [result.rows[0].id, fuente]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[ProspectosController][createProspecto]', error.message);
    res.status(500).json({ success: false, error: 'Error al crear el prospecto' });
  }
};

// ---------------------------------------------------------------
// PATCH /api/prospectos/:id/etapa
// Cambia etapa y registra interacción
// ---------------------------------------------------------------
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

    await pool.query(
      `INSERT INTO marketing.interacciones_prospecto
        (prospecto_id, canal, tipo, nota, ejecutado_por)
       VALUES ($1, 'dashboard', 'cambio_etapa', $2, $3)`,
      [id, nota || `Etapa actualizada a: ${etapa}`, ejecutado_por]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[ProspectosController][updateEtapa]', error.message);
    res.status(500).json({ success: false, error: 'Error al actualizar etapa' });
  }
};
