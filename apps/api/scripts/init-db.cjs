/* eslint-disable no-console */
const { Client } = require('pg');

function getEnv(name, def) {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (def !== undefined) return def;
  throw new Error(`Missing required env var ${name}`);
}

function quoteIdentifier(identifier) {
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
  const isLocalDev = process.env.NODE_ENV === 'development' || process.env.LOCAL_DEV === 'true';

  // Configure SSL properly - never disable cert verification in production
  let sslConfig;
  if (sslRequired) {
    if (isLocalDev) {
      // Only allow insecure SSL for local development with explicit flag
      sslConfig = { rejectUnauthorized: false };
      console.warn('⚠️  WARNING: SSL certificate verification disabled for local development only');
    } else {
      // Production: use proper SSL with certificate validation
      sslConfig = {
        rejectUnauthorized: true,
        // Use system CA bundle or NODE_EXTRA_CA_CERTS if available
        ...(process.env.PGSSL_CERT && { ca: process.env.PGSSL_CERT })
      };
    }
  }

  const common = {
    host,
    port,
    user,
    password,
    ssl: sslConfig,
  };

  console.log(`Initializing Postgres database ${database} on ${host}:${port} as ${user}`);

  // 1) Connect to postgres to create target db if needed
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
    const currentCount = Number(rows?.[0]?.count ?? 0);
    if (currentCount < 20) {
      const fs = require('fs');
      const path = require('path');
      const jsonPath = path.join(__dirname, '..', 'src', 'data', 'listings.json');
      try {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);
        let seededCount = 0;
        for (const l of data) {
          try {
            await db.query(
              'INSERT INTO listings (id, title, price, currency, image, location, rating, reviews, category, breed, age, gender, is_verified, description, created_at, promoted, likes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (id) DO NOTHING',
              [l.id, l.title, l.price, l.currency, l.image, l.location, l.rating, l.reviews, l.category, l.breed, l.age, l.gender, l.isVerified, l.description, l.createdAt, l.promoted || false, l.likes || 0]
            );
            seededCount++;
          } catch (insertErr) {
            console.error(`Failed to insert listing ${l.id}:`, insertErr.message);
          }
        }
        console.log(`Seeded ${seededCount} listings from JSON (${currentCount} existing, ${seededCount} new)`);
      } catch (seedErr) {
        console.error('Failed to seed database from JSON:', seedErr.message);
        console.error('Continuing without seeding...');
      }
    } else {
      console.log(`Database already has ${currentCount} listings, skipping seed`);
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


