# ADR-001: Component Architecture Decisions

**Status:** Proposed
**Date:** 2026-02-08

## Context

We're building a web component library on Stencil (≥ 4.12) that consumes `@ankh-studio/tokens` for structure and `@ankh-studio/themes` for color. The tokens ADR ([001-design-intentions](https://github.com/Ankh-Studio/tokens/blob/main/docs/adr/001-design-intentions.md)) establishes cognitive contexts (Expressive, Focus, Intense). The themes ADR ([001-themes-architecture](https://github.com/Ankh-Studio/themes/blob/main/docs/adr/001-themes-architecture.md)) establishes themes as a composable color layer with the cascade order `@layer reset, tokens, intention, palette, base`.

Components sit on top of both. They need to:

- Consume design tokens without fighting the cascade
- Expose a predictable styling API to consumers
- Participate in HTML forms like native elements
- Be testable without a browser
- Compose cleanly with each other and with consumer markup

These decisions affect every component we build. Getting them wrong early means rewriting later.

## Non-goals

- **Visual regression testing** — planned future addition with browser-based screenshot comparison; not in scope for this ADR
- **Server-side rendering** — components target client-side environments only
- **Framework-specific wrappers** — no React/Vue/Angular output targets committed to yet
- **Legacy browser support** — minimum targets are Chrome 123+, Safari 17.5+, Firefox 120+

## Decisions

### 1. Shadow DOM: Off

All components use `shadow: false`.

```ts
@Component({
  tag: 'ankh-button',
  styleUrl: 'ankh-button.css',
  shadow: false,
})
```

**Why:**

Theme tokens are delivered as CSS custom properties on `:root` via `@layer`. Shadow DOM creates a boundary that complicates this inheritance. With `shadow: false`:

- Token custom properties cascade naturally into component internals
- Theme switching works without piercing (`::part`, `::slotted`) or duplication
- Child components (`ankh-ripple` inside `ankh-button`) share the same styling context
- Consumer overrides work through normal specificity, not shadow DOM escape hatches

**Trade-off:** We lose style encapsulation. Consumer stylesheets can target component internals. We mitigate this with the guardrails below and the `@layer components` cascade layer, which gives components a defined specificity position.

**Light DOM guardrails:**

Because all component markup lives in the light DOM, we enforce these rules to reduce collision risk:

1. **Class-scoped selectors only.** Every selector in component CSS must include at least one class prefixed by the component name. The sole exception is the component's own host-element tag selector used to set display behavior (e.g., `ankh-ripple { display: contents }`). Bare tag selectors, bare attribute selectors, and universal selectors (`*`) are prohibited.
2. **Public surface vs. unstable internals.** The component's host element tag (`<ankh-button>`) and its public custom properties (`--ankh-button-*`) are the stable public surface. Consumers may target these freely. Internal class names (`.ankh-btn`, `.ankh-btn__content`) and private custom properties (`--_*`) are unstable internals — consumers must not target them, and we may change them without a major version bump.
3. **No global resets.** Component CSS must not set styles on `html`, `body`, or any element outside its own scoped class tree.
4. **Attribute selectors scope to host.** When a component reads an attribute (e.g., `[full-width]`), the selector must be scoped to the host class: `.ankh-btn-host[full-width]`, never bare `[full-width]`.

**When to reconsider:** If we encounter persistent style collision problems that scoped naming can't solve, or if browser support for `@layer` inside shadow DOM matures to the point where token inheritance becomes trivial.

### 2. CSS Custom Property API

Components expose a public styling API through custom properties following a three-level fallback pattern:

```
--ankh-{component}-{property}  →  theme token  →  hardcoded fallback
```

**Public API properties** use the `--ankh-` prefix:

```css
--ankh-ripple-hover-color: var(--color-on-surface, currentColor);
--ankh-ripple-hover-opacity: 0.08;
--ankh-focus-ring-radius: var(--radius-full, 9999px);
```

**Private properties** use the `--_` prefix for internal component state. These are not part of the public API and may change without notice:

```css
:host {
  --_bg: var(--color-surface, oklch(98% 0 0deg));
  --_fg: var(--color-on-surface, oklch(10% 0 0deg));
}
```

