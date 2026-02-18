import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
import { axe } from 'vitest-axe';
import type { AxeMatchers } from 'vitest-axe';
import { createElement, createContainer } from '../../test-utils';
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
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = createContainer());
  });

  afterEach(() => {
    cleanup();
  });

  describe('decorative icons', () => {
    it('has no a11y violations when used as decorative (no label)', async () => {
      await createElement<HTMLElement>('ankh-icon', container, { name: 'home' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('is hidden from the accessibility tree', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'settings' });
      const span = el.querySelector('span.ankh-icon');
      expect(span?.getAttribute('aria-hidden')).toBe('true');
      expect(span?.hasAttribute('role')).toBe(false);
    });
  });

  describe('meaningful icons', () => {
    it('has no a11y violations when used with a label', async () => {
      await createElement<HTMLElement>('ankh-icon', container, { name: 'delete', label: 'Delete item' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('is exposed to the accessibility tree with correct role and label', async () => {
      const el = await createElement<HTMLElement>('ankh-icon', container, { name: 'close', label: 'Close dialog' });
      const span = el.querySelector('span.ankh-icon');
      expect(span?.getAttribute('role')).toBe('img');
      expect(span?.getAttribute('aria-label')).toBe('Close dialog');
      expect(span?.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  describe('context combinations', () => {
    it('has no a11y violations with filled decorative icon', async () => {
      await createElement<HTMLElement>('ankh-icon', container, { name: 'favorite', filled: 'true' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no a11y violations with labeled icon at each size', async () => {
      for (const size of ['sm', 'md', 'lg', 'xl']) {
        container.innerHTML = '';
        await createElement<HTMLElement>('ankh-icon', container, { name: 'info', size, label: 'Information' });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });
});
