# Contributing to Livestock Club SA

Thank you for your interest in contributing to Livestock Club SA! This document provides guidelines
and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Azure Functions Core Tools (for backend development)
- PostgreSQL (local or Azure)

### Setup Development Environment

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/livestock-club-sa.git
   cd livestock-club-sa
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment template
   cp apps/api/.env.example apps/api/.env

   # Edit with your configuration
   nano apps/api/.env
   ```

4. **Initialize Database**

   ```bash
   npm run db:init
   ```

5. **Start Development Servers**

   ```bash
   # Terminal 1: Frontend
   npm run frontend

   # Terminal 2: API (runs on :7073)
   npm run api
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive, camelCase names for variables and functions

### Component Guidelines

```typescript
// Good: Descriptive component name with props interface
interface ProductCardProps {
  product: Product;
  onLike: (id: string) => void;
  isAuthenticated: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onLike, isAuthenticated }) => {
  // Component implementation
};
```

### API Guidelines

```typescript
// Good: Proper error handling and type safety
export async function getListings(req: HttpRequest): Promise<HttpResponseInit> {
  try {
    const listings = await fetchListingsFromDB();
    return {
      status: 200,
      jsonBody: listings,
    };
  } catch (error) {
    return {
      status: 500,
      jsonBody: { error: 'Failed to fetch listings' },
    };
  }
}
```

## 🧪 Testing

### Test Requirements

- Write tests for all new features
- Maintain existing test coverage
- Follow the established test patterns

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:api
npm run test:frontend

# Run with coverage
npm run test:coverage
```

### Test Patterns

```typescript
// Unit Test Example
describe('ProductCard Component', () => {
  it('should display product information correctly', () => {
    const mockProduct = {
      id: '1',
      title: 'Test Product',
      price: 100
    };

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('R100')).toBeInTheDocument();
  });
});
```

## 📁 Project Structure

### Frontend Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   └── ...
├── contexts/            # React contexts
├── lib/                # Utilities and types
└── main.tsx            # Application entry point
```

### Backend Structure

```
apps/api/src/
├── functions/           # Azure Functions endpoints
├── lib/                # Shared utilities
├── data/               # Mock data and schemas
└── test/               # Test files
```

## 🔄 Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow the conventional commits format:

```
type(scope): description

feat(marketplace): add fish category filtering
fix(auth): resolve login redirect issue
docs(api): update endpoint documentation
```

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Changes and Test**

   ```bash
   # Make your changes
   npm run test
   npm run lint
   ```

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat(marketplace): add amazing feature"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/amazing-feature
   # Create pull request on GitHub
   ```

## 🎯 Areas for Contribution

### High Priority

- **Performance Optimization**: Improve loading times and responsiveness
- **Mobile Experience**: Enhance mobile usability
- **Error Handling**: Improve error messages and recovery
- **Accessibility**: Enhance accessibility features

### Medium Priority

- **New Features**: Additional marketplace features
- **API Enhancements**: New endpoints and functionality
- **UI/UX Improvements**: Better user interface design
- **Documentation**: Improve existing documentation

### Low Priority

- **Code Refactoring**: Clean up existing code
- **Test Coverage**: Increase test coverage
- **Performance Monitoring**: Add performance metrics

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Test with the latest version
3. Verify the bug is reproducible

### Bug Report Template

```markdown
**Bug Description** A clear description of the bug.

**Steps to Reproduce**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior** What you expected to happen.

**Actual Behavior** What actually happened.

**Environment**

- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

**Additional Context** Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description** A clear description of the feature you'd like to see.

**Use Case** Describe the problem this feature would solve.

**Proposed Solution** Describe your proposed solution.

**Alternatives** Describe any alternative solutions you've considered.

**Additional Context** Any other context or screenshots about the feature request.
```

## 📝 Documentation

### Code Documentation

- Use JSDoc for functions and classes
- Include inline comments for complex logic
- Update README for significant changes

### API Documentation

- Document all new endpoints
- Include request/response examples
- Update API documentation files

## 🔒 Security

### Security Guidelines

- Never commit sensitive data (passwords, API keys)
- Validate all user inputs
- Follow security best practices
- Report security issues privately

### Reporting Security Issues

Email security issues to: security@livestockclubsa.co.za

## 🏷️ Release Process

### Version Numbering

We follow semantic versioning (SemVer):

- **Major** (X.0.0): Breaking changes
- **Minor** (X.Y.0): New features (backward compatible)
- **Patch** (X.Y.Z): Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

### Communication

- Use clear, concise language
- Provide context for questions
- Be patient with newcomers
- Celebrate contributions

## 📞 Getting Help

### Resources

- **Documentation**: Check the docs folder
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: contact@livestockclubsa.co.za

### Common Issues

- **Build Errors**: Check Node.js version and dependencies
- **Database Issues**: Verify PostgreSQL connection
- **Test Failures**: Run tests individually to isolate issues

## 🙏 Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation
- Community acknowledgments

Thank you for contributing to Livestock Club SA! 🐄
