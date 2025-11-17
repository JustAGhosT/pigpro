# Deployment Guide - Livestock Club SA

## Overview

This guide covers deploying the Livestock Club SA application to Azure, including the frontend,
backend API, database, and storage services.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Database      │
│ (Static Web App)│◄──►│ (Azure Functions)│◄──►│ (PostgreSQL)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Blob Storage   │
                       │   (Images)      │
                       └─────────────────┘
```

## Prerequisites

### Required Tools

- **Azure CLI** - [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Node.js 20 LTS** and npm
- **Azure Functions Core Tools** -
  [Install Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- **Git** - For version control

### Azure Account Setup

1. Create an Azure account
2. Set up a subscription
3. Configure Azure CLI authentication

## Environment Setup

### 1. Azure Login

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "your-subscription-id"
```

### 2. Create Resource Group

```bash
# Create resource group
az group create \
  --name "rg-livestock-club-sa" \
  --location "southafricanorth"
```

## Database Deployment

### 1. PostgreSQL Flexible Server

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group "rg-livestock-club-sa" \
  --name "livestock-pg-server" \
  --location "southafricanorth" \
  --admin-user "pgadmin" \
  --admin-password "Your-Strong-Pwd1!" \
  --sku-name "Standard_B1ms" \
  --tier "Burstable"
```

### 2. Create Database

```bash
# Create database
az postgres flexible-server db create \
  --resource-group "rg-livestock-club-sa" \
  --server-name "livestock-pg-server" \
  --database-name "livestockdb"
```

### 3. Configure Firewall

```bash
# Add firewall rule for your specific IP (replace with your actual IP)
az postgres flexible-server firewall-rule create \
  --resource-group "rg-livestock-club-sa" \
  --name "livestock-pg-server" \
  --rule-name "AllowMyIP" \
  --start-ip-address "YOUR_IP_ADDRESS" \
  --end-ip-address "YOUR_IP_ADDRESS"

# For production: Use Private Link/VNet integration for secure access
# or specify explicit CIDR ranges for your application servers
```

**Security Note**: Avoid broad "allow Azure services" rules. For production deployments, consider using Azure Private Link or VNet integration for secure database access.

## Storage Deployment

### 1. Create Storage Account

```bash
# Create storage account
az storage account create \
  --name "livestockstorage123" \
  --resource-group "rg-livestock-club-sa" \
  --location "southafricanorth" \
  --sku "Standard_LRS" \
  --allow-blob-public-access false
```

### 2. Create Container

```bash
# Create blob container
az storage container create \
  --name "livestock-images" \
  --account-name "livestockstorage123" \
  --public-access off
```

### 3. Upload Images

```bash
# Upload images
az storage blob upload-batch \
  --account-name "livestockstorage123" \
  --destination "livestock-images" \
  --source "public/images"
```

## Backend API Deployment
# PigPro Deployment Guide

This guide covers deploying the PigPro application to Azure, including both the frontend (Azure Static Web Apps) and backend (Azure Functions).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Local Development Setup](#local-development-setup)
- [Azure Resources Setup](#azure-resources-setup)
- [Frontend Deployment (Azure Static Web Apps)](#frontend-deployment-azure-static-web-apps)
- [Backend Deployment (Azure Functions)](#backend-deployment-azure-functions)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD Configuration](#cicd-configuration)
- [CORS Configuration](#cors-configuration)
- [Custom Domain Setup](#custom-domain-setup)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying PigPro, ensure you have:

- An Azure account with an active subscription
- Azure CLI installed and configured
- Node.js 18+ installed
- Git installed
- Azure Functions Core Tools v4+
- A PostgreSQL database (Azure Database for PostgreSQL recommended)

## Architecture Overview

PigPro consists of:

1. **Frontend**: React application built with Vite, deployed to Azure Static Web Apps
2. **Backend**: Azure Functions API (Node.js/TypeScript)
3. **Database**: PostgreSQL database
4. **Storage**: Azure Blob Storage (optional, for file uploads)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YourOrg/pigpro.git
cd pigpro
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend/api
npm install
cd ../..
```

### 3. Configure Local Environment

Create a `local.settings.json` file in `backend/api/`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DATABASE_URL": "postgresql://user:password@localhost:5432/pigpro",
    "JWT_SECRET": "your-local-jwt-secret"
  }
}
```

### 4. Start Development Servers

```bash
# Start frontend (in root directory)
npm run dev

# Start backend (in another terminal)
cd backend/api
npm start
```

## Azure Resources Setup

### 1. Create Resource Group

```bash
az group create --name pigpro-rg --location eastus
```

### 2. Create PostgreSQL Database

```bash
az postgres flexible-server create \
  --resource-group pigpro-rg \
  --name pigpro-db-server \
  --location eastus \
  --admin-user pigproadmin \
  --admin-password <YourSecurePassword> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14
```

### 3. Create Database

```bash
az postgres flexible-server db create \
  --resource-group pigpro-rg \
  --server-name pigpro-db-server \
  --database-name pigpro
```

### 4. Configure Firewall Rules

```bash
# Allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group pigpro-rg \
  --name pigpro-db-server \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP (for management)
