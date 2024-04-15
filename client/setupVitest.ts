import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();


// Add the setup file to your vitest config:
// In your package.json
// "test": {
//   "setupFiles": [
//     "./setupVitest.js"
//   ]
// }