**Variant classes** override private properties:

```css
.ankh-btn--filled {
  --_bg: var(--color-primary, oklch(35% 0 0deg));
  --_fg: var(--color-on-primary, oklch(100% 0 0deg));
}
```

**Cross-component communication** happens through public API properties. A parent sets a child's public properties:

```css
.ankh-btn {
  --ankh-ripple-hover-color: var(--_state-layer);
  --ankh-ripple-pressed-color: var(--_state-layer);
  --ankh-focus-ring-radius: var(--radius-full, 9999px);
}
```

**Property taxonomy:**

Public custom properties fall into three categories. New properties must follow these naming patterns:

| Category | Naming pattern | Examples |
|----------|---------------|----------|
| **Layout** | `--ankh-{component}-{property}` | `--ankh-button-radius`, `--ankh-button-gap` |
| **Color** | `--ankh-{component}-{role}-color` | `--ankh-button-container-color`, `--ankh-button-content-color`, `--ankh-button-outline-color` |
| **State layer** | `--ankh-{component}-{state}-{property}` | `--ankh-ripple-hover-color`, `--ankh-ripple-hover-opacity`, `--ankh-ripple-pressed-color` |

**Rule: expose semantic roles, not palette tokens.** Public properties use role names (`container-color`, `content-color`, `outline-color`), never theme token names (`primary`, `on-primary`). Internally, private vars resolve roles to tokens — but the consumer-facing API is decoupled from the palette. This means a consumer can write `--ankh-button-container-color: teal` without needing to know which token the component maps to by default.

**Scoped class naming** follows a BEM-like pattern using the component name as block:

```
.ankh-btn              /* block */
.ankh-btn__content     /* element */
.ankh-btn--filled      /* modifier */
.ankh-btn--sm          /* modifier */
```

This scoping is our primary defense against style leakage without shadow DOM.

### 3. Cascade Layer

Components declare their styles in `@layer components`:

```css
@layer components {
  .ankh-btn { /* ... */ }
}
```

This positions component styles after the theme layers (`reset, tokens, intention, palette, base, components`), ensuring tokens and themes are resolved before component styles apply. Consumer styles outside any layer will override component defaults, which is the desired behavior for customization.

**Consumer overrides:**

Consumers can override component styles in three ways, from simplest to most controlled:

1. **Unlayered CSS (recommended).** Write normal CSS targeting the host element tag or public custom properties. Per the cascade spec, unlayered styles beat all layered styles, so overrides work without specificity battles:
   ```css
   ankh-button { --ankh-button-container-color: teal; }
   ```
2. **Custom properties on a parent.** Set `--ankh-{component}-*` properties on any ancestor; they cascade into the component naturally.
3. **App-level layers.** If the consuming application uses its own `@layer` declarations, it should declare them after `components`:
   ```css
   @layer reset, tokens, intention, palette, base, components, app;
   ```
   This ensures app-layer overrides resolve after component defaults while still participating in a predictable layer order.

### 4. Form Participation

Form components use one of two strategies depending on whether a native form element can serve as the inner control.

**Strategy A — Native input wrapper** for components that wrap a standard form element (checkbox, radio, switch, text field, select, textarea):

```tsx
<input
  type="checkbox"
  class="ankh-checkbox__input"
  checked={this.checked}
  disabled={this.disabled}
  name={this.name}
  value={this.value}
/>
```

Why: the native element handles form data serialization, browser validation, autofill, and accessibility for free. The custom element is a styling and behavior wrapper around a control the browser already understands.

**Strategy B — Form-associated custom element (FACE)** for controls with no native equivalent (e.g., rating, color picker, multi-select combobox, date range):

```ts
@Component({
  tag: 'ankh-rating',
  styleUrl: 'ankh-rating.css',
  shadow: false,
  formAssociated: true,
})
export class AnkhRating {
  @Element() el!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  @Prop() name: string;
  @Prop() value: number;

  setValue(v: number) {
    this.value = v;
    this.internals.setFormValue(String(v));
  }
}
```

