import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

export const pool = new Pool({
  host: config.postgres.host,
  port: config.postgres.port,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected error on idle client:', err);
});

export async function checkPostgresConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT NOW()');
    return !!res.rows[0];
  } catch (err) {
    console.error('[PostgreSQL] Health check failed:', err);
    return false;
  }
}
