// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import '@/test-utils/a11y';
import { createElement, createContainer } from '@/test-utils';
import './ankh-ripple.js';

describe('ankh-ripple accessibility', () => {
  let container: HTMLButtonElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = createContainer('button'));
    container.setAttribute('aria-label', 'Test button');
  });

  afterEach(() => {
    cleanup();
  });

  it('has no axe violations (decorative, aria-hidden)', async () => {
    await createElement<HTMLElement>('ankh-ripple', container);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
