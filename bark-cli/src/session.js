// Tracks which test user is "logged in".
// There is no auth in Bark — picking a user just records who you are.

import { load, save } from './storage.js';
import { getUserById } from './users.js';

export function setCurrentUser(userId) {
  const store = load();
  store.currentUserId = userId;
  save(store);
}

export function getCurrentUserId() {
  return load().currentUserId;
}

export function getCurrentUser() {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUserById(id) || null;
}

export function clearCurrentUser() {
  setCurrentUser(null);
}
