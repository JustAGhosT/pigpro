# 🐄 Livestock Club SA

> A comprehensive livestock marketplace and management platform for South African farmers

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/JustAGhosT/pigpro)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)

## 🚀 Features

### 🛒 **Marketplace**

- **9 Livestock Categories**: Poultry, Cattle, Goats, Sheep, Pigs, Rabbits, Fish, Insects, Arachnids
- **Advanced Filtering**: Price range, location, rating, category, search queries
- **Image Management**: Multiple images per listing with Azure Blob Storage
- **Promoted Listings**: Featured listings with priority sorting
- **Like System**: Save favorites and track popular listings

### 🔐 **Authentication**

- **Social Login**: Google, Facebook, Apple integration
- **Guest Browsing**: Browse marketplace without registration
- **Role-based Access**: Farmer, Feeder, Butcher, Scientist, Manager roles
- **Session Management**: Secure authentication with JWT tokens

### 📊 **Data Management**

- **PostgreSQL Database**: Robust data persistence
- **Real-time Updates**: Live marketplace data
- **Image Storage**: Azure Blob Storage integration
- **Data Validation**: Comprehensive input validation

### 🧪 **Testing**

- **26 Test Cases**: Comprehensive API and component testing
- **Coverage**: Unit, integration, and HTTP tests
- **CI/CD Ready**: Automated testing pipeline

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend

- **Azure Functions v4** - Serverless API
- **PostgreSQL** - Relational database
- **Azure Blob Storage** - Image storage
- **TypeScript** - Type-safe development

### Development

- **Vitest** - Fast unit testing
- **ESLint** - Code linting
- **npm Workspaces** - Monorepo management

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Azure Functions Core Tools**
- **PostgreSQL** (local or Azure)

### Installation

```bash
# Clone the repository
git clone https://github.com/JustAGhosT/pigpro.git
cd pigpro
# Install dependencies
npm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database credentials

# Initialize the database
npm run db:init:ps  # or npm run db:init:bash on Linux/Mac

# Start development servers
npm run frontend    # Terminal 1: Frontend (http://localhost:5173)
npm run api         # Terminal 2: API (http://localhost:7073)
```

## 📁 Project Structure

```
livestock-club-sa/
├── apps/
│   ├── frontend/              # React application
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── contexts/      # React contexts
│   │   │   ├── lib/          # Utilities and types
│   │   │   └── main.tsx      # Entry point
│   │   └── package.json
│   └── api/                   # Azure Functions API
│       ├── src/
│       │   ├── functions/     # API endpoints
│       │   ├── lib/          # Shared utilities
│       │   └── data/         # Mock data
│       ├── scripts/          # Setup scripts
│       └── package.json
├── packages/                  # Shared packages
│   └── domain/               # Domain models
├── docs/                     # Documentation
├── scripts/                  # Root-level scripts
└── package.json             # Workspace configuration
```

## 🎯 Available Scripts

### Root Level

```bash
npm run frontend          # Start frontend development
npm run backend:dev       # Start API development
npm run build            # Build both applications
npm run test             # Run all tests
npm run test:coverage    # Run tests with coverage
```

### Frontend

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

### Backend

```bash
npm run start            # Start Azure Functions
npm run build            # Compile TypeScript
npm run db:init          # Initialize database
npm run test:run         # Run API tests
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
PGHOST=localhost
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=farmdb
PGPORT=5432

# Storage
BLOB_BASE_URL=https://yourstorage.blob.core.windows.net/container
```

### Azure Setup

```bash
# Login to Azure
npm run azure:login

# Provision PostgreSQL
npm run azure:pg:init

# Setup blob storage
npm run azure:blob:upload
```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **HTTP Tests**: Live API testing with graceful fallback

### Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:api
npm run test:frontend
```

### Test Coverage

- ✅ **26 API Tests** - Comprehensive endpoint testing
- ✅ **Component Tests** - React component validation
- ✅ **Data Validation** - Input/output validation
- ✅ **Error Handling** - Error scenario testing

## 🚀 Deployment

### Frontend (Azure Static Web Apps)

```bash
npm run build
# Deploy to Azure Static Web Apps
```

### Backend (Azure Functions)

```bash
npm run backend:build
# Deploy to Azure Functions
```

### Database (Azure PostgreSQL)

```bash
npm run azure:pg:init
# Automated provisioning and setup
```

## 📊 API Documentation

### Endpoints

#### Livestock Data

```http
GET /api/v1/livestock
```

Returns all livestock categories with icons and labels.

#### Listings

```http
GET /api/v1/listings?category=Fish&minPrice=100&maxPrice=500
POST /api/v1/listings
PUT /api/v1/listings/{id}
POST /api/v1/listings/{id}/like
```

### Filtering Parameters

- `q` - Search query
- `category` - Livestock category
- `minPrice`/`maxPrice` - Price range
- `minRating` - Minimum rating
- `verifiedOnly` - Verified listings only
- `city` - Location filter
- `lat`/`lng`/`maxKm` - Distance filtering

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Create an issue](https://github.com/JustAGhosT/pigpro/issues)
- **Documentation**: [Project Structure](PROJECT_STRUCTURE.md)
- **Email**: support@livestockclubsa.co.za

## 🗺️ Roadmap

### ✅ Phase 1 (Completed)

- [x] Marketplace with 9 categories
- [x] Advanced filtering and search
- [x] Authentication system
- [x] Image management
- [x] Comprehensive testing

### 🔄 Phase 2 (In Progress)

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Payment integration

### 📋 Phase 3 (Planned)

- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Third-party API integrations
- [ ] Advanced breeding tools

---

<div align="center">
  <strong>Built with ❤️ for South African farmers</strong>
</div>
