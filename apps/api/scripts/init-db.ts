import { Client } from 'pg';

function getEnv(name: string, def?: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (def !== undefined) return def;
  throw new Error(`Missing required env var ${name}`);
}

async function run() {
  const host = getEnv('PGHOST', 'localhost');
  const port = Number(process.env.PGPORT || 5432);
  const user = getEnv('PGUSER', 'user');
  const password = getEnv('PGPASSWORD', 'password');
  const database = getEnv('PGDATABASE', 'farmdb');
  const sslRequired = (process.env.PGSSLMODE || '').toLowerCase() === 'require';

  const common = {
    host,
    port,
    user,
    password,
    ssl: sslRequired ? { rejectUnauthorized: false } : undefined as any,
  };

  // 1) Connect to postgres DB to create target database if needed
  const admin = new Client({ ...common, database: 'postgres' });
  await admin.connect();
  try {
    const res = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
    if (res.rowCount === 0) {
      await admin.query(`CREATE DATABASE ${database}`);
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


