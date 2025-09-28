# Livestock Club SA API Documentation

## Overview

The Livestock Club SA API provides endpoints for managing livestock marketplace data, user
authentication, and system operations.

**Base URL**: `https://your-api.azurewebsites.net/api/v1`

## Authentication

### Guest Access

Most endpoints support guest access for browsing without authentication.

### Authenticated Access

Some endpoints require authentication via JWT tokens:

```http
Authorization: Bearer <jwt_token>
```

## Endpoints

### Livestock Data

#### GET /livestock

Get all livestock categories with metadata.

**Response:**

```json
{
  "poultry": {
    "label": "Poultry",
    "icon": "🐔"
  },
  "cattle": {
    "label": "Cattle",
    "icon": "🐄"
  },
  "goats": {
    "label": "Goats",
    "icon": "🐐"
  },
  "sheep": {
    "label": "Sheep",
    "icon": "🐑"
  },
  "pigs": {
    "label": "Pigs",
    "icon": "🐷"
  },
  "rabbits": {
    "label": "Rabbits",
    "icon": "🐰"
  },
  "fish": {
    "label": "Fish",
    "icon": "🐟"
  },
  "insects": {
    "label": "Insects",
    "icon": "🐛"
  },
  "arachnids": {
    "label": "Arachnids",
    "icon": "🕷️"
  }
}
```

### Listings

#### GET /listings

Get marketplace listings with optional filtering.

**Query Parameters:**

- `q` (string): Search query
- `category` (string): Livestock category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `minRating` (number): Minimum rating filter
- `verifiedOnly` (boolean): Show only verified listings
- `city` (string): Location filter
- `lat` (number): Latitude for distance filtering
- `lng` (number): Longitude for distance filtering
- `maxKm` (number): Maximum distance in kilometers

**Example Request:**

```http
GET /listings?category=Fish&minPrice=100&maxPrice=500&minRating=4.0
```

**Response:**

