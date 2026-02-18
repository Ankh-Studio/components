import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createElement, createContainer, waitForHydration } from '../../test-utils';
import './ankh-icon.js';

describe('ankh-icon', () => {
  let container: HTMLDivElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = createContainer());
  });

  afterEach(() => {
    cleanup();
  });

  describe('default rendering', () => {
    it('renders host with ankh-icon-host class', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      expect(el.classList.contains('ankh-icon-host')).toBe(true);
    });

    it('renders a span with ankh-icon class', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span).toBeTruthy();
      expect(span!.classList.contains('ankh-icon')).toBe(true);
    });

    it('renders the icon name as text content', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'settings' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.textContent).toBe('settings');
    });

    it('renders with md size by default', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon--md')).toBe(true);
    });

    it('does not apply filled class by default', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon--filled')).toBe(false);
    });
  });

  describe('name prop', () => {
    it('renders different icon names', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'favorite' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.textContent).toBe('favorite');
    });

    it('renders multi-word icon names', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'arrow_back' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.textContent).toBe('arrow_back');
    });
  });

  describe('name prop — edge cases', () => {
    it('renders an empty span when name is empty string', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: '' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.textContent).toBe('');
    });

    it('still applies base classes when name is empty', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: '' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon')).toBe(true);
      expect(span!.classList.contains('ankh-icon--md')).toBe(true);
    });

    it('treats empty-name icon as decorative by default', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: '' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.getAttribute('aria-hidden')).toBe('true');
      expect(span!.hasAttribute('role')).toBe(false);
    });
  });

  describe('size prop', () => {
    it.each(['sm', 'md', 'lg', 'xl'] as const)('applies ankh-icon--%s class for size="%s"', async (size) => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', size });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains(`ankh-icon--${size}`)).toBe(true);
    });

    it('falls back to md for an invalid size value', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', size: 'huge' });
      const span = el.querySelector('span.ankh-icon')!;
      expect(span.classList.contains('ankh-icon--md')).toBe(true);
      expect(span.classList.contains('ankh-icon--huge')).toBe(false);
    });

    it('falls back to md when size is set to empty string', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', size: '' });
      const span = el.querySelector('span.ankh-icon')!;
      expect(span.classList.contains('ankh-icon--md')).toBe(true);
    });

    it('only applies one size class at a time', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', size: 'lg' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon--lg')).toBe(true);
      expect(span!.classList.contains('ankh-icon--md')).toBe(false);
      expect(span!.classList.contains('ankh-icon--sm')).toBe(false);
      expect(span!.classList.contains('ankh-icon--xl')).toBe(false);
    });
  });

  describe('filled prop', () => {
    it('applies ankh-icon--filled class when filled is set', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'favorite', filled: 'true' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon--filled')).toBe(true);
    });

    it('does not apply filled class when filled is not set', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'favorite' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon--filled')).toBe(false);
    });

    it('applies filled and size classes together', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'favorite', filled: 'true', size: 'xl' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon--filled')).toBe(true);
      expect(span!.classList.contains('ankh-icon--xl')).toBe(true);
    });
  });

  describe('accessibility — decorative icons (no label)', () => {
    it('sets aria-hidden="true" when no label is provided', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.getAttribute('aria-hidden')).toBe('true');
    });

    it('does not set role when no label is provided', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.hasAttribute('role')).toBe(false);
    });

    it('does not set aria-label when no label is provided', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.hasAttribute('aria-label')).toBe(false);
    });
  });

  describe('accessibility — meaningful icons (with label)', () => {
    it('sets role="img" when label is provided', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', label: 'Home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.getAttribute('role')).toBe('img');
    });

    it('sets aria-label to the provided label', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', label: 'Go to home page' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.getAttribute('aria-label')).toBe('Go to home page');
    });

    it('does not set aria-hidden when label is provided', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', label: 'Home' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  describe('accessibility — whitespace-only labels', () => {
    it('treats whitespace-only label as decorative', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', label: '   ' });
      const span = el.querySelector('span.ankh-icon')!;
      expect(span.getAttribute('aria-hidden')).toBe('true');
      expect(span.hasAttribute('role')).toBe(false);
      expect(span.hasAttribute('aria-label')).toBe(false);
    });

    it('trims label with leading/trailing whitespace', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', label: '  Home  ' });
      const span = el.querySelector('span.ankh-icon')!;
      expect(span.getAttribute('role')).toBe('img');
      expect(span.getAttribute('aria-label')).toBe('Home');
    });
  });

  describe('accessibility — dynamic label changes', () => {
    it('transitions from decorative to meaningful when label is added', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      el.setAttribute('label', 'Home page');
      await waitForHydration();
      const span = el.querySelector('span.ankh-icon')!;
      expect(span.getAttribute('role')).toBe('img');
      expect(span.getAttribute('aria-label')).toBe('Home page');
      expect(span.hasAttribute('aria-hidden')).toBe(false);
    });

    it('transitions from meaningful to decorative when label is removed', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', label: 'Home page' });
      el.removeAttribute('label');
      await waitForHydration();
      const span = el.querySelector('span.ankh-icon')!;
      expect(span.getAttribute('aria-hidden')).toBe('true');
      expect(span.hasAttribute('role')).toBe(false);
      expect(span.hasAttribute('aria-label')).toBe(false);
    });
  });

  describe('class composition', () => {
    it('always includes ankh-icon base class', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'home', size: 'sm', filled: 'true' });
      const span = el.querySelector('span.ankh-icon');
      expect(span!.classList.contains('ankh-icon')).toBe(true);
    });

    it('composes size, filled, and base classes correctly', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'star', size: 'lg', filled: 'true' });
      const span = el.querySelector('span.ankh-icon');
      const classes = Array.from(span!.classList);
      expect(classes).toContain('ankh-icon');
      expect(classes).toContain('ankh-icon--lg');
      expect(classes).toContain('ankh-icon--filled');
      expect(classes).toHaveLength(3);
    });
  });
});
