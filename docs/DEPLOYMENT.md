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
          action: "upload"
          app_location: "/"
          api_location: "backend/api"
          output_location: "dist"
```

## CORS Configuration

### Configuring CORS for Azure Functions

When your frontend is deployed to Azure Static Web Apps, you need to configure CORS in your Azure Functions to allow requests from your Static Web App.

**Important**: Do not use placeholder or example hostnames in your CORS configuration. You must use your actual Static Web App URL or custom domain.

#### Steps to Configure CORS:

1. Get your actual Static Web App URL from the Azure Portal:
   - Navigate to your Static Web App resource
   - Copy the URL shown (e.g., `https://your-actual-app.azurestaticapps.net`)
   
2. If you've configured a custom domain, use that instead (e.g., `https://pigpro.yourdomain.com`)

3. Configure CORS in Azure Portal:
   - Navigate to your Function App
   - Go to "CORS" in the left menu
   - Add your actual Static Web App URL or custom domain to the allowed origins list
   - Example: `https://your-actual-app.azurestaticapps.net`
   - Click "Save"

4. Or configure via Azure CLI:

```bash
az functionapp cors add \
  --name pigpro-api \
  --resource-group pigpro-rg \
  --allowed-origins https://example.azurestaticapps.net
```

### CORS in local.settings.json (Development Only)

For local development, add to `backend/api/host.json`:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "cors": {
    "allowedOrigins": [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  }
}
```

## Custom Domain Setup

### 1. Configure Custom Domain for Static Web App

1. In Azure Portal, go to your Static Web App
2. Click "Custom domains" in the left menu
3. Click "Add"
4. Choose "Free certificate managed by Azure" or "Enter certificate"
5. Enter your custom domain
6. Follow the DNS configuration instructions

### 2. Update CORS Configuration

After setting up a custom domain, update your CORS configuration to include the custom domain:

```bash
az functionapp cors add \
  --name pigpro-api \
  --resource-group pigpro-rg \
  --allowed-origins https://pigpro.yourdomain.com
```

## Monitoring and Logging

### Application Insights

1. Create Application Insights:

```bash
az monitor app-insights component create \
  --app pigpro-insights \
  --location eastus \
  --resource-group pigpro-rg
```

2. Get Instrumentation Key:

```bash
az monitor app-insights component show \
  --app pigpro-insights \
  --resource-group pigpro-rg \
  --query instrumentationKey \
  --output tsv
```

3. Add to Function App:

```bash
az functionapp config appsettings set \
  --name pigpro-api \
  --resource-group pigpro-rg \
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=<YourInstrumentationKey>"
```

### Viewing Logs

```bash
# Function App logs
az functionapp log tail --name pigpro-api --resource-group pigpro-rg

# Static Web App logs
az staticwebapp log tail --name pigpro-frontend --resource-group pigpro-rg
```

## Troubleshooting

### Common Issues

#### CORS Errors

**Symptom**: Browser console shows CORS errors when calling API

**Solution**: 
- Verify your CORS configuration includes your actual Static Web App URL or custom domain
- Never use placeholder URLs like `example.azurestaticapps.net`
- Check that the URL matches exactly (including https://)
- Remember to update CORS if you change from SWA URL to custom domain

#### Database Connection Errors

**Symptom**: API returns 500 errors related to database connectivity

**Solution**:
- Check firewall rules allow Azure Functions to connect
- Verify DATABASE_URL is correct in Function App settings
- Ensure PostgreSQL server is running

#### Build Failures

**Symptom**: GitHub Actions workflow fails

**Solution**:
- Check Node.js version matches
- Verify all dependencies are in package.json
- Check build logs for specific errors

#### Authentication Issues

**Symptom**: Users can't log in

**Solution**:
- Verify JWT_SECRET is set in Function App
- Check token expiration settings
- Ensure database has user records

### Health Checks

Add health check endpoints to verify deployment:

**Frontend**: Access your Static Web App URL - should load the application

**Backend**: Access `https://pigpro-api.azurewebsites.net/api/health` (if implemented)

**Database**: Connect via psql:
```bash
psql -h pigpro-db-server.postgres.database.azure.com -U pigproadmin -d pigpro -c "SELECT 1;"
```

## Security Best Practices

1. **Never commit secrets**: Use Azure Key Vault or App Settings
2. **Use managed identities**: Enable for Function App to access other Azure services
3. **Enable HTTPS only**: Enforce HTTPS for all resources
4. **Regular updates**: Keep dependencies updated
5. **Access restrictions**: Configure network security groups and firewall rules
6. **Audit logs**: Enable and review Azure Activity logs

## Scaling Considerations

### Static Web App
- Free tier: 100 GB bandwidth/month
- Standard tier: Unlimited bandwidth, custom authentication

### Function App
- Consumption plan: Auto-scales based on load
- Premium plan: Pre-warmed instances, VNET integration

### Database
- Scale up: Change SKU for more resources
- Scale out: Add read replicas for read-heavy workloads

## Cost Optimization

1. **Use consumption plans** where possible
2. **Enable auto-shutdown** for dev/test environments
3. **Monitor usage** with Azure Cost Management
4. **Right-size resources** based on actual usage
5. **Use reserved instances** for predictable workloads

## Backup and Recovery

### Database Backups

```bash
# Enable automated backups
az postgres flexible-server backup create \
  --resource-group pigpro-rg \
  --name pigpro-db-server \
  --backup-name manual-backup-$(date +%Y%m%d)
```

### Static Web App
- Deployment history maintained in GitHub
- Can redeploy previous commits

### Function App
- Enable deployment slots for zero-downtime deployments
- Keep previous versions in GitHub

## Support and Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/azure/postgresql/)
- [Project GitHub Repository](https://github.com/YourOrg/pigpro)
- [Report Issues](https://github.com/YourOrg/pigpro/issues)

---

For questions or issues with deployment, please open an issue on GitHub or contact the development team.
