# Configuration Guide - Livestock Club SA

## Environment Variables

This guide explains how to configure the Livestock Club SA application using environment variables.

## Required Configuration

### Database Configuration

```bash
# PostgreSQL Database Settings
PGHOST=localhost
PGUSER=pgadmin
PGPASSWORD=your-secure-password
PGDATABASE=livestockdb
PGPORT=5432
PGSSLMODE=disable

# For Azure PostgreSQL (Production)
PGHOST=your-server.postgres.database.azure.com
PGUSER=pgadmin@your-server
PGPASSWORD=your-secure-password
PGDATABASE=livestockdb
PGPORT=5432
PGSSLMODE=require
```

### Storage Configuration

```bash
# Blob Storage Base URL for Images
BLOB_BASE_URL=https://yourstorageaccount.blob.core.windows.net/livestock-images
```

### API Configuration

```bash
# Function App Settings
FUNCTIONS_WORKER_RUNTIME=node
AzureWebJobsStorage=UseDevelopmentStorage=true
```

## Development Setup

### 1. Create Environment File

```bash
# Copy the template
cp apps/api/.env.example apps/api/.env

# Edit with your values
nano apps/api/.env
```

### 2. Local Development

```bash
# Set environment variables
export PGHOST=localhost
export PGUSER=pgadmin
export PGPASSWORD=your-password
export PGDATABASE=livestockdb
export BLOB_BASE_URL=http://localhost:10000/devstoreaccount1

# Start development servers
npm run frontend
npm run backend:dev
```

## Production Configuration

### Azure Function App Settings

Configure these in the Azure portal under Function App > Configuration > Application settings:

```bash
# Database
PGHOST=livestock-pg-server.postgres.database.azure.com
PGUSER=pgadmin@livestock-pg-server
PGPASSWORD=Your-Strong-Pwd1!
PGDATABASE=livestockdb
PGPORT=5432
PGSSLMODE=require

# Storage
BLOB_BASE_URL=https://livestockstorage123.blob.core.windows.net/livestock-images

# Runtime
FUNCTIONS_WORKER_RUNTIME=node
```

### Static Web App Configuration

Configure these in the Azure portal under Static Web App > Configuration:

```bash
# API URL
VITE_API_URL=https://livestock-api.azurewebsites.net/api/v1

# Environment
NODE_ENV=production
```

## Security Configuration

### JWT Configuration

```bash
# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key
```

### CORS Configuration

```bash
# Allowed origins (comma-separated)
CORS_ORIGINS=https://livestock-club-sa.azurestaticapps.net,https://livestockclubsa.co.za
```

## Feature Flags

### Enable/Disable Features

```bash
# Feature toggles
ENABLE_SOCIAL_LOGIN=true
ENABLE_GUEST_BROWSING=true
ENABLE_PROMOTED_LISTINGS=true
ENABLE_LIKE_SYSTEM=true
ENABLE_IMAGE_UPLOAD=true
```

## Monitoring Configuration

### Application Insights

```bash
# Application Insights
APPINSIGHTS_INSTRUMENTATIONKEY=your-instrumentation-key
APPLICATIONINSIGHTS_CONNECTION_STRING=your-connection-string
```

### Error Tracking

```bash
# Sentry (Optional)
SENTRY_DSN=your-sentry-dsn
```

## Configuration Validation

### Check Configuration

```bash
# Validate environment variables
npm run config:validate

# Test database connection
npm run db:test

# Test storage connection
npm run storage:test
```

## Configuration Management

### Environment-Specific Configs

#### Development

```bash
# .env.development
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

#### Staging

```bash
# .env.staging
NODE_ENV=staging
DEBUG=false
LOG_LEVEL=info
```

#### Production

```bash
# .env.production
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
```

### Configuration Loading Order

1. Default values
2. Environment-specific files
3. Environment variables
4. Command-line arguments

## Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Test connection
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -p $PGPORT

# Check SSL mode
echo $PGSSLMODE
```

#### Storage Issues

```bash
# Test blob storage
curl -I $BLOB_BASE_URL/test-image.jpg

# Check storage account
az storage account show --name yourstorageaccount
```

#### Function App Issues

```bash
# Check function app logs
az functionapp log tail --name your-function-app

# Check configuration
az functionapp config appsettings list --name your-function-app
```

### Configuration Debugging

```bash
# Print current configuration (without secrets)
npm run config:debug

# Validate all settings
npm run config:validate
```

## Best Practices

### Security

- Never commit `.env` files to version control
- Use strong passwords and secrets
- Rotate secrets regularly
- Use Azure Key Vault for production secrets

### Performance

- Use connection pooling for database
- Configure appropriate timeouts
- Set up caching where appropriate
- Monitor resource usage

### Reliability

- Use health checks
- Configure proper error handling
- Set up monitoring and alerting
- Plan for disaster recovery

## Configuration Scripts

### Setup Scripts

```bash
# Initialize development environment
npm run setup:dev

# Setup production environment
npm run setup:prod

# Validate configuration
npm run config:validate
```

### Migration Scripts

```bash
# Migrate configuration
npm run config:migrate

# Backup configuration
npm run config:backup

# Restore configuration
npm run config:restore
```

## Environment Templates

### Minimal Configuration

```bash
# Minimum required for development
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=livestockdb
BLOB_BASE_URL=http://localhost:10000/devstoreaccount1
```

### Full Configuration

```bash
# Complete configuration with all features
PGHOST=your-host
PGUSER=your-user
PGPASSWORD=your-password
PGDATABASE=your-database
BLOB_BASE_URL=your-blob-url
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=your-origins
ENABLE_SOCIAL_LOGIN=true
ENABLE_GUEST_BROWSING=true
APPINSIGHTS_INSTRUMENTATIONKEY=your-key
```

## Support

For configuration issues:

- Check the logs for specific error messages
- Validate environment variables
- Test individual components
- Contact support with detailed error information
