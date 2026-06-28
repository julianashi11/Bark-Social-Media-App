// One-way follow model (Twitter-style).
// store.follows: { [followerId]: [followedId, followedId, ...] }
//
// Extension idea: mutual friendship (both sides must accept) — see EXTENSIONS.md.

import { load, save } from './storage';

export function isFollowing(followerId: string, followedId: string): boolean {
  const list = load().follows[followerId] || [];
  return list.includes(followedId);
}

export function follow(followerId: string, followedId: string): void {
  if (!followerId || !followedId) {
    throw new Error('follow: both followerId and followedId are required');
  }
  if (followerId === followedId) {
    throw new Error('follow: cannot follow yourself');
  }
  const store = load();
  const list = store.follows[followerId] || [];
  if (!list.includes(followedId)) {
    list.push(followedId);
  }
  store.follows[followerId] = list;
  save(store);
}

export function unfollow(followerId: string, followedId: string): void {
  const store = load();
  const list = store.follows[followerId] || [];
  store.follows[followerId] = list.filter((id) => id !== followedId);
  save(store);
}

export function getFollowing(followerId: string): string[] {
  return load().follows[followerId] || [];
}

export function getFollowingCount(userId: string): number {
  return (load().follows[userId] || []).length;
}

export function getFollowerCount(userId: string): number {
  return Object.values(load().follows).filter((list) => list.includes(userId)).length;
}
