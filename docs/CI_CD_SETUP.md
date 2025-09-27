# CI/CD Setup Guide for Livestock Club SA

This guide explains how to set up Continuous Integration and Continuous Deployment (CI/CD) for the
Livestock Club SA project targeting Azure.

## 🚀 Overview

The project includes comprehensive CI/CD pipelines for:

- **GitHub Actions** (Primary)
- **Azure DevOps** (Alternative)
- **Database Migrations**
- **Security Scanning**
- **Pull Request Checks**

## 📋 Prerequisites

### Required Azure Resources

- Azure Static Web Apps (for frontend)
- Azure Functions (for API)
- Azure PostgreSQL (for database)
- Azure Blob Storage (for images)
- Azure Service Principal (for authentication)

### Required GitHub Secrets

Add these secrets to your GitHub repository settings:

#### Azure Authentication

```
AZURE_CREDENTIALS
```

Service principal credentials in JSON format:

```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

#### Static Web Apps

```
AZURE_STATIC_WEB_APPS_API_TOKEN
AZURE_STATIC_WEB_APPS_API_TOKEN_DEV
```

Get from Azure Static Web Apps deployment tokens.

#### Function Apps

```
AZURE_FUNCTIONAPP_PUBLISH_PROFILE
AZURE_FUNCTIONAPP_PUBLISH_PROFILE_DEV
```

Download from Azure Function App → Get publish profile.

#### Database

```
PGHOST
PGPORT
PGUSER
PGPASSWORD
PGDATABASE
BLOB_BASE_URL
```

PostgreSQL connection details and blob storage URL.

#### Optional

```
TEAMS_WEBHOOK          # Microsoft Teams notifications
CODECOV_TOKEN          # Code coverage reporting
```

## 🔧 Setup Instructions

### 1. Create Azure Resources

#### Static Web App

```bash
# Create Static Web App
az staticwebapp create \
  --name livestock-frontend \
  --resource-group livestock-rg \
  --source https://github.com/your-org/livestock-club-sa \
  --location "West Europe" \
  --branch main \
  --app-location "/apps/frontend" \
  --output-location "dist"
```

#### Function App

```bash
# Create Function App
az functionapp create \
  --name livestock-api \
  --resource-group livestock-rg \
  --consumption-plan-location "West Europe" \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4
```

#### Service Principal

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "livestock-cicd" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/livestock-rg \
  --sdk-auth
```

### 2. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add each secret from the list above

### 3. Environment Setup

#### Production Environment

- **Branch**: `main`
- **Static Web App**: `livestock-frontend`
- **Function App**: `livestock-api`
- **Database**: Production PostgreSQL

#### Development Environment

- **Branch**: `develop`
- **Static Web App**: `livestock-frontend-dev`
- **Function App**: `livestock-api-dev`
- **Database**: Development PostgreSQL

## 🔄 Workflow Details

### Main Deployment Pipeline (`azure-deploy.yml`)

**Triggers**: Push to `main`, Pull requests to `main`

**Jobs**:

1. **Test**: Run API tests and frontend linting
2. **Build**: Build both frontend and API
3. **Deploy API**: Deploy to Azure Functions
4. **Deploy Frontend**: Deploy to Azure Static Web Apps
5. **Security Scan**: Run security audits and CodeQL

### Development Pipeline (`azure-dev.yml`)

**Triggers**: Push to `develop`, Pull requests to `develop`

**Jobs**:

1. **Test**: Run tests with coverage
2. **Build**: Build with development API URL
3. **Deploy**: Deploy to development environment
4. **Notify**: Send Teams notification

### Pull Request Checks (`pr-checks.yml`)

**Triggers**: Pull requests to `main` or `develop`

**Jobs**:

1. **Lint & Format**: ESLint and TypeScript checks
2. **Test**: Run all tests
3. **Build Check**: Verify builds work
4. **Security Check**: Security audit and dependency review
5. **PR Comment**: Update PR with CI status

### Database Migration (`database-migration.yml`)

**Triggers**: Database-related file changes, Manual dispatch

**Jobs**:

1. **Migrate**: Run database initialization
2. **Seed**: Populate with sample data (dev only)
3. **Notify**: Send migration status

## 🛠️ Local Development

### Running Tests Locally

```bash
# Run all tests
npm run test

# Run frontend tests
cd apps/frontend && npm run test

# Run API tests
cd apps/api && npm run test
```

### Building Locally

```bash
# Build all applications
npm run build:all

# Build frontend only
npm run frontend:build

# Build API only
npm run api:build
```

## 📊 Monitoring and Notifications

### GitHub Actions Status

- View workflow runs in GitHub Actions tab
- Check individual job logs for debugging
- Review security scan results

### Azure Monitoring

- Monitor function app metrics in Azure portal
- Check static web app analytics
- Review database performance

### Teams Notifications

Configure Teams webhook for deployment notifications:

- Development deployments
- Production deployments
- Database migrations
- Failed builds

## 🔒 Security Features

### Automated Security Scanning

- **npm audit**: Dependency vulnerability scanning
- **CodeQL**: Static code analysis
- **Dependency Review**: PR dependency changes
- **Secrets Scanning**: Detect exposed secrets

### Environment Protection

- Production deployments require approval
- Secrets stored securely in GitHub
- Service principal with minimal permissions

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check Node.js version compatibility
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Deployment Failures

- Verify Azure credentials are correct
- Check resource group permissions
- Ensure Function App runtime is Node.js 18
- Verify Static Web App configuration

#### Database Connection Issues

- Check PostgreSQL firewall rules
- Verify connection string format
- Ensure SSL configuration is correct

### Debug Commands

```bash
# Test API locally
cd apps/api && npm run start:7073

# Test frontend locally
cd apps/frontend && npm run dev

# Check Azure resources
az group show --name livestock-rg
az functionapp list --resource-group livestock-rg
az staticwebapp list --resource-group livestock-rg
```

## 📈 Performance Optimization

### Build Optimization

- Use npm ci for faster, reliable installs
- Cache node_modules between builds
- Parallel job execution where possible

### Deployment Optimization

- Deploy only changed applications
- Use Azure CDN for static assets
- Enable compression and caching

## 🔄 Maintenance

### Regular Tasks

- Update Node.js version in workflows
- Review and update dependencies
- Monitor security scan results
- Update Azure resource configurations

### Scaling Considerations

- Add staging environment for testing
- Implement blue-green deployments
- Add performance testing
- Set up monitoring and alerting

---

For additional help, refer to:

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
