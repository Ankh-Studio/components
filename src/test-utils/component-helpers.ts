/**
 * Shared test utilities for Stencil component testing with Vitest
 */
import { vi } from 'vitest';

/**
 * Waits for the next animation frame, allowing components to hydrate
 */
export const waitForHydration = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Waits for a specified number of milliseconds
 */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a mock Animation object for happy-dom (which doesn't support Web Animations API)
 */
export const createMockAnimation = () => ({
  cancel: vi.fn(),
  finish: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  onfinish: null,
  oncancel: null,
  finished: Promise.resolve(),
});

/**
 * Polyfills Element.prototype.animate for happy-dom testing.
 * Returns a cleanup function to restore the original.
 */
export const polyfillAnimate = (mockAnimation = createMockAnimation()) => {
  const original = Element.prototype.animate;
  Element.prototype.animate = vi.fn().mockReturnValue(mockAnimation) as typeof Element.prototype.animate;

  return {
    mockAnimation,
    restore: () => {
      if (original) {
        Element.prototype.animate = original;
      } else {
        // @ts-expect-error - deleting polyfill if it didn't exist
        delete Element.prototype.animate;
      }
    },
  };
};

/**
 * Creates a component element with attributes and appends it to a container
 */
export const createElement = async <T extends HTMLElement>(
  tag: string,
  container: HTMLElement,
  attrs: Record<string, string> = {}
): Promise<T> => {
  const el = document.createElement(tag) as T;
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  container.appendChild(el);
  await waitForHydration();
  return el;
};

/**
 * Creates a container element attached to document.body
 * Returns cleanup function to remove the container
 */
export const createContainer = <T extends keyof HTMLElementTagNameMap = 'div'>(
  tag: T = 'div' as T
): { container: HTMLElementTagNameMap[T]; cleanup: () => void } => {
  const container = document.createElement(tag);
  document.body.appendChild(container);
  return {
    container,
    cleanup: () => container.remove(),
  };
};

/**
 * Dispatches a pointer event on an element
 */
export const dispatchPointerEvent = (
  element: HTMLElement,
  type: 'pointerenter' | 'pointerleave' | 'pointerdown' | 'pointerup' | 'pointercancel',
  options: Partial<PointerEventInit> = {}
): void => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      isPrimary: true,
      pointerType: 'mouse',
      ...options,
    })
  );
};

/**
 * Dispatches a focus event on an element
 */
export const dispatchFocusEvent = (
  element: HTMLElement,
  type: 'focusin' | 'focusout',
  options: Partial<FocusEventInit> = {}
): void => {
  element.dispatchEvent(
    new FocusEvent(type, {
      bubbles: true,
      ...options,
    })
  );
};
