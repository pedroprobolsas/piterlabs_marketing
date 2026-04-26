import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  post: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'piter', // generic fallback
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'probolsas_db' // fallback db
});

export default pool;
