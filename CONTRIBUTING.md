# Contributing

Thanks for your interest in contributing to @ankh-studio/components.

## Setup

```bash
git clone https://github.com/ankh-studio/components.git
cd components
nvm use
npm install
```

## Development

```bash
npm start       # Dev server with hot reload
npm run build   # Production build
npm test        # Run tests
npm run lint    # Check code style
```

## Making Changes

1. Create a branch from `main`
2. Make your changes in `src/`
3. Run `npm run lint` and `npm run build`
4. Run `npm test` to ensure tests pass
5. Submit a pull request

## Code Style

- TypeScript for component logic
- CSS custom properties for styling (use tokens from `@ankh-studio/themes`)
- Follow existing naming conventions (`ankh-*` prefix)
- Run linter before committing

## Component Structure

Each component should:

1. Live in `src/components/ankh-{name}/`
2. Include `.tsx`, `.css`, and test files
3. Use JSDoc comments for props (generates documentation)
4. Compose with existing primitives (focus-ring, ripple) where appropriate

## Design Decisions

Significant changes should be discussed first. For new components or architectural changes, consider proposing an [ADR](./docs/adr/).

## Questions

Open an issue for discussion before starting large changes.
