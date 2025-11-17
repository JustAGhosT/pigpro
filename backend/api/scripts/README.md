# Database Initialization Scripts

## init-db.cjs

This script creates a PostgreSQL database if it doesn't already exist. It includes comprehensive SQL injection protection.

### Usage

Run the script with Node.js:

```bash
node scripts/init-db.cjs
```

### Configuration

The script reads database connection details from environment variables:

- `PGHOST` - Database host (default: localhost)
- `PGUSER` - Database user (default: user)
- `PGPASSWORD` - Database password (default: password)
- `PGDATABASE` - Database name to create (default: farmdb)
- `PGPORT` - Database port (default: 5432)

Example:

```bash
PGDATABASE=myapp node scripts/init-db.cjs
```

### Security Features

The script implements multiple layers of SQL injection protection:

1. **Input Validation**: Database names are validated to ensure they follow PostgreSQL naming rules:
   - Must start with a letter or underscore
   - Can only contain letters, digits, underscores, and dollar signs
   - Maximum length of 63 characters (PostgreSQL limit)

2. **Identifier Quoting**: Database names are properly quoted using PostgreSQL's identifier quoting rules:
   - Identifiers are wrapped in double quotes
   - Any double quotes within the identifier are escaped by doubling them

3. **Defense in Depth**: Both validation and quoting are used together to provide maximum protection

### Examples

Valid database names:
- `farmdb`
- `my_database`
- `_test`
- `db123`
- `app_db_v2`
- `test$db`

Invalid database names (will be rejected):
- `123db` (starts with a number)
- `my-database` (contains hyphen)
- `my database` (contains space)
- `farmdb; DROP TABLE users--` (SQL injection attempt)
- `farmdb" OR "1"="1` (SQL injection attempt)

### Testing

Run the test suite:

```bash
npm test -- scripts/init-db.test.ts
```

The test suite includes:
- Validation of legitimate database names
- Rejection of SQL injection attempts
- Proper identifier quoting with escape handling
- Edge case testing
