import { vi } from 'vitest';

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PGHOST = 'localhost';
process.env.PGUSER = 'test';
process.env.PGPASSWORD = 'test';
process.env.PGDATABASE = 'test';
process.env.PGPORT = '5432';
process.env.PGSSLMODE = 'disable';
process.env.BLOB_BASE_URL = 'https://test.blob.core.windows.net/test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
