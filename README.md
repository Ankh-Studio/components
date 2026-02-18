# @ankh-studio/components

[![Tests](https://github.com/Ankh-Studio/components/actions/workflows/main.yml/badge.svg)](https://github.com/Ankh-Studio/components/actions/workflows/main.yml)

Web Components built with Stencil.js for the Ankh Studio design system.

Built on [@ankh-studio/themes](https://github.com/ankh-studio/themes) - pre-composed CSS themes that include design tokens, reset, and base styles.

## Installation

```bash
npm install @ankh-studio/components
```

## Quick Start

### With a bundler (recommended)

```javascript
import '@ankh-studio/components';
```

### With a script tag

```html
<script type="module" src="https://unpkg.com/@ankh-studio/components"></script>
```

### Include a theme

Components require a theme from `@ankh-studio/themes`:

```css
@import '@ankh-studio/themes/default.css';
```

## Available Components

| Component | Description |
|-----------|-------------|
| `<ankh-button>` | Button with variants: filled, outlined, text, elevated, tonal |
| `<ankh-icon>` | Icon using Material Symbols font, with size and fill variants |
| `<ankh-focus-ring>` | Focus indicator for keyboard navigation |
| `<ankh-ripple>` | Material-style ripple effect |

## Usage

### Button

```html
<ankh-button>Default</ankh-button>
<ankh-button variant="filled">Filled</ankh-button>
<ankh-button variant="outlined">Outlined</ankh-button>
<ankh-button variant="text">Text</ankh-button>
<ankh-button variant="elevated">Elevated</ankh-button>
<ankh-button variant="tonal">Tonal</ankh-button>
```

### Icon

```html
<ankh-icon name="home"></ankh-icon>
<ankh-icon name="favorite" filled></ankh-icon>
<ankh-icon name="settings" size="lg"></ankh-icon>
<ankh-icon name="delete" label="Delete item"></ankh-icon>
```

> Requires the [Material Symbols Outlined](https://fonts.google.com/icons) font to be loaded by the consumer.

#### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `filled` \| `outlined` \| `text` \| `elevated` \| `tonal` | `filled` | Visual style |
| `size` | `small` \| `medium` \| `large` | `medium` | Button size |
| `full-width` | `boolean` | `false` | Take full container width |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `button` \| `submit` \| `reset` | `button` | Button type attribute |

## Framework Integration

Components work in any framework. For better DX, use Stencil's output targets:

- **React**: `@stencil/react-output-target`
- **Angular**: `@stencil/angular-output-target`
- **Vue**: `@stencil/vue-output-target`

## Browser Support

Requires browsers supporting:
- Custom Elements v1
- Shadow DOM v1
- CSS `light-dark()` function (via themes)

**Supported:** Chrome 123+, Safari 17.5+, Firefox 120+

## Documentation

- [Architecture Decision Records](./docs/adr/) - Design decisions and proposals
- [Contributing](./CONTRIBUTING.md) - How to contribute

## Changelog

### 0.1.0-alpha

- Initial release with button, focus-ring, ripple components

## License

MIT
