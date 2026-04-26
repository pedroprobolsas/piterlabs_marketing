import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Soporta DATABASE_URL (formato: postgres://user:pass@host:port/db)
// o variables separadas DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    })
  : new Pool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT) || 5432,
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'probolsas_db'
    });

// Log de la configuración al arrancar (sin exponer password)
const dbInfo = process.env.DATABASE_URL
  ? `DATABASE_URL=${process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@')}`
  : `${process.env.DB_USER || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'probolsas_db'}`;
console.log(`[Pool] Conectando a: ${dbInfo}`);

pool.on('error', (err) => {
  console.error('[Pool] Error inesperado en cliente idle:', err.message);
});

export default pool;
