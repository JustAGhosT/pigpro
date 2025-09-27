#!/usr/bin/env node

/**
 * Project Organization Script
 * 
 * This script helps organize the Livestock Club SA project structure
 * by creating proper directories, moving files, and updating configurations.
 */

import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✓ Created directory: ${dirPath}`, colors.green);
  } else {
    log(`- Directory exists: ${dirPath}`, colors.yellow);
  }
}

function moveFile(source, destination) {
  if (fs.existsSync(source)) {
    const destDir = path.dirname(destination);
    createDirectory(destDir);
    
    fs.renameSync(source, destination);
    log(`✓ Moved: ${source} → ${destination}`, colors.green);
  } else {
    log(`- File not found: ${source}`, colors.yellow);
  }
}

function copyFile(source, destination) {
  if (fs.existsSync(source)) {
    const destDir = path.dirname(destination);
    createDirectory(destDir);
    
    fs.copyFileSync(source, destination);
    log(`✓ Copied: ${source} → ${destination}`, colors.green);
  } else {
    log(`- File not found: ${source}`, colors.yellow);
  }
}

function updatePackageJson(packagePath, updates) {
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    Object.assign(packageJson, updates);
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    log(`✓ Updated: ${packagePath}`, colors.green);
  }
}

function main() {
  log('🚀 Starting Livestock Club SA Project Organization', colors.bright + colors.cyan);
  
  // Create new directory structure
  log('\n📁 Creating directory structure...', colors.blue);
  
  const directories = [
    'apps/frontend/src',
    'apps/frontend/public',
    'apps/api/src/functions',
    'apps/api/src/lib',
    'apps/api/src/data',
    'apps/api/scripts',
    'packages/ui/src',
    'packages/domain/src',
    'packages/utils/src',
    'docs',
    'scripts',
    'tools'
  ];
  
  directories.forEach(createDirectory);
  
  // Move frontend files
  log('\n📦 Organizing frontend files...', colors.blue);
  const frontendMoves = [
    ['src', 'apps/frontend/src'],
    ['public', 'apps/frontend/public'],
    ['index.html', 'apps/frontend/index.html'],
    ['vite.config.ts', 'apps/frontend/vite.config.ts'],
    ['tailwind.config.js', 'apps/frontend/tailwind.config.js'],
    ['postcss.config.js', 'apps/frontend/postcss.config.js'],
    ['tsconfig.app.json', 'apps/frontend/tsconfig.app.json']
  ];
  
  frontendMoves.forEach(([source, destination]) => {
    if (source !== destination) {
      moveFile(source, destination);
    }
  });
  
  // Move backend files
  log('\n🔧 Organizing backend files...', colors.blue);
  const backendMoves = [
    ['backend/api/src', 'apps/api/src'],
    ['backend/api/scripts', 'apps/api/scripts'],
    ['backend/api/host.json', 'apps/api/host.json'],
    ['backend/api/local.settings.json', 'apps/api/local.settings.json'],
    ['backend/api/tsconfig.json', 'apps/api/tsconfig.json'],
    ['backend/api/vitest.config.ts', 'apps/api/vitest.config.ts'],
    ['backend/api/TEST_DOCUMENTATION.md', 'apps/api/TEST_DOCUMENTATION.md']
  ];
  
  backendMoves.forEach(([source, destination]) => {
    moveFile(source, destination);
  });
  
  // Move packages
  log('\n📚 Organizing packages...', colors.blue);
  const packageMoves = [
    ['packages/domain/src', 'packages/domain/src']
  ];
  
  packageMoves.forEach(([source, destination]) => {
    if (fs.existsSync(source)) {
      log(`- Package already organized: ${source}`, colors.yellow);
    }
  });
  
  // Create package.json files for apps
  log('\n📋 Creating package.json files...', colors.blue);
  
  // Frontend package.json
  const frontendPackageJson = {
    "name": "@livestock-club-sa/frontend",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview",
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "lucide-react": "^0.263.1",
      "@radix-ui/react-dialog": "^1.1.15",
      "@radix-ui/react-dropdown-menu": "^2.1.16",
      "@radix-ui/react-label": "^2.1.7",
      "@radix-ui/react-select": "^2.1.16",
      "@radix-ui/react-separator": "^1.1.14",
      "@radix-ui/react-slot": "^1.1.14",
      "@radix-ui/react-tabs": "^1.1.15",
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@typescript-eslint/eslint-plugin": "^6.0.0",
      "@typescript-eslint/parser": "^6.0.0",
      "@vitejs/plugin-react": "^4.0.3",
      "autoprefixer": "^10.4.14",
      "eslint": "^8.45.0",
      "eslint-plugin-react-hooks": "^4.6.0",
      "eslint-plugin-react-refresh": "^0.4.3",
      "postcss": "^8.4.27",
      "tailwindcss": "^3.3.0",
      "typescript": "^5.0.2",
      "vite": "^4.4.5"
    }
  };
  
  fs.writeFileSync(
    'apps/frontend/package.json',
    JSON.stringify(frontendPackageJson, null, 2)
  );
  log('✓ Created: apps/frontend/package.json', colors.green);
  
  // API package.json
  const apiPackageJson = {
    "name": "@livestock-club-sa/api",
    "version": "1.0.0",
    "description": "API for Livestock Club SA application",
    "scripts": {
      "start": "set \"FUNCTIONS_WORKER_RUNTIME=node\" && set \"AzureWebJobsStorage=UseDevelopmentStorage=true\" && npx -y azure-functions-core-tools@4 start --port 7072",
      "start:7073": "set \"FUNCTIONS_WORKER_RUNTIME=node\" && set \"AzureWebJobsStorage=UseDevelopmentStorage=true\" && npx -y azure-functions-core-tools@4 start --port 7073",
      "build": "node -e \"try{require('fs').rmSync('dist',{recursive:true,force:true})}catch(e){}\" && tsc",
      "watch": "tsc -w",
      "test": "vitest",
      "test:run": "vitest run",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest run --coverage",
      "db:init:ps": "node scripts/init-db.cjs",
      "db:init:bash": "node scripts/init-db.cjs"
    },
    "dependencies": {
      "@azure/functions": "^4.0.0",
      "@types/pg": "^8.15.5",
      "papaparse": "^5.5.3",
      "pdf-lib": "^1.17.1",
      "pg": "^8.16.3",
      "typescript": "^5.0.0",
      "zod": "^4.1.11"
    },
    "devDependencies": {
      "@types/jest": "^30.0.0",
      "@types/node": "^18.0.0",
      "@vitest/ui": "^2.1.9",
      "jest": "^30.1.3",
      "ts-jest": "^29.4.4",
      "ts-node": "^10.9.2",
      "vitest": "^2.1.9"
    },
    "main": "dist/src/functions/*.js"
  };
  
  fs.writeFileSync(
    'apps/api/package.json',
    JSON.stringify(apiPackageJson, null, 2)
  );
  log('✓ Created: apps/api/package.json', colors.green);
  
  // Update root package.json
  log('\n🔧 Updating root package.json...', colors.blue);
  updatePackageJson('package.json', {
    version: '1.0.0',
    workspaces: ['apps/*', 'packages/*'],
    scripts: {
      ...JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts,
      'frontend': 'cd apps/frontend && npm run dev',
      'frontend:build': 'cd apps/frontend && npm run build',
      'api': 'cd apps/api && npm run start:7073',
      'api:build': 'cd apps/api && npm run build',
      'api:test': 'cd apps/api && npm run test:run',
      'build:all': 'npm run frontend:build && npm run api:build',
      'test:all': 'npm run api:test'
    }
  });
  
  // Create documentation index
  log('\n📚 Creating documentation index...', colors.blue);
  const docsIndex = `# Documentation Index

