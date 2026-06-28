// Persistence layer: loads, saves, and resets state in localStorage.
//
// Also exports a simple subscribe/notify pub-sub so components can
// re-render when storage changes (see useStoreVersion.ts).

import type { Store } from './types';

const STORAGE_KEY = 'bark-store';

const subscribers = new Set<() => void>();

export function subscribe(callback: () => void): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function notify(): void {
  for (const cb of subscribers) cb();
}

function emptyStore(): Store {
  return { currentUserId: null, follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {}, walks: [] };
}

export function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return { ...emptyStore(), ...JSON.parse(raw) };
  } catch {
    return emptyStore();
  }
}

export function save(state: Store): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  notify();
}

export function reset(): void {
  save(emptyStore());
}
