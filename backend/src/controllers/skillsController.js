import pool from '../db/pool.js';

// GET /api/skills — todas las skills ordenadas
export const getSkills = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, clave, nombre, descripcion, instrucciones, activa, orden, updated_at FROM marketing.skills ORDER BY orden'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[SkillsController][getSkills]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/skills/:id — actualizar nombre, descripcion, instrucciones, activa
export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, instrucciones, activa } = req.body;

  if (!nombre?.trim() || !instrucciones?.trim()) {
    return res.status(400).json({ success: false, error: 'nombre e instrucciones son obligatorios' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE marketing.skills
       SET nombre = $1, descripcion = $2, instrucciones = $3, activa = $4
       WHERE id = $5
       RETURNING id, clave, nombre, descripcion, instrucciones, activa, orden, updated_at`,
      [nombre.trim(), descripcion?.trim() ?? '', instrucciones.trim(), activa ?? true, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Skill no encontrada' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[SkillsController][updateSkill]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
