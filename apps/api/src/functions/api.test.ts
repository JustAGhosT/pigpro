import { describe, expect, it, beforeEach, vi } from 'vitest';
import { HttpRequest, InvocationContext } from '@azure/functions';
import { getLivestockData } from './livestock';
import { getListings, createListing, likeListing } from './listings';

// Mock the database client
vi.mock('../lib/db/client', () => ({
  query: vi.fn()
}));

// Helper function to create mock HttpRequest
function createMockRequest(url: string, method: string = 'GET', body?: any, params: any = {}): HttpRequest {
  return {
    url,
    method,
    json: vi.fn().mockResolvedValue(body),
    params,
    headers: new Map(),
    query: new Map()
  } as any;
}

// Helper function to create mock InvocationContext
function createMockContext(): InvocationContext {
  return {
    invocationId: 'test-invocation',
    functionName: 'test-function',
    extraInputs: new Map(),
    extraOutputs: new Map(),
    retryContext: {
      retryCount: 0,
      maxRetryCount: 0
    },
    traceContext: {
      traceparent: 'test-trace',
      tracestate: 'test-state'
    }
  } as any;
}

describe('API Handlers - Real Implementation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Livestock Data Handler', () => {
    it('should return livestock categories from real data file', async () => {
      const mockRequest = createMockRequest('http://localhost:7073/api/v1/livestock');
      const mockContext = createMockContext();

      const response = await getLivestockData(mockRequest);
      
      expect(response.status).toBe(200);
      expect(response.jsonBody).toBeDefined();
      
      const data = response.jsonBody as any;
      expect(data).toHaveProperty('poultry');
      expect(data).toHaveProperty('cattle');
      expect(data).toHaveProperty('fish');
      expect(data).toHaveProperty('insects');
      expect(data).toHaveProperty('arachnids');
      
      // Test actual data structure from livestock-data.json
      expect(data.poultry).toEqual({ label: 'Poultry', icon: '🐔' });
      expect(data.fish).toEqual({ label: 'Fish', icon: '🐟' });
      expect(data.insects).toEqual({ label: 'Insects', icon: '🐛' });
      expect(data.arachnids).toEqual({ label: 'Arachnids', icon: '🕷️' });
    });
  });

  describe('Listings Handler', () => {
    it('should return listings from database with proper filtering', async () => {
      const { query } = await import('../lib/db/client');
      
      // Mock database response
      const mockListings = [
        {
          id: '1',
          title: 'Test Fish',
          price: 150,
          currency: 'ZAR',
          image: '/images/fish.jpg',
          location: 'Cape Town, WC',
          rating: 4.5,
          reviews: 10,
          category: 'Fish',
          breed: 'Goldfish',
          age: '6 months',
          gender: 'Mixed',
          isVerified: true,
          description: 'Healthy goldfish',
          createdAt: '2024-01-01T00:00:00Z',
          promoted: false,
          likes: 5
        },
        {
          id: '2',
          title: 'Test Tarantula',
          price: 300,
          currency: 'ZAR',
          image: '/images/tarantula.jpg',
          location: 'Pretoria, GP',
          rating: 4.8,
          reviews: 15,
          category: 'Arachnids',
          breed: 'Chilean Rose',
          age: '1 year',
          gender: 'Female',
          isVerified: true,
          description: 'Beautiful tarantula',
          createdAt: '2024-01-02T00:00:00Z',
          promoted: true,
          likes: 12
        }
      ];

      vi.mocked(query).mockResolvedValue({ rows: mockListings });

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings?category=Fish');
      const mockContext = createMockContext();

      const response = await getListings(mockRequest, mockContext);
      
      expect(response.jsonBody).toBeDefined();
      const data = response.jsonBody as any[];
      expect(Array.isArray(data)).toBe(true);
      
      // Should filter by category
      const fishListings = data.filter(l => l.category === 'Fish');
      expect(fishListings.length).toBeGreaterThan(0);
    });

    it('should handle price filtering correctly', async () => {
      const { query } = await import('../lib/db/client');
      
      const mockListings = [
        { id: '1', title: 'Cheap Fish', price: 100, category: 'Fish', location: 'Cape Town, WC', rating: 4.0, reviews: 5, breed: 'Goldfish', age: '6 months', gender: 'Mixed', isVerified: false, description: 'Cheap fish', createdAt: '2024-01-01T00:00:00Z', promoted: false, likes: 0 },
        { id: '2', title: 'Expensive Fish', price: 500, category: 'Fish', location: 'Cape Town, WC', rating: 4.5, reviews: 10, breed: 'Koi', age: '1 year', gender: 'Mixed', isVerified: true, description: 'Expensive fish', createdAt: '2024-01-02T00:00:00Z', promoted: false, likes: 2 }
      ];

      vi.mocked(query).mockResolvedValue({ rows: mockListings });

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings?minPrice=200&maxPrice=400');
      const mockContext = createMockContext();

      const response = await getListings(mockRequest, mockContext);
      
      const data = response.jsonBody as any[];
      // Should filter out listings outside price range
      data.forEach(listing => {
        expect(listing.price).toBeGreaterThanOrEqual(200);
        expect(listing.price).toBeLessThanOrEqual(400);
      });
    });

    it('should handle search query filtering', async () => {
      const { query } = await import('../lib/db/client');
      
      const mockListings = [
        { id: '1', title: 'Beautiful Tarantula', price: 300, category: 'Arachnids', location: 'Pretoria, GP', rating: 4.8, reviews: 15, breed: 'Chilean Rose', age: '1 year', gender: 'Female', isVerified: true, description: 'Beautiful tarantula spider', createdAt: '2024-01-01T00:00:00Z', promoted: false, likes: 12 },
        { id: '2', title: 'Goldfish', price: 150, category: 'Fish', location: 'Cape Town, WC', rating: 4.0, reviews: 5, breed: 'Goldfish', age: '6 months', gender: 'Mixed', isVerified: false, description: 'Regular goldfish', createdAt: '2024-01-02T00:00:00Z', promoted: false, likes: 0 }
      ];

      vi.mocked(query).mockResolvedValue({ rows: mockListings });

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings?q=tarantula');
      const mockContext = createMockContext();

      const response = await getListings(mockRequest, mockContext);
      
      const data = response.jsonBody as any[];
      // Should only return listings matching search query
      data.forEach(listing => {
        const searchText = `${listing.title} ${listing.breed}`.toLowerCase();
        expect(searchText).toContain('tarantula');
      });
    });

    it('should sort listings with promoted first, then by likes', async () => {
      const { query } = await import('../lib/db/client');
      
      const mockListings = [
        { id: '1', title: 'Regular Fish', price: 150, category: 'Fish', location: 'Cape Town, WC', rating: 4.0, reviews: 5, breed: 'Goldfish', age: '6 months', gender: 'Mixed', isVerified: false, description: 'Regular fish', createdAt: '2024-01-01T00:00:00Z', promoted: false, likes: 10 },
        { id: '2', title: 'Promoted Fish', price: 200, category: 'Fish', location: 'Cape Town, WC', rating: 4.5, reviews: 8, breed: 'Koi', age: '1 year', gender: 'Mixed', isVerified: true, description: 'Promoted fish', createdAt: '2024-01-02T00:00:00Z', promoted: true, likes: 5 },
        { id: '3', title: 'Popular Fish', price: 180, category: 'Fish', location: 'Cape Town, WC', rating: 4.2, reviews: 12, breed: 'Angelfish', age: '8 months', gender: 'Mixed', isVerified: true, description: 'Popular fish', createdAt: '2024-01-03T00:00:00Z', promoted: false, likes: 15 }
      ];

      vi.mocked(query).mockResolvedValue({ rows: mockListings });

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings');
      const mockContext = createMockContext();

      const response = await getListings(mockRequest, mockContext);
      
      const data = response.jsonBody as any[];
      // Promoted should come first, then by likes descending
      expect(data[0].promoted).toBe(true);
      expect(data[1].likes).toBeGreaterThanOrEqual(data[2].likes);
    });
  });

  describe('Create Listing Handler', () => {
    it('should create a new listing with proper validation', async () => {
      const { query } = await import('../lib/db/client');
      
      vi.mocked(query).mockResolvedValue({ rows: [] });

      const newListing = {
        title: 'Test Fish - API Test',
        price: 150,
        currency: 'ZAR',
        image: '/images/test-fish.jpg',
        location: 'Test City, TC',
        category: 'Fish',
        breed: 'Test Breed',
        age: '6 months',
        gender: 'Mixed',
        description: 'Test listing created by API test'
      };

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings', 'POST', newListing);
      const mockContext = createMockContext();

      const response = await createListing(mockRequest);
      
      expect(response.status).toBe(201);
      expect(response.jsonBody).toBeDefined();
      
      const createdListing = response.jsonBody as any;
      expect(createdListing.title).toBe(newListing.title);
      expect(createdListing.price).toBe(newListing.price);
      expect(createdListing.category).toBe(newListing.category);
      expect(createdListing.likes).toBe(0);
      expect(createdListing.id).toBeDefined();
      expect(createdListing.createdAt).toBeDefined();
    });

    it('should reject invalid listing data', async () => {
      const invalidListing = {
        title: '', // Empty title should fail
        price: -100, // Negative price should fail
        category: 'InvalidCategory'
      };

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings', 'POST', invalidListing);
      const mockContext = createMockContext();

      const response = await createListing(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.jsonBody).toHaveProperty('error');
    });
  });

  describe('Like Listing Handler', () => {
    it('should increment likes for a listing', async () => {
      const { query } = await import('../lib/db/client');
      
      const mockListing = {
        id: '1',
        title: 'Test Fish',
        price: 150,
        currency: 'ZAR',
        image: '/images/fish.jpg',
        location: 'Cape Town, WC',
        rating: 4.5,
        reviews: 10,
        category: 'Fish',
        breed: 'Goldfish',
        age: '6 months',
        gender: 'Mixed',
        isVerified: true,
        description: 'Healthy goldfish',
        createdAt: '2024-01-01T00:00:00Z',
        promoted: false,
        likes: 5
      };

      // Mock the ensureSchema call (first call)
      vi.mocked(query).mockResolvedValueOnce({ rows: [] });
      // Mock the update query (second call)
      vi.mocked(query).mockResolvedValueOnce({ rows: [] });
      // Mock the select query to return updated listing (third call)
      vi.mocked(query).mockResolvedValueOnce({ rows: [{ ...mockListing, likes: 6 }] });

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings/1/like', 'POST', { delta: 1 }, { id: '1' });
      const mockContext = createMockContext();

      const response = await likeListing(mockRequest);
      
      // Check if mocks were called
      expect(vi.mocked(query)).toHaveBeenCalledTimes(3);
      
      expect(response.jsonBody).toBeDefined();
      const updatedListing = response.jsonBody as any;
      expect(updatedListing).toHaveProperty('likes', 6);
    });

    it('should handle negative like increments', async () => {
      const { query } = await import('../lib/db/client');
      
      const mockListing = {
        id: '1',
        title: 'Test Fish',
        price: 150,
        currency: 'ZAR',
        image: '/images/fish.jpg',
        location: 'Cape Town, WC',
        rating: 4.5,
        reviews: 10,
        category: 'Fish',
        breed: 'Goldfish',
        age: '6 months',
        gender: 'Mixed',
        isVerified: true,
        description: 'Healthy goldfish',
        createdAt: '2024-01-01T00:00:00Z',
        promoted: false,
        likes: 5
      };

      // Mock the ensureSchema call (first call)
      vi.mocked(query).mockResolvedValueOnce({ rows: [] });
      // Mock the update query (second call)
      vi.mocked(query).mockResolvedValueOnce({ rows: [] });
      // Mock the select query to return updated listing (third call)
      vi.mocked(query).mockResolvedValueOnce({ rows: [{ ...mockListing, likes: 4 }] });

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings/1/like', 'POST', { delta: -1 }, { id: '1' });
      const mockContext = createMockContext();

      const response = await likeListing(mockRequest);
      
      expect(response.jsonBody).toBeDefined();
      const updatedListing = response.jsonBody as any;
      expect(updatedListing).toHaveProperty('likes', 4);
    });

    it('should return 404 for non-existent listing', async () => {
      const { query } = await import('../lib/db/client');
      
      // Mock the update query to affect no rows
      vi.mocked(query).mockResolvedValueOnce({ rows: [] });
      // Mock the select query to return no results
      vi.mocked(query).mockResolvedValueOnce({ rows: [] });

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings/nonexistent/like', 'POST', { delta: 1 }, { id: 'nonexistent' });
      const mockContext = createMockContext();

      const response = await likeListing(mockRequest);
      
      expect(response.status).toBe(404);
      expect(response.jsonBody).toHaveProperty('error', 'not found');
    });

    it('should return 400 for missing ID parameter', async () => {
      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings//like', 'POST', { delta: 1 });
      const mockContext = createMockContext();

      const response = await likeListing(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.jsonBody).toHaveProperty('error', 'id param required');
    });
  });

  describe('Database Integration', () => {
    it('should handle database connection failures gracefully', async () => {
      const { query } = await import('../lib/db/client');
      
      // Mock database failure
      vi.mocked(query).mockRejectedValue(new Error('Database connection failed'));

      const mockRequest = createMockRequest('http://localhost:7073/api/v1/listings');
      const mockContext = createMockContext();

      const response = await getListings(mockRequest, mockContext);
      
      // Should return empty array when database fails
      expect(response.jsonBody).toEqual([]);
    });
  });
});
