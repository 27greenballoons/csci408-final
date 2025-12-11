// vitest.setup.js

// Extends Vitest's expect with DOM matchers (like toBeInTheDocument)
// This requires installing: @testing-library/jest-dom
import '@testing-library/jest-dom';

// Cleans up the DOM after each test to prevent pollution
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});