Why: `ElementInternals` is the standards-track API for custom element form participation. It provides `setFormValue()`, `setValidity()`, and form lifecycle callbacks (`formResetCallback`, `formStateRestoreCallback`). `attachInternals()` does **not** require shadow DOM — it works identically with `shadow: false`. Stencil supports the `formAssociated` component option and the `@AttachInternals()` decorator as of v4.12.

**When to use which:**

| Has native equivalent? | Strategy | Example components |
|------------------------|----------|-------------------|
| Yes | A — native input wrapper | checkbox, radio, switch, text-field, select |
| No | B — FACE via `attachInternals` | rating, color-picker, date-range |

**Stable public prop API:** Both strategies expose the same props to consumers: `name`, `value`, `checked` (where applicable), `disabled`, `required`. The internal mechanism differs but the component's attribute interface does not.

**Minimum Stencil version:** `formAssociated` and `@AttachInternals()` require Stencil ≥ 4.12. Our current dependency (`^4.27.1`) satisfies this.

### 5. Testing Strategy

**Stack:** Vitest + happy-dom, with vitest-axe (axe-core) for accessibility audits.

**File convention:** Tests are co-located with their component:

```
src/components/ankh-button/
  ankh-button.tsx
  ankh-button.css
  ankh-button.spec.ts        ← unit/interaction tests (happy-dom)
  ankh-button.a11y.spec.ts   ← accessibility audits (jsdom)
```

Accessibility tests live in separate `*.a11y.spec.ts` files because axe-core requires jsdom. These files use a per-file environment override (`// @vitest-environment jsdom`) while the rest of the suite runs on happy-dom for speed.

**Shared test harness** (`src/test-utils/`):

All specs use a shared harness for component creation, async rendering, and common mocking. This prevents each spec from reinventing setup/teardown:

```ts
import { createElement, createContainer, waitForHydration } from '../../test-utils';
```

Key exports:

| Helper | Purpose |
|--------|---------|
| `waitForHydration()` | Waits one animation frame for Stencil's async rendering to settle |
| `createElement(tag, container, attrs?, content?)` | Creates a component, sets attributes, appends to container, waits for hydration |
| `createContainer(tag?)` | Creates a container element on `document.body`; returns `{ container, cleanup }` |
| `polyfillAnimate()` | Mocks `Element.prototype.animate` for happy-dom; returns `{ mockAnimation, restore }` |
| `wait(ms)` | Waits a given number of milliseconds (for debounce/timeout tests) |

Per-component specs build on this by querying for their own inner elements:

```ts
import { createElement, createContainer, waitForHydration } from '../../test-utils';
import './ankh-button.js';

describe('ankh-button', () => {
  let container: HTMLDivElement;
  let cleanup: () => void;

  const createButton = async (attrs?: Record<string, string>, content?: string) => {
    const el = await createElement<HTMLElement>('ankh-button', container, attrs, content);
    const button = el.querySelector('button');
    if (!button) throw new Error('button element not found');
    return { el, button };
  };

  beforeEach(() => { ({ container, cleanup } = createContainer()); });
  afterEach(() => { cleanup(); });
});
```

**Required test categories for every component:**

| Category | What it covers |
|----------|---------------|
| **Rendering** | Default state, attribute reflection, class names |
| **Props** | Each prop value produces correct DOM output |
| **Variants** | Each visual variant (use `it.each` for exhaustive coverage) |
| **Slots** | Content projection into correct positions |
| **Interaction** | User events produce correct state changes |
| **Composition** | Child components render and receive correct props |
| **Cleanup** | Event listeners removed on disconnect |
| **Accessibility** | ARIA attributes, roles, axe-core audit passes |

**Accessibility testing with vitest-axe:**

Accessibility audits use `vitest-axe` (a vitest-native fork of jest-axe) and run under jsdom:

```ts
// @vitest-environment jsdom
import * as matchers from 'vitest-axe/matchers';
import { axe } from 'vitest-axe';

expect.extend(matchers);

it('has no axe violations with default props', async () => {
  const { el } = await createButton({}, 'Click me');
  const results = await axe(el);
  expect(results).toHaveNoViolations();
});
```

**Mocking conventions:**