```json
[
  {
    "id": "21",
    "title": "African Barbel Fish - Juvenile Stock",
    "promoted": false,
    "likes": 8,
    "price": 450,
    "currency": "ZAR",
    "image": "/images/barbel-1.jpg",
    "location": "Durban, KZN",
    "rating": 4.5,
    "reviews": 12,
    "category": "Fish",
    "breed": "African Barbel",
    "age": "3 months",
    "gender": "Mixed",
    "isVerified": true,
    "description": "Healthy juvenile barbel fish, perfect for stocking ponds.",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### POST /listings

Create a new listing.

**Request Body:**

```json
{
  "title": "Test Fish - API Test",
  "price": 150,
  "currency": "ZAR",
  "image": "/images/test-fish.jpg",
  "location": "Test City, TC",
  "category": "Fish",
  "breed": "Test Breed",
  "age": "6 months",
  "gender": "Mixed",
  "description": "Test listing created by API test"
}
```

**Response:**

```json
{
  "id": "28",
  "title": "Test Fish - API Test",
  "promoted": false,
  "likes": 0,
  "price": 150,
  "currency": "ZAR",
  "image": "/images/test-fish.jpg",
  "location": "Test City, TC",
  "rating": 4.0,
  "reviews": 0,
  "category": "Fish",
  "breed": "Test Breed",
  "age": "6 months",
  "gender": "Mixed",
  "isVerified": false,
  "description": "Test listing created by API test",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### PUT /listings/{id}

Update an existing listing.

**Request Body:**

```json
{
  "title": "Updated Title",
  "price": 200,
  "description": "Updated description"
}
```

**Response:**

```json
{
  "id": "28",
  "title": "Updated Title",
  "promoted": false,
  "likes": 0,
  "price": 200,
  "currency": "ZAR",
  "image": "/images/test-fish.jpg",
  "location": "Test City, TC",
  "rating": 4.0,
  "reviews": 0,
  "category": "Fish",
  "breed": "Test Breed",
  "age": "6 months",
  "gender": "Mixed",
  "isVerified": false,
  "description": "Updated description",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### POST /listings/{id}/like

Like or unlike a listing.

**Request Body:**

```json
{
  "delta": 1
}
```

**Response:**

```json
{
  "id": "28",
  "title": "Test Fish - API Test",
  "promoted": false,
  "likes": 1,
  "price": 150,
  "currency": "ZAR",
  "image": "/images/test-fish.jpg",
  "location": "Test City, TC",
  "rating": 4.0,
  "reviews": 0,
  "category": "Fish",
  "breed": "Test Breed",
  "age": "6 months",
  "gender": "Mixed",
  "isVerified": false,
  "description": "Test listing created by API test",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## Data Models

### Listing

```typescript
interface Listing {
  id: string;
  title: string;
  promoted: boolean;
  likes: number;
  price: number;
  currency: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  breed: string;
  age: string;
  gender: string;
  isVerified: boolean;
  description: string;
  createdAt: string;
}
```

### Category

```typescript
interface Category {
  label: string;
  icon: string;
}
```

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Examples

#### 400 Bad Request

```json
{
  "error": "Invalid request data",
  "code": "VALIDATION_ERROR",
  "details": "Missing required field: title"
}
```

#### 404 Not Found

```json
{
  "error": "Listing not found",
  "code": "NOT_FOUND",
  "details": "No listing found with id: 999"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Database connection failed",
  "code": "DATABASE_ERROR",
  "details": "Unable to connect to PostgreSQL database"
}
```

## Rate Limiting

- **Guest Users**: 100 requests per hour
- **Authenticated Users**: 1000 requests per hour
- **Premium Users**: 5000 requests per hour

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

For endpoints that return lists, pagination is supported:

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response Headers:**

```http
X-Total-Count: 150
X-Page-Count: 8
X-Current-Page: 1
X-Per-Page: 20
```

## Filtering and Sorting

### Available Filters

- **Text Search**: `q` parameter searches in title and description
- **Category**: Exact match on category field
- **Price Range**: `minPrice` and `maxPrice` parameters
- **Rating**: `minRating` parameter
- **Location**: `city` parameter for exact match
- **Distance**: `lat`, `lng`, and `maxKm` for geographic filtering
- **Verification**: `verifiedOnly` boolean parameter

### Sorting

Listings are automatically sorted by:

1. **Promoted status** (promoted listings first)
2. **Likes count** (descending)
3. **Creation date** (newest first)

## Image Management

### Image URLs

Images are served from Azure Blob Storage with the following URL pattern:

```
{BLOB_BASE_URL}/{image_path}
```

Example:

```
https://livestocksa123abc.blob.core.windows.net/livestock-images/barbel-1.jpg
```

### Supported Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)

### Image Limits

- **Maximum file size**: 5MB
- **Maximum dimensions**: 2048x2048 pixels
- **Multiple images**: Up to 5 images per listing

## Webhooks

### Listing Events

Webhooks can be configured for listing events:

**Events:**

- `listing.created`
- `listing.updated`
- `listing.deleted`
- `listing.liked`

**Webhook Payload:**

```json
{
  "event": "listing.liked",
  "data": {
    "listingId": "21",
    "likes": 9,
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @livestock-club-sa/api-client
```

```typescript
import { LivestockAPI } from '@livestock-club-sa/api-client';

const api = new LivestockAPI({
  baseUrl: 'https://your-api.azurewebsites.net/api/v1',
  apiKey: 'your-api-key',
});

const listings = await api.listings.get({
  category: 'Fish',
  minPrice: 100,
});
```

### Python

```bash
pip install livestock-club-sa-api
```

```python
from livestock_club_sa import LivestockAPI

api = LivestockAPI(
    base_url='https://your-api.azurewebsites.net/api/v1',
    api_key='your-api-key'
)

listings = api.listings.get(category='Fish', min_price=100)
```

## Testing

### Test Environment

Use the test environment for development and testing:

```
https://test-api.azurewebsites.net/api/v1
```

### Test Data

The test environment includes sample data for all categories and features.

### API Testing Tools

- **Postman**: Import our API collection
- **Insomnia**: Use our API specification
- **curl**: Examples provided in documentation

## Support

### API Support

- **Email**: api-support@livestockclubsa.co.za
- **Documentation**: [API Docs](https://docs.livestockclubsa.co.za)
- **Status Page**: [API Status](https://status.livestockclubsa.co.za)

### Rate Limits

If you need higher rate limits, contact support to discuss your requirements.

### Bug Reports

Report API bugs through GitHub Issues with the `api` label.
