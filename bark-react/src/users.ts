import { testUsers } from './data/testUsers';
import { load, save } from './storage';
import type { User } from './types';

export function getAllUsers(): User[] {
  return testUsers;
}

export function getUserById(id: string): User | null {
  return testUsers.find((u) => u.id === id) ?? null;
}

export function searchUsers(query: string): User[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return testUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q),
  );
}

export function getUserLocation(userId: string): string {
  const store = load();
  if (store.userLocations[userId] !== undefined) return store.userLocations[userId];
  return testUsers.find((u) => u.id === userId)?.location ?? '';
}

export function setUserLocation(userId: string, location: string): void {
  const store = load();
  store.userLocations[userId] = location.trim();
  save(store);
}
