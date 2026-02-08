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

## Testing

We use [vitest](https://vitest.dev/) with [happy-dom](https://github.com/nicedayfor/happy-dom) for unit tests.

```bash
npm test            # Run all tests once (CI mode)
npm run test:watch  # Run in watch mode during development
npm run test:ui     # Open the vitest UI
```

Test files live alongside components as `*.spec.ts` or `*.test.ts` files in `src/components/ankh-{name}/`. Every component should have tests covering its props, events, and rendered output. Tests run automatically in CI on every pull request and must pass before merge.

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
