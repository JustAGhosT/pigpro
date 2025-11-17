import { vi } from 'vitest';

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

// Mock environment variables for testing
// Use environment variables or secure test defaults
process.env.NODE_ENV = 'test';
process.env.PGHOST = process.env.TEST_PGHOST || 'localhost';
process.env.PGUSER = process.env.TEST_PGUSER || 'test_user';
process.env.PGPASSWORD = process.env.TEST_PGPASSWORD || process.env.PGPASSWORD || 'test_password';
process.env.PGDATABASE = process.env.TEST_PGDATABASE || 'test_db';
process.env.PGPORT = process.env.TEST_PGPORT || '5432';
process.env.PGSSLMODE = process.env.TEST_PGSSLMODE || 'disable';
process.env.BLOB_BASE_URL = process.env.TEST_BLOB_BASE_URL || 'https://test.blob.core.windows.net/test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
