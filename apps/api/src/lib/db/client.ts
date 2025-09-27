import { Pool } from 'pg';

// The pool will read the connection details from environment variables
// PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
const pool = new Pool({
  // Example of using environment variables, with defaults for local dev
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'user',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'farmdb',
  port: process.env.PGPORT ? Number.parseInt(process.env.PGPORT, 10) : 5432,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
