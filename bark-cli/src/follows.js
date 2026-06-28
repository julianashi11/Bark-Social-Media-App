// One-way follow model (Twitter-style).
// store.follows: { [followerId]: [followedId, followedId, ...] }
//
// Extension idea: mutual friendship (both sides must accept) — see EXTENSIONS.md.

import { load, save } from './storage.js';

export function isFollowing(followerId, followedId) {
  const list = load().follows[followerId] || [];
  return list.includes(followedId);
}

export function follow(followerId, followedId) {
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

export function unfollow(followerId, followedId) {
  const store = load();
  const list = store.follows[followerId] || [];
  store.follows[followerId] = list.filter((id) => id !== followedId);
  save(store);
}

export function getFollowing(followerId) {
  return load().follows[followerId] || [];
}
