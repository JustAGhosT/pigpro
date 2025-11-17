import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
// JSON fallback removed; API now prefers DB and ensures schema at runtime
import { query } from '../lib/db/client';

type LatLng = { lat: number; lng: number };

const cityCoords: Record<string, LatLng> = {
  "Cape Town, WC": { lat: -33.9249, lng: 18.4241 },
  "Pretoria, GP": { lat: -25.7479, lng: 28.2293 },
  "Durban, KZN": { lat: -29.8587, lng: 31.0218 },
  "Bloemfontein, FS": { lat: -29.0852, lng: 26.1596 },
};

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLng * sinDLng));
  return R * c;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  location: keyof typeof cityCoords | string;
  rating: number;
  reviews: number;
  category: "Poultry" | "Cattle" | "Goats" | "Pigs" | "Rabbits" | "Sheep";
  breed: string;
  age: string;
  gender: string;
  isVerified: boolean;
  description: string;
  createdAt: string;
  promoted?: boolean;
  likes?: number;
}

async function loadListingsFromDb(): Promise<Listing[] | null> {
  try {
    const res = await query('SELECT id, title, price, currency, image, location, rating, reviews, category, breed, age, gender, is_verified as "isVerified", description, created_at as "createdAt", promoted, likes FROM listings');
    return res.rows as Listing[];
  } catch {
    return null;
  }
}

