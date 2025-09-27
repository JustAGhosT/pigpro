/* eslint-disable no-console */
const { Client } = require('pg');

function getEnv(name, def) {
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
  const database = getEnv('PGDATABASE', 'livestockdb');
  const sslRequired = (process.env.PGSSLMODE || '').toLowerCase() === 'require';

  const common = {
    host,
    port,
    user,
    password,
    ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
  };

  console.log(`Initializing Postgres database ${database} on ${host}:${port} as ${user}`);

  // 1) Connect to postgres to create target db if needed
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

  // 2) Connect to target db and ensure schema
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
    // Optional seed up to 20 from JSON if empty
    const { rows } = await db.query('SELECT COUNT(*)::int AS count FROM listings');
    if ((rows?.[0]?.count || 0) < 20) {
      const fs = require('fs');
      const path = require('path');
      const jsonPath = path.join(__dirname, '..', 'src', 'data', 'listings.json');
      try {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);
        for (const l of data) {
          await db.query(
            'INSERT INTO listings (id, title, price, currency, image, location, rating, reviews, category, breed, age, gender, is_verified, description, created_at, promoted, likes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (id) DO NOTHING',
            [l.id, l.title, l.price, l.currency, l.image, l.location, l.rating, l.reviews, l.category, l.breed, l.age, l.gender, l.isVerified, l.description, l.createdAt, l.promoted || false, l.likes || 0]
          );
        }
        console.log('Seeded listings from JSON');
      } catch {}
    }
    console.log('Schema ensured.');
  } finally {
    await db.end();
  }

  console.log('Database initialized.');
}

run().catch((err) => {
  console.error('DB init failed:', err);
  process.exit(1);
});


