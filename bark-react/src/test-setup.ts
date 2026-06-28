import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// Every test starts with a clean localStorage so the store is fresh.
beforeEach(() => {
  localStorage.clear();
});