async function ensureSchema() {
  try {
    await query(`
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
  } catch {
    // ignore if db not reachable in local JSON mode
  }
}

// GET /api/v1/listings - filterable
export async function getListings(request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  await ensureSchema();
  // seeding disabled in function to maintain CJS compatibility with tsconfig
  const dbData = await loadListingsFromDb();
  const listings = dbData ?? [];
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const category = url.searchParams.get("category");
  const minPrice = Number(url.searchParams.get("minPrice") || "0");
  const maxPrice = Number(url.searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER);
  const minRating = Number(url.searchParams.get("minRating") || "0");
  const verifiedOnly = url.searchParams.get("verifiedOnly") === "true";
  const city = url.searchParams.get("city");
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  const maxKm = Number(url.searchParams.get("maxKm") || "0");

  const userPos = lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined;

  const filtered = listings.filter((l) => {
    const textMatch = !q || l.title.toLowerCase().includes(q) || l.breed.toLowerCase().includes(q);
    const catMatch = !category || category === "All" || l.category === category;
    const priceMatch = l.price >= minPrice && l.price <= maxPrice;
    const ratingMatch = l.rating >= minRating;
    const verifyMatch = !verifiedOnly || l.isVerified;
    const cityMatch = !city || (l.location.toLowerCase().includes(city.toLowerCase()));

    let distanceMatch = true;
    if (userPos && maxKm > 0) {
      const coords = cityCoords[l.location as keyof typeof cityCoords];
      if (coords) distanceMatch = haversineKm(userPos, coords) <= maxKm;
    }

    return textMatch && catMatch && priceMatch && ratingMatch && verifyMatch && (userPos && maxKm > 0 ? distanceMatch : cityMatch);
  });

  // Sort: promoted first, then by likes desc, then by requested sort in client if any
  const sorted = filtered.sort((a, b) => {
    const p = Number(!!b.promoted) - Number(!!a.promoted);
    if (p !== 0) return p;
    const la = a.likes ?? 0;
    const lb = b.likes ?? 0;
    return lb - la;
  });

  // Rewrite image URLs to blob if BLOB_BASE_URL is set
  const blobBase = process.env.BLOB_BASE_URL;
  const withImages = !blobBase
    ? sorted
    : sorted.map((l) => {
        const img = l.image || '';
        if (/^https?:\/\//i.test(img)) return l;
        const file = img.split('/').filter(Boolean).pop() || img;
        return { ...l, image: `${blobBase.replace(/\/$/, '')}/${file}` };
      });

  return { jsonBody: withImages };
}

app.http("getListings", {
  methods: ["GET"],
  route: "v1/listings",
  authLevel: "anonymous",
  handler: getListings,
});

// POST /api/v1/listings (create new listing)
export async function createListing(req: HttpRequest): Promise<HttpResponseInit> {
  try {
    await ensureSchema();
    const body = await req.json() as Listing;
    if (!body || !body.title || body.price === undefined || body.price === null || !body.category || !body.location) {
      return { status: 400, jsonBody: { error: 'title, price, category, location are required' } };
    }
    const id = String(Date.now());
    const next: Listing = { ...body, id, createdAt: new Date().toISOString(), likes: body.likes ?? 0 };
    await query(
      'INSERT INTO listings (id, title, price, currency, image, location, rating, reviews, category, breed, age, gender, is_verified, description, created_at, promoted, likes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)',
      [next.id, next.title, next.price, next.currency, next.image, next.location, next.rating, next.reviews, next.category, next.breed, next.age, next.gender, next.isVerified, next.description, next.createdAt, next.promoted ?? false, next.likes ?? 0]
    );
    return { status: 201, jsonBody: next };
  } catch (e) {
    return { status: 400, jsonBody: { error: 'Invalid JSON' } };
  }
}

// PUT /api/v1/listings/{id} (update listing)
export async function updateListing(req: HttpRequest): Promise<HttpResponseInit> {
  await ensureSchema();
  const id = (req.params as any).id;
  if (!id) return { status: 400, jsonBody: { error: 'id param required' } };
  try {
    const body = await req.json() as Partial<Listing>;
    
    // Get existing listing to preserve fields not in the update
    const existing = await query('SELECT id, title, price, currency, image, location, rating, reviews, category, breed, age, gender, is_verified as "isVerified", description, created_at as "createdAt", promoted, likes FROM listings WHERE id=$1', [id]);
    if (!existing.rows?.length) return { status: 404, jsonBody: { error: 'not found' } };
    
    const existingListing = existing.rows[0];
    
    // Merge update with existing data, only updating provided fields
    const updatedListing = {
      title: body.title ?? existingListing.title,
      price: body.price ?? existingListing.price,
      currency: body.currency ?? existingListing.currency,
      image: body.image ?? existingListing.image,
      location: body.location ?? existingListing.location,
      rating: body.rating ?? existingListing.rating,
      reviews: body.reviews ?? existingListing.reviews,
      category: body.category ?? existingListing.category,
      breed: body.breed ?? existingListing.breed,
      age: body.age ?? existingListing.age,
      gender: body.gender ?? existingListing.gender,
      isVerified: body.isVerified ?? existingListing.isVerified,
      description: body.description ?? existingListing.description,
      promoted: body.promoted ?? existingListing.promoted,
      likes: body.likes ?? existingListing.likes
    };
    
    await query('UPDATE listings SET title=$1, price=$2, currency=$3, image=$4, location=$5, rating=$6, reviews=$7, category=$8, breed=$9, age=$10, gender=$11, is_verified=$12, description=$13, promoted=$14, likes=$15 WHERE id=$16',
      [updatedListing.title, updatedListing.price, updatedListing.currency, updatedListing.image, updatedListing.location, updatedListing.rating, updatedListing.reviews, updatedListing.category, updatedListing.breed, updatedListing.age, updatedListing.gender, updatedListing.isVerified, updatedListing.description, updatedListing.promoted, updatedListing.likes, id]);
    
    const updatedRow = await query('SELECT id, title, price, currency, image, location, rating, reviews, category, breed, age, gender, is_verified as "isVerified", description, created_at as "createdAt", promoted, likes FROM listings WHERE id=$1', [id]);
    return { jsonBody: updatedRow.rows?.[0] };
  } catch (e) {
    return { status: 400, jsonBody: { error: 'Invalid JSON' } };
  }
}

app.http('createListing', {
  methods: ['POST'],
  route: 'v1/listings',
  authLevel: 'anonymous',
  handler: createListing
});

app.http('updateListing', {
  methods: ['PUT'],
  route: 'v1/listings/{id}',
  authLevel: 'anonymous',
  handler: updateListing
});

// POST /api/v1/listings/{id}/like (toggle or increment like)
export async function likeListing(req: HttpRequest): Promise<HttpResponseInit> {
  await ensureSchema();
  const id = (req.params as any).id;
  if (!id) return { status: 400, jsonBody: { error: 'id param required' } };
  const body = (await req.json().catch(() => ({}))) as { delta?: number };
  const increment = typeof body.delta === 'number' ? body.delta : 1;
  await query('UPDATE listings SET likes = GREATEST(0, COALESCE(likes,0) + $1) WHERE id=$2', [increment, id]);
  const updated = await query('SELECT id, title, price, currency, image, location, rating, reviews, category, breed, age, gender, is_verified as "isVerified", description, created_at as "createdAt", promoted, likes FROM listings WHERE id=$1', [id]);
  if (!updated.rows?.length) return { status: 404, jsonBody: { error: 'not found' } };
  return { jsonBody: updated.rows[0] };
}

app.http('likeListing', {
  methods: ['POST'],
  route: 'v1/listings/{id}/like',
  authLevel: 'anonymous',
  handler: likeListing
});


