import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './ankh-icon.js';

describe('ankh-icon', () => {
  let container: HTMLDivElement;

  const createIcon = async (attrs: Record<string, string> = {}) => {
    const el = document.createElement('ankh-icon');
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    container.appendChild(el);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const span = el.querySelector('span.ankh-icon');
    if (!span) throw new Error('icon span not found');
    return { el, span };
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('default rendering', () => {
    it('renders host with ankh-icon-host class', async () => {
      const { el } = await createIcon({ name: 'home' });
      expect(el.classList.contains('ankh-icon-host')).toBe(true);
    });

    it('renders a span with ankh-icon class', async () => {
      const { span } = await createIcon({ name: 'home' });
      expect(span).toBeTruthy();
      expect(span.classList.contains('ankh-icon')).toBe(true);
    });

    it('renders with material-symbols-outlined class', async () => {
      const { span } = await createIcon({ name: 'home' });
      expect(span.classList.contains('material-symbols-outlined')).toBe(true);
    });

    it('renders the icon name as text content', async () => {
      const { span } = await createIcon({ name: 'settings' });
      expect(span.textContent).toBe('settings');
    });

    it('renders with md size by default', async () => {
      const { span } = await createIcon({ name: 'home' });
      expect(span.classList.contains('ankh-icon--md')).toBe(true);
    });

    it('does not apply filled class by default', async () => {
      const { span } = await createIcon({ name: 'home' });
      expect(span.classList.contains('ankh-icon--filled')).toBe(false);
    });
  });

  describe('name prop', () => {
    it('renders different icon names', async () => {
      const { span } = await createIcon({ name: 'favorite' });
      expect(span.textContent).toBe('favorite');
    });

    it('renders multi-word icon names', async () => {
      const { span } = await createIcon({ name: 'arrow_back' });
      expect(span.textContent).toBe('arrow_back');
    });
  });

  describe('size prop', () => {
    it.each(['sm', 'md', 'lg', 'xl'] as const)('applies ankh-icon--%s class for size="%s"', async (size) => {
      const { span } = await createIcon({ name: 'home', size });
      expect(span.classList.contains(`ankh-icon--${size}`)).toBe(true);
    });

    it('only applies one size class at a time', async () => {
      const { span } = await createIcon({ name: 'home', size: 'lg' });
      expect(span.classList.contains('ankh-icon--lg')).toBe(true);
      expect(span.classList.contains('ankh-icon--md')).toBe(false);
      expect(span.classList.contains('ankh-icon--sm')).toBe(false);
      expect(span.classList.contains('ankh-icon--xl')).toBe(false);
    });
  });

  describe('filled prop', () => {
    it('applies ankh-icon--filled class when filled is set', async () => {
      const { span } = await createIcon({ name: 'favorite', filled: 'true' });
      expect(span.classList.contains('ankh-icon--filled')).toBe(true);
    });

    it('does not apply filled class when filled is not set', async () => {
      const { span } = await createIcon({ name: 'favorite' });
      expect(span.classList.contains('ankh-icon--filled')).toBe(false);
    });

    it('applies filled and size classes together', async () => {
      const { span } = await createIcon({ name: 'favorite', filled: 'true', size: 'xl' });
      expect(span.classList.contains('ankh-icon--filled')).toBe(true);
      expect(span.classList.contains('ankh-icon--xl')).toBe(true);
    });
  });

  describe('accessibility — decorative icons (no label)', () => {
    it('sets aria-hidden="true" when no label is provided', async () => {
      const { span } = await createIcon({ name: 'home' });
      expect(span.getAttribute('aria-hidden')).toBe('true');
    });

    it('does not set role when no label is provided', async () => {
      const { span } = await createIcon({ name: 'home' });
      expect(span.hasAttribute('role')).toBe(false);
    });

    it('does not set aria-label when no label is provided', async () => {
      const { span } = await createIcon({ name: 'home' });
      expect(span.hasAttribute('aria-label')).toBe(false);
    });
  });

  describe('accessibility — meaningful icons (with label)', () => {
    it('sets role="img" when label is provided', async () => {
      const { span } = await createIcon({ name: 'home', label: 'Home' });
      expect(span.getAttribute('role')).toBe('img');
    });

    it('sets aria-label to the provided label', async () => {
      const { span } = await createIcon({ name: 'home', label: 'Go to home page' });
      expect(span.getAttribute('aria-label')).toBe('Go to home page');
    });

    it('does not set aria-hidden when label is provided', async () => {
      const { span } = await createIcon({ name: 'home', label: 'Home' });
      expect(span.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  describe('class composition', () => {
    it('always includes ankh-icon and material-symbols-outlined', async () => {
      const { span } = await createIcon({ name: 'home', size: 'sm', filled: 'true' });
      expect(span.classList.contains('ankh-icon')).toBe(true);
      expect(span.classList.contains('material-symbols-outlined')).toBe(true);
    });

    it('composes size, filled, and base classes correctly', async () => {
      const { span } = await createIcon({ name: 'star', size: 'lg', filled: 'true' });
      const classes = Array.from(span.classList);
      expect(classes).toContain('ankh-icon');
      expect(classes).toContain('material-symbols-outlined');
      expect(classes).toContain('ankh-icon--lg');
      expect(classes).toContain('ankh-icon--filled');
      expect(classes).toHaveLength(4);
    });
  });
});
