// Persistence layer: loads, saves, and resets bark-store.json.
//
// The store has three fields:
//   - currentUserId: who you are "logged in" as (set on startup)
//   - follows:       { [followerId]: [followedId, followedId, ...] }
//   - userPosts:     posts you have created during use of the app
//
// Test users and seed posts are NOT in storage — they live in
// src/data/testUsers.js and are read-only.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PATH = path.join(__dirname, '..', 'bark-store.json');

let storePath = DEFAULT_PATH;

// Used by tests so they don't clobber the real store file.
export function setStorePath(p) {
  storePath = p;
}

export function getStorePath() {
  return storePath;
}

function emptyStore() {
  return { currentUserId: null, follows: {}, userPosts: [] };
}

export function load() {
  try {
    const raw = fs.readFileSync(storePath, 'utf-8');
    const parsed = JSON.parse(raw);
    // Defensive: fill in missing fields if a partial store is on disk.
    return { ...emptyStore(), ...parsed };
  } catch {
    return emptyStore();
  }
}

export function save(state) {
  fs.writeFileSync(storePath, JSON.stringify(state, null, 2));
}

export function reset() {
  save(emptyStore());
}
