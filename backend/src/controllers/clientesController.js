import pool from '../db/pool.js';

export const getClientes = async (req, res) => {
  try {
    const { ciudad, asesor, estado, producto } = req.query;

    // TODO: Ajustar esta consulta cuando sepamos el esquema real
    let baseQuery = `
      SELECT 
        1 AS id,
        'Cliente Generico' AS nombre,
        '3000000000' AS telefono,
        'Bogotá' AS ciudad,
        'Piter' AS asesor,
        'Empaques' AS producto,
        NOW() - INTERVAL '5 days' AS fecha_ultima_compra,
        500000 AS total_compras,
        85 AS score
    `;

    // Por ahora retornamos datos dummy emulando la consulta
    const mockData = [
      { id: 1, nombre: 'Distribuidora XYZ', ciudad: 'Bogotá', asesor: 'Piter', totalCompras: '$12,500,000', ultimCompra: 'Hace 2 días', score: 95, state: 'hot' },
      { id: 2, nombre: 'Empaques del Norte', ciudad: 'Medellín', asesor: 'Carlos Gómez', totalCompras: '$4,200,000', ultimCompra: 'Hace 15 días', score: 68, state: 'new' },
      { id: 3, nombre: 'Panadería San José', ciudad: 'Cali', asesor: 'Piter', totalCompras: '$850,000', ultimCompra: 'Hace 45 días', score: 32, state: 'cold' }
    ];

    res.json({ success: true, data: mockData });
  } catch (error) {
    console.error('[ClientesController] Error al obtener clientes:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
