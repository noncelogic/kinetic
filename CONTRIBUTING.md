# Contributing to Kinetic

Thanks for your interest in contributing! This document outlines how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/noncelogic/kinetic.git
cd kinetic

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Start development
pnpm dev
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/). Each commit message should be structured as:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```
feat(auth): add Google OAuth provider
fix(ui): resolve dark mode contrast issue
docs: update installation instructions
chore(deps): upgrade Next.js to 15.1
```

## Pull Request Process

1. Fork the repo and create a branch from `main`
2. Make your changes following the code style
3. Add tests for new functionality
4. Ensure all tests pass: `pnpm test`
5. Run quality checks: `pnpm lint && pnpm typecheck`
6. Submit a PR with a clear description

## Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint for linting
- Run `pnpm format` before committing

## Questions?

Open a [Discussion](https://github.com/noncelogic/kinetic/discussions) for questions or ideas.