az postgres flexible-server firewall-rule create \
  --resource-group pigpro-rg \
  --name pigpro-db-server \
  --rule-name AllowMyIP \
  --start-ip-address <YourIPAddress> \
  --end-ip-address <YourIPAddress>
```

## Frontend Deployment (Azure Static Web Apps)

### Option 1: Deploy via Azure Portal

1. Go to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" and search for "Static Web App"
3. Fill in the details:
   - **Resource Group**: pigpro-rg
   - **Name**: pigpro-frontend
   - **Region**: East US 2
   - **Plan type**: Free or Standard
4. Connect to your GitHub repository
5. Configure build settings:
   - **Build Presets**: React
   - **App location**: /
   - **API location**: backend/api
   - **Output location**: dist

### Option 2: Deploy via Azure CLI

```bash
az staticwebapp create \
  --name pigpro-frontend \
  --resource-group pigpro-rg \
  --source https://github.com/YourOrg/pigpro \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --api-location "backend/api" \
  --output-location "dist" \
  --login-with-github
```

### Get Static Web App URL

```bash
az staticwebapp show \
  --name pigpro-frontend \
  --resource-group pigpro-rg \
  --query "defaultHostname" \
  --output tsv
```

This will output your SWA URL (e.g., `pigpro-frontend-abc123.azurestaticapps.net`).

## Backend Deployment (Azure Functions)

### 1. Create Function App

```bash
# Create storage account for function app
az storage account create \
  --name "livestockfunctions123" \
  --resource-group "rg-livestock-club-sa" \
  --location "southafricanorth" \
  --sku "Standard_LRS"

# Create function app
az functionapp create \
  --resource-group "rg-livestock-club-sa" \
  --consumption-plan-location "southafricanorth" \
  --runtime "node" \
  --runtime-version "20" \
  --functions-version "4" \
  --name "livestock-api" \
  --storage-account "livestockfunctions123"
```

### 2. Configure Application Settings

#### Option A: Using Azure Key Vault (Recommended)

```bash
# Create Key Vault
az keyvault create \
  --name "livestock-keyvault" \
  --resource-group "rg-livestock-club-sa" \
  --location "southafricanorth"

# Store database password in Key Vault
az keyvault secret set \
  --vault-name "livestock-keyvault" \
  --name "db-password" \
  --value "Your-Strong-Pwd1!"

