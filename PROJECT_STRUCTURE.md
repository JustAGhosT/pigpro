# Livestock Club SA - Project Structure

## Overview

This is a full-stack livestock marketplace and management platform built with React, TypeScript, and
Azure Functions.

## Architecture

````
livestock-club-sa/
├── apps/                          # Application packages
│   ├── frontend/                  # React frontend application
│   │   ├── public/               # Static assets
│   │   ├── src/                  # Source code
│   │   │   ├── components/       # React components
│   │   │   ├── contexts/         # React contexts
│   │   │   ├── lib/              # Utilities and types
│   │   │   └── main.tsx          # Entry point
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/                      # Azure Functions API
│       ├── src/
│       │   ├── functions/        # API endpoints
│       │   ├── lib/              # Shared utilities
│       │   └── data/             # Mock data
│       ├── scripts/              # Deployment and setup scripts
│       ├── package.json
│       └── host.json
├── packages/                     # Shared packages
│   ├── domain/                   # Domain models and types
│   ├── ui/                       # Shared UI components
│   └── utils/                    # Shared utilities
├── docs/                         # Documentation
├── scripts/                      # Root-level scripts
├── package.json                  # Root package.json (workspace)
└── README.md
``

## Migration Plan

### Phase 1: Directory Restructuring
1. Create new `apps/` directory structure
2. Move frontend code to `apps/frontend/`
3. Move API code to `apps/api/`
4. Reorganize shared packages

### Phase 2: Configuration Consolidation
1. Consolidate TypeScript configs
2. Standardize build scripts
3. Improve workspace configuration

### Phase 3: Documentation
1. Create comprehensive README
2. Add API documentation
3. Add deployment guides

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Azure Functions v4
- **Database**: PostgreSQL (Azure Flexible Server)
- **Storage**: Azure Blob Storage
- **Language**: TypeScript

### Development Tools
- **Testing**: Vitest
- **Linting**: ESLint
- **Package Management**: npm workspaces
- **Version Control**: Git

## Key Features

### Marketplace
- 9 livestock categories (Poultry, Cattle, Goats, Sheep, Pigs, Rabbits, Fish, Insects, Arachnids)
- Advanced filtering (price, location, rating, category)
- Image management with Azure Blob Storage
- Like functionality and promoted listings
- Real-time search and sorting

### Authentication
- Social login integration
- Role-based access control
- Session management
- Guest browsing capability

### Data Management
- PostgreSQL database with schema management
- Mock data seeding
- Image upload and storage
- CRUD operations for listings

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start frontend development server
npm run frontend

# Start API development server
npm run backend:dev

# Run tests
npm run test

# Build for production
npm run build
````

### Deployment

- **Frontend**: Static hosting (Azure Static Web Apps)
- **API**: Azure Functions
- **Database**: Azure PostgreSQL Flexible Server
- **Storage**: Azure Blob Storage

## Environment Configuration

### Required Environment Variables

- `PGHOST` - PostgreSQL host
- `PGUSER` - PostgreSQL user
- `PGPASSWORD` - PostgreSQL password
- `PGDATABASE` - PostgreSQL database name
- `PGPORT` - PostgreSQL port
- `BLOB_BASE_URL` - Azure Blob Storage base URL

## Testing Strategy

### Test Types

1. **Unit Tests**: Component and utility testing
2. **Integration Tests**: API endpoint testing
3. **HTTP Tests**: Live API testing
4. **Authentication Tests**: Security validation

### Test Coverage

- API endpoints (26 tests)
- Data validation
- Error handling
- Authentication flows
- Marketplace functionality

## Performance Considerations

### Frontend

- Component lazy loading
- Image optimization
- Bundle splitting
- Caching strategies

### Backend

- Database connection pooling
- Query optimization
- Caching layers
- Rate limiting

## Security

### Authentication

- JWT token management
- Role-based permissions
- Session security
- Social login integration

### Data Protection

- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

## Monitoring and Logging

### Application Monitoring

- Error tracking
- Performance metrics
- User analytics
- API usage statistics

### Logging

- Structured logging
- Error reporting
- Audit trails
- Debug information

## Future Enhancements

### Planned Features

- Real-time notifications
- Advanced analytics
- Mobile application
- Payment integration
- Inventory management

### Technical Improvements

- Microservices architecture
- GraphQL API
- Advanced caching
- Performance optimization
