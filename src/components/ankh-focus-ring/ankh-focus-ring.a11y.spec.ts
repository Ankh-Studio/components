// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createElement, createContainer } from '../../test-utils';
import './ankh-focus-ring.js';

describe('ankh-focus-ring accessibility', () => {
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
    await createElement<HTMLElement>('ankh-focus-ring', container);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
