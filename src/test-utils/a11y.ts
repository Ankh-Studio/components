import { expect } from 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';
import * as matchers from 'vitest-axe/matchers';

declare module 'vitest' {
  interface Assertion extends AxeMatchers {}
}

expect.extend(matchers);
