// Read-only operations on test users.
// There are no "real" users in Bark — every user is a static test user
// from src/data/testUsers.js. Logging in just picks which one you are.

import { testUsers } from './data/testUsers.js';

export function getAllUsers() {
  return testUsers;
}

export function getUserById(id) {
  return testUsers.find((u) => u.id === id) || null;
}

export function searchUsers(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return testUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q)
  );
}
