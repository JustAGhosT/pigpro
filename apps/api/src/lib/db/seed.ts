import fs from 'node:fs';
import path from 'node:path';
import pool from './client';

console.log('Seeding database...');
const client = await pool.connect();

try {
  // Run schema.sql to create tables
  console.log('Creating schema...');
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  await client.query(schemaSql);
  console.log('Schema created successfully.');

  // --- Seed Data ---
  // (This data is a subset of what was in the in-memory DB for brevity)

  console.log('Seeding species...');
  const speciesResult = await client.query(`
      INSERT INTO species (name, is_dairy, is_ruminant) VALUES
      ('Goat', true, true),
      ('Cattle', true, true),
      ('Sheep', false, true),
      ('Pig', false, false),
      ('Poultry', false, false)
      RETURNING id;
  `);
  const [goatId, cattleId] = speciesResult.rows.map(r => r.id);

  console.log('Seeding categories...');
  await client.query(`
      INSERT INTO categories (name, type) VALUES
      ('Feed', 'expense'),
      ('Veterinary', 'expense'),
      ('Labor', 'expense'),
      ('Milk Sales', 'income'),
      ('Animal Sales', 'income');
  `);

  console.log('Seeding groups...');
  await client.query(
      `INSERT INTO groups (name, species_id) VALUES ($1, $2), ($3, $4)`,
      ['Dairy Goats', goatId, 'Beef Cattle', cattleId]
  );

  console.log('Database seeding complete!');

} catch (error) {
  console.error('Error seeding database:', error);
} finally {
  await client.release();
  await pool.end();
}