## 📖 Getting Started
- [README](README.md) - Project overview and quick start
- [Project Structure](PROJECT_STRUCTURE.md) - Detailed project organization
- [Configuration Guide](CONFIGURATION.md) - Environment setup and configuration

## 🚀 Deployment
- [Deployment Guide](DEPLOYMENT.md) - Complete Azure deployment guide
- [API Documentation](API_DOCUMENTATION.md) - Comprehensive API reference

## 🤝 Contributing
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines

## 🔧 Development
- [Development Setup](DEVELOPMENT.md) - Local development environment
- [Testing Guide](TESTING.md) - Testing strategies and best practices

## 📊 Architecture
- [System Design](ARCHITECTURE.md) - High-level system architecture
- [Database Schema](DATABASE.md) - Database design and schema
- [Security Guide](SECURITY.md) - Security best practices

## 📈 Monitoring
- [Monitoring Guide](MONITORING.md) - Application monitoring and logging
- [Performance Guide](PERFORMANCE.md) - Performance optimization

## 🆘 Support
- [FAQ](FAQ.md) - Frequently asked questions
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
`;

  fs.writeFileSync('docs/README.md', docsIndex);
  log('✓ Created: docs/README.md', colors.green);
  
  // Create development guide
  const developmentGuide = `# Development Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Azure)
- Azure Functions Core Tools

### Quick Start
\`\`\`bash
# Install dependencies
npm install

# Start development servers
npm run frontend  # Terminal 1
npm run api       # Terminal 2
\`\`\`

### Project Structure
\`\`\`
apps/
├── frontend/     # React application
├── api/          # Azure Functions API
packages/
├── ui/           # Shared UI components
├── domain/       # Domain models
└── utils/        # Shared utilities
\`\`\`

### Development Workflow
1. Create feature branch
2. Make changes
3. Run tests
4. Create pull request
`;

  fs.writeFileSync('docs/DEVELOPMENT.md', developmentGuide);
  log('✓ Created: docs/DEVELOPMENT.md', colors.green);
  
  // Create code of conduct
  const codeOfConduct = `# Code of Conduct

## Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone.

## Our Standards

### Positive Behavior
- Be respectful and inclusive
- Show empathy towards others
- Accept constructive criticism
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination
- Inappropriate comments or behavior
- Personal attacks or trolling
- Spam or off-topic discussions

## Enforcement

Violations will be addressed through warnings, temporary bans, or permanent bans.

## Reporting

Report violations to: conduct@livestockclubsa.co.za
`;

  fs.writeFileSync('docs/CODE_OF_CONDUCT.md', codeOfConduct);
  log('✓ Created: docs/CODE_OF_CONDUCT.md', colors.green);
  
  // Clean up old directories
  log('\n🧹 Cleaning up old structure...', colors.blue);
  const cleanupDirs = ['backend'];
  cleanupDirs.forEach(dir => {
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
      log(`✓ Removed empty directory: ${dir}`, colors.green);
    }
  });
  
  // Summary
  log('\n🎉 Project organization complete!', colors.bright + colors.green);
  log('\n📋 Next steps:', colors.blue);
  log('1. Run: npm install', colors.yellow);
  log('2. Start development: npm run frontend', colors.yellow);
  log('3. Start API: npm run api', colors.yellow);
  log('4. Review documentation in docs/', colors.yellow);
  
  log('\n✨ Your project is now properly organized!', colors.bright + colors.cyan);
}

main();
