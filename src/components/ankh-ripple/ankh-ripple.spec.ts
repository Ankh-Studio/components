import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './ankh-ripple.js';

const mockAnimation = {
  cancel: vi.fn(),
  finish: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  onfinish: null,
  oncancel: null,
  finished: Promise.resolve(),
};

describe('ankh-ripple', () => {
  let container: HTMLDivElement;
  let originalAnimate: typeof Element.prototype.animate | undefined;

  const createRipple = async (attrs: Record<string, string> = {}) => {
    const el = document.createElement('ankh-ripple');
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    container.appendChild(el);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const surface = el.querySelector('.ankh-ripple') as HTMLElement | null;
    return { el, surface, parent: container };
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    originalAnimate = Element.prototype.animate;
    Element.prototype.animate = vi.fn().mockReturnValue(mockAnimation) as typeof Element.prototype.animate;
  });

  afterEach(() => {
    container.remove();
    if (originalAnimate) {
      Element.prototype.animate = originalAnimate;
    } else {
      // @ts-expect-error - deleting non-standard property
      delete Element.prototype.animate;
    }
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('sets aria-hidden="true" for accessibility', async () => {
      const { el } = await createRipple();
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders surface element with ankh-ripple class', async () => {
      const { surface } = await createRipple();
      expect(surface).toBeTruthy();
      expect(surface?.classList.contains('ankh-ripple')).toBe(true);
    });

    it('reflects disabled attribute when set', async () => {
      const { el } = await createRipple({ disabled: 'true' });
      expect(el.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('hover behavior', () => {
    it('adds hovered class on pointerenter', async () => {
      const { surface, parent } = await createRipple();
      parent.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--hovered')).toBe(true);
    });

    it('removes hovered class on pointerleave', async () => {
      const { surface, parent } = await createRipple();
      parent.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      parent.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--hovered')).toBe(false);
    });

    it('does not add hovered class when disabled', async () => {
      const { surface, parent } = await createRipple({ disabled: 'true' });
      parent.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--hovered')).toBe(false);
    });
  });

  describe('press behavior (mouse/pen)', () => {
    it('adds pressed class on pointerdown', async () => {
      const { surface, parent } = await createRipple();
      parent.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, pointerType: 'mouse' })
      );
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--pressed')).toBe(true);
    });

    it('does not respond to non-primary pointer', async () => {
      const { surface, parent } = await createRipple();
      parent.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, isPrimary: false, pointerType: 'mouse' })
      );
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--pressed')).toBe(false);
    });

    it('does not add pressed class when disabled', async () => {
      const { surface, parent } = await createRipple({ disabled: 'true' });
      parent.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, pointerType: 'mouse' })
      );
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--pressed')).toBe(false);
    });

    it('calls animate API when pressed', async () => {
      const { parent } = await createRipple();
      parent.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, pointerType: 'mouse' })
      );
      await new Promise((r) => requestAnimationFrame(r));
      expect(Element.prototype.animate).toHaveBeenCalled();
    });
  });

  describe('press behavior (touch)', () => {
    it('does not immediately press on touch (has delay)', async () => {
      const { surface, parent } = await createRipple();
      parent.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, pointerType: 'touch' })
      );
      expect(surface?.classList.contains('ankh-ripple--pressed')).toBe(false);
    });

    it('resets state on pointercancel', async () => {
      const { surface, parent } = await createRipple();
      parent.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, pointerType: 'mouse' })
      );
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--pressed')).toBe(true);

      parent.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 250));
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--pressed')).toBe(false);
    });
  });

  describe('click behavior', () => {
    it('does not add pressed class on click when disabled', async () => {
      const { surface, parent } = await createRipple({ disabled: 'true' });
      parent.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--pressed')).toBe(false);
    });

    it('handles keyboard activation (click without pointer) without error', async () => {
      const { parent } = await createRipple();
      expect(() => {
        parent.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }).not.toThrow();
    });
  });

  describe('context menu', () => {
    it('resets hover state on contextmenu', async () => {
      const { surface, parent } = await createRipple();
      parent.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--hovered')).toBe(true);

      parent.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      expect(surface?.classList.contains('ankh-ripple--hovered')).toBe(false);
    });

    it('cancels animation on contextmenu', async () => {
      const { parent } = await createRipple();

      parent.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, pointerType: 'mouse' })
      );
      await new Promise((r) => requestAnimationFrame(r));

      parent.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 250));

      expect(mockAnimation.cancel).toHaveBeenCalled();
    });
  });

  describe('lifecycle', () => {
    it('detaches listeners on disconnect', async () => {
      const { el, parent } = await createRipple();
      el.remove();
      expect(() => {
        parent.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      }).not.toThrow();
    });
  });
});
