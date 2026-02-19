# Contributing to OGPlayground

Thank you for your interest in contributing to OGPlayground! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Git

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/ogplayground.git
cd ogplayground
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Development Process

### Branch Naming

- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent fixes
- `docs/*` - Documentation changes
- `refactor/*` - Code refactoring

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `perf` - A code change that improves performance
- `test` - Adding missing tests or correcting existing tests
- `chore` - Changes to the build process or auxiliary tools

Example:

```
feat(editor): add keyboard shortcuts for copy and export

- Add Ctrl+Enter to copy OG tags
- Add Ctrl+S to export as HTML

Closes #123
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable `strict` mode in TypeScript
- Avoid using `any` type
- Use proper type annotations

### React Components

- Use functional components with hooks
- Use proper prop types
- Follow the component naming convention (PascalCase)
- Keep components small and focused
- Use composition over inheritance

### CSS/Tailwind

- Use Tailwind CSS for styling
- Follow the utility-first approach
- Keep styles responsive
- Use dark mode compatible colors

### File Organization

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── *.tsx        # Custom components
└── lib/             # Utility functions
    └── utils.ts     # Common utilities
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Write tests for bug fixes
- Aim for good test coverage
- Use descriptive test names

Example test:

```typescript
describe("parseOGTags", () => {
  it("should parse og:title correctly", () => {
    const html = '<meta property="og:title" content="Test Title" />';
    const result = parseOGTags(html);
    expect(result.title).toBe("Test Title");
  });
});
```

## Pull Request Process

1. Ensure all tests pass before submitting
2. Update documentation as needed
3. Add yourself to the [AUTHORS](AUTHORS) file
4. Fill out the PR template completely
5. Request review from maintainers
6. Address feedback promptly

### PR Title Format

```
<type>: <short description>
```

Examples:

- `feat: Add keyboard shortcuts`
- `fix: Handle invalid OG image URLs`
- `docs: Update README with new features`

## Reporting Bugs

When reporting bugs, please include:

- A clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Error messages

Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) when filing issues.

## Suggesting Features

When suggesting features, please include:

- A clear description of the feature
- Use cases
- Potential implementation approach
- Alternatives considered

Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) when filing issues.

## Questions?

Feel free to open an issue for discussion or reach out to the maintainers.
