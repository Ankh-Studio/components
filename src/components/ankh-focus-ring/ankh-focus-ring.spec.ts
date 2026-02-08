import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createElement, createContainer, waitForHydration } from '../../test-utils';
import './ankh-focus-ring.js';

describe('ankh-focus-ring', () => {
  let container: HTMLButtonElement;
  let cleanup: () => void;

  const createFocusRing = async (attrs: Record<string, string> = {}) => {
    const el = await createElement<HTMLElement>('ankh-focus-ring', container, attrs);
    const ring = el.querySelector('.ankh-focus-ring') as HTMLElement | null;
    return { el, ring, parent: container };
  };

  beforeEach(() => {
    ({ container, cleanup } = createContainer('button'));
  });

  afterEach(() => {
    cleanup();
  });

  describe('rendering', () => {
    it('sets aria-hidden="true" for accessibility', async () => {
      const { el } = await createFocusRing();
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders ring element with ankh-focus-ring class', async () => {
      const { ring } = await createFocusRing();
      expect(ring).toBeTruthy();
      expect(ring?.classList.contains('ankh-focus-ring')).toBe(true);
    });

    it('ring is not visible by default', async () => {
      const { ring } = await createFocusRing();
      expect(ring?.classList.contains('ankh-focus-ring--visible')).toBe(false);
    });
  });

  describe('visible prop', () => {
    it('shows ring when visible="true"', async () => {
      const { ring } = await createFocusRing({ visible: 'true' });
      expect(ring?.classList.contains('ankh-focus-ring--visible')).toBe(true);
    });

    it('reflects visible attribute on host', async () => {
      const { el } = await createFocusRing({ visible: 'true' });
      expect(el.hasAttribute('visible')).toBe(true);
    });
  });

  describe('inward prop', () => {
    it('applies inward class when inward="true"', async () => {
      const { ring } = await createFocusRing({ inward: 'true' });
      expect(ring?.classList.contains('ankh-focus-ring--inward')).toBe(true);
    });

    it('reflects inward attribute on host', async () => {
      const { el } = await createFocusRing({ inward: 'true' });
      expect(el.hasAttribute('inward')).toBe(true);
    });

    it('does not apply inward class by default', async () => {
      const { ring } = await createFocusRing();
      expect(ring?.classList.contains('ankh-focus-ring--inward')).toBe(false);
    });
  });

  describe('focus behavior', () => {
    it('hides ring on focusout', async () => {
      const { ring, parent } = await createFocusRing({ visible: 'true' });
      parent.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      await waitForHydration();
      expect(ring?.classList.contains('ankh-focus-ring--visible')).toBe(false);
    });

    it('hides ring on pointerdown', async () => {
      const { ring, parent } = await createFocusRing({ visible: 'true' });
      parent.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      await waitForHydration();
      expect(ring?.classList.contains('ankh-focus-ring--visible')).toBe(false);
    });

    it('shows ring on focusin when parent matches :focus-visible', async () => {
      const { el, ring, parent } = await createFocusRing();
      const originalMatches = parent.matches.bind(parent);
      vi.spyOn(parent, 'matches').mockImplementation((selector: string) => {
        if (selector === ':focus-visible') return true;
        return originalMatches(selector);
      });

      parent.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await waitForHydration();

      expect(ring?.classList.contains('ankh-focus-ring--visible')).toBe(true);
      expect(el.hasAttribute('visible')).toBe(true);
    });

    it('does not show ring on focusin when parent does not match :focus-visible', async () => {
      const { ring, parent } = await createFocusRing();
      const originalMatches = parent.matches.bind(parent);
      vi.spyOn(parent, 'matches').mockImplementation((selector: string) => {
        if (selector === ':focus-visible') return false;
        return originalMatches(selector);
      });

      parent.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await waitForHydration();

      expect(ring?.classList.contains('ankh-focus-ring--visible')).toBe(false);
    });
  });

  describe('lifecycle', () => {
    it('detaches listeners on disconnect', async () => {
      const { el, parent } = await createFocusRing();
      el.remove();
      expect(() => {
        parent.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      }).not.toThrow();
    });
  });
});
