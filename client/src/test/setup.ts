
import { expect, afterEach, vitest, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

import '../../global.d.ts';
import '../../global';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});


const intersectionObserverMock = () => ({
  observe: () => null,
});
window.IntersectionObserver = vitest
  .fn()
  .mockImplementation(intersectionObserverMock);

// setupTests.js
const myLocalStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};

(global as any).myLocalStorage = myLocalStorageMock;

