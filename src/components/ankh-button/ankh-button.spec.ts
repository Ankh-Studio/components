import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createElement, createContainer } from '../../test-utils';
import './ankh-button.js';

describe('ankh-button', () => {
  let container: HTMLDivElement;
  let cleanup: () => void;

  const createButton = async (attrs: Record<string, string> = {}, content = '') => {
    const el = await createElement<HTMLElement>('ankh-button', container, attrs, content || undefined);
    const button = el.querySelector('button');
    if (!button) throw new Error('button element not found');
    return { el, button };
  };

  beforeEach(() => {
    ({ container, cleanup } = createContainer());
  });

  afterEach(() => {
    cleanup();
  });

  describe('default rendering', () => {
    it('renders with filled variant by default', async () => {
      const { button } = await createButton();
      expect(button.classList.contains('ankh-btn--filled')).toBe(true);
    });

    it('renders with medium size by default', async () => {
      const { button } = await createButton();
      expect(button.classList.contains('ankh-btn--medium')).toBe(true);
    });

    it('renders with type="button" by default', async () => {
      const { button } = await createButton();
      expect(button.getAttribute('type')).toBe('button');
    });

    it('renders host with ankh-btn-host class', async () => {
      const { el } = await createButton();
      expect(el.classList.contains('ankh-btn-host')).toBe(true);
    });

    it('renders content wrapper span', async () => {
      const { button } = await createButton();
      expect(button.querySelector('.ankh-btn__content')).toBeTruthy();
    });
  });

  describe('sub-components', () => {
    it('includes ankh-focus-ring', async () => {
      const { button } = await createButton();
      expect(button.querySelector('ankh-focus-ring')).toBeTruthy();
    });

    it('includes ankh-ripple', async () => {
      const { button } = await createButton();
      expect(button.querySelector('ankh-ripple')).toBeTruthy();
    });

    it('propagates disabled state to ankh-ripple', async () => {
      const { button } = await createButton({ disabled: 'true' });
      const ripple = button.querySelector('ankh-ripple');
      expect(ripple?.hasAttribute('disabled')).toBe(true);
    });

    it('does not disable ripple when button is enabled', async () => {
      const { button } = await createButton();
      const ripple = button.querySelector('ankh-ripple');
      expect(ripple?.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('slot content', () => {
    it('renders text content in slot', async () => {
      const { el } = await createButton({}, 'Click me');
      expect(el.textContent).toContain('Click me');
    });
  });

  describe('variant prop', () => {
    it.each(['filled', 'outlined', 'text', 'elevated', 'tonal'] as const)(
      'applies ankh-btn--%s class for variant="%s"',
      async (variant) => {
        const { button } = await createButton({ variant });
        expect(button.classList.contains(`ankh-btn--${variant}`)).toBe(true);
      }
    );
  });

  describe('size prop', () => {
    it.each(['small', 'medium', 'large'] as const)(
      'applies ankh-btn--%s class for size="%s"',
      async (size) => {
        const { button } = await createButton({ size });
        expect(button.classList.contains(`ankh-btn--${size}`)).toBe(true);
      }
    );
  });

  describe('type prop', () => {
    it.each(['button', 'submit', 'reset'] as const)(
      'sets type="%s" on native button',
      async (type) => {
        const { button } = await createButton({ type });
        expect(button.getAttribute('type')).toBe(type);
      }
    );
  });

  describe('disabled prop', () => {
    it('disables native button when disabled="true"', async () => {
      const { button } = await createButton({ disabled: 'true' });
      expect(button.disabled).toBe(true);
    });

    it('enables native button when disabled is not set', async () => {
      const { button } = await createButton();
      expect(button.disabled).toBe(false);
    });
  });

  describe('full-width prop', () => {
    it('applies full-width class when full-width="true"', async () => {
      const { button } = await createButton({ 'full-width': 'true' });
      expect(button.classList.contains('ankh-btn--full-width')).toBe(true);
    });

    it('does not apply full-width class by default', async () => {
      const { button } = await createButton();
      expect(button.classList.contains('ankh-btn--full-width')).toBe(false);
    });
  });
});