# Set application settings with Key Vault references
az functionapp config appsettings set \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa" \
  --settings \
    "PGHOST=livestock-pg-server.postgres.database.azure.com" \
    "PGUSER=pgadmin@livestock-pg-server" \
    "PGPASSWORD=@Microsoft.KeyVault(SecretUri=https://livestock-keyvault.vault.azure.net/secrets/db-password/)" \
    "PGDATABASE=livestockdb" \
    "PGPORT=5432" \
    "PGSSLMODE=require" \
    "BLOB_BASE_URL=https://livestockstorage123.blob.core.windows.net/livestock-images"
```

#### Option B: Using Managed Identity (Alternative)

```bash
# Enable system-assigned managed identity
az functionapp identity assign \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa"

# Grant the Function App access to Key Vault
az keyvault set-policy \
  --name "livestock-keyvault" \
  --resource-group "rg-livestock-club-sa" \
  --object-id $(az functionapp identity show --name "livestock-api" --resource-group "rg-livestock-club-sa" --query principalId -o tsv) \
  --secret-permissions get list
```

### 3. Deploy Function App

```bash
# Build the API
cd apps/api
npm run build

# Deploy to Azure
func azure functionapp publish livestock-api
```

## Frontend Deployment

### 1. Create Static Web App

```bash
# Create static web app (frontend only - API deployed separately)
az staticwebapp create \
  --name "livestock-club-sa" \
  --resource-group "rg-livestock-club-sa" \
  --location "Central US" \
  --branch "main" \
  --app-location "apps/frontend" \
  --output-location "dist"
```

### 2. Configure Build Settings

Create `.github/workflows/azure-static-web-apps.yml`:
az functionapp create \
  --resource-group pigpro-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name pigpro-api \
  --storage-account pigprostorage
```

### 2. Configure Function App Settings

```bash
az functionapp config appsettings set \
  --name pigpro-api \
  --resource-group pigpro-rg \
  --settings \
    "DATABASE_URL=postgresql://user:password@pigpro-db-server.postgres.database.azure.com:5432/pigpro" \
    "JWT_SECRET=<YourProductionJWTSecret>"
```

### 3. Deploy Function App

```bash
cd backend/api
npm run build
func azure functionapp publish pigpro-api
```

## Database Configuration

### 1. Run Migrations

Connect to your database and run the schema:

```bash
psql -h pigpro-db-server.postgres.database.azure.com \
  -U pigproadmin \
  -d pigpro \
  -f backend/api/src/lib/db/schema.sql
```

### 2. Seed Initial Data (Optional)

```bash
cd backend/api
npm run db:seed
```

## Environment Variables

### Frontend Environment Variables

Configure in Azure Static Web Apps:

1. Go to Azure Portal → Your Static Web App → Configuration
2. Add the following:

```
VITE_API_URL=https://pigpro-api.azurewebsites.net
VITE_APP_NAME=PigPro
```

### Backend Environment Variables

Configure in Azure Function App:

```bash
az functionapp config appsettings set \
  --name pigpro-api \
  --resource-group pigpro-rg \
  --settings \
    "DATABASE_URL=<YourDatabaseConnectionString>" \
    "JWT_SECRET=<YourJWTSecret>" \
    "ALLOWED_ORIGINS=<YourSWAURL>"
```

## CI/CD Configuration

### GitHub Actions Workflow

Azure Static Web Apps automatically creates a GitHub Actions workflow. Ensure your `.github/workflows/azure-static-web-apps-*.yml` includes:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: 'apps/frontend'
          output_location: 'dist'

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: 'close'
```

### 3. Configure Environment Variables

In the Azure portal, set these environment variables for the static web app:

```bash
VITE_API_URL=https://livestock-api.azurewebsites.net/api/v1
```

## Database Initialization

### 1. Run Database Setup

```bash
# Set environment variables
export PGHOST="livestock-pg-server.postgres.database.azure.com"
export PGUSER="pgadmin@livestock-pg-server"
export PGPASSWORD="Your-Strong-Pwd1!"
export PGDATABASE="livestockdb"
export PGPORT="5432"
export PGSSLMODE="require"

# Run database initialization
cd apps/api
npm run db:init
```

## Monitoring and Logging

### 1. Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app "livestock-insights" \
  --location "southafricanorth" \
  --resource-group "rg-livestock-club-sa"
```

### 2. Configure Logging

Add to function app settings:

```bash
APPINSIGHTS_INSTRUMENTATIONKEY=<your-instrumentation-key>
APPLICATIONINSIGHTS_CONNECTION_STRING=<your-connection-string>
```

## Security Configuration

### 1. CORS Settings

Configure CORS for the function app:

```bash
az functionapp cors add \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa" \
  --allowed-origins "https://livestock-club-sa.azurestaticapps.net"
```

### 2. Authentication

Configure authentication for the static web app in the Azure portal:

- Enable authentication
- Configure identity providers (Google, Facebook, Microsoft)
- Set up redirect URLs

## Domain Configuration

### 1. Custom Domain

```bash
# Add custom domain to static web app
az staticwebapp hostname set \
  --name "livestock-club-sa" \
  --resource-group "rg-livestock-club-sa" \
  --hostname "livestockclubsa.co.za"
```

### 2. SSL Certificate

SSL certificates are automatically managed by Azure Static Web Apps.

## Backup and Recovery

### 1. Database Backup

```bash
# Create backup policy
az postgres flexible-server backup create \
  --resource-group "rg-livestock-club-sa" \
  --name "livestock-pg-server" \
  --backup-name "daily-backup"
```

### 2. Storage Backup

Configure backup for blob storage:

```bash
# Enable soft delete
az storage blob service-properties update \
  --account-name "livestockstorage123" \
  --enable-delete-retention true \
  --delete-retention-days 7
```

## Performance Optimization

### 1. CDN Configuration

```bash
# Create CDN profile
az cdn profile create \
  --name "livestock-cdn" \
  --resource-group "rg-livestock-club-sa" \
  --sku "Standard_Microsoft"
```

### 2. Database Optimization

- Configure connection pooling
- Set up read replicas for read-heavy workloads
- Monitor query performance

## Scaling

### 1. Function App Scaling

- Configure auto-scaling rules
- Set up premium plans for better performance
- Monitor usage patterns

### 2. Database Scaling

```bash
# Scale up database
az postgres flexible-server update \
  --resource-group "rg-livestock-club-sa" \
  --name "livestock-pg-server" \
  --sku-name "Standard_D2s_v3"
```

## Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Test database connection
psql -h livestock-pg-server.postgres.database.azure.com \
     -U pgadmin@livestock-pg-server \
     -d livestockdb \
     -p 5432
```

#### Function App Deployment Issues

```bash
# Check function app logs
az functionapp log tail \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa"
```

#### Static Web App Issues

- Check build logs in GitHub Actions
- Verify environment variables
- Check CORS configuration

### Monitoring

- Use Azure Monitor for application insights
- Set up alerts for critical metrics
- Monitor database performance

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Monitor security patches
- Review and optimize database queries
- Clean up old blob storage data

### Updates

```bash
# Update function app runtime (Linux Consumption)
az functionapp config set \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa" \
  --linux-fx-version "node|20"

# Alternative: Set via app settings
az functionapp config appsettings set \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa" \
  --settings "WEBSITE_NODE_DEFAULT_VERSION=~20"
```

## Cost Optimization

### Recommendations

- Use consumption plans for function apps
- Implement auto-shutdown for development resources
- Monitor and optimize database usage
- Use lifecycle management for blob storage

### Cost Monitoring

- Set up cost alerts
- Use Azure Cost Management
- Regular cost reviews

## Support

### Azure Support

- Use Azure support channels
- Check Azure status page
- Review Azure documentation

### Application Support

- Monitor application logs
- Use Application Insights
- Set up health checks
