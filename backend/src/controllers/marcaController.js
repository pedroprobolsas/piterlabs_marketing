import pool from '../db/pool.js';

// ---------------------------------------------------------------
// GET /api/marca
// Retorna la configuración de marca (siempre hay una sola fila)
// ---------------------------------------------------------------
export const getMarca = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM marketing.config_marca ORDER BY created_at DESC LIMIT 1`
    );
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    console.error('[MarcaController][getMarca]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------
// PUT /api/marca
// Upsert: si existe una fila la actualiza, si no la crea
// Body: { nombre_marca, industria, propuesta_valor, tono_voz, arquetipos, buyer_persona, kb_fuentes }
// ---------------------------------------------------------------
export const upsertMarca = async (req, res) => {
  const {
    nombre_marca,
    industria,
    propuesta_valor,
    tono_voz,
    arquetipos = [],
    buyer_persona = {},
    kb_fuentes = [],
  } = req.body;

  try {
    // Verificar si ya existe una fila
    const existing = await pool.query(
      `SELECT id FROM marketing.config_marca ORDER BY created_at DESC LIMIT 1`
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE marketing.config_marca
         SET nombre_marca   = $1,
             industria      = $2,
             propuesta_valor = $3,
             tono_voz       = $4,
             arquetipos     = $5::jsonb,
             buyer_persona  = $6::jsonb,
             kb_fuentes     = $7::jsonb,
             updated_at     = NOW()
         WHERE id = $8
         RETURNING *`,
        [
          nombre_marca, industria, propuesta_valor, tono_voz,
          JSON.stringify(arquetipos),
          JSON.stringify(buyer_persona),
          JSON.stringify(kb_fuentes),
          existing.rows[0].id,
        ]
      );
    } else {
      result = await pool.query(
        `INSERT INTO marketing.config_marca
           (nombre_marca, industria, propuesta_valor, tono_voz, arquetipos, buyer_persona, kb_fuentes)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb)
         RETURNING *`,
        [
          nombre_marca, industria, propuesta_valor, tono_voz,
          JSON.stringify(arquetipos),
          JSON.stringify(buyer_persona),
          JSON.stringify(kb_fuentes),
        ]
      );
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('[MarcaController][upsertMarca]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
