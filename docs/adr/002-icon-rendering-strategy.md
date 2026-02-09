# ADR-002: Icon Rendering Strategy

**Status:** Accepted
**Date:** 2026-02-08

## Context

We need an `ankh-icon` component to render icons consistently across the design system. The two viable strategies are:

1. **Variable icon font** (Material Symbols) — a single WOFF2 file with ligature-based glyph resolution and four OpenType variation axes: fill, weight, grade, and optical size.
2. **Inline SVG** — per-icon imports, a sprite sheet, or an icon registry, rendered as `<svg>` elements in the DOM.

The core tension is **developer ergonomics and design-axis control** (font) vs **payload precision and offline resilience** (SVG).

## Decision

**Use Material Symbols icon font (Outlined) as the rendering strategy.**

### Why font over SVG

**1. A single font file provides filled and outlined variants from one source.**
SVG requires two separate files per icon (or a complex path-swap mechanism). The font's `FILL` variation axis (`0` = outlined, `1` = filled) toggles between variants without switching glyph sources, doubling payload, or requiring a build-time icon variant resolver.

**2. Optical sizing preserves visual clarity across the size scale.**
The `opsz` variation axis (continuous 20–48) adjusts stroke weight and counter proportions to match the rendered size. A 48px icon uses thinner relative strokes than an 18px icon, preventing visual heaviness at large sizes and ensuring legibility at small sizes. SVGs scale geometrically — a single SVG path rendered at 18px and 48px has identical stroke-to-body proportions, which is optically incorrect at both extremes.

**3. Ligature resolution means zero JavaScript overhead for icon selection.**
The icon name (e.g. `home`, `settings`) is rendered as text content. The font's OpenType `liga` feature maps the string to the correct glyph at render time. No JS icon registry, no dynamic imports, no build-time tree-shaking configuration. This is particularly valuable because our component uses `shadow: false` (light DOM) — the text content is plainly readable in the DOM and debuggable without tooling.

**4. Color theming works via `currentColor` with no component-level plumbing.**
The font glyph inherits `color` from the cascade. No SVG `fill` attribute management, no passing color tokens through props, no theme-aware style injection. The icon automatically follows whatever color the parent sets.

**5. Developer experience is simpler — pass a string, get an icon.**
No imports per icon, no sprite setup, no icon registry to configure. The full Material Symbols set (~2,500+ icons) is available from the name prop alone after the font is loaded.

**Where SVG would win (and why we accept the trade-off):**
- **Payload precision**: SVG allows shipping only the icons actually used. The font file is ~3–5 MB WOFF2 regardless. For our design system, where consumers typically use dozens of icons across an application, the font's one-time cache cost is acceptable.
- **Offline resilience**: SVGs are inline and available without font loading. Acceptable trade-off — the font caches after first load and `font-display: block` prevents FOIT for subsequent visits.
- **Custom icons**: SVG supports non-Material icons. If custom icon support is needed later, we can extend the component to accept SVG children alongside font-rendered icons.

### How it works

| Concern | Implementation |
|---------|---------------|
| **Icon selection (`name`)** | Ligature resolution — icon name rendered as text, font `liga` feature converts to glyph. |
| **Filled vs outlined (`filled`)** | `font-variation-settings` `FILL` axis: `0` = outlined, `1` = filled. Composed via private CSS custom properties to avoid axis override conflicts. |
| **Sizing (`size`)** | Maps to `--icon-size-sm/md/lg/xl` tokens from `@ankh-studio/tokens`. Optical size axis tracks rendered size for correct visual weight. |
| **Color** | `color: currentColor`. Inherits from parent, no hardcoded palette references. |
| **Font loading** | Consumer responsibility. The component sets `font-family` but does not bundle font files. |

### Font axis composition

`font-variation-settings` is an all-or-nothing property — a later declaration replaces all axes, not just one. To let size and fill classes compose without overriding each other, we use private CSS custom properties per axis:

```css
.ankh-icon {
  --_fill: 0;
  --_opsz: 24;
  font-variation-settings: 'FILL' var(--_fill), 'wght' 400, 'GRAD' 0, 'opsz' var(--_opsz);
}
.ankh-icon--filled { --_fill: 1; }
.ankh-icon--lg { --_opsz: 40; }
```

This pattern avoids the common pitfall where `.ankh-icon--filled` would accidentally reset `opsz` to its default.

## Consequences

- **Consumer must load the font.** The component does not self-load Material Symbols. A future `@ankh-studio/icons` package (or documentation) should provide the recommended import path.
- **Full icon set in one file.** No tree-shaking — acceptable for a design system where many icons are expected across an application.
- **No build-time name validation.** Typos in icon names render as blank text. The component does not ship a name registry; correctness is a consumer responsibility.
- **Single font style (Outlined) for v1.** If `Rounded` or `Sharp` styles are needed, a `style` prop can be added in a follow-up without breaking changes.

## Open Questions

- [ ] Should we provide a `@ankh-studio/icons` package that bundles/re-exports the Material Symbols font CSS?
- [ ] Should `weight` and `grade` be exposed as props? (Deferred — keep API minimal for v1.)
