// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import '@/test-utils/a11y';
import { createElement, createContainer } from '@/test-utils';
import './ankh-button.js';

describe('ankh-button accessibility', () => {
  let container: HTMLDivElement;
  let cleanup: () => void;

  const createButton = async (attrs: Record<string, string> = {}, content?: string) => {
    const el = await createElement<HTMLElement>('ankh-button', container, attrs, content);
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

  it('has no axe violations with default props', async () => {
    const { el } = await createButton({}, 'Click me');
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when disabled', async () => {
    const { el } = await createButton({ disabled: 'true' }, 'Disabled');
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it.each(['filled', 'outlined', 'text', 'elevated', 'tonal'] as const)(
    'has no axe violations for variant="%s"',
    async (variant) => {
      const { el } = await createButton({ variant }, 'Click me');
      const results = await axe(el);
      expect(results).toHaveNoViolations();
    }
  );
});
