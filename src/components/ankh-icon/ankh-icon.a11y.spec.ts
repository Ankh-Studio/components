/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
import { axe } from 'vitest-axe';
import type { AxeMatchers } from 'vitest-axe';
import './ankh-icon.js';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T> extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

expect.extend(matchers);

describe('ankh-icon a11y', () => {
  let container: HTMLDivElement;

  const createIcon = async (attrs: Record<string, string> = {}) => {
    const el = document.createElement('ankh-icon');
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    container.appendChild(el);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    return el;
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('decorative icons', () => {
    it('has no a11y violations when used as decorative (no label)', async () => {
      await createIcon({ name: 'home' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('is hidden from the accessibility tree', async () => {
      const el = await createIcon({ name: 'settings' });
      const span = el.querySelector('span.ankh-icon');
      expect(span?.getAttribute('aria-hidden')).toBe('true');
      expect(span?.hasAttribute('role')).toBe(false);
    });
  });

  describe('meaningful icons', () => {
    it('has no a11y violations when used with a label', async () => {
      await createIcon({ name: 'delete', label: 'Delete item' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('is exposed to the accessibility tree with correct role and label', async () => {
      const el = await createIcon({ name: 'close', label: 'Close dialog' });
      const span = el.querySelector('span.ankh-icon');
      expect(span?.getAttribute('role')).toBe('img');
      expect(span?.getAttribute('aria-label')).toBe('Close dialog');
      expect(span?.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  describe('context combinations', () => {
    it('has no a11y violations with filled decorative icon', async () => {
      await createIcon({ name: 'favorite', filled: 'true' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no a11y violations with labeled icon at each size', async () => {
      for (const size of ['sm', 'md', 'lg', 'xl']) {
        container.innerHTML = '';
        await createIcon({ name: 'info', size, label: 'Information' });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });
});
