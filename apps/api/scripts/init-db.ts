import { Client } from 'pg';
import * as fs from 'fs';

function getEnv(name: string, def?: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (def !== undefined) return def;
  throw new Error(`Missing required env var ${name}`);
}

function quoteIdentifier(identifier: string): string {
  // Validate identifier name (alphanumeric, underscore, hyphen only)
  if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(identifier)) {
    throw new Error(`Invalid database identifier: ${identifier}. Must start with letter/underscore and contain only alphanumeric, underscore, hyphen.`);
  }
  // Escape double quotes by doubling them and wrap in double quotes
  return `"${identifier.replace(/"/g, '""')}"`;
}

async function run() {
  const host = getEnv('PGHOST', 'localhost');
  const port = Number(process.env.PGPORT || 5432);
  const user = getEnv('PGUSER', 'user');
  const password = getEnv('PGPASSWORD', 'password');
  const database = getEnv('PGDATABASE', 'livestockdb');
  const sslRequired = (process.env.PGSSLMODE || '').toLowerCase() === 'require';

  // Configure SSL properly with proper typing
  let sslConfig: boolean | object | undefined;
  if (sslRequired) {
    const sslOptions: { rejectUnauthorized: boolean; ca?: string } = {
      rejectUnauthorized: true
    };
    
    // Load CA certificate if provided
    const sslRootCert = process.env.PGSSLROOTCERT;
    if (sslRootCert) {
      try {
        sslOptions.ca = fs.readFileSync(sslRootCert, 'utf8');
        console.log('Loaded SSL root certificate.');
      } catch (err) {
        console.warn(`Failed to load SSL root certificate from ${sslRootCert}:`, err);
      }
    }
    
    sslConfig = sslOptions;
  } else {
    sslConfig = false;
  }

  const common = {
    host,
    port,
    user,
    password,
    ssl: sslConfig,
  };

  // 1) Connect to postgres DB to create target database if needed
  const admin = new Client({ ...common, database: 'postgres' });
  await admin.connect();
  try {
    const res = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
    if (res.rowCount === 0) {
      const quotedDatabase = quoteIdentifier(database);
      await admin.query(`CREATE DATABASE ${quotedDatabase}`);
      console.log(`Created database ${database}`);
    } else {
      console.log(`Database ${database} already exists`);
    }
  } finally {
    await admin.end();
  }

  // 2) Connect to target DB and create schema
  const db = new Client({ ...common, database });
  await db.connect();
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id text PRIMARY KEY,
        title text NOT NULL,
        price numeric NOT NULL,
        currency text,
        image text,
        location text,
        rating numeric,
        reviews integer,
        category text,
        breed text,
        age text,
        gender text,
        is_verified boolean,
        description text,
        created_at timestamptz,
        promoted boolean DEFAULT false,
        likes integer DEFAULT 0
      );
    `);
    console.log('Schema ensured.');
  } finally {
    await db.end();
  }
}

run().catch((err) => {
  console.error('DB init failed:', err);
  process.exit(1);
});


