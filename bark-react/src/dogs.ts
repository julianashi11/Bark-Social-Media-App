// Read-only operations on the static test dogs (one per user).

import { testDogs } from './data/testUsers';
import type { Dog } from './types';

export function getAllDogs(): Dog[] {
  return testDogs;
}

export function getDogByOwner(userId: string): Dog | null {
  return testDogs.find((d) => d.ownerId === userId) ?? null;
}