- Mock Web Animations API (`Element.prototype.animate`) for ripple/transition tests
- Spy on `:focus-visible` via `Element.prototype.matches` for focus-ring tests
- Simulate events with constructors (`new PointerEvent()`, `new FocusEvent()`) rather than `.click()`

### 6. Slot Naming Conventions

Components use `<slot>` for content projection. Slot names follow a consistent vocabulary:

| Slot name | Purpose | Example |
|-----------|---------|---------|
| *(default)* | Primary content | Button label, card body |
| `leading` | Before primary content | Leading icon in a button |
| `trailing` | After primary content | Trailing icon, badge, status indicator |
| `media` | Visual/image content | Card hero image |
| `actions` | Interactive controls only (buttons, links, toggles) | Card footer buttons |
| `headline` | Primary text | List item title |
| `supporting-text` | Secondary text | List item description |

`actions` is reserved for interactive controls. Non-interactive trailing content (badges, status indicators, metadata) belongs in `trailing` or a component-specific named slot.

**Rules:**

- Prefer the default slot when a component has one primary content area
- Use named slots when a component has multiple distinct content regions
- Slot names are kebab-case and describe the role, not the element (`leading` not `icon`, because the consumer might put anything there)
- Document available slots in the component's readme (auto-generated by Stencil's `docs-readme` output target)

**Composition with child components:**

Components like `ankh-ripple` and `ankh-focus-ring` are composed as siblings or wrappers, not slotted. They use `display: contents` to remove themselves from layout flow:

```tsx
<button class="ankh-btn">
  <ankh-ripple></ankh-ripple>
  <ankh-focus-ring></ankh-focus-ring>
  <span class="ankh-btn__content">
    <slot></slot>
  </span>
</button>
```

### 7. Accessibility Baseline

Every component must meet WCAG 2.2 AA. Specific requirements:

- **Focus indication:** All interactive components include `ankh-focus-ring` which activates on `:focus-visible`
- **Motion:** Animations respect `prefers-reduced-motion: reduce` by disabling or shortening transitions
- **High contrast:** Components degrade gracefully under `forced-colors: active` using system color keywords
- **ARIA:** Use native semantics first. Only add ARIA attributes when the native element doesn't convey the role (e.g., `aria-hidden="true"` on decorative child components like ripple)
- **Color contrast:** Token fallbacks maintain minimum 4.5:1 contrast ratio for text, 3:1 for interactive boundaries

**Verification:** WCAG 2.2 AA compliance is verified through two mechanisms: (1) automated axe-core audits run in every component's test suite (see Decision 5), catching structural issues (missing labels, invalid ARIA, contrast violations); and (2) manual keyboard and screen-reader checks performed before a component is marked stable, catching interaction issues (focus order, announcement quality) that automated tooling cannot detect.

## Consequences

### Positive

- Token cascade works without shadow DOM workarounds
- Three-level CSS API gives consumers control without breaking internals
- Enforced light DOM guardrails (class-scoped selectors, public/internal boundary) reduce collision risk without shadow DOM
- Native inputs for standard form controls give free browser features; FACE via `attachInternals` covers non-native controls without compromising the shadow DOM decision
- Shared test harness ensures consistent rendering and teardown across all specs
- Consistent slot vocabulary reduces learning curve across components

### Negative

- No shadow DOM encapsulation — relies on naming discipline and PR review to enforce guardrails
- Two form participation strategies (native input wrapper vs. FACE) increase contributor cognitive load
- happy-dom doesn't perfectly replicate browser rendering — some edge cases require manual browser testing

### Neutral

- These decisions align with the gestalt reference implementation, which simplifies porting
- The cascade layer position (`components`) is additive — themes don't need to change their existing layer order, just declare the additional layer
- The semantic-role naming convention for custom properties may require renaming some existing properties as the library grows

## Open Questions

- [ ] Should we lint for `@layer components` wrapping in component CSS?
- [ ] Should we lint for bare tag selectors in component CSS (enforcing guardrail 1)?
- [ ] What coverage threshold should be enforced in CI?
- [ ] When do we migrate existing custom properties (e.g., `--ankh-ripple-hover-color`) to the semantic-role naming convention (`container-color` / `content-color`)?
