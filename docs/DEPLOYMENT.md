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
- **Node.js 18+** and npm
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
# Add firewall rule for your IP (replace with your actual IP)
az postgres flexible-server firewall-rule create \
  --resource-group "rg-livestock-club-sa" \
  --name "livestock-pg-server" \
  --rule-name "AllowMyIP" \
  --start-ip-address "YOUR_IP_ADDRESS" \
  --end-ip-address "YOUR_IP_ADDRESS"

# Or allow Azure services only (for production)
az postgres flexible-server firewall-rule create \
  --resource-group "rg-livestock-club-sa" \
  --name "livestock-pg-server" \
  --rule-name "OfficeIP" \
  --start-ip-address "<YOUR_OFFICE_IP>" \
  --end-ip-address "<YOUR_OFFICE_IP>"
# Or use Private Link/VNet integration and skip public rules entirely.

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

### 2. Create Container

# Create blob container
az storage container create \
  --name "livestock-images" \
  --account-name "livestockstorage123" \
  --public-access off

### 3. Upload Images

```bash
# Upload images
az storage blob upload-batch \
  --account-name "livestockstorage123" \
  --destination "livestock-images" \
  --source "public/images"
```

## Backend API Deployment

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
  --runtime-version "18" \
  --functions-version "4" \
  --name "livestock-api" \
  --storage-account "livestockfunctions123"
```

### 2. Configure Application Settings

```bash
# Set database connection string
az functionapp config appsettings set \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa" \
  --settings \
    "PGHOST=livestock-pg-server.postgres.database.azure.com" \
    "PGUSER=pgadmin@livestock-pg-server" \
    "PGPASSWORD=Your-Strong-Pwd1!" \
    "PGDATABASE=livestockdb" \
    "PGPORT=5432" \
    "PGSSLMODE=require" \
    "BLOB_BASE_URL=https://livestockstorage123.blob.core.windows.net/livestock-images"
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
# Create static web app
az staticwebapp create \
  --name "livestock-club-sa" \
  --resource-group "rg-livestock-club-sa" \
  --source "https://github.com/your-username/livestock-club-sa" \
  --location "Central US" \
  --branch "main" \
  --app-location "apps/frontend" \
  --output-location "dist" \
  --api-location "apps/api"
```

### 2. Configure Build Settings

Create `.github/workflows/azure-static-web-apps.yml`:

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
    if:
      github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action !=
      'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: 'apps/frontend'
          output_location: 'dist'
          api_location: 'apps/api'

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
  --server-name "livestock-pg-server" \
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
# Update function app runtime
az functionapp config set \
  --name "livestock-api" \
  --resource-group "rg-livestock-club-sa" \
  --node-version "18"
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
