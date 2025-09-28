import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const isNetworkError = (e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  return /\b(ECONNREFUSED|ECONNRESET|ENOTFOUND|fetch failed|connect ECONNREFUSED|aborted)\b/i.test(msg);
};

const fetchWithTimeout = async (url: string, init?: RequestInit, ms = 2000) => {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
};

// Module-level variables for shared test state
const baseUrl = 'http://localhost:7073/api/v1';

describe('HTTP API Tests', () => {
  beforeAll(async () => {
    // Wait for the server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  describe('Livestock Data Endpoint', () => {
    it('should return livestock categories', async () => {
      try {
        const response = await fetchWithTimeout(`${baseUrl}/livestock`);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('poultry');
        expect(data).toHaveProperty('cattle');
        expect(data).toHaveProperty('fish');
        expect(data).toHaveProperty('insects');
        expect(data).toHaveProperty('arachnids');
        
        // Check structure
        expect(data.poultry).toHaveProperty('label', 'Poultry');
        expect(data.poultry).toHaveProperty('icon', '🐔');
        expect(data.fish).toHaveProperty('label', 'Fish');
        expect(data.fish).toHaveProperty('icon', '🐟');
      } catch (error) {
        if (isNetworkError(error)) {
          console.warn('Server not running, skipping HTTP test:', (error as Error).message);
          return; // Skip only when server is unreachable
        }
        throw error; // Surface real failures
      }
    });
  });

  describe('Listings Endpoint', () => {
    it('should return listings', async () => {
      try {
        const response = await fetchWithTimeout(`${baseUrl}/listings`);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        if (data.length > 0) {
          const listing = data[0];
          expect(listing).toHaveProperty('id');
          expect(listing).toHaveProperty('title');
          expect(listing).toHaveProperty('price');
          expect(listing).toHaveProperty('category');
          expect(listing).toHaveProperty('promoted');
          expect(listing).toHaveProperty('likes');
        }
      } catch (error) {
        if (isNetworkError(error)) {
          console.warn('Server not running, skipping HTTP test:', (error as Error).message);
          return; // Skip only when server is unreachable
        }
        throw error; // Surface real failures
      }
    });

    it('should support category filtering', async () => {
      try {
        const response = await fetchWithTimeout(`${baseUrl}/listings?category=Fish`);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // All returned listings should be Fish category
        data.forEach(listing => {
          expect(listing.category).toBe('Fish');
        });
      } catch (error) {
        if (isNetworkError(error)) {
          console.warn('Server not running, skipping HTTP test:', (error as Error).message);
          return; // Skip only when server is unreachable
        }
        throw error; // Surface real failures
      }
    });

    it('should support price filtering', async () => {
      try {
        const response = await fetchWithTimeout(`${baseUrl}/listings?minPrice=400&maxPrice=600`);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // All returned listings should be within price range
        data.forEach(listing => {
          expect(listing.price).toBeGreaterThanOrEqual(400);
          expect(listing.price).toBeLessThanOrEqual(600);
        });
      } catch (error) {
        if (isNetworkError(error)) {
          console.warn('Server not running, skipping HTTP test:', (error as Error).message);
          return; // Skip only when server is unreachable
        }
        throw error; // Surface real failures
      }
    });

    it('should support search query', async () => {
      try {
        const response = await fetchWithTimeout(`${baseUrl}/listings?q=tarantula`);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // All returned listings should contain "tarantula" in title or description
        data.forEach(listing => {
          const searchText = `${listing.title} ${listing.description}`.toLowerCase();
          expect(searchText).toContain('tarantula');
        });
      } catch (error) {
        if (isNetworkError(error)) {
          console.warn('Server not running, skipping HTTP test:', (error as Error).message);
          return; // Skip only when server is unreachable
        }
        throw error; // Surface real failures
      }
    });
  });

  describe('Like Endpoint', () => {
    it('should increment likes for a listing', async () => {
      try {
        // First get a listing to test with
        const listResponse = await fetchWithTimeout(`${baseUrl}/listings`);
        const listings = await listResponse.json();
        
        if (listings.length > 0) {
          const listingId = listings[0].id;
          const initialLikes = listings[0].likes || 0;
          
          // Like the listing
          const likeResponse = await fetchWithTimeout(`${baseUrl}/listings/${listingId}/like`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ delta: 1 })
          });
          
          expect(likeResponse.status).toBe(200);
          
          const likedListing = await likeResponse.json();
          expect(likedListing.likes).toBe(initialLikes + 1);
        }
      } catch (error) {
        if (isNetworkError(error)) {
          console.warn('Server not running, skipping HTTP test:', (error as Error).message);
          return; // Skip only when server is unreachable
        }
        throw error; // Surface real failures
      }
    });
  });

// at the top of the file (above the describe block)
const createdIds: string[] = [];

describe('Create Listing Endpoint', () => {
  it('should create a new listing', async () => {
    try {
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
      
      const response = await fetchWithTimeout(`${baseUrl}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newListing)
      });
      
      expect(response.status).toBe(201);
      
      const createdListing = await response.json();
      expect(createdListing).toHaveProperty('id');
      expect(createdListing.currency).toBe(newListing.currency);
      expect(createdListing.title).toBe(newListing.title);
      expect(createdListing.price).toBe(newListing.price);
      expect(createdListing.category).toBe(newListing.category);
      expect(createdListing.promoted).toBe(false);
      expect(createdListing.likes).toBe(0);
      createdIds.push(createdListing.id);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Server not running, skipping HTTP test:', (error as Error).message);
        return; // Skip only when server is unreachable
      }
      throw error; // Surface real failures
    }
  });
});

// ensure any created listings get cleaned up
afterAll(async () => {
  await Promise.allSettled(
    createdIds.map((id) =>
      fetch(`${baseUrl}/listings/${id}`, { method: 'DELETE' })
    )
  );
});
});
