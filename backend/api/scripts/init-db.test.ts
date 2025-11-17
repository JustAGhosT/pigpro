/**
 * Tests for database initialization script security
 */

/**
 * Validates a PostgreSQL database name to prevent SQL injection.
 * This duplicates the logic from init-db.cjs for testing purposes.
 */
function isValidDatabaseName(name: string | null | undefined | any): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  if (name.length === 0 || name.length > 63) {
    return false;
  }
  
  if (!/^[a-zA-Z_]/.test(name)) {
    return false;
  }
  
  if (!/^[a-zA-Z_][a-zA-Z0-9_$]*$/.test(name)) {
    return false;
  }
  
  return true;
}

/**
 * Safely quotes a PostgreSQL identifier.
 * This duplicates the logic from init-db.cjs for testing purposes.
 */
function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

describe('Database Name Validation', () => {
  test('accepts valid database names', () => {
    expect(isValidDatabaseName('farmdb')).toBe(true);
    expect(isValidDatabaseName('my_database')).toBe(true);
    expect(isValidDatabaseName('_test')).toBe(true);
    expect(isValidDatabaseName('db123')).toBe(true);
    expect(isValidDatabaseName('my_db_123')).toBe(true);
    expect(isValidDatabaseName('test$db')).toBe(true);
  });

  test('rejects invalid database names', () => {
    // Reject SQL injection attempts
    expect(isValidDatabaseName('farmdb; DROP TABLE users--')).toBe(false);
    expect(isValidDatabaseName('farmdb" OR "1"="1')).toBe(false);
    expect(isValidDatabaseName("farmdb'; DROP DATABASE test--")).toBe(false);
    
    // Reject names starting with numbers
    expect(isValidDatabaseName('123db')).toBe(false);
    
    // Reject names with invalid characters
    expect(isValidDatabaseName('my-database')).toBe(false);
    expect(isValidDatabaseName('my.database')).toBe(false);
    expect(isValidDatabaseName('my database')).toBe(false);
    expect(isValidDatabaseName('my@database')).toBe(false);
    
    // Reject empty or null
    expect(isValidDatabaseName('')).toBe(false);
    expect(isValidDatabaseName(null)).toBe(false);
    expect(isValidDatabaseName(undefined)).toBe(false);
    
    // Reject non-string types
    expect(isValidDatabaseName(123)).toBe(false);
    expect(isValidDatabaseName({})).toBe(false);
    
    // Reject names that are too long
    expect(isValidDatabaseName('a'.repeat(64))).toBe(false);
  });
});

describe('Identifier Quoting', () => {
  test('properly quotes simple identifiers', () => {
    expect(quoteIdentifier('farmdb')).toBe('"farmdb"');
    expect(quoteIdentifier('my_database')).toBe('"my_database"');
  });

  test('escapes double quotes in identifiers', () => {
    expect(quoteIdentifier('my"database')).toBe('"my""database"');
    expect(quoteIdentifier('test"db"name')).toBe('"test""db""name"');
  });

  test('handles edge cases', () => {
    expect(quoteIdentifier('')).toBe('""');
    expect(quoteIdentifier('"""')).toBe('""""""""');
  });
});

describe('SQL Injection Prevention', () => {
  test('validation prevents common SQL injection patterns', () => {
    const maliciousInputs = [
      "farmdb; DROP TABLE users--",
      "farmdb' OR '1'='1",
      'farmdb" OR "1"="1',
      "farmdb'; DROP DATABASE test; --",
      "farmdb\"; DROP DATABASE test; --",
      "../../../etc/passwd",
      "farmdb\\'; DROP TABLE",
      "farmdb/*comment*/",
      "farmdb--comment",
    ];

    maliciousInputs.forEach(input => {
      expect(isValidDatabaseName(input)).toBe(false);
    });
  });
});
