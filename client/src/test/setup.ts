import { expect, afterEach, vitest } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

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
