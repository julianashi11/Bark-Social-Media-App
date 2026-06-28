// Tracks which test user is "logged in".
// There is no auth — picking a user just records who you are.

import { load, save } from './storage';
import { getUserById } from './users';
import type { User } from './types';

export function setCurrentUser(userId: string | null): void {
  const store = load();
  store.currentUserId = userId;
  save(store);
}

export function getCurrentUserId(): string | null {
  return load().currentUserId;
}

export function getCurrentUser(): User | null {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUserById(id);
}

export function clearCurrentUser(): void {
  setCurrentUser(null);
}
