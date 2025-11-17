/**
 * Database Initialization Script
 * This script creates a PostgreSQL database if it doesn't exist.
 * 
 * Security: This script implements proper SQL injection protection for database creation.
 */

const { Pool } = require('pg');

/**
 * Validates a PostgreSQL database name to prevent SQL injection.
 * Database names must follow PostgreSQL naming rules:
 * - Start with a letter or underscore
 * - Contain only letters, digits, underscores, and dollar signs
 * - Be 63 characters or less
 * 
 * @param {string} name - The database name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidDatabaseName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  // Check length (PostgreSQL limit is 63 characters)
  if (name.length === 0 || name.length > 63) {
    return false;
  }
  
  // Must start with a letter or underscore
  if (!/^[a-zA-Z_]/.test(name)) {
    return false;
  }
  
  // Can only contain letters, digits, underscores, and dollar signs
  if (!/^[a-zA-Z_][a-zA-Z0-9_$]*$/.test(name)) {
    return false;
  }
  
  return true;
}

/**
 * Safely quotes a PostgreSQL identifier.
 * This wraps identifiers in double quotes and escapes any double quotes within.
 * 
 * @param {string} identifier - The identifier to quote
 * @returns {string} - The safely quoted identifier
 */
function quoteIdentifier(identifier) {
  // Escape double quotes by doubling them, then wrap in double quotes
  return `"${identifier.replace(/"/g, '""')}"`;
}

/**
 * Creates a PostgreSQL database if it doesn't already exist.
 */
async function initializeDatabase() {
  const database = process.env.PGDATABASE || 'farmdb';
  
  // Validate the database name before using it
  if (!isValidDatabaseName(database)) {
    throw new Error(
      `Invalid database name: "${database}". ` +
      'Database names must start with a letter or underscore and ' +
      'contain only letters, digits, underscores, and dollar signs (max 63 characters).'
    );
  }
  
  // Connect to postgres database (default database) to create our target database
  const admin = new Pool({
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'user',
    password: process.env.PGPASSWORD || 'password',
    database: 'postgres', // Connect to default postgres database
    port: process.env.PGPORT ? Number.parseInt(process.env.PGPORT, 10) : 5432,
  });

  try {
    // Check if database exists
    const result = await admin.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [database]
    );

    if (result.rows.length === 0) {
      console.log(`Creating database ${database}...`);
      
      // Use parameterized query for database creation
      // Note: CREATE DATABASE doesn't support parameters, so we validate the name first
      // and use quoteIdentifier to safely construct the query
      const quotedDatabase = quoteIdentifier(database);
      
      // Execute the CREATE DATABASE query
      // This is safe because:
      // 1. We validated the database name with isValidDatabaseName()
      // 2. We properly quote the identifier with quoteIdentifier()
      await admin.query(`CREATE DATABASE ${quotedDatabase}`);
      
      console.log(`Created database ${database}`);
    } else {
      console.log(`Database ${database} already exists`);
    }
  } finally {
    await admin.end();
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('Database initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });
